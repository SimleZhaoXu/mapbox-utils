export const fitBoundsOptions: any = {
  linear: false,
  maxZoom: 24,
  offset: [0, 0],
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}

export const getFitBoundsOptions = (options: any) => {
  const res = Object.create(null)
  Object.keys(options).forEach((key) => {
    if (JSON.stringify(options[key]) !== JSON.stringify(fitBoundsOptions[key])) {
      res[key] = options[key]
    }
  })

  if (Object.keys(res).length > 0) {
    return res
  }
  return true
}
