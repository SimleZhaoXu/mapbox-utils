const base = `
<template>
  <div class="page">
    <div ref="container" class="container"></div>
    <div class="button-wrapper">
      <el-slider v-model="position" :step="0.01" :max="1" :min="0" @input="setSlider" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import './mapbox-gl.css'
import './mapbox-utils.css'
import { ElSlider } from 'element-plus'
import firstMapStyle from './map_sn.json'
import secondMapStyle from './map_sn.json'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import data from './data.json'
import { MapComparer, CirclePointLayer, HeatmapLayer } from 'mapbox-utils'
const container = ref<HTMLElement>()
let comparer

const position = ref(0.5)

onMounted(() => {
  comparer = new MapComparer({
    container: container.value,
    horizontal: false,
    firstMapStyle,
    secondMapStyle,
    mapOptions: {
      zoom: 9,
      minZoom: 1,
      maxZoom: 18,
      center: [105.5, 30.6]
    }
  })

  setTimeout(() => {
    pointLayer.addTo(comparer.firstMap)
    heatmapLayer.addTo(comparer.secondMap)
  }, 200)
})

const pointLayer = new CirclePointLayer({
  key: 'id',
  data,
  style: {
    'circle-radius': 5,
    'circle-color': '#ff0000'
  }
})

const heatmapLayer = new HeatmapLayer({
  data,
  style: {
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 13, 3],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(0, 0, 255, 0)',
      0.1,
      'royalblue',
      0.3,
      'cyan',
      0.5,
      'lime',
      0.7,
      'yellow',
      1,
      'red'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 13, 20],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 0]
  }
})

const setSlider = () => {
  comparer.setSlider(position.value)
}

onBeforeUnmount(() => {
  pointLayer.remove()
  heatmapLayer.remove()
  comparer.remove()
})
</script>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.button-wrapper {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
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

.button-wrapper .button:not(:first-of-type) {
  margin-left: 10px;
}

.container {
  width: 100%;
  height: 100%;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
`

export default {
  base
}
