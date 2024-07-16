const base = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import { ElMessage } from 'element-plus'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { PointPicker } from 'mapbox-utils'
let map: mapboxgl.Map
let pointPicker: PointPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointPicker = new PointPicker({
    // multiple: false,
    // removeOnClick: false,
    markerOptions: {
      color: 'red'
    }
  })
  pointPicker.addTo(map)
  pointPicker.on('get-point', (e) => {
    ElMessage.success(\`获取坐标：\${ e.point }\`)
  })
  pointPicker.on('click-point', (e) => {
    ElMessage.success(\`点位被点击：\${ e.point }\`)
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

const custom = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'
import { PointPicker } from 'mapbox-utils'
let map: mapboxgl.Map
let pointPicker: PointPicker

const markerNode = document.createElement('img')
markerNode.style.width = '54px'
markerNode.style.height = '54px'
markerNode.src = './map-icon/icon-point.png'

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointPicker = new PointPicker({
    markerOptions: {
      element: markerNode,
      offset: [0, -18]
    }
  })
  pointPicker.addTo(map)
  pointPicker.on('get-point', (e) => {
    ElMessage.success(\`获取坐标：\${ e.point }\`)
  })
  pointPicker.on('click-point', (e) => {
    ElMessage.success(\`点位被点击：\${ e.point }\`)
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

export default {
  base,
  custom
}
