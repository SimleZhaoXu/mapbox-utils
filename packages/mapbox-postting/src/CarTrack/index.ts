import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import AnyLayer from '../AnyLayer'
import {
  linePaintKeys,
  lineLayoutKeys,
  circlePaintKeys,
  symbolPaintKeys,
  symbolLayoutKeys
} from '../utils/style'
import { bindAll } from '../utils/index'

interface Event<T> {
  type: string
  target: T
}

interface EventType<T> {
  finish: Event<T>
}

type PathStyle = Pick<
  mapboxgl.LinePaint & mapboxgl.LineLayout,
  (typeof linePaintKeys)[number] | (typeof lineLayoutKeys)[number]
>

type CircleStyle = Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]>

type SymbolStyle = Pick<
  mapboxgl.SymbolLayout & mapboxgl.SymbolPaint,
  (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]
>

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

const defaultCurrentPathStyle: PathStyle = {
  'line-width': 5,
  'line-color': '#f00',
  'line-cap': 'round',
  'line-join': 'round'
}

const defaultPathStyle: PathStyle = {
  'line-width': 5,
  'line-color': '#0f0',
  'line-cap': 'round',
  'line-join': 'round'
}

interface PathOptions {
  show?: boolean
  style?: PathStyle
}

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

const units = ['meters', 'kilometers'] as const
type Data = Array<number[]>
interface Options {
  data: Data
  speed?: number
  loop?: boolean
  carLayer?: CircleCarOptions | SymbolCarOptions
  pathLayer?: PathOptions & { isFull?: boolean }
  currentPathLayer?: PathOptions
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export default class CarTrack extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _id: string
  private _data: Data
  private _carLayer?: AnyLayer<'symbol' | 'circle'>
  private _pathLayer?: AnyLayer<'line'>
  private _currentPathLayer?: AnyLayer<'line'>
  private _carLayerData: GeoJSON.Feature<GeoJSON.Point>
  private _currentPathLayerData?: GeoJSON.Feature<GeoJSON.LineString>
  private _originPathLayerData: GeoJSON.Feature<GeoJSON.LineString>
  private _lngLatBounds: mapboxgl.LngLatBoundsLike
  private _fitBoundsOptions: undefined | mapboxgl.FitBoundsOptions
  private _isFull: boolean
  private _units: (typeof units)[number]
  private _speed: number
  private _loop: boolean
  private _current: number
  private _bearing: number
  private _isPlaying: boolean
  private _startTime: number
  private _finished: boolean
  private _currentLength: number
  private _routeLength: number
  private _pointLength: Array<number>
  private _fRecord: number
  private _pending: boolean
  private _layerOptions: {
    carLayer: NonNullable<Options['carLayer']>
    currentPathLayer: NonNullable<Options['currentPathLayer']>
    pathLayer: NonNullable<Options['pathLayer']>
  }
  constructor(options: Options) {
    super()
    this._id = nanoid()
    this._data = options.data
    this._isFull = options.pathLayer?.isFull ?? true
    this._units = 'kilometers'
    this._speed = options.speed ?? 5
    this._loop = options.loop ?? true
    this._originPathLayerData = turf.lineString(this._data)
    this._initLength()
    this._initState()
    this._layerOptions = {
      carLayer: options.carLayer
        ? { show: false, type: 'circle', ...options.carLayer }
        : { show: false, type: 'circle' },
      currentPathLayer: options.currentPathLayer
        ? { show: true, ...options.currentPathLayer }
        : { show: true },
      pathLayer: options.pathLayer ? { show: true, ...options.pathLayer } : { show: true }
    }
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions)
    this._lngLatBounds = turf.bboxPolygon(turf.bbox(this._originPathLayerData))
      .bbox as mapboxgl.LngLatBoundsLike
    bindAll(['_animate'], this)
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
    this._initLayer()
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }

    return this
  }

  remove() {
    if (this._map) {
      cancelAnimationFrame(this._fRecord)
      this._initState()
      this._pathLayer?.remove()
      this._currentPathLayer?.remove()
      this._carLayer?.remove()
      this._map = undefined
    }
    return this
  }

  setSpeed(speed: number) {
    this._speed = speed
    return this
  }

  fitBounds(options?: mapboxgl.FitBoundsOptions) {
    if (this._lngLatBounds) {
      this._map?.fitBounds(this._lngLatBounds, options || this._fitBoundsOptions || {})
    }
    return this
  }

  stop() {
    cancelAnimationFrame(this._fRecord)
    this._initState()
    this._carLayer?.setData(this._carLayerData)
    this._currentPathLayer?.setData(turf.featureCollection([]) as any)
    if (!this._isFull) {
      this._pathLayer?.setData(this._originPathLayerData)
    }
  }

  play() {
    if (this._isPlaying) return
    if (this._finished) {
      this._initState()
    }
    this._isPlaying = true
    this._fRecord = requestAnimationFrame(this._animate)
  }

  pause() {
    if (!this._isPlaying) return
    this._isPlaying = false
    cancelAnimationFrame(this._fRecord)
    this._pending = true
  }

  replay() {
    cancelAnimationFrame(this._fRecord)
    this._initState()
    this.play()
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  private _initState() {
    this._current = 0
    this._isPlaying = false
    this._startTime = 0
    this._finished = false
    this._currentLength = 0
    this._pending = false
    this._bearing = turf.bearing(turf.point(this._data[0]), turf.point(this._data[1]))
    this._carLayerData = turf.point(this._data[0], {
      bearing: this._bearing
    })
    this._currentPathLayerData = undefined
  }

  private _initLength() {
    this._pointLength = []
    let length = 0
    this._data.forEach((item, index) => {
      if (index !== 0) {
        const distance = turf.distance(turf.point(item), turf.point(this._data[index - 1]), {
          units: this._units
        })
        length += distance
      }
      this._pointLength.push(length)
    })
    this._routeLength = length
  }

  private _animate(timestamp: number) {
    if (this._pending) {
      // 暂停后再继续播放的等待，重置上一次移动的时间戳
      this._pending = false
      this._startTime = timestamp
      this._fRecord = requestAnimationFrame(this._animate)
      return
    }
    let pathLayerData: GeoJSON.Feature<GeoJSON.LineString> | undefined = undefined
    if (this._startTime === 0) {
      // 此时在起点
      this._startTime = timestamp
      pathLayerData = this._originPathLayerData
    } else {
      // 距离上次移动的时间间隔
      const passedTime = timestamp - this._startTime
      // 记录下本次移动的时间戳
      this._startTime = timestamp
      // 计算本次移动后离起点的距离
      this._currentLength += (passedTime / 1000) * this._speed
      if (this._currentLength >= this._routeLength) {
        // 如果移动后离起点的距离大于等于路线全长时，则直接移动到终点，改变状态，已走完全部路程
        this._carLayerData = turf.point(this._data[this._data.length - 1])
        this._currentLength = this._routeLength
        this._finished = true
        this._currentPathLayerData = this._originPathLayerData
      } else {
        // 如果移动后离起点的距离小于路线全长时，则计算移动后的位置
        // 小车位置
        this._carLayerData = turf.along(this._originPathLayerData, this._currentLength)
        // 寻找路线的下一个拐点，以计算方向
        let i = this._current
        while (i < this._pointLength.length) {
          if (this._pointLength[i] > this._currentLength) {
            break
          }
          i++
        }
        // 如果下一个拐点变化了，则需要重新计算方向
        if (i !== this._current) {
          this._current = i
          this._bearing = turf.bearing(this._carLayerData, turf.point(this._data[this._current]))
        }
        // 计算已走过的路径
        this._currentPathLayerData = turf.lineString([
          ...this._data.slice(0, this._current),
          this._carLayerData.geometry.coordinates
        ])
        pathLayerData = turf.lineString([
          this._carLayerData.geometry.coordinates,
          ...this._data.slice(this._current)
        ])
      }
    }
    this._carLayerData.properties = {
      bearing: this._bearing
    }
    this._carLayer?.setData(this._carLayerData)

    if (!this._isFull) {
      this._pathLayer?.setData(pathLayerData ?? turf.featureCollection<GeoJSON.LineString>([]))
    }

    this._currentPathLayer?.setData(
      this._currentPathLayerData ?? turf.featureCollection<GeoJSON.LineString>([])
    )
    if (this._finished) {
      // 已经移动到终点
      if (this._loop) {
        // 若循环播放，则移动到起点重新播放
        this._initState()
        this._isPlaying = true
      } else {
        // 若不循环播放，则停止
        this._isPlaying = false
        this.fire('finish')
      }
    }
    this._isPlaying && (this._fRecord = requestAnimationFrame(this._animate))
  }

  private _getFitBoundsOptions(
    options?: boolean | mapboxgl.FitBoundsOptions
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
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

  private _getPathStyle(style: PathStyle) {
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

  private _initLayer() {
    const { carLayer, currentPathLayer, pathLayer } = this._layerOptions

    if (pathLayer.show) {
      this._pathLayer = new AnyLayer({
        id: `car-track-full-path-${this._id}`,
        type: 'line',
        data: this._originPathLayerData,
        ...this._getPathStyle({
          ...defaultPathStyle,
          ...(pathLayer?.style ?? {})
        })
      })
    }

    if (currentPathLayer.show) {
      this._currentPathLayer = new AnyLayer({
        id: `car-track-current-path-${this._id}`,
        type: 'line',
        ...this._getPathStyle({
          ...defaultCurrentPathStyle,
          ...(currentPathLayer?.style ?? {})
        })
      })
    }

    if (carLayer.show && carLayer.type !== 'symbol') {
      this._carLayer = new AnyLayer({
        id: `car-track-car-${this._id}`,
        type: 'circle',
        data: this._carLayerData,
        paint: this._getCirclePaint({
          ...defaultCircleStyle,
          ...(carLayer?.style ?? {})
        })
      })
    }
    if (carLayer.show && carLayer.type === 'symbol') {
      this._carLayer = new AnyLayer({
        id: `car-track-car-${this._id}`,
        type: 'symbol',
        data: this._carLayerData,
        ...this._getSymbolStyle({
          ...defaultSymbolStyle,
          ...(carLayer.style ?? {})
        })
      })
    }

    this._pathLayer?.addTo(this._map!)
    this._currentPathLayer?.addTo(this._map!)
    this._carLayer?.addTo(this._map!)
  }
}
