<template>
  <div class="advance-line-demo">
    <Playground :files="files" main-file="index.vue" :import-map="importMap" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { baseFiles, baseImportMap } from '@/config/base'
import Playground from '@/components/playground/index.vue'
import data from '@/data/demo-data/lineData.json?raw'
import { getTemplate } from './index'
import { useRoute } from 'vue-router'
const route = useRoute()
const files = ref<any>({
  'index.vue': {
    code: getTemplate(route.params.id as string)
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
.advance-line-demo {
  width: 100%;
  height: 100%;
}
</style>
