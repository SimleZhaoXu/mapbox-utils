import { CircleClusterLayer } from 'mapbox-utils'
import { getPointGeoJson, getPointData } from '@/utils/data'
export default function useCircleClusterLayerTest() {
  const pointLayer = new CircleClusterLayer({
    key: 'id',
    data: getPointGeoJson(getPointData(1000)),
    clusterRadius: 50,
    style: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    },
    clusterStyle: {
      'text-field': ['get', 'point_count'],
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'center',
      'text-size': 16,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-color': '#000',
      'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 30, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40]
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': 'rgb(10, 155, 82)'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

  pointLayer.on('click', (e) => {
    console.log(e.type)
  })

  pointLayer.on('mouseenter', (e) => {
    console.log(e.type)
  })

  pointLayer.on('mouseleave', (e) => {
    console.log(e.type)
  })

  pointLayer.on('mousemove', (e) => {
    console.log(e.type)
  })

  return {
    layer: pointLayer,
    iconList: []
  }
}
