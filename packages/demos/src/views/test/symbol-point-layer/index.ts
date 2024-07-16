import { SymbolPointLayer } from 'mapbox-utils'
import { getPointGeoJson, getPointData } from '@/utils/data'
export default function useSymbolPointLayerTest() {
  const pointLayer = new SymbolPointLayer({
    key: 'id',
    data: getPointGeoJson(getPointData(100)),
    style: {
      'icon-image': 'alarm-01',
      'icon-size': 0.7,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
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

  const iconList = [
    {
      name: 'alarm-01',
      path: './map-icon/alarm-01.png',
      pixelRatio: 1
    },
    {
      name: 'alarm-01-active',
      path: './map-icon/alarm-01-active.png',
      pixelRatio: 1
    }
  ]

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
    iconList
  }
}
