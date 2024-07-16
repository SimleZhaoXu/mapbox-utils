# 多边形图层(PolygonLayer)

通过`PolygonLayer`可以在地图上创建多边形图层，支持样式配置及高亮

::: warning 建议
[AdvancePolygonLayer](./advance-polygon-layer.md)组件已包含该组件所有功能，且更加灵活，提供更多的配置项支持。推荐新项目使用。
:::

## 基础用法

```js{2,4}
// 1. 导入
import { PolygonLayer } from 'mapbox-utils'
// 2. 创建PolygonLayer实例
const polygonLayer = new PolygonLayer(options)
// 3. 添加到地图
polygonLayer.addTo(map) // map为MapBox地图实例
```

## Options

创建`PolygonLayer`实例时需要传入的参数对象，包含以下几个部分：

- **data：** 多边形数据，[GeoJSON](https://geojson.org/)格式，类型: `FeatureCollection<Polygon | MultiPolygon>`

- **key：** 作为每个多边形唯一标识的属性，用来识别需要高亮的多边形，默认为`id`

- **style：** 多边形基础样式，常用属性如下：[点此](../style/index.md#多边形基础样式属性)查看完整配置

  |          属性名           | 描述                                                                                                                 |
  | :-----------------------: | :------------------------------------------------------------------------------------------------------------------- |
  |    **fill-color**    | 多边形填充颜色（可选，默认值为`#000000`）                                                                              |
  |   **fill-opacity**   | 多边形填充不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）                                                              |
  |   **stroke-width**   | 多边形描边宽度（可选，值 >= 0，默认值为`1`，单位：像素）                                                           |
  |   **stroke-color**   | 多边形描边颜色（可选，默认值为`#000000`）                                                                          |
  |  **stroke-opacity**  | 多边形描边不透明度（可选，取值范围为 0 ~ 1，默认值为`1`）                                                          |
  | **stroke-dasharray** | 多边形描边虚线：虚线的破折号部分和间隔的长度（可选） |

- **highlightOptions：** 高亮配置，可选（若不设置，则不会触发高亮）。包含以下两个属性：

  1. **`trigger`**： 高亮的触发方式，值为以下三种：

     - `click`: 多边形被点击时触发高亮

     - `hover`: 鼠标移入多边形时触发高亮

     - `both`: 以上两种情况都能触发高亮

  2. **`style`**： 高亮支持属性样式，常用属性如下：[点此](../style/index.md#多边形高亮样式支持属性)查看完整属性

     |          属性名           | 描述                                                               |
     | :-----------------------: | :----------------------------------------------------------------- |
     |    **fill-color**    | 多边形填充颜色（可选，默认继承基础样式）                             |
     |   **fill-opacity**   | 多边形填充不透明度（可选，默认继承基础样式）                         |
     |   **stroke-width**   | 多边形描边宽度（可选，默认继承基础样式）                         |
     |   **stroke-color**   | 多边形描边颜色（可选，默认继承基础样式）                         |
     |  **stroke-opacity**  | 多边形描边不透明度（可选，默认继承基础样式）                     |

- **fitBoundsOptions** 可选，在多边形添加到地图上时，是否通过调整地图缩放层级及中心点，自动将所有多边形展示在视口中，可选值为`true`、`false`、[FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds)

## API

### addTo()

将图层添加到地图实例上

- 类型

  ```ts
  function(map: mapboxgl.Map): this
  ```

- 示例

  ```ts
  const polygonLayer = new PolygonLayer(options);
  polygonLayer.addTo(map);
  ```

### remove()

将图层及事件监听器从地图上移除

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  polygonLayer.remove();
  ```

### setData()

设置图层数据，当图层已经添加到地图上时，会更新多边形

- 类型

  ```ts
  function(data: GeoJSON.FeatureCollection<GeoJSON.Polygon | MultiPolygon>): this
  ```

- 示例

  可以通过`turf.js`内置功能生成`FeatureCollection<Polygon | MultiPolygon>`类型数据

  ```ts
  polygonLayer.setData(
    turf.featureCollection([
      turf.polygon(
        [
          [
            [105.14453322179482, 30.50921803813716],
            [105.12568252795128, 30.570884171971322],
            [105.12774174353625, 30.481277054151516],
            [105.14453322179482, 30.50921803813716],
          ],
        ],
        { id: 1 }
      ),
      // ...polygon
    ])
  );
  ```

### setHighlight()

该方法可以通过编码的方式将对应多边形进行高亮（前提是在创建实例时设置了高亮相关属性，若无高亮相关配置则该方法无效）。

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一多边形的属性值， 对应为`Feature.properties[key]`， 在内部通过该属性寻找对应的多边形。

  ```ts
  function(valOfKey: string | number): this
  ```

- 示例

  ```ts
  polygonLayer.setHighlight(1);
  ```

### removeHighlight()

调用该方法清除多边形的高亮效果

- 类型

  ```ts
  function(): this
  ```

- 示例

  ```ts
  polygonLayer.removeHighlight();
  ```

### easeTo()

通过该方法可以将地图中心平移到对应的多边形中心

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一多边形的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的多边形。

  `options`包含[mapboxgl.EaseToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#easeto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number,
    options?: Omit<mapboxgl.EaseToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  // 使用默认配置进行平移动
  polygonLayer.easeTo(1);

  // 设置平移后的缩放层级为9
  polygonLayer.easeTo(1, {
    zoom: 9,
  });
  ```

### flyTo()

通过该方法可以将地图中心飞行定位到对应的多边形中心

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一多边形的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的多边形。

  `options`包含[mapboxgl.FlyToOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)中除了`center`的其他配置项。

  ```ts
  function(
    valOfKey: string | number,
    options?: Omit<mapboxgl.FlyToOptions, 'center'>
  ): this
  ```

- 示例

  ```ts
  polygonLayer.flyTo(1);
  ```

### fitTo

调用该方法将对应的多边形集中到视口

- 类型

  valOfKey 是通过`key`(在`options`中设置)来标识唯一多边形的属性值， 对应为`Feature.properties[key]`，在内部通过该属性寻找对应的多边形。

  `options`为[mapboxgl.FitBoundsOptions](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitBounds)

  ```ts
  function(
    valOfKey: string | number,
    options?: mapboxgl.FitBoundsOptions
  ): this
  ```

- 示例

  ```ts
  polygonLayer.fitTo(1);
  ```

### fitBounds

调用该方法将所有多边形集中到视口

- 类型

  ```ts
  function(options?: mapboxgl.FitBoundsOptions): this
  ```

- 示例

  ```ts
  polygonLayer.fitBounds();
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
  polygonLayer.on("click", e => {
    console.log(e.type); // 'click'
  });
  ```

## 事件

### click

多边形被点击时触发的事件，可以获取被点击多边形的中心、多边形的边界及多边形数据

- callback

  ```ts
  (e: {
    type: 'click'
    target: this; // 当前PolygonLayer实例
    data: any; // 点击的多边形数据
    center: mapboxgl.LngLat; // 点击的多边形的中心
    lngLatBounds: mapboxgl.LngLatBounds; // 点击的多边形的边界
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标点击事件
  }) => void
  ```

- 示例

  ```ts
  polygonLayer.on("click", e => {
    console.log(e.type); // 'click'
    // 点击后通过坐标进行定位
    map.easeTo({ center: e.center });
    // ...
  });
  ```

### mouseenter

鼠标移入多边形图层时触发

- callback

  ```ts
  (e: {
    type: 'mouseenter'; 
    target: this; // 当前PolygonLayer实例
    data: any; // 多边形数据
    lngLat: mapboxgl.LngLat; // 鼠标在地图上的坐标
    center: mapboxgl.LngLat; // 多边形的几何中心
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移入事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('mouseenter', (e) => {
    console.log(e.type) // 'mouseenter'
    // ...
  })
  ```

### mousemove

鼠标在多边形图层上移动时触发

- callback

  ```ts
  (e: {
    type: 'mousemove'; 
    target: this; // 当前PolygonLayer实例
    data: any; // 多边形数据
    lngLat: mapboxgl.LngLat; // 鼠标在地图上的坐标
    center: mapboxgl.LngLat; // 多边形的几何中心
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData // 原地图图层鼠标移动事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('mousemove', (e) => {
    console.log(e.type) // 'mouseenter'
    // ...
  })
  ```

### mouseleave

鼠标移出多边形图层时触发

- callback

  ```ts
  (e: {
    type: 'mouseleave'; 
    target: this; // 当前PolygonLayer实例
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData; // 原地图图层鼠标移出事件
  }) => void
  ```

- 示例

  ```ts
  lineLayer.on('mouseleave', (e) => {
    console.log(e.type) // 'mouseleave'
    // ...
  })
  ```

## Demo

画多边形，配置点击高亮，并且点击后进行定位

<MapView class="map-view" style="height: 600px; border-radius: 5px; overflow: hidden" @load="handleMapLoad"></MapView>

<script setup>
import { onBeforeUnmount } from 'vue'
import MapView from '/components/map-view.vue'
import { PolygonLayer } from 'mapbox-utils'
import data from '/data/polygonData.json'
let map
let polygonLayer
const handleMapLoad = (val) => {
  map = val
  polygonLayer = new PolygonLayer({
    key: 'name',
    data,
    style: {
      'stroke-color': "#ff0000",
      'stroke-opacity': 0.3,
      'fill-color': "#FF0000",
      'fill-opacity': 0.3,
    },
    highlightOptions: {
      trigger: "click",
      style: {
        'stroke-opacity': 0.5,
        'fill-opacity': 0.5,
      },
    },
    fitBoundsOptions: {
      padding: 20
    }
  })
  polygonLayer.addTo(map)
  polygonLayer.on('click', (e) => {
    map.easeTo({center: e.center})
  })
}
onBeforeUnmount(() => {
  polygonLayer?.remove()
})
</script>

::: details 点击查看代码
```js
polygonLayer = new PolygonLayer({
  key: "id",
  data,
  style: {
    'stroke-color': "#ff0000",
    'stroke-opacity': 0.3,
    'fill-color': "#FF0000",
    'fill-opacity': 0.3,
  },
  highlightOptions: {
    trigger: "click",
    style: {
      'stroke-opacity': 0.5,
      'fill-opacity': 0.5,
    },
  },
  fitBoundsOptions: {
    padding: 20,
  },
});

polygonLayer.addTo(map);

polygonLayer.on("click", e => {
  map.easeTo({ center: e.center });
});
```
:::
