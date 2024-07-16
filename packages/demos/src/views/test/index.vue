<!--
 * @Author: 汤凡
 * @Date: 2024-05-30 11:01:25
 * @LastEditors: 汤凡
 * @LastEditTime: 2024-07-12 14:16:34
-->
<template>
  <div class="test">
    <map-view :icon-list="iconList" @load="handleMapLoad" />
    <div class="test-box">
      <el-button @click="switchMap('satellite')">卫星影像</el-button>
      <el-button @click="switchMap('electronic')">电子地图</el-button>
      <el-button @click="switchMap('blank')">空白</el-button>
      <el-button @click="addTo">添加</el-button>
      <el-button @click="remove">移除</el-button>

      <el-button v-for="item in buttonList" :key="item.label" @click="item.handler">{{
        item.label
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import type mapboxgl from 'mapbox-gl'
import 'mapbox-utils/dist/index.css'
import blankStyle from '@/data/map-style/blank.json'
import satelliteStyle from '@/data/map-style/satellite.json'
import electronicStyle from '@/data/map-style/electronic.json'
// import MapView from '@/components/map-view-switchable/index.vue'
import MapView from '@/components/map-view/index.vue'
import useCirclePointLayerTest from './circle-point-layer/index'
import useSymbolPointLayerTest from './symbol-point-layer/index'
import useCircleClusterLayerTest from './circle-cluster-layer/index'
import useSymbolClusterLayerTest from './symbol-cluster-layer/index'
import useHeatmapLayerTest from './heatmap-layer/index'
import useBufferLayerTest from './buffer-layer/index'
import useCarTrackTest from './car-track/index'
import useLineLayerTest from './line-layer/index'
import usePolygonLayerTest from './polygon-layer/index'
import usePrismoidLayerTest from './prismoid-layer/index'
import usePolygonAreaPickerTest from './polygon-area-picker/index'
import useCircleAreaPickerTest from './circle-area-picker/index'
import useRectAreaPickerTest from './rect-area-picker/index'
import useLinePickerTest from './line-picker/index'
import useAdvanceLineLayerTest from './advance-line/index'
import useAdvancePointLayerTest from './advance-point/index'
import useAdvancePolygonLayerTest from './advance-polygon'
import useDistanceMeasurer from './distance-measurer'
import useAreaMeasurer from './area-measurer'
import useDrawUtil from './draw-util'
import useAdvanceCarTrack from './advance-car-track'
// const { layer, iconList } = useCirclePointLayerTest()
// const { layer, iconList } = useSymbolPointLayerTest()
// const { layer, iconList } = useCircleClusterLayerTest()
// const { layer, iconList } = useSymbolClusterLayerTest()
// const { layer, iconList } = useHeatmapLayerTest()
// const { layer, iconList } = useBufferLayerTest()
// const { layer, iconList } = useCarTrackTest()
// const { layer, iconList } = useLineLayerTest()
// const { layer, iconList } = usePolygonLayerTest()
// const { layer, iconList } = usePrismoidLayerTest()
// const { layer, iconList } = usePolygonAreaPickerTest()
// const { layer, iconList } = useCircleAreaPickerTest()
// const { layer, iconList } = useRectAreaPickerTest()
// const { layer, iconList } = useLinePickerTest()
// const { layer, iconList, buttonList = [] } = useAdvanceLineLayerTest()
// const { layer, iconList } = useAdvancePointLayerTest()
// const { layer, iconList } = useAdvancePolygonLayerTest()
// const { layer, iconList, buttonList } = useDistanceMeasurer()
// const { layer, iconList, buttonList } = useAreaMeasurer()
const { layer, iconList, buttonList } = useDrawUtil()
// const { layer, iconList, buttonList } = useAdvanceCarTrack()
let map: mapboxgl.Map
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  layer.addTo(map)
}

const maps = {
  blank: blankStyle,
  satellite: satelliteStyle,
  electronic: electronicStyle
}

const remove = () => {
  layer.remove()
}

const addTo = () => {
  layer.addTo(map)
}
const switchMap = (type: 'blank' | 'satellite' | 'electronic') => {
  // console.log(maps[type])
  //@ts-ignore
  map.setStyle(maps[type])
}
onBeforeUnmount(() => {
  layer.remove()
})
</script>

<style lang="scss" scoped>
.test {
  width: 100%;
  height: 100%;
  position: relative;
  .test-box {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
