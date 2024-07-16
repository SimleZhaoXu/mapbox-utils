import { fitBoundsOptions } from '@/utils/fitBounds'
import { getCommonOptions } from '@/utils/highlight-layer'
const defaultPolygonStyle: any = {
  'stroke-color': '#000000',
  'stroke-width': 1,
  'stroke-blur': 0,
  'stroke-pattern': '',
  'stroke-opacity': 1,
  'stroke-dasharray': [1, 0],
  'fill-opacity': 1,
  'fill-pattern': '',
  'fill-color': '#000000',
  'sort-key': 1
}

export const originOptions: any = {
  style: {
    'stroke-color': '#ff0000',
    'stroke-width': 1,
    'stroke-blur': 0,
    'stroke-pattern': '',
    'stroke-opacity': 0.2,
    'stroke-dasharray': [1, 0],
    'fill-opacity': 0.2,
    'fill-pattern': '',
    'fill-color': '#ff0000',
    'sort-key': 1
  },
  enableHighlight: true,
  highlightOptions: {
    trigger: 'click',
    style: {
      'stroke-opacity': 1,
      'stroke-pattern': '',
      'stroke-color': '#ff0000',
      'stroke-width': 0.4,
      'stroke-blur': 0,
      'fill-color': '#ff0000',
      'fill-opacity': 0.4,
      'fill-pattern': '',
      'sort-key': 2
    }
  },
  enableFitBounds: '2',
  fitBoundsOptions
}

const storage = localStorage.getItem('PolygonLayerOptions')
export const options = storage ? JSON.parse(storage) : originOptions
export const getOptions = () => {
  return getCommonOptions(options, defaultPolygonStyle)
}
