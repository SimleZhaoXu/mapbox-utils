### 高级轨迹回放(AdvanceCarTrack)

使用`AdvanceCarTrack`可在地图上展示轨迹数据，并进行播放

::: warning 建议
该组件已包含`CarTrack`所能实现的所有功能，且更加灵活，提供更多的配置项支持。推荐使用该组件。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { AdvanceCarTrack } from 'mapbox-postting'
// 2. 创建AdvanceCarTrack实例
const carTrack = new AdvanceCarTrack(options)
// 3. 添加到地图
carTrack.addTo(map) // map为MapBox地图实例
// 4. 播放轨迹
carTrack.play()
```

## Options

创建`AdvanceCarTrack`实例时需要传入的参数对象，配置如下：

|        属性名         |                                                                                                 描述                                                                                                 |
| :-------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|       **data**        |                                                 轨迹数据，可选，包含坐标点及对应事件戳 `Array<{coordinates: [number, number]; timestamp?: number}>`                                                  |
|       **speed**       |            轨迹播放速度系数，默认为 `1`，`播放速度` = `实际速度` \* `速度系数`；实际速度单位为`m/s`。若数据中提供`timestamp`数据，则会根据其计算实际速度，若未提供则固定实际速度为`1m/s`;            |
|       **loop**        |                                                                                可选，是否开启循环播放，默认为`false`                                                                                 |
|     **layerPool**     |                           预设的图层配置，点击查看[layerPool](#layerPool)具体配置，其中的键名可在`currentPathLayers`，`fullPathLayers`，`carLayers`，`nodeLayers`中引用。                            |
|  **fullPathLayers**   |                                                    由 layerPool 中的键名组成的数组，表示完整路径的线条样式，可以通过配置多个来实现复杂的路径效果                                                     |
| **currentPathLayers** |                                              由 layerPool 中的键名组成的数组，表示轨迹播放时已通过路径的线条样式，可以通过配置多个来实现复杂的路径效果                                               |
|     **carLayers**     |                                                   由 layerPool 中的键名组成的数组，表示轨迹播放时小车的轨迹样式，可以通过配置多个来实现复杂的效果                                                    |
|    **nodeLayers**     |                                               由 layerPool 中的键名组成的数组，表示组成轨迹的坐标点样式，可以通过[内置属性](#nodeLayers)实现复杂的效果                                               |
| **fitBoundsOptions**  | 可选，在轨迹添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有轨迹展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)。 |

### layerPool {#layerPool}

预设的图层配置池，数据类型如下，点击查看[mapboxgl.CircleLayer](../base/style/layers.md#circle)、[mapboxgl.SymbolLayer](../base/style/layers.md#symbol)[mapboxgl.LineLayer](../base/style/layers.md#line)

```ts
type OmitProperty = "source" | "source-layer" | "id" ｜ "filter";
type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.SymbolLayer, OmitProperty>
  | Omit<mapboxgl.LineLayer, OmitProperty>;
type LayerPool = {
  [k: string]: LayerType;
};
```

### nodeLayers 的内置属性 {#nodeLayers}

为了实现复杂的轨迹回放效果，对轨迹坐标点数据内置了一下属性：

- `nodeType`: 表示坐标点的属性，值为： `start`：表示轨迹的起点；`end`：表示轨迹的终点；`common`：表示轨迹中除起点和终点的其他点

- `nodeState`: 表示在轨迹播放时该坐标点是否已经过，值为： `0`：表示坐标点未经过；`1`：表示坐标点已经过

这些属性可在配置 nodeLayers 图层中配合 mapboxgl 提供的属性表达式来实现复杂效果。

## API

### addTo()

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const carTrack = new AdvanceCarTrack(options);
  carTrack.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  carTrack.remove();
  ```

### setData()

设置轨迹数据，可设置为`null`，表示清空轨迹数据。

- 类型

  ```ts
  function(data: Array<coordinates: [number, number]; timestamp: number> | null): this
  ```

- 示例

  ```ts
  carTrack.setData([
    {
      coordinates: [105.51039797147422, 30.530612818584558],
      timestamp: 1699581471898,
    },
    {
      coordinates: [105.51270357696797, 30.531088481760918],
      timestamp: 1699581501898,
    },
    {
      coordinates: [105.51416609295512, 30.5314341424657],
      timestamp: 1699581531898,
    },
    // ...
  ]);
  ```

### play()

开始轨迹播放

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  carTrack.play();
  ```

### pause()

暂停轨迹播放

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  carTrack.pause();
  ```

### stop()

停止轨迹播放，回到初始位置

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  carTrack.stop();
  ```

### setSpeed()

设置轨迹播放的速度系数，可在播放中设置，调用后立即生效

- 类型

  ```ts
  function(speed: number): this
  ```

- 示例

  ```ts
  carTrack.setSpeed(20);
  ```

### setTimestamp()

设置轨迹播放的时间戳，只有在轨迹数据中提供 timestamp 才会生效，调用后轨迹移动到对应时间戳的位置，播放会暂停，需要再调用`play`方法继续播放

- 类型

  ```ts
  function(timestamp: number): this
  ```

- 示例

  ```ts
  carTrack.setTimestamp(1699581501898);
  ```

### fitBounds

调用该方法将所有轨迹数据集中到视口

- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```

- 示例

  ```ts
  carTrack.fitBounds();
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
  carTrack.on("moving", e => {
    console.log(e.type); // 'moving'
  });
  ```

## 事件

### moving

轨迹播放刷新时触发的事件，会返回轨迹到当前位置的时间戳，如果轨迹数据中为提供时间戳，则这里返回的时间戳不是真实时间戳。

- callback

  ```ts
  (e: {
    type: 'moving';
    target: this; // 当前AdvanceCarTrack实例
    timestamp: number // 轨迹当前事件戳
  }) => void
  ```

- 示例

  ```ts
  carTrack.on("moving", e => {
    console.log(e.type); // 'moving'
    // ...
  });
  ```

### complete

轨迹完成播放后触发的事件

- callback

  ```ts
  (e: {
    type: 'complete';
    target: this; // 当前AdvanceCarTrack实例
  }) => void
  ```

- 示例

  ```ts
  carTrack.on("complete", e => {
    console.log(e.type); // 'complete'
    // ...
  });
  ```

  ## Demo

  <div>
    <MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad" />
    <div class="button-wrapper">
      <div class="button" @click="play">播放</div>
      <div class="button" @click="pause">暂停</div>
      <div class="button" @click="stop">停止</div>
      <div class="button" @click="fitBounds">fitBounds</div>
    </div>
  </div>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { AdvanceCarTrack } from 'mapbox-postting'
import data from '/data/trackData1.json'
let map
let track
const handleMapLoad = (val) => {
  map = val
  track = new AdvanceCarTrack({
    data,
    layerPool: {
      fullPath: {
        type: 'line',
        paint: {
          'line-color': '#0f0',
          'line-width': 3
        }
      },
      currentPath: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 3
        }
      },
      circleCar: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 3,
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2
        }
      }
    },
    fullPathLayers: ['fullPath'],
    currentPathLayers: ['currentPath'],
    carLayers: ['circleCar'],
    speed: 100,
    fitBoundsOptions: {
      padding: 40
    }
  })
  track.addTo(map)
}

const play = () => {
  track?.play()
}
const pause = () => {
  track?.pause()
}
const stop = () => {
  track?.stop()
}

const fitBounds = () => {
  track?.fitBounds()
}

onBeforeUnmount(() => {
  track?.remove()
})
</script>

::: details 点击查看代码

```js
track = new AdvanceCarTrack({
  data,
  layerPool: {
    fullPath: {
      type: "line",
      paint: {
        "line-color": "#0f0",
        "line-width": 3,
      },
    },
    currentPath: {
      type: "line",
      paint: {
        "line-color": "#f00",
        "line-width": 3,
      },
    },
    circleCar: {
      type: "circle",
      paint: {
        "circle-color": "#f00",
        "circle-radius": 3,
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 2,
      },
    },
  },
  fullPathLayers: ["fullPath"],
  currentPathLayers: ["currentPath"],
  carLayers: ["circleCar"],
  speed: 100,
  fitBoundsOptions: {
    padding: 40,
  },
});
track.addTo(map);

const play = () => {
  track?.play();
};
const pause = () => {
  track?.pause();
};
const stop = () => {
  track?.stop();
};

const fitBounds = () => {
  track?.fitBounds();
};
```

:::

<style lang="scss" scoped>
.button-wrapper {
  margin-top: 10px;
  display: flex;
  .button {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    text-align: center;
    display: inline-block;
    padding: 0 10px;
    border: 1px solid #aaa;
    border-radius: 3px;
    &:hover {
      background: #eee;
    }
    &:not(:first-of-type) {
      margin-left: 10px;
    }
  }
}
</style>
