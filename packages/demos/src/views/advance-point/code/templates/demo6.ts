export default `
const iconList = [
  {
    name: 'alarm-01',
    path: './map-icon/alarm-01.png',
    pixelRatio: 2
  },
  {
    name: 'alarm-01-active',
    path: './map-icon/alarm-01-active.png',
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
      },
      cluster: {
        type: 'circle',
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      },
      clusterNum: {
        type: 'symbol',
        layout: {
          'text-field': ['get', 'point_count'],
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'center',
          'text-size': 16,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#000'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true,
    cluster: true,
    clusterLayers: ['cluster', 'clusterNum']
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`
