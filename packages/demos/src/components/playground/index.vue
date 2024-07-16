<template>
  <Repl :store="store" :show-compile-output="false" :show-import-map="true" :clear-console="true" />
</template>

<script lang="ts" setup>
import { Repl, ReplStore } from '@/components/repl'
const props = defineProps<{
  files: Record<string, { code: string; hidden?: boolean }>
  mainFile: string
  importMap: Record<string, string>
}>()

const store = new ReplStore()
store.setFiles(props.files, props.mainFile)
setTimeout(() => {
  store.setImportMap({
    imports: { ...props.importMap }
  })
}, 0)
</script>
