import{b as l,_ as r,a as n}from"./index.ff7ff852.js";import{d as c}from"./clusterData.0156fe3c.js";import{_ as p,d as s,r as t,c as m,h as u,k as d,o as g}from"./index.3f3ae0c4.js";var y=`
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 5
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': '#0f0',
          'circle-radius': 5
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}`,h=`
const iconList = [
  {
    name: 'alarm-01',
    path: './map-icon/alarm-01.png',
    pixelRatio: 1
  },
  {
    name: 'alarm-01-active',
    path: './map-icon/alarm-01-active.png',
    pixelRatio: 1
  }
]
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      highlight: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01-active',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`,f=`
const iconList = [
  {
    name: 'alarm-01',
    path: './map-icon/alarm-01.png',
    pixelRatio: 2
  },
  {
    name: 'alarm-01-active',
    path: './map-icon/alarm-01-active.png',
    pixelRatio: 2
  },
  {
    name: 'cluster',
    path: './map-icon/cluster.png',
    pixelRatio: 2
  }
]
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      highlight: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01-active',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      cluster: {
        type: 'symbol',
        layout: {
          'icon-image': 'cluster',
          'icon-size': 1,
          'icon-anchor': 'bottom',
          'text-field': ['get', 'point_count'],
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, -2.7],
          'text-anchor': 'center',
          'text-size': 16,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#fff'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true,
    cluster: true,
    clusterLayers: ['cluster']
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`,v=`
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'circle',
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': 'rgb(10, 155, 82)',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      },
      cluster: {
        type: 'circle',
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      },
      clusterNum: {
        type: 'symbol',
        layout: {
          'text-field': ['get', 'point_count'],
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'center',
          'text-size': 16,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#000'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true,
    cluster: true,
    clusterLayers: ['cluster', 'clusterNum']
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`,L=`
const iconList = [
  {
    name: 'cluster',
    path: './map-icon/cluster.png',
    pixelRatio: 2
  }
]
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'circle',
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': 'rgb(10, 155, 82)',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      },
      cluster: {
        type: 'symbol',
        layout: {
          'icon-image': 'cluster',
          'icon-size': 1,
          'icon-anchor': 'bottom',
          'text-field': ['get', 'point_count'],
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, -2.7],
          'text-anchor': 'center',
          'text-size': 16,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#fff'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true,
    cluster: true,
    clusterLayers: ['cluster']
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`,x=`
const iconList = [
  {
    name: 'alarm-01',
    path: './map-icon/alarm-01.png',
    pixelRatio: 2
  },
  {
    name: 'alarm-01-active',
    path: './map-icon/alarm-01-active.png',
    pixelRatio: 2
  }
]
let map: mapboxgl.Map
let pointLayer: AdvancePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      highlight: {
        type: 'symbol',
        layout: {
          'icon-image': 'alarm-01-active',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      cluster: {
        type: 'circle',
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      },
      clusterNum: {
        type: 'symbol',
        layout: {
          'text-field': ['get', 'point_count'],
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'center',
          'text-size': 16,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#000'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true,
    cluster: true,
    clusterLayers: ['cluster', 'clusterNum']
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
`;const b={demo1:y,demo2:h,demo3:f,demo4:v,demo5:L,demo6:x},_=["demo2","demo3","demo5","demo6"];function k(e){return`
<template>
  <div class="page">
    <map-view${_.includes(e)?' :icon-list="iconList"':""} @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { AdvancePointLayer } from 'mapbox-utils'
import data from './data.json'
${b[e]||""}
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
`}const w={class:"advance-point-demo"},M=s({__name:"index",setup(e){const a=d(),o=t({"index.vue":{code:k(a.params.id)},"data.json":{code:c},...l}),i=t({...n});return(P,T)=>(g(),m("div",w,[u(r,{files:o.value,"main-file":"index.vue","import-map":i.value},null,8,["files","import-map"])]))}});var B=p(M,[["__scopeId","data-v-0d7be877"]]);export{B as default};
