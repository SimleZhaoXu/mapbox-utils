import { CarTrack } from 'mapbox-utils'
import data from './data'
export default function useCarTrackTest() {
  const carTrack = new CarTrack({
    speed: 10,
    data,
    carLayer: {
      show: true,
      type: 'symbol',
      style: {
        'icon-image': 'icon-plane',
        'icon-rotate': ['+', ['get', 'bearing'], 45]
      }
    },
    currentPathLayer: {
      style: {
        'line-color': '#f00',
        'line-opacity': 0.4
      }
    },
    pathLayer: {
      style: {
        'line-color': '#0f0',
        'line-opacity': 0.4
      }
    },
    fitBoundsOptions: {
      padding: 40
    }
  })

  const iconList = [
    {
      path: './map-icon/icon-plane.png',
      name: 'icon-plane',
      pixelRatio: 10
    }
  ]
  return {
    layer: carTrack,
    iconList
  }
}
