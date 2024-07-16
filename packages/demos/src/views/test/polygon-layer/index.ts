import { PolygonLayer } from 'mapbox-utils'
import { getPolygonGeoJson, getAreaData } from '@/utils/data'
export default function usePolygonLayerTest() {
  const polygonLayer = new PolygonLayer({
    key: 'name',
    data: getPolygonGeoJson(getAreaData(30)),
    style: {
      'stroke-color': '#ff0000',
      'stroke-opacity': 0.3,
      'fill-color': '#FF0000',
      'fill-opacity': 0.3
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'stroke-opacity': 0.5,
        'fill-opacity': 0.5
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

  return {
    layer: polygonLayer,
    iconList: []
  }
}
