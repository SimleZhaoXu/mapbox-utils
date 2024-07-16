# Sources

每个数据源 `source` 都有一个 `type` 属性，用于指定其具体的类型：

- `vector`：矢量
- `raster`：栅格
- `geojson`：[GeoJSON](https://geojson.org/) 数据源
- `image`：图片
- `video`：视频

## vector

`vector`：矢量切片数据源

```json
{
  "sources": {
    "vector-source": {
      "type": "vector", // 类型（必填）
      "url": "mapbox://mapbox.mapbox-streets-v6", // TileJSON 的请求地址（可选）
      "tiles": [
        // 用于指定一个或多个切片数据源的请求地址（可选，和 TileJSON 中的 tiles 属性一致）
        "http://a.example.com/tiles/{z}/{x}/{y}.pbf",
        "http://b.example.com/tiles/{z}/{x}/{y}.pbf"
      ],
      "bounds": [-180, -85.051129, 180, 85.051129], // 边界坐标点（可选，用于限定切片的显示范围，默认值为 [-180,-85.051129,180,85.051129]）
      "scheme": "xyz", // 切片坐标系方案（可选，可选值为 xyz、tms，默认值为 xyz）
      "minzoom": 0, // 最小层级（可选，默认值为 0）
      "maxzoom": 22, // 最大层级（可选，默认值为 22）
      "attribution": "" // 属性信息（可选，用于地图展示时给用户看的一些信息）
    }
  }
}
```

## raster

`raster`：栅格切片数据源（相比 `vector` 多了一个属性 `tileSize`）

```json
{
  "sources": {
    "raster-source": {
      "type": "raster", // 类型（必填）
      "url": "mapbox://mapbox.satellite", // TileJSON 的请求地址（可选）
      "tiles": [
        // 用于指定一个或多个切片数据源的请求地址（可选，和 TileJSON 中的 tiles 属性一致）
        "http://a.example.com/tiles/{z}/{x}/{y}.pbf",
        "http://b.example.com/tiles/{z}/{x}/{y}.pbf"
      ],
      "bounds": [-180, -85.051129, 180, 85.051129], // 边界坐标点（可选，用于限定切片的显示范围，默认值为 [-180,-85.051129,180,85.051129]）
      "scheme": "xyz", // 切片坐标系方案（可选，可选值为 xyz、tms，默认值为 xyz）
      "minzoom": 0, // 最小层级（可选，默认值为 0）
      "maxzoom": 22, // 最大层级（可选，默认值为 22）
      "attribution": "", // 属性信息（可选，用于地图展示时给用户看的一些信息）
      "tileSize": 256 // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
    }
  }
}
```

## geojson

`geojson`：[GeoJSON](https://geojson.org/) 数据源（数据必须通过 `data` 属性指定，`data` 属性值就是一个 `GeoJSON` 或者 `GeoJSON` 的请求地址）

```json
{
  "sources": {
    "geojson-source": {
      "type": "geojson", // 类型（必填）
      "data": {
        // 数据（可选，值必须为一个 GeoJSON 或者 GeoJSON 的请求地址）
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.0323, 38.9131]
        },
        "properties": {
          "title": "Mapbox DC",
          "marker-symbol": "monument"
        }
      },
      // "data": "./lines.geojson",
      "maxzoom": 22, // 最大层级（可选，默认值为 22）
      "attribution": "", // 属性信息（可选，用于地图展示时给用户看的一些信息）
      "buffer": 128, // 切片缓存区大小（可选，取值范围为 0 ~ 512，默认值为 128，如果取值为 512 则代表和切片大小一样）
      "tolerance": 0.375, // 简化力度（可选，值越大简化力度越强，几何顶点越少，加载速度越快，默认值为 0.375）
      "cluster": false, // 是否开启聚类（可选，用于将多个点聚类到一个个的群组，默认值为 false）
      "clusterRadius": 50, // 每个群组的的半径（可选，默认值为 50）
      "clusterMaxZoom": 12, // 每个群组的最大层级（大于指定的层级将不显示聚类的群组）
      "lineMetrics": false, // 是否计算线的距离度量（需要 layer 指定 line-gradient）
      "generateId": false // 是否自动生成每个要素生成属性 id 的值
    }
  }
}
```

## image

`image`：图片数据源

```json
{
  "sources": {
    "image-source": {
      "type": "image", // 类型（必填）
      "url": "https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif", // 图片的请求地址（必填）
      "coordinates": [
        // 坐标点集合（必填，指定要显示图片的区域）
        [-80.425, 46.437],
        [-71.516, 46.437],
        [-71.516, 37.936],
        [-80.425, 37.936]
      ]
    }
  }
}
```

## video

`video`：视频数据源

```json
{
  "sources": {
    "video-source": {
      "type": "video", // 类型（必填）
      "urls": [
        // 一个或多个视频的请求地址（必填，指定多个是为了支持多种视频格式，按优先顺序排序）
        "https://static-assets.mapbox.com/mapbox-gl-js/drone.mp4",
        "https://static-assets.mapbox.com/mapbox-gl-js/drone.webm"
      ],
      "coordinates": [
        // 坐标点集合（必填，指定要显示视频的区域）
        [-80.425, 46.437],
        [-71.516, 46.437],
        [-71.516, 37.936],
        [-80.425, 37.936]
      ]
    }
  }
}
```