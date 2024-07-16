import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import layers, { LayerType } from './layers'
import { bindAll } from '../utils'
type Coordinates = [number, number]
type Cache = {
  data: Array<Coordinates>
  marker: mapboxgl.Marker
  features: Array<GeoJSON.Feature>
  acreage: number
}
type EventType = 'complete' | 'delete'

type EventData = {
  complete: {
    areaId: string
    acreage: number
    areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  }
  delete: {
    areaId: string
  }
}

type Event<T extends EventType> = EventData[T] & { type: T }

type Options = {
  multiple?: boolean
  layers?: Array<LayerType>
}

export default class AreaMeasurer extends mapboxgl.Evented {
  private _map: mapboxgl.Map | null
  private _enabled: boolean
  private _source = 'mapbox-postting-area-measurer-source'
  private _cacheMap: Map<string, Cache>
  private _current: {
    path: Array<Coordinates>
    marker: mapboxgl.Marker | null
  }
  private _next: number
  private _multiple: boolean
  private _layers: Array<LayerType>
  constructor(options?: Options) {
    super()
    this._map = null
    this._enabled = false
    this._current = {
      path: [],
      marker: null
    }
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
    return this
  }

  remove() {
    if (this._map) {
      this._handleEventListener('off')
      this._removeSourceAndLayer()
      this._map.getContainer().classList.remove('mapbox-postting-area-measurer-cursor')
    }
    this._map = null
    this._enabled = false
    this.clear()
  }

  enable() {
    if (this._map) {
      this._enabled = true
      this._map.getContainer().classList.add('mapbox-postting-area-measurer-cursor')
    }
  }

  disable() {
    if (this._next !== 0) {
      this._current.marker?.remove()
      this._current = {
        path: [],
        marker: null
      }
      this._next = 0
    }
    this._enabled = false
    if (this._map) {
      this._map.getContainer().classList.remove('mapbox-postting-area-measurer-cursor')
      this._render()
    }
  }

  clear() {
    this._cacheMap.forEach((cache) => {
      cache.marker.remove()
    })
    this._cacheMap.clear()
    if (this._next !== 0) {
      this._current.marker?.remove()
      this._current = {
        path: [],
        marker: null
      }
      this._next = 0
    }
    if (this._map) {
      this._render()
    }
    return this
  }

  getAllArea() {
    const list: Array<{
      areaId: string
      acreage: number
      areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    }> = []
    this._cacheMap.forEach((cache, id) => {
      list.push({
        areaId: id,
        acreage: cache.acreage,
        areaData: cache.features.find(
          (item) => item.geometry.type === 'Polygon' || item.geometry.type === 'MultiPolygon'
        ) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
      })
    })

    return list
  }

  getAreaById(areaId: string) {
    const cache = this._cacheMap.get(areaId)
    if (cache) {
      return {
        areaId,
        acreage: cache.acreage,
        areaData: cache.features.find(
          (item) => item.geometry.type === 'Polygon' || item.geometry.type === 'MultiPolygon'
        ) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
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
    } else if (!this._current.path[this._next]) {
      // 结束绘制
      this._finish()
    } else {
      // 更新最后一个顶点
      this._add([e.lngLat.lng, e.lngLat.lat])
    }
    this._render()
  }

  private _finish() {
    if (this._next < 3) return
    this._next = 0
    const id = Date.now().toString()
    const cache = createCache(this._current.path, 'false')
    addRemoveBtn(cache.marker, () => this._remove(id))
    cache.marker.addTo(this._map!)
    this._cacheMap.set(id, cache)
    this._current.marker?.remove()
    this._current = {
      path: [],
      marker: null
    }
    setTimeout(() => {
      this.fire('complete', {
        areaId: id,
        acreage: cache.acreage,
        areaData: cache.features.find(
          (item) => item.geometry.type === 'Polygon' || item.geometry.type === 'MultiPolygon'
        ) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
      })
    }, 10)
  }

  private _remove(id: string) {
    this._cacheMap.get(id)?.marker.remove()
    this._cacheMap.delete(id)
    this.fire('delete', {
      areaId: id
    })
    this._render()
  }

  private _add(coordinates: Coordinates) {
    this._update(coordinates)
    if (this._next >= 2 && !createPolygon([...this._current.path, this._current.path[0]], 'true')) {
      return
    }
    this._next++
  }

  private _update(coordinates: Coordinates) {
    this._current.path[this._next] = coordinates
  }

  private _render() {
    if (!this._map) return
    const source = this._map.getSource(this._source) as mapboxgl.GeoJSONSource
    const features: Array<GeoJSON.Feature> = []
    this._cacheMap.forEach((cache) => {
      features.push(...cache.features)
    })

    const currentCache = createCache(this._current.path, 'true')
    features.push(...currentCache.features)
    this._current.marker?.remove()
    this._current.marker = currentCache.marker
    this._current.marker?.addTo(this._map)
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

function createCache(data: Array<Coordinates>, active: 'true' | 'false'): Cache {
  const features: Array<GeoJSON.Feature> = []
  let marker: mapboxgl.Marker | null = null
  const line = createLine([...data, data[0]], active)
  line && features.push(line)
  const polygon = createPolygon([...data, data[0]], active)
  let acreage = 0
  if (polygon) {
    features.push(polygon)
    const lngLat = turf.center(polygon).geometry.coordinates as [number, number]
    acreage = turf.area(polygon)
    const text =
      acreage > 1000000
        ? (acreage / 1000000).toFixed(2) + '平方公里'
        : acreage.toFixed(2) + '平方米'
    marker = createMarker(lngLat, text)
  }
  data.forEach((item) => {
    const vertex = turf.point(item, { active })
    features.push(vertex)
  })
  return {
    data: [...data],
    features,
    marker: marker!,
    acreage
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

function createMarker(lngLat: [number, number], text: string) {
  const markerElem = document.createElement('div')
  markerElem.classList.add('mapbox-postting-area-measurer-marker')
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

function createPolygon(data: Array<Coordinates>, active: 'true' | 'false') {
  try {
    let polygon
    const polygons = turf.unkinkPolygon(turf.polygon([data]))
    if (polygons.features.length > 1) {
      polygon = turf.combine(polygons).features[0] as GeoJSON.Feature<GeoJSON.MultiPolygon>
    } else {
      polygon = polygons.features[0]
    }
    polygon.properties = {
      active
    }
    return polygon
  } catch (error) {
    return null
  }
}
