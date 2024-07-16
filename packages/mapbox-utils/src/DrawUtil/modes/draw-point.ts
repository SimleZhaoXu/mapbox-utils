import MODE, { FeatureType } from './mode'
import { point } from '@turf/turf'
export default class DrawPoint extends MODE {
  constructor() {
    super()
  }

  getFeatures() {
    if (!this._path.length) {
      return {
        feature: null,
        renderFeatures: []
      }
    }
    const features: Array<FeatureType> = []
    const p = point(this._path[0], { origin: 'point' })
    features.push(p)
    return {
      feature: p,
      renderFeatures: features
    }
  }

  onClick(e: mapboxgl.MapMouseEvent) {
    this._path[this._next] = [e.lngLat.lng, e.lngLat.lat]
    this.fire('finished', {
      data: this.getFeatures()
    })
    this._next = 0
    this._path = []
    return false
  }

  onMouseMove() {
    return false
  }

  onDblClick() {
    return
  }

  clear() {
    this._path = []
  }
}
