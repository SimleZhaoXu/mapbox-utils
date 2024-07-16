# 高级点图层(AdvancePointLayer)

使用`AdvancePointLayer`可以通过图层配置组合实现多种多边形效果，如高亮、聚合。

::: warning 建议
该组件已包含`CirclePointLayer`、`SymbolPointLayer`、`CircleClusterLayer`、`SymbolClusterLayer`等所能实现的所有功能，且更加灵活，提供更多的配置项支持。推荐使用该组件而不是以上其他组件。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { AdvancePointLayer } from 'mapbox-utils'
// 2. 创建AdvancePointLayer实例
const pointLayer = new AdvancePointLayer(options)
// 3. 添加到地图
AdvancePointLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`AdvancePointLayer`实例时需要传入的参数对象，配置如下：

|        属性名         | 描述                                                                                                                                                                                                                                                      |
| :-------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        **key**        | 作为每个点位唯一标识的属性，用来识别需要高亮的点位，默认为`id`                                                                                                                                                                                            |
|       **data**        | 点位数据，可选。可选数据格式：1. [GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Point>` 2. 返回 GeoJSON 格式数据的`url`。默认为`null`                                                                                                      |
|     **layerPool**     | 预设的图层配置，点击查看[layerPool](#layerPool)具体配置，其中的键名可在`layers`，`highlightLayers`，`clusterLayers`中引用。                                                                                                                                         |
|      **layers**       | 由 layerPool 中的键名组成的数组，表示默认的点位样式，可以通过配置多个来实现复杂的点位效果                                                                                                                                                                 |
| **highlightTrigger**  | 高亮的触发方式，可选值为`none`，`click`，`hover`，`manual`，默认为`none`，即无高亮效果。`click`表示鼠标点击时进行高亮；`hover`表示鼠标悬浮时进行高亮；`manual`表示只能通过调用`setHighlight`方法进行高亮；                                                |
|  **highlightLayers**  | 由 layerPool 中的键名组成的数组，表示高亮的点位样式，可以通过配置多个来实现复杂的点位效果                                                                                                                                                                 |
|      **cluster**      | 是否进行点位聚合，默认为`false`                                                                                                                                                                                                                           |
|  **clusterMaxZoom**   | 聚合的最大显示层级，当地图层级大于该指定的值时，取消聚合效果，默认为 maxzoom - 1                                                                                                                                                                          |
|      **maxzoom**      | 可显示的最大层级                                                                                                                                                                                                                                          |
| **clusterProperties** | 定义聚合点上的数据                                                                                                                                                                                                                                        |
| **clusterMinPoints**  | 聚合开启的最小的聚合点数，默认为 2                                                                                                                                                                                                                        |
|   **clusterRadius**   | 聚合半径，默认值为 50                                                                                                                                                                                                                                     |
|   **clusterLayers**   | 由 layerPool 中的键名组成的数组，表示聚合的点位样式，可以通过配置多个来实现复杂的点位效果                                                                                                                                                                 |
| **fitBoundsOptions**  | 可选，在点位添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有点位展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)。注意：如果`data`使用`url`获取数据，则无法触发该功能。 |

### layerPool {#layerPool}

预设的图层配置池，数据类型如下，点击查看[mapboxgl.CircleLayer](../base/style/layers.md#circle)、[mapboxgl.SymbolLayer](../base/style/layers.md#symbol)

```ts
type OmitProperty = "source" | "source-layer" | "id";
type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.SymbolLayer, OmitProperty>;
type LayerPool = {
  [k: string]: LayerType;
};
```

## API

### addTo()

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const pointLayer = new AdvancePointLayer(options);
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
  function(data: GeoJSON.FeatureCollection<GeoJSON.Point> ｜ string | null): this
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

调用该方法可以将指定的点位进行高亮，只有当`highlightTrigger`为`click`和`manual`才能生效

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一点位的属性值， 对应为`Feature.properties[key]`， 在内部通过该属性寻找对应的点位。

  ```ts
  function(valOfKey: string | number): this
  ```

- 示例

  ```ts
  pointLayer.setHighlight(1);
  ```

### removeHighlight()

调用该方法清除点位的高亮效果，只有当`highlightTrigger`为`click`和`manual`才能生效

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  pointLayer.removeHighlight();
  ```

### easeTo()

通过该方法可以将地图中心平移到对应的点位，当`data`为 url 时无效。

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

通过该方法可以将地图中心飞行定位到对应的点位，当`data`为 url 时无效。

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
    target: this; // 当前AdvancePointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    originalMapEvent: mapboxgl.MapMouseEvent  // 原地图鼠标点击事件
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
    target: this; // 当前AdvancePointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    originalMapEvent: mapboxgl.MapMouseEvent // 原地图鼠标移入事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on("mouseenter", e => {
    console.log(e.type); // 'mouseenter'
    // ...
  });
  ```

### mousemove

鼠标在点位上移动时触发

- callback

  ```ts
  (e: {
    type: 'mousemove';
    target: this; // 当前AdvancePointLayer实例
    data: any; // 点位数据
    lngLat: mapboxgl.LngLat; // 点位坐标
    originalMapEvent: mapboxgl.MapMouseEvent // 原地图鼠标移动事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on("mousemove", e => {
    console.log(e.type); // 'mouseenter'
    // ...
  });
  ```

### mouseleave

鼠标移出点位时触发，鼠标移出有两种情况，一种是移出当前图层，但鼠标还在地图中；一种是鼠标移出地图导致鼠标离开图层；两种情况都会触发该事件，但第二种不会暴露 originalMapEvent

- callback

  ```ts
  (e: {
    type: 'mouseleave';
    target: this; // 当前AdvancePointLayer实例
    originalMapEvent?: mapboxgl.MapMouseEvent // 原地图鼠标移出事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on("mouseleave", e => {
    console.log(e.type); // 'mouseleave'
    // ...
  });
  ```
### cluster-click

鼠标点击聚合点触发的事件

- callback

  ```ts
  (e: {
    type: 'cluster-click';
    target: this; // 当前AdvancePointLayer实例
    clusterLeaves: Array<any>; // 聚合的点
    lngLat: mapboxgl.LngLat; // 聚合点
    originalMapEvent: mapboxgl.MapMouseEvent // 原地图鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on("cluster-click", e => {
    console.log(e.type); // 'cluster-click'
    // ...
  });
  ```

## Demo

打点，配置点击高亮，并且点击后进行定位
<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { AdvancePointLayer } from 'mapbox-utils'
import { points } from '../assets/data'
import * as turf from '@turf/turf'
let map
let pointLayer
const data = turf.featureCollection(points.map((item, index) => {
  return turf.point(item, {id: index + 1})
}))
const handleMapLoad = (val) => {
  map = val
  pointLayer = new AdvancePointLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 10
        }
      },
      highlight: {
        type: 'circle',
        paint: {
          'circle-color': '#0f0',
          'circle-radius': 10
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlight'],
    fitBoundsOptions: {
      padding: 20
    }
  })
  pointLayer.addTo(map)
  pointLayer.on('click', (e) => {
    pointLayer.easeTo(e.data.id)
  })
}
onBeforeUnmount(() => {
  pointLayer?.remove()
})
</script>

::: details 点击查看代码

```js
const pointLayer = new AdvancePointLayer({
  key: "id",
  data,
  layerPool: {
    default: {
      type: "circle",
      paint: {
        "circle-color": "#f00",
        "circle-radius": 10,
      },
    },
    highlight: {
      type: "circle",
      paint: {
        "circle-color": "#0f0",
        "circle-radius": 10,
      },
    },
  },
  layers: ["default"],
  highlightTrigger: "click",
  highlightLayers: ["highlight"],
  fitBoundsOptions: {
    padding: 20,
  },
})
pointLayer.addTo(map)
pointLayer.on("click", e => {
   pointLayer.easeTo(e.data.id)
})
```

:::
