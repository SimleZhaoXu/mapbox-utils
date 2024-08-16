import{b as p,_ as r,a as m}from"./index.ff7ff852.js";import{d as s}from"./heatmapData.cf83918a.js";import{_ as i,d as n,r as a,c as l,h as d,k as c,o as u}from"./index.3f3ae0c4.js";const _=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { HeatmapLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let heatmapLayer: HeatmapLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  heatmapLayer = new HeatmapLayer({
    data,
    fitBoundsOptions: true,
    style: {
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 13, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0, 0, 255, 0)',
        0.1,
        'royalblue',
        0.3,
        'cyan',
        0.5,
        'lime',
        0.7,
        'yellow',
        1,
        'red'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 13, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 0]
    }
  })
  heatmapLayer.addTo(map)
  heatmapLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  heatmapLayer?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`;var f={base:_};const v={class:"circle-point-demo"},y=n({__name:"index",setup(h){const e=c(),t=a({"index.vue":{code:f[e.params.id]},"data.json":{code:s},...p}),o=a({...m});return(x,b)=>(u(),l("div",v,[d(r,{files:t.value,"main-file":"index.vue","import-map":o.value},null,8,["files","import-map"])]))}});var w=i(y,[["__scopeId","data-v-5c6cad7e"]]);export{w as default};
