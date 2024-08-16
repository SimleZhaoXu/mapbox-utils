import{b as i,_ as n,a as r}from"./index.ff7ff852.js";import{d as p}from"./polygonData.e27a504a.js";import{_ as d,d as g,r as a,c as y,h as s,k as m,o as h}from"./index.3f3ae0c4.js";var f=`
let map: mapboxgl.Map
let polygonLayer: AdvancePolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new AdvancePolygonLayer({
    key: 'name',
    data,
    // data: './data/polygonData.json',
    layerPool: {
      default: {
        type: 'fill',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3
        }
      },
      highlight: {
        type: 'fill',
        paint: {
          'fill-color': '#0f0',
          'fill-opacity': 0.3
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'manual',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  polygonLayer.addTo(map)
  polygonLayer.on('click', e => {
    polygonLayer.easeTo(e.data.name)
    polygonLayer.setHighlight(e.data.name)
  })
}`,c=`
let map: mapboxgl.Map
let polygonLayer: AdvancePolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new AdvancePolygonLayer({
    key: 'name',
    data,
    layerPool: {
      default: {
        type: 'fill',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3
        }
      },
      defaultBorder: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 2
        }
      },
      highlight: {
        type: 'fill',
        paint: {
          'fill-color': '#0f0',
          'fill-opacity': 0.3
        }
      },
      highlightBorder: {
        type: 'line',
        paint: {
          'line-color': '#0f0',
          'line-width': 2
        }
      },
    },
    layers: ['default', 'defaultBorder'],
    highlightTrigger: 'hover',
    highlightLayers: ['highlight', 'highlightBorder'],
    fitBoundsOptions: true
  })
  polygonLayer.addTo(map)
}`,u=`
let map: mapboxgl.Map
let polygonLayer: AdvancePolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new AdvancePolygonLayer({
    key: 'name',
    data,
    layerPool: {
      default: {
        type: 'fill',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3
        }
      },
      defaultBorder: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 2
        }
      },
      highlightBorder: {
        type: 'line',
        paint: {
          'line-color': '#0f0',
          'line-width': 2
        }
      },
    },
    layers: ['default', 'defaultBorder'],
    highlightTrigger: 'hover',
    highlightLayers: ['default', 'highlightBorder'],
    fitBoundsOptions: true
  })
  polygonLayer.addTo(map)
}`;const v={demo1:f,demo2:c,demo3:u};function L(e){return`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { AdvancePolygonLayer } from 'mapbox-utils'
import data from './data.json'
${v[e]||""}
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
`}const _={class:"advance-polygon-demo"},x=g({__name:"index",setup(e){const o=m(),l=a({"index.vue":{code:L(o.params.id)},"data.json":{code:p},...i}),t=a({...r});return(B,M)=>(h(),y("div",_,[s(n,{files:l.value,"main-file":"index.vue","import-map":t.value},null,8,["files","import-map"])]))}});var T=d(x,[["__scopeId","data-v-99ab63e2"]]);export{T as default};
