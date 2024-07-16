const defaultStyle: any = {
  'vertex-radius': 5,
  'vertex-color': '#000000',
  'vertex-opacity': 1,
  'vertex-stroke-width': 0,
  'vertex-stroke-color': '#000000',
  'vertex-stroke-opacity': 1,
  'stroke-color': '#000000',
  'stroke-width': 1,
  'stroke-blur': 0,
  'stroke-opacity': 1,
  'stroke-dasharray': [1, 0],
  'fill-opacity': 1,
  'fill-color': '#000000'
}

export const originOptions: any = {
  style: {
    'vertex-radius': 3,
    'vertex-color': '#ffffff',
    'vertex-opacity': 1,
    'vertex-stroke-width': 2,
    'vertex-stroke-color': '#177cb0',
    'vertex-stroke-opacity': 1,
    'stroke-color': '#177cb0',
    'stroke-width': 1,
    'stroke-blur': 0,
    'stroke-opacity': 1,
    'stroke-dasharray': [1, 0],
    'fill-opacity': 0.2,
    'fill-color': '#44cef6'
  },
  finishedStyle: {
    'vertex-radius': 3,
    'vertex-color': '#ffffff',
    'vertex-opacity': 1,
    'vertex-stroke-width': 2,
    'vertex-stroke-color': '#177cb0',
    'vertex-stroke-opacity': 1,
    'stroke-color': '#177cb0',
    'stroke-width': 1,
    'stroke-blur': 0,
    'stroke-opacity': 1,
    'stroke-dasharray': [1, 0],
    'fill-opacity': 0.4,
    'fill-color': '#44cef6'
  }
}

const storage = localStorage.getItem('RectAreaPickerOptions')
export const options = storage ? JSON.parse(storage) : originOptions

export const getOptions = () => {
  const opts = Object.create(null)
  opts.style = Object.create(null)
  Object.keys(options.style).forEach((key) => {
    if (JSON.stringify(options.style[key]) !== JSON.stringify(defaultStyle[key])) {
      opts.style[key] = options.style[key]
    }
  })

  opts.finishedStyle = Object.create(null)
  Object.keys(options.finishedStyle).forEach((key: any) => {
    if (JSON.stringify(options.style[key]) !== JSON.stringify(options.finishedStyle[key])) {
      opts.finishedStyle[key] = options.finishedStyle[key]
    }
  })

  return opts
}
