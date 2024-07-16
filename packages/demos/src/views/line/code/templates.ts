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
import { LineLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let lineLayer: LineLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  lineLayer = new LineLayer({
    key: 'id',
    data,
    style: {
      'line-width': 4,
      'line-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'line-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  lineLayer.addTo(map)
  lineLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  lineLayer?.remove()
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
