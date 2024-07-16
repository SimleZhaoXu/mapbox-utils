# 缓冲区图层(BufferLayer)

通过`BufferLayer`可以在地图上绘制缓冲区

## 基础用法

```js{2,4}
// 1. 导入
import { BufferLayer } from 'mapbox-utils'
// 2. 创建BufferLayer实例
const bufferLayer = new BufferLayer(options)
// 2. 添加到地图
bufferLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`BufferLayer`实例时需要传入的参数对象，包含以下几个部分：

- **center：** 可选，缓冲区中心，经纬度坐标

- **radius：** 可选，缓冲区半径，默认为`5`

- **units：** 可选，缓冲区半径长度单位，可选 `meters`、`kilometers`, 默认为`kilometers`

- **steps：** 可选，缓冲区多边形边数量。最小为`3`，值越大，则越接近圆，默认为`64`

- **manual：** 可选，是否开启手动选择缓冲区中心，生成缓冲区模式，默认为`false`

- **style：** 缓冲区样式，配置如下

  |        属性名        | 描述                                                          |
  | :------------------: | :------------------------------------------------------------ |
  |    **fill-color**    | 缓冲区填充颜色（可选，默认值为`#000000`）                     |
  |   **fill-opacity**   | 缓冲区填充不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）     |
  |   **stroke-width**   | 缓冲区描边宽度（可选，值 >= 0，默认值为`1`，单位：像素）      |
  |   **stroke-color**   | 缓冲区描边颜色（可选，默认值为`#000000`）                     |
  |  **stroke-opacity**  | 缓冲区描边不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）     |
  | **stroke-dasharray** | 缓冲区描边虚线：虚线的线与间隔的长度（可选，默认值为 [1, 0]） |

- **centerLayer：** 可选，缓冲区中心的图层配置，包含以下选项

  - **show**：是否显示缓冲区中心，默认为 true

  - **type**：可选，默认为`circle`，值为`circle`时，中心为圆点样式，可在 style 中配置，值为`symbol`时，中心为图标样式，可在 style 中配置

  - **style**：缓冲区中心样式，

    当`type`为`circle`时，[点此](../style/index.md#circle基础样式属性)查看完整属性

    当`type`为`symbol`时，[点此](../style/index.md#symbol基础样式属性)查看完整属性

## API

### addTo()

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const bufferLayer = new BufferLayer(options);
  bufferLayer.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  bufferLayer.remove();
  ```

### clear()

清除绘制的缓冲区

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  bufferLayer.clear();
  ```

### getData()

获取缓冲区多边形

- 类型

  ```ts
  function(): null | GeoJson.FeatureCollection<GeoJson.Polygon>
  ```

- 示例

  ```ts
  bufferLayer.getData();
  ```

### setOptions()

修改缓冲区参数，可修改项包括缓冲区中心(center)、缓冲区半径(radius)、缓冲区半径长度单位(units)、缓冲区多边形边数(steps)

- 类型

  ```ts
  function(options: {
    center?: number[]
    radius?: number
    units?: Units
    steps?: number
  }): this
  ```

- 示例

  ```ts
  bufferLayer.setOptions({ radius: 10 });
  ```

### on

注册事件监听器

- 类型

  ```ts
  interface Event<T> {
    type: string
    target: T
  }

  interface ChangeEvent<T> extends Event<T> {
    center: mapboxgl.LngLat;
    radius: number;
    units: 'meters' | 'kilometers';
    buffer: GeoJSON.Feature<GeoJSON.Polygon>
  }

  interface EventType<T> {
    change: ChangeEvent<T>
  }

  function<T extends keyof EventType<this>>(
    type: T,
    listener: (ev: EventType<this>[T]) => void
  ): this
  ```

- 示例

  ```ts
  bufferLayer.on("change", e => {
    // ...
  });
  ```

## 事件

### change

手动选取缓冲区中心修改缓冲区触发的事件

- callback

  ```ts
  (e: {
    type: 'change';
    target: this; // 当前BufferLayer实例
    center: mapboxgl.LngLat;
    radius: number;
    units: 'meters' | 'kilometers';
    buffer: GeoJSON.Feature<GeoJSON.Polygon>
  }) => void
  ```

- 示例

  ```ts
  pointLayer.on("change", e => {
    console.log(e.center); // 获取缓冲区中心
    // ...
  });
  ```

## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { BufferLayer } from 'mapbox-utils'
let map
let bufferLayer
const handleMapLoad = (val) => {
  map = val
  bufferLayer = new BufferLayer({
    manual: true,
    style: {
      'stroke-color': '#177cb0',
      'stroke-width': 2,
      'fill-opacity': 0.2,
      'fill-color': '#44cef6'
    },
    centerLayer: {
      show: true,
      type: 'circle',
      style: {
        'circle-color': '#0f0',
        'circle-radius': 5,
        'circle-opacity': 0.5
      }
    }
  })
  bufferLayer.addTo(map)
}
onBeforeUnmount(() => {
  bufferLayer?.remove()
})
</script>

::: details 点击查看代码

```js
bufferLayer = new BufferLayer({
  manual: true,
  style: {
    "stroke-color": "#177cb0",
    "stroke-width": 2,
    "fill-opacity": 0.2,
    "fill-color": "#44cef6",
  },
  centerLayer: {
    show: true,
    type: 'circle',
    style: {
      'circle-color': '#0f0',
      'circle-radius': 5,
      'circle-opacity': 0.5
    }
  }
})
bufferLayer.addTo(map)
```

:::
