const base = `
<template>
  <div class="page">
    <map-view :icon-list="iconList" @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { SymbolPointLayer } from 'mapbox-utils'
import data from './data.json'

const iconList = [
  {
    name: 'alarm-01',
    path: './map-icon/alarm-01.png',
    pixelRatio: 1
  },
  {
    name: 'alarm-01-active',
    path: './map-icon/alarm-01-active.png',
    pixelRatio: 1
  }
]
let map: mapboxgl.Map
let pointLayer: SymbolPointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new SymbolPointLayer({
    key: 'id',
    data,
    style: {
      'icon-image': 'alarm-01',
      'icon-size': 0.7,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'icon-image': 'alarm-01-active'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

const pulsingDot = `
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { SymbolPointLayer } from 'mapbox-utils'
import data from './data.json'
import PulsingDot from './PulsingDot.ts'
let map: mapboxgl.Map
let pointLayer: SymbolPointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  map.addImage('pulsing-dot1', new PulsingDot(80, { a: 120, g: 120, b: 120 }), { pixelRatio: 1 });
  map.addImage('pulsing-dot2', new PulsingDot(80, { a: 255, g: 255, b: 0 }), { pixelRatio: 1 });
  pointLayer = new SymbolPointLayer({
    key: 'id',
    data,
    style: {
      'icon-image': 'pulsing-dot1',
      'icon-size': 1,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'icon-image': 'pulsing-dot2'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`

export const pulsingDotTpl = `
import type mapboxgl from 'mapbox-gl'
export default class PulsingDot {
  map: mapboxgl.Map | null
  width: number
  height: number
  size: number
  data: Uint8ClampedArray
  r: number
  g: number
  b: number
  context: CanvasRenderingContext2D | null
  constructor(size = 100, { r = 255, g = 0, b = 0 } = {}) {
    this.width = size
    this.height = size
    this.size = size
    this.data = new Uint8ClampedArray(size * size * 4)
    this.context = null
    this.map = null
    this.r = r
    this.g = g
    this.b = b
  }

  onAdd(map: mapboxgl.Map) {
    this.map = map
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.context = canvas.getContext('2d')
  }

  onRemove() {
    this.map = null
  }

  render() {
    const duration = 1000
    const t = (performance.now() % duration) / duration

    const radius = (this.size / 2) * 0.3
    const outerRadius = (this.size / 2) * 0.7 * t + radius
    const context = this.context!

    context.clearRect(0, 0, this.width, this.height)
    context.beginPath()
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
    context.fillStyle = \`rgba(\${this.r}, \${this.g}, \${this.b}, \${1 - t})\`
    context.fill()

    context.beginPath()
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
    context.fillStyle = \`rgba(\${this.r}, \${this.g}, \${this.b}, 1)\`
    context.strokeStyle = 'white'
    context.lineWidth = 2 + 4 * (1 - t)
    context.fill()
    context.stroke()

    // 从canvas中获取图片
    this.data = context.getImageData(0, 0, this.width, this.height).data
    this.map?.triggerRepaint()
    return true
  }
}
`

const sdf = `
<template>
  <div class="page">
    <map-view :icon-list="iconList" @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { SymbolPointLayer } from 'mapbox-utils'
import data from './data.json'

const iconList = [
  {
    name: 'icon-bell',
    path: './map-icon/icon-bell.png',
    pixelRatio: 10,
    sdf: true
  }
]
let map: mapboxgl.Map
let pointLayer: SymbolPointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new SymbolPointLayer({
    key: 'id',
    data,
    style: {
      'icon-image': 'icon-bell',
      'icon-size': 1,
      'icon-color': '#f00',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'icon-color': '#0f0',
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({ center: e.lngLat })
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`
export default {
  base,
  'pulsing-dot': pulsingDot,
  'sdf-icon': sdf
}
