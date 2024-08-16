import{b as d,_ as r,a as p}from"./index.ff7ff852.js";import{_ as i,d as m,r as e,c as n,h as s,k as w,o as U}from"./index.3f3ae0c4.js";var c=`
let map: mapboxgl.Map
let drawUtil: DrawUtil
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  drawUtil = new DrawUtil({
    multiple: true
  })
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POINT)
  drawUtil.on('add', (e) => {
    console.log(e)
  })
}`,_=`
let map: mapboxgl.Map
let drawUtil: DrawUtil
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  drawUtil = new DrawUtil({
    multiple: true
  })
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_LINE)
  drawUtil.on('add', (e) => {
    console.log(e)
  })
}`,u=`
let map: mapboxgl.Map
let drawUtil: DrawUtil
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  drawUtil = new DrawUtil({
    multiple: true
  })
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON)
  drawUtil.on('add', (e) => {
    console.log(e)
  })
}`,v=`
let map: mapboxgl.Map
let drawUtil: DrawUtil
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  drawUtil = new DrawUtil({
    multiple: true
  })
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_RECT)
  drawUtil.on('add', (e) => {
    console.log(e)
  })
}`,M=`
let map: mapboxgl.Map
let drawUtil: DrawUtil
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  drawUtil = new DrawUtil({
    multiple: true
  })
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_CIRCLE)
  drawUtil.on('add', (e) => {
    console.log(e)
  })
}`;const g={demo1:c,demo2:_,demo3:u,demo4:v,demo5:M};function D(a){return`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { DrawUtil } from 'mapbox-utils'
${g[a]||""}
onBeforeUnmount(() => {
  drawUtil?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`}const x={class:"draw-util-demo"},f=m({__name:"index",setup(a){const l=w(),t=e({"index.vue":{code:D(l.params.id)},...d}),o=e({...p});return(h,b)=>(U(),n("div",x,[s(r,{files:t.value,"main-file":"index.vue","import-map":o.value},null,8,["files","import-map"])]))}});var L=i(f,[["__scopeId","data-v-50601d96"]]);export{L as default};
