import{b as t,_ as o,a as r}from"./index.ff7ff852.js";import{d as p}from"./lineData.fdbbc807.js";import{_ as d,d as u,r as a,c as h,h as c,k as s,o as m}from"./index.3f3ae0c4.js";var y=`
let map: mapboxgl.Map
let lineLayer: AdvanceLineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new AdvanceLineLayer({
    key: 'id',
    data,
    // data: './data/lineData.json',
    layerPool: {
      default: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#ff0000'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlight: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#00ff00'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  lineLayer.addTo(map)
}`,g=`
let map: mapboxgl.Map
let lineLayer: AdvanceLineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new AdvanceLineLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#ff0000'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlight: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#00ff00'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlightOuter: {
        type: 'line',
        paint: {
          'line-width': 16,
          'line-color': '#00ff00',
          'line-opacity': 0.4
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlightOuter', 'highlight'],
    fitBoundsOptions: true
  })
  lineLayer.addTo(map)
}`,f=`
let map: mapboxgl.Map
let lineLayer: AdvanceLineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new AdvanceLineLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#ff0000'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      defaultOuter: {
        type: 'line',
        paint: {
          'line-width': 16,
          'line-color': '#ff0000',
          'line-opacity': 0.3
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlight: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#00ff00'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlightOuter: {
        type: 'line',
        paint: {
          'line-width': 16,
          'line-color': '#00ff00',
          'line-opacity': 0.3
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      }
    },
    layers: ['defaultOuter', 'default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlightOuter', 'highlight'],
    fitBoundsOptions: true
  })
  lineLayer.addTo(map)
}`;const v={demo1:y,demo2:g,demo3:f};function L(e){return`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { AdvanceLineLayer } from 'mapbox-utils'
import data from './data.json'
${v[e]||""}
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
`}const _={class:"advance-line-demo"},x=u({__name:"index",setup(e){const i=s(),n=a({"index.vue":{code:L(i.params.id)},"data.json":{code:p},...t}),l=a({...r});return(w,b)=>(m(),h("div",_,[c(o,{files:n.value,"main-file":"index.vue","import-map":l.value},null,8,["files","import-map"])]))}});var O=d(x,[["__scopeId","data-v-506ab8bd"]]);export{O as default};
