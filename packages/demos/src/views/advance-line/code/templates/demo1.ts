export default `
let map: mapboxgl.Map
let lineLayer: AdvanceLineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new AdvanceLineLayer({
    key: 'id',
    data,
    // data: './data/lineData.json',
    layerPool: {
      default: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#ff0000'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlight: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#00ff00'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  lineLayer.addTo(map)
}`
