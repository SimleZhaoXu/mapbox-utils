import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import AnyLayer from '../AnyLayer'
import { bindAll, defaultVertexStyle, defaultStrokeStyle as defaultLineStyle } from '../utils/index'

const linePaintKeys = [
  'line-opacity',
  'line-color',
  'line-width',
  'line-blur',
  'line-dasharray'
] as const

const vertexPaintKeys = [
  'vertex-radius',
  'vertex-color',
  'vertex-opacity',
  'vertex-stroke-width',
  'vertex-stroke-color',
  'vertex-stroke-opacity'
] as const

type VertexKeyMap = {
  'vertex-radius': 'circle-radius'
  'vertex-color': 'circle-color'
  'vertex-opacity': 'circle-opacity'
  'vertex-stroke-width': 'circle-stroke-width'
  'vertex-stroke-color': 'circle-stroke-color'
  'vertex-stroke-opacity': 'circle-stroke-opacity'
}

interface Event<T> {
  type: string
  target: T
}

interface FinishEvent<T> extends Event<T> {
  data: GeoJSON.Feature<GeoJSON.LineString>
  length: number
}

interface EventType<T> {
  finish: FinishEvent<T>
}

type Style = Pick<mapboxgl.LinePaint, (typeof linePaintKeys)[number]> & {
  [key in (typeof vertexPaintKeys)[number]]?: mapboxgl.CirclePaint[VertexKeyMap[key]]
}

interface StyleOptions {
  line?: mapboxgl.LinePaint
  vertex?: mapboxgl.CirclePaint
}

type VertexData = GeoJSON.FeatureCollection<GeoJSON.Point>

type LineData = GeoJSON.FeatureCollection<GeoJSON.LineString> | GeoJSON.Feature<GeoJSON.LineString>

interface Options {
  enableEnter?: boolean
  enableBackspace?: boolean
  style?: Style
  finishedStyle?: Style
}

export default class LinePicker extends mapboxgl.Evented {
  private _id: string
  private _map?: mapboxgl.Map
  private _enableEnter: boolean
  private _enableBackspace: boolean
  private _vertexLayer?: AnyLayer<'circle'>
  private _lineLayer?: AnyLayer<'line'>
  private _vertexList: Array<number[]>
  private _lineCoordinates: Array<number[]>
  private _picking: boolean
  private _pending: boolean
  private _finished: boolean
  private _preFinished: boolean
  private _preFinishedOnVertex: boolean
  private _mouseOnVertex: boolean
  private _data: GeoJSON.Feature<GeoJSON.LineString> | null
  private _style: StyleOptions
  private _finishedStyle: StyleOptions
  constructor(options?: Options) {
    super()
    this._id = nanoid()
    this._initState()
    this._initStyle(options?.style)
    this._initFinishedStyle(options?.finishedStyle)
    this._enableBackspace = options?.enableBackspace ?? false
    this._enableEnter = options?.enableEnter ?? false
    bindAll(
      [
        '_onMapClick',
        '_onMapDoubleClick',
        '_onMapMouseMove',
        '_onKeyup',
        '_onVertexMouseMove',
        '_onVertexMouseLeave'
      ],
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
    this._initLayer(this._style)
    this._setEventListeners('on')
    this._map.getCanvas().style.cursor = 'crosshair'
    return this
  }

  remove() {
    if (this._map) {
      this._setEventListeners('off')
      this._initState()
      this._removeLayer()
      this._map.getCanvas().style.cursor = ''
      this._map = undefined
    }
    return this
  }

  clear() {
    if (!this._map) return
    this._initState()
    this._initLayer(this._style)
  }

  getData() {
    if (this._finished) {
      return turf.clone(this._data!)
    }
    return null
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  private _initLayer(style: StyleOptions) {
    this._vertexLayer?.remove()
    this._lineLayer?.remove()
    this._vertexLayer = new AnyLayer({
      id: `line-picker-vertex-${this._id}`,
      type: 'circle',
      layerCursor: 'pointer',
      mapCursor: 'crosshair',
      data: this._getVertexSourceData(),
      paint: style.vertex
    })

    this._lineLayer = new AnyLayer({
      id: `line-picker-line-${this._id}`,
      type: 'line',
      data: this._getLineSourceData(),
      paint: style.line
    })
    this._lineLayer?.addTo(this._map!)
    this._vertexLayer?.addTo(this._map!)
  }

  private _getStyle(style: Style = {}) {
    const vertex = Object.create(null)
    const line = Object.create(null)
    const keyList = Object.keys(style) as Array<keyof Style>
    keyList.forEach((key) => {
      if (linePaintKeys.includes(key as (typeof linePaintKeys)[number])) {
        line[key] = style[key]
      } else if (vertexPaintKeys.includes(key as (typeof vertexPaintKeys)[number])) {
        vertex[key.replace('vertex', 'circle')] = style[key]
      }
    })
    return { line, vertex }
  }

  private _initStyle(style: Style = {}) {
    const style1 = this._getStyle(style)
    this._style = {
      line: {
        ...defaultLineStyle,
        ...style1.line
      },
      vertex: {
        ...defaultVertexStyle,
        ...style1.vertex,
        'circle-pitch-alignment': 'map'
      }
    }
  }

  private _initFinishedStyle(finishedStyle: Style = {}) {
    const style = this._getStyle(finishedStyle)
    this._finishedStyle = {
      line: {
        ...this._style.line,
        'line-dasharray': [1, 0],
        ...style.line
      },
      vertex: {
        ...this._style.vertex,
        ...style.vertex
      }
    }
  }

  private _initState() {
    this._data = null
    this._vertexList = []
    this._lineCoordinates = []
    this._picking = false
    this._pending = false
    this._finished = false
    this._preFinished = false
    this._preFinishedOnVertex = false
    this._mouseOnVertex = false
  }

  private _removeLayer() {
    this._vertexLayer?.remove()
    this._lineLayer?.remove()
    this._vertexLayer = undefined
    this._lineLayer = undefined
  }

  // TODO: 待优化
  // backspace() {
  //   if (this._finished || !this._picking) return
  //   if (this._vertexList.length > 1) {
  //     this._vertexList = [...this._vertexList.slice(0, -1)]
  //     const last = this._lineCoordinates[this._lineCoordinates.length - 1]
  //     this._lineCoordinates = [...this._vertexList, last]
  //     this._updateVertex()
  //     this._updateLine()
  //   }
  // }

  private _setEventListeners(type: 'on' | 'off' = 'on') {
    this._vertexLayer?.[type]('mousemove', this._onVertexMouseMove)
    this._vertexLayer?.[type]('mouseleave', this._onVertexMouseLeave)
    this._map![type]('click', this._onMapClick)
    this._map![type]('dblclick', this._onMapDoubleClick)
    this._map![type]('mousemove', this._onMapMouseMove)
    if (!this._enableBackspace && !this._enableEnter) return
    if (type === 'on') {
      window.addEventListener('keyup', this._onKeyup)
    } else {
      window.removeEventListener('keyup', this._onKeyup)
    }
  }

  private _updateVertex() {
    this._vertexLayer?.setData(this._getVertexSourceData())
  }

  private _updateLine() {
    this._data = this._getLineSourceData() as GeoJSON.Feature<GeoJSON.LineString>
    this._lineLayer?.setData(turf.clone(this._data))
  }

  private _onVertexMouseMove(e: mapboxgl.MapLayerMouseEvent) {
    if (this._finished || !this._picking) return
    const feature = e.features?.[0] as any
    this._mouseOnVertex = true
    this._handleMouseMove(this._vertexList[feature.properties.id])
  }

  private _onVertexMouseLeave() {
    if (this._finished || !this._picking) return
    this._mouseOnVertex = false
  }

  private _getIndex(lngLatList: Array<number[]>, lngLat: number[]) {
    return lngLatList.findIndex((item) => {
      return turf.booleanEqual(turf.point(item), turf.point(lngLat))
    })
  }

  // 这一块逻辑最重要
  private _handleMouseMove(lngLat: number[]) {
    this._lineCoordinates = [...this._vertexList]
    const index = this._getIndex(this._vertexList, lngLat)
    this._preFinished = false
    this._preFinishedOnVertex = false
    if (index === -1) {
      this._lineCoordinates.push(lngLat)
      this._preFinished = true
    } else {
      if (this._vertexList.length > 1) {
        if (index === this._vertexList.length - 2 || index === this._vertexList.length - 1) {
          this._preFinished = true
        } else {
          this._lineCoordinates.push(lngLat)
          index === 0 ? (this._preFinished = true) : (this._preFinishedOnVertex = true)
        }
      }
    }
    this._updateLine()
  }

  private _onMapMouseMove(e: mapboxgl.MapMouseEvent) {
    if (this._finished || !this._picking || this._mouseOnVertex) return
    this._handleMouseMove(e.lngLat.toArray())
  }

  private _onMapClick(e: mapboxgl.MapMouseEvent) {
    if (this._finished || this._pending) return
    if (!this._picking) {
      this._picking = true
      this._vertexList = [e.lngLat.toArray()]
      this._lineCoordinates = [...this._vertexList]
    } else {
      this._vertexList = [...this._lineCoordinates]
    }

    if (this._mouseOnVertex && this._preFinished) {
      this._complete()
    } else {
      this._updateVertex()
      this._updateLine()
      this._pending = true
      window.setTimeout(() => {
        // 避免双击时触发两次
        this._pending = false
      }, 250)
    }
  }

  private _complete() {
    this._picking = false
    this._finished = true
    this._setFinishedStyle()
    this.fire('finish', {
      data: turf.clone(this._data!),
      length: turf.length(this._data!, { units: 'meters' })
    })
  }

  private _onKeyup(e: KeyboardEvent) {
    if (e.code === 'Backspace') {
      // this._enableBackspace && this.backspace()
    } else if (e.code === 'Enter') {
      this._enableEnter && this._enterComplete()
    }
  }

  private _enterComplete() {
    if (this._finished || !this._picking || !(this._preFinished || this._preFinishedOnVertex))
      return
    this._vertexList = [...this._lineCoordinates]
    this._complete()
  }

  private _onMapDoubleClick(e: mapboxgl.MapMouseEvent) {
    e.preventDefault()
    if (this._finished || !this._picking || !(this._preFinished || this._preFinishedOnVertex))
      return
    this._complete()
  }

  private _setFinishedStyle() {
    this._initLayer(this._finishedStyle)
  }

  private _getVertexSourceData(): VertexData {
    return turf.featureCollection(
      this._vertexList.map((vertex, index) => {
        return turf.point(vertex, { id: index })
      })
    )
  }

  private _getLineSourceData(): LineData {
    if (this._lineCoordinates.length > 1) {
      return turf.lineString(this._lineCoordinates)
    } else {
      return turf.featureCollection([])
    }
  }
}
