import { CircleAreaPicker } from 'mapbox-utils'
export default function useCircleAreaPickerTest() {
  const circleAreaPicker = new CircleAreaPicker({
    style: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.2,
      'stroke-width': 2,
      'stroke-color': '#44cef6',
      'stroke-opacity': 0.5,
      'stroke-dasharray': [5, 3]
    },
    finishedStyle: {
      'fill-opacity': 0.3,
      'stroke-opacity': 1,
      'stroke-dasharray': [1, 0]
    }
  })

  circleAreaPicker.on('finish', (e) => {
    console.log(e)
  })

  return {
    layer: circleAreaPicker,
    iconList: []
  }
}
