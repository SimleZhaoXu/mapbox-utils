<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import CodeMirror from '../codemirror/CodeMirror.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { computed, inject } from 'vue'
import { Store } from '../store'

const store = inject('store') as Store

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)

const activeMode = computed(() => {
  const { filename } = store.state.activeFile

  if (filename.endsWith('.vue') || filename.endsWith('.html')) {
    return 'htmlmixed'
  } else if (filename.endsWith('.css')) {
    return 'css'
  } else if (filename.endsWith('.json')) {
    return 'application/json'
  }
  return 'javascript'
})
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <CodeMirror :value="store.state.activeFile.code" :mode="activeMode" @change="onChange" />
    <Message :err="store.state.errors[0]" />
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
