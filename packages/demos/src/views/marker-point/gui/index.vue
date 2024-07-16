<template>
  <div class="line-gui">
    <map-view @load="handleMapLoad" />
    <div ref="container" class="gui-container"></div>
  </div>
</template>
<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import MapView from '@/components/map-view/index.vue'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { getPointGeoJson, getPointData } from '@/utils/data'
import { MarkerPointLayer } from 'mapbox-utils'
import dat from 'dat.gui'
import { options, getOptions } from './index'
import { MarkerPointGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})
onBeforeUnmount(() => {
  baseGUI.destroy()
  pointLayer?.remove()
})

let data = getPointData(20)

let map: mapboxgl.Map

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  updateLayer()
}
let pointLayer: MarkerPointLayer
const updateLayer = () => {
  if (!map) {
    console.log('请等待地图加载完成')
    return
  }
  pointLayer?.remove()
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data: getPointGeoJson(data),
    ...getOptions()
  })
  pointLayer.addTo(map)
}

const handleOptionsChange = () => {
  localStorage.setItem('MarkerPointLayerOptions', JSON.stringify(options))
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
    pointLayer.addTo(map)
  },
  remove: () => {
    pointLayer?.remove()
  },
  setData: () => {
    data = getPointData(200)
    pointLayer?.setData(getPointGeoJson(data))
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

const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'setData').name('切换数据----setData(data)')
apiGUI.add(api, 'easeTo').name('平移定位到某个点----easeTo(valOfKey)')
apiGUI.add(api, 'flyTo').name('飞行定位到某个点----flyTo(valOfKey)')
apiGUI.add(api, 'fitBounds').name('点位适应视口-------fitBounds(options)')
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
