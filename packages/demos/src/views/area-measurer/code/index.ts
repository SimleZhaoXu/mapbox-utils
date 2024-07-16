import demo1 from './templates/demo1'
const templateMap: Record<string, string> = {
  demo1
}

export function getTemplate(type: string) {
  return `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { AreaMeasurer } from 'mapbox-utils'
${templateMap[type] || ''}
onBeforeUnmount(() => {
  areaMeasurer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`
}
