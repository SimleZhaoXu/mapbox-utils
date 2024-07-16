export default `
let map: mapboxgl.Map
let polygonLayer: AdvancePolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new AdvancePolygonLayer({
    key: 'name',
    data,
    // data: './data/polygonData.json',
    layerPool: {
      default: {
        type: 'fill',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3
        }
      },
      highlight: {
        type: 'fill',
        paint: {
          'fill-color': '#0f0',
          'fill-opacity': 0.3
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'manual',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  polygonLayer.addTo(map)
  polygonLayer.on('click', e => {
    polygonLayer.easeTo(e.data.name)
    polygonLayer.setHighlight(e.data.name)
  })
}`
