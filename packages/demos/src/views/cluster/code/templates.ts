const symbol = `
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
import { SymbolClusterLayer } from 'mapbox-utils'
import data from './data.json'

const iconList = [
  {
    name: 'alarm-01',
    path: './map-icon/alarm-01.png',
    pixelRatio: 2
  },
  {
    name: 'alarm-01-active',
    path: './map-icon/alarm-01-active.png',
    pixelRatio: 2
  },
  {
    name: 'cluster',
    path: './map-icon/cluster.png',
    pixelRatio: 2
  }
]

let map: mapboxgl.Map
let pointLayer: SymbolClusterLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new SymbolClusterLayer({
    key: 'id',
    data,
    clusterRadius: 50,
    style: {
      'icon-image': 'alarm-01',
      'icon-size': 1,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    },
    clusterStyle: {
      'icon-image': 'cluster',
      'icon-size': 1,
      'icon-anchor': 'bottom',
      'text-field': ['get', 'point_count'],
      'text-font': ['Noto Sans Regular'],
      'text-offset': [0, -2.7],
      'text-anchor': 'center',
      'text-size': 16,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-color': '#fff'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'icon-image': 'alarm-01-active',
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

const circle = `
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
import { CircleClusterLayer } from 'mapbox-utils'
import data from './data.json'

let map: mapboxgl.Map
let pointLayer: CircleClusterLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new CircleClusterLayer({
    key: 'id',
    data,
    clusterRadius: 50,
    style: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    },
    clusterStyle: {
      'text-field': ['get', 'point_count'],
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'center',
      'text-size': 16,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-color': '#000',
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        10,
        '#f1f075',
        30,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        30,
        40
      ]
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': 'rgb(10, 155, 82)',
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
  symbol,
  circle
}
