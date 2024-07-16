const base = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import type mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { MarkerPointLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: MarkerPointLayer

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      color: '#f00'
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
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

const custom1 = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { MarkerPointLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: MarkerPointLayer

const markerNode = document.createElement('img')
markerNode.style.width = '54px'
markerNode.style.height = '54px'
markerNode.src = './map-icon/icon-point.png'

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      element: markerNode
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
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

const custom2 = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount, createApp } from 'vue'
import { MarkerPointLayer } from 'mapbox-utils'
import data from './data.json'
import CustomMarker from './custom-marker.vue'
let map: mapboxgl.Map
let pointLayer: MarkerPointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      element: (data: any) => {
        return createApp(CustomMarker, { data }).mount(document.createElement('div')).$el
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
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

export const customMakerTpl = `
<template>
  <div>
    <div class="custom-marker" :class="\`marker-\${data.type}\`">
      <span> 测试{{ data.id }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.custom-marker {
  --color: #ff22bb;
  font-family: 'Poppins', sans-serif;
  padding: 0 20px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background: #000000;
  cursor: pointer;
  position: relative;
  transition: 1s;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
}

.custom-marker span {
  position: relative;
  z-index: 1;
}

.custom-marker.marker-1 {
  --color: #b0a4e3;
}
.custom-marker.marker-2 {
  --color: #9ed900;
}
.custom-marker.marker-3 {
  --color: #ff8c31;
}
.custom-marker.marker-4 {
  --color: #ff4c00;
}

.custom-marker:hover {
  background: var(--color);
  box-shadow: 0 0 10px var(--color), 0 0 30px var(--color),
    0 0 60px var(--color), 0 0 100px var(--color);
}
.custom-marker:hover::before {
  width: 150%;
}
.custom-marker:hover::after {
  background: var(--color);
}
.custom-marker:before {
  content: '';
  position: absolute;
  width: 20px;
  height: 400%;
  background: var(--color);
  animation: animate 2s linear infinite;
}
.custom-marker:after {
  content: '';
  inset: 2px;
  position: absolute;
  background: #0e1538;
  transition: all 0.5s;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
`

export default {
  base,
  custom1,
  custom2
}
