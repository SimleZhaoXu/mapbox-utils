export default `
let map: mapboxgl.Map
let areaMeasurer: AreaMeasurer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  areaMeasurer = new AreaMeasurer({
    multiple: false
  })
  areaMeasurer.addTo(map)
  areaMeasurer.enable()
  areaMeasurer.on('complete', (e) => {
    console.log(e)
  })

  areaMeasurer.on('delete', (e) => {
    console.log(e)
  })
}`
