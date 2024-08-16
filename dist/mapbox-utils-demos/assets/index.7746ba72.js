import{b as i,_ as p,a as s}from"./index.ff7ff852.js";import{_ as r,d as n,r as e,c as m,h as l,k as c,o as u}from"./index.3f3ae0c4.js";const d=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import { ElMessage } from 'element-plus'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { PointPicker } from 'mapbox-utils'
let map: mapboxgl.Map
let pointPicker: PointPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointPicker = new PointPicker({
    // multiple: false,
    // removeOnClick: false,
    markerOptions: {
      color: 'red'
    }
  })
  pointPicker.addTo(map)
  pointPicker.on('get-point', (e) => {
    ElMessage.success(\`\u83B7\u53D6\u5750\u6807\uFF1A\${ e.point }\`)
  })
  pointPicker.on('click-point', (e) => {
    ElMessage.success(\`\u70B9\u4F4D\u88AB\u70B9\u51FB\uFF1A\${ e.point }\`)
  })
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
`,f=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'
import { PointPicker } from 'mapbox-utils'
let map: mapboxgl.Map
let pointPicker: PointPicker

const markerNode = document.createElement('img')
markerNode.style.width = '54px'
markerNode.style.height = '54px'
markerNode.src = './map-icon/icon-point.png'

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointPicker = new PointPicker({
    markerOptions: {
      element: markerNode,
      offset: [0, -18]
    }
  })
  pointPicker.addTo(map)
  pointPicker.on('get-point', (e) => {
    ElMessage.success(\`\u83B7\u53D6\u5750\u6807\uFF1A\${ e.point }\`)
  })
  pointPicker.on('click-point', (e) => {
    ElMessage.success(\`\u70B9\u4F4D\u88AB\u70B9\u51FB\uFF1A\${ e.point }\`)
  })
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
`;var v={base:d,custom:f};const k={class:"circle-point-demo"},g=n({__name:"index",setup(_){const o=c(),t=e({"index.vue":{code:v[o.params.id]},...i}),a=e({...s});return(P,x)=>(u(),m("div",k,[l(p,{files:t.value,"main-file":"index.vue","import-map":a.value},null,8,["files","import-map"])]))}});var B=r(g,[["__scopeId","data-v-04367ba1"]]);export{B as default};
