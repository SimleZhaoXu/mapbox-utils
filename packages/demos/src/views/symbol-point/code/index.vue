<template>
  <div class="circle-point-demo">
    <Playground :files="files" main-file="index.vue" :import-map="importMap" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { baseFiles, baseImportMap } from '@/config/base'
import Playground from '@/components/playground/index.vue'
import data from '@/data/demo-data/pointData.json?raw'
import templates, { pulsingDotTpl } from './templates'
import { useRoute } from 'vue-router'
type TType = 'base'
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

if (route.params.id === 'pulsing-dot') {
  files.value = {
    ...files.value,
    'PulsingDot.ts': {
      code: pulsingDotTpl
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
