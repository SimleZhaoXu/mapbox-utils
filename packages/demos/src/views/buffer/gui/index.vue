<template>
  <div class="buffer-gui">
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
import { BufferGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
import { BufferLayer } from 'mapbox-utils'
import * as turf from '@turf/turf'
import borderData from '@/data/sn_border.json'
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})

let map: mapboxgl.Map
let bufferLayer: BufferLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  update()
}

const update = () => {
  if (!map) {
    ElMessage.warning('请等待地图加载完成')
    return
  }

  bufferLayer?.remove()
  bufferLayer = new BufferLayer({
    ...getOptions()
  })
  bufferLayer.on('change', (e) => {
    console.log(`
    中心：${e.center}, 
    半径：${e.radius}, 
    半径单位：${e.units}, 
    缓冲区：${JSON.stringify(e.buffer)}`)
  })
  bufferLayer.addTo(map)
}

onBeforeUnmount(() => {
  baseGUI.destroy()
  bufferLayer?.remove()
  map.remove()
  map = undefined!
  bufferLayer = undefined!
})

const handleOptionsChange = () => {
  localStorage.setItem('BufferLayerOptions', JSON.stringify(options))
  update()
}

const baseGUI = new dat.GUI({
  name: 'buffer',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})

addOptionsGUI(baseGUI, options, GUIConfig, handleOptionsChange)

const api = {
  steps: 64,
  radius: 5,
  units: 'kilometers',
  addTo: () => {
    bufferLayer?.addTo(map)
  },
  remove: () => {
    bufferLayer?.remove()
  },
  clear: () => {
    bufferLayer?.clear()
  },
  setCenter: () => {
    const points = turf.randomPoint(1, { bbox: turf.bbox(borderData) })
    bufferLayer?.setOptions({
      center: points.features[0].geometry.coordinates
    })
  },
  getData: () => {
    console.log(bufferLayer.getData())
  }
}

const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图----addTo(map)')
apiGUI.add(api, 'remove').name('从地图移除---remove()')
apiGUI.add(api, 'clear').name('清除缓冲区----clear()')
apiGUI.add(api, 'getData').name('获取缓冲区----getData()')
apiGUI.add(api, 'setCenter').name('参数修改（中心）----setOptions({center})')
apiGUI
  .add(api, 'radius', 1, 99, 1)
  .name('参数修改（半径）')
  .onFinishChange((radius: number) => {
    bufferLayer?.setOptions({
      radius
    })
  })
apiGUI
  .add(api, 'units', ['meters', 'kilometers'])
  .name('参数修改（单位）')
  .onFinishChange((units: 'meters' | 'kilometers') => {
    bufferLayer?.setOptions({
      units
    })
  })
apiGUI
  .add(api, 'steps', 3, 512, 1)
  .name('参数修改（边数）')
  .onFinishChange((steps: number) => {
    bufferLayer?.setOptions({
      steps
    })
  })
</script>

<style lang="scss" scoped>
.buffer-gui {
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
