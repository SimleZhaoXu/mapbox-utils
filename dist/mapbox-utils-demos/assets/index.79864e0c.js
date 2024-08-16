import{b as o,_ as a,a as p}from"./index.ff7ff852.js";import{_ as i,d as s,r as n,c as m,h as d,k as c,o as l}from"./index.3f3ae0c4.js";var y=`{\r
    "type": "FeatureCollection",\r
    "features": [\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 1,\r
                "type": "1"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.6451404485927,\r
                    30.925913543600927\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 2,\r
                "type": "3"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.23495236597583,\r
                    30.582854783191383\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 3,\r
                "type": "4"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.29669945922595,\r
                    30.759401419767872\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 4,\r
                "type": "3"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.51690512065252,\r
                    30.9106015176345\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 5,\r
                "type": "1"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.24080022818265,\r
                    30.71746194342716\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 6,\r
                "type": "4"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.46215964322796,\r
                    30.413827553805714\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 7,\r
                "type": "2"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.46981670515007,\r
                    30.604965947152266\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 8,\r
                "type": "3"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.68608463156228,\r
                    30.523132085840704\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 9,\r
                "type": "1"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.6451832451894,\r
                    30.847297903139847\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 10,\r
                "type": "1"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.55666226654726,\r
                    30.232219816235936\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 11,\r
                "type": "1"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.3848324566319,\r
                    30.810866384856805\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 12,\r
                "type": "2"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.92027029089282,\r
                    30.438195926396094\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 13,\r
                "type": "3"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.74462426084187,\r
                    30.58983629020074\r
                ]\r
            }\r
        },\r
        {\r
            "type": "Feature",\r
            "properties": {\r
                "id": 14,\r
                "type": "4"\r
            },\r
            "geometry": {\r
                "type": "Point",\r
                "coordinates": [\r
                    105.62891841869566,\r
                    30.309801096423488\r
                ]\r
            }\r
        }\r
    ]\r
}`;const u=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import type mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { MarkerPointLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: MarkerPointLayer

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      color: '#f00'
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
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`,f=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { MarkerPointLayer } from 'mapbox-utils'
import data from './data.json'
let map: mapboxgl.Map
let pointLayer: MarkerPointLayer

const markerNode = document.createElement('img')
markerNode.style.width = '54px'
markerNode.style.height = '54px'
markerNode.src = './map-icon/icon-point.png'

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      element: markerNode
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
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`,g=`
<template>
  <div class="page">
    <map-view @load="handleMapLoad" />
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount, createApp } from 'vue'
import { MarkerPointLayer } from 'mapbox-utils'
import data from './data.json'
import CustomMarker from './custom-marker.vue'
let map: mapboxgl.Map
let pointLayer: MarkerPointLayer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      element: (data: any) => {
        return createApp(CustomMarker, { data }).mount(document.createElement('div')).$el
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
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
`,v=`
<template>
  <div>
    <div class="custom-marker" :class="\`marker-\${data.type}\`">
      <span> \u6D4B\u8BD5{{ data.id }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
<\/script>

<style scoped>
.custom-marker {
  --color: #ff22bb;
  font-family: 'Poppins', sans-serif;
  padding: 0 20px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background: #000000;
  cursor: pointer;
  position: relative;
  transition: 1s;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
}

.custom-marker span {
  position: relative;
  z-index: 1;
}

.custom-marker.marker-1 {
  --color: #b0a4e3;
}
.custom-marker.marker-2 {
  --color: #9ed900;
}
.custom-marker.marker-3 {
  --color: #ff8c31;
}
.custom-marker.marker-4 {
  --color: #ff4c00;
}

.custom-marker:hover {
  background: var(--color);
  box-shadow: 0 0 10px var(--color), 0 0 30px var(--color),
    0 0 60px var(--color), 0 0 100px var(--color);
}
.custom-marker:hover::before {
  width: 150%;
}
.custom-marker:hover::after {
  background: var(--color);
}
.custom-marker:before {
  content: '';
  position: absolute;
  width: 20px;
  height: 400%;
  background: var(--color);
  animation: animate 2s linear infinite;
}
.custom-marker:after {
  content: '';
  inset: 2px;
  position: absolute;
  background: #0e1538;
  transition: all 0.5s;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
`;var k={base:u,custom1:f,custom2:g};const x={class:"circle-point-demo"},b=s({__name:"index",setup(h){const e=c(),r=n({"index.vue":{code:k[e.params.id]},"data.json":{code:y},...o});e.params.id==="custom2"&&(r.value={...r.value,"custom-marker.vue":{code:v}});const t=n({...p});return(L,M)=>(l(),m("div",x,[d(a,{files:r.value,"main-file":"index.vue","import-map":t.value},null,8,["files","import-map"])]))}});var w=i(b,[["__scopeId","data-v-e6c81b42"]]);export{w as default};
