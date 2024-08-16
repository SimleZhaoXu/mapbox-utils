# 绘制工具(DrawUtil)

在地图上绘制点、线、多边形、矩形、圆形等几何图形。

## 基础用法

```js{2,4}
// 1. 导入
import { DrawUtil } from 'mapbox-postting'
// 2. 创建DrawUtil实例
const drawUtil = new DrawUtil(options)
// 3. 添加到地图
drawUtil.addTo(map) // map为MapBox地图实例
// 4. 开始绘制多边形
drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON)
```

## Options

创建`DrawUtil`实例时需要传入的参数对象，可选，配置如下：
| 属性名 | 描述 |
| :-------------------: | :-------------------: |
| **multiple** | 可选，是否保存多次绘制结果，默认为`false` |
| **layers** | 可选，绘制时地图上顶点、线、多边形填充、多边形描边图层样式配置，[查看默认配置](#layers) |

### layers {#layers}

::: details 查看默认配置

```js
[
  // 多边形填充
  {
    id: "mapbox-postting-draw-util-fill-inactive",
    type: "fill",
    filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#44cef6",
      "fill-opacity": 0.3,
    },
  },
  // 多边形描边
  {
    id: "mapbox-postting-draw-util-border-inactive",
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
    id: "mapbox-postting-draw-util-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "$type", "LineString"],
      ["==", "active", "false"],
      ["==", "type", "line"],
    ],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 点
  {
    id: "mapbox-postting-draw-util-point-active",
    type: "circle",
    filter: ["all", ["==", "type", "point"], ["==", "$type", "Point"]],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 3,
      "circle-stroke-color": "#44cef6",
      "circle-stroke-width": 2,
    },
  },
  // 绘制中多边形填充
  {
    id: "mapbox-postting-draw-util-fill-active",
    type: "fill",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#44cef6",
      "fill-opacity": 0.4,
    },
  },
  // 绘制中多边形描边
  {
    id: "mapbox-postting-draw-util-border-active",
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
  // 绘制中线
  {
    id: "mapbox-postting-draw-util-line-active",
    type: "line",
    filter: [
      "all",
      ["==", "$type", "LineString"],
      ["==", "active", "true"],
      ["==", "type", "line"],
    ],
    paint: {
      "line-color": "#44cef6",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  // 绘制中顶点
  {
    id: "mapbox-postting-draw-util-vertex-active",
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
  // 绘制中圆心
  {
    id: "mapbox-postting-draw-util-circle-center-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "active", "true"],
      ["==", "type", "circle-center"],
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

## API

### addTo()

将绘制工具添加到地图上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const drawUtil = new DrawUtil(options);
  drawUtil.addTo(map);
  ```

### remove()

将绘制工具从地图上移除

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  drawUtil.remove();
  ```

### changeMode()

切换绘制模式，共有以下几种模式供选择

- `DrawUtil.MODE_TYPE.NONE` 默认模式，不进行任何绘制

- `DrawUtil.MODE_TYPE.DRAW_POINT` 绘制点

- `DrawUtil.MODE_TYPE.DRAW_LINE` 绘制线

- `DrawUtil.MODE_TYPE.DRAW_POLYGON` 绘制多边形

- `DrawUtil.MODE_TYPE.DRAW_RECT` 绘制矩形

- `DrawUtil.MODE_TYPE.DRAW_CIRCLE` 绘制圆形

- 类型

  ```ts
  function(mode: ModeType): this
  ```

- 示例

  ```ts
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON);
  ```

### clear()

清除所有绘制的几何图形

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  drawUtil.clear();
  ```

### add()

根据提供geojson数据添加几何图形，添加成功则返回几何图形的id，调用该方法添加的几何图形不会触发`add`事件

- 类型

  ```ts
  function(geojson: GeoJSON.Feature<
      | GeoJSON.Polygon
      | GeoJSON.MultiPolygon
      | GeoJSON.LineString
      | GeoJSON.MultiLineString
      | GeoJSON.Point
      | GeoJSON.MultiPoint
    >, isCircle = false): null | string
  ```

- 示例

  ```ts
  drawUtil.add(geojson);
  ```


### deleteById()

根据传入的 id 删除对应的几何图形

- 类型

  ```ts
  function(id: string): this
  ```

- 示例

  ```ts
  drawUtil.deleteById("id");
  ```

### getAll()

获取所有已绘制的几何图形数据

- 类型

  ```ts
  function(): Array<{
    id: string;
    feature: | GeoJSON.Feature<GeoJSON.Point>
    | GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  }>
  ```

- 示例

  ```ts
  drawUtil.getAll();
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
  drawUtil.on("add", e => {
    console.log(e);
  });
  ```

## 事件

### add

绘制完成时触发，返回绘制几何图形的 id 以及 GeoJSON 数据

- callback

  ```ts
  (e: {
    type: 'add';
    target: this; // 当前DrawUtil实例
    data: {
      id: string;
      feature: GeoJSON.Feature;
    }
  }) => void
  ```

- 示例

  ```ts
  drawUtil.on("add", e => {
    console.log(e.data);
    // ...
  });
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { DrawUtil } from 'mapbox-postting'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let drawUtil
const handleMapLoad = (val) => {
  map = val
  drawUtil = new DrawUtil()
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON);
  drawUtil.on('add', (e) => {
    ElMessage.success(`绘制完成`);
    console.log(e.data)
  })
}
onBeforeUnmount(() => {
  drawUtil?.remove()
})
</script>

::: details 点击查看代码

```js
const drawUtil = new DrawUtil();
drawUtil.addTo(map);
drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON);
drawUtil.on("add", e => {
  console.log(e.feature);
});
```

:::
