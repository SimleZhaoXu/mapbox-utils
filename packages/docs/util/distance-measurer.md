# 测距(DistanceMeasurer)

在地图上进行距离测量

## 基础用法

```js{2,4}
// 1. 导入
import { DistanceMeasurer } from 'mapbox-postting'
// 2. 创建DistanceMeasurer实例
const distanceMeasurer = new DistanceMeasurer(options)
// 3. 添加到地图
distanceMeasurer.addTo(map) // map为MapBox地图实例
// 4. 开启测距
distanceMeasurer.enable()
```

## Options

创建`DistanceMeasurer`实例时需要传入的参数对象，可选，配置如下：
| 属性名 | 描述 |
| :-------------------: | :-------------------: |
| **multiple** | 可选，是否显示多次测量结果，默认为`false` |
| **layers** | 可选，测量时地图上点、线图层样式配置，[查看默认配置](#layers) |

### layers {#layers}

layers 中包含四种图层配置，测量过程中的点、线；测量完成后的点、线。通过`filter`： `['==', 'active', 'true']` 和 `['==', 'active', 'false']` 进行区分。
::: details 查看默认配置

```js
[
  {
    // 测量完成后的线
    id: "mapbox-postting-distance-measure-line-inactive",
    type: "line",
    filter: ["all", ["==", "active", "false"], ["==", "$type", "LineString"]],
    paint: {
      "line-color": "rgb(255, 77, 79)",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  {
    // 测量完成后的点
    id: "mapbox-postting-distance-measure-vertex-inactive",
    type: "circle",
    filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"]],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 3,
      "circle-stroke-color": "rgb(255, 77, 79)",
      "circle-stroke-width": 2,
    },
  },
  {
    // 测量过程中的线
    id: "mapbox-postting-distance-measure-line-active",
    type: "line",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "LineString"]],
    paint: {
      "line-color": "rgb(255, 77, 79)",
      "line-opacity": 0.8,
      "line-width": 2,
    },
  },
  {
    // 测量过程中的点
    id: "mapbox-postting-distance-measure-vertex-active",
    type: "circle",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Point"]],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 3,
      "circle-stroke-color": "rgb(255, 77, 79)",
      "circle-stroke-width": 2,
    },
  },
];
```

:::

## API

### addTo()

将测距工具添加到地图上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const distanceMeasurer = new DistanceMeasurer(options);
  distanceMeasurer.addTo(map);
  ```

### remove()

将测距工具从地图上移除

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  distanceMeasurer.remove();
  ```

### enable()

开启测距功能，在添加到地图后才能生效

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  distanceMeasurer.enable();
  ```

### disable()

禁用测距功能，但会保存已完成测量的数据

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  distanceMeasurer.disable();
  ```

### clear()

清除正在测量以及已测量的数据

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  distanceMeasurer.clear();
  ```

### getAllPath()

获取已完成测距的所有数据

- 类型

  ```ts
  function(): Array<{
    pathId: string; // 测量路径id
    length: number; // 测量路径长度，单位：千米
    pathData: GeoJSON.Feature<GeoJSON.LineString> // 测量路径的GeoJSON数据
  }>
  ```

- 示例

  ```ts
  distanceMeasurer.getAllPath();
  ```

### getPathById()

根据 id 获取指定测量路径的数据

- 类型

  ```ts
  function(pathId: string): {
    pathId: string; // 测量路径id
    length: number; // 测量路径长度，单位：千米
    pathData: GeoJSON.Feature<GeoJSON.LineString> // 测量路径的GeoJSON数据
  } ｜ null
  ```

- 示例

  ```ts
  distanceMeasurer.getPathById("1");
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
  distanceMeasurer.on("complete", e => {
    console.log(e.type); // 'complete'
  });
  ```

## 事件

### complete

完成一次完整测距后触发，返回当前完成测距路径的数据

- callback

  ```ts
  (e: {
    type: 'complete';
    target: this; // 当前DistanceMeasurer实例
    pathId: string;
    length: number; //单位：千米
    pathData: GeoJSON.Feature<GeoJSON.LineString>
  }) => void
  ```

- 示例

  ```ts
  distanceMeasurer.on("complete", e => {
    console.log(e.type); // 'complete'
    // ...
  });
  ```

### delete

删除一次测量结果后触发，返回删除的测量路径 id

- callback

  ```ts
  (e: {
    type: 'delete';
    target: this; // 当前DistanceMeasurer实例
    pathId: string
  }) => void
  ```

- 示例

  ```ts
  distanceMeasurer.on("delete", e => {
    console.log(e.type); // 'delete'
    // ...
  });
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { DistanceMeasurer } from 'mapbox-postting'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let distanceMeasurer
const handleMapLoad = (val) => {
  map = val
  distanceMeasurer = new DistanceMeasurer()
  distanceMeasurer.addTo(map)
  distanceMeasurer.enable()
  distanceMeasurer.on('complete', (e) => {
    ElMessage.success(`测量完成，长度：${e.length}千米`)
  })

  distanceMeasurer.on('delete', (e) => {
    ElMessage.success(`删除成功，pathId：${e.pathId}`)
  })
}
onBeforeUnmount(() => {
  distanceMeasurer?.remove()
})
</script>

::: details 点击查看代码

```js
const distanceMeasurer = new DistanceMeasurer();
distanceMeasurer.addTo(map);
distanceMeasurer.enable();
distanceMeasurer.on("complete", e => {
  ElMessage.success(`测量完成，长度：${e.length}千米`);
});

distanceMeasurer.on("delete", e => {
  ElMessage.success(`删除成功，pathId：${e.pathId}`);
});
```

:::
