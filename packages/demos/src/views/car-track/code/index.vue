<template>
  <div class="car-track-demo">
    <Playground :files="files" main-file="index.vue" :import-map="importMap" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { baseFiles, baseImportMap } from '@/config/base'
import Playground from '@/components/playground/index.vue'
import data from '@/data/demo-data/trackData.ts?raw'
import templates from './templates'
import { useRoute } from 'vue-router'
type TType = 'base'
const route = useRoute()
const files = ref({
  'index.vue': {
    code: templates[route.params.id as TType]
  },
  'data.ts': {
    code: data
  },
  ...baseFiles
})

const importMap = ref({
  ...baseImportMap
})
</script>

<style lang="scss" scoped>
.car-track-demo {
  width: 100%;
  height: 100%;
}
</style>
