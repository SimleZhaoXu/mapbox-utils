import { AdvanceCarTrack } from 'mapbox-utils'
import data from './data'
import dataNoTime from './data-no-timestamp'
import { ref } from 'vue'
export default function useAdvanceCarTrackTest() {
  const carTrack = new AdvanceCarTrack({
    // @ts-ignore
    data,
    layerPool: {
      fullPath: {
        type: 'line',
        paint: {
          'line-color': '#ccc',
          'line-width': 3
        }
      },
      currentPath: {
        type: 'line',
        paint: {
          'line-color': '#f00',
          'line-width': 3
        }
      },
      circleCar: {
        type: 'circle',
        paint: {
          'circle-color': '#f00',
          'circle-radius': 3,
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2
        }
      },
      node: {
        type: 'circle',
        paint: {
          'circle-radius': 5,
          'circle-color': '#fff'
        }
      }
      // symbolCar: {
      //   type: 'symbol',
      //   layout: {
      //     'icon-image': 'airport',
      //     'icon-size': 2,
      //     'icon-rotate': ['get', 'bearing'],
      //     'icon-ignore-placement': true,
      //     'icon-allow-overlap': true,
      //     'icon-rotation-alignment': 'map'
      //   }
      // }
    },
    fullPathLayers: ['fullPath'],
    currentPathLayers: ['currentPath'],
    carLayers: ['circleCar'],
    nodeLayers: ['node'],
    speed: 100,
    fitBoundsOptions: true
  })

  const buttonList = ref([
    {
      label: '播放',
      handler: () => {
        carTrack.play()
      }
    },
    {
      label: '暂停',
      handler: () => {
        carTrack.pause()
      }
    },
    {
      label: '停止',
      handler: () => {
        carTrack.stop()
      }
    },
    {
      label: '数据1(含有事件戳)',
      handler: () => {
        // @ts-ignore
        carTrack.setData(data)
      }
    },
    {
      label: '数据2(无时间戳)',
      handler: () => {
        // @ts-ignore
        carTrack.setData(dataNoTime)
      }
    },
    {
      label: '数据3(空数据)',
      handler: () => {
        // @ts-ignore
        carTrack.setData(null)
      }
    },
    {
      label: 'fitBounds',
      handler: () => {
        carTrack.fitBounds()
      }
    }
  ])
  return {
    layer: carTrack,
    iconList: [],
    buttonList
  }
}
