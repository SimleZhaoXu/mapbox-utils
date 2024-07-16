import { DistanceMeasurer } from 'mapbox-utils'
import { ref } from 'vue'
export default function useDistanceMeasurer() {
  const distanceMeasurer = new DistanceMeasurer({
    multiple: true
  })

  distanceMeasurer.on('complete', (e) => {
    console.log(e)

    console.log(distanceMeasurer.getAllPath())
  })

  distanceMeasurer.on('delete', (e) => {
    console.log(e)
    console.log(distanceMeasurer.getAllPath())
  })

  const buttonList = ref([
    {
      label: '启用',
      handler: () => {
        distanceMeasurer.enable()
      }
    },
    {
      label: '禁用',
      handler: () => {
        distanceMeasurer.disable()
      }
    },
    {
      label: '清除',
      handler: () => {
        distanceMeasurer.clear()
      }
    },
    {
      label: '获取',
      handler: () => {
        console.log(distanceMeasurer.getAllPath())
      }
    }
  ])

  return {
    layer: distanceMeasurer,
    iconList: [],
    buttonList
  }
}
