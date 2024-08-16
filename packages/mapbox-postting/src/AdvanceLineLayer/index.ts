import mapboxgl from 'mapbox-gl'
import { deepClone } from '../utils/index'
import { bindAll } from '../utils'
import { nanoid } from 'nanoid'
import { bbox, bboxPolygon, clone, getCoord, centroid, featureCollection } from '@turf/turf'
type Data =
  | GeoJSON.FeatureCollection<
      GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon
    >
  | GeoJSON.Feature<
      GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon
    >
  | string
  | null
type OmitProperty = 'source' | 'source-layer' | 'id'

type LayerType = Omit<mapboxgl.LineLayer, OmitProperty>
type LayerPool = {
  [k: string]: LayerType
}
const highlightTriggers = ['none', 'click', 'hover', 'manual'] as const
type HighlightTrigger = (typeof highlightTriggers)[number]
export type EventType = 'click' | 'mousemove' | 'mouseenter' | 'mouseleave'

type EventData = {
  click: {
    data: any
    originMapEvent: mapboxgl.MapMouseEvent
    center?: mapboxgl.LngLat
    lngLatBounds?: mapboxgl.LngLatBounds
  }
  mousemove: {
    data: any
    center?: mapboxgl.LngLat
    originMapEvent: mapboxgl.MapMouseEvent
  }
  mouseenter: {
    data: any
    center?: mapboxgl.LngLat
    originMapEvent: mapboxgl.MapMouseEvent
  }
  mouseleave: {
    originMapEvent?: mapboxgl.MapMouseEvent
  }
}
type Event<T extends EventType> = EventData[T] & { type: T }

type Options = {
  key?: string
  data?: Data
  layerPool?: LayerPool
  layers?: string[]
  lineMetrics?: boolean
  highlightTrigger?: HighlightTrigger
  highlightLayers?: string[]
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export default class AdvanceLineLayer extends mapboxgl.Evented {
  private _source: string
  private _map: mapboxgl.Map | null
  protected _highlightFeatureId: string | number | null
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null
  private _key: string
  private _data?: Data
  private _lineMetrics: boolean
  private _layerPool: LayerPool
  private _layers: string[]
  private _highlightTrigger: HighlightTrigger
  private _highlightLayers: string[]
  private _isMouseOver: boolean
  private _fitBoundsOptions: boolean | mapboxgl.FitBoundsOptions
  constructor(options: Options) {
    super()
    options = deepClone(options)
    this._map = null
    this._lngLatBounds = null
    this._highlightFeatureId = null
    this._source = `advance-line-layer${nanoid()}`
    this._key = options.key || 'id'
    this._data = options.data
    this._lineMetrics = options.lineMetrics ?? false
    this._layerPool = options.layerPool || {}
    this._layers = options.layers || []
    this._highlightTrigger =
      options.highlightTrigger && highlightTriggers.includes(options.highlightTrigger)
        ? options.highlightTrigger
        : 'none'
    this._highlightLayers = this._highlightTrigger === 'none' ? [] : options.highlightLayers || []
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

  get lngLatBounds() {
    return this._lngLatBounds
  }

  get layerPool() {
    const layerPool: LayerPool = {}
    Object.keys(this._layerPool).forEach((layer) => {
      if (this._layers.includes(layer)) {
        layerPool[`${this.source}-${layer}`] = this._layerPool[layer]
      }
      if (this._highlightLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-highlight`] = this._layerPool[layer]
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
      mapSource.setData(this._data || featureCollection([]))
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
      const point = getCoord(centroid(feature))
      this._map.easeTo({
        ...options,
        center: [point[0], point[1]]
      })
    }
    return this
  }

  flyTo(val: any, options?: Omit<mapboxgl.FlyToOptions, 'center'>) {
    if (!this._map) return this
    const feature = this._getFeature(val)
    if (feature) {
      const point = getCoord(centroid(feature))
      this._map.flyTo({
        ...(options || {}),
        center: [point[0], point[1]]
      })
    }
    return this
  }

  fitTo(val: any, options: mapboxgl.FitBoundsOptions = {}) {
    if (!this._map) return this
    const feature = this._getFeature(val)
    if (feature) {
      this._map.fitBounds(
        new mapboxgl.LngLatBounds(bboxPolygon(bbox(feature)).bbox as any),
        options
      )
    }
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

  private _getFeature(val: any) {
    if (!this._data || typeof this._data === 'string') return
    let feature:
      | GeoJSON.Feature<
          GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon
        >
      | undefined
    if (this._data.type === 'FeatureCollection') {
      feature = this._data.features.find((item: any) => {
        return item.properties?.[this._key] === val
      })
    } else if (this._data.type === 'Feature' && this._data.properties?.[this._key] === val) {
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

  private _addCursor() {
    if (
      this._map &&
      !this._map.getContainer().classList.contains('mapbox-utils-advance-line-layer')
    ) {
      this._map.getContainer().classList.add('mapbox-utils-advance-line-layer')
    }
  }

  private _removeCursor() {
    if (this._map) {
      this._map.getContainer().classList.remove('mapbox-utils-advance-line-layer')
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
    const eventFeature = this._getEventFeature(e.point)
    if (eventFeature) {
      if (this._isDefault(eventFeature)) {
        // 进行高亮
        console.log(eventFeature)
        this._setHighlight(eventFeature.id, 'click')
      }

      if (this._isBasic(eventFeature)) {
        // 点位点击
        const feature = this._getFeature(eventFeature.properties![this._key])
        const centerPoint = feature ? getCoord(centroid(feature)) : undefined
        const clickEvent: EventData['click'] = {
          ...this._getData(eventFeature),
          originMapEvent: e
        }
        if (centerPoint) {
          clickEvent.center = new mapboxgl.LngLat(centerPoint[0], centerPoint[1])
        }
        if (feature) {
          clickEvent.lngLatBounds = new mapboxgl.LngLatBounds(
            bboxPolygon(bbox(feature)).bbox as any
          )
        }
        this.fire('click', {
          ...clickEvent
        })
      }
    }
  }

  private _isDefault(feature: mapboxgl.MapboxGeoJSONFeature) {
    return this.layers.includes(feature.layer.id)
  }
  private _isBasic(feature: mapboxgl.MapboxGeoJSONFeature) {
    return [...this.layers, ...this.highlightLayers].includes(feature.layer.id)
  }

  private _getData(feature: mapboxgl.MapboxGeoJSONFeature) {
    return {
      data: { ...feature.properties }
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
        ['!', this._getHighlightFilter(val)]
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
        this._getHighlightFilter(val)
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
      const feature = this._getFeature(eventFeature.properties![this._key])
      const centerPoint = feature ? getCoord(centroid(feature)) : undefined
      const mouseEvent: EventData['mousemove'] = {
        ...this._getData(eventFeature),
        originMapEvent: e
      }
      if (centerPoint) {
        mouseEvent.center = new mapboxgl.LngLat(centerPoint[0], centerPoint[1])
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
        promoteId: this._key,
        lineMetrics: this._lineMetrics
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
          ['!', this._getHighlightFilter(this._highlightFeatureId)]
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
            this._getHighlightFilter(this._highlightFeatureId)
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

    if (this._map?.getSource(this.source)) {
      this._map.removeSource(this.source)
    }
  }

  private _getGeometryFilter() {
    return [
      'any',
      ['==', ['geometry-type'], 'LineString'],
      ['==', ['geometry-type'], 'MultiLineString'],
      ['==', ['geometry-type'], 'Polygon'],
      ['==', ['geometry-type'], 'MultiPolygon']
    ]
  }
}
