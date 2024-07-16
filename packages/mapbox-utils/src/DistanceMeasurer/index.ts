import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import layers, { LayerType } from './layers'
import { bindAll } from '../utils'
type Coordinates = [number, number]
type Path = {
  coordinates: Coordinates
  marker: mapboxgl.Marker
}
type Cache = {
  data: Array<Path>
  features: Array<GeoJSON.Feature>
  length: number
}

type EventType = 'complete' | 'delete'

type EventData = {
  complete: {
    pathId: string
    length: number
    pathData: GeoJSON.Feature<GeoJSON.LineString>
  }
  delete: {
    pathId: string
  }
}

type Event<T extends EventType> = EventData[T] & { type: T }

type Options = {
  multiple?: boolean
  layers?: Array<LayerType>
}

export default class DistanceMeasurer extends mapboxgl.Evented {
  private _map: mapboxgl.Map | null
  private _enabled: boolean
  private _source = 'mapbox-utils-distance-measurer-source'
  private _cacheMap: Map<string, Cache>
  private _currentPath: Array<Path>
  private _next: number
  private _multiple: boolean
  private _layers: Array<LayerType>
  constructor(options?: Options) {
    super()
    this._map = null
    this._enabled = false
    this._currentPath = []
    this._cacheMap = new Map()
    this._next = 0
    this._multiple = options?.multiple ?? false
    this._layers = options?.layers || layers
    bindAll(['_OnDblClick', '_onClick', '_onMousemove', '_onData'], this)
  }

  addTo(map: mapboxgl.Map) {
    if (this._map === map) {
      return
    }
    this.remove()
    this._map = map
    this._addSourceAnyLayer()
    this._handleEventListener('on')
    this._render()
    return this
  }

  remove() {
    if (this._map) {
      this._handleEventListener('off')
      this._removeSourceAndLayer()
      this._map.getContainer().classList.remove('mapbox-utils-distance-measurer-cursor')
    }
    this._map = null
    this._enabled = false
    this.clear()
  }

  enable() {
    if (this._map) {
      this._enabled = true
      this._map.getContainer().classList.add('mapbox-utils-distance-measurer-cursor')
    }
  }

  disable() {
    if (this._next !== 0) {
      this._currentPath.forEach((item) => item.marker.remove())
      this._currentPath = []
      this._next = 0
    }
    this._enabled = false
    if (this._map) {
      this._map.getContainer().classList.remove('mapbox-utils-distance-measurer-cursor')
      this._render()
    }
  }

  clear() {
    this._cacheMap.forEach((cache) => {
      cache.data.forEach((item) => {
        item.marker.remove()
      })
    })
    this._cacheMap.clear()
    if (this._next !== 0) {
      this._currentPath.forEach((item) => item.marker.remove())
      this._currentPath = []
      this._next = 0
    }
    if (this._map) {
      this._render()
    }
    return this
  }

  getAllPath() {
    const list: Array<{
      pathId: string
      length: number
      pathData: GeoJSON.Feature<GeoJSON.LineString>
    }> = []
    this._cacheMap.forEach((cache, id) => {
      list.push({
        pathId: id,
        length: cache.length,
        pathData: cache.features.find(
          (item) => item.geometry.type === 'LineString'
        ) as GeoJSON.Feature<GeoJSON.LineString>
      })
    })

    return list
  }

  getPathById(pathId: string) {
    const cache = this._cacheMap.get(pathId)
    if (cache) {
      return {
        pathId,
        length: cache.length,
        pathData: cache.features.find(
          (item) => item.geometry.type === 'LineString'
        ) as GeoJSON.Feature<GeoJSON.LineString>
      }
    } else {
      return null
    }
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
    if (this._enabled) {
      e.preventDefault()
    }
  }
  private _onMousemove(e: mapboxgl.MapMouseEvent) {
    if (!this._enabled) return
    if (this._next === 0) return
    // 更新最后一个顶点
    this._update([e.lngLat.lng, e.lngLat.lat])
    this._render()
  }
  private _onClick(e: mapboxgl.MapMouseEvent) {
    if (!this._enabled) return
    if (this._next === 0) {
      if (!this._multiple) {
        this.clear()
      }
      // 添加第一个顶点
      this._add([e.lngLat.lng, e.lngLat.lat])
    } else if (!this._currentPath[this._next]) {
      // 结束绘制
      this._finish()
    } else {
      // 添加一个顶点
      this._add([e.lngLat.lng, e.lngLat.lat])
    }
    this._render()
  }

  private _finish() {
    if (this._next < 2) return
    this._next = 0
    const id = Date.now().toString()
    const cache = createCache(this._currentPath, 'false')
    addRemoveBtn(cache.data[cache.data.length - 1].marker, () => this._remove(id))
    this._cacheMap.set(id, cache)
    this._currentPath = []
    setTimeout(() => {
      this.fire('complete', {
        pathId: id,
        length: cache.length,
        pathData: cache.features.find(
          (item) => item.geometry.type === 'LineString'
        ) as GeoJSON.Feature<GeoJSON.LineString>
      })
    }, 10)
  }

  private _remove(id: string) {
    this._cacheMap.get(id)?.data.forEach((item) => {
      item.marker?.remove()
    })
    this._cacheMap.delete(id)
    this.fire('delete', {
      pathId: id
    })
    this._render()
  }

  private _add(coordinates: Coordinates) {
    this._update(coordinates)
    this._next++
  }

  private _update(coordinates: Coordinates) {
    const text =
      this._currentPath.length > 1
        ? getPathLength([...this._currentPath.map((item) => item.coordinates), coordinates])
        : '起点'
    if (this._currentPath[this._next]) {
      this._currentPath[this._next].coordinates = coordinates
      this._currentPath[this._next].marker.getElement().innerText = text
      this._currentPath[this._next].marker.setLngLat(coordinates)
    } else {
      this._currentPath[this._next] = {
        coordinates,
        marker: createMarker(coordinates, text)
      }
    }
  }

  private _render() {
    if (!this._map) return
    const source = this._map.getSource(this._source) as mapboxgl.GeoJSONSource
    const features: Array<GeoJSON.Feature> = []
    this._cacheMap.forEach((cache) => {
      features.push(...cache.features)
    })

    const currentCache = createCache(this._currentPath, 'true')
    features.push(...currentCache.features)
    currentCache.data.forEach((item) => {
      item.marker?.addTo(this._map!)
    })

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

function createCache(data: Array<Path>, active: 'true' | 'false'): Cache {
  const features: Array<GeoJSON.Feature> = []
  const lineData = data.map((item) => item.coordinates)
  const line = createLine(lineData, active)
  let length = 0
  if (line) {
    features.push(line)
    length = turf.length(line, {
      units: 'kilometers'
    })
  }
  lineData.forEach((item) => {
    const vertex = turf.point(item, { active })
    features.push(vertex)
  })
  return {
    data: [...data],
    features,
    length
  }
}

function addRemoveBtn(marker: mapboxgl.Marker, removeCallBack?: () => void) {
  const markerElem = marker.getElement()
  const text = markerElem.innerText
  markerElem.innerHTML = ''
  const wrapper = document.createElement('div')
  const label = document.createElement('span')
  label.innerText = text
  const closeBtn = document.createElement('span')
  closeBtn.classList.add('remove-btn')
  wrapper.appendChild(label)
  wrapper.appendChild(closeBtn)
  markerElem.appendChild(wrapper)
  closeBtn.addEventListener(
    'click',
    (e) => {
      removeCallBack && removeCallBack()
      e.stopPropagation()
    },
    true
  )
}

function getPathLength(data: Array<Coordinates>) {
  const distance = turf.length(turf.lineString(data), {
    units: 'kilometers'
  })

  if (distance < 1) {
    return (distance * 1000).toFixed(0) + '米'
  }
  return distance.toFixed(1) + '公里'
}

function createMarker(lngLat: [number, number], text: string) {
  const markerElem = document.createElement('div')
  markerElem.classList.add('mapbox-utils-distance-measurer-marker')
  const marker = new mapboxgl.Marker({
    element: markerElem,
    anchor: 'bottom',
    offset: [0, -10]
  })
  marker.setLngLat(lngLat)
  marker.getElement().innerText = text
  return marker
}
function createLine(data: Array<Coordinates>, active: 'true' | 'false') {
  try {
    return turf.lineString(data, { active })
  } catch (error) {
    return null
  }
}
