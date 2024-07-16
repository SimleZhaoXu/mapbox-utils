import { AdvanceLineLayer } from 'mapbox-utils'
import { getLineGeoJson, getLineData } from '@/utils/data'
import { getPolygonGeoJson, getAreaData } from '@/utils/data'
export default function useAdvanceLineLayerTest() {
  const advanceLineLayer = new AdvanceLineLayer({
    key: 'id',
    data: getLineGeoJson(getLineData(30)),
    // key: 'name',
    // data: getPolygonGeoJson(getAreaData(300)),
    lineMetrics: true,
    layerPool: {
      default: {
        type: 'line',
        paint: {
          'line-width': 4,
          // 'line-opacity': 0.3,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'rgba(255, 0, 0, 0.4)',
            1,
            'rgba(0, 255, 0, 0.4)'
          ]
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      },
      highlight: {
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#00ff00'
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      }
    },
    layers: ['default'],
    highlightTrigger: 'hover',
    highlightLayers: ['highlight'],
    fitBoundsOptions: true
  })
  return {
    layer: advanceLineLayer,
    iconList: []
  }
}
