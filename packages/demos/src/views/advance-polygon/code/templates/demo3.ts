export default `
let map: mapboxgl.Map
let polygonLayer: AdvancePolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new AdvancePolygonLayer({
    key: 'name',
    data,
    layerPool: {
      default: {
        type: 'fill',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3
        }
      },
      defaultBorder: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 2
        }
      },
      highlightBorder: {
        type: 'line',
        paint: {
          'line-color': '#0f0',
          'line-width': 2
        }
      },
    },
    layers: ['default', 'defaultBorder'],
    highlightTrigger: 'hover',
    highlightLayers: ['default', 'highlightBorder'],
    fitBoundsOptions: true
  })
  polygonLayer.addTo(map)
}`
