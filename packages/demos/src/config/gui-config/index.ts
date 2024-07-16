import FitBoundsConfig from './fit-bounds.json'
import CirclePointConfig from './circle-point.json'
import SymbolPointConfig from './symbol-point.json'
import MarkerPointConfig from './marker-point.json'
import SymbolClusterConfig from './symbol-cluster.json'
import LineConfig from './line.json'
import PolygonConfig from './polygon.json'
import BufferConfig from './buffer.json'
import CarTrackConfig from './car-track.json'
import PointPickerConfig from './point-picker.json'
import LinePickerConfig from './line-picker.json'
import PolygonAreaPickerConfig from './polygon-area-picker.json'
import RectAreaPickerConfig from './rect-area-picker.json'
import CircleAreaPickerConfig from './circle-area-picker.json'
import PrismoidConfig from './prismoid.json'
export const CirclePointGUIConfig = [...CirclePointConfig, ...FitBoundsConfig]
export const SymbolPointGUIConfig = [...SymbolPointConfig, ...FitBoundsConfig]
export const MarkerPointGUIConfig = [...MarkerPointConfig, ...FitBoundsConfig]
export const SymbolClusterGUIConfig = [...SymbolClusterConfig, ...FitBoundsConfig]
export const LineGUIConfig = [...LineConfig, ...FitBoundsConfig]
export const PolygonGUIConfig = [...PolygonConfig, ...FitBoundsConfig]
export const BufferGUIConfig = [...BufferConfig]
export const CarTrackGUIConfig = [...CarTrackConfig, ...FitBoundsConfig]
export const PointPickerGUIConfig = [...PointPickerConfig]
export const LinePickerGUIConfig = [...LinePickerConfig]
export const PolygonAreaPickerGUIConfig = [...PolygonAreaPickerConfig]
export const RectAreaPickerGUIConfig = [...RectAreaPickerConfig]
export const CircleAreaPickerGUIConfig = [...CircleAreaPickerConfig]
export const PrismoidGUIConfig = [...PrismoidConfig, ...FitBoundsConfig]
// interface ControllerItem {
//   name?: string
//   instanceType: 'folder' | 'controller'
//   propName: string
//   refFolder?: string
//   enableValue?: any
//   isArray?: boolean
//   index?: number
//   type?: 'number' | 'color' | 'select' | 'boolean' | 'switch'
//   min?: number
//   max?: number
//   step?: number
//   items?: any
//   controllers?: Array<ControllerItem>
// }

const folderMap = new Map<string, dat.GUI>()
const addController = (object: any, list: Array<any>, gui: dat.GUI, onFinishChange: () => void) => {
  list.forEach((item) => {
    if (item.instanceType === 'folder') {
      const name = item.name ?? item.propName
      const folder = gui.addFolder(name)
      folder.open()
      folderMap.set(name, folder)
      addController(object[item.propName], item.controllers, folder, onFinishChange)
    } else if (item.instanceType === 'controller') {
      let controller: dat.GUIController
      switch (item.type) {
        case 'color':
          controller = gui.addColor(object, item.propName)
          break
        case 'number':
          if (item.isArray) {
            controller = gui.add(object[item.propName], item.index, item.min, item.max, item.step)
          } else {
            controller = gui.add(object, item.propName, item.min, item.max, item.step)
          }
          break
        case 'select':
          controller = gui.add(object, item.propName, item.items)
          break
        default:
          controller = gui.add(object, item.propName)
          break
      }
      if (['text', 'select'].includes(item.type)) controller.listen()
      item.name && controller.name(item.name)
      let changed = false
      controller.onChange(() => {
        changed = true
      })
      controller.onFinishChange((val) => {
        if (!changed) return
        changed = false
        if (item.refFolder) {
          const folder = folderMap.get(item.refFolder)
          val === item.enableValue ? folder?.show() : folder?.hide()
        }
        onFinishChange()
      })
      if (item.refFolder) {
        setTimeout(() => {
          if (controller.getValue() !== item.enableValue) {
            folderMap.get(item.refFolder)?.hide()
          }
        })
      }
    }
  })
}

export const addOptionsGUI = (
  baseGUI: dat.GUI,
  options: any,
  guiConfig: Array<any>,
  onFinishChange: () => void
) => {
  const optionsGUI = baseGUI.addFolder('Options')
  optionsGUI.open()
  addController(options, guiConfig, optionsGUI, onFinishChange)
}
