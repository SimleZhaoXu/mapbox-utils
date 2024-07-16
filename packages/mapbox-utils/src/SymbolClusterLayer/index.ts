import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import { symbolPaintKeys, symbolLayoutKeys } from '../utils/style'
import { bindAll } from '../utils/index'

type HighlightLayoutStyleKey =
  | 'icon-image'
  | 'icon-size'
  | 'icon-offset'
  | 'text-field'
  | 'text-size'
  | 'text-offset'

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
  'icon-offset': [0, 0],
  'text-field': '',
  'text-size': 16,
  'text-offset': [0, 0]
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

interface ClusterClickEvent<T> extends Event<T> {
  points: Array<{ data: any; lngLat: mapboxgl.LngLat }>
}

interface MouseEvent<T> extends Event<T> {
  data: any
  lngLat: mapboxgl.LngLat
}

interface EventType<T> {
  click: ClickEvent<T>
  'cluster-click': ClusterClickEvent<T>
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

type StyleOptions = Pick<
  mapboxgl.SymbolLayout & mapboxgl.SymbolPaint,
  (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]
>

interface Options {
  key: string
  data: GeoJSON.FeatureCollection<GeoJSON.Point>
  style: StyleOptions
  clusterRadius?: number
  clusterStyle: StyleOptions
  highlightOptions?: HighlightOptions
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export default class SymbolClusterLayer extends mapboxgl.Evented {
  private _id: string
  private _layerId: string
  private _clusterLayerId: string
  private _key: string
  private _map?: mapboxgl.Map
  private _clusterRadius: number
  private _data: GeoJSON.FeatureCollection<GeoJSON.Point>
  private _styleOptions: StyleOptions
  private _clusterStyleOptions: StyleOptions
  private _highlightOptions: undefined | Required<HighlightOptions>
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null
  private _fitBoundsOptions: undefined | mapboxgl.FitBoundsOptions
  private _layoutStyleMap: Map<string, [any, any]> = new Map()
  private _paintStyleMap: Map<string, [any, any]> = new Map()
  private _clickHighlightPropVal: undefined | string | number = undefined
  private _hoverHighlightPropVal: undefined | string | number = undefined
  private _expressionMap: Map<string, () => any> = new Map()
  constructor(options: Options) {
    super()
    this._id = nanoid()
    this._layerId = `symbol-cluster-layer-point-${this._id}`
    this._clusterLayerId = `symbol-cluster-layer-cluster-${this._id}`
    this._key = options.key ?? 'id'
    this._data = options.data
    this._styleOptions = options.style
    this._clusterStyleOptions = options.clusterStyle
    this._clusterRadius = options.clusterRadius ?? 250
    this._highlightOptions = options.highlightOptions
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions!)
    this._setLngLatBounds()
    if (this._highlightOptions) {
      this._initHighlight()
    }
    bindAll(
      ['_onClick', '_onClusterClick', '_onMouseEnter', '_onMouseMove', '_onMouseLeave', '_onData'],
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
    this._addLayerAndSource()
    this._setEventListeners('on')
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }
    return this
  }

  remove() {
    if (this._map) {
      this._setEventListeners('off')
      this._removeLayerAndSource()
      this._clickHighlightPropVal = undefined
      this._hoverHighlightPropVal = undefined
      this._map = undefined
    }
    return this
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  setData(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    this._data = data
    this._setLngLatBounds()
    if (this._map) {
      this.removeHighlight()
      const source = this._map.getSource(this._layerId) as mapboxgl.GeoJSONSource
      source?.setData(this._data)
      if (this._fitBoundsOptions) {
        this.fitBounds(this._fitBoundsOptions)
      }
    }
    return this
  }

  setHighlight(valOfKey: string | number) {
    if (this._map && this._highlightOptions) {
      if (this._highlightOptions.trigger === 'hover') {
        this._hoverHighlightPropVal = valOfKey
      } else {
        this._clickHighlightPropVal = valOfKey
      }
      this._setHighlight()
    }
    return this
  }

  removeHighlight() {
    if (this._map && this._highlightOptions) {
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

  private _getFeature(valOfKey: string | number): GeoJSON.Feature<GeoJSON.Point> | undefined {
    if (!this._data) return
    let feature = this._map?.querySourceFeatures(this._layerId, {
      sourceLayer: this._layerId,
      filter: ['==', ['get', this._key], valOfKey]
    })[0] as GeoJSON.Feature<GeoJSON.Point>
    if (feature) return feature
    for (let i = 0; i < this._data.features.length; i++) {
      if (this._data.features[i].properties?.[this._key] === valOfKey) {
        feature = this._data.features[i]
        break
      }
    }
    return feature
  }

  private _setLngLatBounds() {
    this._lngLatBounds =
      this._data.features.length > 0
        ? (turf.bboxPolygon(turf.bbox(this._data)).bbox as mapboxgl.LngLatBoundsLike)
        : null
  }

  private _initHighlight() {
    const layoutKeys = Object.keys(defaultLayoutStyle) as Array<HighlightLayoutStyleKey>
    layoutKeys.forEach((propName) => {
      const h = this._highlightOptions!.style[propName]
      if (h !== undefined) {
        this._layoutStyleMap.set(propName, [
          h,
          this._styleOptions[propName] ?? defaultLayoutStyle[propName]
        ])
      }
    })

    const paintKeys = Object.keys(defaultPaintStyle) as Array<HighlightPaintStyleKey>
    paintKeys.forEach((propName) => {
      const h = this._highlightOptions!.style[propName]
      if (h !== undefined) {
        this._paintStyleMap.set(propName, [
          h,
          this._styleOptions[propName] ?? defaultPaintStyle[propName]
        ])
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
    options: boolean | mapboxgl.FitBoundsOptions
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _addLayerAndSource() {
    if (!this._map) return
    if (!this._map.getSource(this._layerId)) {
      this._map.addSource(this._layerId, {
        type: 'geojson',
        generateId: true,
        data: this._data,
        cluster: true,
        clusterRadius: this._clusterRadius ?? 50
      })
    }

    if (!this._map.getLayer(this._clusterLayerId)) {
      this._map.addLayer({
        id: this._clusterLayerId,
        type: 'symbol',
        source: this._layerId,
        filter: ['has', 'cluster_id'],
        ...this._getStyle(this._clusterStyleOptions)
      })
    }

    if (!this._map.getLayer(this._layerId)) {
      this._map.addLayer({
        id: this._layerId,
        type: 'symbol',
        source: this._layerId,
        filter: ['!', ['has', 'cluster_id']],
        ...this._getStyle(this._styleOptions)
      })
    }

    // 防止第一次触发高亮时的闪烁
    if (this._highlightOptions) this._setHighlight()
  }

  private _getStyle(styleOptions: StyleOptions) {
    const paint = Object.create(null)
    const layout = Object.create(null)
    const keyList = Object.keys(styleOptions) as Array<
      (typeof symbolLayoutKeys)[number] | (typeof symbolPaintKeys)[number]
    >
    keyList.forEach((key) => {
      if (symbolLayoutKeys.includes(key as any)) {
        layout[key] = styleOptions[key]
      } else if (symbolPaintKeys.includes(key as any)) {
        paint[key] = styleOptions[key]
      }
    })
    layout['visibility'] = 'visible'
    return {
      paint,
      layout
    }
  }

  private _onData(e: mapboxgl.MapDataEvent) {
    if (e.dataType === 'style') {
      setTimeout(() => {
        this._addLayerAndSource()
      }, 10)
    }
  }

  private _setEventListeners(type: 'on' | 'off' = 'on') {
    this._map![type]('click', this._layerId, this._onClick)
    this._map![type]('click', this._clusterLayerId, this._onClusterClick)
    this._map![type]('mouseenter', this._layerId, this._onMouseEnter)
    this._map![type]('mousemove', this._layerId, this._onMouseMove)
    this._map![type]('mouseleave', this._layerId, this._onMouseLeave)
    this._map![type]('data', this._onData)
  }

  private _onClusterClick(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features![0] as any
    const clusterSource = this._map!.getSource(this._layerId) as mapboxgl.GeoJSONSource

    clusterSource.getClusterLeaves(
      feature.properties?.cluster_id,
      feature.properties?.point_count,
      0,
      (error, features) => {
        if (!error) {
          this.fire('cluster-click', {
            points: features?.map((feature: any) => this._getPoint(feature))
          })
        }
      }
    )
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
    if (this._highlightOptions?.trigger === 'click' || this._highlightOptions?.trigger === 'both') {
      const propVal = feature.properties[this._key]
      if (this._clickHighlightPropVal !== propVal) {
        this._clickHighlightPropVal = propVal
        this._setHighlight()
      }
    }
  }

  private _onMouseEnter(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features?.[0] as any
    this.fire('mouseenter', {
      ...this._getPoint(feature),
      originalMapEvent: e
    })
    this._map!.getCanvas().style.cursor = 'pointer'
  }

  private _onMouseMove(e: mapboxgl.MapLayerMouseEvent) {
    const feature = e.features?.[0] as any
    this.fire('mousemove', {
      ...this._getPoint(feature),
      originalMapEvent: e
    })
    if (this._highlightOptions?.trigger === 'hover' || this._highlightOptions?.trigger === 'both') {
      const propVal = e.features![0].properties![this._key]
      if (this._hoverHighlightPropVal !== propVal) {
        this._hoverHighlightPropVal = propVal
        this._setHighlight()
      }
    }
  }

  private _onMouseLeave(e: mapboxgl.MapLayerMouseEvent) {
    this.fire('mouseleave', { originalMapEvent: e })
    this._map!.getCanvas().style.cursor = ''
    if (this._highlightOptions?.trigger === 'hover') {
      this._hoverHighlightPropVal = undefined
      this._removeHighlight()
    }

    if (this._highlightOptions?.trigger === 'both') {
      this._hoverHighlightPropVal = undefined
      this._setHighlight()
    }
  }

  private _setHighlight() {
    const expression = this._expressionMap.get(this._highlightOptions!.trigger)!()
    this._paintStyleMap.forEach((style, key) => {
      this._map!.setPaintProperty(this._layerId, key, ['case', expression, ...style])
    })
    this._layoutStyleMap.forEach((style, key) => {
      this._map!.setLayoutProperty(this._layerId, key, ['case', expression, ...style])
    })
    this._map!.setLayoutProperty(this._layerId, 'symbol-sort-key', ['case', expression, 2, 0])
  }

  private _removeHighlight() {
    this._clickHighlightPropVal = undefined
    this._hoverHighlightPropVal = undefined
    this._setHighlight()
  }

  private _removeLayerAndSource() {
    if (this._map?.getLayer(this._layerId)) {
      this._map.removeLayer(this._layerId)
    }
    if (this._map?.getLayer(this._clusterLayerId)) {
      this._map.removeLayer(this._clusterLayerId)
    }
    if (this._map?.getSource(this._layerId)) {
      this._map.removeSource(this._layerId)
    }
  }
}
