import { linePaint, lineLayout } from '@/utils/style'
import { fitBoundsOptions } from '@/utils/fitBounds'
import { getCommonOptions } from '@/utils/highlight-layer'
export const defaultLineStyle: any = {
  ...lineLayout,
  ...linePaint
}

export const originOptions: any = {
  style: {
    'line-color': '#ff0000',
    'line-width': 1,
    'line-blur': 0,
    'line-opacity': 1,
    'line-gap-width': 0,
    'line-offset': 0,
    'line-dasharray': [1, 0],
    'line-translate': [0, 0],
    'line-translate-anchor': 'map'
  },
  enableHighlight: true,
  highlightOptions: {
    trigger: 'click',
    style: {
      'line-color': '#00ff00',
      'line-width': 1,
      'line-blur': 0,
      'line-opacity': 1,
      'line-gap-width': 0,
      'line-offset': 0
    }
  },
  enableFitBounds: '2',
  fitBoundsOptions
}
const storage = localStorage.getItem('LineLayerOptions')
export const options = storage ? JSON.parse(storage) : originOptions
export const getOptions = () => {
  return getCommonOptions(options, defaultLineStyle)
}
