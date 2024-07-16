import { RectAreaPicker } from 'mapbox-utils'
export default function useRectAreaPickerTest() {
  const rectAreaPicker = new RectAreaPicker({
    style: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.2,
      'stroke-width': 2,
      'stroke-color': '#44cef6',
      'stroke-opacity': 0.5,
      'stroke-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6'
    },
    finishedStyle: {
      'fill-opacity': 0.3,
      'stroke-opacity': 1,
      'stroke-dasharray': [1, 0]
    }
  })

  rectAreaPicker.on('finish', (e) => {
    console.log(e)
  })

  return {
    layer: rectAreaPicker,
    iconList: []
  }
}
