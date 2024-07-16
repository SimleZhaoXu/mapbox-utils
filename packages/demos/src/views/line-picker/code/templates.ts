const base = `
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
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'
import { LinePicker } from 'mapbox-utils'
let map: mapboxgl.Map
let linePicker: LinePicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  linePicker = new LinePicker({
    style: {
      'line-width': 2,
      'line-color': '#44cef6',
      'line-opacity': 0.5,
      'line-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6',
    },
    finishedStyle: {
      'line-opacity': 1,
      'line-dasharray': [1, 0],
    }
  })
  linePicker.addTo(map)
  linePicker.on('finish', (e) => {
    ElMessage.success(\`绘制完成\`)
  })
}

const clear = () => {
  linePicker?.clear()
}
onBeforeUnmount(() => {
  linePicker?.remove()
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
  bottom: 20px;
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
  base
}
