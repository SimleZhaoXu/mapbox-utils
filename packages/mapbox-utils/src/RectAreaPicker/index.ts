import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import AnyLayer from '../AnyLayer'
import { bindAll, defaultVertexStyle, defaultStrokeStyle, defaultFillStyle } from '../utils/index'

const fillPaintKeys = ['fill-opacity', 'fill-color'] as const

const strokePaintKeys = [
  'stroke-opacity',
  'stroke-color',
  'stroke-width',
  'stroke-blur',
  'stroke-dasharray'
] as const

type StrokeKeyMap = {
  'stroke-color': 'line-color'
  'stroke-opacity': 'line-opacity'
  'stroke-width': 'line-width'
  'stroke-blur': 'line-blur'
  'stroke-dasharray': 'line-dasharray'
}

const vertexPaintKeys = [
  'vertex-radius',
  'vertex-color',
  'vertex-opacity',
  'vertex-stroke-width',
  'vertex-stroke-color',
  'vertex-stroke-opacity'
] as const

type VertexKeyMap = {
  'vertex-radius': 'circle-radius'
  'vertex-color': 'circle-color'
  'vertex-opacity': 'circle-opacity'
  'vertex-stroke-width': 'circle-stroke-width'
  'vertex-stroke-color': 'circle-stroke-color'
  'vertex-stroke-opacity': 'circle-stroke-opacity'
}

type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
  [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]]
} & {
  [key in (typeof vertexPaintKeys)[number]]?: mapboxgl.CirclePaint[VertexKeyMap[key]]
}

interface Event<T> {
  type: string
  target: T
}

interface FinishEvent<T> extends Event<T> {
  data: GeoJSON.Feature<GeoJSON.Polygon>
  acreage: number
}

interface EventType<T> {
  finish: FinishEvent<T>
}

interface StyleOptions {
  fill?: mapboxgl.FillPaint
  stroke?: mapboxgl.LinePaint
  vertex?: mapboxgl.CirclePaint
}

type VertexData = GeoJSON.FeatureCollection<GeoJSON.Point>

type StrokeData =
  | GeoJSON.FeatureCollection<GeoJSON.LineString>
  | GeoJSON.Feature<GeoJSON.LineString>

type FillData = GeoJSON.FeatureCollection<GeoJSON.Polygon> | GeoJSON.Feature<GeoJSON.Polygon>

interface Options {
  style?: Style
  finishedStyle?: Style
}

export default class RectAreaPicker extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _id: string
  private _vertexLayer?: AnyLayer<'circle'>
  private _strokeLayer?: AnyLayer<'line'>
  private _fillLayer?: AnyLayer<'fill'>
  private _vertexList: Array<number[]>
  private _strokeCoordinates: Array<number[]>
  private _fillCoordinates: Array<number[]>
  private _picking: boolean
  private _finished: boolean
  private _nw: Array<number> | null
  private _se: Array<number> | null
  private _data: null | GeoJSON.Feature<GeoJSON.Polygon>
  private _style: StyleOptions
  private _finishedStyle: StyleOptions
  constructor(options?: Options) {
    super()
    this._id = nanoid()
    this._initState()
    this._initStyle(options?.style)
    this._initFinishedStyle(options?.finishedStyle)
    bindAll(['_onMapDoubleClick', '_onMouseMove', '_onMouseDown', '_onMouseUp'], this)
  }

  get isOnMap() {
    return Boolean(this._map)
  }

  addTo(map: mapboxgl.Map) {
    if (map === this._map) {
      return this
    }
    this.remove()
    this._map = map
    this._initLayer(this._style)
    this._setEventListeners('on')
    this._map.getCanvas().style.cursor = 'crosshair'
    return this
  }

  remove() {
    if (this._map) {
      this._setEventListeners('off')
      this._initState()
      this._removeLayer()
      this._map.getCanvas().style.cursor = ''
      this._map = undefined
    }
    return this
  }

  clear() {
    if (!this._map) return
    this._initState()
    this._initLayer(this._style)
  }

  getData() {
    if (!this._finished) return null
    return this._data ? turf.clone(this._data) : null
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  private _initLayer(style: StyleOptions) {
    this._vertexLayer?.remove()
    this._strokeLayer?.remove()
    this._fillLayer?.remove()
    this._vertexLayer = new AnyLayer({
      id: `rect-area-picker-vertex-${this._id}`,
      type: 'circle',
      layerCursor: 'pointer',
      mapCursor: 'crosshair',
      data: this._getVertexSourceData(),
      paint: style.vertex
    })

    this._strokeLayer = new AnyLayer({
      id: `rect-area-picker-stroke-${this._id}`,
      type: 'line',
      data: this._getStrokeSourceData(),
      paint: style.stroke
    })

    this._fillLayer = new AnyLayer({
      id: `rect-area-picker-fill-${this._id}`,
      type: 'fill',
      data: this._getFillSourceData(),
      paint: style.fill
    })
    this._fillLayer?.addTo(this._map!)
    this._strokeLayer?.addTo(this._map!)
    this._vertexLayer?.addTo(this._map!)
  }

  private _getStyle(style: Style = {}) {
    const vertex = Object.create(null)
    const stroke = Object.create(null)
    const fill = Object.create(null)
    const keyList = Object.keys(style) as Array<keyof Style>
    keyList.forEach((key) => {
      if (fillPaintKeys.includes(key as (typeof fillPaintKeys)[number])) {
        fill[key] = style[key]
      } else if (strokePaintKeys.includes(key as (typeof strokePaintKeys)[number])) {
        stroke[key.replace('stroke', 'line')] = style[key]
      } else if (vertexPaintKeys.includes(key as (typeof vertexPaintKeys)[number])) {
        vertex[key.replace('vertex', 'circle')] = style[key]
      }
    })
    return { fill, stroke, vertex }
  }

  private _initStyle(style: Style = {}) {
    const style1 = this._getStyle(style)
    this._style = {
      fill: {
        ...defaultFillStyle,
        ...style1.fill
      },
      stroke: {
        ...defaultStrokeStyle,
        ...style1.stroke
      },
      vertex: {
        ...defaultVertexStyle,
        ...style1.vertex,
        'circle-pitch-alignment': 'map'
      }
    }
  }

  private _initFinishedStyle(finishedStyle: Style = {}) {
    const style = this._getStyle(finishedStyle)
    this._finishedStyle = {
      fill: {
        ...this._style.fill,
        ...style.fill
      },
      stroke: {
        ...this._style.stroke,
        'line-dasharray': [1, 0],
        ...style.stroke
      },
      vertex: {
        ...this._style.vertex,
        ...style.vertex
      }
    }
  }

  private _removeLayer() {
    this._vertexLayer?.remove()
    this._strokeLayer?.remove()
    this._fillLayer?.remove()
    this._vertexLayer = undefined
    this._strokeLayer = undefined
    this._fillLayer = undefined
  }

  private _initState() {
    this._nw = null
    this._se = null
    this._data = null
    this._vertexList = []
    this._strokeCoordinates = []
    this._fillCoordinates = []
    this._picking = false
    this._finished = false
  }

  private _getVertexSourceData(): VertexData {
    return turf.featureCollection(
      this._vertexList.map((vertex, index) => {
        return turf.point(vertex, { id: index })
      })
    )
  }

  private _getStrokeSourceData(): StrokeData {
    if (this._strokeCoordinates.length > 1) {
      return turf.lineString(this._strokeCoordinates)
    } else {
      return turf.featureCollection([])
    }
  }

  private _getFillSourceData(): FillData {
    if (this._fillCoordinates.length > 3) {
      return turf.polygon([this._fillCoordinates])
    } else {
      return turf.featureCollection([])
    }
  }

  private _setEventListeners(type: 'on' | 'off' = 'on') {
    this._map![type]('dblclick', this._onMapDoubleClick)
    this._map![type]('mousedown', this._onMouseDown)
    this._map![type]('mouseup', this._onMouseUp)
    this._map![type]('mousemove', this._onMouseMove)
  }

  private _onMouseDown(e: mapboxgl.MapMouseEvent) {
    if (this._finished) return
    this._picking = true
    this._nw = e.lngLat.toArray()
    e.preventDefault()
  }

  private _onMouseUp() {
    if (this._finished) return
    this._picking = false
    if (!this._vertexList.length) return
    this._finished = true
    this._setFinishedStyle()
    this.fire('finish', {
      data: turf.clone(this._data!),
      acreage: turf.area(this._data!)
    })
  }

  private _onMapDoubleClick(e: mapboxgl.MapMouseEvent) {
    e.preventDefault()
  }

  private _onMouseMove(e: mapboxgl.MapMouseEvent) {
    if (this._finished || !this._picking) return
    this._se = e.lngLat.toArray()
    const polygon = turf.bboxPolygon(turf.bbox(turf.lineString([this._nw!, this._se])))
    if (turf.area(polygon) === 0) {
      this._fillCoordinates = []
      this._strokeCoordinates = []
      this._vertexList = []
    } else {
      this._fillCoordinates = [...polygon.geometry.coordinates[0]]
      this._strokeCoordinates = [...this._fillCoordinates]
      this._vertexList = this._fillCoordinates.slice(0, -1)
    }

    this._updateVertex()
    this._updateStroke()
    this._updateFill()
  }

  private _updateStroke() {
    this._strokeLayer?.setData(this._getStrokeSourceData())
  }

  private _updateVertex() {
    this._vertexLayer?.setData(this._getVertexSourceData())
  }
  private _updateFill() {
    this._data = this._getFillSourceData() as GeoJSON.Feature<GeoJSON.Polygon>
    this._fillLayer?.setData(turf.clone(this._data))
  }

  private _setFinishedStyle() {
    this._initLayer(this._finishedStyle)
  }
}
