# 路径选取(LinePicker)

用来在地图上绘制路线

## 基础用法

```js{2,4}
// 1. 导入
import { LinePicker } from 'mapbox-postting'
// 2. 创建LinePicker实例
const linePicker = new LinePicker(options)
// 3. 添加到地图
linePicker.addTo(map) // map为MapBox地图实例
```

## Options

创建`LinePicker`实例时需要传入的参数对象，包含以下几个部分：

- **style**： 选取时线段及顶点的样式，属性如下

  |          属性名           | 描述                                                     |
  | :-----------------------: | :------------------------------------------------------- |
  |      **line-width**       | 线段的宽度（可选，值 >= 0，单位：像素）                  |
  |      **line-color**       | 线段的颜色（可选）                                       |
  |     **line-opacity**      | 线段的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）    |
  |       **line-blur**       | 线段的虚化（可选，取值范围为 0 ~ 1，默认值为`0`）        |
  |    **line-dasharray**     | 虚线的破折号部分和间隔的长度（可选，默认为实线）         |
  |     **vertex-radius**     | 顶点的半径（可选，值 >= 0，单位：像素）                  |
  |     **vertex-color**      | 顶点的颜色（可选）                                       |
  |    **vertex-opacity**     | 顶点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）     |
  |  **vertex-stroke-width**  | 顶点的描边宽度（可选，值 >= 0，默认值为 0，单位：像素）  |
  |  **vertex-stroke-color**  | 顶点的描边颜色（可选）                                   |
  | **vertex-stroke-opacity** | 顶点的描边不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |

- **finishedStyle**：线段选取完成后的样式，属性同上表格

- **enableEnter**：是否启用键盘`Enter`键触发完成绘制

## API

### addTo() 

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const linePicker = new LineLayer(options)
  linePicker.addTo(map)
  ```

### remove() 

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  linePicker.remove()
  ```

### clear()

清除已绘制的线段，在一次绘制完成后，需要调用此方法，才能进行下一次绘制

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  linePicker.clear()
  ```

### getData()

返回已绘制完成的路线数据，若尚未绘制完成，则返回`null`

- 类型

  ```ts
  function(): GeoJSON.Feature<GeoJSON.LineString> | null
  ```

- 示例

  ```ts
  linePicker.getData()
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
  pointLayer.on('finish', (e) => {
    console.log(e.data)
  })
  ```

## 事件

### finish

线段绘制完成后触发，可获取绘制的线段geojson数据，以及线段的长度

- callback

  ```ts
  (e: {
    type: 'finish';
    target: this;
    data: GeoJSON.Feature<GeoJSON.LineString>; // 线段数据
    length: number // 线段长度，单位(米)
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('finish', (e) => {
    console.log(e.data)
    console.log(e.length)
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
import { LinePicker } from 'mapbox-postting'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
let map
let linePicker
const handleMapLoad = (val) => {
  map = val
  linePicker = new LinePicker({
    style: {
      'line-width': 2,
      'line-color': '#44cef6',
      'line-opacity': 0.5,
      'line-dasharray': [5, 3],
      'vertex-radius': 4,
      'vertex-color': '#fff',
      'vertex-stroke-width': 1,
      'vertex-stroke-color': '#44cef6',
    },
    finishedStyle: {
      'line-opacity': 1,
      'line-dasharray': [1, 0],
    }
  })
  linePicker.addTo(map)
  linePicker.on('finish', (e) => {
    ElMessage.success(`绘制完成，长度：${e.length}米`)
  })
}

const clear = () => {
  linePicker?.clear()
}

const getData = () => {
  console.log(linePicker?.getData())
}

onBeforeUnmount(() => {
  linePicker?.remove()
})
</script>

::: details 点击查看代码
```js
linePicker = new LinePicker({
  style: {
    'line-width': 2,
    'line-color': '#44cef6',
    'line-opacity': 0.5,
    'line-dasharray': [5, 3],
    'vertex-radius': 4,
    'vertex-color': '#fff',
    'vertex-stroke-width': 1,
    'vertex-stroke-color': '#44cef6',
  },
  finishedStyle: {
    'line-opacity': 1,
    'line-dasharray': [1, 0],
  }
})

linePicker.addTo(map)

linePicker.on('finish', (e) => {
  ElMessage.success(`绘制完成，长度：${e.length}米`)
})

const clear = () => {
  linePicker?.clear()
}

const getData = () => {
  console.log(linePicker?.getData())
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