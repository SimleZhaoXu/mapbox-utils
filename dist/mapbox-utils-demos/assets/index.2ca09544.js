import{b as i,_ as s,a as n}from"./index.ff7ff852.js";import{d as p}from"./lineData.fdbbc807.js";import{_ as r,d as l,r as e,c as m,h as d,k as c,o as _}from"./index.3f3ae0c4.js";const f=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { LineLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let lineLayer: LineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new LineLayer({
    key: 'id',
    data,
    style: {
      'line-width': 4,
      'line-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'line-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  lineLayer.addTo(map)
  lineLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  lineLayer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`;var u={base:f};const v={class:"circle-point-demo"},g=l({__name:"index",setup(y){const a=c(),o=e({"index.vue":{code:u[a.params.id]},"data.json":{code:p},...i}),t=e({...n});return(x,L)=>(_(),m("div",v,[d(s,{files:o.value,"main-file":"index.vue","import-map":t.value},null,8,["files","import-map"])]))}});var k=r(g,[["__scopeId","data-v-9e69cf44"]]);export{k as default};
