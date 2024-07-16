<template>
  <div class="prismoid-gui">
    <map-view @load="handleMapLoad" />
    <div ref="container" class="gui-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapView from '@/components/map-view/index.vue'
import dat from 'dat.gui'
import { options, getOptions } from './index'
import { getPointGeoJson, getPointData } from '@/utils/data'
import { PrismoidGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
import { PrismoidLayer } from 'mapbox-utils'
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})

let data = getPointData(100)

let map: mapboxgl.Map
let pointLayer: PrismoidLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  showPointLayer()
}

const showPointLayer = () => {
  if (!map) {
    console.log('请等待地图加载！')
    return
  }
  console.log(getOptions())
  pointLayer?.remove()
  pointLayer = new PrismoidLayer({
    key: 'id',
    data: getPointGeoJson(data),
    ...getOptions()
  })
  pointLayer.addTo(map)
}

onBeforeUnmount(() => {
  baseGUI.destroy()
  pointLayer?.remove()
  map.remove()
  map = undefined!
  pointLayer = undefined!
})

const handleOptionsChange = () => {
  localStorage.setItem('PrismoidLayerOptions', JSON.stringify(options))
  showPointLayer()
}

const baseGUI = new dat.GUI({
  name: 'prismoid',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})

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
    pointLayer.addTo(map)
  },
  remove: () => {
    pointLayer?.remove()
  },
  setData: () => {
    data = getPointData(200)
    pointLayer?.setData(getPointGeoJson(data))
  },
  setHighlight: () => {
    pointLayer.setHighlight(getPoint())
  },
  easeTo_highlight: () => {
    const val = getPoint()
    pointLayer?.setHighlight(val).easeTo(val)
  },
  flyTo_highlight: () => {
    const val = getPoint()
    pointLayer?.setHighlight(val).flyTo(val)
  },
  removeHighlight: () => {
    pointLayer?.removeHighlight()
  },
  easeTo: () => {
    pointLayer?.easeTo(getPoint())
  },
  flyTo: () => {
    pointLayer?.flyTo(getPoint())
  },
  fitBounds: () => {
    pointLayer?.fitBounds()
  }
}

// API
const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'setData').name('切换数据----setData(data)')
apiGUI.add(api, 'easeTo').name('平移定位到某个柱体----easeTo(valOfKey)')
apiGUI.add(api, 'flyTo').name('飞行定位到某个柱体----flyTo(valOfKey)')
apiGUI.add(api, 'setHighlight').name('将某个柱体高亮-------setHighlight(valOfKey)')
apiGUI.add(api, 'removeHighlight').name('移除高亮效果-------removeHighlight()')
apiGUI.add(api, 'fitBounds').name('适应视口-------fitBounds(options)')
const highlight_locateGUI = apiGUI.addFolder('高亮和定位的组合')
highlight_locateGUI.open()
highlight_locateGUI.add(api, 'easeTo_highlight').name('平移+高亮')
highlight_locateGUI.add(api, 'flyTo_highlight').name('飞行+高亮')
</script>

<style lang="scss" scoped>
.prismoid-gui {
  width: 100%;
  height: 100%;
  position: relative;
  .gui-container {
    position: absolute;
    right: 0;
    top: 20px;
    bottom: 20px;
    overflow: auto;
    color: rgb(16, 146, 153);
  }
}
</style>
