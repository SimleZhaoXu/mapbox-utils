import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { nanoid } from 'nanoid'
import { bindAll } from '../utils/index'
type LayerType = 'line' | 'circle' | 'symbol' | 'fill' | 'fill-extrusion'
interface Paint {
  line: mapboxgl.LinePaint
  circle: mapboxgl.CirclePaint
  symbol: mapboxgl.SymbolPaint
  fill: mapboxgl.FillPaint
  'fill-extrusion': mapboxgl.FillExtrusionPaint
}

interface Layout {
  line: mapboxgl.LineLayout
  circle: mapboxgl.CircleLayout
  symbol: mapboxgl.SymbolLayout
  fill: mapboxgl.FillLayout
  'fill-extrusion': mapboxgl.FillExtrusionLayout
}

interface Feature {
  line:
    | GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  circle: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>
  symbol: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>
  fill: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  'fill-extrusion': GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
}

interface FeatureCollection {
  line:
    | GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>
    | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  circle: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>
  symbol: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>
  fill: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  'fill-extrusion': GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>
}

type Data<T extends LayerType> = FeatureCollection[T] | Feature[T]
const cursors = [
  'default',
  'crosshair',
  'pointer',
  'move',
  'e-resize',
  'ne-resize',
  'nw-resize',
  'n-resize',
  'se-resize',
  'sw-resize',
  's-resize',
  'w-resize',
  'text',
  'wait',
  'help'
] as const
interface Options<T extends LayerType> {
  id?: string
  layerCursor?: (typeof cursors)[number]
  mapCursor?: (typeof cursors)[number]
  type: T
  data?: Data<T>
  paint?: Paint[T]
  layout?: Layout[T]
}

export default class AnyLayer<T extends LayerType> {
  private _id: string
  private _data?: Data<T>
  private _map?: mapboxgl.Map
  private _type: T
  private _layerId: string
  private _paint?: Paint[T]
  private _layout?: Layout[T]
  private _layerCursor?: (typeof cursors)[number]
  private _mapCursor?: (typeof cursors)[number]
  constructor(options: Options<T>) {
    this._id = options.id ?? nanoid()
    this._type = options.type
    this._layerId = `${this._type}-${this._id}`
    this._data = options.data
    this._paint = options.paint
    this._layout = options.layout
    this._layerCursor =
      options.layerCursor && cursors.includes(options.layerCursor) ? options.layerCursor : undefined
    this._mapCursor =
      options.mapCursor && cursors.includes(options.mapCursor) ? options.mapCursor : undefined
    bindAll(['_onMouseEnter', '_onMouseLeave', '_onData'], this)
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
    this._addLayerAndSource()
    this.on('mouseenter', this._onMouseEnter)
    this.on('mouseleave', this._onMouseLeave)
    this._map.on('data', this._onData)
    return this
  }

  remove() {
    if (this._map) {
      this._removeLayerAndSource()
      this.off('mouseenter', this._onMouseEnter)
      this.off('mouseleave', this._onMouseLeave)
      this._map.off('data', this._onData)
      this._map = undefined
    }
    return this
  }

  setData(data: Data<T>) {
    this._data = data
    if (this._map) {
      const source = this._map.getSource(this._layerId) as mapboxgl.GeoJSONSource
      source?.setData(data)
    }
    return this
  }

  on(type: mapboxgl.MapMouseEvent['type'], callback: (e: mapboxgl.MapLayerMouseEvent) => void) {
    this._map?.on(type, this._layerId, callback)
    return this
  }

  off(type: mapboxgl.MapMouseEvent['type'], callback: (e: mapboxgl.MapLayerMouseEvent) => void) {
    this._map?.off(type, this._layerId, callback)
    return this
  }

  setStyle({ paint, layout }: { paint?: Paint[T]; layout?: Layout[T] }) {
    if (paint) {
      this._paint = { ...this._paint, ...paint }
      if (this._map) {
        const keys = Object.keys(paint) as Array<keyof Paint[T]>
        keys.forEach((key) => {
          this._map!.setPaintProperty(this._layerId, key as string, paint[key])
        })
      }
    }

    if (layout) {
      this._layout = { ...this._layout, ...layout }
      if (this._map) {
        const keys = Object.keys(layout) as Array<keyof Layout[T]>
        keys.forEach((key) => {
          this._map!.setLayoutProperty(this._layerId, key as string, layout[key])
        })
      }
    }
    return this
  }

  querySourceFeature(options: { filter?: any[]; validate?: boolean }) {
    return this._map?.querySourceFeatures(this._layerId, {
      ...(options || {}),
      sourceLayer: this._layerId
    })
  }

  queryFeatureFormData(key: string, val: any) {
    let feature: Feature[T] | undefined = undefined
    if (!this._data) return feature
    if (this._data.type === 'FeatureCollection') {
      return (<Array<any>>this._data.features).find((item: any) => {
        return item.properties?.[key] === val
      })
    } else if (this._data.type === 'Feature' && this._data.properties?.[key] === val) {
      feature = turf.clone(this._data)
    }
    return feature
  }

  getSource() {
    return this._map?.getSource(this._layerId)
  }

  private _addLayerAndSource() {
    if (!this._map) return
    if (this._map.getLayer(this._layerId)) return
    this._map.addLayer({
      id: this._layerId,
      type: this._type,
      source: {
        type: 'geojson',
        data: this._data ?? turf.featureCollection([])
      },
      layout: this._layout || {},
      paint: (this._paint as any) || {}
    })
  }

  private _onMouseEnter(e: mapboxgl.MapLayerMouseEvent) {
    this._layerCursor && (e.target.getCanvas().style.cursor = this._layerCursor)
  }

  private _onMouseLeave(e: mapboxgl.MapLayerMouseEvent) {
    this._layerCursor && (e.target.getCanvas().style.cursor = this._mapCursor ?? '')
  }

  private _onData(e: mapboxgl.MapDataEvent) {
    if (e.dataType === 'style') {
      setTimeout(() => {
        this._addLayerAndSource()
      }, 10)
    }
  }

  private _removeLayerAndSource() {
    if (this._map?.getLayer(this._layerId)) {
      this._map.removeLayer(this._layerId)
    }

    if (this._map?.getSource(this._layerId)) {
      this._map.removeSource(this._layerId)
    }
  }
}
