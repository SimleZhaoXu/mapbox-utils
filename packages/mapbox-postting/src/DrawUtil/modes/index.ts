import DrawPoint from './draw-point'
import DrawLine from './draw-line'
import DrawPolygon from './draw-polygon'
import DrawCircle from './draw-circle'
import DrawRect from './draw-rect'
import Mode, { FeatureType } from './mode'

export { Mode }
export type { FeatureType }

export const MODE_TYPE = {
  NONE: 'NONE',
  DRAW_POINT: 'DRAW_POINT',
  DRAW_LINE: 'DRAW_LINE',
  DRAW_POLYGON: 'DRAW_POLYGON',
  DRAW_CIRCLE: 'DRAW_CIRCLE',
  DRAW_RECT: 'DRAW_RECT'
} as const

export const MODE_MAP: {
  [key in Exclude<ModeType, typeof MODE_TYPE.NONE>]: new () => Mode
} = {
  [MODE_TYPE.DRAW_POINT]: DrawPoint,
  [MODE_TYPE.DRAW_LINE]: DrawLine,
  [MODE_TYPE.DRAW_POLYGON]: DrawPolygon,
  [MODE_TYPE.DRAW_CIRCLE]: DrawCircle,
  [MODE_TYPE.DRAW_RECT]: DrawRect
}

export type ModeType = (typeof MODE_TYPE)[keyof typeof MODE_TYPE]
