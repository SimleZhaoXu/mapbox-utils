import mapboxgl from 'mapbox-gl'
import { nanoid } from 'nanoid'
import { bindAll } from '../utils/index'

interface Event<T> {
  type: string
  target: T
}

interface PointChangeEvent<T> extends Event<T> {
  point: [number, number]
  pointList: Array<[number, number]>
}

interface PointClickEvent<T> extends Event<T> {
  point: [number, number]
}

interface EventType<T> {
  'get-point': PointChangeEvent<T>
  'click-point': PointClickEvent<T>
  'remove-point': PointChangeEvent<T>
}

interface Options {
  markerOptions?: Omit<mapboxgl.MarkerOptions, 'draggable'>
  multiple?: boolean
  removeOnClick?: boolean
}

export default class PointPicker extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _multiple: boolean
  private _removeOnClick: boolean
  private _markerOptions: Omit<mapboxgl.MarkerOptions, 'draggable'> | undefined
  private _pointMap: Map<string, { lngLat: mapboxgl.LngLat; marker: mapboxgl.Marker }> = new Map()
  constructor(options?: Options) {
    super()
    this._multiple = options?.multiple ?? false
    this._removeOnClick = options?.removeOnClick ?? false
    this._markerOptions = options?.markerOptions
    bindAll(['_onMapClick'], this)
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
    this._map.getCanvas().style.cursor = 'crosshair'
    this._map.on('click', this._onMapClick)
    return this
  }

  remove() {
    if (this._map) {
      this.removePoints()
      this._map.getCanvas().style.cursor = ''
      this._map.off('click', this._onMapClick)
      this._map = undefined
    }
    return this
  }

  setPoint(lngLat: mapboxgl.LngLatLike) {
    if (!this._map) return this
    if (!this._multiple) {
      this.removePoints()
    }
    // 打点
    const pointId = nanoid()
    const markerOptions = this._markerOptions
      ? {
          ...this._markerOptions,
          draggable: false,
          element: this._markerOptions.element?.cloneNode() ?? undefined
        }
      : {}
    const marker = new mapboxgl.Marker(markerOptions).setLngLat(lngLat).addTo(this._map)
    this._setMarkerEvent(pointId, marker)
    this._pointMap.set(pointId, {
      lngLat: marker.getLngLat(),
      marker
    })
    return this
  }

  getPoints() {
    return Array.from(this._pointMap).map((point) => point[1].lngLat.toArray())
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  private _onMapClick(e: mapboxgl.MapMouseEvent) {
    this.setPoint(e.lngLat)
    this.fire('get-point', {
      point: e.lngLat.toArray(),
      pointList: this.getPoints()
    })
  }

  private _setMarkerEvent(pointId: string, marker: mapboxgl.Marker) {
    const markerElement = marker.getElement()
    markerElement.style.cursor = 'pointer'
    markerElement.addEventListener('click', (e) => {
      if (this._removeOnClick) {
        // 点击后移除点位
        marker.remove()
        this._pointMap.delete(pointId)
        this.fire('remove-point', {
          point: marker.getLngLat().toArray(),
          pointList: this.getPoints()
        })
      } else {
        // 点位被点击事件
        this.fire('click-point', {
          point: marker.getLngLat().toArray()
        })
      }
      // marker被点击后阻止冒泡
      e.stopPropagation()
    })
  }

  removePoints() {
    this._pointMap.forEach((point) => {
      point.marker.remove()
    })
    this._pointMap.clear()
  }
}
