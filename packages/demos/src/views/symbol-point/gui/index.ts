import { symbolPaint, symbolLayout } from '@/utils/style'
import { fitBoundsOptions } from '@/utils/fitBounds'
import { getCommonOptions } from '@/utils/highlight-layer'
export const defaultSymbolStyle: any = {
  ...symbolLayout,
  ...symbolPaint
}

export const originOptions: any = {
  style: {
    'icon-image': 'alarm-01',
    'icon-size': 1,
    'icon-offset': [0, 0],
    'icon-anchor': 'center',
    'icon-rotate': 0,
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-text-fit': 'none',
    'icon-rotation-alignment': 'auto',
    'icon-pitch-alignment': 'auto',
    'text-rotation-alignment': 'auto',
    'text-pitch-alignment': 'auto',
    'text-field': '',
    'text-font': ['Noto Sans Regular'],
    'text-size': 16,
    'text-max-width': 10,
    'text-line-height': 1.2,
    'text-letter-spacing': 0,
    'text-justify': 'center',
    'text-anchor': 'center',
    'text-rotate': 0,
    'text-offset': [0, 0],
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'icon-opacity': 1,
    'icon-color': '#000000',
    'icon-halo-color': 'rgba(0,0,0,0)',
    'icon-halo-width': 0,
    'icon-halo-blur': 0,
    'icon-translate': [0, 0],
    'icon-translate-anchor': 'map',
    'text-opacity': 1,
    'text-color': '#000000',
    'text-halo-color': 'rgba(0,0,0,0)',
    'text-halo-width': 0,
    'text-halo-blur': 0,
    'text-translate': [0, 0],
    'text-translate-anchor': 'map'
  },
  enableHighlight: true,
  highlightOptions: {
    trigger: 'click',
    style: {
      'icon-image': 'alarm-01-active',
      'icon-size': 1,
      'icon-offset': [0, 0],
      'text-field': '',
      'text-size': 16,
      'icon-opacity': 1,
      'icon-color': '#000000',
      'icon-halo-color': 'rgba(0,0,0,0)',
      'icon-halo-width': 0,
      'icon-halo-blur': 0,
      'text-opacity': 1,
      'text-color': '#000000',
      'text-halo-color': 'rgba(0,0,0,0)',
      'text-halo-width': 1,
      'text-halo-blur': 1
    }
  },
  enableFitBounds: '1',
  fitBoundsOptions
}
const storage = localStorage.getItem('SymbolPointLayerOptions')
export const options = storage ? JSON.parse(storage) : originOptions
export const getOptions = () => {
  return getCommonOptions(options, defaultSymbolStyle)
}
