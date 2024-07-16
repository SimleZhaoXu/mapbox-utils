import { getFitBoundsOptions } from './fitBounds'
export const getCommonOptions = (options: any, defaultStyle: any): any => {
  const opts = Object.create(null)
  // style
  opts.style = Object.create(null)
  Object.keys(options.style).forEach((key) => {
    if (JSON.stringify(options.style[key]) !== JSON.stringify(defaultStyle[key])) {
      opts.style[key] = options.style[key]
    }
  })

  // highlightOptions
  if (options.enableHighlight) {
    opts.highlightOptions = {
      trigger: options.highlightOptions.trigger,
      style: Object.create(null)
    }

    Object.keys(options.highlightOptions.style).forEach((key: any) => {
      if (
        JSON.stringify(options.style[key]) !== JSON.stringify(options.highlightOptions.style[key])
      ) {
        opts.highlightOptions.style[key] = options.highlightOptions.style[key]
      }
    })
  }

  // fitBoundsOptions
  if (options.enableFitBounds !== '0') {
    opts.fitBoundsOptions =
      options.enableFitBounds === '2' ? getFitBoundsOptions(options.fitBoundsOptions) : true
  }

  return opts
}
