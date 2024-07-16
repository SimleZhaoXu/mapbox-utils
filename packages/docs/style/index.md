# Style

## Circle基础样式属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **circle-radius** | 圆点的半径（可选，值 >= 0，默认值为`5`，单位：像素）|
| **circle-color** | 圆点的颜色（可选，默认值为`#000000`） |
| **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
| **circle-blur** | 圆点的虚化（可选，取值范围为 0 ~ 1，默认值为`0`。当值为 1 时，表示把圆虚化到只有圆心是不透明的） |
| **circle-stroke-width**  | 圆点的描边宽度（可选，值 >= 0，默认值为`0`，单位：像素） |
| **circle-stroke-color** | 圆点的描边颜色（可选，默认值为`#000000`） |
| **circle-stroke-opacity** | 圆点的描边不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
| **circle-translate** | 圆点的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为`[0, 0]`，单位：像素。） |
| **circle-translate-anchor** | 圆点的平移锚点，即相对的参考物（可选，可选值为`map`、`viewport`，默认为`map`） |
| **circle-pitch-scale** | 地图倾斜时圆点的缩放（可选，可选值为`map`、`viewport`，默认为`map`。值为 viewport 时，圆点不会缩放） |
| **circle-pitch-alignment** | 地图倾斜时圆点的对齐方式（可选，可选值为`map`、`viewport`，默认为`map`） |

## Circle高亮样式支持属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **circle-radius**  | 圆点的半径（可选，值 >= 0，单位：像素，默认继承基础样式）|
| **circle-color**  | 圆点的颜色（可选，默认继承基础样式） |
| **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |
| **circle-blur** | 圆点的虚化（可选，取值范围为 0 ~ 1，默认继承基础样式） |
| **circle-stroke-width** | 圆点的描边宽度（可选，值 >= 0，单位：像素，默认继承基础样式） |
| **circle-stroke-color** | 圆点的描边颜色（可选，默认继承基础样式） |
| **circle-stroke-opacity** | 圆点的描边不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |

## Symbol基础样式属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **icon-image** | 图标的图片（可选，这里填写在sprite雪碧图中图标名称或使用[map.loadImage](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#loadimage)加载的图片） |
| **icon-size** | 图标的大小（可选，值 >= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小） |
| **icon-padding** | 图标的外边距（可选，值 >= 0，默认值为 2。可用于碰撞检测 |
| **icon-offset** | 图标的偏移量（可选，默认值为 [0, 0]） |
| **icon-anchor** | 图标与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center） |
| **icon-rotate** | 图标的顺时针旋转角度（可选，默认值为 0，单位：角度） |
| **icon-rotation-alignment** | 地图旋转时图标的对齐方式（可选，可选值为 map、viewport、auto，默认值为 auto） |
| **icon-pitch-alignment** | 地图倾斜时图标的对齐方式（可选，可选值为 map、viewport、auto，默认值为 auto） |
| **icon-allow-overlap** | 是否允许图标重叠（可选，默认值为 false。当值为 true 时，图标即使和其他符号触碰也会显示） |
| **icon-ignore-placement** | 是否忽略图标位置（可选，默认值为 false。当值为 true 时，其他符号即使与此图标触碰也会显示） |
| **icon-opacity** | 图标的不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **icon-color** | 图标的颜色（可选，默认值为 #000000） |
| **icon-halo-color** | 图标的光晕颜色（可选，默认值为 rgba(0,0,0,0)） |
| **icon-halo-width** | 图标的光晕宽度（可选，值 >= 0，默认值为 0，单位：像素） |
| **icon-halo-blur** | 图标的光晕模糊宽度（可选，值 >= 0，默认值为 0，单位：像素） |
| **icon-translate** | 图标的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。） |
| **icon-translate-anchor** | 图标的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map） |
| **text-field** | 文本所对应的字段（可选，默认值为 ""） |
| **text-font** | 文本的字体集合（可选，默认值为 ["Open Sans Regular","Arial Unicode MS Regular"]） |
| **text-size** | 文本的大小（可选，默认值为 16，单位：像素） |
| **text-max-width** | 文本的最大宽度，超过则折行（可选，默认值为 10，单位：ems） |
| **text-line-height** | 文本的行高（可选，默认值为 1.2，单位：ems） |
| **text-letter-spacing** | 文本的字符间距（可选，默认值为 0，单位：ems） |
| **text-justify** | 文本的水平对齐方式（可选，可选值为 auto、left、center、right。默认值为 center） |
| **text-anchor** | 文本与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center） |
| **text-rotate** | 文本的顺时针旋转角度（可选，默认值为 0，单位：角度） |
| **text-padding** | 文本的外边距（可选，值 >= 0，默认值为 2。可用于碰撞检测） |
| **text-transform** | 文本大小写转换（可选，可选值为 none、uppercase、lowercase，默认值为 none） |
| **text-offset** | 图标的偏移量（可选，默认值为 [0, 0]） |
| **text-allow-overlap** | 是否允许文本重叠（可选，默认值为 false。当值为 true 时，文本即使和其他符号触碰也会显示） |
| **text-ignore-placement** | 是否忽略文本位置（可选，默认值为 false。当值为 true 时，其他符号即使与此文本触碰也会显示） |
| **text-opacity** | 文本的不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **text-color** | 文本的颜色（可选，默认值为 #000000） |
| **text-halo-color** | 文本的光晕颜色（可选，默认值为 rgba(0,0,0,0)） |
| **text-halo-width** | 文本的光晕宽度（可选，值 >= 0，默认值为 0，单位：像素） |
| **text-halo-blur** | 文本的光晕模糊宽度（可选，值 >= 0，默认值为 0，单位：像素） |
| **text-translate** | 文本的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。） |
| **text-translate-anchor** | 文本的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map） |
## Symbol高亮样式支持属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **icon-image** | 图标的图片（可选，这里填写在sprite雪碧图中图标名称或使用[map.loadImage](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#loadimage)加载的图片, 默认继承基础样式） |
| **icon-size** | 图标的大小（可选，值 >= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小, 默认继承基础样式） |
| **icon-opacity** | 图标的不透明度（可选，取值范围为 0 ~ 1，默认继承基础样式） |
| **icon-color** | 图标的颜色（可选，默认继承基础样式） |
| **icon-halo-color** | 图标的光晕颜色（可选，默认继承基础样式） |
| **icon-halo-width** | 图标的光晕宽度（可选，值 >= 0，单位：像素, 默认继承基础样式） |
| **icon-halo-blur** | 图标的光晕模糊宽度（可选，值 >= 0，单位：像素, 默认继承基础样式） |
| **text-field** | 文本所对应的字段（可选， 默认继承基础样式） |
| **text-size** | 文本的大小（可选，单位：像素,  默认继承基础样式） |
| **text-opacity** | 文本的不透明度（可选，取值范围为 0 ~ 1， 默认继承基础样式） |
| **text-color** | 文本的颜色（可选， 默认继承基础样式） |
| **text-halo-color** | 文本的光晕颜色（可选， 默认继承基础样式） |
| **text-halo-width** | 文本的光晕宽度（可选，值 >= 0，单位：像素, 默认继承基础样式） |
| **text-halo-blur** | 文本的光晕模糊宽度（可选，值 >= 0，单位：像素, 默认继承基础样式） |

## Line基础样式属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **line-color** | 线的颜色（可选，默认值为 #000000。如果设置了 line-pattern，则 line-color 将无效） |
| **line-width** | 线的宽度（可选，值 >= 0，默认值为 1，单位：像素） |
| **line-blur** | 线的模糊度（可选，值 >= 0，默认值为 0，单位：像素） |
| **line-opacity** | 线的不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **line-pattern** | 线用的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）|
| **line-gap-width** | 线的外部间距宽度（可选，值 >= 0，默认值为 0，单位：像素。用来在线的外部再绘制一部分，此值表示内间距） |
| **line-offset** | 线的偏移（可选，默认值为 0，单位：像素。对于单线，则是向右的偏移量；对于多边形，正值为内缩 inset，负值为外突 outset） |
| **line-dasharray** | 虚线的破折号部分和间隔的长度（可选，默认无虚线。如果设置了 line-pattern，则 line-dasharray 将无效） |
| **line-gradient** | 线的渐变色（可选。如果设置了 line-pattern 或 line-dasharray，则 line-gradient 将无效。只有数据源 source 的 type 为 geojson ，且 source 的 lineMetrics 为 true 时，line-gradient 才有效） |
| **line-translate** | 线的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。） |
| **line-translate-anchor** | 线的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map） |
| **line-cap** | 线末端的显示样式（可选，可选值为 butt：方型末端（仅绘制到线的端点）；round：圆型末端（以线宽的 1/2 为半径，以线的端点为圆心，绘制圆型端点，会超出线的端点）；square：方型末端（以线宽的 1/2 长度超出线的端点）默认值为 butt |
| **line-join** | 线交叉时的显示样式（可选，可选值为 bevel：方型交点（以线宽的 1/2 长度超出线的交点）；round圆型交点（以线宽的 1/2 为半径，以线的交点为圆心，绘制圆型交点，会超出线的交点）；miter尖型交点（以两线段的外沿相交，超出交点绘制），默认值为 miter） |
| **line-miter-limit** | 最大斜接长度（可选，用来将 miter 尖型交点自动转为 bevel 方型交点，默认值为 2。只有 line-join 为 miter 时，才需要设置此属性） |
| **line-round-limit** | 最小圆角半径（可选，用来将 round 圆型交点自动转为 miter 尖型交点，默认值为 1.05。只有 line-join 为 round 时，才需要设置此属性） |

## Line高亮样式支持属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **line-color** | 线的颜色（可选，默认值为 #000000。如果设置了 line-pattern，则 line-color 将无效） |
| **line-width** | 线的宽度（可选，值 >= 0，默认值为 1，单位：像素） |
| **line-blur** | 线的模糊度（可选，值 >= 0，默认值为 0，单位：像素） |
| **line-opacity** | 线的不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **line-gap-width** | 线的外部间距宽度（可选，值 >= 0，默认值为 0，单位：像素。用来在线的外部再绘制一部分，此值表示内间距） |

## 多边形基础样式属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **stroke-color** | 描边颜色（可选，默认值为 #000000。如果设置了 stroke-pattern，则 stroke-color 将无效） |
| **stroke-opacity** | 描边不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **stroke-width** | 描边宽度（可选，值 >= 0，默认值为 1，单位：像素） |
| **stroke-blur** | 描边模糊度（可选，值 >= 0，默认值为 0，单位：像素） |
| **stroke-dasharray** | 描边虚线的破折号部分和间隔的长度（可选，默认无虚线。如果设置了 stroke-pattern，则 stroke-dasharray 将无效）|
| **stroke-pattern** | 描边用的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）|
| **fill-color** | 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效） |
| **fill-opacity** | 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **fill-pattern** | 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效） |
| **sort-key** | 重叠时排序（可选，默认为1，值越大，越在上层，鼠标事件只在最上层的feature触发） |

## 多边形高亮样式支持属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **stroke-color** | 描边颜色（可选，默认继承基础属性） |
| **stroke-opacity** | 描边不透明度（可选，取值范围为 0 ~ 1，默认继承基础属性） |
| **stroke-width** | 描边宽度（可选，值 >= 0，单位：像素，默认继承基础属性） |
| **stroke-blur** | 描边模糊度（可选，值 >= 0，单位：像素，默认继承基础属性） |
| **stroke-pattern** | 描边用的图案（可选，默认继承基础属性）|
| **fill-color** | 填充的颜色（可选，默认继承基础属性） |
| **fill-opacity** | 填充的不透明度（可选，取值范围为 0 ~ 1，默认继承基础属性） |
| **fill-pattern** | 填充的颜色（可选，默认继承基础属性） |
| **sort-key** | 重叠时排序（可选，默认继承基础属性值） |

## 圆点聚合点样式属性

| 属性名  | 描述 |
| :-------: | :-------------------- |
| **circle-radius** | 圆点的半径（可选，值 >= 0，默认值为`5`，单位：像素）|
| **circle-color** | 圆点的颜色（可选，默认值为`#000000`） |
| **circle-opacity** | 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
| **circle-blur** | 圆点的虚化（可选，取值范围为 0 ~ 1，默认值为`0`。当值为 1 时，表示把圆虚化到只有圆心是不透明的） |
| **circle-stroke-width**  | 圆点的描边宽度（可选，值 >= 0，默认值为`0`，单位：像素） |
| **circle-stroke-color** | 圆点的描边颜色（可选，默认值为`#000000`） |
| **circle-stroke-opacity** | 圆点的描边不透明度（可选，取值范围为 0 ~ 1，默认值为`1`） |
| **circle-translate** | 圆点的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为`[0, 0]`，单位：像素。） |
| **circle-translate-anchor** | 圆点的平移锚点，即相对的参考物（可选，可选值为`map`、`viewport`，默认为`map`） |
| **circle-pitch-scale** | 地图倾斜时圆点的缩放（可选，可选值为`map`、`viewport`，默认为`map`。值为 viewport 时，圆点不会缩放） |
| **circle-pitch-alignment** | 地图倾斜时圆点的对齐方式（可选，可选值为`map`、`viewport`，默认为`map`） |
| **text-field** | 文本所对应的字段（可选，默认值为 ""） |
| **text-font** | 文本的字体集合（可选，默认值为 ["Open Sans Regular","Arial Unicode MS Regular"]） |
| **text-size** | 文本的大小（可选，默认值为 16，单位：像素） |
| **text-max-width** | 文本的最大宽度，超过则折行（可选，默认值为 10，单位：ems） |
| **text-line-height** | 文本的行高（可选，默认值为 1.2，单位：ems） |
| **text-letter-spacing** | 文本的字符间距（可选，默认值为 0，单位：ems） |
| **text-justify** | 文本的水平对齐方式（可选，可选值为 auto、left、center、right。默认值为 center） |
| **text-anchor** | 文本与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center） |
| **text-rotate** | 文本的顺时针旋转角度（可选，默认值为 0，单位：角度） |
| **text-padding** | 文本的外边距（可选，值 >= 0，默认值为 2。可用于碰撞检测） |
| **text-transform** | 文本大小写转换（可选，可选值为 none、uppercase、lowercase，默认值为 none） |
| **text-offset** | 图标的偏移量（可选，默认值为 [0, 0]） |
| **text-allow-overlap** | 是否允许文本重叠（可选，默认值为 false。当值为 true 时，文本即使和其他符号触碰也会显示） |
| **text-ignore-placement** | 是否忽略文本位置（可选，默认值为 false。当值为 true 时，其他符号即使与此文本触碰也会显示） |
| **text-opacity** | 文本的不透明度（可选，取值范围为 0 ~ 1，默认值为 1） |
| **text-color** | 文本的颜色（可选，默认值为 #000000） |
| **text-halo-color** | 文本的光晕颜色（可选，默认值为 rgba(0,0,0,0)） |
| **text-halo-width** | 文本的光晕宽度（可选，值 >= 0，默认值为 0，单位：像素） |
| **text-halo-blur** | 文本的光晕模糊宽度（可选，值 >= 0，默认值为 0，单位：像素） |
| **text-translate** | 文本的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。） |
| **text-translate-anchor** | 文本的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map） |
