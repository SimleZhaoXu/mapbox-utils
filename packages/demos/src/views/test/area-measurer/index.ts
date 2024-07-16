import { AreaMeasurer } from 'mapbox-utils'
import { ref } from 'vue'
export default function useAreaMeasurer() {
  const areaMeasurer = new AreaMeasurer({
    multiple: true
  })

  areaMeasurer.on('complete', (e) => {
    console.log(e)

    console.log(areaMeasurer.getAllArea())
  })

  areaMeasurer.on('delete', (e) => {
    console.log(e)
    console.log(areaMeasurer.getAllArea())
  })

  const buttonList = ref([
    {
      label: '启用',
      handler: () => {
        areaMeasurer.enable()
      }
    },
    {
      label: '禁用',
      handler: () => {
        areaMeasurer.disable()
      }
    },
    {
      label: '清除',
      handler: () => {
        areaMeasurer.clear()
      }
    },
    {
      label: '获取',
      handler: () => {
        console.log(areaMeasurer.getAllArea())
      }
    }
  ])

  return {
    layer: areaMeasurer,
    iconList: [],
    buttonList
  }
}
