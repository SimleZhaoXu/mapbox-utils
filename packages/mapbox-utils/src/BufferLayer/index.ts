import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import { circlePaintKeys, symbolPaintKeys, symbolLayoutKeys } from '../utils/style'
import AnyLayer from '../AnyLayer'
import { bindAll } from '../utils/index'

const defaultCircleStyle: CircleStyle = {
  'circle-color': '#f00',
  'circle-radius': 5,
  'circle-pitch-alignment': 'map',
  'circle-pitch-scale': 'map'
}

const defaultSymbolStyle: SymbolStyle = {
  'icon-allow-overlap': true,
  'icon-ignore-placement': true,
  'icon-pitch-alignment': 'map',
  'icon-rotation-alignment': 'map'
}

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

const units = ['meters', 'kilometers'] as const
type Units = (typeof units)[number]

interface Event<T> {
  type: string
  target: T
}

interface ChangeEvent<T> extends Event<T> {
  center: mapboxgl.LngLat
  radius: number
  units: Units
  buffer: GeoJSON.Feature<GeoJSON.Polygon>
}
export interface EventType<T> {
  change: ChangeEvent<T>
}

type CircleStyle = Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]>

type SymbolStyle = Pick<
  mapboxgl.SymbolLayout & mapboxgl.SymbolPaint,
  (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]
>

interface CircleCarOptions {
  show?: boolean
  type?: 'circle'
  style?: CircleStyle
}

interface SymbolCarOptions {
  show?: boolean
  type: 'symbol'
  style?: SymbolStyle
}

type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
  [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]]
}

type BufferData = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon>
type CenterData = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.FeatureCollection<GeoJSON.Point>
interface Options {
  center?: number[]
  radius?: number
  units?: Units
  steps?: number
  manual?: boolean
  centerLayer?: CircleCarOptions | SymbolCarOptions
  style: Style
}

export default class BufferLayer extends mapboxgl.Evented {
  private _id: string
  private _strokeLayer?: AnyLayer<'line'>
  private _fillLayer: AnyLayer<'fill'>
  private _centerLayer?: AnyLayer<'circle' | 'symbol'>
  private _map?: mapboxgl.Map
  private _center: number[] | undefined
  private _radius: number
  private _units: Units
  private _steps: number
  private _manual: boolean
  private _style: {
    stroke: mapboxgl.LinePaint
    fill: mapboxgl.FillPaint
  }
  private _bufferData: BufferData
  private _centerData: CenterData
  constructor(options: Options) {
    super()
    this._id = nanoid()
    this._center = options?.center
    this._radius = options?.radius && options.radius > 0 ? options.radius : 5
    this._units = options?.units && units.includes(options.units) ? options.units : 'kilometers'
    this._steps = options?.steps && options.steps > 2 ? options.steps : 64
    this._manual = options.manual ?? false
    this._initData()
    this._initStyle(options.style)
    this._initLayer(
      options.centerLayer
        ? { show: true, type: 'circle', ...options.centerLayer }
        : { show: true, type: 'circle' }
    )
    bindAll(['_onMapClick'], this)
  }

  get center() {
    return this._center
  }

  get radius() {
    return this._radius
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
    this._strokeLayer?.addTo(map).setData(this._bufferData)
    this._fillLayer?.addTo(map).setData(this._bufferData)
    this._centerLayer?.addTo(map).setData(this._centerData)
    if (this._manual) {
      this._map.on('click', this._onMapClick)
      this._map.getCanvas().style.cursor = 'crosshair'
    }
    return this
  }

  remove() {
    if (this._map) {
      this._strokeLayer?.remove()
      this._fillLayer?.remove()
      this._centerLayer?.remove()
      if (this._manual) {
        this._map.off('click', this._onMapClick)
        this._map.getCanvas().style.cursor = ''
      }
      this._map = undefined
    }
    return this
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  clear() {
    this._center = undefined
    this._update()
    return this
  }

  setOptions(options: { center?: number[]; radius?: number; units?: Units; steps?: number }) {
    options.center && (this._center = options.center)
    options.radius && (this._radius = options.radius)
    options.units && units.includes(options.units) && (this._units = options.units)
    options.steps && options.steps > 2 && (this._steps = options.steps)
    this._update()
    return this
  }

  getData() {
    if (this._center) {
      return turf.clone(this._bufferData)
    }
    return null
  }

  private _initStyle(style: Style = {}) {
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
    this._style = { fill, stroke }
  }

  private _getCirclePaint(style: CircleStyle) {
    const paint = Object.create(null)
    const keyList = Object.keys(style) as Array<(typeof circlePaintKeys)[number]>
    keyList.forEach((key) => {
      if (circlePaintKeys.includes(key)) {
        paint[key] = style[key]
      }
    })
    return paint
  }

  private _getSymbolStyle(style: SymbolStyle) {
    const paint = Object.create(null)
    const layout = Object.create(null)
    const keyList = Object.keys(style) as Array<
      (typeof symbolLayoutKeys)[number] | (typeof symbolPaintKeys)[number]
    >
    keyList.forEach((key) => {
      if (symbolLayoutKeys.includes(key as any)) {
        layout[key] = style[key]
      } else if (symbolPaintKeys.includes(key as any)) {
        paint[key] = style[key]
      }
    })
    layout['visibility'] = 'visible'

    return {
      paint,
      layout
    }
  }

  private _initLayer(centerLayer: NonNullable<Options['centerLayer']>) {
    this._fillLayer = new AnyLayer({
      id: `buffer-fill-${this._id}`,
      type: 'fill',
      paint: this._style.fill
    })

    this._strokeLayer = new AnyLayer({
      id: `buffer-stroke-${this._id}`,
      type: 'line',
      paint: this._style.stroke
    })

    if (centerLayer.show && centerLayer.type !== 'symbol') {
      this._centerLayer = new AnyLayer({
        id: `buffer-center-${this._id}`,
        type: 'circle',
        paint: this._getCirclePaint({
          ...defaultCircleStyle,
          ...(centerLayer?.style ?? {})
        })
      })
    }
    if (centerLayer.show && centerLayer.type === 'symbol') {
      this._centerLayer = new AnyLayer({
        id: `buffer-center-${this._id}`,
        type: 'symbol',
        ...this._getSymbolStyle({
          ...defaultSymbolStyle,
          ...(centerLayer.style ?? {})
        })
      })
    }
  }

  private _onMapClick(e: mapboxgl.MapLayerMouseEvent) {
    this._center = e.lngLat.toArray()
    this._update()
    this.fire('change', {
      center: e.lngLat,
      radius: this._radius,
      units: this._units,
      buffer: turf.clone(this._bufferData)
    })
  }

  private _update() {
    this._initData()
    this._fillLayer?.setData(this._bufferData)
    this._strokeLayer?.setData(this._bufferData)
    this._centerLayer?.setData(this._centerData)
  }

  private _initData() {
    if (this._center) {
      this._centerData = turf.point(this._center)
      this._bufferData = turf.circle(this._center, this._radius, {
        units: this._units,
        steps: this._steps
      })
    } else {
      this._centerData = turf.featureCollection([])
      this._bufferData = turf.featureCollection([])
    }
  }
}
