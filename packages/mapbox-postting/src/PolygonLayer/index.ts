import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import AnyLayer from '../AnyLayer'
import { bindAll } from '../utils/index'
const fillPaintKeys = ['fill-opacity', 'fill-color', 'fill-pattern'] as const

const strokePaintKeys = [
  'stroke-opacity',
  'stroke-color',
  'stroke-width',
  'stroke-blur',
  'stroke-dasharray',
  'stroke-pattern'
] as const

type HighlightStrokeStyleKey =
  | 'stroke-color'
  | 'stroke-opacity'
  | 'stroke-pattern'
  | 'stroke-width'
  | 'stroke-blur'

type StrokeKeyMap = {
  'stroke-color': 'line-color'
  'stroke-opacity': 'line-opacity'
  'stroke-width': 'line-width'
  'stroke-blur': 'line-blur'
  'stroke-dasharray': 'line-dasharray'
  'stroke-pattern': 'line-pattern'
}
type HighlightFillStyleKey = 'fill-opacity' | 'fill-pattern' | 'fill-color'

const defaultStrokeStyle: {
  [key in HighlightStrokeStyleKey]: mapboxgl.LinePaint[StrokeKeyMap[key]]
} = {
  'stroke-opacity': 1,
  'stroke-pattern': '',
  'stroke-color': '#000000',
  'stroke-width': 1,
  'stroke-blur': 0
}

const defaultFillStyle: {
  [key in HighlightFillStyleKey]: mapboxgl.FillPaint[key]
} = {
  'fill-opacity': 1,
  'fill-pattern': '',
  'fill-color': '#000000'
}
interface Event<T> {
  type: string
  target: T
  originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData
}

interface ClickEvent<T> extends Event<T> {
  data: any
  center: mapboxgl.LngLat
  lngLatBounds: mapboxgl.LngLatBounds
}

interface MouseEvent<T> extends Event<T> {
  data: any
  center: mapboxgl.LngLat
  lngLat: mapboxgl.LngLat
}
export interface EventType<T> {
  click: ClickEvent<T>
  mouseenter: MouseEvent<T>
  mousemove: MouseEvent<T>
  mouseleave: Event<T>
}

interface HighlightOptions {
  trigger: 'click' | 'hover' | 'both'
  style: Pick<mapboxgl.FillPaint, HighlightFillStyleKey> & {
    [key in HighlightStrokeStyleKey]?: mapboxgl.LinePaint[StrokeKeyMap[key]]
  } & {
    'sort-key'?: number | mapboxgl.Expression
  }
}

type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
  [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]]
} & {
  'sort-key'?: number | mapboxgl.Expression
}

type Data = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon | GeoJSON.Polygon>

interface Options {
  key: string
  cursor?: boolean
  data: Data
  style: Style
  highlightOptions?: HighlightOptions
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}
export default class PolygonLayer extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _id: string
  private _fillLayer: AnyLayer<'fill'>
  private _strokeLayer: AnyLayer<'line'>
  private _key: string
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null
  private _fitBoundsOptions: undefined | mapboxgl.FitBoundsOptions
  private _strokePaintStyleMap: Map<string, [any, any]> = new Map()
  private _strokeLayoutStyleMap: Map<string, [any, any]> = new Map()
  private _fillPaintStyleMap: Map<string, [any, any]> = new Map()
  private _fillLayoutStyleMap: Map<string, [any, any]> = new Map()
  private _expressionMap: Map<string, () => any> = new Map()
  private _clickHighlightPropVal: undefined | string | number
  private _hoverHighlightPropVal: undefined | string | number
  private _highlightTrigger?: 'click' | 'hover' | 'both'
  constructor(options: Options) {
    super()
    this._id = nanoid()
    this._fillLayer = new AnyLayer({
      id: `polygon-fill-${this._id}`,
      type: 'fill',
      layerCursor: 'pointer',
      data: options.data,
      paint: this._getFillPaint(options.style),
      layout: {
        visibility: 'visible',
        'fill-sort-key': options?.style['sort-key'] ?? 1
      }
    })

    this._strokeLayer = new AnyLayer({
      id: `polygon-stroke-${this._id}`,
      type: 'line',
      data: options.data,
      paint: this._getStrokePaint(options.style),
      layout: {
        visibility: 'visible',
        'line-sort-key': options?.style['sort-key'] ?? 1
      }
    })

    this._key = options.key ?? 'id'
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions)
    this._setLngLatBounds(options.data)
    this._highlightTrigger = options.highlightOptions?.trigger
    if (options.highlightOptions) {
      this._initHighlight(options.style, options.highlightOptions.style)
    }
    bindAll(['_onMouseClick', '_onMouseMove', '_onMouseLeave', '_onMouseEnter'], this)
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
    this._fillLayer.addTo(map)
    this._strokeLayer.addTo(map)
    this._setEventListeners('on')
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }
    return this
  }

  remove() {
    if (this._map) {
      this._setEventListeners('off')
      this._fillLayer.remove()
      this._strokeLayer.remove()
      this.removeHighlight()
      this._map = undefined
    }
    return this
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  setData(data: Data) {
    this._setLngLatBounds(data)
    this._fillLayer.setData(data)
    this._strokeLayer.setData(data)
    if (this._map) {
      this.removeHighlight()
      if (this._fitBoundsOptions) {
        this.fitBounds(this._fitBoundsOptions)
      }
    }
    return this
  }

  setHighlight(valOfKey: string | number) {
    if (!this._map || !this._highlightTrigger) return this
    if (this._highlightTrigger === 'hover') {
      this._hoverHighlightPropVal = valOfKey
    } else {
      this._clickHighlightPropVal = valOfKey
    }
    this._setHighlight()

    return this
  }

  removeHighlight() {
    if (this._map && this._highlightTrigger) {
      this._removeHighlight()
    }
    return this
  }

  fitTo(valOfKey: string | number, options?: mapboxgl.FitBoundsOptions) {
    if (!this._map) return this
    const feature = this._getFeature(valOfKey)
    if (feature) {
      this._map.fitBounds(
        new mapboxgl.LngLatBounds(turf.bboxPolygon(turf.bbox(feature)).bbox as any),
        options || {}
      )
    }
  }

  easeTo(valOfKey: string | number, options?: Omit<mapboxgl.EaseToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(valOfKey)
    if (feature) {
      const point = turf.getCoord(turf.centroid(feature))
      this._map.easeTo({
        ...options,
        center: [point[0], point[1]]
      })
    }
    return this
  }

  flyTo(valOfKey: string | number, options?: Omit<mapboxgl.FlyToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(valOfKey)
    if (feature) {
      const point = turf.getCoord(turf.centroid(feature))
      this._map.flyTo({
        ...(options || {}),
        center: [point[0], point[1]]
      })
    }
    return this
  }

  fitBounds(options?: mapboxgl.FitBoundsOptions) {
    if (this._lngLatBounds) {
      this._map?.fitBounds(this._lngLatBounds, options || this._fitBoundsOptions || {})
    }
  }

  private _getFeature(valOfKey: string | number) {
    return this._fillLayer.queryFeatureFormData(this._key, valOfKey)
  }

  private _setLngLatBounds(data: Data) {
    this._lngLatBounds =
      data.features.length > 0
        ? (turf.bboxPolygon(turf.bbox(data)).bbox as mapboxgl.LngLatBoundsLike)
        : null
  }

  private _getFitBoundsOptions(
    options?: boolean | mapboxgl.FitBoundsOptions
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _getFillPaint(style: Options['style']) {
    const paint = Object.create(null)
    const keyList = Object.keys(style) as Array<(typeof fillPaintKeys)[number]>
    keyList.forEach((key) => {
      if (fillPaintKeys.includes(key)) {
        paint[key] = style[key]
      }
    })
    return paint
  }

  private _getStrokePaint(style: Options['style']) {
    const paint = Object.create(null)
    const keyList = Object.keys(style) as Array<(typeof strokePaintKeys)[number]>
    keyList.forEach((key) => {
      if (strokePaintKeys.includes(key)) {
        paint[key.replace('stroke', 'line')] = style[key]
      }
    })
    return paint
  }

  private _setEventListeners(type: 'on' | 'off' = 'on') {
    this._fillLayer[type]('click', this._onMouseClick)
    this._fillLayer[type]('mousemove', this._onMouseMove)
    this._fillLayer[type]('mouseleave', this._onMouseLeave)
    this._fillLayer[type]('mouseenter', this._onMouseEnter)
  }

  private _onMouseClick(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features![0] as any
    const fullFeature = this._getFeature(feature.properties[this._key])!
    const point = turf.getCoord(turf.centroid(fullFeature))
    const center = new mapboxgl.LngLat(point[0], point[1])
    const bbox: any = turf.bboxPolygon(turf.bbox(fullFeature)).bbox!
    this.fire('click', {
      center,
      data: { ...feature.properties },
      lngLatBounds: new mapboxgl.LngLatBounds(bbox),
      originalMapEvent: e
    })
    if (this._highlightTrigger === 'click' || this._highlightTrigger === 'both') {
      const propVal = feature.properties[this._key]
      if (this._clickHighlightPropVal !== propVal) {
        this._clickHighlightPropVal = propVal
        this._setHighlight()
      }
    }
  }

  private _onMouseMove(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features?.[0] as any
    const fullFeature = this._getFeature(feature.properties[this._key])!
    const point = turf.getCoord(turf.centroid(fullFeature))
    const center = new mapboxgl.LngLat(point[0], point[1])
    this.fire('mousemove', {
      center,
      data: { ...feature.properties },
      lngLat: e.lngLat,
      originalMapEvent: e
    })
    if (this._highlightTrigger === 'hover' || this._highlightTrigger === 'both') {
      const propVal = e.features![0].properties![this._key]
      if (this._hoverHighlightPropVal !== propVal) {
        this._hoverHighlightPropVal = propVal
        this._setHighlight()
      }
    }
  }

  private _onMouseLeave(e: mapboxgl.MapLayerMouseEvent) {
    this.fire('mouseleave', { originalMapEvent: e })
    if (this._highlightTrigger === 'hover') {
      this._hoverHighlightPropVal = undefined
      this._removeHighlight()
    } else if (this._highlightTrigger === 'both') {
      this._hoverHighlightPropVal = undefined
      this._setHighlight()
    }
  }

  private _onMouseEnter(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features?.[0] as any
    const fullFeature = this._getFeature(feature.properties[this._key])!
    const point = turf.getCoord(turf.centroid(fullFeature))
    const center = new mapboxgl.LngLat(point[0], point[1])
    this.fire('mouseenter', {
      center,
      data: { ...feature.properties },
      lngLat: e.lngLat,
      originalMapEvent: e
    })
  }

  private _removeHighlight() {
    this._clickHighlightPropVal = undefined
    this._hoverHighlightPropVal = undefined
    this._setHighlight()
  }

  private _setHighlight() {
    const expression = this._expressionMap.get(this._highlightTrigger!)!()
    const fillPaint = Object.create(null)
    const fillLayout = Object.create(null)
    const strokePaint = Object.create(null)
    const strokeLayout = Object.create(null)
    this._strokePaintStyleMap.forEach((style, key) => {
      strokePaint[key] = ['case', expression, ...style]
    })
    this._strokeLayoutStyleMap.forEach((style, key) => {
      strokeLayout[key] = ['case', expression, ...style]
    })
    this._fillPaintStyleMap.forEach((style, key) => {
      fillPaint[key] = ['case', expression, ...style]
    })
    this._fillLayoutStyleMap.forEach((style, key) => {
      fillLayout[key] = ['case', expression, ...style]
    })
    this._fillLayer.setStyle({ paint: fillPaint, layout: fillLayout })
    this._strokeLayer.setStyle({ paint: strokePaint, layout: strokeLayout })
  }

  private _initHighlight(style: Options['style'], highlightStyle: HighlightOptions['style']) {
    const strokeKeyList = Object.keys(defaultStrokeStyle) as Array<HighlightStrokeStyleKey>
    strokeKeyList.forEach((propName) => {
      const h = highlightStyle[propName]
      if (h !== undefined) {
        this._strokePaintStyleMap.set(propName.replace('stroke', 'line'), [
          h,
          style[propName] ?? defaultStrokeStyle[propName]
        ])
      }
    })

    const fillKeyList = Object.keys(defaultFillStyle) as Array<HighlightFillStyleKey>

    fillKeyList.forEach((propName) => {
      const h = highlightStyle[propName]
      if (h !== undefined) {
        this._fillPaintStyleMap.set(propName, [h, style[propName] ?? defaultFillStyle[propName]])
      }
    })

    const sortKey = highlightStyle['sort-key']
    if (sortKey !== undefined) {
      this._strokeLayoutStyleMap.set('line-sort-key', [sortKey, style['sort-key'] ?? 1])
      this._fillLayoutStyleMap.set('fill-sort-key', [sortKey, style['sort-key'] ?? 1])
    }

    const invalidVal = `${this._id}-invalidHighlightPropVal`
    this._expressionMap.set('click', () => [
      '==',
      ['get', this._key],
      this._clickHighlightPropVal ?? invalidVal
    ])
    this._expressionMap.set('hover', () => [
      '==',
      ['get', this._key],
      this._hoverHighlightPropVal ?? invalidVal
    ])
    this._expressionMap.set('both', () => [
      'any',
      ['==', ['get', this._key], this._clickHighlightPropVal ?? invalidVal],
      ['==', ['get', this._key], this._hoverHighlightPropVal ?? invalidVal]
    ])
  }
}
