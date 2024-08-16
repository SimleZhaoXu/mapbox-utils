<template>
  <div class="map-box">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<script lang="ts" setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-postting/dist/index.css'
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapStyle from '../data/map_tian.json'
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
    center: [105.5, 30.6], // 遂宁
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
