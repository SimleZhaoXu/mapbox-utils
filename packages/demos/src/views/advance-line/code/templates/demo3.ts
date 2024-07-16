export default `
let map: mapboxgl.Map
let lineLayer: AdvanceLineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new AdvanceLineLayer({
    key: 'id',
    data,
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
      defaultOuter: {
        type: 'line',
        paint: {
          'line-width': 16,
          'line-color': '#ff0000',
          'line-opacity': 0.3
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
      },
      highlightOuter: {
        type: 'line',
        paint: {
          'line-width': 16,
          'line-color': '#00ff00',
          'line-opacity': 0.3
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      }
    },
    layers: ['defaultOuter', 'default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlightOuter', 'highlight'],
    fitBoundsOptions: true
  })
  lineLayer.addTo(map)
}`
