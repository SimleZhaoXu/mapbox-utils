import { circlePaint, circleLayout } from '@/utils/style'
import { fitBoundsOptions } from '@/utils/fitBounds'
import { getCommonOptions } from '@/utils/highlight-layer'
const defaultCircleStyle: any = {
  ...circleLayout,
  ...circlePaint
}

export const originOptions: any = {
  style: {
    'circle-color': '#ff0000',
    'circle-radius': 10,
    'circle-opacity': 1,
    'circle-blur': 0,
    'circle-stroke-width': 0,
    'circle-stroke-color': '#000000',
    'circle-stroke-opacity': 1,
    'circle-pitch-scale': 'map',
    'circle-pitch-alignment': 'viewport'
  },
  enableHighlight: true,
  highlightOptions: {
    trigger: 'click',
    style: {
      'circle-color': '#00ff00',
      'circle-radius': 10,
      'circle-opacity': 1,
      'circle-blur': 0,
      'circle-stroke-width': 0,
      'circle-stroke-color': '#000000',
      'circle-stroke-opacity': 1
    }
  },
  enableFitBounds: '2',
  fitBoundsOptions
}
const storage = localStorage.getItem('CirclePointLayerOptions')
export const options = storage ? JSON.parse(storage) : originOptions
export const getOptions = () => {
  return getCommonOptions(options, defaultCircleStyle)
}
