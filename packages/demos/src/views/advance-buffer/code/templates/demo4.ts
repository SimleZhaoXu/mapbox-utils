export default `
let map: mapboxgl.Map
let advanceBuffer: AdvanceBuffer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  advanceBuffer = new AdvanceBuffer({
    multiple: true
  })
  advanceBuffer.addTo(map)
  advanceBuffer.changeMode(AdvanceBuffer.MODE_TYPE.POLYGON)
  advanceBuffer.on('add', (e) => {
    console.log(e)
  })
}`
