const base = `
<template>
  <div class="page">
    <map-view :icon-list="iconList" @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="play">播放</div>
      <div class="button" @click="pause">暂停</div>
      <div class="button" @click="replay">重新播放</div>
      <div class="button" @click="stop">停止播放</div>
      <div class="button" @click="fitBounds">fitBounds</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { CarTrack } from 'mapbox-utils'
import data from './data.ts'
let map: mapboxgl.Map
let track: CarTrack

const iconList = [
  {
    path: './map-icon/icon-plane.png',
    name: 'icon-plane',
    pixelRatio: 10
  }
]

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  track = new CarTrack({
    speed: 10,
    data,
    carLayer: {
      show: true,
      type: 'symbol',
      style: {
        'icon-image': 'icon-plane',
        'icon-rotate': ['+', ['get', 'bearing'], 45]
      }
    },
    currentPathLayer: {
      style: {
        'line-color': '#f00',
        'line-opacity': 0.4
      }
    },
    pathLayer: {
      style: {
        'line-color': '#0f0',
        'line-opacity': 0.4
      }
    },
    fitBoundsOptions: {
      padding: 40
    }
  })
  track.addTo(map)
}

const play = () => {
  track.play()
}

const pause = () => {
  track.pause()
}

const replay = () => {
  track.replay()
}

const stop = () => {
  track.stop()
}

const fitBounds = () => {
  track.fitBounds()
}

onBeforeUnmount(() => {
  track?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
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
</style>
`

export default {
  base
}
