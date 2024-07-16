export default `
const iconList = [
  {
    name: 'cluster',
    path: './map-icon/cluster.png',
    pixelRatio: 2
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
        type: 'circle',
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': 'rgb(10, 155, 82)',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      },
      cluster: {
        type: 'symbol',
        layout: {
          'icon-image': 'cluster',
          'icon-size': 1,
          'icon-anchor': 'bottom',
          'text-field': ['get', 'point_count'],
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, -2.7],
          'text-anchor': 'center',
          'text-size': 16,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#fff'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true,
    cluster: true,
    clusterLayers: ['cluster']
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`
