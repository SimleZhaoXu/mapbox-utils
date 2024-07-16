# Mapbox Style 规范

这里记录下其 Web 端 API Mapbox GL JS 的地图样式规范 Style 的各个配置项：

::: warning 提示
必填项会加上 \* ，方便根据目录进行查看
:::

## 1. version \*

`version`：版本号（`必填`，且值必须为 `8`）

```json
{
  "version": 8
}
```

## 2. name

`name`：名称（`可选`，用于给 `style` 取名，方便阅读）

```json
{
  "name": "demo"
}
```
## 3. center

`center`：地图的默认中心点（`可选`，由 `经度` 和 `纬度` 构成）

```json
{
  "center": [106.66339, 30.42628]
}
```

## 4. zoom

`zoom`：地图的默认缩放层级（`可选`，值越大，越靠近地表。mapbox 采用的是无极缩放，范围一般为 `0 ~ 24`）

```json
{
  "zoom": 8
}
```

## 5. bearing

`bearing`：地图的默认方位角（`可选`，表示 `地图视口正上方中心点` 在地图上 `北偏东` 的角度。默认值为 `0`）

```json
{
  "bearing": 0
}
```

## 6. pitch

`pitch`：地图的默认倾斜角度（`可选`，默认值为 `0`，范围为 `0 ~ 60`）

```json
{
  "pitch": 0
}
```

## 7. sprite

`sprite`：雪碧图（可选，用来指定获取雪碧图及其元数据的 URL）
`sprite` 的音译是 雪碧，直译是 精灵，表示不受地图旋转缩放影响的图标等，类似精灵漂浮在空中。
当有 `layer` 使用了 `background-pattern`、`fill-pattern`、`line-pattern`、`fill-extrusion-pattern`、`icon-image` 等属性时，可使用`sprite`中提供的图片。

```json
{
  "sprite": "mapbox://sprites/mapbox/bright-v8"
}
```

当指定了 `sprite` 后，`mapbox` 会自动生成雪碧图的完整请求地址，分别如下：

```js
`${sprite}.png``${sprite}.json`;
```

## 8. glyphs

`glyphs`：字形符号（可选，用来指定加载以 PBF 格式设置的 `有向距离场` 字形的 URL 模板）

URL 模板必须带有占位符 `{fontstack}` 和 `{range}`。

当有 `layer` 使用了 `text-field` 属性时，`glyphs` 必填。

```json
{
  "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
}
```

## 9. transition

`transition`：全局的过渡动画属性（`可选`，用来作为所有过渡动画属性的默认值）

```json
{
  "transition": {
    "duration": 300, // 过渡的持续时间（可选，单位：毫秒，默认值为 300）
    "delay": 0 // 延迟多久开始过渡（可选，单位：毫秒，默认值为 0）
  }
}
```

## 10. sources \*

`sources`：数据源集合（`必填`，用于包含一系列数据源 `source`，这些数据源提供了在地图上显示的数据）
`sources` 是对象 `{}` 的形式，其属性名就是 `数据源的名称`（或者说 `数据源的 id`），这样可以根据 `数据源的名称`（或者说 `数据源的 id`）快速获取数据源的信息。

```json
{
  "sources": {}
}
```

详见[Sources](./style/sources.md)

## 11. layers \*

`layers`：图层集合（`必填`，包含了一系列图层 `layer`，这些图层指定了如何渲染数据源提供的数据）

```json
{
  "layers": []
}
```

详见[Layers](./style/layers.md)

## 12. Expressions

详见[Expressions](./style/expressions.md)

## 13. Functions

详见[Functions](./style/functions.md)