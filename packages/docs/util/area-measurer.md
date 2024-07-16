# 测面积(AreaMeasurer)

在地图上进行距离测量

## 基础用法

```js{2,4}
// 1. 导入
import { AreaMeasurer } from 'mapbox-utils'
// 2. 创建AreaMeasurer实例
const areaMeasurer = new AreaMeasurer(options)
// 3. 添加到地图
AreaMeasurer.addTo(map) // map为MapBox地图实例
// 4. 开启测面积
AreaMeasurer.enable()
```

## Options

创建`AreaMeasurer`实例时需要传入的参数对象，可选，配置如下：
| 属性名 | 描述 |
| :-------------------: | :-------------------: |
| **multiple** | 可选，是否显示多次测量结果，默认为`false` |
| **layers** | 可选，测量时地图上顶点、描边、填充图层样式配置，[查看默认配置](#layers) |

### layers {#layers}

layers 中包含四种图层配置，测量过程中的顶点、描边、填充；测量完成后的顶点、描边、填充。通过`filter`： `['==', 'active', 'true']` 和 `['==', 'active', 'false']` 进行区分。
::: details 查看默认配置

```js
[
  {
    // 测量完成后的区域填充
    id: 'mapbox-utils-area-measurer-fill-inactive',
    type: 'fill',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': 'rgb(255, 77, 79)',
      'fill-opacity': 0.3
    }
  },
  {
    // 测量完成后的区域描边
    id: 'mapbox-utils-area-measurer-line-inactive',
    type: 'line',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString']],
    paint: {
      'line-color': 'rgb(255, 77, 79)',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  {
    // 测量完成后的区域顶点
    id: 'mapbox-utils-area-measurer-vertex-inactive',
    type: 'circle',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': 'rgb(255, 77, 79)',
      'circle-stroke-width': 2
    }
  },
  {
    // 测量过程中的区域填充
    id: 'mapbox-utils-area-measurer-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': 'rgb(255, 77, 79)',
      'fill-opacity': 0.4
    }
  },
  {
    // 测量过程中的区域描边
    id: 'mapbox-utils-area-measurer-line-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'LineString']],
    paint: {
      'line-color': 'rgb(255, 77, 79)',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  {
    // 测量过程中的区域顶点
    id: 'mapbox-utils-area-measurer-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': 'rgb(255, 77, 79)',
      'circle-stroke-width': 2
    }
  }
]
```

:::

## API

### addTo()

将测面积工具添加到地图上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const areaMeasurer = new AreaMeasurer(options);
  areaMeasurer.addTo(map);
  ```

### remove()

将测面积工具从地图上移除

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  areaMeasurer.remove();
  ```

### enable()

开启测面积功能，在添加到地图后才能生效

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  areaMeasurer.enable();
  ```

### disable()

禁用测面积功能，但会保存已完成测量的数据

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  areaMeasurer.disable();
  ```

### clear()

清除正在测量以及已测量的数据

- 类型

  ```ts
  function(): void
  ```

- 示例

  ```ts
  areaMeasurer.clear();
  ```

### getAllArea()

获取已完成量的所有数据

- 类型

  ```ts
  function(): Array<{
    areaId: string; // 测量区域id
    acreage: number; // 测量区域面积
    areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> // 测量区域GeoJSON数据
  }>
  ```

- 示例

  ```ts
  areaMeasurer.getAllArea();
  ```

### getAreaById()

根据 id 获取指定测量区域的数据

- 类型

  ```ts
  function(pathId: string): {
    areaId: string; // 测量区域id
    acreage: number; // 测量区域面积 单位：平方米
    areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> // 测量区域GeoJSON数据
  } ｜ null
  ```

- 示例

  ```ts
  areaMeasurer.getAreaById("1");
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
  areaMeasurer.on("complete", e => {
    console.log(e.type); // 'complete'
  });
  ```

## 事件

### complete

完成一次完整测量后触发，返回当前完成测量区域的数据

- callback

  ```ts
  (e: {
    type: 'complete';
    target: this; // 当前AreaMeasurer实例
    areaId: string; // 测量区域id
    acreage: number; // 测量区域面积 单位：平方米
    areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> // 测量区域GeoJSON数据
  }) => void
  ```

- 示例

  ```ts
  areaMeasurer.on("complete", e => {
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
    target: this; // 当前AreaMeasurer实例
    areaId: string
  }) => void
  ```

- 示例

  ```ts
  areaMeasurer.on("delete", e => {
    console.log(e.type); // 'delete'
    // ...
  });
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { AreaMeasurer } from 'mapbox-utils'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let areaMeasurer
const handleMapLoad = (val) => {
  map = val
  areaMeasurer = new AreaMeasurer()
  areaMeasurer.addTo(map)
  areaMeasurer.enable()
  areaMeasurer.on('complete', (e) => {
    ElMessage.success(`测量完成，面积：${e.acreage}平方米`)
  })

  areaMeasurer.on('delete', (e) => {
    ElMessage.success(`删除成功，areaId：${e.areaId}`)
  })
}
onBeforeUnmount(() => {
  areaMeasurer?.remove()
})
</script>

::: details 点击查看代码

```js
const areaMeasurer = new AreaMeasurer()
areaMeasurer.addTo(map)
  areaMeasurer.enable()
  areaMeasurer.on('complete', (e) => {
    ElMessage.success(`测量完成，面积：${e.acreage}平方米`)
  })

  areaMeasurer.on('delete', (e) => {
    ElMessage.success(`删除成功，areaId：${e.areaId}`)
  })
```

:::
