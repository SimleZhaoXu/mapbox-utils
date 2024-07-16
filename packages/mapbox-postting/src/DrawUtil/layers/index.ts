type OmitProperty = 'source' | 'source-layer'
export type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.LineLayer, OmitProperty>
  | Omit<mapboxgl.FillLayer, OmitProperty>
const layers: Array<LayerType> = [
  // 多边形填充
  {
    id: 'mapbox-postting-draw-util-fill-inactive',
    type: 'fill',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.3
    }
  },
  // 多边形描边
  {
    id: 'mapbox-postting-draw-util-border-inactive',
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
    id: 'mapbox-postting-draw-util-line-inactive',
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
  // 点
  {
    id: 'mapbox-postting-draw-util-point-active',
    type: 'circle',
    filter: ['all', ['==', 'origin', 'point'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': '#44cef6',
      'circle-stroke-width': 2
    }
  },
  // 多边形填充
  {
    id: 'mapbox-postting-draw-util-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#44cef6',
      'fill-opacity': 0.4
    }
  },
  {
    id: 'mapbox-postting-draw-util-border-active',
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
  {
    id: 'mapbox-postting-draw-util-line-active',
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
  {
    id: 'mapbox-postting-draw-util-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Point'], ['==', 'type', 'vertex']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': '#44cef6',
      'circle-stroke-width': 2
    }
  },
  // 圆心
  {
    id: 'mapbox-postting-draw-util-circle-center-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['==', 'type', 'circle-center']
    ],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': '#44cef6',
      'circle-stroke-width': 2
    }
  }
]

export default layers
