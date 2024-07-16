<template>
  <div class="line-gui">
    <map-view @load="handleMapLoad" />
    <div ref="container" class="gui-container"></div>
  </div>
</template>
<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import MapView from '@/components/map-view/index.vue'
import { ElMessage } from 'element-plus'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import polygonData from '@/data/demo-data/polygonData.json'
import { getAreaData, getPolygonGeoJson } from '@/utils/data'
import { PolygonLayer } from 'mapbox-utils'
import dat from 'dat.gui'
import { options, getOptions } from './index'
import { PolygonGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})
onBeforeUnmount(() => {
  baseGUI.destroy()
  polygonLayer?.remove()
})
let data = polygonData.features.map((item) => item.properties)
let map: mapboxgl.Map

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  updateLayer()
}
let polygonLayer: PolygonLayer
const updateLayer = () => {
  if (!map) {
    ElMessage.warning('请等待地图加载！')
    return
  }
  polygonLayer?.remove()
  polygonLayer = new PolygonLayer({
    key: 'name',
    data: polygonData,
    ...getOptions()
  })
  polygonLayer.addTo(map)
}

const handleOptionsChange = () => {
  localStorage.setItem('PolygonLayerOptions', JSON.stringify(options))
  updateLayer()
}

// Control
const container = ref<HTMLElement>()
const baseGUI = new dat.GUI({
  name: 'polygon',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})

console.log(options)

// Options
addOptionsGUI(baseGUI, options, GUIConfig, handleOptionsChange)

let index = -1

const getPoint = () => {
  index++
  if (index >= data.length) {
    index = 0
  }
  return data[index].name
}

const api = {
  addTo: () => {
    polygonLayer.addTo(map)
  },
  remove: () => {
    polygonLayer?.remove()
  },
  setData: () => {
    data = getAreaData(200)
    polygonLayer?.setData(getPolygonGeoJson(data))
  },
  setHighlight: () => {
    polygonLayer.setHighlight(getPoint())
  },
  easeTo_highlight: () => {
    const val = getPoint()
    polygonLayer?.setHighlight(val).easeTo(val)
  },
  flyTo_highlight: () => {
    const val = getPoint()
    polygonLayer?.setHighlight(val).flyTo(val)
  },
  fitTo_highlight: () => {
    const val = getPoint()
    polygonLayer?.setHighlight(val).fitTo(val)
  },
  removeHighlight: () => {
    polygonLayer?.removeHighlight()
  },
  easeTo: () => {
    polygonLayer?.easeTo(getPoint())
  },
  flyTo: () => {
    polygonLayer?.flyTo(getPoint())
  },
  fitTo: () => {
    polygonLayer?.fitTo(getPoint())
  },
  fitBounds: () => {
    polygonLayer?.fitBounds()
  }
}

// API
const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'setData').name('切换数据----setData(data)')
apiGUI.add(api, 'easeTo').name('平移定位到某个区域----easeTo(valOfKey)')
apiGUI.add(api, 'flyTo').name('飞行定位到某个区域----flyTo(valOfKey)')
apiGUI.add(api, 'fitTo').name('视口定位到某个区域----fitTo(valOfKey)')
apiGUI.add(api, 'setHighlight').name('将某个多边形高亮-------setHighlight(valOfKey)')
apiGUI.add(api, 'removeHighlight').name('移除高亮效果-------removeHighlight()')
apiGUI.add(api, 'fitBounds').name('多边形适应视口-------fitBounds(options)')
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
