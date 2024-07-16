import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import { bindAll } from '../utils/index'
import { symbolPaintKeys, symbolLayoutKeys } from '../utils/style'
import AnyLayer from '../AnyLayer'

type HighlightLayoutStyleKey = 'icon-image' | 'icon-size' | 'text-field' | 'text-size'

type HighlightPaintStyleKey =
  | 'icon-opacity'
  | 'icon-color'
  | 'icon-halo-color'
  | 'icon-halo-width'
  | 'icon-halo-blur'
  | 'text-opacity'
  | 'text-color'
  | 'text-halo-color'
  | 'text-halo-width'
  | 'text-halo-blur'

const defaultLayoutStyle: {
  [key in HighlightLayoutStyleKey]: mapboxgl.SymbolLayout[key]
} = {
  'icon-image': '',
  'icon-size': 1,
  'text-field': '',
  'text-size': 16
}

const defaultPaintStyle: {
  [key in HighlightPaintStyleKey]: mapboxgl.SymbolPaint[key]
} = {
  'icon-opacity': 1,
  'icon-color': '#000000',
  'icon-halo-color': 'rgba(0,0,0,0)',
  'icon-halo-width': 0,
  'icon-halo-blur': 0,
  'text-opacity': 1,
  'text-color': '#000000',
  'text-halo-color': 'rgba(0,0,0,0)',
  'text-halo-width': 1,
  'text-halo-blur': 1
}

interface Event<T> {
  type: string
  target: T
  originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData
}

interface ClickEvent<T> extends Event<T> {
  data: any
  lngLat: mapboxgl.LngLat
  points: Array<{ data: any; lngLat: mapboxgl.LngLat }>
}

interface MouseEvent<T> extends Event<T> {
  data: any
  lngLat: mapboxgl.LngLat
}
interface EventType<T> {
  click: ClickEvent<T>
  mouseenter: MouseEvent<T>
  mousemove: MouseEvent<T>
  mouseleave: Event<T>
}

interface HighlightOptions {
  trigger: 'click' | 'hover' | 'both'
  style: Pick<
    mapboxgl.SymbolLayout & mapboxgl.SymbolPaint,
    HighlightLayoutStyleKey | HighlightPaintStyleKey
  >
}

interface Options {
  key: string
  data: GeoJSON.FeatureCollection<GeoJSON.Point>
  style: Pick<
    mapboxgl.SymbolLayout & mapboxgl.SymbolPaint,
    (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]
  >
  highlightOptions?: HighlightOptions
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export default class SymbolPointLayer extends mapboxgl.Evented {
  private _id: string
  private _key: string
  private _map?: mapboxgl.Map
  private _layer: AnyLayer<'symbol'>
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null
  private _fitBoundsOptions: undefined | mapboxgl.FitBoundsOptions
  private _layoutStyleMap: Map<string, [any, any]> = new Map()
  private _paintStyleMap: Map<string, [any, any]> = new Map()
  private _clickHighlightPropVal: undefined | string | number = undefined
  private _hoverHighlightPropVal: undefined | string | number = undefined
  private _expressionMap: Map<string, () => any> = new Map()
  private _highlightTrigger?: 'click' | 'hover' | 'both'
  constructor(options: Options) {
    super()
    this._id = nanoid()
    this._layer = new AnyLayer({
      id: `symbol-point-${this._id}`,
      type: 'symbol',
      layerCursor: 'pointer',
      data: options.data,
      ...this._getStyle(options.style)
    })
    this._key = options.key ?? 'id'
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions)
    this._setLngLatBounds(options.data)
    this._highlightTrigger = options.highlightOptions?.trigger
    if (options.highlightOptions) {
      this._initHighlight(options.style, options.highlightOptions.style)
    }
    bindAll(['_onClick', '_onMouseMove', '_onMouseLeave', '_onMouseEnter'], this)
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
    this._layer.addTo(map)
    // 防止闪烁
    this._highlightTrigger && this._setHighlight()
    this._setEventListeners('on')
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }
    return this
  }

  remove() {
    if (this._map) {
      this._setEventListeners('off')
      this._layer.remove()
      this.removeHighlight()
      this._map = undefined
    }
    return this
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  setData(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    this._setLngLatBounds(data)
    this._layer.setData(data)
    if (this._map) {
      this.removeHighlight()
      if (this._fitBoundsOptions) {
        this.fitBounds(this._fitBoundsOptions)
      }
    }
    return this
  }

  setHighlight(valOfKey: string | number) {
    if (!this._map) return this
    if (!this._highlightTrigger) return this
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

  easeTo(valOfKey: string | number, options?: Omit<mapboxgl.EaseToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(valOfKey)
    if (feature) {
      this._map.easeTo({
        ...options,
        center: feature.geometry.coordinates as mapboxgl.LngLatLike
      })
    }
    return this
  }

  flyTo(valOfKey: string | number, options?: Omit<mapboxgl.FlyToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(valOfKey)
    if (feature) {
      this._map.flyTo({
        ...(options || {}),
        center: feature.geometry.coordinates as mapboxgl.LngLatLike
      })
    }
    return this
  }

  fitBounds(options?: mapboxgl.FitBoundsOptions) {
    if (this._lngLatBounds) {
      this._map?.fitBounds(this._lngLatBounds, options || this._fitBoundsOptions || {})
    }
    return this
  }

  private _getFeature(valOfKey: string | number) {
    let feature = this._layer.querySourceFeature({
      filter: ['==', ['get', this._key], valOfKey]
    })?.[0] as GeoJSON.Feature<GeoJSON.Point> | undefined
    if (feature) return feature
    feature = this._layer.queryFeatureFormData(
      this._key,
      valOfKey
    ) as GeoJSON.Feature<GeoJSON.Point>
    return feature
  }

  private _setLngLatBounds(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    this._lngLatBounds =
      data.features.length > 0
        ? (turf.bboxPolygon(turf.bbox(data)).bbox as mapboxgl.LngLatBoundsLike)
        : null
  }

  private _initHighlight(style: Options['style'], highlightStyle: HighlightOptions['style']) {
    const layoutKeys = Object.keys(defaultLayoutStyle) as Array<HighlightLayoutStyleKey>
    layoutKeys.forEach((propName) => {
      const h = highlightStyle[propName]
      if (h !== undefined) {
        this._layoutStyleMap.set(propName, [h, style[propName] ?? defaultLayoutStyle[propName]])
      }
    })

    const paintKeys = Object.keys(defaultPaintStyle) as Array<HighlightPaintStyleKey>
    paintKeys.forEach((propName) => {
      const h = highlightStyle[propName]
      if (h !== undefined) {
        this._paintStyleMap.set(propName, [h, style[propName] ?? defaultPaintStyle[propName]])
      }
    })

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

  private _getFitBoundsOptions(
    options?: boolean | mapboxgl.FitBoundsOptions
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _getStyle(style: Options['style']) {
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

  private _setEventListeners(type: 'on' | 'off' = 'on') {
    this._layer[type]('click', this._onClick)
    this._layer[type]('mousemove', this._onMouseMove)
    this._layer[type]('mouseleave', this._onMouseLeave)
    this._layer[type]('mouseenter', this._onMouseEnter)
  }

  private _getPoint(feature: any) {
    return {
      data: { ...feature.properties },
      lngLat: new mapboxgl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
    }
  }

  private _onClick(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features![0] as any
    this.fire('click', {
      ...this._getPoint(feature),
      originalMapEvent: e,
      points: e.features?.map((feature: any) => this._getPoint(feature))
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
    this.fire('mousemove', {
      ...this._getPoint(feature),
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
    }

    if (this._highlightTrigger === 'both') {
      this._hoverHighlightPropVal = undefined
      this._setHighlight()
    }
  }

  private _onMouseEnter(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features?.[0] as any
    this.fire('mouseenter', {
      ...this._getPoint(feature),
      originalMapEvent: e
    })
  }

  private _setHighlight() {
    const expression = this._expressionMap.get(this._highlightTrigger!)!()
    const paint = Object.create(null)
    const layout = Object.create(null)
    this._paintStyleMap.forEach((style, key) => {
      paint[key] = ['case', expression, ...style]
    })
    this._layoutStyleMap.forEach((style, key) => {
      layout[key] = ['case', expression, ...style]
    })
    layout['symbol-sort-key'] = ['case', expression, 2, 0]
    this._layer.setStyle({ paint, layout })
  }

  private _removeHighlight() {
    this._clickHighlightPropVal = undefined
    this._hoverHighlightPropVal = undefined
    this._setHighlight()
  }
}
