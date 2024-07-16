# 在 mapbox 中添加 threejs3 维物体

使用 [threebox-plugin](https://github.com/jscastro76/threebox) 库

## 安装

```
npm i threebox-plugin
```

## 导入

threebox-plugin 当前最新版本为`2.2.7`，内置 `threejs` 版本为`r132`， 可直接导入，无需再安装

```js
import { ThreeBox, THREE } from "threebox-plugin";
```

### 使用

```js
import mapboxgl from 'mapboxgl'
const map = new mapboxgl.Map({
  // ...options
})

// 创建threebox对象
// 注意：这里必须赋值给 window.tb
window.tb = new Threebox(
  map,
  map.getCanvas().getContext('webgl'), // get the context from the map canvas
  { defaultLights: true, enableSelectingObjects: true, multiLayer: true }
)

// 在 multiLayer: true 情况下，我们可以添加mapbox自定义图层，维护不同的3维物体/图层
map.addLayer({
  id: 'custom-3d-layer'
  type: 'custom',
  renderingMode: '3d',
  onAdd() {
    // ...
  }
  onRemove() {
    // ...
  },
  render() {}
})
```

### 完整文档

[threebox-plugin 完整文档](https://github.com/jscastro76/threebox/blob/master/docs/Threebox.md)
