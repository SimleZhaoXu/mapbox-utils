import { LineLayer } from 'mapbox-utils'
import { getLineGeoJson, getLineData } from '@/utils/data'
export default function useLineLayerTest() {
  const lineLayer = new LineLayer({
    key: 'id',
    data: getLineGeoJson(getLineData(30)),
    style: {
      'line-width': 4,
      'line-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'line-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

  return {
    layer: lineLayer,
    iconList: []
  }
}
