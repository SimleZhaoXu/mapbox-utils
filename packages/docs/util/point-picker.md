# 坐标选取(PointPicker)

用来在地图上标记点位并获取坐标

## 基础用法

```js{2,4}
// 1. 导入
import { PointPicker } from 'mapbox-postting'
// 2. 创建PointPicker实例
const pointPicker = new PointPicker(options)
// 3. 添加到地图
pointPicker.addTo(map) // map为MapBox地图实例
```

## Options

创建`PointPicker`实例时需要传入的参数对象，包含以下几个部分：

- **multiple**：可选，是否可以同时选择多个点位，默认为`false`

- **removeOnClick**：可选，是否删除被点击的点位，默认为`false`

- **markerOptions**：可选，点位的 Marker 配置

  |        属性名         | 描述                                                                                                                                                   |
  | :-------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
  |      **anchor**       | 表示 Marker 相对于坐标的位置，可选：`center`、`top`、`bottom`、`left`、`right`、`top-left`、`top-right`、`bottom-left`、`bottom-right`。默认为`center` |
  |       **color**       | 默认的 Marker 是一个 svg 的图标，可以通过此选项设置其颜色，默认为`#3FB1CE`, 若设置了`element`选项，则 color 无效                                       |
  |      **element**      | Marker 使用的 Dom 元素，默认是浅蓝色的液滴形状的 SVG 标记                                                                                              |
  |  **pitchAlignment**   | 地图倾斜时 Marker 的对齐方式，默认为`auto`。可选：`map`对齐到地图的平面，`viewport：对齐到视口的平面，`auto`：使用**_rotationAlignment_**的值          |
  |     **rotation**      | Marker 的旋转角度， 默认为 0                                                                                                                           |
  | **rotationAlignment** | 地图旋转时 Maker 的对齐方式，默认为`auto`相当于`viewport`，可选：`map`：与地图平面对齐，与地图旋转时的基本方向一致，`viewport`：与屏幕空间对齐         |
  |       **scale**       | 当未设置 element 选项时，用于默认标记的缩放比例，默认为 1，默认比例对应的高度为 41px，宽度为 27px                                                      |

## API

### addTo()

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const pointPicker = new PointPicker(options);
  pointPicker.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  pointPicker.remove();
  ```

### setPoint()

设置点位

- 类型

  ```ts
  function(lngLat: mapboxgl.LngLatLike): this
  ```

- 示例

  ```ts
  pointPicker.setPoint([0, 0]);
  ```

### getPoints()

返回已标记的点位坐标，返回值为点位坐标组成的数组，在单选模式下只有一项

- 类型

  ```ts
  function(): Array<[number, number]>
  ```

- 示例

  ```ts
  pointPicker.getPoints();
  ```

### on

注册事件监听器

- 类型

  ```ts
  interface Event<T> {
    type: string;
    target: T
  }

  interface PointChangeEvent<T> extends Event<T> {
    point: [number, number];
    pointList: Array<[number, number]>
  }

  interface PointClickEvent<T> extends Event<T> {
    point: [number, number]
  }

  interface EventType<T> {
    'get-point': PointChangeEvent<T>
    'click-point': PointClickEvent<T>
    'remove-point': PointChangeEvent<T>
  }

  function<T extends keyof EventType<this>>(
    type: T,
    listener: (ev: EventType<this>[T]) => void
  ): this
  ```

- 示例

  ```ts
  // 当点击地图获取新坐标触发，获取最新坐标
  pointPicker.on('get-point', e => {
    console.log(e.point);
  });
  ```

## 事件

### get-point

选取新坐标时触发，获取新选取的坐标，以及已获取的坐标列表

- callback

  ```ts
  (e: {
    type: 'get-point';
    target: this;
    point: [number, number]; // 当前获取的最新坐标
    pointList: Array<[number, number] // 已获取的坐标列表
  }) => void
  ```

- 示例

  ```js
  pointPicker.on('get-point', e => {
    console.log(e.point);
    console.log(e.pointList);
  });
  ```

### click-point

当点位的 Marker 被点击时触发，获取被点击点位的坐标，当`removeOnClick`为`true`时无法触发该事件

- callback

  ```ts
  (e: {
    type: 'click-point';
    target: this;
    point: [number, number]; // 被点击点位的坐标
  }) => void
  ```

- 示例

  ```js
  pointPicker.on('click-point', e => {
    console.log(e.point);
  });
  ```

### remove-point

当点位被移除时触发(当`removeOnClick`为`true`时，点击点位后移除点位)，获取被移除的点位坐标，以及已获取的坐标列表

- callback

  ```ts
  (e: {
    type: 'remove-point';
    target: this;
    point: [number, number]; // 移除的坐标
    pointList: Array<[number, number] // 已获取的坐标列表
  }) => void
  ```

- 示例

  ```js
  pointPicker.on('remove-point', e => {
    console.log(e.point);
    console.log(e.pointList);
  });
  ```


## Demo

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount, createApp } from 'vue'
import MapView from '/components/map-view.vue'
import { PointPicker } from 'mapbox-postting'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let pointPicker
const handleMapLoad = (val) => {
  map = val
  pointPicker = new PointPicker({
    markerOptions: {
      color: 'red'
    }
  })
  pointPicker.addTo(map)
  pointPicker.on('get-point', (e) => {
    ElMessage.success(`获取坐标：${ e.point }`)
  })
  pointPicker.on('click-point', (e) => {
    ElMessage.success(`点位被点击：${ e.point }`)
  })
}

onBeforeUnmount(() => {
  pointPicker?.remove()
})
</script>


::: details 点击查看代码
```js
pointPicker = new PointPicker({
  markerOptions: {
    color: 'red'
  }
})
pointPicker.addTo(map)
pointPicker.on('get-point', (e) => {
  ElMessage.success(`获取坐标：${ e.point }`)
})
pointPicker.on('click-point', (e) => {
  ElMessage.success(`点位被点击：${ e.point }`)
})
```
:::