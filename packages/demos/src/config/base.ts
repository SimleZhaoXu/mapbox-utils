import map_jj from '@/data/map-style/map_jj.json?raw'
import map_sn from '@/data/map-style/map_sn.json?raw'
import map_china from '@/data/map-style/map_china.json?raw'
import mapCss from 'mapbox-gl/dist/mapbox-gl.css'
import mapUtilsCss from 'mapbox-utils/dist/index.css'
import elCss from 'element-plus/dist/index.css'
const MapViewCoed = `
<template>
  <div class="map-box">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<script lang="ts" setup>
import './mapbox-gl.css'
import './mapbox-utils.css'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapStyle from './map_china.json'
const props = defineProps<{
  iconList?: Array<{
    name: string
    path: string
    pixelRatio?: number
    sdf?: boolean
  }>
}>()
const mapContainer = ref()
let map: mapboxgl.Map
const $emit = defineEmits(['load'])
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    zoom: 10,
    minZoom: 1,
    maxZoom: 18,
    // 遂宁
    center: [105.5, 30.6],
    // 江津
    // center: [106.28654354159039, 29.019623676352808],
    style: MapStyle as mapboxgl.Style
  })

  props.iconList?.forEach((icon) => {
    map.loadImage(icon.path, (error: any, image: any) => {
      if (error) {
        throw error
      }
      map.addImage(icon.name, image, {
        pixelRatio: icon.pixelRatio ?? 1,
        sdf: icon.sdf ?? false
      })
    })
  })

  setTimeout(() => {
    $emit('load', map)
  }, 200)
})

onBeforeUnmount(() => {
  map?.remove()
})
</script>

<style scoped>
.map-box {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map-box .map-container {
  width: 100%;
  height: 100%;
  background-color: rgba(1, 19, 33, 1);
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
`
export const baseFiles = {
  'map-view.vue': {
    code: MapViewCoed
  },
  'map_jj.json': {
    code: map_jj,
    hidden: true
  },
  'map_sn.json': {
    code: map_sn,
    hidden: true
  },
  'map_china.json': {
    code: map_china,
    hidden: true
  },
  'mapbox-gl.css': {
    code: mapCss,
    hidden: true
  },
  'mapbox-utils.css': {
    code: mapUtilsCss,
    hidden: true
  },
  'element-plus.css': {
    code: elCss,
    hidden: true
  }
}
export const baseImportMap = {
  vue: './lib/vue.runtime.esm-browser.js',
  'mapbox-utils': './lib/mapbox-utils.esm.js',
  nanoid: './lib/nanoid.esm.js',
  '@turf/turf': './lib/turf.esm.js',
  'mapbox-gl': './lib/mapbox-gl.esm.js',
  'element-plus': './lib/element-plus.esm.js',
  'element-plus/dist/index.css': './lib/element-plus.css'
}
