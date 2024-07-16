const base = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { BufferLayer } from 'mapbox-utils'
import { ElMessage }from 'element-plus'
let map: mapboxgl.Map
let bufferLayer: BufferLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  bufferLayer = new BufferLayer({
    manual: true,
    radius: 10,
    style: {
      'stroke-color': '#177cb0',
      'stroke-width': 2,
      'fill-opacity': 0.2,
      'fill-color': '#44cef6'
    },
    centerLayer: {
      show: false
    }
  })
  bufferLayer.addTo(map)
  bufferLayer.on('change', (e) => {
    console.log(e)
  })
}
onBeforeUnmount(() => {
  bufferLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

const circleCenter = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { BufferLayer } from 'mapbox-utils'
let map: mapboxgl.Map
let bufferLayer: BufferLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  bufferLayer = new BufferLayer({
    manual: true,
    radius: 10,
    style: {
      'stroke-color': '#177cb0',
      'stroke-width': 2,
      'fill-opacity': 0.2,
      'fill-color': '#44cef6'
    },
    centerLayer: {
      show: true,
      type: 'circle',
      style: {
        'circle-color': '#0f0',
        'circle-radius': 5,
        'circle-opacity': 0.5
      }
    }
  })
  bufferLayer.addTo(map)
}
onBeforeUnmount(() => {
  bufferLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

const symbolCenter = `
<template>
  <div class="page">
    <map-view :icon-list="iconList" @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { BufferLayer } from 'mapbox-utils'
let map: mapboxgl.Map
let bufferLayer: BufferLayer
const iconList = [
  {
    name: 'buffer-center',
    path: './map-icon/buffer-center.png',
    pixelRatio: 10
  }
]
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  bufferLayer = new BufferLayer({
    manual: true,
    radius: 10,
    style: {
      'stroke-color': '#177cb0',
      'stroke-width': 2,
      'fill-opacity': 0.2,
      'fill-color': '#44cef6'
    },
    centerLayer: {
      show: true,
      type: 'symbol',
      style: {
        'icon-image': 'buffer-center',
        'icon-size': 1,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      }
    }
  })
  bufferLayer.addTo(map)
}
onBeforeUnmount(() => {
  bufferLayer?.remove()
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
  'circle-center': circleCenter,
  'symbol-center': symbolCenter
}
