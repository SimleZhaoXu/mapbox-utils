# Functions

前面介绍了表达式集合 `Expressions`，我们知道了 `layout` 布局类属性和 `paint` 绘制类属性的值都可以设为一个表达式 `Expression`。

同样地，函数 `Function` 也可以作为其 `layout`布局类属性和 `paint` 绘制类属性的属性值。

::: warning 注意
在使用 Function 作为属性值时，实际上是一个对象 {}
:::

`Functions` 是 `Function` 的集合。`Function` 可以用来根据 `地图缩放层级` 和 `地图要素的属性` 来控制地图要素的呈现。所以可以分为三类：

- `Zoom functions`
- `Property functions`
- `Zoom-and-property functions`

## Zoom functions

一个 `zoom function` 允许地图的呈现根据 `地图的缩放层级` 而改变。

```json
{
  "circle-radius": {
    "stops": [
      // 断点（除了 type 为 identity 外必填，由输入值和输出值为一组，作为数组的元素）
      [5, 1], // zoom 为 5 时，circle-radius 为 1 （单位：px）
      [10, 2] // zoom 为 10 时，circle-radius 为 2 （单位：px）
    ],
    "base": 1, // 插值计算的基数（可选，默认值为 1）
    "type": "interval", // 类型（可选，可选值为 identity、exponential、interval、categorical，默认值为 interval）
    // --- identity：一致型（将输入值作为输出值）
    // --- exponential：指数连续型（在断点之间生成插值）
    // --- interval：间隔型（输出值刚好小于输入值的一系列输出，呈阶梯状）
    // --- categorical：分类型（将和输入值一致的输出）
    "defaul": 1, // 默认值
    "colorSpace": "rgb" // 色彩空间（可选，可选值为 rgb、lab、hcl）
  }
}
```

## Property functions

一个 `property function` 允许地图的呈现根据 `地图要素的属性` 而改变。

```json
{
  "circle-color": {
    "property": "temperature", // 属性名（填写后 stops 的输入值就是对应的属性值）
    "stops": [
      // 断点（除了 type 为 identity 外必填，由输入值和输出值为一组，作为数组的元素）
      [0, "blue"], // 属性 temperature 的值为 0 时，circle-color 为 blue 蓝色
      [100, "red"] // 属性 temperature 的值为 100 时，circle-color 为 red 红色
    ],
    "base": 1, // 插值计算的基数（可选，默认值为 1）
    "type": "interval", // 类型（可选，可选值为 identity、exponential、interval、categorical，默认值为 interval）
    // --- identity：一致型（将输入值作为输出值）
    // --- exponential：指数连续型（在断点之间生成插值）
    // --- interval：间隔型（输出值刚好小于输入值的一系列输出，呈阶梯状）
    // --- categorical：分类型（将和输入值一致的输出）
    "defaul": "#000000", // 默认值
    "colorSpace": "rgb" // 色彩空间（可选，可选值为 rgb、lab、hcl）
  }
}
```

## Zoom-and-property functions

一个 `zoom-property function` 允许地图的呈现根据 `地图的缩放层级` 和 `地图要素的属性` 而改变。

```json
{
  "circle-radius": {
    "property": "rating",
    "stops": [
      [{ "zoom": 0, "value": 0 }, 0], // 当 zoom 为 0，且属性 rating 值为 0 时，circle-radius 为 0，依次类推
      [{ "zoom": 0, "value": 5 }, 5],
      [{ "zoom": 20, "value": 0 }, 0],
      [{ "zoom": 20, "value": 5 }, 20]
    ],
    "base": 1, // 插值计算的基数（可选，默认值为 1）
    "type": "interval", // 类型（可选，可选值为 identity、exponential、interval、categorical，默认值为 interval）
    // --- identity：一致型（将输入值作为输出值）
    // --- exponential：指数连续型（在断点之间生成插值）
    // --- interval：间隔型（输出值刚好小于输入值的一系列输出，呈阶梯状）
    // --- categorical：分类型（将和输入值一致的输出）
    "defaul": "#000000", // 默认值
    "colorSpace": "rgb" // 色彩空间（可选，可选值为 rgb、lab、hcl）
  }
}
```
