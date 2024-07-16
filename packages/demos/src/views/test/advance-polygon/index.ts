import { AdvancePolygonLayer } from 'mapbox-utils'
import { getPolygonGeoJson, getAreaData } from '@/utils/data'
export default function useAdvancePolygonLayerTest() {
  const advancePolygonLayer = new AdvancePolygonLayer({
    key: 'name',
    data: getPolygonGeoJson(getAreaData(300)),
    layerPool: {
      default: {
        type: 'fill',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3
        }
      },
      highlight: {
        type: 'fill',
        paint: {
          'fill-color': '#0f0',
          'fill-opacity': 0.3
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'hover',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  return {
    layer: advancePolygonLayer,
    iconList: []
  }
}
