import demo1 from './templates/demo1'
import demo2 from './templates/demo2'
import demo3 from './templates/demo3'
const templateMap: Record<string, string> = {
  demo1,
  demo2,
  demo3
}
const hasIconDemos = ['demo2']

export function getTemplate(type: string) {
  return `
<template>
  <div class="page">
    <map-view${hasIconDemos.includes(type) ? ' :icon-list="iconList"' : ''} @load="handleMapLoad" />
    <div class="operation">
      <el-button @click="play">播放</el-button>
      <el-button @click="pause">暂停</el-button>
      <el-button @click="stop">停止</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import './element-plus.css'
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { ElButton } from 'element-plus'
import { onBeforeUnmount, reactive } from 'vue'
import { AdvanceCarTrack } from 'mapbox-utils'
import data from './data.json'
${templateMap[type] || ''}

const state = reactive({
  speed: 100,
  time: 0,
  startTime: data[0].timestamp,
  endTime: data[data.length - 1].timestamp,
})

const play = () => {
  carTrack.play()
}

const pause = () => {
  carTrack.pause()
}

const stop = () => {
  carTrack.stop()
}

onBeforeUnmount(() => {
  carTrack?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
}
.operation {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
`
}
