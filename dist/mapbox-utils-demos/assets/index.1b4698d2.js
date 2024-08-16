import{b as e,_ as o,a as i}from"./index.ff7ff852.js";import{_ as p,d as s,r,c,h as l,k as d,o as u}from"./index.3f3ae0c4.js";var m=`export default [\r
  [105.36491503179172, 31.160625434523695],\r
  [105.30058234257268, 31.10979571493877],\r
  [105.20655764294611, 31.102733877702093],\r
  [105.17521607640538, 31.04056707333757],\r
  [105.1933611938756, 30.97411675481743],\r
  [105.19830986227765, 30.8962969664656],\r
  [105.24449743402425, 30.838244664955766],\r
  [105.26594166376321, 30.75606189422399],\r
  [105.24449743402425, 30.7277067233572],\r
  [105.18346385707383, 30.72628874575507],\r
  [105.17356652026996, 30.68799546780862],\r
  [105.13892584146049, 30.66671485812695],\r
  [105.14552406599574, 30.641171938702442],\r
  [105.09933649424909, 30.600005266738393],\r
  [105.06799492770836, 30.537512074935165],\r
  [105.09108871358058, 30.435163719356197],\r
  [105.10593471878434, 30.37114137976853],\r
  [105.17191696413664, 30.3327078364147],\r
  [105.237899209489, 30.288561825539418],\r
  [105.31707790391181, 30.30850119595968],\r
  [105.37151325632698, 30.289986200741012],\r
  [105.41935038420684, 30.295683494706225],\r
  [105.4341963894106, 30.26719371591652],\r
  [105.46883706822001, 30.26149476765525],\r
  [105.48038396115726, 30.228719397723523],\r
  [105.50347774703164, 30.218742115682133],\r
  [105.52492197677054, 30.227294133687607],\r
  [105.56945999238172, 30.19165582054235],\r
  [105.59915200279141, 30.188804198003837],\r
  [105.62224578866363, 30.190230019593926],\r
  [105.64533957453807, 30.20876382158231],\r
  [105.61894667639712, 30.223018217637446],\r
  [105.61234845186186, 30.244395938533756],\r
  [105.6106988957286, 30.27146771003649],\r
  [105.64039090613608, 30.280015140015024],\r
  [105.67008291654355, 30.264344283131678],\r
  [105.69482625855119, 30.265769009860364],\r
  [105.7162704882902, 30.268618401297687],\r
  [105.69152714628467, 30.305652962724523],\r
  [105.71462093215683, 30.321317221252983],\r
  [105.72946693736066, 30.33697897555402],\r
  [105.74101383029785, 30.358331876109673],\r
  [105.7492616109663, 30.391063938868854],\r
  [105.77070584070526, 30.410982435993162],\r
  [105.79874829498169, 30.43800818217551],\r
  [105.82349163698717, 30.446541072774963],\r
  [105.84493586672829, 30.410982435993162],\r
  [105.88452521393754, 30.406714528640123],\r
  [105.924114561149, 30.403869153417304],\r
  [105.95380657155863, 30.381103166966525],\r
  [105.99339591876992, 30.37256455437847],\r
  [105.9851481380993, 30.410982435993162],\r
  [105.95050745928978, 30.43800818217551],\r
  [105.96700302062908, 30.46929179593816],\r
  [105.94885790315658, 30.511935078427953],\r
  [105.91751633661369, 30.511935078427953],\r
  [105.91586678048043, 30.452229251580093],\r
  [105.83008986152242, 30.49630137815329],\r
  [105.87132876486925, 30.557400639139672],\r
  [105.80204740724815, 30.6269785122317],\r
  [105.7872014020445, 30.739049793194482],\r
  [105.7872014020445, 30.80708016145408],\r
  [105.72946693736066, 30.8623193977935],\r
  [105.68657847788268, 30.91894198321077],\r
  [105.59255377825616, 30.97128805444197],\r
  [105.52657153290386, 31.01936455778386],\r
  [105.46388839982023, 31.043393718761095],\r
  [105.38800881766394, 31.087195987361042],\r
  [105.50842641543142, 30.568763703435494]\r
]\r
`;const f=`
<template>
  <div class="page">
    <map-view :icon-list="iconList" @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="play">\u64AD\u653E</div>
      <div class="button" @click="pause">\u6682\u505C</div>
      <div class="button" @click="replay">\u91CD\u65B0\u64AD\u653E</div>
      <div class="button" @click="stop">\u505C\u6B62\u64AD\u653E</div>
      <div class="button" @click="fitBounds">fitBounds</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapView from './map-view.vue'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { CarTrack } from 'mapbox-utils'
import data from './data.ts'
let map: mapboxgl.Map
let track: CarTrack

const iconList = [
  {
    path: './map-icon/icon-plane.png',
    name: 'icon-plane',
    pixelRatio: 10
  }
]

const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  track = new CarTrack({
    speed: 10,
    data,
    carLayer: {
      show: true,
      type: 'symbol',
      style: {
        'icon-image': 'icon-plane',
        'icon-rotate': ['+', ['get', 'bearing'], 45]
      }
    },
    currentPathLayer: {
      style: {
        'line-color': '#f00',
        'line-opacity': 0.4
      }
    },
    pathLayer: {
      style: {
        'line-color': '#0f0',
        'line-opacity': 0.4
      }
    },
    fitBoundsOptions: {
      padding: 40
    }
  })
  track.addTo(map)
}

const play = () => {
  track.play()
}

const pause = () => {
  track.pause()
}

const replay = () => {
  track.replay()
}

const stop = () => {
  track.stop()
}

const fitBounds = () => {
  track.fitBounds()
}

onBeforeUnmount(() => {
  track?.remove()
})
<\/script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
}

.button-wrapper {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 20px;
}

.button-wrapper .button {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  padding: 0 10px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
}

.button-wrapper .button:hover {
  background: #eee;
}

.button-wrapper .button:not(:first-of-type) {
  margin-left: 10px;
}
</style>
`;var v={base:f};const b={class:"car-track-demo"},_=s({__name:"index",setup(x){const n=d(),t=r({"index.vue":{code:v[n.params.id]},"data.ts":{code:m},...e}),a=r({...i});return(k,y)=>(u(),c("div",b,[l(o,{files:t.value,"main-file":"index.vue","import-map":a.value},null,8,["files","import-map"])]))}});var w=p(_,[["__scopeId","data-v-3aaa86eb"]]);export{w as default};
