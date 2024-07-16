<template>
  <div class="line-gui">
    <map-view @load="handleMapLoad" />
    <div ref="container" class="gui-container"></div>
  </div>
</template>
<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import { ElMessage } from 'element-plus'
import MapView from '@/components/map-view/index.vue'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import lineData from '@/data/demo-data/lineData.json'
import { getLineGeoJson, getLineData } from '@/utils/data'
import { LineLayer } from 'mapbox-utils'
import dat from 'dat.gui'
import { options, getOptions } from './index'
import { LineGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})
onBeforeUnmount(() => {
  baseGUI.destroy()
  lineLayer?.remove()
})
let data = lineData.features.map((item) => item.properties)
let map: mapboxgl.Map

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  updateLayer()
}
let lineLayer: LineLayer
const updateLayer = () => {
  if (!map) {
    ElMessage.warning('请等待地图加载完成')
    return
  }
  lineLayer?.remove()
  lineLayer = new LineLayer({
    key: 'id',
    data: lineData,
    ...getOptions()
  })
  lineLayer.addTo(map)
}

const handleOptionsChange = () => {
  localStorage.setItem('LineLayerOptions', JSON.stringify(options))
  updateLayer()
}

// Control
const container = ref<HTMLElement>()
const baseGUI = new dat.GUI({
  name: 'line',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})
// Options
addOptionsGUI(baseGUI, options, GUIConfig, handleOptionsChange)
let index = -1

const getPoint = () => {
  index++
  if (index >= data.length) {
    index = 0
  }
  return data[index].id
}

const api = {
  addTo: () => {
    lineLayer.addTo(map)
  },
  remove: () => {
    lineLayer?.remove()
  },
  setData: () => {
    data = getLineData(200)
    lineLayer?.setData(getLineGeoJson(data))
  },
  setHighlight: () => {
    lineLayer.setHighlight(getPoint())
  },
  easeTo_highlight: () => {
    const val = getPoint()
    lineLayer?.setHighlight(val).easeTo(val)
  },
  flyTo_highlight: () => {
    const val = getPoint()
    lineLayer?.setHighlight(val).flyTo(val)
  },
  fitTo_highlight: () => {
    const val = getPoint()
    lineLayer?.setHighlight(val).fitTo(val)
  },
  removeHighlight: () => {
    lineLayer?.removeHighlight()
  },
  easeTo: () => {
    lineLayer?.easeTo(getPoint())
  },
  flyTo: () => {
    lineLayer?.flyTo(getPoint())
  },
  fitTo: () => {
    lineLayer?.fitTo(getPoint())
  },
  fitBounds: () => {
    lineLayer?.fitBounds()
  }
}

// API
const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'setData').name('切换数据----setData(data)')
apiGUI.add(api, 'easeTo').name('平移定位到某个线----easeTo(valOfKey)')
apiGUI.add(api, 'flyTo').name('飞行定位到某个线----flyTo(valOfKey)')
apiGUI.add(api, 'fitTo').name('视口定位到某个线----fitTo(valOfKey)')
apiGUI.add(api, 'setHighlight').name('将某个线段高亮-------setHighlight(valOfKey)')
apiGUI.add(api, 'removeHighlight').name('移除高亮效果-------removeHighlight()')
apiGUI.add(api, 'fitBounds').name('线段适应视口-------fitBounds(options)')
const highlight_locateGUI = apiGUI.addFolder('高亮和定位的组合')
highlight_locateGUI.open()
highlight_locateGUI.add(api, 'easeTo_highlight').name('平移+高亮')
highlight_locateGUI.add(api, 'flyTo_highlight').name('飞行+高亮')
highlight_locateGUI.add(api, 'fitTo_highlight').name('视口定位+高亮')
</script>

<style lang="scss" scoped>
.line-gui {
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
