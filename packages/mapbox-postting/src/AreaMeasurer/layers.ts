type OmitProperty = 'source' | 'source-layer'
export type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.LineLayer, OmitProperty>
  | Omit<mapboxgl.FillLayer, OmitProperty>
const layers: Array<LayerType> = [
  {
    id: 'mapbox-postting-area-measurer-fill-inactive',
    type: 'fill',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': 'rgb(255, 77, 79)',
      'fill-opacity': 0.3
    }
  },
  {
    id: 'mapbox-postting-area-measurer-line-inactive',
    type: 'line',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString']],
    paint: {
      'line-color': 'rgb(255, 77, 79)',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  {
    id: 'mapbox-postting-area-measurer-vertex-inactive',
    type: 'circle',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': 'rgb(255, 77, 79)',
      'circle-stroke-width': 2
    }
  },
  {
    id: 'mapbox-postting-area-measurer-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': 'rgb(255, 77, 79)',
      'fill-opacity': 0.4
    }
  },
  {
    id: 'mapbox-postting-area-measurer-line-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'LineString']],
    paint: {
      'line-color': 'rgb(255, 77, 79)',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  {
    id: 'mapbox-postting-area-measurer-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': '#fff',
      'circle-radius': 3,
      'circle-stroke-color': 'rgb(255, 77, 79)',
      'circle-stroke-width': 2
    }
  }
]

export default layers
