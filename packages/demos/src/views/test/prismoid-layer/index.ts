import { PrismoidLayer } from 'mapbox-utils'
import data from '@/data/demo-data/pointData.json'
export default function usePrismoidLayerTest() {
  const prismoidLayer = new PrismoidLayer({
    key: 'id',
    // @ts-ignore
    data,
    radius: 500,
    steps: 64,
    style: {
      'fill-extrusion-color': 'rgb(16, 146, 153)',
      'fill-extrusion-height': ['*', ['get', 'id'], 100],
      'fill-extrusion-base': 0
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'fill-extrusion-color': '#ffff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

  return {
    layer: prismoidLayer,
    iconList: []
  }
}
