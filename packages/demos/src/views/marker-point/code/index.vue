<template>
  <div class="circle-point-demo">
    <Playground :files="files" main-file="index.vue" :import-map="importMap" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { baseFiles, baseImportMap } from '@/config/base'
import Playground from '@/components/playground/index.vue'
import data from '@/data/demo-data/markerPointData.json?raw'
import templates, { customMakerTpl } from './templates'
import { useRoute } from 'vue-router'
type TType = 'base' | 'custom1' | 'custom2'
const route = useRoute()
const files = ref<any>({
  'index.vue': {
    code: templates[route.params.id as TType]
  },
  'data.json': {
    code: data
  },
  ...baseFiles
})

if (route.params.id === 'custom2') {
  files.value = {
    ...files.value,
    'custom-marker.vue': {
      code: customMakerTpl
    }
  }
}

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
