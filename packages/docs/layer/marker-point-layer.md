# Marker 点位(MarkerPointLayer)

通过`MarkerPointLayer`可以在地图上创建基于 MapBox 中的 [Marker](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle) 元素的点位，支持自定义 Maker 配置

## 基础用法

```js{2,4}
// 1. 导入
import { MarkerPointLayer } from 'mapbox-postting'
// 2. 创建MarkerPointLayer实例
const pointLayer = new MarkerPointLayer(options)
// 3. 添加到地图
pointLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`MarkerPointLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 点位数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Point>`

- **key：** 可选，作为每个点位唯一标识的属性，默认为`id`

- **markerOptions：** 可选，Maker 相关配置

  |        属性名         | 描述                                                                                                                                                   |
  | :-------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
  |      **anchor**       | 表示 Marker 相对于坐标的位置，可选：`center`、`top`、`bottom`、`left`、`right`、`top-left`、`top-right`、`bottom-left`、`bottom-right`。默认为`center` |
  |       **color**       | 默认的 Marker 是一个 svg 的图标，可以通过此选项设置其颜色，默认为`#3FB1CE`, 若设置了`element`选项，则 color 无效                                       |
  |      **element**      | Marker 使用的 Dom 元素，默认是浅蓝色的液滴形状的 SVG 标记，支持**DomElement**或一个**返回 DomElement 的函数**                                          |
  |  **pitchAlignment**   | 地图倾斜时 Marker 的对齐方式，默认为`auto`。可选：`map`对齐到地图的平面，`viewport：对齐到视口的平面，`auto`：使用**_rotationAlignment_**的值          |
  |     **rotation**      | Marker 的旋转角度， 默认为 0                                                                                                                           |
  | **rotationAlignment** | 地图旋转时 Maker 的对齐方式，默认为`auto`相当于`viewport`，可选：`map`：与地图平面对齐，与地图旋转时的基本方向一致，`viewport`：与屏幕空间对齐         |
  |       **scale**       | 当未设置 element 选项时，用于默认标记的缩放比例，默认为 1，默认比例对应的高度为 41px，宽度为 27px                                                      |

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
    target: this; // 当前MarkerPointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat // 点位坐标
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

## Demo


<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>


<script setup>
import { onBeforeUnmount, createApp } from 'vue'
import MapView from '/components/map-view.vue'
import { MarkerPointLayer } from 'mapbox-postting'
import { points } from '/assets/data'
import * as turf from '@turf/turf'
import CustomMarker from '/components/custom-marker.vue'
let map
let pointLayer
const data = turf.featureCollection(points.slice(0, 10).map((item, index) => {
  const num = Math.floor(Math.random() * 4 + 1)
  return turf.point(item, {id: index + 1, type: num + ''})
}))
const handleMapLoad = (val) => {
  map = val
  pointLayer = new MarkerPointLayer({
    key: 'id',
    data,
    markerOptions: {
      element: (data) => {
        return createApp(CustomMarker, { data }).mount(
          document.createElement('div')
        ).$el
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
const data = turf.featureCollection(points.slice(0, 10).map((item, index) => {
  const num = Math.floor(Math.random() * 4 + 1)
  return turf.point(item, {id: index + 1, type: num + ''})
}))

pointLayer = new MarkerPointLayer({
  key: 'id',
  data,
  markerOptions: {
    element: (data) => {
      return createApp(CustomMarker, { data }).mount(
        document.createElement('div')
      ).$el
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