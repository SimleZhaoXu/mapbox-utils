import type mapboxgl from 'mapbox-gl'
export default class PulsingDot {
  map: mapboxgl.Map | null
  width: number
  height: number
  size: number
  data: Uint8ClampedArray
  r: number
  g: number
  b: number
  context: CanvasRenderingContext2D | null
  constructor(size = 100, { r = 255, g = 0, b = 0 }) {
    this.width = size
    this.height = size
    this.size = size
    this.data = new Uint8ClampedArray(size * size * 4)
    this.context = null
    this.map = null
    this.r = r
    this.g = g
    this.b = b
  }

  onAdd(map: mapboxgl.Map) {
    this.map = map
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.context = canvas.getContext('2d')
  }

  onRemove() {
    this.map = null
  }

  render() {
    const duration = 1000
    const t = (performance.now() % duration) / duration

    const radius = (this.size / 2) * 0.3
    const outerRadius = (this.size / 2) * 0.7 * t + radius
    const context = this.context!

    context.clearRect(0, 0, this.width, this.height)
    context.beginPath()
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
    context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${1 - t})`
    context.fill()

    context.beginPath()
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
    context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, 1)`
    context.strokeStyle = 'white'
    context.lineWidth = 2 + 4 * (1 - t)
    context.fill()
    context.stroke()

    // 从canvas中获取图片
    this.data = context.getImageData(0, 0, this.width, this.height).data
    this.map?.triggerRepaint()
    return true
  }
}
