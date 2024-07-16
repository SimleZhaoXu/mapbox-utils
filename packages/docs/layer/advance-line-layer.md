# 高级线图层(AdvanceLineLayer)

使用`AdvanceLineLayer`可以通过图层配置组合实现多种线条效果。

::: warning 建议
该组件已包含`LineLayer`所能实现的所有功能，且更加灵活，提供更多的配置项支持。推荐使用该组件而不是`LineLayer`。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { AdvanceLineLayer } from 'mapbox-utils'
// 2. 创建LineLayer实例
const lineLayer = new AdvanceLineLayer(options)
// 3. 添加到地图
lineLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`AdvanceLineLayer`实例时需要传入的参数对象，配置如下：
| 属性名 | 描述 |
| :-------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **key** | 作为每个线条唯一标识的属性，用来识别需要高亮的线条，默认为`id` |
| **data** | 线条数据，可选。可选数据格式：1. [GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<LineString>` 2. 返回 GeoJSON 格式数据的`url`。默认为`null` |
| **layerPool** | 预设的图层配置，点击查看[layerPool](#layerPool)具体配置，其中的键名可在`layers`，`highlightLayers`中引用。 |
| **layers** | 由 layerPool 中的键名组成的数组，表示默认的线条样式，可以通过配置多个来实现复杂的线条效果 |
| **highlightTrigger** | 高亮的触发方式，可选值为`none`，`click`，`hover`，`manual`，默认为`none`，即无高亮效果。`click`表示鼠标点击时进行高亮；`hover`表示鼠标悬浮时进行高亮；`manual`表示只能通过调用`setHighlight`方法进行高亮； |
| **highlightLayers** | 由 layerPool 中的键名组成的数组，表示高亮的线条样式，可以通过配置多个来实现复杂的线条效果 |
| **fitBoundsOptions** | 可选，在线条添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有线条展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)。注意：如果`data`使用`url`获取数据，则无法触发该功能。 |

### layerPool {#layerPool}

预设的图层配置池，数据类型如下，点击查看[mapboxgl.LineLayer](../base/style/layers.md#line)

```ts
type OmitProperty = "source" | "source-layer" | "id";
type LayerType = Omit<mapboxgl.LineLayer, OmitProperty>;
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
  const lineLayer = new AdvanceLineLayer(options);
  lineLayer.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  lineLayer.remove();
  ```

### setData()

设置图层数据，当图层已经添加到地图上时，会更新线条

- 类型

  ```ts
  function(data: GeoJSON.FeatureCollection<GeoJSON.LineString> ｜ string | null): this
  ```

- 示例

  可以通过`turf.js`内置功能生成`FeatureCollection<LineString>`类型数据

  ```ts
  lineLayer.setData(
    turf.featureCollection([
      turf.lineString(
        [
          [105.14453322179482, 30.50921803813716],
          [105.12568252795128, 30.570884171971322],
          [105.12774174353625, 30.481277054151516],
        ],
        { id: 1 }
      ),
      // ...lineString
    ])
  );
  ```

### setHighlight()

调用该方法可以将指定的线条进行高亮，只有当`highlightTrigger`为`click`和`manual`才能生效

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一线条的属性值， 对应为`Feature.properties[key]`， 在内部通过该属性寻找对应的线条。

  ```ts
  function(valOfKey: string | number): this
  ```

- 示例

  ```ts
  lineLayer.setHighlight(1);
  ```

### removeHighlight()

调用该方法清除线条的高亮效果，只有当`highlightTrigger`为`click`和`manual`才能生效

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  lineLayer.removeHighlight();
  ```

### easeTo()

通过该方法可以将地图中心平移到对应的线条中心，当`data`为 url 时无效。

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一线条的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的线条。

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

通过该方法可以将地图中心飞行定位到对应的线条中心，当`data`为 url 时无效。

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一线条的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的线条。

  `options`包含[mapboxgl.FlyToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number,
    options?: Omit<mapboxgl.FlyToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  lineLayer.flyTo(1);
  ```

### fitTo

调用该方法将对应的线条集中到视口，当`data`为 url 时无效。

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一线条的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的线条。

  `options`为[mapboxgl.FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitBounds)

  ```ts
  function(
    valOfKey: string | number,
    options?: mapboxgl.FitBoundsOptions
  ): this
  ```

- 示例

  ```ts
  lineLayer.fitTo(1);
  ```

### fitBounds

调用该方法将所有线条集中到视口

- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```

- 示例

  ```ts
  lineLayer.fitBounds();
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
  lineLayer.on("click", e => {
    console.log(e.type); // 'click'
  });
  ```

## 事件

### click

线条被点击时触发的事件，可以获取被点击的线条的中点坐标及线条数据

- callback

  ```ts
  (e: {
    type: 'click';
    target: this; // 当前AdvanceLineLayer实例
    data: any; // 线条数据
    center: mapboxgl.LngLat; // 线条中点坐标
    originalMapEvent: mapboxgl.MapMouseEvent  // 原地图鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on("click", e => {
    console.log(e.type); // 'click'
    // 点击后通过坐标进行定位
    map.easeTo({ center: e.center });
    // ...
  });
  ```

### mouseenter

鼠标移入线条时触发

- callback

  ```ts
  (e: {
    type: 'mouseenter';
    target: this; // 当前AdvanceLineLayer实例
    data: any; // 线条数据
    center: mapboxgl.LngLat; // 线条中点坐标
    originalMapEvent: mapboxgl.MapMouseEvent // 原地图鼠标移入事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on("mouseenter", e => {
    console.log(e.type); // 'mouseenter'
    // ...
  });
  ```

### mousemove

鼠标在线条上移动时触发

- callback

  ```ts
  (e: {
    type: 'mousemove';
    target: this; // 当前AdvanceLineLayer实例
    data: any; // 线条数据
    center: mapboxgl.LngLat; // 线条中点坐标
    originalMapEvent: mapboxgl.MapMouseEvent // 原地图鼠标移动事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on("mousemove", e => {
    console.log(e.type); // 'mouseenter'
    // ...
  });
  ```

### mouseleave

鼠标移出线条时触发，鼠标移出有两种情况，一种是移出当前图层，但鼠标还在地图中；一种是鼠标移出地图导致鼠标离开图层；两种情况都会触发该事件，但第二种不会暴露 originalMapEvent

- callback

  ```ts
  (e: {
    type: 'mouseleave';
    target: this; // 当前AdvanceLineLayer实例
    originalMapEvent?: mapboxgl.MapMouseEvent // 原地图鼠标移出事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on("mouseleave", e => {
    console.log(e.type); // 'mouseleave'
    // ...
  });
  ```

## Demo

绘制线条，配置点击高亮，并且点击后进行定位

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { AdvanceLineLayer } from 'mapbox-utils'
import * as turf from '@turf/turf'
import data from '/data/lineData.json'
let map
let lineLayer
const handleMapLoad = (val) => {
  map = val
  lineLayer = new AdvanceLineLayer({
    key: 'id',
    data,
    layerPool: {
      default: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#ff0000'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlight: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#00ff00'
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      },
      highlightOuter: {
        type: 'line',
        paint: {
          'line-width': 16,
          'line-color': '#00ff00',
          'line-opacity': 0.4
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'click',
    highlightLayers: ['highlightOuter', 'highlight'],
    fitBoundsOptions: {
      padding: 20
    }
  })
  lineLayer.addTo(map)
  lineLayer.on('click', (e) => {
    lineLayer.easeTo(e.data.id)
  })
}
onBeforeUnmount(() => {
  lineLayer?.remove()
})
</script>

::: details 点击查看代码

```js
const lineLayer = new AdvanceLineLayer({
  key: "id",
  data,
  layerPool: {
    default: {
      type: "line",
      paint: {
        "line-width": 4,
        "line-color": "#ff0000",
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
    },
    highlight: {
      type: "line",
      paint: {
        "line-width": 4,
        "line-color": "#00ff00",
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
    },
    highlightOuter: {
      type: "line",
      paint: {
        "line-width": 16,
        "line-color": "#00ff00",
        "line-opacity": 0.4,
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
    },
  },
  layers: ["default"],
  highlightTrigger: "click",
  highlightLayers: ["highlightOuter", "highlight"],
  fitBoundsOptions: {
    padding: 20,
  },
});
lineLayer.addTo(map);
lineLayer.on("click", e => {
  lineLayer.easeTo(e.data.id);
});
```

:::
