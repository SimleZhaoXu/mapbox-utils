import{b as f,_ as r,a as p}from"./index.ff7ff852.js";import{_ as t,d as c,r as a,c as l,h as m,k as u,o as v}from"./index.3f3ae0c4.js";var s=`
let map: mapboxgl.Map
let advanceBuffer: AdvanceBuffer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  advanceBuffer = new AdvanceBuffer({
    multiple: true
  })
  advanceBuffer.addTo(map)
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POINT)
  advanceBuffer.on('add', (e) => {
    console.log(e)
  })
}`,i=`
let map: mapboxgl.Map
let advanceBuffer: AdvanceBuffer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  advanceBuffer = new AdvanceBuffer({
    multiple: true
  })
  advanceBuffer.addTo(map)
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.LINE)
  advanceBuffer.on('add', (e) => {
    console.log(e)
  })
}`,B=`
let map: mapboxgl.Map
let advanceBuffer: AdvanceBuffer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  advanceBuffer = new AdvanceBuffer({
    multiple: true
  })
  advanceBuffer.addTo(map)
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.RECT)
  advanceBuffer.on('add', (e) => {
    console.log(e)
  })
}`,_=`
let map: mapboxgl.Map
let advanceBuffer: AdvanceBuffer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  advanceBuffer = new AdvanceBuffer({
    multiple: true
  })
  advanceBuffer.addTo(map)
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POLYGON)
  advanceBuffer.on('add', (e) => {
    console.log(e)
  })
}`;const M={demo1:s,demo2:i,demo3:B,demo4:_};function g(e){return`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { AdvanceBuffer } from 'mapbox-utils'
${M[e]||""}
onBeforeUnmount(() => {
  advanceBuffer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`}const x={class:"advance-buffer-demo"},b=c({__name:"index",setup(e){const o=u(),n=a({"index.vue":{code:g(o.params.id)},...f}),d=a({...p});return(h,A)=>(v(),l("div",x,[m(r,{files:n.value,"main-file":"index.vue","import-map":d.value},null,8,["files","import-map"])]))}});var w=t(b,[["__scopeId","data-v-5728641b"]]);export{w as default};
