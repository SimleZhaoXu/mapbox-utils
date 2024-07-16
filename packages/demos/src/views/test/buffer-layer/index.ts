import { BufferLayer } from 'mapbox-utils'
export default function useBufferLayerTest() {
  const bufferLayer = new BufferLayer({
    manual: true,
    radius: 10,
    style: {
      'stroke-color': '#177cb0',
      'stroke-width': 2,
      'fill-opacity': 0.2,
      'fill-color': '#44cef6'
    },
    centerLayer: {
      show: true,
      // type: 'circle',
      // style: {
      //   'circle-color': '#0f0',
      //   'circle-radius': 5,
      //   'circle-opacity': 0.5
      // }
      type: 'symbol',
      style: {
        'icon-image': 'buffer-center',
        'icon-size': 1,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      }
    }
  })

  bufferLayer.on('change', (e) => {
    console.log(e)
  })

  const iconList = [
    {
      name: 'buffer-center',
      path: './map-icon/buffer-center.png',
      pixelRatio: 10
    }
  ]

  return {
    layer: bufferLayer,
    iconList
  }
}
