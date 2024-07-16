type OmitProperty = 'source' | 'source-layer'
export type LayerType =
  | Omit<mapboxgl.CircleLayer, OmitProperty>
  | Omit<mapboxgl.LineLayer, OmitProperty>
const layers: Array<LayerType> = [
  {
    id: 'mapbox-postting-distance-measure-line-inactive',
    type: 'line',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString']],
    paint: {
      'line-color': 'rgb(255, 77, 79)',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  {
    id: 'mapbox-postting-distance-measure-vertex-inactive',
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
    id: 'mapbox-postting-distance-measure-line-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'LineString']],
    paint: {
      'line-color': 'rgb(255, 77, 79)',
      'line-opacity': 0.8,
      'line-width': 2
    }
  },
  {
    id: 'mapbox-postting-distance-measure-vertex-active',
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
