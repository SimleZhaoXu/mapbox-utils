import { CirclePointLayer } from 'mapbox-utils'
import { getPointGeoJson, getPointData } from '@/utils/data'
export default function useCirclePointLayerTest() {
  const pointLayer = new CirclePointLayer({
    key: 'id',
    data: getPointGeoJson(getPointData(100)),
    style: {
      'circle-radius': 7,
      'circle-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

  // pointLayer.on('click', (e) => {
  //   console.log(e.type)
  // })

  // pointLayer.on('mouseenter', (e) => {
  //   console.log(e.type)
  // })

  // pointLayer.on('mouseleave', (e) => {
  //   console.log(e.type)
  // })

  // pointLayer.on('mousemove', (e) => {
  //   console.log(e.type)
  // })

  return {
    layer: pointLayer,
    iconList: []
  }
}
