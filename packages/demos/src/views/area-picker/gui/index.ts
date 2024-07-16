import * as polygon from './options/polygon-area-picker'
import * as circle from './options/circle-area-picker'
import * as rect from './options/rect-area-picker'

const getOptionsFromType = (type: 'polygon' | 'circle' | 'rect') => {
  let options
  let getOptions
  switch (type) {
    case 'polygon':
      return polygon
    case 'circle':
      return circle
    case 'rect':
      return rect
  }
}

export default getOptionsFromType
