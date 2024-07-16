# 热力图图层(HeatmapLayer)

通过`HeatmapLayer`可以在地图上创建 MapBox 中的 [heatmap](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#heatmap) 图层，支持样式配置

## 基础用法

```js{2,4}
// 1. 导入
import { HeatmapLayer } from 'mapbox-utils'
// 2. 创建HeatmapLayer实例
const heatmapLayer = new HeatmapLayer(options)
// 3. 添加到地图
heatmapLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`HeatmapLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 点位数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Point>`

- **style：** 热力图样式，

  |       属性名        | 描述                                                             |
  | :-----------------: | :--------------------------------------------------------------- |
  | **heatmap-opacity** | 热力图的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）           |
  | **heatmap-radius**  | 一个热力图点的影响半径（可选，值 >= 1，默认值为 30，单位：像素） |
  | **heatmap-weight**  | 一个热力图点的权重（可选，值 >= 0，默认值为 1）                  |
  | **heatmap-intensity** | 热力图的强度，控制了所有的热力图点（可选，值 >= 0，默认值为 1） |
  | **heatmap-color** | 热力图的颜色变化 |

- **minZoom：** 热力图可见的最小地图层级，默认为0

- **maxZoom：** 热力图可见的最大地图层级，默认为24

- **fitBoundsOptions** 可选，在点位添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有点位展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)

## API

### addTo() 

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const heatmapLayer = new HeatmapLayer(options)
  heatmapLayer.addTo(map)
  ```

### remove() 

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  heatmapLayer.remove()
  ```


### setData()

设置图层数据，当图层已经添加到地图上时，会更新点位

- 类型

  ```ts
  function(data: GeoJSON.FeatureCollection<GeoJSON.Point>): this
  ```

- 示例

  可以通过`turf.js`内置功能生成`FeatureCollection<Point>`类型数据

  ```ts
  heatmapLayer.setData(
    turf.featureCollection([
      turf.point([105.14453322179482, 30.50921803813716], {id: 1}),
      turf.point([105.12568252795128, 30.570884171971322], {id: 2}),
      turf.point([105.12774174353625, 30.481277054151516], {id: 3})
      // ...point
    ])
  )
  ```

### fitBounds

调用该方法将所有点位集中到视口

- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```


- 示例

  ```ts
  heatmapLayer.fitBounds()
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { HeatmapLayer } from 'mapbox-utils'
import data from '/data/heatmapData.json'
let map
let heatmapLayer
const handleMapLoad = (val) => {
  map = val
  heatmapLayer = new HeatmapLayer({
    data,
    fitBoundsOptions: true,
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
  heatmapLayer.addTo(map)
}

onBeforeUnmount(() => {
  heatmapLayer?.remove()
})
</script>


::: details 点击查看代码
```js
heatmapLayer = new HeatmapLayer({
  data,
  fitBoundsOptions: true,
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
```
:::