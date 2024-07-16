<!--
 * @Author: 汤凡
 * @Date: 2024-07-12 14:11:42
 * @LastEditors: 汤凡
 * @LastEditTime: 2024-07-12 15:43:50
-->
<template>
  <div class="geometry-picker">
    <map-view @load="handleMapLoad" />
    <div class="button-box">
      <el-button @click="switchMap('satellite')">卫星影像</el-button>
      <el-button @click="switchMap('electronic')">电子地图</el-button>
      <el-button @click="switchMap('blank')">空白</el-button>
      <el-button v-for="item in buttonList" :key="item.label" @click="item.handler">{{
        item.label
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type mapboxgl from 'mapbox-gl'
import 'mapbox-utils/dist/index.css'
import blankStyle from '@/data/map-style/blank.json'
import satelliteStyle from '@/data/map-style/satellite.json'
import electronicStyle from '@/data/map-style/electronic.json'
import MapView from '@/components/map-view/index.vue'
import { DrawUtil } from 'mapbox-utils'
import WKT from 'terraformer-wkt-parser'
import { downloadFile } from '@/utils'
const route = useRoute()
const router = useRouter()
const drawUtil = new DrawUtil({
  multiple: true
})

let map: mapboxgl.Map
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  const { lng, lat } = route.query
  if (lng && !isNaN(parseFloat(lng as string)) && lat && !isNaN(parseFloat(lat as string))) {
    map.setCenter([parseFloat(lng as string), parseFloat(lat as string)])
  }
  drawUtil.addTo(map)
  map.on('moveend', (e) => {
    const [lng, lat] = map.getCenter().toArray()
    router.replace({
      path: route.path,
      query: {
        lng,
        lat
      }
    })
  })
}
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
      if (!features.length) return
      downloadFile(
        new Blob([JSON.stringify(features)], { type: 'application/json' }),
        'features.json'
      )
    }
  },
  {
    label: '获取(wkt)',
    handler: () => {
      const geometries = drawUtil.getAll().map((item) => WKT.convert(item.feature.geometry))
      if (!geometries.length) return
      downloadFile(
        new Blob([JSON.stringify(geometries)], { type: 'application/json' }),
        'geometries.json'
      )
    }
  }
])

const maps = {
  blank: blankStyle,
  satellite: satelliteStyle,
  electronic: electronicStyle
}

const switchMap = (type: 'blank' | 'satellite' | 'electronic') => {
  // console.log(maps[type])
  //@ts-ignore
  map.setStyle(maps[type])
}
onBeforeUnmount(() => {
  drawUtil.remove()
})
</script>

<style lang="scss" scoped>
.geometry-picker {
  width: 100%;
  height: 100%;
  position: relative;
  .button-box {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
