import MODE, { FeatureType } from './mode'
import { point, circle, rhumbDistance, lineString } from '@turf/turf'
export default class DrawCircle extends MODE {
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
    let circleFeature: GeoJSON.Feature<GeoJSON.Polygon> | null = null
    if (this._path.length === 2) {
      const center = point(this._path[0])
      const radius = rhumbDistance(center, point(this._path[1]))
      circleFeature = circle(center, radius, {
        steps: 512,
        properties: {
          active,
          origin: 'circle'
        }
      })
      features.push(circleFeature)
      const line = lineString(circleFeature.geometry.coordinates[0], {
        active,
        type: 'border',
        origin: 'circle'
      })
      features.push(line)
    }

    if (this._path[0]) {
      const vertex = point(this._path[0], { active, type: 'circle-center', origin: 'circle' })
      features.push(vertex)
    }

    return {
      feature: circleFeature,
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
