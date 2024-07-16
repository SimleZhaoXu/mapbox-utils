const polygon = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="clear">清除</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import { ElMessage }from 'element-plus'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { PolygonAreaPicker } from 'mapbox-utils'
let map: mapboxgl.Map
let polygonAreaPicker: PolygonAreaPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonAreaPicker = new PolygonAreaPicker({
    style: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.2,
      'stroke-width': 2,
      'stroke-color': '#44cef6',
      'stroke-opacity': 0.5,
      'stroke-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6',
    },
    finishedStyle: {
      'fill-opacity': 0.3,
      'stroke-opacity': 1,
      'stroke-dasharray': [1, 0]
    }
  })
  polygonAreaPicker.addTo(map)
  polygonAreaPicker.on('finish', (e) => {
    console.log(e)
    ElMessage.success(\`框选完成!\`)
  })
}

const clear = () => {
  polygonAreaPicker?.clear()
}

onBeforeUnmount(() => {
  polygonAreaPicker?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
}

.button-wrapper .button {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  padding: 0 10px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
}

.button-wrapper .button:hover {
  background: #eee;
}
</style>
`

const circle = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="clear">清除</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { CircleAreaPicker } from 'mapbox-utils'
import { ElMessage }from 'element-plus'
let map: mapboxgl.Map
let circleAreaPicker: CircleAreaPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  circleAreaPicker = new CircleAreaPicker({
    style: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.2,
      'stroke-width': 2,
      'stroke-color': '#44cef6',
      'stroke-opacity': 0.5,
      'stroke-dasharray': [5, 3],
    },
    finishedStyle: {
      'fill-opacity': 0.3,
      'stroke-opacity': 1,
      'stroke-dasharray': [1, 0]
    }
  })
  circleAreaPicker.addTo(map)
  circleAreaPicker.on('finish', (e) => {
    console.log(e)
    ElMessage.success(\`框选完成!\`)
  })
}

const clear = () => {
  circleAreaPicker?.clear()
}

onBeforeUnmount(() => {
  circleAreaPicker?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
}

.button-wrapper .button {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  padding: 0 10px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
}

.button-wrapper .button:hover {
  background: #eee;
}
</style>
`

const rect = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="clear">清除</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { RectAreaPicker } from 'mapbox-utils'
import { ElMessage }from 'element-plus'
let map: mapboxgl.Map
let rectAreaPicker: PolygonAreaPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  rectAreaPicker = new RectAreaPicker({
    style: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.2,
      'stroke-width': 2,
      'stroke-color': '#44cef6',
      'stroke-opacity': 0.5,
      'stroke-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6',
    },
    finishedStyle: {
      'fill-opacity': 0.3,
      'stroke-opacity': 1,
      'stroke-dasharray': [1, 0]
    }
  })
  rectAreaPicker.addTo(map)
  rectAreaPicker.on('finish', (e) => {
    console.log(e)
    ElMessage.success(\`框选完成!\`)
  })
}

const clear = () => {
  rectAreaPicker?.clear()
}

onBeforeUnmount(() => {
  rectAreaPicker?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
}

.button-wrapper .button {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  padding: 0 10px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
}

.button-wrapper .button:hover {
  background: #eee;
}
</style>
`
export default {
  polygon,
  circle,
  rect
}
