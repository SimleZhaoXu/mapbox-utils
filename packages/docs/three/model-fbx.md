# 加载 3 维模型(fbx)

## Demo

<div class="map-box">
  <div ref="mapContainer" class="map-container" />
</div>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import 'threebox-plugin/dist/threebox.css'
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
    zoom: 15,
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
      id: '3d-model-layer',
      type: 'custom',
      renderingMode: '3d',
      objects: [],
      onAdd() {
        window.tb.loadObj({
          obj: window.origin + '/mapbox-postting-docs/models/triceratops.fbx',
          type: 'fbx',
          scale: 0.5,
          units: 'meters',
          anchor: 'center',
          rotation: { x: 90, y: 90, z: 0 },
        },  (model) => {
          model.setCoords([105.5, 30.6, 0])
          window.tb.add(model);
          this.objects.push(model)
        })
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
import "threebox-plugin/dist/threebox.css";
onUnmounted(() => {
  window.tb.dispose();
  window.tb = undefined;
});
const map = new mapboxgl.Map({
  container: mapContainer.value,
  zoom: 15,
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
    id: "3d-model-layer",
    type: "custom",
    renderingMode: "3d",
    objects: [],
    onAdd() {
      window.tb.loadObj(
        {
          obj: '/models/triceratops.fbx',
          type: "fbx",
          scale: 0.5,
          units: "meters",
          anchor: 'center',
          rotation: { x: 90, y: 90, z: 0 },
        },
        model => {
          model.setCoords([105.5, 30.6, 0]);
          window.tb.add(model);
          this.objects.push(model);
        }
      );
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
