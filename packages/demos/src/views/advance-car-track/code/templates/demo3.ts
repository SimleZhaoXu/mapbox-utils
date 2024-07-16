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
          'line-color': '#007DFF',
          'line-width': 5
        }
      },
      border: {
        type: 'line',
        paint: {
          'line-color': '#fff',
          'line-width': 8
        }
      },
      node: {
        type: 'circle',
        paint: {
          'circle-radius': 5,
          'circle-color': ['case', ['==', ['get', 'nodeState'], 1], '#FF4D4F', '#007DFF'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      },
      currentPath: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 5
        }
      }
    },
    fullPathLayers: ['border', 'fullPath'],
    currentPathLayers: ['border', 'currentPath'],
    nodeLayers: ['node'],
    speed: 100,
    fitBoundsOptions: {
      padding: 40
    }
  })
  carTrack.addTo(map)
}
`
