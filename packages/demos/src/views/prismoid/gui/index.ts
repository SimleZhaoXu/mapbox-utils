import { fillExtrusionLayout, fillExtrusionPaint } from '@/utils/style'
import { fitBoundsOptions } from '@/utils/fitBounds'
import { getCommonOptions } from '@/utils/highlight-layer'
const defaultFillExtrusionStyle: any = {
  ...fillExtrusionPaint,
  ...fillExtrusionLayout
}

export const originOptions: any = {
  style: {
    'fill-extrusion-opacity': 1,
    'fill-extrusion-pattern': '',
    'fill-extrusion-color': '#000000',
    'fill-extrusion-translate': [0, 0],
    'fill-extrusion-translate-anchor': 'map',
    'fill-extrusion-height': 100,
    'fill-extrusion-base': 0,
    'fill-extrusion-vertical-gradient': true
  },
  enableHighlight: true,
  highlightOptions: {
    trigger: 'click',
    style: {
      'fill-extrusion-opacity': 1,
      'fill-extrusion-pattern': '',
      'fill-extrusion-color': '#000000'
    }
  },
  radius: 10,
  steps: 64,
  enableFitBounds: '2',
  fitBoundsOptions
}
const storage = localStorage.getItem('PrismoidLayerOptions')
export const options = storage ? JSON.parse(storage) : originOptions
export const getOptions = () => {
  const opts = getCommonOptions(options, defaultFillExtrusionStyle)
  opts.radius = options.radius
  opts.steps = options.steps
  return opts
}
