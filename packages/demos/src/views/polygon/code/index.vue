<template>
  <div class="polygon-demo">
    <Playground :files="files" main-file="index.vue" :import-map="importMap" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { baseFiles, baseImportMap } from '@/config/base'
import Playground from '@/components/playground/index.vue'
import data from '@/data/demo-data/polygonData.json?raw'
import templates from './templates'
import { useRoute } from 'vue-router'
type TType = 'base'
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
.polygon-demo {
  width: 100%;
  height: 100%;
}
</style>
