export default `
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
          'line-color': '#0f0',
          'line-width': 3
        }
      },
      currentPath: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 3
        }
      },
      circleCar: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 3,
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2
        }
      }
    },
    fullPathLayers: ['fullPath'],
    currentPathLayers: ['currentPath'],
    carLayers: ['circleCar'],
    speed: 100,
    fitBoundsOptions: {
      padding: 40
    }
  })
  carTrack.addTo(map)
}
`
