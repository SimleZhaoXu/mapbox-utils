# 区域框选（矩形）(RectAreaPicker)

用来在地图上绘制矩形

## 基础用法

```js{2,4}
// 1. 导入
import { RectAreaPicker } from 'mapbox-postting'
// 2. 创建RectAreaPicker实例
const rectAreaPicker = new RectAreaPicker(options)
// 3. 添加到地图
rectAreaPicker.addTo(map) // map为MapBox地图实例
```

## Options

创建`RectAreaPicker`实例时需要传入的参数对象，包含以下几个部分：

- **style**： 绘制矩形时的样式，属性如下

  |          属性名           | 描述                                                     |
  | :-----------------------: | :------------------------------------------------------- |
  |      **fill-color**       | 填充颜色(可选)                                           |
  |     **fill-opacity**      | 填充不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）      |
  |     **stroke-width**      | 描边的宽度（可选，值 >= 0，单位：像素）                  |
  |     **stroke-color**      | 描边的颜色（可选）                                       |
  |    **stroke-opacity**     | 描边的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）    |
  |      **stroke-blur**      | 描边的虚化（可选，取值范围为 0 ~ 1，默认值为`0`）        |
  |   **stroke-dasharray**    | 描边的破折号部分和间隔的长度（可选，默认为实线）         |
  |     **vertex-radius**     | 顶点的半径（可选，值 >= 0，单位：像素）                  |
  |     **vertex-color**      | 顶点的颜色（可选）                                       |
  |    **vertex-opacity**     | 顶点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）     |
  |  **vertex-stroke-width**  | 顶点的描边宽度（可选，值 >= 0，默认值为 0，单位：像素）  |
  |  **vertex-stroke-color**  | 顶点的描边颜色（可选）                                   |
  | **vertex-stroke-opacity** | 顶点的描边不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |

- **finishedStyle**：矩形绘制完成后的样式，属性同上表格

## API

### addTo() 

将图层及事件监听器添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const rectAreaPicker = new RectAreaPicker(options)
  rectAreaPicker.addTo(map)
  ```

### remove() 

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  rectAreaPicker.remove()
  ```

### clear()

清除已绘制的矩形，在一次绘制完成后，需要调用此方法，才能进行下一次绘制

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  rectAreaPicker.clear()
  ```

### getData()

返回已绘制完成的矩形数据，若尚未绘制完成，则返回`null`

- 类型

  ```ts
  function(): GeoJSON.Feature<GeoJSON.Polygon> | null
  ```

- 示例

  ```ts
  rectAreaPicker.getData()
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
  rectAreaPicker.on('finish', (e) => {
    console.log(e.data)
  })
  ```

## 事件

### finish

矩形制完成后触发，可获取绘制的矩形geojson数据，以及矩形的面积

- callback

  ```ts
  (e: {
    type: 'finish';
    target: this;
    data: GeoJSON.Feature<GeoJSON.Polygon>; // 矩形数据
    acreage: number // 矩形面积，单位(平方米)
  }) => void
  ```

- 示例

  ```ts
  rectAreaPicker.on('finish', (e) => {
    console.log(e.data)
    console.log(e.acreage)
  })
  ```

## Demo
<div>
  <MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad" />
  <div class="button-wrapper">
    <div class="button" @click="clear">清除</div>
    <div class="button" @click="getData">获取</div>
  </div>
</div>

<script setup>
import { onBeforeUnmount, createApp } from 'vue'
import MapView from '/components/map-view.vue'
import { RectAreaPicker } from 'mapbox-postting'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let rectAreaPicker
const handleMapLoad = (val) => {
  map = val
  rectAreaPicker = new RectAreaPicker({
    style: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.2,
      'stroke-width': 2,
      'stroke-color': '#44cef6',
      'stroke-opacity': 0.5,
      'stroke-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6',
    },
    finishedStyle: {
      'fill-opacity': 0.3,
      'stroke-opacity': 1,
      'stroke-dasharray': [1, 0]
    }
  })
  rectAreaPicker.addTo(map)
  rectAreaPicker.on('finish', (e) => {
    ElMessage.success(`绘制完成，面积：${e.acreage}平方米`)
  })
}

const clear = () => {
  rectAreaPicker?.clear()
}

const getData = () => {
  console.log(rectAreaPicker?.getData())
}

onBeforeUnmount(() => {
  rectAreaPicker?.remove()
})
</script>

::: details 点击查看代码
```js
rectAreaPicker = new RectAreaPicker({
  style: {
    'fill-color': '#44cef6',
    'fill-opacity': 0.2,
    'stroke-width': 2,
    'stroke-color': '#44cef6',
    'stroke-opacity': 0.5,
    'stroke-dasharray': [5, 3],
    'vertex-radius': 4,
    'vertex-color': '#fff',
    'vertex-stroke-width': 1,
    'vertex-stroke-color': '#44cef6',
  },
  finishedStyle: {
    'fill-opacity': 0.3,
    'stroke-opacity': 1,
    'stroke-dasharray': [1, 0]
  }
})
rectAreaPicker.addTo(map)
rectAreaPicker.on('finish', (e) => {
  ElMessage.success(`绘制完成，面积：${e.acreage}平方米`)
})

const clear = () => {
  rectAreaPicker?.clear()
}

const getData = () => {
  console.log(rectAreaPicker?.getData())
}
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
