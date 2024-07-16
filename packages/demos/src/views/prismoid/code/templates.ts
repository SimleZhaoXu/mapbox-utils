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
import { PrismoidLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: PrismoidLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  map.setPitch(60)
  pointLayer = new PrismoidLayer({
    key: 'id',
    data,
    radius: 500,
    steps: 64,
    style: {
      'fill-extrusion-color': 'rgb(16, 146, 153)',
      'fill-extrusion-height': ['*', ['get', 'id'], 100],
      'fill-extrusion-base': 0
    },
    highlightOptions: {
      trigger: 'hover',
      style: {
        'fill-extrusion-color': '#ffff00'
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
  map.setPitch(45)
}
onBeforeUnmount(() => {
  pointLayer?.remove()
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
