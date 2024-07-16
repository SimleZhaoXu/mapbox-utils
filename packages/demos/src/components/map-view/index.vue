<template>
  <div class="map-box">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<script lang="ts" setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapStyle from '@/data/map-style/map_china.json'
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
    center: [106.263683, 29.274074],
    style: MapStyle as mapboxgl.Style
  })

  // props.iconList?.forEach((icon) => {
  //   map.loadImage(icon.path, (error: any, image: any) => {
  //     if (error) {
  //       throw error
  //     }
  //     map.addImage(icon.name, image, {
  //       pixelRatio: icon.pixelRatio ?? 1,
  //       sdf: icon.sdf ?? false
  //     })
  //   })
  // })

  map.on('load', handleMapLoad)
  map.on('data', handleData)
})

const handleMapLoad = () => {
  $emit('load', map)
}

const handleData = (e: any) => {
  if (e.dataType === 'style') {
    props.iconList?.forEach((icon) => {
      if (map?.hasImage(icon.name)) return
      map.loadImage(icon.path, (error: any, image: any) => {
        if (error) {
          throw error
        }
        if (map?.hasImage(icon.name)) return
        map.addImage(icon.name, image, {
          pixelRatio: icon.pixelRatio ?? 1,
          sdf: icon.sdf ?? false
        })
      })
    })
  }
}
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
