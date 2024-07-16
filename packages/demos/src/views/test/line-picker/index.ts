import { LinePicker } from 'mapbox-utils'
export default function useLinePickerTest() {
  const linePicker = new LinePicker({
    style: {
      'line-width': 2,
      'line-color': '#44cef6',
      'line-opacity': 0.5,
      'line-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6'
    },
    finishedStyle: {
      'line-opacity': 1,
      'line-dasharray': [1, 0]
    }
  })

  linePicker.on('finish', (e) => {
    console.log(e)
  })

  return {
    layer: linePicker,
    iconList: []
  }
}
