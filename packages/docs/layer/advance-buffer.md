### 高级缓冲区(AdvanceBuffer)

使用`AdvanceBuffer`可在地图上绘制基于点、线、多边形的缓冲区

::: warning 建议
该组件已包含`BufferLayer`所能实现的所有功能，且更加灵活，提供更多的配置项支持。推荐使用该组件。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { AdvanceBuffer } from 'mapbox-utils'
// 2. 创建AdvanceBuffer实例
const advanceBuffer = new AdvanceBuffer(options)
// 3. 添加到地图
advanceBuffer.addTo(map) // map为MapBox地图实例
// 4. 开始绘制多边形
advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POINT)
```

## Options

创建`AdvanceBuffer`实例时需要传入的参数对象，可选，配置如下：

| 属性名 | 描述 |
| :-------------------: | :-------------------: |
| **multiple** | 可选，是否保存多个缓冲区，默认为`false` |
| **layers** | 可选，地图上顶点、线、多边形、缓冲区图层样式配置，可基于默认配置进行修改，[查看默认配置](#layers) |
| **radius** | 可选，缓冲区半径，默认`100`，配合 `units` 使用 |
| **units** | 可选，缓冲区半径单位，可选`meters`、`kilometers`，默认为`kilometers` |
| **steps** | 可选，缓冲区边数系数，数值越大，缓冲区越接近圆， 默认为`16` |

### layers {#layers}

::: details 查看默认配置

```js
[
  // 缓冲区填充
  {
    id: "mapbox-utils-advance-buffer-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"], ["==", "origin", "buffer"]],
    paint: {
      "fill-color": "#44cef6",
      "fill-opacity": 0.3,
    },
  },
  // 缓冲区描边
  {
    id: "mapbox-utils-advance-buffer-border",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "origin", "buffer"]],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 多边形填充
  {
    id: "mapbox-utils-advance-buffer-polygon-fill-inactive",
    type: "fill",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "origin", "polygon"],
      ["==", "$type", "Polygon"],
    ],
    paint: {
      "fill-color": "#44cef6",
      "fill-opacity": 0.3,
    },
  },
  // 多边形描边
  {
    id: "mapbox-utils-advance-buffer-polygon-border-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "$type", "LineString"],
      ["==", "active", "false"],
      ["==", "type", "border"],
    ],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 线
  {
    id: "mapbox-utils-advance-buffer-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "$type", "LineString"],
      ["==", "active", "false"],
      ["==", "origin", "line"],
    ],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 线或多边形的顶点，可根据origin:line/polygon进行区分
  {
    id: "mapbox-utils-advance-buffer-vertex-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "type", "vertex"],
    ],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 3,
      "circle-stroke-color": "#44cef6",
      "circle-stroke-width": 2,
    },
  },
  // 点(圆心)
  {
    id: "mapbox-utils-advance-buffer-point",
    type: "circle",
    filter: ["all", ["==", "origin", "point"], ["==", "$type", "Point"]],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 3,
      "circle-stroke-color": "#44cef6",
      "circle-stroke-width": 2,
    },
  },
  // 多边形填充（绘制时）
  {
    id: "mapbox-utils-advance-buffer-polygon-fill-active",
    type: "fill",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#44cef6",
      "fill-opacity": 0.4,
    },
  },
  // 多边形描边（绘制时）
  {
    id: "mapbox-utils-advance-buffer-polygon-border-active",
    type: "line",
    filter: [
      "all",
      ["==", "$type", "LineString"],
      ["==", "active", "true"],
      ["==", "type", "border"],
    ],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 线（绘制时）
  {
    id: "mapbox-utils-advance-buffer-line-active",
    type: "line",
    filter: [
      "all",
      ["==", "$type", "LineString"],
      ["==", "active", "true"],
      ["==", "origin", "line"],
    ],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 线或多边形的顶点（绘制时），可根据origin:line/polygon进行区分
  {
    id: "mapbox-utils-advance-buffer-vertex-active",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "true"],
      ["==", "$type", "Point"],
      ["==", "type", "vertex"],
    ],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 3,
      "circle-stroke-color": "#44cef6",
      "circle-stroke-width": 2,
    },
  },
];
```

:::

### addTo()

将绘制工具添加到地图上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const advanceBuffer = new AdvanceBuffer(options);
  advanceBuffer.addTo(map);
  ```

### remove()

将绘制工具从地图上移除

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  advanceBuffer.remove();
  ```

### changeMode()

切换绘制模式，共有以下几种模式供选择

- `AdvanceBuffer.MODE_TYPE.NONE` 默认模式，不进行任何绘制

- `AdvanceBuffer.MODE_TYPE.POINT` 绘制基于点的缓冲区

- `AdvanceBuffer.MODE_TYPE.LINE` 绘制基于线的缓冲区

- `AdvanceBuffer.MODE_TYPE.POLYGON` 绘制基于多边形的缓冲区

- `AdvanceBuffer.MODE_TYPE.RECT` 绘制基于矩形的缓冲区

- 类型

  ```ts
  function(mode: ModeType): this
  ```

- 示例

  ```ts
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POINT);
  ```

### clear()

清除所有绘制的缓冲区

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  advanceBuffer.clear();
  ```

### add()

添加基于给定 geojson 数据的缓冲区

- 类型

  ```ts
  type FeatureType = GeoJSON.Feature<
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | GeoJSON.LineString
    | GeoJSON.MultiLineString
    | GeoJSON.Point
    | GeoJSON.MultiPoint
  >;
  function(feature: FeatureType): {
    id: string;
    bufferFeature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    feature: FeatureType
  }
  ```

- 示例

  ```ts
  advanceBuffer.add(geojson);
  ```

### deleteById()

根据传入的 id 删除对应的缓冲区和基础图形

- 类型

  ```ts
  function(id: string): this
  ```

- 示例

  ```ts
  advanceBuffer.deleteById("id");
  ```

### getAll()

获取所有缓冲区及基础图形

- 类型

  ```ts
  function(): Array<{
    id: string;
    bufferFeature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    feature: FeatureType;
  }>
  ```

- 示例

  ```ts
  advanceBuffer.getAll();
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
  advanceBuffer.on("add", e => {
    console.log(e);
  });
  ```

## 事件

### add

绘制完成时触发，返回缓冲区及基础图形数据

- callback

  ```ts
  (e: {
    type: 'add';
    target: this; // 当前AdvanceBuffer实例
    data: {
      id: string;
      bufferFeature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
      feature: FeatureType;
    }
  }) => void
  ```

- 示例

  ```ts
  advanceBuffer.on("add", e => {
    console.log(e.data);
    // ...
  });
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { AdvanceBuffer } from 'mapbox-utils'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let advanceBuffer
const handleMapLoad = (val) => {
  map = val
  advanceBuffer = new AdvanceBuffer()
  advanceBuffer.addTo(map)
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POINT);
  advanceBuffer.on('add', (e) => {
    ElMessage.success(`绘制完成`);
    console.log(e.data)
  })
}
onBeforeUnmount(() => {
  advanceBuffer?.remove()
})
</script>

::: details 点击查看代码

```js
advanceBuffer = new AdvanceBuffer();
advanceBuffer.addTo(map);
advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POINT);
advanceBuffer.on("add", e => {
  console.log(e.data);
});
```

:::
