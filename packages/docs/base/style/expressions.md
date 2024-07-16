# Expressions

`Expressions`：表达式集合（并非 `style` 的属性，只是 `layer` 的任何 `layout` 布局属性和 `paint` 绘制属性，以及 `filter` 属性等，它们的值都可以指定成一个表达式 `Expression`）
一个 `Expression` 定义了一个公式，总体来说可以将公式中的操作符分为以下 `5` 种：

- `Mathematical operators`：数学操作符，用来对数值进行数学运算
- `Logical operators`：逻辑操作符，用来计算布尔值和条件控制
- `String operators`：字符串操作符，用来操作字符串
- `Data operators`：数据操作符，用来访问数据源中的要素 feature
- `Camera operators`：照相机操作符，用来访问当前地图视图的各个参数

`Expressions` 是 `Expression` 的集合。而 `Expression` 是以 `JSON` 数组的形式来表示的，数组的第一个元素是 `Expression` 的操作符的名称，后续的元素表示操作的参数（也可以是一个 `Expression）。`

```js
[expression_name, argument_0, argument_1, expression_1, ...]
```

由以上 `5` 种操作符，相应地可以推出 `5` 种表达式集合 `Expressions`，并且相互之间可以组合使用：

`Mathematical expressions`
`Logical expressions`
`String expressions`
`Data expressions`
`Camera expressions`

这里主要讲述 `Data expressions` 和 `Camera expressions。`

## Data expressions

一个 data expression 是可以访问要素数据的任何表达式。而这些表达式使用了以下至少一种数据操作符：

- `get`：用于获取要素的属性值，格式为 ["get", "property_name"]，余下具体的可以看 [Expression reference](#expression-reference)
- `has`
- `id`
- `geometry-type`
- `properties`
- `feature-state`

通过 `data expression` 可以实现区分同一个图层中的不同要素，并以不同的形式呈现。比如设置颜色 `circle-color`：

```json
{
  "circle-color": [
    "rgb", // rgb 操作符，用于表达颜色：rgb(red, green, blue)
    ["get", "temperature"], // 获取属性 temperature 的值，作为 rgb 中的 red 的值
    0, // rgb 中的 green 始终为 0
    ["-", 100, ["get", "temperature"]] // 用 100 减去属性 temperature 的值，作为 rgb 中的 blue 的值
  ]
}
```

::: warning 注意
需要注意的是，并非所有的 `layout` 布局类属性和 `paint` 绘制类属性都支持 `data expression`：

具体可以看 `SDK Support` 中的 `data-driven styling` 那一行；

而且使用了 `feature-state` 操作符的 `data expression` 仅在 `paint` 绘制类属性中可用。
:::

以下是官网中记录的暂不支持数据表达式 `data expression` 的属性：

```js
[
  "fill-antialias",
  "fill-translate",
  "fill-translate-anchor",
  "line-cap",
  "line-miter-limit",
  "line-round-limit",
  "visibility",
  "line-translate",
  "line-translate-anchor",
  "line-dasharray",
  "line-gradient",
  "symbol-placement",
  "symbol-spacing",
  "symbol-avoid-edges",
  "symbol-z-order",
  "icon-allow-overlap",
  "icon-ignore-placement",
  "icon-optional",
  "icon-rotation-alignment",
  "icon-text-fit",
  "icon-text-fit-padding",
  "icon-padding",
  "icon-keep-upright",
  "icon-pitch-alignment",
  "text-pitch-alignment",
  "text-rotation-alignment",
  "text-line-height",
  "text-variable-anchor",
  "text-max-angle",
  "text-padding",
  "text-keep-upright",
  "text-allow-overlap",
  "text-ignore-placement",
  "text-optional",
  "icon-translate",
  "icon-translate-anchor",
  "text-translate",
  "text-translate-anchor",
  "raster-opacity",
  "raster-hue-rotate",
  "raster-brightness-min",
  "raster-brightness-max",
  "raster-saturation",
  "raster-contrast",
  "raster-resampling",
  "raster-fade-duration",
  "circle-translate",
  "circle-translate-anchor",
  "circle-pitch-scale",
  "circle-pitch-alignment",
  "fill-extrusion-translate",
  "fill-extrusion-translate-anchor",
  "heatmap-intensity",
  "heatmap-color",
  "heatmap-opacity",
];
```

## Camera expressions

一个 `camera expression` 是使用了 `zoom` 操作符的任何表达式。

通过 `camera expression` 可以实现图层 `layer` 根据地图的缩放层级 `zoom` 有不同的表现。 比如设置半径 `circle-radius`：

```json
{
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"], // 通过 interpolate 操作符，为 circle-radius 和 zoom 之间定义一种线性关系 linear
    5,
    1, // 当 zoom <= 5 时，circle-radius 为 1（单位：px）
    // 当 5 < zoom < 10 时，circle-radius 的值在 1 ~ 5 之间线性分布
    10,
    5 // 当 zoom >= 10 时，circle-radius 为 5（单位：px）
  ]
}
```

所有可以使用 `Expression` 的属性都支持 `camera expression`。不过当用于 `layout` 布局类属性和 `paint` 绘制类属性时，必须是以下几种格式：

```js
[ "interpolate", interpolation, ["zoom"], ... ]
```

或

```js
[ "step", ["zoom"], ... ]
```

或

```js
[
  "let",
  ... variable bindings...,
  [ "interpolate", interpolation, ["zoom"], ... ]
]
```

或

```js
[
  "let",
  ... variable bindings...,
  [ "step", ["zoom"], ... ]
]
```

因为 `["zoom"]` 在 `layout` 布局类属性和 `paint` 绘制类属性中仅作为 `interpolate` 或 `step` 操作的输入参数。

::: warning 注意
需要注意，`layout` 布局类属性和 `paint` 绘制类属性有一个很重要的区别：

`layout` 布局类属性中使用的 `camera expression` 只有在 `zoom` 的值是 `整数变化` 时才会重新计算。

`paint` 绘制类型属性中使用的 `camera expression` 在 `zoom` 的值是 `小数变化` 时也会重新计算。比如 `zoom` 从 `4.1` 变为 `4.6`。
:::

## Expression reference {#expression-reference}

前面介绍了表达式集合 `Expressions`，简单地讲述了其中的 `Data expressions` 和 `Camera expressions`，而这些表达式里涉及和很多的操作符，这里就对每个操作符进行分类介绍，作为表达式的参考 `Expression reference`。

主要分为以下几类操作符：

- `Types`
- `Feature data`
- `Lookup`
- `Decision`
- `Decision`
- `Variable binding`
- `String`
- `Color`
- `Math`
- `Zoom`
- `Heatmap`

### (1) Types

`Types`：这类操作符用于 `断言` 和 `转换` 数据的类型，包含的操作符如下：

```js
// (1) string  用于断言输入值是字符串。其对应的表达式有两种形式
["string", value]: string
["string", value, fallback: value, fallback: value, ...]: string

// (2) boolean  用于断言输入的值是布尔值，如果不是则会报错。其对应的表达式有两种形式
["boolean", value]: boolean
["boolean", value, fallback: value, fallback: value, ...]: boolean

// (3) number  用于断言输入值是数值，如果不是则会报错。其对应的表达式有两种形式
["number", value]: number
["number", value, fallback: value, fallback: value, ...]: number

// (4) number-format  用于将数值转换为指定格式的字符串
["number-format",
  input: number,
  options: { "locale": string, "currency": string, "min-fraction-digits": number, "max-fraction-digits": number }
]: string

// (5) object  用于断言输入值是对象。其对应的表达式有两种形式
["object", value]: object
["object", value, fallback: value, fallback: value, ...]: object

// (6) array  用于断言输入的值是数组，如果不是则会被终止。其对应的表达式有三种形式
["array", value]: array
["array", type: "string" | "number" | "boolean", value]: array<type>
["array", type: "string" | "number" | "boolean", N: number (literal), value]: array<type, N>

// (7) literal  用于提供数组或对象的字面量
["literal", [...] (JSON array literal)]: array<T, N>
["literal", {...} (JSON object literal)]: Object

// (8) collator  通过设定本地 IETF 语言标记校对比较符
["collator", { "case-sensitive": boolean, "diacritic-sensitive": boolean, "locale": string }]: collator

// (9) format  用于格式化特定文本的大小和字体等。常见于对同个属性字段 text-field 的不同值的处理
["format",
  input_1: string, options_1: { "font-scale": number, "text-font": array<string> },
  ...,
  input_n: string, options_n: { "font-scale": number, "text-font": array<string> }
]: formatted

// (10) to-string  用于转换输入值为字符串
["to-string", value]: string

// (11) to-boolean  用于转换输入值为布尔值
["to-boolean", value]: boolean

// (12) to-number  用于转换输入值为数值
["to-number", value, fallback: value, fallback: value, ...]: number

// (13) to-color  用于转换输入值为颜色
["to-color", value, fallback: value, fallback: value, ...]: color

// (14) typeof  用于得到输入值的类型
["typeof", value]: string
```

### (2) Feature data

`Feature data`：这类操作符用于操作要素的数据。

```js
// (1) accumulated  获取一个群组的累计值。只限于 geojson 类型的数据源，并且设置了 cluster
["accumulated"]: value

// (2) feature-state  从当前的要素状态获取属性值。要素状态不是数据源里自带的，只能通过编程设置
["feature-state", string]: value

// (3) geometry-type  获取要素的几何类型。如 Point、MultiPoint、LineString、MultiLineString、Polygon、MultiPolygon
["geometry-type"]: string

// (4) id  获取要素的 id 属性值
["id"]: value

// (5) line-progress  获取渐变线的进度。只能用于设置了 line-gradient 的
["line-progress"]: number

// (6) properties  获取要素的属性对象。直接用表达式 ["get", "property_name"] 效率更高
["properties"]: object

```

### (4) Decision

`Decision`：这类操作符用于条件判断

```js
// (1) !  取反
["!", boolean]: boolean

// (2) !=  判断两数是否相等
["!=", value, value]: boolean
["!=", value, value, collator]: boolean

// (3) <  判断第一个数是否小于第二个数
["<", value, value]: boolean
["<", value, value, collator]: boolean

// (4) <=  判断第一个数是否小于等于第二个数
["<=", value, value]: boolean
["<=", value, value, collator]: boolean

// (5) ==  判断第一个数是否等于第二个数
["==", value, value]: boolean
["==", value, value, collator]: boolean

// (6) >  判断第一个数是否大于第二个数
[">", value, value]: boolean
[">", value, value, collator]: boolean

// (7) >=  判断第一个数是否大于等于第二个数
[">=", value, value]: boolean
[">=", value, value, collator]: boolean

// (8) all  判断是否所有的都为 true
["all", boolean, boolean]: boolean
["all", boolean, boolean, ...]: boolean

// (9) any  判断是否有为 true 的
["any", boolean, boolean]: boolean
["any", boolean, boolean, ...]: boolean

// (10) case  满足指定条件，则返回指定的数据
["case",
    condition: boolean, output: OutputType,
    condition: boolean, output: OutputType,
    ...,
    fallback: OutputType
]: OutputType

// (11) coalesce  计算每个的值，直到获取到非空值，然后返回那个值
["coalesce", OutputType, OutputType, ...]: OutputType

// (12) match  当输入值（比如从属性中获取 ["get", "property_name"] ）与指定的值匹配时，返回相应的值。
["match",
    input: InputType (number or string),
    label: InputType | [InputType, InputType, ...], output: OutputType,
    label: InputType | [InputType, InputType, ...], output: OutputType,
    ...,
    fallback: OutputType
]: OutputType

```

### (5) Ramps, scales, curves

`Ramps`，`scales`，`curves` ：这类操作符用于渐变、缩放、曲线等特殊效果的设置。

```js
// (1) interpolate  通过在输入值和输出值之间进行插值，来生成持续、平滑的数据。输入值必须是数字，并且各个断点的值按升序排序，输出值可能是数字、数组或者颜色
["interpolate",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType (number, array<number>, or Color)

// (2) interpolate-hcl  类似 interpolate，不过输出值必须是颜色，并且插值属于 Hue-Chroma-Luminance 颜色空间
["interpolate-hcl",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: Color,
    stop_input_n: number, stop_output_n: Color, ...
]: Color

// (3) interpolate-lab  类似 interpolate，不过输出值必须是颜色，并且插值属于 CIELAB 颜色空间
["interpolate-lab",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: Color,
    stop_input_n: number, stop_output_n: Color, ...
]: Color

// (4) step  通过分段函数，来生成离散的、逐步的数据。
["step",
    input: number,
    stop_output_0: OutputType,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType

```

### (6) Variable binding

`Variable binding`：这类操作符用于变量绑定。

```js
// (1) let  绑定表达式给指定的变量
["let",
    string (alphanumeric literal), any, string (alphanumeric literal), any, ...,
    OutputType
]: OutputType

// (2) var  使用通过 let 绑定的变量
["var", previously bound variable name]: the type of the bound expression

```

### (7) String

`String`：这类操作符用于操作字符串。

```js
// (1) concat  用于连接各个输入的字符串，得到连接后的字符串
["concat", value, value, ...]: string

// (2) downcase  将字符串转为小写
["downcase", string]: string

// (3) upcase  将字符串转为大写
["upcase", string]: string

// (4) resolved-locale  获取通过 collator 设置的 IETF 语言标记
["resolved-locale", collator]: string

// (5) is-supported-script 判断输入的字符串是否清晰（额...有点没明白）
["is-supported-script", string]: boolean

```

### (8) Color

```js
// (1) rgb  创建由 red、green、blue 组成的 rgb 颜色。每个值的取值范围为 0 ~ 255
["rgb", number, number, number]: color

// (2) rgba  创建由 red、green、blue、alpha 组成的 rgba 颜色。除了 alpha 取值范围为 0 ~ 1 外，其他值的取值范围为 0 ~ 255
["rgba", number, number, number, number]: color

// (3) to-rgba  转换颜色为 rgba 颜色对应的数组 [red, green, blue, alpha]
["to-rgba", color]: array<number, 4>

```

### (9) Math

`Math`：这类操作符用于数学运算。

```js
// (1) +  取输入值的总和
["+", number, number, ...]: number

// (2) -  对于两个数，返回第一个数减去第二个数的结果；对于一个数，则返回 0 减去这个数的结果（相当于取相反数）
["-", number, number]: number
["-", number]: number

// (3) *  取输入值的乘积
["*", number, number, ...]: number

// (4) /  返回第一个数除以第二个数的结果（包含小数）
["/", number, number]: number

// (5) %  返回第一个数除以第二个数的余数
["%", number, number]: number

// (6) ^  返回第一个数的第二个数次方
["^", number, number]: number

// (7) abs  取绝对值
["abs", number]: number

// (8) acos  取反余弦值
["acos", number]: number

// (9) asin  取反正弦值
["asin", number]: number

// (10) atan  取反正切值
["atan", number]: number

// (11) ceil  取大于等于输入值的最大整数
["ceil", number]: number

// (12) cos  取余弦值
["cos", number]: number

// (13) e  取数学常数 e
["e"]: number

// (14) floor  取小于等于输入值的最大整数
["floor", number]: number

// (15) ln  取输入值的自然对数
["ln", number]: number

// (16) ln2  取数学常数 ln(2)
["ln2"]: number

// (17) log10  取输入值以 10 为底的对数
["log10", number]: number

// (18) log2  取输入值以 2 为底的对数
["log2", number]: number

// (19) max  取输入值中的最大值
["max", number, number, ...]: number

// (20) min  取输入值中的最小值
["min", number, number, ...]: number

// (21) pi  取圆周率 pi
["pi"]: number

// (22) round  取输入值四舍五入后的值
["round", number]: number

// (23) sin  取正弦值
["sin", number]: number

// (24) sqrt  取平方根
["sqrt", number]: number

// (25) tan  取正切值
["tan", number]: number

```

### (10) Zoom

`Zoom`：这类操作符只包含一个操作符 `zoom`，用于获取当前地图的缩放层级。

```js
["zoom"]: number
```

### (11) Heatmap

`Heatmap`：这类操作符只包含一个操作符 `heatmap-density`，用于获取热力图的密度（特定像素内有多少个数据点），只能在 `heatmap-color` 中使用。

```js
["heatmap-density"]: number
```
