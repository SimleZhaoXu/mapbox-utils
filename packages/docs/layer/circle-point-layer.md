# 圆点图层(CirclePointLayer)

通过`CirclePointLayer`可以在地图上创建 MapBox 中的 [CircleLayer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle) 图层，支持样式配置及高亮

::: warning 建议
[AdvancePointLayer](./advance-point-layer.md)组件已包含该组件所有功能，且更加灵活，提供更多的配置项支持。推荐新项目使用。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { CirclePointLayer } from 'mapbox-utils'
// 2. 创建CirclePointLayer实例
const pointLayer = new CirclePointLayer(options)
// 3. 添加到地图
pointLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`CirclePointLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 点位数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Point>`

- **key：** 作为每个点位唯一标识的属性，用来识别需要高亮的点位，默认为`id`

- **style：** 点位基础样式，常用属性如下：[点此](../style/index.md#circle基础样式属性)查看完整属性

  | 属性名  | 描述 |
  | :-------: | :-------------------- |
  | **circle-radius** | 圆点的半径（可选，值 >= 0，默认值为`5`，单位：像素）|
  | **circle-color** | 圆点的颜色（可选，默认值为`#000000`） |
  | **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |

- **highlightOptions：** 高亮配置，可选（若不设置，则不会触发高亮）。包含以下两个属性：

  1. **`trigger`**： 高亮的触发方式，值为以下三种：

      - `click`: 点位被点击时触发高亮

      - `hover`: 鼠标移入点位时触发高亮

      - `both`: 以上两种情况都能触发高亮

  2. **`style`**： 高亮样式属性，常用属性如下：[点此](../style/index.md#circle高亮样式支持属性)查看完整属性

      | 属性名  | 描述 |
      | :-------: | :-------------------- |
      | **circle-radius**  | 圆点的半径（可选，值 >= 0，单位：像素，默认继承基础样式）|
      | **circle-color**  | 圆点的颜色（可选，默认继承基础样式） |
      | **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |

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
  const pointLayer = new CirclePointLayer(options)
  pointLayer.addTo(map)
  ```

### remove() 

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  pointLayer.remove()
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
  pointLayer.setData(
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
  pointLayer.setHighlight(1)
  ```

### removeHighlight()

调用该方法清除点位的高亮效果

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  pointLayer.removeHighlight()
  ```

### easeTo() 

通过该方法可以将地图中心平移到对应的点位

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`pointFeature.properties[key]`，在内部通过该属性寻找对应的点位。

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
  pointLayer.easeTo(1)

  // 设置平移后的缩放层级为9
  pointLayer.easeTo(1, {
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
  pointLayer.flyTo(1)
  ```

### fitBounds

调用该方法将所有点位集中到视口


- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```


- 示例

  ```ts
  pointLayer.fitBounds()
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
  pointLayer.on('click', (e) => {
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
    target: this; // 当前CirclePointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    points: Array<{ data: any; lngLat: mapboxgl.LngLat }>; // 重叠的点位
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on('click', (e) => {
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
    target: this; // 当前CirclePointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移入事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on('mouseenter', (e) => {
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
    target: this; // 当前CirclePointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移动事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on('mousemove', (e) => {
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
    target: this; // 当前CirclePointLayer实例
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData; // 原地图图层鼠标移出事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on('mouseleave', (e) => {
    console.log(e.type) // 'mouseleave'
    // ...
  })
  ```

## Demo

打点，配置点击高亮，并且点击后进行定位

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>
<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { CirclePointLayer } from 'mapbox-utils'
import { points } from '../assets/data'
import * as turf from '@turf/turf'
let map
let pointLayer
const data = turf.featureCollection(points.map((item, index) => {
  return turf.point(item, {id: index + 1})
}))
const handleMapLoad = (val) => {
  map = val
  pointLayer = new CirclePointLayer({
    key: 'id',
    data,
    style: {
      'circle-radius': 7,
      'circle-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    map.easeTo({center: e.lngLat})
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>


::: details 点击查看代码
```js
const data = turf.featureCollection(points.map((item, index) => {
  return turf.point(item, { id: index + 1 })
}))

pointLayer = new CirclePointLayer({
  key: 'id',
  data,
  style: {
    'circle-radius': 7,
    'circle-color': '#ff0000'
  },
  highlightOptions: {
    trigger: 'click',
    style: {
      'circle-color': '#00ff00'
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
```
:::