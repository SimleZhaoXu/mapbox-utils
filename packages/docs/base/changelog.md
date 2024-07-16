## 1.0.11 (2024-03-20)

- 修复AdvancePointLayer设置clusterMaxZoom时图层渲染出错的问题；


## 1.0.10 (2024-01-24)

- 修复AdvanceCarTrack设置空数据不清除原数据绘制图层问题

## 1.0.9 (2024-01-05)

- 修复AdvanceCarTrack高级轨迹播放组件在设置nodeLayers后调用remove()移出地图时报错问题。

## 1.0.8 (2024-01-05)

- 新增AdvanceBuffer高级缓冲区工具，支持通过点、线、多边形进行缓冲区计算。

### 1.0.7 (2023-12-12)

1. 新增AdvanceCarTrack高级轨迹播放组件
2. 新增DrawUtil几何图形绘制工具，可绘制点、线、多边形、圆形、矩形


### 1.0.6 (2023-11-03)

1. AdvanceLineLayer支持Polygon类型数据
2. AdvanceLineLayer支持渐变色
3. 新增DistanceMeasurer距离测量工具
4. 新增AreaMeasurer面积测量工具


### 1.0.5 (2023-11-01)

- 修复AdvancePointLayer、AdvanceLineLayer、AdvancePolygonLayer在进行高亮时的错误


### 1.0.4 (2023-11-01)

1. 新增AdvancePointLayer，提供更加灵活的点位图层
2. 新增AdvanceLineLayer，提供更加灵活的线图层
3. 新增AdvancePolygonLayer，提供更加灵活的多边形图层
4. 修复变更底图时存在的一些问题


### 1.0.3 (2023-10-17)

- 问题修复：在使用`map.setStyle()`变更地图底图时默认会将已绘制图层全部清空，本期优化后将不会存在该问题。


### 1.0.2 (2023-06-08)

- 解决`PolygonLayer`配置`sort-key`不生效问题。


### 1.0.1 (2023-06-08)

- `PolygonLayer`支持使用`sort-key`对普通和高亮的图层进行层级关系配置。


### 1.0.0 (2023-04-11)

- 组件库发布。