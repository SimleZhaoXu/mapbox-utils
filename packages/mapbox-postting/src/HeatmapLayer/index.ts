import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import { bindAll } from '../utils/index'
interface HeatMapOptions {
  data: GeoJSON.FeatureCollection<GeoJSON.Point>
  style?: mapboxgl.HeatmapPaint
  fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions
  minZoom?: number
  maxZoom?: number
}

export default class HeatmapLayer extends mapboxgl.Evented {
  private _map?: mapboxgl.Map
  private _id: string
  private _data: GeoJSON.FeatureCollection<GeoJSON.Point>
  private _styleOptions?: mapboxgl.HeatmapPaint
  private _sourceAndLayerId: string
  private _lngLatBounds?: mapboxgl.LngLatBoundsLike
  private _fitBoundsOptions?: mapboxgl.FitBoundsOptions
  private _minZoom: number
  private _maxZoom: number
  constructor(options: HeatMapOptions) {
    super()
    this._id = nanoid()
    this._sourceAndLayerId = `heatmap-layer-${this._id}`
    this._data = options.data
    this._styleOptions = options.style
    this._fitBoundsOptions = this._getFitBoundsOptions(options.fitBoundsOptions)
    this._setLngLatBounds()
    this._minZoom = options.minZoom ?? 0 // 最小层级，默认为0
    this._maxZoom = options.maxZoom ?? 24 // 最大层级，默认为24
    bindAll(['_onData'], this)
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
    this._addSourceAndLayer()
    this._map.on('data', this._onData)
    if (this._fitBoundsOptions) {
      this.fitBounds(this._fitBoundsOptions)
    }
    return this
  }

  remove() {
    if (this._map) {
      this._map.off('data', this._onData)
      this._map.removeLayer(this._sourceAndLayerId)
      this._map.removeSource(this._sourceAndLayerId)
      this._map = undefined
    }
    return this
  }

  setData(data: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    this._data = data
    this._setLngLatBounds()
    if (this._map) {
      const source = this._map.getSource(this._sourceAndLayerId) as mapboxgl.GeoJSONSource
      source.setData(this._data)
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

  private _onData(e: mapboxgl.MapDataEvent) {
    if (e.dataType === 'style') {
      setTimeout(() => {
        this._addSourceAndLayer()
      }, 10)
    }
  }

  private _setLngLatBounds() {
    this._lngLatBounds =
      this._data.features.length > 0
        ? (turf.bboxPolygon(turf.bbox(this._data)).bbox as mapboxgl.LngLatBoundsLike)
        : undefined
  }

  private _getFitBoundsOptions(
    options: boolean | mapboxgl.FitBoundsOptions | undefined
  ): undefined | mapboxgl.FitBoundsOptions {
    return options ? (options === true ? {} : options) : undefined
  }

  private _addSourceAndLayer() {
    if (!this._map) return
    if (!this._map.getLayer(this._sourceAndLayerId)) {
      this._map.addLayer({
        id: this._sourceAndLayerId,
        type: 'heatmap',
        minzoom: this._minZoom,
        maxzoom: this._maxZoom,
        source: {
          type: 'geojson',
          data: this._data
        },
        paint: this._styleOptions ?? {}
      })
    }
  }
}
