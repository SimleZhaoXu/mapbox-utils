import demo1 from './templates/demo1'
import demo2 from './templates/demo2'
import demo3 from './templates/demo3'
import demo4 from './templates/demo4'
const templateMap: Record<string, string> = {
  demo1,
  demo2,
  demo3,
  demo4
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
import { AdvanceBuffer } from 'mapbox-utils'
${templateMap[type] || ''}
onBeforeUnmount(() => {
  advanceBuffer?.remove()
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
