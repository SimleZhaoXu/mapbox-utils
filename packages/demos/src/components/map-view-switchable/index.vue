<template>
  <div class="map-box">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<script lang="ts" setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, onUnmounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import 'mapbox-gl-style-switcher/styles.css'
mapboxgl.accessToken =
  'pk.eyJ1IjoiYmxhY2stc3RhciIsImEiOiJjbGE2OTg1OHcxaWVqM29wcXlrZDB1dGtwIn0.zq4VzTSE6EVZWO_AZCKRNQ'
const props = defineProps<{
  iconList?: Array<{
    name: string
    path: string
    pixelRatio?: number
    sdf?: boolean
  }>
}>()
const mapboxStyleSwitcherControl = new MapboxStyleSwitcherControl()
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
    style: 'mapbox://styles/mapbox/dark-v11'
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
  map.on('style.load', handleStyleLoad)
})

onUnmounted(() => {
  map?.off('load', handleMapLoad)
  map?.off('style.load', handleStyleLoad)
})

const handleStyleLoad = () => {
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
}

const handleMapLoad = () => {
  map.addControl(mapboxStyleSwitcherControl, 'top-left')
  $emit('load', map)
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
