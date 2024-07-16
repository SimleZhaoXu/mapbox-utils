export default `
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
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      highlight: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01-active',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
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
}
`
