import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
interface Event<T> {
  type: string
  target: T
}

interface ClickEvent<T> extends Event<T> {
  lngLat: mapboxgl.LngLat
  data: any
}

interface EventType<T> {
  click: ClickEvent<T>
}

interface MarkerOptions extends Omit<mapboxgl.MarkerOptions, 'draggable' | 'element'> {
  element?: HTMLElement | ((data: any) => HTMLElement)
  [propName: string]: any
}

type Data = GeoJSON.FeatureCollection<GeoJSON.Point>

interface Options {
  key?: string
  data: Data
  markerOptions?: MarkerOptions
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
}

export default class MarkerPointLayer extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _data: Data
  private _key: string
  private _markerOptions: MarkerOptions | undefined
  private _markerMap: Map<number, mapboxgl.Marker>
  private _fitBoundsOptions: undefined | mapboxgl.FitBoundsOptions
  private _lngLatBounds?: mapboxgl.LngLatBoundsLike
  constructor(options: Options) {
    super()
    this._key = options.key ?? 'id'
    this._data = options.data
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions)
    this._setLngLatBounds(options.data)
    this._markerOptions = options.markerOptions
      ? {
          ...options.markerOptions,
          draggable: false
        }
      : {}
    this._markerMap = new Map()
    this._init()
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
    this._markerMap.forEach((item) => {
      item.addTo(this._map!)
    })
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }
    return this
  }

  remove() {
    if (this._map) {
      this._markerMap.forEach((item) => {
        item.remove()
      })
      this._map = undefined
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

  setData(data: Data) {
    this._data = data
    this._setLngLatBounds(data)
    this._clear()
    this._init()
    if (this._map) {
      this._markerMap.forEach((item) => {
        item.addTo(this._map!)
      })
      if (this._fitBoundsOptions) {
        this.fitBounds(this._fitBoundsOptions)
      }
    }
    return this
  }

  fitBounds(options?: mapboxgl.FitBoundsOptions) {
    if (this._lngLatBounds) {
      this._map?.fitBounds(this._lngLatBounds, options || this._fitBoundsOptions || {})
    }
    return this
  }

  on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void) {
    super.on(type, listener)
    return this
  }

  private _clear() {
    this._markerMap.forEach((item) => {
      item.remove()
    })
    this._markerMap.clear()
  }

  private _getFeature(valOfKey: string | number) {
    return this._data.features.find((item) => {
      return item.properties?.[this._key] === valOfKey
    })
  }

  private _getElement(element: HTMLElement | ((data: any) => HTMLElement), data: any) {
    if (typeof element === 'function') {
      return element(data)
    } else {
      return element.cloneNode(true) as HTMLElement
    }
  }

  private _getFitBoundsOptions(
    options?: boolean | mapboxgl.FitBoundsOptions
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _setLngLatBounds(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    this._lngLatBounds =
      data.features.length > 0
        ? (turf.bboxPolygon(turf.bbox(data)).bbox as mapboxgl.LngLatBoundsLike)
        : undefined
  }

  private _init() {
    this._data.features.forEach((item) => {
      const markerOptions = {
        ...this._markerOptions,
        element: this._markerOptions?.element
          ? this._getElement(this._markerOptions.element, item.properties)
          : undefined
      }
      const marker = new mapboxgl.Marker(markerOptions).setLngLat(
        item.geometry.coordinates as mapboxgl.LngLatLike
      )
      this._setMarkerEvent(marker, item.properties)
      this._markerMap.set(item.properties?.[this._key], marker)
    })
  }

  private _setMarkerEvent(marker: mapboxgl.Marker, data: any) {
    const markerElement = marker.getElement()
    markerElement.style.cursor = 'pointer'
    markerElement.addEventListener('click', (e) => {
      this.fire('click', {
        lngLat: marker.getLngLat(),
        data: JSON.parse(JSON.stringify(data))
      })
      // marker被点击后阻止冒泡
      e.stopPropagation()
    })
  }
}
