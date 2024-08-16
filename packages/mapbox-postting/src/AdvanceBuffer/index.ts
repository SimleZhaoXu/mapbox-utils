import mapboxgl from 'mapbox-gl'
import layers, { LayerType } from './layers'
import { bindAll } from '../utils/index'
import { nanoid } from 'nanoid'
import { clone, cleanCoords, buffer, polygonToLine, point, multiPoint } from '@turf/turf'
import { Mode, MODE_TYPE, MODE_MAP, ModeType, FeatureType, createLine } from './modes'
type Coordinates = [number, number]
type BufferFeatureType = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
type Cache = {
  bufferFeature?: BufferFeatureType
  feature: FeatureType
  baseRenderFeatures: Array<FeatureType>
  bufferRenderFeatures: Array<FeatureType>
}
type EventType = 'add'
type EventData = {
  add: {
    data: {
      id: string
      feature: FeatureType
      bufferFeature: BufferFeatureType
    }
  }
}

type Event<T extends EventType> = EventData[T] & { type: T }
const units = ['meters', 'kilometers'] as const
type Units = (typeof units)[number]
type Options = {
  multiple?: boolean
  layers?: Array<LayerType>
  radius?: number
  units?: Units
  steps?: number
}

export default class AdvanceBuffer extends mapboxgl.Evented {
  private _map: mapboxgl.Map | null
  private _source: string
  private _cacheMap: Map<string, Cache>
  private _currentMode: Mode | null
  private _currentModeType: ModeType
  private _multiple: boolean
  private _layers: Array<LayerType>
  private _radius: number
  private _units: Units
  private _steps: number
  static MODE_TYPE = MODE_TYPE
  constructor(options?: Options) {
    super()
    this._map = null
    this._source = `mapbox-utils-advance-buffer-source-${nanoid(8)}`
    this._currentModeType = MODE_TYPE.NONE
    this._currentMode = null
    this._radius = options?.radius && options.radius > 0 ? options.radius : 1
    this._units = options?.units && units.includes(options.units) ? options.units : 'kilometers'
    this._steps = options?.steps && options.steps > 0 ? options.steps : 16
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
      this._map.getContainer().classList.remove('mapbox-utils-advance-buffer-cursor')
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
      this._map?.getContainer().classList.remove('mapbox-utils-advance-buffer-cursor')
    } else {
      this._currentMode = new MODE_MAP[mode]()
      this._map?.getContainer().classList.add('mapbox-utils-advance-buffer-cursor')
      this._currentMode.on(
        'finished',
        (e: { data: { feature: FeatureType; renderFeatures: Array<FeatureType> } }) => {
          const id = nanoid(8)
          const feature = clone(e.data.feature)
          feature.properties = {}
          const { renderFeatures, bufferFeature } = generateBufferData(
            feature,
            this._radius,
            this._steps,
            this._units
          )
          this._cacheMap.set(id, {
            bufferRenderFeatures: renderFeatures,
            baseRenderFeatures: e.data.renderFeatures,
            bufferFeature,
            feature
          })
          setTimeout(() => {
            this._render()
          })
          setTimeout(() => {
            this.fire('add', {
              data: {
                id,
                feature: clone(feature),
                bufferFeature: clone(bufferFeature)
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

  add(feature: FeatureType) {
    const id = nanoid(8)
    const { renderFeatures, bufferFeature } = generateBufferData(
      feature,
      this._radius,
      this._steps,
      this._units
    )
    if (!this._multiple) {
      this._cacheMap.clear()
    }
    this._cacheMap.set(id, {
      bufferRenderFeatures: renderFeatures,
      baseRenderFeatures: getRenderFeatures(feature),
      bufferFeature,
      feature
    })
    if (this._map) {
      setTimeout(() => {
        this._render()
      })
    }
    return {
      id,
      feature: clone(feature),
      bufferFeature: clone(bufferFeature)
    }
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
        feature: cache.feature,
        bufferFeature: cache.bufferFeature
      }
    })
  }

  setBufferOptions(options: { radius?: number; units?: Units; steps?: number }) {
    options.radius && (this._radius = options.radius)
    options.units && units.includes(options.units) && (this._units = options.units)
    options.steps && options.steps > 0 && (this._steps = options.steps)
    // 重新计算缓冲区
    this._cacheMap.forEach((cache) => {
      const { renderFeatures, bufferFeature } = generateBufferData(
        cache.feature,
        this._radius,
        this._steps,
        this._units
      )
      cache.bufferRenderFeatures = renderFeatures
      cache.bufferFeature = bufferFeature
    })
    this._render()
    return this
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
      features.push(...cache.baseRenderFeatures, ...cache.bufferRenderFeatures)
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

function generateBufferData(feature: any, radius: number, steps: number, units: Units) {
  // 生成缓冲区
  const features: Array<FeatureType> = []
  const bufferFeature = cleanCoords(
    buffer(feature, radius, {
      units,
      steps
    })
  )
  const renderBufferFeature = clone(bufferFeature)
  renderBufferFeature.properties = { origin: 'buffer' }

  const lineGeojson = polygonToLine(renderBufferFeature)
  if (lineGeojson.type === 'FeatureCollection') {
    lineGeojson.features.forEach((lineFeature) => {
      lineFeature.properties = {
        origin: 'buffer'
      }
      features.push(lineFeature)
    })
  } else {
    lineGeojson.properties = {
      origin: 'buffer'
    }
    features.push(lineGeojson)
  }
  features.push(renderBufferFeature)
  return {
    renderFeatures: features,
    bufferFeature
  }
}

function getRenderFeatures(feature: FeatureType) {
  if (feature.geometry.type === 'Point' || feature.geometry.type === 'MultiPoint') {
    return getRenderFeaturesFromPoint(
      feature as GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>
    )
  } else if (feature.geometry.type === 'LineString') {
    return getRenderFeaturesFromLineString(feature as GeoJSON.Feature<GeoJSON.LineString>)
  } else if (feature.geometry.type === 'MultiLineString') {
    return getRenderFeaturesFromMultiLineString(feature as GeoJSON.Feature<GeoJSON.MultiLineString>)
  } else if (feature.geometry.type === 'Polygon') {
    return getRenderFeaturesFromPolygon(feature as GeoJSON.Feature<GeoJSON.Polygon>)
  } else if (feature.geometry.type === 'MultiPolygon') {
    return getRenderFeaturesFromMultiPolygon(feature as GeoJSON.Feature<GeoJSON.MultiPolygon>)
  }
  return []
}

function getRenderFeaturesFromPoint(
  originFeature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>
) {
  const feature = clone(originFeature)
  feature.properties = {
    origin: 'point'
  }
  return [feature]
}

function getRenderFeaturesFromLineString(originFeature: GeoJSON.Feature<GeoJSON.LineString>) {
  const features: Array<FeatureType> = []
  const feature = clone(originFeature)
  feature.properties = {
    active: 'false',
    origin: 'line'
  }
  features.push(feature)
  originFeature.geometry.coordinates.forEach((item) => {
    const vertex = point(item, { active: 'false', type: 'vertex', origin: 'line' })
    features.push(vertex)
  })

  return features
}
function getRenderFeaturesFromMultiLineString(
  originFeature: GeoJSON.Feature<GeoJSON.MultiLineString>
) {
  const features: Array<FeatureType> = []
  const feature = clone(originFeature)
  feature.properties = {
    active: 'false',
    origin: 'line'
  }
  features.push(feature)
  originFeature.geometry.coordinates.forEach((item) => {
    item.forEach((coord) => {
      const vertex = point(coord, { active: 'false', type: 'vertex', origin: 'line' })
      features.push(vertex)
    })
  })
  return features
}
function getRenderFeaturesFromPolygon(originFeature: GeoJSON.Feature<GeoJSON.Polygon>) {
  const features: Array<FeatureType> = []
  const feature = clone(originFeature)
  feature.properties = {
    active: 'false',
    origin: 'polygon'
  }
  features.push(feature)

  const border = createLine(originFeature.geometry.coordinates[0] as Coordinates[], {
    active: 'false',
    type: 'border',
    origin: 'polygon'
  })
  border && features.push(border)

  const multiPointFe = multiPoint(originFeature.geometry.coordinates[0])
  cleanCoords(multiPointFe).geometry.coordinates.forEach((item: Coordinates) => {
    const vertex = point(item, { active: 'false', type: 'vertex', origin: 'polygon' })
    features.push(vertex)
  })
  return features
}

function getRenderFeaturesFromMultiPolygon(originFeature: GeoJSON.Feature<GeoJSON.MultiPolygon>) {
  const features: Array<FeatureType> = []
  const feature = clone(originFeature)
  feature.properties = {
    active: 'false',
    origin: 'polygon'
  }
  features.push(feature)

  originFeature.geometry.coordinates.forEach((item) => {
    const border = createLine(item[0] as Coordinates[], {
      active: 'false',
      type: 'border',
      origin: 'polygon'
    })
    border && features.push(border)
  })

  const list: Array<Coordinates> = []
  originFeature.geometry.coordinates.forEach((item) => {
    list.push(...(item[0] as Coordinates[]))
  })

  const multiPointFe = multiPoint(list)
  cleanCoords(multiPointFe).geometry.coordinates.forEach((item: Coordinates) => {
    const vertex = point(item, { active: 'false', type: 'vertex', origin: 'polygon' })
    features.push(vertex)
  })
  return features
}
