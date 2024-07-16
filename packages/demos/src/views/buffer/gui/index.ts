const defaultBufferStyle: any = {
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
    'stroke-color': '#177cb0',
    'stroke-width': 1,
    'stroke-blur': 0,
    'stroke-opacity': 1,
    'stroke-dasharray': [1, 0],
    'fill-opacity': 0.2,
    'fill-color': '#44cef6'
  },
  units: 'kilometers',
  radius: 5,
  steps: 64,
  manual: false,
  centerLayer: 'node'
}

const storage = localStorage.getItem('BufferLayerOptions')
export const options = storage ? JSON.parse(storage) : originOptions
export const getOptions = () => {
  const opts = Object.create(null)
  opts.style = Object.create(null)
  Object.keys(options.style).forEach((key) => {
    if (JSON.stringify(options.style[key]) !== JSON.stringify(defaultBufferStyle[key])) {
      opts.style[key] = options.style[key]
    }
  })

  Object.keys(options).forEach((key) => {
    if (!['style', 'centerLayer'].includes(key) && options[key] !== originOptions[key]) {
      opts[key] = options[key]
    }
  })

  opts.centerLayer = {
    show: false
  }

  return opts
}
