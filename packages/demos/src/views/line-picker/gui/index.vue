<template>
  <div class="line-picker-gui">
    <map-view @load="handleMapLoad" />
    <div ref="container" class="gui-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import { ElMessage } from 'element-plus'
import MapView from '@/components/map-view/index.vue'
import dat from 'dat.gui'
import { options, getOptions } from './index'
import { LinePickerGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
import { LinePicker } from 'mapbox-utils'
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})

let map: mapboxgl.Map
let linePicker: LinePicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  showPointLayer()
}

const showPointLayer = () => {
  if (!map) {
    ElMessage.warning('请等待地图加载完成')
    return
  }

  linePicker?.remove()
  linePicker = new LinePicker({
    ...getOptions()
  })
  linePicker.addTo(map)
  linePicker.on('finish', (e) => {
    ElMessage.success(`绘制完成, 长度：${e.length}米`)
  })
}

onBeforeUnmount(() => {
  baseGUI.destroy()
  linePicker?.remove()
  map.remove()
  map = undefined!
  linePicker = undefined!
})

const handleOptionsChange = () => {
  localStorage.setItem('LinePickerOptions', JSON.stringify(options))
  showPointLayer()
}

const baseGUI = new dat.GUI({
  name: 'line-picker',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})

addOptionsGUI(baseGUI, options, GUIConfig, handleOptionsChange)

const api = {
  addTo: () => {
    linePicker.addTo(map)
  },
  remove: () => {
    linePicker?.remove()
  },
  clear: () => {
    linePicker.clear()
  },
  getData: () => {
    console.log(linePicker.getData())
  }
}

// API
const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'clear').name('清除已绘制线段---clear()')
apiGUI.add(api, 'getData').name('获取已绘制线段---getData()')
</script>

<style lang="scss" scoped>
.line-picker-gui {
  width: 100%;
  height: 100%;
  position: relative;
  .gui-container {
    position: absolute;
    right: 0;
    top: 20px;
    bottom: 20px;
    overflow: auto;
  }
}
</style>
