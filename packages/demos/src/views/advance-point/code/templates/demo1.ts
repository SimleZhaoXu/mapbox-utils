export default `
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 5
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': '#0f0',
          'circle-radius': 5
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}`
