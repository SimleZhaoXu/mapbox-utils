import { HeatmapLayer } from 'mapbox-utils'
import { getPointGeoJson, getPointData } from '@/utils/data'
export default function useHeatmapLayerTest() {
  const heatmapLayer = new HeatmapLayer({
    data: getPointGeoJson(getPointData(1000)),
    style: {
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 13, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0, 0, 255, 0)',
        0.1,
        'royalblue',
        0.3,
        'cyan',
        0.5,
        'lime',
        0.7,
        'yellow',
        1,
        'red'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 13, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 0]
    },
    fitBoundsOptions: {
      padding: 20
    }
  })

  return {
    layer: heatmapLayer,
    iconList: []
  }
}
