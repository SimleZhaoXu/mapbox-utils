# 加载 Threejs 物体

## Demo
<div class="map-box">
  <div ref="mapContainer" class="map-container" />
</div>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-postting/dist/index.css'
import { onMounted, ref, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapStyle from '../data/map_tian.json'
import threeboxPlugin from 'threebox-plugin'; 
const { Threebox, THREE } = threeboxPlugin
const mapContainer = ref()
let map
onUnmounted(() => {
  window.tb.dispose()
  window.tb = undefined
})
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    zoom: 10,
    minZoom: 1,
    maxZoom: 17.9,
    center: [105.5, 30.6],
    pitch: 60,
    style: MapStyle,
    antialias: true
  })

  window.tb = new Threebox(
    map,
    map.getCanvas().getContext('webgl'),
    { defaultLights: true, enableSelectingObjects: true, multiLayer: true }
  )

  map.on('load', () => {
    map.addLayer({
      id: 'three-mesh-layer',
      type: 'custom',
      renderingMode: '3d',
      objects: [],
      onAdd() {
        const box1 = window.tb.Object3D({
          anchor: 'center',
          obj: new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshPhongMaterial({color: 0x00ff00})),
          units: 'scene'
        })
        box1.setCoords([105.49038696288954,30.575764959530773, 0])
        window.tb.add(box1)
        this.objects.push(box1)

        const box2 = window.tb.Object3D({
          anchor: 'center',
          obj: new THREE.Mesh(new THREE.BoxGeometry(80, 80, 80), new THREE.MeshPhongMaterial({color: 0xff0000, transparent: true, opacity: 0.8})),
          units: 'scene'
        })
        box2.setCoords([105.58746293775113, 30.573422417658335, 0])
        window.tb.add(box2)
        this.objects.push(box2)
      },
      render() {},
      onRemove() {
        this.objects.forEach(obj => {
          window.tb.remove(obj)
        })
        this.objects = [];
      }
    })
  })
})
</script>

<style>
.map-box {
  width: 100%;
  height: 500px;
  position: relative;
}

.map-box .map-container {
  width: 100%;
  height: 100%;
}
</style>

::: details 点击查看代码

```js
import { Threebox, THREE } from "threebox-plugin";
onUnmounted(() => {
  window.tb.dispose();
  window.tb = undefined;
});
const map = new mapboxgl.Map({
  container: mapContainer.value,
  zoom: 10,
  minZoom: 1,
  maxZoom: 17.9,
  center: [105.5, 30.6],
  pitch: 60,
  style: MapStyle,
  antialias: true, // 抗锯齿
});

window.tb = new Threebox(
  map,
  map.getCanvas().getContext("webgl"), // get the context from the map canvas
  { defaultLights: true, enableSelectingObjects: true, multiLayer: true }
);

map.on("load", () => {
  map.addLayer({
    id: "three-mesh-layer",
    type: "custom",
    renderingMode: "3d",
    objects: [],
    onAdd() {
      const box1 = window.tb.Object3D({
        anchor: "center",
        obj: new THREE.Mesh(
          new THREE.BoxGeometry(100, 100, 100),
          new THREE.MeshPhongMaterial({ color: 0x00ff00 })
        ),
        units: "scene",
      });
      box1.setCoords([105.49038696288954, 30.575764959530773, 0]);
      window.tb.add(box1);
      this.objects.push(box1);

      const box2 = window.tb.Object3D({
        anchor: "center",
        obj: new THREE.Mesh(
          new THREE.BoxGeometry(80, 80, 80),
          new THREE.MeshPhongMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.8,
          })
        ),
        units: "scene",
      });
      box2.setCoords([105.58746293775113, 30.573422417658335, 0]);
      window.tb.add(box2);
      this.objects.push(box2);
    },
    render() {},
    onRemove() {
      this.objects.forEach(obj => {
        window.tb.remove(obj);
      });
      this.objects = [];
    },
  });
});
```

:::
