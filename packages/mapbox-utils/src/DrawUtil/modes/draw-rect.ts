import MODE, { FeatureType } from './mode'
import { point, lineString, bbox, featureCollection, bboxPolygon } from '@turf/turf'
export default class DrawRect extends MODE {
  constructor() {
    super()
  }

  getFeatures(active: 'true' | 'false' = 'true') {
    if (!this._path.length) {
      return {
        feature: null,
        renderFeatures: []
      }
    }
    const features: Array<FeatureType> = []
    let rect: GeoJSON.Feature<GeoJSON.Polygon> | null = null
    if (this._path.length === 2) {
      rect = bboxPolygon(bbox(featureCollection([point(this._path[0]), point(this._path[1])])), {
        properties: { active, origin: 'rect' }
      })
      delete rect.bbox
      features.push(rect)
      const line = lineString(rect.geometry.coordinates[0], {
        active,
        type: 'border',
        origin: 'rect'
      })
      features.push(line)
      rect.geometry.coordinates[0].forEach((item) => {
        const vertex = point(item, { active, type: 'vertex', origin: 'rect' })
        features.push(vertex)
      })
    } else if (this._path[0]) {
      const vertex = point(this._path[0], { active, type: 'vertex', origin: 'rect' })
      features.push(vertex)
    }
    return {
      feature: rect,
      renderFeatures: features
    }
  }

  onClick(e: mapboxgl.MapMouseEvent) {
    this._path[this._next] = [e.lngLat.lng, e.lngLat.lat]
    if (this._next === 1) {
      // 结束
      this.fire('finished', {
        data: this.getFeatures('false')
      })
      this._next = 0
      this._path = []
      return false
    }
    this._next++
    return true
  }

  onMouseMove(e: mapboxgl.MapMouseEvent) {
    if (this._next === 0) return false
    this._path[this._next] = [e.lngLat.lng, e.lngLat.lat]
    return true
  }

  onDblClick(e: mapboxgl.MapMouseEvent) {
    e.preventDefault()
  }

  clear() {
    if (this._next !== 0) {
      this._path = []
      this._next = 0
    }
  }
}
