# 柱状图图层(PrismoidLayer)

在地图上创建柱状图以展示点位数据

## 基础用法

```js{2,4}
// 1. 导入
import { PrismoidLayer } from 'mapbox-postting'
// 2. 创建PrismoidLayer实例
const prismoidLayer = new PrismoidLayer(options)
// 3. 添加到地图
prismoidLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`PrismoidLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 点位数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Point>`

- **key：** 作为每个点位唯一标识的属性，用来识别需要高亮的点位，默认为`id`

- **style：** 点位基础样式，常用属性如下：

  | 属性名  | 描述 |
  | :-------: | :-------------------- |
  | **fill-extrusion-color** | 柱状图的颜色（可选，默认值为`#000000`） |
  | **fill-extrusion-opacity** | 柱状图的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
  | **fill-extrusion-pattern** | 柱状图的图案（可选） |
  | **fill-extrusion-height** |  柱状图的高度（可选，值 >= 0，默认值为 `0`，单位：米） |
  | **fill-extrusion-base** | 柱状图的底部高度（可选，值 >= 0，默认值为 `0`，单位：米。值必须小于等于 `fill-extrusion-height`） |
  | **fill-extrusion-translate** | 柱状图的偏移（可选，默认值为 `[0, 0]`，单位：像素） |
  | **fill-extrusion-translate-anchor** | 柱状图偏移的锚点（可选，可选值为 `map`、`viewport`，默认为 `map`） |

- **highlightOptions：** 高亮配置，可选（若不设置，则不会触发高亮）。包含以下两个属性：

  1. **`trigger`**： 高亮的触发方式，值为以下三种：

      - `click`: 点位被点击时触发高亮

      - `hover`: 鼠标移入点位时触发高亮

      - `both`: 以上两种情况都能触发高亮

  2. **`style`**： 高亮样式属性，常用属性如下：

      | 属性名  | 描述 |
      | :-------: | :-------------------- |
      | **fill-extrusion-color**  | 柱状图的颜色（可选，默认继承基础样式） |
      | **fill-extrusion-opacity** | 柱状图的不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |
      | **fill-extrusion-pattern** | 柱状图的图案（可选，默认继承基础样式） |

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
  const prismoidLayer = new PrismoidLayer(options)
  prismoidLayer.addTo(map)
  ```

### remove() 

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  prismoidLayer.remove()
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
  prismoidLayer.setData(
    turf.featureCollection([
      turf.point([105.14453322179482, 30.50921803813716], {id: 1}),
      turf.point([105.12568252795128, 30.570884171971322], {id: 2}),
      turf.point([105.12774174353625, 30.481277054151516], {id: 3})
      // ...point
    ])
  )
  ```


### setHighlight() 

该方法可以通过编码的方式将对应点位进行高亮（前提是在创建实例时设置了高亮相关属性，若无高亮相关配置则该方法无效）。

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`Feature.properties[key]`， 在内部通过该属性寻找对应的点位。

  ```ts
  function(valOfKey: string | number): this
  ```

- 示例

  ```ts
  prismoidLayer.setHighlight(1)
  ```

### removeHighlight()

调用该方法清除点位的高亮效果

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  prismoidLayer.removeHighlight()
  ```

### easeTo() 

通过该方法可以将地图中心平移到对应的点位

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的点位。

  `options`包含[mapboxgl.EaseToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#easeto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number,
    options?: Omit<mapboxgl.EaseToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  // 使用默认配置进行平移动
  prismoidLayer.easeTo(1)

  // 设置平移后的缩放层级为9
  prismoidLayer.easeTo(1, {
    zoom: 9
  }) 
  ```


### flyTo() 

通过该方法可以将地图中心飞行定位到对应的点位

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的点位。

  `options`包含[mapboxgl.FlyToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number, 
    options?: Omit<mapboxgl.FlyToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  prismoidLayer.flyTo(1)
  ```

### fitBounds

调用该方法将所有点位集中到视口


- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```


- 示例

  ```ts
  prismoidLayer.fitBounds()
  ```

### on

注册事件监听器

- 类型

  ```ts
  function<T extends keyof EventType<this>>(
    type: T,
    listener: (ev: EventType<this>[T]) => void
  ): this
  ```

- 示例

  ```ts
  prismoidLayer.on('click', (e) => {
    console.log(e.type) // 'click'
  })
  ```

## 事件

### click

点位被点击时触发的事件，可以获取被点击点位的坐标及点位数据

- callback

  ```ts
  (e: {
    type: 'click';
    target: this; // 当前PrismoidLayer实例
    data: any; // 柱状图数据
    lngLat: mapboxgl.LngLat; // 柱状图位置坐标
    points: Array<{ data: any; lngLat: mapboxgl.LngLat }>; // 重叠柱的状图位置
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  prismoidLayer.on('click', (e) => {
    console.log(e.type) // 'click'
    // 点击后通过坐标进行定位
    map.easeTo({center: e.lngLat})
    // ...
  })
  ```

### mouseenter

鼠标移入点位时触发

- callback

  ```ts
  (e: {
    type: 'mouseenter';
    target: this; // 当前PrismoidLayer实例
    data: any; // 柱状图数据
    lngLat: mapboxgl.LngLat; // 柱状图位置坐标
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移入事件
  }) => void
  ```

- 示例

  ```ts
  prismoidLayer.on('mouseenter', (e) => {
    console.log(e.type) // 'mouseenter'
    // ...
  })
  ```

### mousemove

鼠标在点位上移动时触发

- callback

  ```ts
  (e: {
    type: 'mousemove';
    target: this; // 当前PrismoidLayer实例
    data: any; // 柱状图数据
    lngLat: mapboxgl.LngLat; // 柱状图位置坐标
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移动事件
  }) => void
  ```

- 示例

  ```ts
  prismoidLayer.on('mousemove', (e) => {
    console.log(e.type) // 'mouseenter'
    // ...
  })
  ```

### mouseleave

鼠标移出点位时触发

- callback

  ```ts
  (e: {
    type: 'mouseleave'; 
    target: this; // 当前PrismoidLayer实例
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData; // 原地图图层鼠标移出事件
  }) => void
  ```

- 示例

  ```ts
  prismoidLayer.on('mouseleave', (e) => {
    console.log(e.type) // 'mouseleave'
    // ...
  })
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>
<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { PrismoidLayer } from 'mapbox-postting'
import { points } from '../assets/data'
import * as turf from '@turf/turf'
let map
let prismoidLayer
const data = turf.featureCollection(points.map((item, index) => {
  return turf.point(item, {id: index + 1})
}))
const handleMapLoad = (val) => {
  map = val
  map.setPitch(60)
  prismoidLayer = new PrismoidLayer({
    key: 'id',
    data,
    radius: 500,
    steps: 4,
    style: {
      'fill-extrusion-color': 'rgb(16, 146, 153)',
      'fill-extrusion-height': ['*', ['get', 'id'], 100],
      'fill-extrusion-base': 0
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'fill-extrusion-color': '#ffff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  prismoidLayer.addTo(map)
  prismoidLayer.on('click', (e) => {
    map.easeTo({center: e.lngLat})
  })
}
onBeforeUnmount(() => {
  prismoidLayer?.remove()
})
</script>


::: details 点击查看代码
```js
const data = turf.featureCollection(points.map((item, index) => {
  return turf.point(item, { id: index + 1 })
}))

prismoidLayer = new PrismoidLayer({
  key: 'id',
  data,
  radius: 500,
  steps: 4,
  style: {
    'fill-extrusion-color': 'rgb(16, 146, 153)',
    'fill-extrusion-height': ['*', ['get', 'id'], 100],
    'fill-extrusion-base': 0
  },
  highlightOptions: {
    trigger: 'click',
    style: {
      'fill-extrusion-color': '#ffff00'
    }
  },
  fitBoundsOptions: {
    padding: 20
  }
})

prismoidLayer.addTo(map)

prismoidLayer.on('click', (e) => {
  map.easeTo({ center: e.lngLat })
})
```
:::