export const fillLayout = {
  // 布局类属性
  visibility: 'visible' // 可见性（可选，可选值为 none、visible，默认值为 visible）
}
export const fillPaint = {
  'fill-antialias': true, // 填充时是否反锯齿（可选，默认值为 true）
  'fill-opacity': 1, // 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
  'fill-pattern': '', // 填充用的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）
  'fill-color': '#000000', // 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效）
  'fill-outline-color': '#000000', // 描边的颜色（可选，默认和 fill-color 一致。如果设置了 fill-pattern，则 fill-outline-color 将无效。为了使用此属性，还需要设置 fill-antialias 为 true）
  'fill-translate': [0, 0], // 填充的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
  'fill-translate-anchor': 'map' // 平移的锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
}

export const lineLayout = {
  visibility: 'visible', // 可见性（可选，可选值为 none、visible，默认值为 visible）
  'line-cap': 'butt', // 线末端的显示样式（可选，可选值为 butt、round、square，默认值为 butt）
  // --- butt：方型末端（仅绘制到线的端点）
  // --- round：圆型末端（以线宽的 1/2 为半径，以线的端点为圆心，绘制圆型端点，会超出线的端点）
  // --- square：方型末端（以线宽的 1/2 长度超出线的端点）
  'line-join': 'miter', // 线交叉时的显示样式（可选，可选值为 bevel、round、miter，默认值为 miter）
  // --- bevel：方型交点（以线宽的 1/2 长度超出线的交点）
  // --- round：圆型交点（以线宽的 1/2 为半径，以线的交点为圆心，绘制圆型交点，会超出线的交点）
  // --- miter：尖型交点（以两线段的外沿相交，超出交点绘制）
  'line-miter-limit': 2, // 最大斜接长度（可选，用来将 miter 尖型交点自动转为 bevel 方型交点，默认值为 2。只有 line-join 为 miter 时，才需要设置此属性）
  'line-round-limit': 1.05 // 最小圆角半径（可选，用来将 round 圆型交点自动转为 miter 尖型交点，默认值为 1.05。只有 line-join 为 round 时，才需要设置此属性）
}
export const linePaint = {
  'line-opacity': 1, // 线的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
  'line-pattern': '', // 线用的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）
  'line-color': '#000000', // 线的颜色（可选，默认值为 #000000。如果设置了 line-pattern，则 line-color 将无效）
  'line-translate': [0, 0], // 线的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
  'line-translate-anchor': 'map', // 线的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
  'line-width': 1, // 线的宽度（可选，值 >= 0，默认值为 1，单位：像素）
  'line-gap-width': 0, // 线的外部间距宽度（可选，值 >= 0，默认值为 0，单位：像素。用来在线的外部再绘制一部分，此值表示内间距）
  'line-offset': 0, // 线的偏移（可选，默认值为 0，单位：像素。对于单线，则是向右的偏移量；对于多边形，正值为内缩 inset，负值为外突 outset）
  'line-blur': 0, // 线的模糊度（可选，值 >= 0，默认值为 0，单位：像素）
  'line-dasharray': [1, 0], // 虚线的破折号部分和间隔的长度（可选，默认值为 [0, 0]。如果设置了 line-pattern，则 line-dasharray 将无效）
  'line-gradient': '#000000' // 线的渐变色（可选。如果设置了 line-pattern 或 line-dasharray，则 line-gradient 将无效。只有数据源 source 的 type 为 geojson ，且 source 的 lineMetrics 为 true 时，line-gradient 才有效）
}

export const circleLayout = {
  visibility: 'visible' // 可见性（可选，可选值为 none、visible，默认值为 visible）
}
export const circlePaint = {
  'circle-opacity': 1, // 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
  'circle-radius': 5, // 圆点的半径（可选，值 >= 0，默认值为 5，单位：像素）
  'circle-color': '#000000', // 圆点的颜色（可选，默认值为 #000000）
  'circle-blur': 0, // 圆点的虚化（可选，默认值为 0。当值为 1 时，表示把圆虚化到只有圆心是不透明的）
  'circle-translate': [0, 0], // 圆点的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
  'circle-translate-anchor': 'map', // 圆点的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
  'circle-pitch-scale': 'map', // 地图倾斜时圆点的缩放（可选，可选值为 map、viewport，默认为 map。值为 viewport 时，圆点不会缩放）
  'circle-pitch-alignment': 'map', // 地图倾斜时圆点的对齐方式（可选，可选值为 map、viewport，默认为 map）
  'circle-stroke-width': 0, // 圆点的描边宽度（可选，值 >= 0，默认值为 0，单位：像素）
  'circle-stroke-color': '#000000', // 圆点的描边颜色（可选，默认值为 #000000）
  'circle-stroke-opacity': 1 // 圆点的描边不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
}

export const symbolLayout = {
  visibility: 'visible', // 可见性（可选，可选值为 none、visible，默认值为 visible）
  'symbol-placement': 'point', // 符号的位置（可选，可选值为 point、line、line-center，默认值为 point）
  // --- point：符号在几何形状的点上
  // --- line：符号在几何形状的线上（几何形状只能为 LineString 或 Polygon）
  // --- line-center：符号在几何形状的线的中心点上（几何形状只能为 LineString 或 Polygon）
  'symbol-spacing': 250, // 符号之间的距离（可选，值 >= 1，默认值为 250，单位：像素。只有 symbol-placement 为 line 时才有效）
  'symbol-avoid-edges': false, // 是否避免边缘冲突（可选，默认值为 false。当为 true 时，符号不会超过切片的边缘）
  'symbol-sort-key': 1, // 排序的参考值（可选，无默认值。值越大，越在上方）
  'symbol-z-order': 'auto', // z 轴上的顺序控制（可选，可选值为 auto、viewport-y、source，默认值为 auto）

  // 图标类属性（需要设置 icon-image）
  'icon-image': '', // 图标的图片（可选，这里填写在 sprite 雪碧图中图标名称）
  'icon-size': 1, // 图标的大小（可选，值 >= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小）
  'icon-padding': 2, // 图标的外边距（可选，值 >= 0，默认值为 2。可用于碰撞检测）
  'icon-offset': [0, 0], // 图标的偏移量（可选，默认值为 [0, 0]）
  'icon-anchor': 'center', // 图标与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center）
  'icon-rotate': 0, // 图标的顺时针旋转角度（可选，默认值为 0，单位：角度）
  'icon-allow-overlap': false, // 是否允许图标重叠（可选，默认值为 false。当值为 true 时，图标即使和其他符号触碰也会显示）
  'icon-ignore-placement': false, // 是否忽略图标位置（可选，默认值为 false。当值为 true 时，其他符号即使与此图标触碰也会显示）
  'icon-optional': false, // 图标是否可不显示（可选，默认值为 false。当值为 true 时，如果图标与文本标签碰撞，则显示文本标签）
  'icon-text-fit': 'none', // 图标与文本的大小适应关系（可选，可选值为 none、width、height、both，默认值为 none）
  // --- none：图标按其本身的比例显示
  // --- width：图标在 x 轴上缩放以适应文本的宽度
  // --- height：图标在 y 轴上缩放以适应文本的高度
  // --- both：图标在 x 和 y 轴上缩放以适应文本的宽高
  'icon-text-fit-padding': [0, 0, 0, 0], // 图标与文本的内边距（可选，默认值为 [0,0,0,0]，单位：像素）
  'icon-keep-upright': false, // 当 icon-rotation-alignment 为 map，且 symbol-placement 为 line 或者 line-center 时，设置为 true 的话，可以避免图标上下颠倒
  'icon-rotation-alignment': 'auto', // 地图旋转时图标的对齐方式（可选，可选值为 map、viewport、auto，默认值为 auto）
  // --- map：当 symbol-placement 为 point 时，图标与地图的东西方向对齐；当 symbol-placement 为 line 时，图标的 x 轴和线对齐
  // --- viewport：图标的 x 轴和视口的 x 轴对齐
  // --- auto：当 symbol-placement 为 point 时，和 viewport 一致；当 symbol-placement 为 line 时，和 map 一致
  'icon-pitch-alignment': 'auto', // 地图倾斜时图标的对齐方式（可选，可选值为 map、viewport、auto，默认值为 auto）
  // --- map：图标的 x 轴与地图平面对齐
  // --- viewport：图标的 x 轴和视口的 x 轴对齐
  // --- auto：当 symbol-placement 为 point 时，和 viewport 一致；当 symbol-placement 为 line 时，和 map 一致

  // 文本类属性（需要指定 text-field）
  'text-rotation-alignment': 'auto', // 与 icon-rotation-alignment 类似
  'text-pitch-alignment': 'auto', // 与 icon-pitch-alignment 类似
  'text-field': '', // 文本所对应的字段（可选，默认值为 ""）
  'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'], // 文本的字体集合（可选，默认值为 ["Open Sans Regular","Arial Unicode MS Regular"]）
  'text-size': 16, // 文本的大小（可选，默认值为 16，单位：像素）
  'text-max-width': 10, // 文本的最大宽度，超过则折行（可选，默认值为 10，单位：ems）
  'text-line-height': 1.2, // 文本的行高（可选，默认值为 1.2，单位：ems）
  'text-letter-spacing': 0, // 文本的字符间距（可选，默认值为 0，单位：ems）
  'text-justify': 'center', // 文本的水平对齐方式（可选，可选值为 auto、left、center、right。默认值为 center）
  'text-anchor': 'center', // 文本与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center）
  'text-variable-anchor': 'center', // 与 text-anchor（优先级更高） 类似，有点不懂
  'text-max-angle': 45, // 当 symbol-placement 为 line 或 line-center 时，文本相邻字符的最大夹角，默认 45 度
  'text-rotate': 0, // 文本的顺时针旋转角度（可选，默认值为 0，单位：角度）
  'text-padding': 2, // 文本的外边距（可选，值 >= 0，默认值为 2。可用于碰撞检测）
  'text-keep-upright': false, // 当 icon-rotation-alignment 为 map，且 symbol-placement 为 line 或者 line-center 时，设置为 true 的话，可以避免文本上下颠倒
  'text-transform': 'none', // 文本大小写转换（可选，可选值为 none、uppercase、lowercase，默认值为 none）
  'text-offset': [0, 0], // 图标的偏移量（可选，默认值为 [0, 0]）
  'text-radial-offset': 0, // 文本的径向偏移量，优先级比 text-offset 高
  'text-allow-overlap': false, // 是否允许文本重叠（可选，默认值为 false。当值为 true 时，文本即使和其他符号触碰也会显示）
  'text-ignore-placement': false, // 是否忽略文本位置（可选，默认值为 false。当值为 true 时，其他符号即使与此文本触碰也会显示）
  'text-optional': false // 文本是否可不显示（可选，默认值为 false。当值为 true 时，如果文本与图标碰撞，则显示图标）
}

export const symbolPaint = {
  // 图标类属性（需要设置 icon-image）
  'icon-opacity': 1, // 图标的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
  'icon-color': '#000000', // 图标的颜色（可选，默认值为 #000000）
  'icon-halo-color': 'rgba(0,0,0,0)', // 图标的光晕颜色（可选，默认值为 rgba(0,0,0,0)）
  'icon-halo-width': 0, // 图标的光晕宽度（可选，值 >= 0，默认值为 0，单位：像素）
  'icon-halo-blur': 0, // 图标的光晕模糊宽度（可选，值 >= 0，默认值为 0，单位：像素）
  'icon-translate': [0, 0], // 图标的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
  'icon-translate-anchor': 'map', // 图标的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）

  // 文本类属性（需要设置 text-field）
  'text-opacity': 1, // 文本的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
  'text-color': '#000000', // 文本的颜色（可选，默认值为 #000000）
  'text-halo-color': 'rgba(0,0,0,0)', // 文本的光晕颜色（可选，默认值为 rgba(0,0,0,0)）
  'text-halo-width': 0, // 文本的光晕宽度（可选，值 >= 0，默认值为 0，单位：像素）
  'text-halo-blur': 0, // 文本的光晕模糊宽度（可选，值 >= 0，默认值为 0，单位：像素）
  'text-translate': [0, 0], // 文本的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
  'text-translate-anchor': 'map' // 文本的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
}

export const linePaintKeys = [
  'line-color',
  'line-width',
  'line-blur',
  'line-opacity',
  'line-pattern',
  'line-gap-width',
  'line-offset',
  'line-dasharray',
  'line-gradient',
  'line-translate',
  'line-translate-anchor'
] as const

export const lineLayoutKeys = [
  'line-cap',
  'line-join',
  'line-miter-limit',
  'line-round-limit'
] as const

export const circlePaintKeys = [
  'circle-radius',
  'circle-color',
  'circle-blur',
  'circle-opacity',
  'circle-translate',
  'circle-translate-anchor',
  'circle-pitch-scale',
  'circle-pitch-alignment',
  'circle-stroke-width',
  'circle-stroke-color',
  'circle-stroke-opacity'
] as const

export const symbolLayoutKeys = [
  'symbol-placement',
  'symbol-spacing',
  'symbol-avoid-edges',
  'symbol-z-order',
  'icon-allow-overlap',
  'icon-ignore-placement',
  'icon-optional',
  'icon-rotation-alignment',
  'icon-size',
  'icon-text-fit',
  'icon-text-fit-padding',
  'icon-image',
  'icon-rotate',
  'icon-padding',
  'icon-keep-upright',
  'icon-offset',
  'icon-anchor',
  'icon-pitch-alignment',
  'text-pitch-alignment',
  'text-rotation-alignment',
  'text-field',
  'text-font',
  'text-size',
  'text-max-width',
  'text-line-height',
  'text-letter-spacing',
  'text-justify',
  'text-anchor',
  'text-max-angle',
  'text-rotate',
  'text-padding',
  'text-keep-upright',
  'text-transform',
  'text-offset',
  'text-allow-overlap',
  'text-ignore-placement',
  'text-optional',
  'text-radial-offset',
  'text-variable-anchor',
  'text-writing-mode'
] as const

export const symbolPaintKeys = [
  'icon-opacity',
  'icon-color',
  'icon-halo-color',
  'icon-halo-width',
  'icon-halo-blur',
  'icon-translate',
  'icon-translate-anchor',
  'text-opacity',
  'text-color',
  'text-halo-color',
  'text-halo-width',
  'text-halo-blur',
  'text-translate',
  'text-translate-anchor'
] as const

export const textLayoutKeys = [
  'text-pitch-alignment',
  'text-rotation-alignment',
  'text-field',
  'text-font',
  'text-size',
  'text-max-width',
  'text-line-height',
  'text-letter-spacing',
  'text-justify',
  'text-anchor',
  'text-max-angle',
  'text-rotate',
  'text-padding',
  'text-keep-upright',
  'text-transform',
  'text-offset',
  'text-allow-overlap',
  'text-ignore-placement',
  'text-optional',
  'text-radial-offset',
  'text-variable-anchor',
  'text-writing-mode'
] as const

export const textPaintKeys = [
  'text-opacity',
  'text-color',
  'text-halo-color',
  'text-halo-width',
  'text-halo-blur',
  'text-translate',
  'text-translate-anchor'
] as const

export const fillExtrusionPaintKeys = [
  'fill-extrusion-opacity',
  'fill-extrusion-pattern',
  'fill-extrusion-color',
  'fill-extrusion-translate',
  'fill-extrusion-translate-anchor',
  'fill-extrusion-height',
  'fill-extrusion-base',
  'fill-extrusion-vertical-gradient'
] as const
