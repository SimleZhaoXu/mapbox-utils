import{b as i,_ as s,a as r}from"./index.ff7ff852.js";import{d as p}from"./pointData.047983f8.js";import{_ as n,d as m,r as e,c as l,h as d,k as c,o as f}from"./index.3f3ae0c4.js";const u=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { PrismoidLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: PrismoidLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  map.setPitch(60)
  pointLayer = new PrismoidLayer({
    key: 'id',
    data,
    radius: 500,
    steps: 64,
    style: {
      'fill-extrusion-color': 'rgb(16, 146, 153)',
      'fill-extrusion-height': ['*', ['get', 'id'], 100],
      'fill-extrusion-base': 0
    },
    highlightOptions: {
      trigger: 'hover',
      style: {
        'fill-extrusion-color': '#ffff00'
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
  map.setPitch(45)
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`;var _={base:u};const v={class:"prismoid-demo"},g=m({__name:"index",setup(x){const a=c(),o=e({"index.vue":{code:_[a.params.id]},"data.json":{code:p},...i}),t=e({...r});return(h,y)=>(f(),l("div",v,[d(s,{files:o.value,"main-file":"index.vue","import-map":t.value},null,8,["files","import-map"])]))}});var k=n(g,[["__scopeId","data-v-101e46a2"]]);export{k as default};
