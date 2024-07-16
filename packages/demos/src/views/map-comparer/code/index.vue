<template>
  <div class="circle-point-demo">
    <Playground :files="files" main-file="index.vue" :import-map="importMap" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { baseFiles, baseImportMap } from '@/config/base'
import Playground from '@/components/playground/index.vue'
import templates from './templates'
import data from '@/data/demo-data/heatmapData.json?raw'
import { useRoute } from 'vue-router'
type TType = 'base'
// @ts-ignore
delete baseFiles['map-view.vue']
const route = useRoute()
const files = ref({
  'index.vue': {
    code: templates[route.params.id as TType]
  },
  'data.json': {
    code: data
  },
  ...baseFiles
})

const importMap = ref({
  ...baseImportMap
})
</script>

<style lang="scss" scoped>
.circle-point-demo {
  width: 100%;
  height: 100%;
}
</style>
