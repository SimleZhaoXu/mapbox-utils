<template>
  <div class="point-picker-gui">
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
import { PointPickerGUIConfig as GUIConfig, addOptionsGUI } from '@/config/gui-config/index'
import { PointPicker } from 'mapbox-utils'
import * as turf from '@turf/turf'
import borderData from '@/data/sn_border.json'
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.appendChild(baseGUI.domElement)
  baseGUI.domElement.classList.add('custom-gui')
})

let map: mapboxgl.Map
let pointPicker: PointPicker
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  showPointLayer()
}

const showPointLayer = () => {
  if (!map) {
    ElMessage.warning('请等待地图加载！')
    return
  }

  pointPicker?.remove()
  pointPicker = new PointPicker({
    ...getOptions()
  })
  pointPicker.addTo(map)
  pointPicker.on('click-point', (e) => {
    ElMessage.success(`点位被点击, ${e.point}`)
  })
  pointPicker.on('get-point', (e) => {
    ElMessage.success(`获取点位, 当前获取点位${e.point}`)
  })

  pointPicker.on('remove-point', (e) => {
    ElMessage.success(`删除点位, 当前删除点位${e.point}`)
  })
}

onBeforeUnmount(() => {
  baseGUI.destroy()
  pointPicker?.remove()
  map.remove()
  map = undefined!
  pointPicker = undefined!
})

const handleOptionsChange = () => {
  localStorage.setItem('PointPickerOptions', JSON.stringify(options))
  showPointLayer()
}

const baseGUI = new dat.GUI({
  name: 'point-picker',
  autoPlace: false,
  width: 400,
  closeOnTop: true
})

addOptionsGUI(baseGUI, options, GUIConfig, handleOptionsChange)

const api = {
  addTo: () => {
    pointPicker.addTo(map)
  },
  remove: () => {
    pointPicker?.remove()
  },
  removePoints: () => {
    pointPicker.removePoints()
  },
  getPoints: () => {
    console.log(pointPicker.getPoints())
  },
  setPoint: () => {
    const points = turf.randomPoint(1, { bbox: turf.bbox(borderData) })
    pointPicker.setPoint(turf.coordAll(points)[0] as [number, number])
  }
}

// API
const apiGUI = baseGUI.addFolder('API')
apiGUI.open()
apiGUI.add(api, 'addTo').name('添加到地图---addTo(map)')
apiGUI.add(api, 'remove').name('从地图上移除---remove()')
apiGUI.add(api, 'removePoints').name('清除已获取点位---clear()')
apiGUI.add(api, 'getPoints').name('获取已获取点位---getLine()')
apiGUI.add(api, 'setPoint').name('设置点位---setPoint(point)')
</script>

<style lang="scss" scoped>
.point-picker-gui {
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
