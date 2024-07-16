type OmitProperty = 'source' | 'source-layer'
export type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.LineLayer, OmitProperty>
  | Omit<mapboxgl.FillLayer, OmitProperty>

// 选择显示基础图形
const layers: Array<LayerType> = [
  // 缓冲区填充
  {
    id: 'mapbox-postting-advance-buffer-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'origin', 'buffer']],
    paint: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.3
    }
  },
  // 缓冲区描边
  {
    id: 'mapbox-postting-advance-buffer-border',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'origin', 'buffer']],
    paint: {
      'line-color': '#44cef6',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  // 多边形填充
  {
    id: 'mapbox-postting-advance-buffer-polygon-fill-inactive',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', 'origin', 'polygon'],
      ['==', '$type', 'Polygon']
    ],
    paint: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.3
    }
  },
  // 多边形描边
  {
    id: 'mapbox-postting-advance-buffer-polygon-border-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'false'],
      ['==', 'type', 'border']
    ],
    paint: {
      'line-color': '#44cef6',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  // 线
  {
    id: 'mapbox-postting-advance-buffer-line-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'false'],
      ['==', 'origin', 'line']
    ],
    paint: {
      'line-color': '#44cef6',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  // 线或多边形的顶点，可根据origin:line/polygon进行区分
  {
    id: 'mapbox-postting-advance-buffer-vertex-inactive',
    type: 'circle',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'type', 'vertex']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': '#44cef6',
      'circle-stroke-width': 2
    }
  },
  // 点(圆心)
  {
    id: 'mapbox-postting-advance-buffer-point',
    type: 'circle',
    filter: ['all', ['==', 'origin', 'point'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': '#44cef6',
      'circle-stroke-width': 2
    }
  },
  // 多边形填充（绘制时）
  {
    id: 'mapbox-postting-advance-buffer-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.4
    }
  },
  // 多边形描边（绘制时）
  {
    id: 'mapbox-postting-advance-buffer-polygon-border-active',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true'],
      ['==', 'type', 'border']
    ],
    paint: {
      'line-color': '#44cef6',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  // 线（绘制时）
  {
    id: 'mapbox-postting-advance-buffer-line-active',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true'],
      ['==', 'origin', 'line']
    ],
    paint: {
      'line-color': '#44cef6',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  // 线或多边形的顶点（绘制时），可根据origin:line/polygon进行区分
  {
    id: 'mapbox-postting-advance-buffer-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Point'], ['==', 'type', 'vertex']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': '#44cef6',
      'circle-stroke-width': 2
    }
  }
]

export default layers
