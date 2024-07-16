import deepClone from './cloneDeep'
export { deepClone }

export function bindAll(fns: Array<string>, context: any): void {
  fns.forEach((fn) => {
    if (!context[fn]) {
      return
    }
    context[fn] = context[fn].bind(context)
  })
}

export const defaultVertexStyle = {
  'circle-color': '#fff',
  'circle-radius': 4,
  'circle-stroke-width': 1,
  'circle-stroke-color': '#44cef6'
}

export const defaultStrokeStyle = {
  'line-width': 2,
  'line-color': '#44cef6',
  'line-opacity': 0.5,
  'line-dasharray': [5, 3]
}

export const defaultFillStyle = {
  'fill-color': '#44cef6',
  'fill-opacity': 0.2
}
