import{b as p,_ as i,a as n}from"./index.ff7ff852.js";import{d as l}from"./pointData.047983f8.js";import{_ as s,d as r,r as o,c,h as d,k as m,o as u}from"./index.3f3ae0c4.js";const f=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { CirclePointLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: CirclePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new CirclePointLayer({
    key: 'id',
    data,
    style: {
      'circle-radius': 7,
      'circle-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': '#00ff00'
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
`,g=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import './element-plus.css'
import MapView from './map-view.vue'
import ElementPlus from 'element-plus'
import mapboxgl from 'mapbox-gl'
import { createApp, onBeforeUnmount } from 'vue'
import { CirclePointLayer } from 'mapbox-utils'
import data from './data.json'
import PointPopup from './point-popup.vue'
let map: mapboxgl.Map
let pointLayer: CirclePointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new CirclePointLayer({
    key: 'id',
    data,
    style: {
      'circle-radius': 7,
      'circle-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
    showPopup(e.lngLat, e.data)
  })
}

let popup: mapboxgl.Popup | null

const showPopup = (lngLat: mapboxgl.LngLat, data: any) => {
  removePopup()
  const dialog = createApp(PointPopup, {
    data,
    onClose: () => {
      removePopup()
    }
  })
    .use(ElementPlus)
    .mount(document.createElement('div'))
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'custom-popup',
    maxWidth: 'none'
  })
    .setLngLat(lngLat)
    .setDOMContent(dialog.$el)
    .addTo(map)
}

const removePopup = () => {
  popup?.remove()
  popup = null
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
`,v=`
<template>
  <div class="dialog">
    <div class="title">\u70B9\u4F4D\u4FE1\u606F</div>
    <el-descriptions title="" :column="1" border>
      <el-descriptions-item
        label-align="right"
        label="ID"
        class-name="id-content"
        >{{ data.id }}</el-descriptions-item
      >
      <el-descriptions-item v-if="data.type" label-align="right" label="type">{{
        data.type
      }}</el-descriptions-item>
      <el-descriptions-item
        label-align="right"
        label="\u7ECF\u5EA6"
        class-name="number-content"
        >{{ coordinates[0] }}</el-descriptions-item
      >
      <el-descriptions-item
        label-align="right"
        label="\u7EAC\u5EA6"
        class-name="number-content"
        >{{ coordinates[1] }}</el-descriptions-item
      >
    </el-descriptions>

    <div class="button-wrapper">
      <el-button type="primary" @click="handleConfirm">\u786E\u8BA4</el-button>
      <el-button @click="handleClose">\u5173\u95ED</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const coordinates = computed(() => {
  if (typeof props.data.coordinates === 'string') {
    return JSON.parse(props.data.coordinates)
  } else {
    return props.data.coordinates
  }
})

const $emit = defineEmits(['close'])
const handleClose = () => {
  $emit('close')
}

const handleConfirm = () => {
  ElMessage.success('\u786E\u8BA4\u6210\u529F')
}
<\/script>

<style scoped>
.dialog {
  background: #fff;
  overflow: hidden;
  border-radius: 10px;
  padding: 10px;
}

.title {
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
}

.dialog ::v-deep(.el-descriptions__content).id-content {
  color: red;
  font-weight: 600;
}

.dialog ::v-deep(.el-descriptions__content).number-content {
  color: #409eff;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.button-wrapper .el-button {
  margin-left: 10px;
}
</style>
`;var b={base:f,popup:g};const y={class:"circle-point-demo"},h=r({__name:"index",setup(x){const t=m(),e=o({"index.vue":{code:b[t.params.id]},"data.json":{code:l},...p});t.params.id==="popup"&&(e.value={...e.value,"point-popup.vue":{code:v}});const a=o({...n});return(_,L)=>(u(),c("div",y,[d(i,{files:e.value,"main-file":"index.vue","import-map":a.value},null,8,["files","import-map"])]))}});var E=s(h,[["__scopeId","data-v-a9a1dad8"]]);export{E as default};
