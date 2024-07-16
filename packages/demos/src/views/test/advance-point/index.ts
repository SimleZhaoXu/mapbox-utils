import { AdvancePointLayer } from 'mapbox-utils'
import { getPointGeoJson, getPointData } from '@/utils/data'
export default function useAdvancePointLayerTest() {
  const advancePointLayer = new AdvancePointLayer({
    key: 'id',
    data: getPointGeoJson(getPointData(300)),
    layerPool: {
      default: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 5
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': '#0f0',
          'circle-radius': 5
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  return {
    layer: advancePointLayer,
    iconList: []
  }
}
