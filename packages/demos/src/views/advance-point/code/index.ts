import demo1 from './templates/demo1'
import demo2 from './templates/demo2'
import demo3 from './templates/demo3'
import demo4 from './templates/demo4'
import demo5 from './templates/demo5'
import demo6 from './templates/demo6'
const templateMap: Record<string, string> = {
  demo1,
  demo2,
  demo3,
  demo4,
  demo5,
  demo6
}
const hasIconDemos = ['demo2', 'demo3', 'demo5', 'demo6']

export function getTemplate(type: string) {
  return `
<template>
  <div class="page">
    <map-view${hasIconDemos.includes(type) ? ' :icon-list="iconList"' : ''} @load="handleMapLoad" />
  </div>
</template>
<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { AdvancePointLayer } from 'mapbox-utils'
import data from './data.json'
${templateMap[type] || ''}
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
}
