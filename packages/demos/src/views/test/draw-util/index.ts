/*
 * @Author: 汤凡
 * @Date: 2024-04-16 11:59:02
 * @LastEditors: 汤凡
 * @LastEditTime: 2024-07-12 14:04:09
 */
import { DrawUtil } from 'mapbox-utils'
import { ref } from 'vue'
import layers from './layers'
import WKT from 'terraformer-wkt-parser'
export default function useDrawUtil() {
  const drawUtil = new DrawUtil({
    multiple: true,
    layers
  })
  const buttonList = ref([
    {
      label: 'NONE',
      handler: () => {
        drawUtil.changeMode(DrawUtil.MODE_TYPE.NONE)
      }
    },
    {
      label: '点',
      handler: () => {
        drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POINT)
      }
    },
    {
      label: '线',
      handler: () => {
        drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_LINE)
      }
    },
    {
      label: '多边形',
      handler: () => {
        drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON)
      }
    },
    {
      label: '矩形',
      handler: () => {
        drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_RECT)
      }
    },
    {
      label: '圆',
      handler: () => {
        drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_CIRCLE)
      }
    },
    {
      label: '清除',
      handler: () => {
        drawUtil.clear()
      }
    },
    {
      label: '获取(geojson)',
      handler: () => {
        const features = drawUtil.getAll().map((item) => item.feature)
        console.log(JSON.stringify(features))
      }
    },
    {
      label: '获取(wkt)',
      handler: () => {
        const geometries = drawUtil.getAll().map((item) => WKT.convert(item.feature.geometry))
        console.log(geometries)
      }
    }
  ])

  return {
    layer: drawUtil,
    iconList: [],
    buttonList
  }
}
