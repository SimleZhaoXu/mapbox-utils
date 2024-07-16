import MODE, { FeatureType, createLine } from './mode'
import { unkinkPolygon, polygon, combine, point } from '@turf/turf'
export default class DrawPolygon extends MODE {
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
    let lineData = [...this._path]
    let vertexNum = this._next - 1
    if (active === 'false') {
      lineData = [...this._path, this._path[0]]
      vertexNum = this._next
    }
    const line = createLine(lineData, { active, type: 'border', origin: 'polygon' })
    line && features.push(line)
    const polygon = createPolygon([...this._path, this._path[0]], active)
    polygon && features.push(polygon)
    for (let i = 0; i <= vertexNum; i++) {
      if (this._path[i]) {
        const vertex = point(this._path[i], { active, type: 'vertex', origin: 'polygon' })
        features.push(vertex)
      }
    }
    return {
      feature: polygon,
      renderFeatures: features
    }
  }

  onClick(e: mapboxgl.MapMouseEvent) {
    if (this._next !== 0 && !this._path[this._next]) return false
    this._path[this._next] = [e.lngLat.lng, e.lngLat.lat]
    if (this._next >= 2 && !createPolygon([...this._path, this._path[0]], 'true')) {
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
    if (this._next < 3) return
    if (createPolygon([...this._path, this._path[0]], 'false')) {
      this.fire('finished', {
        data: this.getFeatures('false')
      })
      this._next = 0
      this._path = []
    }
  }

  clear() {
    if (this._next !== 0) {
      this._path = []
      this._next = 0
    }
  }
}

function createPolygon(
  data: Array<[number, number]>,
  active: 'true' | 'false'
): GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon> | null {
  try {
    let polygonGeometry
    const polygons = unkinkPolygon(polygon([data]))
    if (polygons.features.length > 1) {
      polygonGeometry = combine(polygons).features[0] as GeoJSON.Feature<GeoJSON.MultiPolygon>
    } else {
      polygonGeometry = polygons.features[0]
    }
    polygonGeometry.properties = {
      active,
      origin: 'polygon'
    }
    return polygonGeometry
  } catch (error) {
    return null
  }
}
