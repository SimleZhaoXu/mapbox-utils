import { SymbolClusterLayer } from 'mapbox-utils'
import { getPointGeoJson, getPointData } from '@/utils/data'
export default function useCircleClusterLayerTest() {
  const pointLayer = new SymbolClusterLayer({
    key: 'id',
    data: getPointGeoJson(getPointData(1000)),
    clusterRadius: 50,
    style: {
      'icon-image': 'alarm-01',
      'icon-size': 1,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    clusterStyle: {
      'icon-image': 'cluster',
      'icon-size': 1,
      'icon-anchor': 'bottom',
      'text-field': ['get', 'point_count'],
      'text-font': ['Noto Sans Regular'],
      'text-offset': [0, -2.7],
      'text-anchor': 'center',
      'text-size': 16,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-color': '#fff'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'icon-image': 'alarm-01-active'
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

  const iconList = [
    {
      name: 'alarm-01',
      path: './map-icon/alarm-01.png',
      pixelRatio: 2
    },
    {
      name: 'alarm-01-active',
      path: './map-icon/alarm-01-active.png',
      pixelRatio: 2
    },
    {
      name: 'cluster',
      path: './map-icon/cluster.png',
      pixelRatio: 2
    }
  ]

  return {
    layer: pointLayer,
    iconList
  }
}
