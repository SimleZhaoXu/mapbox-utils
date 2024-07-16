import mapboxgl from 'mapbox-gl'
import { distance, lineString, point, along, bearing, bboxPolygon, bbox } from '@turf/turf'
import { nanoid } from 'nanoid'
import { bindAll, deepClone } from '../utils'
type Data = Array<{
  coordinates: [number, number]
  timestamp?: number
}>

type SplittedPath = {
  start: [number, number]
  end: [number, number]
  length: number
  speed: number
  bearing: number
  startTime: number
  endTime: number
}

type OmitProperty = 'source' | 'source-layer' | 'id' | 'filter'
type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.SymbolLayer, OmitProperty>
  | Omit<mapboxgl.LineLayer, OmitProperty>
type LayerPool = {
  [k: string]: LayerType
}
type Options = {
  data?: Data
  speed?: number
  layerPool: LayerPool
  currentPathLayers?: string[]
  fullPathLayers?: string[]
  carLayers?: string[]
  nodeLayers?: string[]
  loop?: boolean
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

type EventType = 'moving' | 'complete'

type EventData = {
  moving: {
    timestamp: number
  }
  complete: {}
}

type Event<T extends EventType> = EventData[T] & { type: T }

export default class AdvanceCarTrack extends mapboxgl.Evented {
  private _data: Data
  private _map: mapboxgl.Map | null
  private _splittedPathData: Array<SplittedPath>
  private _fullPathData: GeoJSON.Feature<GeoJSON.LineString> | null
  private _source: string
  private _loop: boolean
  private _state: 0 | 1 | 2 // 0:停止播放；1:播放状态；2:暂停播放
  private _animationFrame: number
  private _trackTimeStamp: number
  private _realTimeStamp: number
  private _speed: number
  private _finished: boolean // 是否完成一次播放
  private _useTimeStamp: boolean
  private _lngLatBounds: mapboxgl.LngLatBoundsLike | null
  private _fitBoundsOptions: mapboxgl.FitBoundsOptions | undefined

  private _layerPool: LayerPool
  private _currentPathLayers: string[]
  private _fullPathLayers: string[]
  private _carLayers: string[]
  private _nodeLayers: string[]

  private _renderData: Array<GeoJSON.Feature>
  constructor(options: Options) {
    super()
    options = deepClone(options)
    this._renderData = []
    this._data = options.data || []
    this._fullPathData = null
    this._splittedPathData = []
    this._useTimeStamp = false
    this._layerPool = options.layerPool || {}
    this._currentPathLayers = options.currentPathLayers || []
    this._fullPathLayers = options.fullPathLayers || []
    this._carLayers = options.carLayers || []
    this._nodeLayers = options.nodeLayers || []
    this._trackTimeStamp = 0
    this._realTimeStamp = 0
    this._animationFrame = 0
    this._state = 0
    this._speed = options.speed || 1
    this._map = null
    this._finished = false
    this._loop = options.loop || false
    this._source = `mapbox-postting-car-track-${nanoid(8)}`
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions)
    this._lngLatBounds = null
    this._calcFullPath()
    this._calcSplittedPath()
    bindAll(['_animate', '_onData'], this)
  }

  get source(): string {
    return this._source
  }

  get currentPathLayers(): string[] {
    return this._currentPathLayers.map((layer) => `${this.source}-${layer}-current-path`)
  }

  get fullPathLayers(): string[] {
    return this._fullPathLayers.map((layer) => `${this.source}-${layer}-full-path`)
  }

  get carLayers(): string[] {
    return this._carLayers.map((layer) => `${this.source}-${layer}-car`)
  }

  get nodeLayers(): string[] {
    return this._nodeLayers.map((layer) => `${this.source}-${layer}-node`)
  }

  get layerPool(): LayerPool {
    const layerPool: LayerPool = {}
    Object.keys(this._layerPool).forEach((layer) => {
      if (this._currentPathLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-current-path`] = this._layerPool[layer]
      }
      if (this._fullPathLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-full-path`] = this._layerPool[layer]
      }
      if (this._carLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-car`] = this._layerPool[layer]
      }

      if (this._nodeLayers.includes(layer)) {
        layerPool[`${this.source}-${layer}-node`] = this._layerPool[layer]
      }
    })
    return layerPool
  }

  addTo(map: mapboxgl.Map) {
    if (this._map === map) {
      return this
    }
    this.remove()
    this._map = map
    this._addSourceAnyLayer()
    this._map.on('data', this._onData)
    this._init()
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }
    return this
  }

  fitBounds(options?: mapboxgl.FitBoundsOptions) {
    if (this._lngLatBounds) {
      this._map?.fitBounds(this._lngLatBounds, options || this._fitBoundsOptions || {})
    }
    return this
  }

  remove() {
    this._map?.off('data', this._onData)
    this.stop()
    this._removeSourceAndLayer()
    this._map = null
    this._renderData = []
    return this
  }

  play() {
    if (!this._map) return this
    if (!this._fullPathData) return this
    if (this._state === 1) return this
    this._state = 1
    this._realTimeStamp = Date.now()
    if (this._finished) {
      this._finished = false
      this._init()
    }
    this._animationFrame = requestAnimationFrame(this._animate)
    return this
  }

  pause() {
    if (!this._map) return this
    if (this._state !== 1) return this
    cancelAnimationFrame(this._animationFrame)
    this._state = 2
    return this
  }

  stop() {
    if (!this._map) return this
    cancelAnimationFrame(this._animationFrame)
    this._state = 0
    this._animationFrame = 0
    this._trackTimeStamp = 0
    this._realTimeStamp = 0
    this._finished = false
    this._init()
    return this
  }

  setSpeed(speed: number) {
    this._speed = speed
    return this
  }

  setTimestamp(timestamp: number) {
    if (!this._map) return this
    if (!this._useTimeStamp) return this
    this.pause()
    this._init(timestamp)
    this._firePlayingEvent()
    return this
  }

  setData(data: Data | null) {
    this.stop()
    this._data = data || []
    this._calcFullPath()
    this._calcSplittedPath()
    this._init()
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
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

  private _onData(e: mapboxgl.MapDataEvent) {
    if (e.dataType === 'style') {
      setTimeout(() => {
        this._addSourceAnyLayer()
      }, 10)
    }
  }

  private _getFitBoundsOptions(
    options?: boolean | mapboxgl.FitBoundsOptions
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _addSourceAnyLayer() {
    if (!this._map) return
    if (!this._map.getSource(this._source)) {
      this._map.addSource(this._source, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this._renderData
        },
        lineMetrics: true
      })
    }

    this.fullPathLayers.forEach((layerId) => {
      if (this._map?.getLayer(layerId)) return
      const layerOptions = this.layerPool[layerId]
      this._map?.addLayer({
        ...layerOptions,
        id: layerId,
        source: this._source,
        filter: ['all', ['==', '$type', 'LineString'], ['==', 'type', 'full-path']]
      })
    })

    this.currentPathLayers.forEach((layerId) => {
      if (this._map?.getLayer(layerId)) return
      const layerOptions = this.layerPool[layerId]
      this._map?.addLayer({
        ...layerOptions,
        id: layerId,
        source: this._source,
        filter: ['all', ['==', '$type', 'LineString'], ['==', 'type', 'current-path']]
      })
    })

    this.nodeLayers.forEach((layerId) => {
      if (this._map?.getLayer(layerId)) return
      const layerOptions = this.layerPool[layerId]
      this._map?.addLayer({
        ...layerOptions,
        id: layerId,
        source: this._source,
        filter: ['all', ['==', '$type', 'Point'], ['==', 'type', 'node']]
      })
    })

    this.carLayers.forEach((layerId) => {
      if (this._map?.getLayer(layerId)) return
      const layerOptions = this.layerPool[layerId]
      this._map?.addLayer({
        ...layerOptions,
        id: layerId,
        source: this._source,
        filter: ['all', ['==', '$type', 'Point'], ['==', 'type', 'car']]
      })
    })
  }

  private _removeSourceAndLayer() {
    if (!this._map) return

    this.fullPathLayers.forEach((layerId) => {
      if (!this._map?.getLayer(layerId)) return
      this._map.removeLayer(layerId)
    })

    this.currentPathLayers.forEach((layerId) => {
      if (!this._map?.getLayer(layerId)) return
      this._map.removeLayer(layerId)
    })

    this.carLayers.forEach((layerId) => {
      if (!this._map?.getLayer(layerId)) return
      this._map.removeLayer(layerId)
    })

    this.nodeLayers.forEach((layerId) => {
      if (!this._map?.getLayer(layerId)) return
      this._map.removeLayer(layerId)
    })

    if (this._map.getSource(this._source)) {
      this._map.removeSource(this._source)
    }
  }

  private _calcSplittedPath() {
    this._splittedPathData = []
    if (!this._fullPathData) return
    this._data.reduce((p, c, index) => {
      const startPoint = point(p.coordinates)
      const endPoint = point(c.coordinates)
      const length = distance(startPoint, endPoint, {
        units: 'meters'
      })
      let speed: number
      let startTime: number
      let endTime: number
      const next = { ...c }
      if (index === 1) {
        this._useTimeStamp = !!p.timestamp
      }

      if (this._useTimeStamp) {
        const interval = c.timestamp! - p.timestamp!
        speed = length / interval
        startTime = p.timestamp!
        endTime = c.timestamp!
      } else {
        speed = 1 / 1000
        startTime = index === 1 ? 0 : p.timestamp!
        endTime = startTime + Math.floor(length / speed)
        next.timestamp = endTime
      }

      this._splittedPathData.push({
        speed,
        length,
        startTime,
        endTime,
        start: [...p.coordinates],
        end: [...c.coordinates],
        bearing: bearing(startPoint, endPoint)
      })
      return next
    })
  }

  private _calcFullPath() {
    if (this._data.length > 1) {
      this._fullPathData = lineString(
        this._data.map((item) => item.coordinates),
        {
          type: 'full-path'
        }
      )
      this._lngLatBounds = bboxPolygon(bbox(this._fullPathData)).bbox as mapboxgl.LngLatBoundsLike
    } else {
      this._fullPathData = null
      this._lngLatBounds = null
    }
  }

  private _search(timestamp: number) {
    if (timestamp >= this._splittedPathData[this._splittedPathData.length - 1].endTime) {
      return this._splittedPathData.length - 1
    }
    if (timestamp <= this._splittedPathData[0].startTime) {
      return 0
    }
    let left = 0,
      right = this._splittedPathData.length - 1
    while (left <= right) {
      const mid = Math.floor((right - left) / 2) + left
      const path = this._splittedPathData[mid]
      if (path.startTime <= timestamp && path.endTime > timestamp) {
        return mid
      } else if (path.startTime > timestamp) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    }
    return -1
  }

  private _getNodeData(current: number) {
    return this._data.map((item, index) =>
      point(item.coordinates, {
        type: 'node',
        nodeType: index === 0 ? 'start' : index === this._data.length - 1 ? 'end' : 'common',
        nodeState: index > current ? 0 : 1
      })
    )
  }

  private _init(timestamp?: number) {
    if (!this._map) return
    if (!this._fullPathData) {
      this._renderData = []
    } else {
      if (timestamp) {
        this._trackTimeStamp = timestamp
        this._renderData = this._getRenderData()
      } else {
        this._renderData = [this._fullPathData, ...this._getNodeData(0)]
        const { start, bearing, startTime } = this._splittedPathData[0]
        this._trackTimeStamp = startTime
        this._renderData.push(point(start, { bearing, type: 'car' }))
      }
    }
    const source = this._map?.getSource(this._source) as mapboxgl.GeoJSONSource
    source?.setData({
      type: 'FeatureCollection',
      features: this._renderData
    })
  }

  private _animate() {
    if (!this._map) return
    if (this._state === 0 || this._state === 2) return
    if (this._finished) {
      this._state = 0
      // 回放完成
      this.fire('complete')
      if (this._loop) {
        this.play()
      }
      return
    }
    const now = Date.now()
    const interval = now - this._realTimeStamp
    this._realTimeStamp = now
    this._trackTimeStamp += interval * this._speed // 速度映射
    const source = this._map.getSource(this._source) as mapboxgl.GeoJSONSource
    this._renderData = this._getRenderData()
    source?.setData({
      type: 'FeatureCollection',
      features: this._renderData
    })

    this._useTimeStamp && this._firePlayingEvent()

    if (this._state === 1) {
      this._animationFrame = requestAnimationFrame(this._animate)
    }
  }

  private _firePlayingEvent() {
    this.fire('moving', {
      timestamp: this._trackTimeStamp
    })
  }

  private _getRenderData() {
    const renderData: Array<GeoJSON.Feature> = [this._fullPathData!]
    const current = this._search(this._trackTimeStamp)
    const { start, end, startTime, endTime, speed, length, bearing } =
      this._splittedPathData[current]
    const passedPath = this._splittedPathData.slice(0, current + 1)
    const passedTime = this._trackTimeStamp - startTime
    const passedLength = passedTime * speed
    let currentPoint
    this._finished = false
    if (passedLength >= length) {
      currentPoint = point(end)
      this._trackTimeStamp = endTime
      this._finished = current === this._splittedPathData.length - 1
      renderData.push(...this._getNodeData(current + 1))
    } else {
      currentPoint = along(lineString([start, end]), passedLength, { units: 'meters' })
      renderData.push(...this._getNodeData(current))
    }
    currentPoint.properties = { bearing, type: 'car' }
    renderData.push(currentPoint)
    const currentPathData = lineString(
      [...passedPath.map((item) => item.start), currentPoint.geometry.coordinates],
      {
        type: 'current-path'
      }
    )
    renderData.push(currentPathData)
    return renderData
  }
}
