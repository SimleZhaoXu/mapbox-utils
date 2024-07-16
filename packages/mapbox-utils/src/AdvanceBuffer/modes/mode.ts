import mapboxgl from 'mapbox-gl'
import { lineString } from '@turf/turf'
export type FeatureType =
  | GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>
  | GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>
  | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
export default abstract class MODE extends mapboxgl.Evented {
  protected _next: number
  protected _path: Array<[number, number]>
  constructor() {
    super()
    this._next = 0
    this._path = []
  }

  get next() {
    return this._next
  }

  abstract clear(): void

  abstract getFeatures(): {
    feature: FeatureType | null
    renderFeatures: Array<FeatureType>
  }

  abstract onClick(e: mapboxgl.MapMouseEvent): boolean

  abstract onMouseMove(e: mapboxgl.MapMouseEvent): boolean

  abstract onDblClick(e: mapboxgl.MapMouseEvent): void
}

export function createLine(
  data: Array<[number, number]>,
  properties: any = {}
): GeoJSON.Feature<GeoJSON.LineString> | null {
  try {
    return lineString(data, { ...properties })
  } catch (error) {
    return null
  }
}
