const base = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { PolygonLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let polygonLayer: PolygonLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  polygonLayer = new PolygonLayer({
    key: 'name',
    data,
    style: {
      'stroke-color': "#ff0000",
      'stroke-opacity': 0.3,
      'fill-color': "#FF0000",
      'fill-opacity': 0.3,
    },
    highlightOptions: {
      trigger: "click",
      style: {
        'stroke-opacity': 0.5,
        'fill-opacity': 0.5,
      },
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  polygonLayer.addTo(map)
  polygonLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  polygonLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

export default {
  base
}
