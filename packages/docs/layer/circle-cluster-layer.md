# 圆点聚合点图层(CircleClusterLayer)

通过`CircleClusterLayer`可以在地图上创建 MapBox 中的 [CircleLayer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle) 图层，并支持点位的聚合，支持样式配置及高亮

::: warning 建议
[AdvancePointLayer](./advance-point-layer.md)组件已包含该组件所有功能，且更加灵活，提供更多的配置项支持。推荐新项目使用。
:::


## 基础用法

```js{2,4}
// 1. 导入
import { CircleClusterLayer } from 'mapbox-utils'
// 2. 创建CircleClusterLayer实例
const pointLayer = new CircleClusterLayer(options)
// 3. 添加到地图
pointLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`CircleClusterLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 点位数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Point>`

- **key：** 作为每个点位唯一标识的属性，用来识别需要高亮的点位，默认为`id`

- **clusterRadius：** 聚合半径，默认为`250`

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

  2. **`style`**： 点位高亮样式，常用属性如下：[点此](../style/index.md#circle高亮样式支持属性)查看完整属性

      | 属性名  | 描述 |
      | :-------: | :-------------------- |
      | **circle-radius**  | 圆点的半径（可选，值 >= 0，单位：像素，默认继承基础样式）|
      | **circle-color**  | 圆点的颜色（可选，默认继承基础样式） |
      | **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |

- **clusterStyle：** 聚合点位样式，常用属性如下：[点此](../style/index.md#圆点聚合点样式属性)查看完整属性
  | 属性名 | 描述 |
  | :-------: | :-------------------- |
  | **circle-radius** | 圆点的半径（可选，值 >= 0，默认值为`5`，单位：像素）|
  | **circle-color** | 圆点的颜色（可选，默认值为`#000000`） |
  | **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
  | **text-color** | 文本的颜色（可选，默认值为 #000000） |
  | **text-field** | 文本所对应的字段（可选，默认值为 ""），可设置为`['get', 'point_count']`用以显示聚合点数量|
  | **text-font** | 文本字体集合，可选，默认值为 （["Open Sans Regular","Arial Unicode MS Regular"]）|
  | **text-size** | 文本的大小（可选，默认值为 16，单位：像素） |
  | **text-allow-overlap** | 是否允许文本重叠（可选，默认值为 false。当值为 true 时，文本即使和其他符号触碰也会显示） |
  | **text-ignore-placement** | 是否忽略文本位置（可选，默认值为 false。当值为 true 时，其他符号即使与此文本触碰也会显示） |

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
  const pointLayer = new CircleClusterLayer(options);
  pointLayer.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  pointLayer.remove();
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
      turf.point([105.14453322179482, 30.50921803813716], { id: 1 }),
      turf.point([105.12568252795128, 30.570884171971322], { id: 2 }),
      turf.point([105.12774174353625, 30.481277054151516], { id: 3 }),
      // ...point
    ])
  );
  ```

### setHighlight()

该方法可以通过编码的方式将对应点位进行高亮（前提是在创建实例时设置了高亮相关属性，若无高亮相关配置则该方法无效）。

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`pointFeature.properties[key]`， 在内部通过该属性寻找对应的点位。

  ```ts
  function(valOfKey: string | number): this
  ```

- 示例

  ```ts
  pointLayer.setHighlight(1);
  ```

### removeHighlight()

调用该方法清除点位的高亮效果

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  pointLayer.removeHighlight();
  ```

### easeTo()

通过该方法可以将地图中心平移到对应的点位

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`pointFeature.properties[key]`，在内部通过该属性寻找对应的点位。

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
  pointLayer.easeTo(1);

  // 设置平移后的缩放层级为9
  pointLayer.easeTo(1, {
    zoom: 9,
  });
  ```

### flyTo()

通过该方法可以将地图中心飞行定位到对应的点位

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的点位。

  `options`包含[mapboxgl.FlyToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number,
    options?: Omit<mapboxgl.FlyToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  pointLayer.flyTo(1);
  ```

### fitBounds

调用该方法将所有点位集中到视口

- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```

- 示例

  ```ts
  pointLayer.fitBounds();
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
  pointLayer.on("click", e => {
    console.log(e.type); // 'click'
  });
  ```

## 事件

### click

点位被点击时触发的事件，可以获取被点击点位的坐标及点位数据

- callback

  ```ts
  (e: {
    type: 'click';
    target: this; // 当前CircleClusterLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on("click", e => {
    console.log(e.type); // 'click'
    // 点击后通过坐标进行定位
    map.easeTo({ center: e.lngLat });
    // ...
  });
  ```

### mouseenter

鼠标移入点位时触发

- callback

  ```ts
  (e: {
    type: 'mouseenter'; 
    target: this; // 当前CircleClusterLayer实例
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
    target: this; // 当前CircleClusterLayer实例
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
    target: this; // 当前CircleClusterLayer实例
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

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { CircleClusterLayer } from 'mapbox-utils'
import data from '/data/clusterData.json'
import * as turf from '@turf/turf'
let map
let pointLayer
const handleMapLoad = (val) => {
  map = val
  pointLayer = new CircleClusterLayer({
    key: 'id',
    data,
    clusterRadius: 50,
    style: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    },
    clusterStyle: {
      'text-field': ['get', 'point_count'],
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'center',
      'text-size': 16,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-color': '#000',
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        10,
        '#f1f075',
        30,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        30,
        40
      ]
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': 'rgb(10, 155, 82)',
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
pointLayer = new CircleClusterLayer({
    key: 'id',
    data,
    clusterRadius: 50,
    style: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    },
    clusterStyle: {
      'text-field': ['get', 'point_count'],
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'center',
      'text-size': 16,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-color': '#000',
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        10,
        '#f1f075',
        30,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        30,
        40
      ]
    },
    highlightOptions: {
      trigger: 'click',
      style: {
        'circle-color': 'rgb(10, 155, 82)',
      }
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

pointLayer.addTo(map)

pointLayer.on("click", e => {
  map.easeTo({ center: e.lngLat })
});
```
:::
