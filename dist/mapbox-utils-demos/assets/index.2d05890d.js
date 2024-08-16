import{b as t,_ as l,a as p}from"./index.ff7ff852.js";import{_ as i,d as s,r as e,c as m,h as f,k as n,o as c}from"./index.3f3ae0c4.js";const u=`
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
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`,d=`
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
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`,y=`
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
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`;var b={base:u,"circle-center":d,"symbol-center":y};const v={class:"circle-point-demo"},L=s({__name:"index",setup(g){const a=n(),o=e({"index.vue":{code:b[a.params.id]},...t}),r=e({...p});return(_,h)=>(c(),m("div",v,[f(l,{files:o.value,"main-file":"index.vue","import-map":r.value},null,8,["files","import-map"])]))}});var M=i(L,[["__scopeId","data-v-fb8931a4"]]);export{M as default};
