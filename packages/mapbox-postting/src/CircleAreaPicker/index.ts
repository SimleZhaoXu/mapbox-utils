import mapboxgl from 'mapbox-gl'
import AnyLayer from '../AnyLayer'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import { bindAll, defaultStrokeStyle, defaultFillStyle } from '../utils/index'

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

type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
  [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]]
}

interface Event<T> {
  type: string
  target: T
}

interface FinishEvent<T> extends Event<T> {
  data: GeoJSON.Feature<GeoJSON.Polygon>
  center: number
  radius: number
  acreage: number
}

interface EventType<T> {
  finish: FinishEvent<T>
}

interface StyleOptions {
  fill?: mapboxgl.FillPaint
  stroke?: mapboxgl.LinePaint
}

type StrokeData =
  | GeoJSON.FeatureCollection<GeoJSON.LineString>
  | GeoJSON.Feature<GeoJSON.LineString>

type FillData = GeoJSON.FeatureCollection<GeoJSON.Polygon> | GeoJSON.Feature<GeoJSON.Polygon>

interface Options {
  steps?: number
  style?: Style
  finishedStyle?: Style
}

export default class CircleAreaPicker extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _id: string
  private _strokeLayer?: AnyLayer<'line'>
  private _fillLayer?: AnyLayer<'fill'>
  private _strokeCoordinates: Array<number[]>
  private _fillCoordinates: Array<number[]>
  private _picking: boolean
  private _finished: boolean
  private _data: null | GeoJSON.Feature<GeoJSON.Polygon>
  private _center: Array<number> | null
  private _radius: number | null
  private _steps: number
  private _style: StyleOptions
  private _finishedStyle: StyleOptions
  constructor(options?: Options) {
    super()
    this._id = nanoid()
    this._initState()
    this._initStyle(options?.style)
    this._initFinishedStyle(options?.finishedStyle)
    this._steps = options?.steps || 64
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

  private _removeLayer() {
    this._strokeLayer?.remove()
    this._fillLayer?.remove()
    this._strokeLayer = undefined
    this._fillLayer = undefined
  }

  private _initState() {
    this._center = null
    this._radius = null
    this._data = null
    this._strokeCoordinates = []
    this._fillCoordinates = []
    this._picking = false
    this._finished = false
  }

  private _getStyle(style: Style = {}) {
    const stroke = Object.create(null)
    const fill = Object.create(null)
    const keyList = Object.keys(style) as Array<keyof Style>
    keyList.forEach((key) => {
      if (fillPaintKeys.includes(key as (typeof fillPaintKeys)[number])) {
        fill[key] = style[key]
      } else if (strokePaintKeys.includes(key as (typeof strokePaintKeys)[number])) {
        stroke[key.replace('stroke', 'line')] = style[key]
      }
    })
    return { fill, stroke }
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
      }
    }
  }

  private _initLayer(style: StyleOptions) {
    this._strokeLayer?.remove()
    this._fillLayer?.remove()

    this._fillLayer = new AnyLayer({
      id: `circle-area-picker-fill-${this._id}`,
      type: 'fill',
      data: this._getFillSourceData(),
      paint: style.fill
    })
    this._strokeLayer = new AnyLayer({
      id: `circle-area-picker-stroke-${this._id}`,
      type: 'line',
      data: this._getStrokeSourceData(),
      paint: style.stroke
    })
    this._fillLayer?.addTo(this._map!)
    this._strokeLayer?.addTo(this._map!)
  }

  private _getStrokeSourceData(): StrokeData {
    if (this._strokeCoordinates.length > 1) {
      return turf.featureCollection([turf.lineString(this._strokeCoordinates)])
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
    this._center = e.lngLat.toArray()
    e.preventDefault()
  }

  private _onMouseUp() {
    if (this._finished) return
    this._picking = false
    if (!this._fillCoordinates.length) return
    this._finished = true
    this._setFinishedStyle()
    this.fire('finish', {
      data: turf.clone(this._data!),
      center: [...this._center!],
      radius: this._radius,
      acreage: turf.area(this._data!)
    })
  }

  private _onMapDoubleClick(e: mapboxgl.MapMouseEvent) {
    e.preventDefault()
  }

  private _onMouseMove(e: mapboxgl.MapMouseEvent) {
    if (this._finished || !this._picking) return
    const options = {
      units: 'kilometers' as const
    }
    this._radius = turf.distance(this._center!, e.lngLat.toArray(), options)
    const circle = turf.circle(this._center!, this._radius, {
      ...options,
      steps: this._steps
    })
    if (turf.area(circle) === 0) {
      this._fillCoordinates = []
      this._strokeCoordinates = []
    } else {
      this._fillCoordinates = [...circle.geometry.coordinates[0]]
      this._strokeCoordinates = [...this._fillCoordinates]
    }
    this._updateStroke()
    this._updateFill()
  }

  private _updateStroke() {
    this._strokeLayer?.setData(this._getStrokeSourceData())
  }

  private _updateFill() {
    this._data = this._getFillSourceData() as GeoJSON.Feature<GeoJSON.Polygon>
    this._fillLayer?.setData(turf.clone(this._data))
  }

  private _setFinishedStyle() {
    this._initLayer(this._finishedStyle)
  }
}
