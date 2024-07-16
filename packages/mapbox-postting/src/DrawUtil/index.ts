import mapboxgl from 'mapbox-gl'
import layers, { LayerType } from './layers'
import { bindAll } from '../utils'
import { nanoid } from 'nanoid'
import { clone, point, multiPoint, cleanCoords } from '@turf/turf'
import { Mode, MODE_TYPE, MODE_MAP, ModeType, FeatureType } from './modes'
import { createLine } from './modes/mode'
type Coordinates = [number, number]
type Cache = {
  renderFeatures: Array<FeatureType>
  feature: FeatureType
}
type EventType = 'add'
type EventData = {
  add: {
    data: {
      id: string
      feature: FeatureType
    }
  }
}

type Event<T extends EventType> = EventData[T] & { type: T }
type Options = {
  multiple?: boolean
  layers?: Array<LayerType>
}

export default class DrawUtil extends mapboxgl.Evented {
  private _map: mapboxgl.Map | null
  private _source: string
  private _cacheMap: Map<string, Cache>
  private _currentMode: Mode | null
  private _currentModeType: ModeType
  private _multiple: boolean
  private _layers: Array<LayerType>
  static MODE_TYPE = MODE_TYPE
  constructor(options?: Options) {
    super()
    this._map = null
    this._source = `mapbox-postting-draw-util-source-${nanoid(8)}`
    this._currentModeType = MODE_TYPE.NONE
    this._currentMode = null
    this._cacheMap = new Map()
    this._multiple = options?.multiple ?? false
    this._layers = options?.layers || layers
    this._onClick = debounce(this, this._onClick, 250)
    bindAll(
      ['_OnDblClick', '_onClick', '_onMousemove', '_onData', '_onMousedown', '_onMouseup'],
      this
    )
  }

  get source() {
    return this._source
  }

  get modeType() {
    return this._currentModeType
  }

  addTo(map: mapboxgl.Map) {
    if (this._map === map) {
      return
    }
    this.remove()
    this._map = map
    this._addSourceAnyLayer()
    this._handleEventListener('on')
    return this
  }

  remove() {
    if (this._map) {
      this._handleEventListener('off')
      this._removeSourceAndLayer()
      this._map.getContainer().classList.remove('mapbox-postting-draw-util-cursor')
    }
    this._currentModeType = MODE_TYPE.NONE
    this._currentMode = null
    this._map = null
    return this.clear()
  }

  changeMode(mode: ModeType) {
    if (this._currentModeType === mode) return
    this._currentMode?.clear()
    this._currentModeType = mode
    if (mode === MODE_TYPE.NONE) {
      this._currentMode = null
      this._map?.getContainer().classList.remove('mapbox-postting-draw-util-cursor')
    } else {
      this._currentMode = new MODE_MAP[mode]()
      this._map?.getContainer().classList.add('mapbox-postting-draw-util-cursor')
      this._currentMode.on(
        'finished',
        (e: { data: { feature: FeatureType; renderFeatures: Array<FeatureType> } }) => {
          const id = nanoid(8)
          const feature = clone(e.data.feature)
          feature.properties = {}
          this._cacheMap.set(id, {
            renderFeatures: e.data.renderFeatures,
            feature
          })
          setTimeout(() => {
            this._render()
          })
          setTimeout(() => {
            this.fire('add', {
              data: {
                id,
                feature: clone(feature)
              }
            })
          })
        }
      )
    }
    this._render()
    return this
  }

  clear() {
    this._cacheMap.clear()
    this._currentMode?.clear()
    this._render()
    return this
  }

  add(
    geojson: GeoJSON.Feature<
      | GeoJSON.Polygon
      | GeoJSON.MultiPolygon
      | GeoJSON.LineString
      | GeoJSON.MultiLineString
      | GeoJSON.Point
      | GeoJSON.MultiPoint
    >,
    isCircle = false
  ) {
    const id = Date.now().toString()
    if (geojson.geometry.type === 'Polygon') {
      const cache = createCacheFromPolygon(
        geojson as GeoJSON.Feature<GeoJSON.Polygon>,
        'false',
        isCircle
      )
      !this._multiple && this._cacheMap.clear()
      this._cacheMap.set(id, cache)
    } else if (geojson.geometry.type === 'MultiPolygon') {
      const cache = createCacheFromMultiPolygon(
        geojson as GeoJSON.Feature<GeoJSON.MultiPolygon>,
        'false'
      )
      !this._multiple && this._cacheMap.clear()
      this._cacheMap.set(id, cache)
    } else if (geojson.geometry.type === 'LineString') {
      const cache = createCacheFromLineString(
        geojson as GeoJSON.Feature<GeoJSON.LineString>,
        'false'
      )
      !this._multiple && this._cacheMap.clear()
      this._cacheMap.set(id, cache)
    } else if (geojson.geometry.type === 'MultiLineString') {
      const cache = createCacheFromMultiLineString(
        geojson as GeoJSON.Feature<GeoJSON.MultiLineString>,
        'false'
      )
      !this._multiple && this._cacheMap.clear()
      this._cacheMap.set(id, cache)
    } else if (geojson.geometry.type === 'Point' || geojson.geometry.type === 'MultiPoint') {
      const cache = createCacheFromPoint(
        geojson as GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>
      )
      !this._multiple && this._cacheMap.clear()
      this._cacheMap.set(id, cache)
    } else {
      return null
    }
    if (this._map) {
      this._render()
    }
    return id
  }

  deleteById(id: string) {
    this._cacheMap.delete(id)
    this._render()
    return this
  }

  getAll() {
    return Array.from(this._cacheMap).map(([id, cache]) => {
      return {
        id,
        feature: cache.feature
      }
    })
  }

  on<T extends EventType>(type: T, listener: (e: Event<T>) => void): this {
    return super.on(type, listener)
  }

  fire<T extends EventType>(type: T, properties?: EventData[T]): this {
    return super.fire(type, properties)
  }

  off<T extends EventType>(type?: T, listener?: (e: Event<T>) => void | undefined): this {
    return super.off(type, listener)
  }

  private _handleEventListener(type: 'on' | 'off') {
    if (!this._map) return
    this._map[type]('dblclick', this._OnDblClick)
    this._map[type]('click', this._onClick)
    this._map[type]('mousemove', this._onMousemove)
    this._map[type]('data', this._onData)
  }

  private _onData(e: mapboxgl.MapDataEvent) {
    if (e.dataType === 'style') {
      setTimeout(() => {
        this._addSourceAnyLayer()
      }, 10)
    }
  }

  private _OnDblClick(e: mapboxgl.MapMouseEvent) {
    this._currentMode?.onDblClick(e)
  }

  private _onMousemove(e: mapboxgl.MapMouseEvent) {
    this._currentMode?.onMouseMove(e) && this._render()
  }

  private _onClick(e: mapboxgl.MapMouseEvent) {
    if (this._currentMode?.next === 0 && !this._multiple) {
      this.clear()
    }
    this._currentMode?.onClick(e) && this._render()
  }

  private _render() {
    if (!this._map) return
    const source = this._map.getSource(this._source) as mapboxgl.GeoJSONSource
    const features: Array<FeatureType> = []
    this._cacheMap.forEach((cache) => {
      features.push(...cache.renderFeatures)
    })
    const modeFeatures = this._currentMode?.getFeatures()
    modeFeatures?.renderFeatures && features.push(...modeFeatures.renderFeatures)
    source.setData({
      type: 'FeatureCollection',
      features
    })
  }

  private _addSourceAnyLayer() {
    if (!this._map) return
    if (!this._map.getSource(this._source)) {
      this._map.addSource(this._source, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      this._render()
    }

    this._layers.forEach((layer) => {
      if (this._map?.getLayer(layer.id)) return
      this._map?.addLayer({
        ...layer,
        source: this._source
      })
    })
  }

  private _removeSourceAndLayer() {
    this._layers.forEach((layer) => {
      if (this._map?.getLayer(layer.id)) {
        this._map?.removeLayer(layer.id)
      }
    })

    if (this._map?.getSource(this._source)) {
      this._map.removeSource(this._source)
    }
  }
}

function debounce(that: any, fn: (...args: Array<any>) => any, time: number) {
  let timeout: NodeJS.Timeout | undefined = undefined
  return function (...args: Array<any>) {
    if (!timeout) {
      fn.call(that, ...args)
      timeout = setTimeout(() => {
        timeout = undefined
      }, time)
    }
  }
}

function createCacheFromLineString(
  geojson: GeoJSON.Feature<GeoJSON.LineString>,
  active: 'true' | 'false'
) {
  const renderFeatures: Array<FeatureType> = []
  const line = clone(geojson)
  line.properties = {
    active,
    origin: 'line'
  }
  renderFeatures.push(line)
  geojson.geometry.coordinates.forEach((item) => {
    const vertex = point(item, { active, type: 'vertex', origin: 'line' })
    renderFeatures.push(vertex)
  })
  return {
    renderFeatures,
    feature: clone(geojson) as GeoJSON.Feature<GeoJSON.LineString>
  }
}

function createCacheFromMultiLineString(
  geojson: GeoJSON.Feature<GeoJSON.MultiLineString>,
  active: 'true' | 'false'
) {
  const renderFeatures: Array<FeatureType> = []
  const line = clone(geojson)
  line.properties = {
    active,
    origin: 'line'
  }
  renderFeatures.push(line)
  geojson.geometry.coordinates.forEach((item) => {
    item.forEach((coord) => {
      const vertex = point(coord, { active, type: 'vertex', origin: 'line' })
      renderFeatures.push(vertex)
    })
  })
  return {
    renderFeatures,
    feature: clone(geojson) as GeoJSON.Feature<GeoJSON.MultiLineString>
  }
}

function createCacheFromPoint(geojson: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) {
  const renderFeatures: Array<FeatureType> = []
  const point = clone(geojson)
  point.properties = { origin: 'point' }
  renderFeatures.push(point)
  return {
    renderFeatures,
    feature: clone(geojson) as GeoJSON.Feature<GeoJSON.Point>
  }
}

function createCacheFromPolygon(
  geojson: GeoJSON.Feature<GeoJSON.Polygon>,
  active: 'true' | 'false',
  isCircle = false
) {
  const geometry = geojson.geometry
  const renderFeatures: Array<FeatureType> = []
  const line = createLine(geometry.coordinates[0] as Coordinates[], {
    active,
    type: 'border',
    origin: isCircle ? 'circle' : 'polygon'
  })
  line && renderFeatures.push(line)
  const polygon = clone(geojson)
  polygon.properties = {
    active,
    origin: isCircle ? 'circle' : 'polygon'
  }
  renderFeatures.push(polygon)
  if (!isCircle) {
    const multiPointFe = multiPoint(geometry.coordinates[0])
    cleanCoords(multiPointFe).geometry.coordinates.forEach((item: Coordinates) => {
      const vertex = point(item, { active, type: 'vertex', origin: 'polygon' })
      renderFeatures.push(vertex)
    })
  }
  return {
    renderFeatures,
    feature: clone(geojson) as GeoJSON.Feature<GeoJSON.Polygon>
  }
}

function createCacheFromMultiPolygon(
  geojson: GeoJSON.Feature<GeoJSON.MultiPolygon>,
  active: 'true' | 'false'
) {
  const geometry = geojson.geometry
  const renderFeatures: Array<FeatureType> = []
  geometry.coordinates.forEach((item) => {
    const line = createLine(item[0] as Coordinates[], {
      active,
      type: 'border',
      origin: 'polygon'
    })
    line && renderFeatures.push(line)
  })
  const polygon = clone(geojson)
  polygon.properties = {
    active,
    origin: 'polygon'
  }
  renderFeatures.push(polygon)

  const list: Array<Coordinates> = []
  geometry.coordinates.forEach((item) => {
    list.push(...(item[0] as Coordinates[]))
  })

  const multiPointFe = multiPoint(list)
  cleanCoords(multiPointFe).geometry.coordinates.forEach((item: Coordinates) => {
    const vertex = point(item, { active, type: 'vertex', origin: 'polygon' })
    renderFeatures.push(vertex)
  })
  return {
    feature: clone(geojson) as GeoJSON.Feature<GeoJSON.MultiPolygon>,
    renderFeatures
  }
}
