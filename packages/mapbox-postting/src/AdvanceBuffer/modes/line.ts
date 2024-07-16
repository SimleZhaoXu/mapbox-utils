import MODE, { FeatureType, createLine } from './mode'
import { point } from '@turf/turf'
export default class Line extends MODE {
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
    let vertexNum = this._next - 1
    if (active === 'false') {
      vertexNum = this._next
    }
    const line = createLine([...this._path], { active, origin: 'line' })
    line && features.push(line)
    for (let i = 0; i <= vertexNum; i++) {
      if (this._path[i]) {
        const vertex = point(this._path[i], { active, type: 'vertex', origin: 'line' })
        features.push(vertex)
      }
    }
    return {
      feature: line,
      renderFeatures: features
    }
  }

  onClick(e: mapboxgl.MapMouseEvent) {
    if (this._next !== 0 && !this._path[this._next]) return false
    this._path[this._next] = [e.lngLat.lng, e.lngLat.lat]
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
    if (this._next < 2) return
    this.fire('finished', {
      data: this.getFeatures('false')
    })
    this._next = 0
    this._path = []
  }

  clear() {
    if (this._next !== 0) {
      this._path = []
      this._next = 0
    }
  }
}
