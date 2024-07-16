import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import AnyLayer from '../AnyLayer'
import { linePaintKeys, lineLayoutKeys } from '../utils/style'
import { bindAll } from '../utils/index'

type HighlightStyleKey =
  | 'line-color'
  | 'line-width'
  | 'line-blur'
  | 'line-opacity'
  | 'line-gap-width'

const defaultStyle: {
  [key in HighlightStyleKey]: mapboxgl.LinePaint[key]
} = {
  'line-color': '#000000',
  'line-width': 1,
  'line-blur': 0,
  'line-opacity': 1,
  'line-gap-width': 0
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
  style: Pick<mapboxgl.LinePaint, HighlightStyleKey>
}
type Style = Pick<
  mapboxgl.LinePaint & mapboxgl.LineLayout,
  (typeof linePaintKeys)[number] | (typeof lineLayoutKeys)[number]
>

type Data = GeoJSON.FeatureCollection<GeoJSON.LineString>
interface Options {
  key?: string
  data: Data
  style: Style
  highlightOptions?: HighlightOptions
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export default class LineLayer extends mapboxgl.Evented {
  private _id: string
  private _key: string
  private _layer: AnyLayer<'line'>
  private _map?: mapboxgl.Map
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null = null
  private _fitBoundsOptions: undefined | mapboxgl.FitBoundsOptions
  private _styleMap: Map<string, [any, any]> = new Map()
  private _clickHighlightPropVal?: string | number = undefined
  private _hoverHighlightPropVal?: string | number = undefined
  private _expressionMap: Map<string, () => any> = new Map()
  private _highlightTrigger?: 'click' | 'hover' | 'both'
  constructor(options: Options) {
    super()
    this._key = options.key ?? 'id'
    this._id = nanoid()
    this._layer = new AnyLayer({
      id: `line-layer-${this._id}`,
      type: 'line',
      layerCursor: 'pointer',
      data: options.data,
      ...this._getStyle(options.style)
    })
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

  setData(data: Data) {
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
      const center = new mapboxgl.LngLat(point[0], point[1])
      this._map.easeTo({
        ...options,
        center
      })
    }
    return this
  }

  flyTo(valOfKey: string | number, options?: Omit<mapboxgl.FlyToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(valOfKey)
    if (feature) {
      const point = turf.getCoord(turf.centroid(feature))
      const center = new mapboxgl.LngLat(point[0], point[1])
      this._map.flyTo({
        ...(options || {}),
        center
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
    return this._layer.queryFeatureFormData(this._key, valOfKey)
  }

  private _setLngLatBounds(data: Data) {
    this._lngLatBounds =
      data.features.length > 0
        ? (turf.bboxPolygon(turf.bbox(data)).bbox as mapboxgl.LngLatBoundsLike)
        : null
  }

  private _initHighlight(style: Options['style'], highlightStyle: HighlightOptions['style']) {
    const keyList = Object.keys(defaultStyle) as Array<HighlightStyleKey>
    keyList.forEach((propName) => {
      const h = highlightStyle[propName]
      if (h !== undefined) {
        this._styleMap.set(propName, [h, style[propName] ?? defaultStyle[propName]])
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
    options: boolean | mapboxgl.FitBoundsOptions | undefined
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _getStyle(style: Options['style']) {
    const paint = Object.create(null)
    const layout = Object.create(null)
    const keyList = Object.keys(style) as Array<
      (typeof lineLayoutKeys)[number] | (typeof linePaintKeys)[number]
    >
    keyList.forEach((key) => {
      if (lineLayoutKeys.includes(key as any)) {
        layout[key] = style[key]
      } else if (linePaintKeys.includes(key as any)) {
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

  private _onClick(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features?.[0] as any
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
      const propVal = e.features?.[0].properties?.[this._key]
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

  private _setHighlight() {
    const expression = this._expressionMap.get(this._highlightTrigger!)!()
    const paint = Object.create(null)
    const layout = Object.create(null)
    this._styleMap.forEach((style, key) => {
      paint[key] = ['case', expression, ...style]
    })
    layout['line-sort-key'] = ['case', expression, 2, 0]
    this._layer.setStyle({ paint, layout })
  }

  private _removeHighlight() {
    this._clickHighlightPropVal = undefined
    this._hoverHighlightPropVal = undefined
    this._setHighlight()
  }
}
