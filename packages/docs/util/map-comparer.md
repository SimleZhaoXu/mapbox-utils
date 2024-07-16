# 地图卷帘(MapComparer)

用于比较两个地图，展示不同数据

## 基础用法

```js{2,4}
// 1. 导入
import { MapComparer } from 'mapbox-utils'
// 导入css样式
import 'mapbox-utils/dist/index.css'
// 2. 创建MapComparer实例
const mapComparer = new MapComparer(options)
```

## Options

创建`MapComparer`实例时需要传入的参数对象，包含以下几个部分：

- **container**：创建地图卷帘所需要的dom元素，可以是dom元素对象，也可以是对应css选择器

- **firstMapStyle**：创建第一个地图对象所需的Mapbox style

- **secondMapStyle**：创建第二个地图对象所需的Mapbox style

- **mapOptions**：创建mapbox地图对象所需的除style属性外的参数，具体参考[mapbox官网](https://docs.mapbox.com/mapbox-gl-js/api/map/)

- **horizontal**： 两个地图的对齐方式，如果为`true`，则两个地图在竖直方向平行，否则两个地图在水平方向平行，默认为`false`

## API

### setSlider()

设置分割线位置， 参数为0~1之间的数字

- 类型

  ```ts
  setSlider(p: number): void
  ```

- 示例

  ```ts
  mapComparer.setSlider(0.5)
  ```

### remove() 

移除地图卷帘，包括其中两个地图，销毁相关资源占用，移除后无法调用其他api，

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  mapComparer.remove()
  ```

## Demo
<div>
  <div ref="container" class="container"></div>
</div>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-utils/dist/index.css'
import firstMapStyle from '/data/map_sn.json'
import secondMapStyle from '/data/map_sn.json'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import data from '/data/heatmapData.json'
import { MapComparer, CirclePointLayer, HeatmapLayer } from 'mapbox-utils'
const container = ref()
let comparer

onMounted(() => {
  comparer = new MapComparer({
    container: container.value,
    horizontal: false,
    firstMapStyle,
    secondMapStyle,
    mapOptions: {
      zoom: 9,
      minZoom: 1,
      maxZoom: 18,
      center: [105.5, 30.6]
    }
  })

  setTimeout(() => {
    pointLayer.addTo(comparer.firstMap)
    heatmapLayer.addTo(comparer.secondMap)
  }, 200)
})

const pointLayer = new CirclePointLayer({
  key: 'id',
  data,
  style: {
    'circle-radius': 5,
    'circle-color': '#ff0000'
  }
})

const heatmapLayer = new HeatmapLayer({
  data,
  style: {
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 13, 3],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(0, 0, 255, 0)',
      0.1,
      'royalblue',
      0.3,
      'cyan',
      0.5,
      'lime',
      0.7,
      'yellow',
      1,
      'red'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 13, 20],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 0]
  }
})

onBeforeUnmount(() => {
  pointLayer.remove()
  heatmapLayer.remove()
  comparer.remove()
})
</script>

::: details 点击查看代码
```js
import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-utils/dist/index.css'
import { MapComparer, CirclePointLayer, HeatmapLayer } from 'mapbox-utils'
import { ref, onBeforeUnmount, onMounted } from 'vue'
const container = ref()
let comparer
onMounted(() => {
  comparer = new MapComparer({
    container: container.value,
    horizontal: false,
    firstMapStyle,
    secondMapStyle,
    mapOptions: {
      zoom: 9,
      minZoom: 1,
      maxZoom: 18,
      center: [105.5, 30.6]
    }
  })

  setTimeout(() => {
    pointLayer.addTo(comparer.firstMap)
    heatmapLayer.addTo(comparer.secondMap)
  }, 200)
})

const pointLayer = new CirclePointLayer({
  key: 'id',
  data,
  style: {
    'circle-radius': 5,
    'circle-color': '#ff0000'
  }
})

const heatmapLayer = new HeatmapLayer({
  data,
  style: {
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 13, 3],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(0, 0, 255, 0)',
      0.1,
      'royalblue',
      0.3,
      'cyan',
      0.5,
      'lime',
      0.7,
      'yellow',
      1,
      'red'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 13, 20],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 0]
  }
})

onBeforeUnmount(() => {
  pointLayer.remove()
  heatmapLayer.remove()
  comparer.remove()
})
```
:::

<style scoped>
.container {
  width: 100%;
  height: 600px;
  border-radius: 5px;
  overflow: hidden;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>