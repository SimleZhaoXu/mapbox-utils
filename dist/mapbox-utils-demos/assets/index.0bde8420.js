import{b as p,_ as s,a as l}from"./index.ff7ff852.js";import{d as r}from"./polygonData.e27a504a.js";import{_ as i,d as n,r as e,c as m,h as d,k as c,o as y}from"./index.3f3ae0c4.js";const f=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { PolygonLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let polygonLayer: PolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new PolygonLayer({
    key: 'name',
    data,
    style: {
      'stroke-color': "#ff0000",
      'stroke-opacity': 0.3,
      'fill-color': "#FF0000",
      'fill-opacity': 0.3,
    },
    highlightOptions: {
      trigger: "click",
      style: {
        'stroke-opacity': 0.5,
        'fill-opacity': 0.5,
      },
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  polygonLayer.addTo(map)
  polygonLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  polygonLayer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`;var _={base:f};const g={class:"polygon-demo"},u=n({__name:"index",setup(v){const o=c(),a=e({"index.vue":{code:_[o.params.id]},"data.json":{code:r},...p}),t=e({...l});return(x,h)=>(y(),m("div",g,[d(s,{files:a.value,"main-file":"index.vue","import-map":t.value},null,8,["files","import-map"])]))}});var M=i(u,[["__scopeId","data-v-1285bf30"]]);export{M as default};
