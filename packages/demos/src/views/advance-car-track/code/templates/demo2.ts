export default `
const iconList = [
  {
    name: 'icon-plane',
    path: './map-icon/road-arrow.png',
    pixelRatio: 20
  },
  {
    name: 'icon-car',
    path: './map-icon/icon-car.png',
    pixelRatio: 10
  }
]
let map: mapboxgl.Map
let carTrack: AdvanceCarTrack
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  carTrack = new AdvanceCarTrack({
    data,
    layerPool: {
      fullPath: {
        type: 'line',
        paint: {
          'line-color': '#990',
          'line-width': 10
        }
      },
      arrow: {
        type: 'symbol',
        layout: {
          'icon-size': 1,
          'icon-rotate': 90,
          'icon-image': 'icon-plane',
          'symbol-placement': "line",
          'symbol-spacing': 30,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-pitch-alignment': 'map'
        }
      },
      currentPath: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 10
        }
      },
      symbolCar: {
        type: 'symbol',
        layout: {
          'icon-image': 'icon-car',
          'icon-size': 2,
          'icon-rotate': ['get', 'bearing'],
          'icon-ignore-placement': true,
          'icon-allow-overlap': true,
          'icon-rotation-alignment': 'map'
        }
      }
    },
    fullPathLayers: ['fullPath', 'arrow'],
    currentPathLayers: ['currentPath', 'arrow'],
    carLayers: ['symbolCar'],
    speed: 100,
    fitBoundsOptions: {
      padding: 40
    }
  })
  carTrack.addTo(map)
}
`
