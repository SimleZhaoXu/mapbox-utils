export default `
let map: mapboxgl.Map
let distanceMeasurer: DistanceMeasurer
const handleMapLoad = (val: mapboxgl.Map) => {
  map = val
  distanceMeasurer = new DistanceMeasurer({
    multiple: false
  })
  distanceMeasurer.addTo(map)
  distanceMeasurer.enable()
  distanceMeasurer.on('complete', (e) => {
    console.log(e)
  })

  distanceMeasurer.on('delete', (e) => {
    console.log(e)
  })
}`
