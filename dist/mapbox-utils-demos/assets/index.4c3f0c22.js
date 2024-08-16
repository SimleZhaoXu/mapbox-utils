import{b as t,_ as p,a as m}from"./index.ff7ff852.js";import{_ as l,d as n,r as a,c as i,h as u,k as d,o as c}from"./index.3f3ae0c4.js";var _=`
let map: mapboxgl.Map
let areaMeasurer: AreaMeasurer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  areaMeasurer = new AreaMeasurer({
    multiple: false
  })
  areaMeasurer.addTo(map)
  areaMeasurer.enable()
  areaMeasurer.on('complete', (e) => {
    console.log(e)
  })

  areaMeasurer.on('delete', (e) => {
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
import { AreaMeasurer } from 'mapbox-utils'
${f[e]||""}
onBeforeUnmount(() => {
  areaMeasurer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`}const M={class:"area-measurer-demo"},x=n({__name:"index",setup(e){const r=d(),o=a({"index.vue":{code:v(r.params.id)},...t}),s=a({...m});return(g,b)=>(c(),i("div",M,[u(p,{files:o.value,"main-file":"index.vue","import-map":s.value},null,8,["files","import-map"])]))}});var y=l(x,[["__scopeId","data-v-d816d2cc"]]);export{y as default};
