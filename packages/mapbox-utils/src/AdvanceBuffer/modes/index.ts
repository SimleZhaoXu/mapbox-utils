import Point from './point'
import Line from './line'
import Polygon from './polygon'
import Rect from './rect'
import Mode, { FeatureType, createLine } from './mode'

export { Mode, createLine }
export type { FeatureType }

export const MODE_TYPE = {
  NONE: 'NONE',
  POINT: 'POINT',
  LINE: 'LINE',
  POLYGON: 'POLYGON',
  RECT: 'RECT'
} as const

export const MODE_MAP: {
  [key in Exclude<ModeType, typeof MODE_TYPE.NONE>]: new () => Mode
} = {
  [MODE_TYPE.POINT]: Point,
  [MODE_TYPE.LINE]: Line,
  [MODE_TYPE.POLYGON]: Polygon,
  [MODE_TYPE.RECT]: Rect
}

export type ModeType = (typeof MODE_TYPE)[keyof typeof MODE_TYPE]
