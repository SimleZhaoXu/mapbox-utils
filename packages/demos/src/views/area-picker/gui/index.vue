<template>
  <div class="area-picker-gui">
    <map-view @load="handleMapLoad" />
    <div ref="container" class="gui-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapView from '@/components/map-view/index.vue'
import dat from 'dat.gui'
import { ElMessage } from 'element-plus'
import getOptionsFromType from './index'
import {
  PolygonAreaPickerGUIConfig,
  CircleAreaPickerGUIConfig,
  RectAreaPickerGUIConfig,
  addOptionsGUI
} from '@/config/gui-config/index'
import { PolygonAreaPicker, CircleAreaPicker, RectAreaPicker } from 'mapbox-utils'
import { useRoute } from 'vue-router'
const route = useRoute()
type AreaPickerType = 'polygon' | 'circle' | 'rect'
const { options, getOptions } = getOptionsFromType(route.params.id as AreaPickerType)
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})
let AreaPickerConstructor: any
let GUIConfig: any[]
let storageName = ''
switch (route.params.id) {
  case 'polygon':
    AreaPickerConstructor = PolygonAreaPicker
    GUIConfig = PolygonAreaPickerGUIConfig
    storageName = 'PolygonAreaPickerOptions'
    break
  case 'circle':
    AreaPickerConstructor = CircleAreaPicker
    GUIConfig = CircleAreaPickerGUIConfig
    storageName = 'CircleAreaPickerOptions'
    break
  case 'rect':
    AreaPickerConstructor = RectAreaPicker
    GUIConfig = RectAreaPickerGUIConfig
    storageName = 'RectAreaPickerOptions'
    break
}

let map: mapboxgl.Map
let areaPicker: PolygonAreaPicker | CircleAreaPicker | RectAreaPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  updateAreaPicker()
}

const updateAreaPicker = () => {
  if (!map) {
    ElMessage.warning('请等待地图加载完成')
    return
  }

  areaPicker?.remove()
  areaPicker = new AreaPickerConstructor({
    ...getOptions()
  })
  areaPicker.addTo(map)
  areaPicker.on('finish', (e) => {
    ElMessage.success(`绘制完成, 面积：${e.acreage}平方米`)
  })
}

onBeforeUnmount(() => {
  baseGUI.destroy()
  areaPicker?.remove()
  map.remove()
  map = undefined!
  areaPicker = undefined!
})

const handleOptionsChange = () => {
  localStorage.setItem(storageName, JSON.stringify(options))
  updateAreaPicker()
}

const baseGUI = new dat.GUI({
  name: 'area-picker',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})

addOptionsGUI(baseGUI, options, GUIConfig!, handleOptionsChange)

const api = {
  addTo: () => {
    areaPicker.addTo(map)
  },
  remove: () => {
    areaPicker?.remove()
  },
  clear: () => {
    areaPicker.clear()
  },
  getData: () => {
    console.log(areaPicker.getData())
  }
}

// API
const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'clear').name('清除已绘制区域---clear()')
apiGUI.add(api, 'getData').name('获取已绘制区域---getData()')
</script>

<style lang="scss" scoped>
.area-picker-gui {
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
