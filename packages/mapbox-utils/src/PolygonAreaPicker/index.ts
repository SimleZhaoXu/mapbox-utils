import mapboxgl from 'mapbox-gl'
import AnyLayer from '../AnyLayer'
import { nanoid } from 'nanoid'
import * as turf from '@turf/turf'
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
  data: GeoJSON.Feature<GeoJSON.MultiPolygon>
  acreage: number
}

interface EventType<T> {
  finish: FinishEvent<T>
}

interface StyleOptions {
  fill: mapboxgl.FillPaint
  stroke: mapboxgl.LinePaint
  vertex: mapboxgl.CirclePaint
}

type VertexData = GeoJSON.FeatureCollection<GeoJSON.Point>

type StrokeData =
  | GeoJSON.FeatureCollection<GeoJSON.LineString>
  | GeoJSON.Feature<GeoJSON.LineString>

type FillData =
  | GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>
  | GeoJSON.Feature<GeoJSON.MultiPolygon>

interface Options {
  enableEnter?: boolean
  enableBackspace?: boolean
  style?: Style
  finishedStyle?: Style
}

export default class PolygonAreaPicker extends mapboxgl.Evented {
  private _id: string
  private _map?: mapboxgl.Map
  private _enableEnter: boolean
  private _enableBackspace: boolean
  private _vertexLayer?: AnyLayer<'circle'>
  private _strokeLayer?: AnyLayer<'line'>
  private _fillLayer?: AnyLayer<'fill'>
  private _vertexList: Array<number[]>
  private _strokeCoordinates: Array<number[]>
  private _fillCoordinates: Array<number[]>
  private _picking: boolean
  private _pending: boolean
  private _finished: boolean
  private _preFinished: boolean
  private _mouseOnVertex: boolean
  private _data: null | GeoJSON.Feature<GeoJSON.MultiPolygon>
  private _style: StyleOptions
  private _finishedStyle: StyleOptions
  constructor(options?: Options) {
    super()
    this._id = nanoid()
    this._initState()
    this._initStyle(options?.style)
    this._initFinishedStyle(options?.finishedStyle)
    this._enableBackspace = options?.enableBackspace ?? false
    this._enableEnter = options?.enableEnter ?? false
    bindAll(
      [
        '_onMapClick',
        '_onMapDoubleClick',
        '_onMapMouseMove',
        '_onKeyup',
        '_onVertexMouseMove',
        '_onVertexMouseLeave'
      ],
      this
    )
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
    return turf.clone(this._data!)
  }

  // TODO: 待优化
  // backspace() {
  //   if (this._finished || !this._picking) return
  //   if (this._vertexList.length > 1) {
  //     this._vertexList = [...this._vertexList.slice(0, -1)]
  //     const last = this._strokeCoordinates[this._strokeCoordinates.length - 1]
  //     this._strokeCoordinates = [...this._vertexList, last]
  //     this._fillCoordinates = [...this._vertexList, last, this._vertexList[0]]
  //     this._updateVertex()
  //     this._updateStroke()
  //     this._updateFill()
  //   }
  // }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  private _initLayer(style: StyleOptions) {
    this._vertexLayer?.remove()
    this._strokeLayer?.remove()
    this._fillLayer?.remove()
    this._fillLayer = new AnyLayer({
      id: `polygon-area-picker-fill-${this._id}`,
      type: 'fill',
      data: this._getFillSourceData(),
      paint: style.fill
    })
    this._strokeLayer = new AnyLayer({
      id: `polygon-area-picker-stroke-${this._id}`,
      type: 'line',
      data: this._getStrokeSourceData(),
      paint: style.stroke
    })
    this._vertexLayer = new AnyLayer({
      id: `polygon-area-picker-vertex-${this._id}`,
      type: 'circle',
      data: this._getVertexSourceData(),
      layerCursor: 'pointer',
      mapCursor: 'crosshair',
      paint: style.vertex
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

  private _initState() {
    this._data = null
    this._vertexList = []
    this._strokeCoordinates = []
    this._fillCoordinates = []
    this._picking = false
    this._pending = false
    this._finished = false
    this._preFinished = true
    this._mouseOnVertex = false
  }

  private _removeLayer() {
    this._vertexLayer?.remove()
    this._strokeLayer?.remove()
    this._fillLayer?.remove()
    this._vertexLayer = undefined
    this._strokeLayer = undefined
    this._fillLayer = undefined
  }

  private _setEventListeners(type: 'on' | 'off' = 'on') {
    this._vertexLayer?.[type]('mousemove', this._onVertexMouseMove)
    this._vertexLayer?.[type]('mouseleave', this._onVertexMouseLeave)
    this._map![type]('click', this._onMapClick)
    this._map![type]('dblclick', this._onMapDoubleClick)
    this._map![type]('mousemove', this._onMapMouseMove)
    if (!this._enableBackspace && !this._enableEnter) return
    if (type === 'on') {
      window.addEventListener('keyup', this._onKeyup)
    } else {
      window.removeEventListener('keyup', this._onKeyup)
    }
  }

  private _onVertexMouseMove(e: mapboxgl.MapLayerMouseEvent) {
    if (this._finished || !this._picking) return
    const feature = e.features?.[0] as any
    this._mouseOnVertex = true
    this._handleMouseMove(this._vertexList[feature.properties.id])
  }

  private _onVertexMouseLeave() {
    if (this._finished || !this._picking) return
    this._mouseOnVertex = false
  }

  private _getIndex(lngLatList: Array<number[]>, lngLat: number[]) {
    return lngLatList.findIndex((item) => {
      return turf.booleanEqual(turf.point(item), turf.point(lngLat))
    })
  }

  private _onMapClick(e: mapboxgl.MapMouseEvent) {
    if (this._finished || this._pending) return
    if (!this._picking) {
      this._picking = true
      this._vertexList.push(e.lngLat.toArray())
      this._strokeCoordinates = [...this._vertexList]
      this._fillCoordinates = [...this._vertexList, this._vertexList[0]]
    } else {
      this._vertexList = [...this._strokeCoordinates]
      this._strokeCoordinates = [...this._fillCoordinates]
    }

    if (this._mouseOnVertex && this._preFinished) {
      this._complete()
    } else {
      this._updateVertex()
      this._updateStroke()
      this._updateFill()
      this._pending = true
      window.setTimeout(() => {
        // 避免双击时冲突
        this._pending = false
      }, 250)
    }
  }

  private _onMapDoubleClick(e: mapboxgl.MapMouseEvent) {
    e.preventDefault()
    if (this._finished || !this._picking || !this._preFinished) return
    this._complete()
  }

  private _onMapMouseMove(e: mapboxgl.MapMouseEvent) {
    if (this._finished || !this._picking || this._mouseOnVertex) return
    this._handleMouseMove(e.lngLat.toArray())
  }

  // 这一块逻辑最重要
  private _handleMouseMove(lngLat: number[]) {
    this._strokeCoordinates = [...this._vertexList]
    const index = this._getIndex(this._vertexList, lngLat)
    this._preFinished = false
    if (index === -1) {
      this._strokeCoordinates.push(lngLat)
      this._fillCoordinates = [...this._strokeCoordinates, this._strokeCoordinates[0]]
      if (this._vertexList.length > 1) {
        this._preFinished = true
      }
    } else {
      if (this._vertexList.length > 2) {
        if (index === this._vertexList.length - 1) {
          this._preFinished = true
          this._fillCoordinates = [...this._strokeCoordinates, this._vertexList[0]]
        } else if (index === 0) {
          this._preFinished = true
          this._strokeCoordinates.push(lngLat)
          this._fillCoordinates = [...this._strokeCoordinates]
        } else {
          this._preFinished = true
          this._fillCoordinates = [...this._strokeCoordinates, this._strokeCoordinates[0]]
        }
      } else {
        this._fillCoordinates = [...this._strokeCoordinates]
      }
    }
    this._updateStroke()
    this._updateFill()
  }

  private _enterComplete() {
    if (this._finished || !this._picking || !this._preFinished) return
    this._vertexList = [...this._strokeCoordinates]
    this._strokeCoordinates = [...this._fillCoordinates]
    this._complete()
  }

  private _complete() {
    this._picking = false
    this._finished = true
    this._setFinishedStyle()
    this.fire('finish', {
      data: turf.clone(this._data!),
      acreage: turf.area(this._data!)
    })
  }

  private _onKeyup(e: KeyboardEvent) {
    if (e.code === 'Backspace') {
      // this._enableBackspace && this.backspace()
    } else if (e.code === 'Enter') {
      this._enableEnter && this._enterComplete()
    }
  }

  private _updateStroke() {
    this._strokeLayer?.setData(this._getStrokeSourceData())
  }

  private _updateVertex() {
    this._vertexLayer?.setData(this._getVertexSourceData())
  }

  private _updateFill() {
    this._data = this._getFillSourceData() as GeoJSON.Feature<GeoJSON.MultiPolygon>
    this._fillLayer?.setData(turf.clone(this._data))
  }

  private _setFinishedStyle() {
    this._initLayer(this._finishedStyle)
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
      return (
        turf.combine(
          turf.unkinkPolygon(turf.polygon([this._fillCoordinates]))
        ) as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>
      ).features[0]
    } else {
      return turf.featureCollection([])
    }
  }
}
