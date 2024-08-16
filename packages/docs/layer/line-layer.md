# 线图层(LineLayer)

通过`LineLayer`可以在地图上创建 MapBox 中的 [LineLayer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line) 图层，支持样式配置及高亮

::: warning 建议
[AdvanceLineLayer](./advance-line-layer.md)组件已包含该组件所有功能，且更加灵活，提供更多的配置项支持。推荐新项目使用。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { LineLayer } from 'mapbox-postting'
// 2. 创建LineLayer实例
const lineLayer = new LineLayer(options)
// 3. 添加到地图
lineLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`LineLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 线段数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<LineString>`

- **key：** 作为每个线段唯一标识的属性，用来识别需要高亮的线段，默认为`id`

- **style：** 线段基础样式，常用属性如下：[点此](../style/index.md#line基础样式属性)查看完整属性

  | 属性名  | 描述 |
  | :-------: | :-------------------- |
  | **line-width** | 线段的宽度（可选，值 >= 0，默认值为`1`，单位：像素）|
  | **line-color** | 线段的颜色（可选，默认值为`#000000`） |
  | **line-opacity** | 线段的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
  | **line-dasharray** | 虚线的破折号部分和间隔的长度（可选，默认值为 [0, 0]。如果设置了 line-pattern，则 line-dasharray 将无效） |

- **highlightOptions：** 高亮配置，可选（若不设置，则不会触发高亮）。包含以下两个属性：

  1. **`trigger`**： 高亮的触发方式，值为以下三种：

      - `click`: 线段被点击时触发高亮

      - `hover`: 鼠标移入线段时触发高亮

      - `both`: 以上两种情况都能触发高亮

  2. **`style`**： 线段高亮支持属性常用属性如下：[点此](../style/index.md#line高亮样式支持属性)查看完整属性

      | 属性名  | 描述 |
      | :-------: | :-------------------- |
      | **line-width**  | 线段的宽度（可选，值 >= 0，单位：像素，默认继承基础样式）|
      | **line-color**  | 线段的颜色（可选，默认继承基础样式） |
      | **line-opacity** | 线段的不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |

- **fitBoundsOptions** 可选，在线段添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有线段展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)

## API

### addTo() 

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const lineLayer = new LineLayer(options)
  lineLayer.addTo(map)
  ```

### remove() 

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  lineLayer.remove()
  ```


### setData()

设置图层数据，当图层已经添加到地图上时，会更新线段

- 类型

  ```ts
  function(data: GeoJSON.FeatureCollection<GeoJSON.LineString>): this
  ```

- 示例

  可以通过`turf.js`内置功能生成`FeatureCollection<LineString>`类型数据

  ```ts
  lineLayer.setData(
    turf.featureCollection([
      turf.lineString([
        [105.14453322179482, 30.50921803813716], 
        [105.12568252795128, 30.570884171971322], 
        [105.12774174353625, 30.481277054151516]
      ], {id: 1})
      // ...lineString
    ])
  )
  ```


### setHighlight() 

该方法可以通过编码的方式将对应线段进行高亮（前提是在创建实例时设置了高亮相关属性，若无高亮相关配置则该方法无效）。

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一线段的属性值， 对应为`Feature.properties[key]`， 在内部通过该属性寻找对应的线段。

  ```ts
  function(valOfKey: string | number): this
  ```

- 示例

  ```ts
  lineLayer.setHighlight(1)
  ```

### removeHighlight()

调用该方法清除线段的高亮效果

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  polygonLayer.removeHighlight()
  ```

### easeTo() 

通过该方法可以将地图中心平移到对应的线段中心

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一线段的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的线段。

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
  lineLayer.easeTo(1)

  // 设置平移后的缩放层级为9
  lineLayer.easeTo(1, {
    zoom: 9
  }) 
  ```


### flyTo() 

通过该方法可以将地图中心飞行定位到对应的线段中心

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一线段的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的线段。

  `options`包含[mapboxgl.FlyToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number,
    options?: Omit<mapboxgl.FlyToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  lineLayer.flyTo(1)
  ```


### fitTo

调用该方法将对应的线段集中到视口

- 类型

  valOfKey是通过`key`(在`options`中设置)来标识唯一线段的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的线段。

  `options`为[mapboxgl.FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitBounds)

  ```ts
  function(
    valOfKey: string | number,
    options?: mapboxgl.FitBoundsOptions
  ): this
  ```

- 示例

  ```ts
  lineLayer.fitTo(1)
  ```


### fitBounds

调用该方法将所有线段集中到视口


- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```


- 示例

  ```ts
  lineLayer.fitBounds()
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
  lineLayer.on('click', (e) => {
    console.log(e.type) // 'click'
  })
  ```

## 事件

### click

线段被点击时触发的事件，可以获取被点击线段的中心、线段的边界及线段数据

- callback

  ```ts
  (e: {
    type: 'click';
    target: this; // 当前LineLayer实例
    data: any; // 点击的线段数据
    center: mapboxgl.LngLat; // 点击的线段的中心
    lngLatBounds: mapboxgl.LngLatBounds; // 点击的线段的边界
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('click', (e) => {
    console.log(e.type) // 'click'
    // 点击后通过坐标进行定位
    map.easeTo({center: e.center})
    // ...
  })
  ```

### mouseenter

鼠标移入线段图层时触发

- callback

  ```ts
  (e: {
    type: 'mouseenter'; 
    target: this; // 当前LineLayer实例
    data: any; // 线段数据
    lngLat: mapboxgl.LngLat; // 鼠标在地图上的坐标
    center: mapboxgl.LngLat; // 线段的几何中心
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移入事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('mouseenter', (e) => {
    console.log(e.type) // 'mouseenter'
    // ...
  })
  ```

### mousemove

鼠标在线段图层上移动时触发

- callback

  ```ts
  (e: {
    type: 'mousemove'; 
    target: this; // 当前LineLayer实例
    data: any; // 线段数据
    lngLat: mapboxgl.LngLat; // 鼠标在地图上的坐标
    center: mapboxgl.LngLat; // 线段的几何中心
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移动事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('mousemove', (e) => {
    console.log(e.type) // 'mouseenter'
    // ...
  })
  ```

### mouseleave

鼠标移出线段图层时触发

- callback

  ```ts
  (e: {
    type: 'mouseleave'; 
    target: this; // 当前LineLayer实例
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData; // 原地图图层鼠标移出事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('mouseleave', (e) => {
    console.log(e.type) // 'mouseleave'
    // ...
  })
  ```

## Demo

画线，配置点击高亮，并且点击后进行定位

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>
<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { LineLayer } from 'mapbox-postting'
import data from '/data/lineData.json'
let map
let lineLayer
const handleMapLoad = (val) => {
  map = val
  lineLayer = new LineLayer({
    key: 'id',
    data,
    style: {
      'line-width': 4,
      'line-color': '#ff0000'
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'line-color': '#00ff00'
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  lineLayer.addTo(map)
  lineLayer.on('click', (e) => {
    map.easeTo({center: e.center})
  })
}
onBeforeUnmount(() => {
  lineLayer?.remove()
})
</script>

::: details 点击查看代码
```js
lineLayer = new LineLayer({
  key: 'id',
  data,
  style: {
    'line-width': 7,
    'line-color': '#ff0000'
  },
  highlightOptions: {
    trigger: 'click',
    style: {
      'line-color': '#00ff00'
    }
  },
  fitBoundsOptions: {
    padding: 20
  }
})

lineLayer.addTo(map)

lineLayer.on('click', (e) => {
  map.easeTo({center: e.center})
})
```
:::