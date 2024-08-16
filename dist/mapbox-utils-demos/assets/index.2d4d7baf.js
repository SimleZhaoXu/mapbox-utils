import{b as i,_ as r,a as s}from"./index.ff7ff852.js";import{_ as n,d as l,r as e,c as p,h as c,k as d,o as m}from"./index.3f3ae0c4.js";const u=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="clear">\u6E05\u9664</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'
import { LinePicker } from 'mapbox-utils'
let map: mapboxgl.Map
let linePicker: LinePicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  linePicker = new LinePicker({
    style: {
      'line-width': 2,
      'line-color': '#44cef6',
      'line-opacity': 0.5,
      'line-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6',
    },
    finishedStyle: {
      'line-opacity': 1,
      'line-dasharray': [1, 0],
    }
  })
  linePicker.addTo(map)
  linePicker.on('finish', (e) => {
    ElMessage.success(\`\u7ED8\u5236\u5B8C\u6210\`)
  })
}

const clear = () => {
  linePicker?.clear()
}
onBeforeUnmount(() => {
  linePicker?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

.button-wrapper .button {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  padding: 0 10px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
}

.button-wrapper .button:hover {
  background: #eee;
}
</style>
`;var f={base:u};const v={class:"circle-point-demo"},_=l({__name:"index",setup(x){const t=d(),a=e({"index.vue":{code:f[t.params.id]},...i}),o=e({...s});return(b,h)=>(m(),p("div",v,[c(r,{files:a.value,"main-file":"index.vue","import-map":o.value},null,8,["files","import-map"])]))}});var y=n(_,[["__scopeId","data-v-74becf79"]]);export{y as default};
