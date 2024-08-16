import{b as r,_ as n,a as p}from"./index.ff7ff852.js";import{_ as i,d as m,r as a,c as l,h as c,k as d,o as u}from"./index.3f3ae0c4.js";var _=`
let map: mapboxgl.Map
let distanceMeasurer: DistanceMeasurer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  distanceMeasurer = new DistanceMeasurer({
    multiple: false
  })
  distanceMeasurer.addTo(map)
  distanceMeasurer.enable()
  distanceMeasurer.on('complete', (e) => {
    console.log(e)
  })

  distanceMeasurer.on('delete', (e) => {
    console.log(e)
  })
}`;const f={demo1:_};function v(e){return`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { DistanceMeasurer } from 'mapbox-utils'
${f[e]||""}
onBeforeUnmount(() => {
  distanceMeasurer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`}const M={class:"distance-measurer-demo"},x=m({__name:"index",setup(e){const s=d(),t=a({"index.vue":{code:v(s.params.id)},...r}),o=a({...p});return(g,b)=>(u(),l("div",M,[c(n,{files:t.value,"main-file":"index.vue","import-map":o.value},null,8,["files","import-map"])]))}});var y=i(x,[["__scopeId","data-v-edebee5c"]]);export{y as default};
