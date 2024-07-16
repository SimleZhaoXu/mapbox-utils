# 轨迹播放(CarTrack)

通过`CarTrack`可以在地图上绘制基础动态轨迹图

## 基础用法

```js{2,4}
// 1. 导入
import { CarTrack } from 'mapbox-utils'
// 2. 创建CarTrack实例
const track = new CarTrack(options)
// 3. 添加到地图
track.addTo(map) // map为MapBox地图实例
// 4. 开始播放
track.start()
```

## Options

创建`CarTrack`实例时需要传入的参数对象，包含以下几个参数：

- **data**：轨迹路线数据，格式为经纬度坐标的数组

- **speed**：可选，轨迹播放的速度，单位为`km/s`, 默认为`5`

- **loop**：可选，是否循环播放，默认为`true`

- **currentPathLayer**：在轨迹播放时，当前走过的路径，可进行如下配置

  - **show**： 是否显示，默认为true

  - **style：** 路线样式，常用属性如下：[点此](../style/index.md#line基础样式属性)查看完整属性

  | 属性名  | 描述 |
  | :-------: | :-------------------- |
  | **line-width** | 线段的宽度（可选，值 >= 0，默认值为`1`，单位：像素）|
  | **line-color** | 线段的颜色（可选，默认值为`#000000`） |
  | **line-opacity** | 线段的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |

- **pathLayer**：在轨迹播放时，轨迹中未走过的路径，

  - **show**：是否显示，默认为true

  - **isFull**：可选，是否包含完整路径，默认为`true`, 表示显示完整路径

  - **style**：路径样式，配置项同**currentPathLayer.style**

- **carLayer**：轨迹小车配置，包含以下参数

  - **show**：是否显示，默认为false

  - **type**：可选，默认为`circle`，值为`circle`时，为圆点样式，值为`symbol`时，为图标样式，可在 style 中进行详细配置

  - **style**：小车样式

    当`type`为`circle`时，[点此](../style/index.md#circle基础样式属性)查看完整属性

    当`type`为`symbol`时，[点此](../style/index.md#symbol基础样式属性)查看完整属性

- **fitBoundsOptions** 可选，在轨迹添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有轨迹展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)

## API

### addTo()

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const track = new CarTrack(options);
  track.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  track.remove();
  ```

### play()

开始播放

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  track.play();
  ```

### pause()

暂停播放

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  track.pause();
  ```

### replay()

重新播放

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  track.replay();
  ```

### setSpeed()

可以在播放中设置播放速度

- 类型

  ```ts
  function(speed: number): this
  ```

- 示例

  ```ts
  track.setSpeed(5);
  ```

### fitBounds

调用该方法将轨迹集中到视口

- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```

- 示例

  ```ts
  track.fitBounds()
  ```

## Demo
<div>
  <MapView class="map-view" :icon-list="iconList" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad" />
  <div class="button-wrapper">
    <div class="button" @click="play">播放</div>
    <div class="button" @click="pause">暂停</div>
    <div class="button" @click="replay">重新播放</div>
    <div class="button" @click="fitBounds">fitBounds</div>
  </div>
</div>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { CarTrack } from 'mapbox-utils'
import pathData from '/data/trackData'
import plane from '/assets/map-icon/icon-plane.png'
let map
let track

const iconList = [
  {
    path: plane,
    name: 'icon-plane',
    pixelRatio: 10
  }
]
const handleMapLoad = (val) => {
  map = val
  track = new CarTrack({
    speed: 10,
    data: pathData,
    carLayer: {
      show: true,
      type: 'symbol',
      style: {
        'icon-image': 'icon-plane',
        'icon-rotate': ['+', ['get', 'bearing'], 45]
      }
    },
    currentPathLayer: {
      style: {
        'line-color': '#f00',
        'line-opacity': 0.4
      }
    },
    pathLayer: {
      style: {
        'line-color': '#0f0',
        'line-opacity': 0.4
      }
    },
    fitBoundsOptions: {
      padding: 40
    }
  })
  track.addTo(map)
  track.play()
}

const play = () => {
  track.play()
}

const pause = () => {
  track.pause()
}

const replay = () => {
  track.replay()
}

const fitBounds = () => {
  track.fitBounds()
}

onBeforeUnmount(() => {
  track?.remove()
})
</script>

::: details 点击查看代码
```js
track = new CarTrack({
  speed: 10,
  data: pathData,
  carLayer: {
    show: true,
    type: 'symbol',
    style: {
      'icon-image': 'icon-plane',
      'icon-rotate': ['+', ['get', 'bearing'], 45]
    }
  },
  currentPathLayer: {
    style: {
      'line-color': '#0f0',
      'line-opacity': 0.4
    }
  },
  pathLayer: {
    style: {
      'line-color': '#f00',
      'line-opacity': 0.4
    }
  },
  fitBoundsOptions: {
    padding: 40
  }
})
track.addTo(map)
track.play()

const play = () => {
  track.play()
}

const pause = () => {
  track.pause()
}

const replay = () => {
  track.replay()
}

const fitBounds = () => {
  track.fitBounds()
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