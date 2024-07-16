export default `
let map: mapboxgl.Map
let drawUtil: DrawUtil
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  drawUtil = new DrawUtil({
    multiple: true
  })
  drawUtil.addTo(map)
  drawUtil.changeMode(DrawUtil.MODE_TYPE.DRAW_POLYGON)
  drawUtil.on('add', (e) => {
    console.log(e)
  })
}`
