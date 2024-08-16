import mapboxgl from 'mapbox-gl'
import { deepClone } from '../utils/index'
import { bindAll } from '../utils'
import { nanoid } from 'nanoid'
import { bbox, bboxPolygon, clone, featureCollection } from '@turf/turf'
type Data =
  | GeoJSON.FeatureCollection<GeoJSON.Point>
  | GeoJSON.Feature<GeoJSON.Point>
  | string
  | null
type OmitProperty = 'source' | 'source-layer' | 'id'
type LayerType = Omit<mapboxgl.CircleLayer, OmitProperty> | Omit<mapboxgl.SymbolLayer, OmitProperty>
type LayerPool = {
  [k: string]: LayerType
}
const highlightTriggers = ['none', 'click', 'hover', 'manual'] as const
type HighlightTrigger = (typeof highlightTriggers)[number]
type Options = {
  key?: string
  data?: Data
  layerPool?: LayerPool
  layers?: string[]
  highlightTrigger?: HighlightTrigger
  highlightLayers?: string[]
  cluster?: boolean
  clusterLayers?: string[]
  clusterMaxZoom?: number
  clusterMinPoints?: number
  clusterProperties?: any
  clusterRadius?: number
  maxzoom?: number
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export type EventType = 'click' | 'mousemove' | 'mouseenter' | 'mouseleave' | 'cluster-click'

type EventData = {
  click: {
    data: any
    lngLat: mapboxgl.LngLat
    originMapEvent: mapboxgl.MapMouseEvent
  }
  mousemove: {
    data: any
    lngLat: mapboxgl.LngLat
    originMapEvent: mapboxgl.MapMouseEvent
  }
  mouseenter: {
    data: any
    lngLat: mapboxgl.LngLat
    originMapEvent: mapboxgl.MapMouseEvent
  }
  mouseleave: {
    originMapEvent?: mapboxgl.MapMouseEvent
  }

  'cluster-click': {
    clusterLeaves: Array<any>
    lngLat: mapboxgl.LngLat
    originMapEvent: mapboxgl.MapMouseEvent
  }
}
type Event<T extends EventType> = EventData[T] & { type: T }

export default class AdvancePointLayer extends mapboxgl.Evented {
  private _source: string
  private _map: mapboxgl.Map | null
  protected _highlightFeatureId: string | number | null
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null
  private _key: string
  private _data?: Data
  private _layerPool: LayerPool
  private _layers: string[]
  private _highlightTrigger: HighlightTrigger
  private _highlightLayers: string[]
  private _cluster: boolean
  private _clusterLayers: string[]
  private _clusterMaxZoom?: number
  private _clusterMinPoints?: number
  private _clusterProperties?: any
  private _clusterRadius?: number
  private _maxzoom?: number
  private _isMouseOver: boolean
  private _fitBoundsOptions: boolean | mapboxgl.FitBoundsOptions
  constructor(options: Options) {
    super()
    options = deepClone(options)
    this._map = null
    this._lngLatBounds = null
    this._highlightFeatureId = null
    this._source = `advance-point-layer${nanoid()}`
    this._key = options.key || 'id'
    this._data = options.data
    this._layerPool = options.layerPool || {}
    this._layers = options.layers || []
    this._highlightTrigger =
      options.highlightTrigger && highlightTriggers.includes(options.highlightTrigger)
        ? options.highlightTrigger
        : 'none'
    this._highlightLayers = this._highlightTrigger === 'none' ? [] : options.highlightLayers || []
    this._cluster = options.cluster || false
    this._clusterLayers = this._cluster ? options.clusterLayers || [] : []
    this._clusterRadius = options.clusterRadius
    this._clusterMaxZoom = options.clusterMaxZoom
    this._clusterMinPoints = options.clusterMinPoints
    this._clusterProperties = options.clusterProperties
    this._maxzoom = options.maxzoom
    this._fitBoundsOptions = options.fitBoundsOptions || false
    this._isMouseOver = false
    this._setLngLatBounds()
    bindAll(['_onClick', '_onMouseMove', '_onData', '_onMouseLeave'], this)
  }

  get source() {
    return this._source
  }

  get layers() {
    return this._layers.map((layer) => `${this.source}-${layer}`)
  }

  get highlightLayers() {
    return this._highlightLayers.map((layer) => `${this.source}-${layer}-highlight`)
  }

  get clusterLayers() {
    return this._clusterLayers.map((layer) => `${this.source}-${layer}-cluster`)
  }

  get lngLatBounds() {
    return this._lngLatBounds
  }

  get layerPool(): LayerPool {
    const layerPool: LayerPool = {}
    Object.keys(this._layerPool).forEach((layer) => {
      if (this._layers.includes(layer)) {
        layerPool[`${this.source}-${layer}`] = this._layerPool[layer]
      }
      if (this._highlightLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-highlight`] = this._layerPool[layer]
      }

      if (this._clusterLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-cluster`] = this._layerPool[layer]
      }
    })
    return layerPool
  }

  addTo(map: mapboxgl.Map) {
    if (this._map === map) return
    this.remove()
    this._map = map
    this._addSourceAnyLayer()
    this._handleEventListener('on')
    this._fitBounds()
    return this
  }

  remove() {
    if (this._map) {
      this._highlightFeatureId = null
      this._lngLatBounds = null
      this._isMouseOver = false
      this._handleEventListener('off')
      this._removeSourceAnyLayer()
      this._removeCursor()
      this._map = null
    }
    return this
  }

  fitBounds(options?: mapboxgl.FitBoundsOptions) {
    if (this._lngLatBounds) {
      options = options || typeof this._fitBoundsOptions === 'boolean' ? {} : this._fitBoundsOptions
      this._map?.fitBounds(this._lngLatBounds, {
        ...options
      })
    }
    return this
  }

  setData(data: Data) {
    this._highlightFeatureId = null
    this._lngLatBounds = null
    this._isMouseOver = false
    this._data = data
    this._setLngLatBounds()
    if (this._map) {
      const mapSource = this._map.getSource(this.source) as mapboxgl.GeoJSONSource
      mapSource.setData(data || featureCollection([]))
      this.removeHighlight()
      this._fitBounds()
    }
    return this
  }

  setHighlight(val: any) {
    const type = this._highlightTrigger === 'hover' ? 'none' : this._highlightTrigger
    this._setHighlight(val, type)
  }

  removeHighlight() {
    const type = this._highlightTrigger === 'hover' ? 'none' : this._highlightTrigger
    this._setHighlight(undefined, type)
  }

  easeTo(val: any, options?: Omit<mapboxgl.EaseToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(val)
    if (feature) {
      this._map.easeTo({
        ...options,
        center: feature.geometry.coordinates as mapboxgl.LngLatLike
      })
    }
    return this
  }

  flyTo(valOfKey: any, options?: Omit<mapboxgl.FlyToOptions, 'center'>) {
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

  on<T extends EventType>(type: T, listener: (e: Event<T>) => void): this {
    return super.on(type, listener)
  }

  fire<T extends EventType>(type: T, properties?: EventData[T] | undefined): this {
    return super.fire(type, properties)
  }

  once<T extends EventType>(type: T, listener: (e: Event<T>) => void): this {
    return super.once(type, listener)
  }

  off<T extends EventType>(type?: T, listener?: (e: Event<T>) => void | undefined): this {
    return super.off(type, listener)
  }

  private _getFeature(valOfKey: any) {
    if (!this._data || typeof this._data === 'string') return
    let feature = this._map?.querySourceFeatures(this.source, {
      filter: ['==', ['get', this._key], valOfKey]
    })?.[0] as GeoJSON.Feature<GeoJSON.Point> | undefined
    if (feature) return feature
    if (this._data.type === 'FeatureCollection') {
      feature = this._data.features.find((item) => {
        return item.properties?.[this._key] === valOfKey
      })
    } else if (this._data.type === 'Feature' && this._data.properties?.[this._key] === valOfKey) {
      feature = clone(this._data)
    }
    return feature
  }

  private _fitBounds() {
    if (!this._map || !this._fitBoundsOptions || !this._lngLatBounds) return
    this._map.fitBounds(this._lngLatBounds, {
      ...(this._fitBoundsOptions === true ? {} : this._fitBoundsOptions)
    })
  }

  private _setLngLatBounds() {
    if (this._data && typeof this._data !== 'string') {
      if (this._data.type === 'FeatureCollection') {
        this._lngLatBounds =
          this._data.features.length > 0
            ? (bboxPolygon(bbox(this._data)).bbox as mapboxgl.LngLatBoundsLike)
            : null
      } else if (this._data.type === 'Feature') {
        this._lngLatBounds = bboxPolygon(bbox(this._data)).bbox as mapboxgl.LngLatBoundsLike
      } else {
        this._lngLatBounds = null
      }
    } else {
      this._lngLatBounds = null
    }
  }

  private _handleEventListener(type: 'on' | 'off') {
    if (!this._map) return
    this._map[type]('click', this._onClick)
    this._map[type]('mousemove', this._onMouseMove)
    this._map[type]('data', this._onData)
    if (type === 'on') {
      this._map.getContainer().addEventListener('mouseleave', this._onMouseLeave)
    } else {
      this._map.getContainer().removeEventListener('mouseleave', this._onMouseLeave)
    }
  }

  private _onMouseLeave() {
    if (this._isMouseOver) {
      this._isMouseOver = false
      // mouseleave事件
      this.fire('mouseleave')
      this._setHighlight(undefined, 'hover')
      this._removeCursor()
    }
  }

  private _onClick(e: mapboxgl.MapMouseEvent) {
    if (!this._map) return
    const eventFeature = this._getEventFeature(e.point)
    if (eventFeature) {
      if (this._isDefault(eventFeature)) {
        // 进行高亮
        this._setHighlight(eventFeature.id, 'click')
      }

      if (this._isBasic(eventFeature)) {
        // 点位点击
        this.fire('click', {
          ...this._getData(eventFeature),
          originMapEvent: e
        })
      } else if (this._isClustered(eventFeature)) {
        // 聚合点点击
        const dataSource = this._map.getSource(this.source) as mapboxgl.GeoJSONSource
        dataSource.getClusterLeaves(
          eventFeature.properties?.cluster_id,
          eventFeature.properties?.point_count,
          0,
          (error, features) => {
            if (!error) {
              const { coordinates } = eventFeature.geometry as GeoJSON.Point
              this.fire('cluster-click', {
                clusterLeaves: features?.map((feature: any) => this._getData(feature)),
                originMapEvent: e,
                lngLat: new mapboxgl.LngLat(coordinates[0], coordinates[1])
              })
            }
          }
        )
      }
    }
  }

  private _isDefault(feature: mapboxgl.MapboxGeoJSONFeature) {
    return this.layers.includes(feature.layer.id)
  }
  private _isBasic(feature: mapboxgl.MapboxGeoJSONFeature) {
    return [...this.layers, ...this.highlightLayers].includes(feature.layer.id)
  }
  private _isClustered(feature: mapboxgl.MapboxGeoJSONFeature) {
    return this.clusterLayers.includes(feature.layer.id)
  }

  private _getData(feature: mapboxgl.MapboxGeoJSONFeature) {
    const { coordinates } = feature.geometry as GeoJSON.Point
    return {
      data: { ...feature.properties },
      lngLat: new mapboxgl.LngLat(coordinates[0], coordinates[1])
    }
  }

  private _setHighlight(val: any, type: string) {
    if (
      this._highlightTrigger !== type ||
      type === 'none' ||
      !this._map ||
      this._highlightFeatureId === val
    )
      return
    this._highlightFeatureId = val
    this.layers.forEach((layerId) => {
      const layerOptions = this.layerPool[layerId]
      this._map?.setFilter(layerId, [
        'all',
        this._getGeometryFilter(),
        // 图层原有filter
        layerOptions.filter ?? true,
        // 非高亮filter
        ['!', this._getHighlightFilter(val)],
        // 非聚合filter
        ['!', this._getClusterFilter()]
      ])
    })

    this.highlightLayers.forEach((layerId) => {
      const layerOptions = this.layerPool[layerId]
      this._map?.setFilter(layerId, [
        'all',
        this._getGeometryFilter(),
        // 图层原有filter
        layerOptions.filter ?? true,
        // 高亮filter
        this._getHighlightFilter(val),
        // 非聚合filter
        ['!', this._getClusterFilter()]
      ])
    })
  }

  private _getEventFeature(point: mapboxgl.Point): mapboxgl.MapboxGeoJSONFeature | undefined {
    if (!this._map) return
    const features = this._map.queryRenderedFeatures(point, {
      layers: undefined
    })
    if (features[0]?.source === this.source) {
      return features[0]
    }
  }

  private _onMouseMove(e: mapboxgl.MapMouseEvent) {
    const eventFeature = this._getEventFeature(e.point)
    if (eventFeature && this._isBasic(eventFeature)) {
      const mouseEvent = {
        ...this._getData(eventFeature),
        originMapEvent: e
      }
      if (this._isMouseOver) {
        // mousemove事件
        this.fire('mousemove', mouseEvent)
      } else {
        // mouseenter事件
        this.fire('mouseenter', mouseEvent)
        this._isMouseOver = true
      }
      this._addCursor()
      this._setHighlight(eventFeature.id, 'hover')
    } else if (this._isMouseOver) {
      // mouseleave事件
      this.fire('mouseleave', {
        originMapEvent: e
      })
      this._isMouseOver = false
      this._setHighlight(undefined, 'hover')
      this._removeCursor()
    }
  }

  private _addCursor() {
    if (
      this._map &&
      !this._map.getContainer().classList.contains('mapbox-utils-advance-point-layer')
    ) {
      this._map.getContainer().classList.add('mapbox-utils-advance-point-layer')
    }
  }

  private _removeCursor() {
    if (this._map) {
      this._map.getContainer().classList.remove('mapbox-utils-advance-point-layer')
    }
  }

  private _onData(e: mapboxgl.MapDataEvent) {
    if (e.dataType === 'style') {
      setTimeout(() => {
        this._addSourceAnyLayer()
      }, 10)
    }
  }

  private _addSourceAnyLayer() {
    if (!this._map) return
    if (!this._map.getSource(this.source)) {
      const sourceOptions: mapboxgl.GeoJSONSourceRaw = {
        data: this._data || featureCollection([]),
        type: 'geojson',
        promoteId: this._key
      }

      if (this._cluster !== undefined) {
        sourceOptions.cluster = this._cluster
      }
      if (this._clusterMaxZoom !== undefined) {
        sourceOptions.clusterMaxZoom = this._clusterMaxZoom
      }
      if (this._clusterMinPoints !== undefined) {
        sourceOptions.clusterMinPoints = this._clusterMinPoints
      }
      if (this._clusterProperties !== undefined) {
        sourceOptions.clusterProperties = this._clusterProperties
      }
      if (this._clusterRadius !== undefined) {
        sourceOptions.clusterRadius = this._clusterRadius
      }
      if (this._maxzoom !== undefined) {
        sourceOptions.maxzoom = this._maxzoom
      }
      this._map.addSource(this.source, sourceOptions)
    }

    // 普通图层
    this.layers.forEach((layerId) => {
      if (this._map?.getLayer(layerId)) return
      const layerOptions = this.layerPool[layerId]
      this._map?.addLayer({
        ...layerOptions,
        id: layerId,
        source: this.source,
        filter: [
          'all',
          this._getGeometryFilter(),
          // 图层原有filter
          layerOptions.filter ?? true,
          // 非高亮filter
          ['!', this._getHighlightFilter(this._highlightFeatureId)],
          // 非聚合filter
          ['!', this._getClusterFilter()]
        ]
      })
    })

    // 高亮图层
    if (this._highlightTrigger !== 'none') {
      this.highlightLayers.forEach((layerId) => {
        if (this._map?.getLayer(layerId)) return
        const layerOptions = this.layerPool[layerId]
        this._map?.addLayer({
          ...layerOptions,
          id: layerId,
          source: this.source,
          filter: [
            'all',
            this._getGeometryFilter(),
            // 图层原有filter
            layerOptions.filter ?? true,
            // 高亮filter
            this._getHighlightFilter(this._highlightFeatureId),
            // 非聚合filter
            ['!', this._getClusterFilter()]
          ]
        })
      })
    }

    // 聚合图层
    if (this._cluster) {
      this.clusterLayers.forEach((layerId) => {
        if (this._map?.getLayer(layerId)) return
        const layerOptions = this.layerPool[layerId]
        this._map?.addLayer({
          ...layerOptions,
          id: layerId,
          source: this.source,
          filter: [
            'all',
            this._getGeometryFilter(),
            // 聚合点
            this._getClusterFilter(),
            // 图层原有filter
            layerOptions.filter ?? true
          ]
        })
      })
    }
  }

  private _getHighlightFilter(id?: string | number | null) {
    if (this._highlightTrigger === 'none') {
      return false
    }
    return id !== undefined && id !== null ? ['==', ['get', this._key], id] : false
  }

  private _getClusterFilter() {
    if (this._cluster) {
      return ['all', ['has', 'cluster_id'], ['==', ['get', 'cluster'], true]]
    }
    return false
  }

  private _getGeometryFilter() {
    return ['==', ['geometry-type'], 'Point']
  }

  private _removeSourceAnyLayer() {
    this.layers.forEach((layerId) => {
      if (this._map?.getLayer(layerId)) {
        this._map.removeLayer(layerId)
      }
    })

    if (this._highlightTrigger !== 'none') {
      this.highlightLayers.forEach((layerId) => {
        if (this._map?.getLayer(layerId)) {
          this._map.removeLayer(layerId)
        }
      })
    }

    if (this._cluster) {
      this.clusterLayers.forEach((layerId) => {
        if (this._map?.getLayer(layerId)) {
          this._map.removeLayer(layerId)
        }
      })
    }

    if (this._map?.getSource(this.source)) {
      this._map.removeSource(this.source)
    }
  }
}
