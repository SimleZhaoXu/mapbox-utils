const defaultMarkerOptions: any = {
  anchor: 'center',
  color: '#3FB1CE',
  element: 'default',
  offset: [0, 0],
  pitchAlignment: 'auto',
  rotation: 0,
  rotationAlignment: 'auto',
  scale: 1
}

export const originOptions: any = {
  multiple: true,
  removeOnClick: false,
  enableMarkerOptions: '0',
  markerOptions: {
    anchor: 'center',
    color: '#3FB1CE',
    element: 'default',
    offset: [0, 0],
    pitchAlignment: 'auto',
    rotation: 0,
    rotationAlignment: 'auto',
    scale: 1
  }
}

const storage = localStorage.getItem('PointPickerOptions')
export const options = storage ? JSON.parse(storage) : originOptions

export const getOptions = (): any => {
  const opts = Object.create(null)
  opts.multiple = options.multiple
  opts.removeOnClick = options.removeOnClick
  if (options.enableMarkerOptions === '1') {
    const markerOptions = Object.create(null)
    Object.keys(options.markerOptions).forEach((key: any) => {
      if (
        JSON.stringify(options.markerOptions[key]) !== JSON.stringify(defaultMarkerOptions[key])
      ) {
        markerOptions[key] = options.markerOptions[key]
      }
    })

    if (Object.keys(markerOptions).length > 0) {
      opts.markerOptions = markerOptions
    }
  }

  return opts
}
