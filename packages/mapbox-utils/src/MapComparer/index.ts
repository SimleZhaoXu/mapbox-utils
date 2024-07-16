import mapboxgl from 'mapbox-gl'
import { bindAll } from '../utils'

interface Options {
  container: HTMLElement | string
  horizontal?: boolean
  firstMapStyle: mapboxgl.MapboxOptions['style']
  secondMapStyle: mapboxgl.MapboxOptions['style']
  mapOptions: Omit<mapboxgl.MapboxOptions, 'style' | 'container'>
}
const isDOM =
  typeof HTMLElement === 'object'
    ? function (obj: any) {
        return obj instanceof HTMLElement
      }
    : function (obj: any) {
        return (
          obj &&
          typeof obj === 'object' &&
          (obj.nodeType === 1 || obj.nodeType === 9) &&
          typeof obj.nodeName === 'string'
        )
      }

function syncMaps(...rest: Array<mapboxgl.Map>) {
  if (arguments.length < 2) return
  let maps: Array<mapboxgl.Map> = []
  for (let i = 0; i < arguments.length; i++) {
    maps.push(rest[i])
  }

  let fns: Array<(e: any) => void> = []
  maps.forEach(function (map, index) {
    fns[index] = sync.bind(
      null,
      map,
      maps.filter(function (o, i) {
        return i !== index
      })
    )
  })

  function on() {
    maps.forEach(function (map, index) {
      map.on('move', fns[index])
    })
  }

  function off() {
    maps.forEach(function (map, index) {
      map.off('move', fns[index])
    })
  }

  function moveToMapPosition(master: mapboxgl.Map, clones: Array<mapboxgl.Map>) {
    const center = master.getCenter()
    const zoom = master.getZoom()
    const bearing = master.getBearing()
    const pitch = master.getPitch()

    clones.forEach(function (clone: mapboxgl.Map) {
      clone.jumpTo({
        center: center,
        zoom: zoom,
        bearing: bearing,
        pitch: pitch
      })
    })
  }

  function sync(master: mapboxgl.Map, clones: Array<mapboxgl.Map>) {
    off()
    moveToMapPosition(master, clones)
    on()
  }

  on()
  return function () {
    off()
    fns = []
    maps = []
  }
}
export default class MapComparer {
  private _container: HTMLElement
  private _firstMap: mapboxgl.Map
  private _secondMap: mapboxgl.Map
  private _horizontal: boolean
  private _swiper: HTMLElement
  private _controlContainer: HTMLElement
  private _mousemove: boolean
  private _bounds: DOMRect
  private _removed: boolean
  currentPosition: number

  get firstMap() {
    return this._firstMap
  }

  get secondMap() {
    return this._secondMap
  }

  constructor(options: Options) {
    this._removed = false
    this._horizontal = Boolean(options.horizontal)
    if (typeof options.container === 'string') {
      const cDom = document.querySelector(options.container) as HTMLElement
      if (cDom) {
        this._container = cDom
      } else {
        throw new Error('Invalid container specified. Must be CSS selector or HTML element.')
      }
    } else if (isDOM(options.container)) {
      this._container = options.container
    } else {
      throw new Error('Invalid container specified. Must be CSS selector or HTML element.')
    }

    this._container.classList.add('map-comparer-container')

    this._container.style.position = 'relative'

    const firstMapContainer = document.createElement('div')
    firstMapContainer.classList.add('before-map-container')
    firstMapContainer.style.position = 'absolute'
    firstMapContainer.style.width = '100%'
    firstMapContainer.style.height = '100%'
    this._container.appendChild(firstMapContainer)

    const secondMapContainer = document.createElement('div')
    secondMapContainer.classList.add('after-map-container')
    secondMapContainer.style.position = 'absolute'
    secondMapContainer.style.width = '100%'
    secondMapContainer.style.height = '100%'
    this._container.appendChild(secondMapContainer)

    // 分割线
    this._swiper = document.createElement('div')
    this._swiper.className = 'comparer-swiper'

    this._controlContainer = document.createElement('div')
    this._controlContainer.className = this._horizontal
      ? 'map-comparer-control comparer-control-horizontal'
      : 'map-comparer-control comparer-control-vertical'
    this._controlContainer.appendChild(this._swiper)

    this._container.appendChild(this._controlContainer)

    this._firstMap = new mapboxgl.Map({
      ...options.mapOptions,
      style: options.firstMapStyle,
      container: firstMapContainer
    })

    this._secondMap = new mapboxgl.Map({
      ...options.mapOptions,
      style: options.secondMapStyle,
      container: secondMapContainer
    })

    syncMaps(this._firstMap, this._secondMap)

    bindAll(['_onResize', '_onMove', '_onDown', '_onTouchEnd', '_onMouseUp'], this)

    this._secondMap.on('resize', this._onResize)

    this._bounds = this._secondMap.getContainer().getBoundingClientRect()
    const swiperPosition = (this._horizontal ? this._bounds.height : this._bounds.width) / 2
    this._setPosition(swiperPosition)

    if (this._mousemove) {
      this._firstMap.getContainer().addEventListener('mousemove', this._onMove)
      this._secondMap.getContainer().addEventListener('mousemove', this._onMove)
    }

    this._swiper.addEventListener('mousedown', this._onDown)
    this._swiper.addEventListener('touchstart', this._onDown)
  }

  private _onResize() {
    let max = this._horizontal ? this._bounds.height : this._bounds.width
    const rate = this.currentPosition / max
    this._bounds = this._secondMap.getContainer().getBoundingClientRect()
    max = this._horizontal ? this._bounds.height : this._bounds.width
    this._setPosition(max * rate)
  }

  private _setPosition(p: number) {
    p = Math.min(p, this._horizontal ? this._bounds.height : this._bounds.width)
    const pos = this._horizontal ? 'translate(0, ' + p + 'px)' : 'translate(' + p + 'px, 0)'
    this._controlContainer.style.transform = pos
    this._controlContainer.style.webkitTransform = pos
    const clipA = this._horizontal
      ? 'rect(0, 999em, ' + p + 'px, 0)'
      : 'rect(0, ' + p + 'px, ' + this._bounds.height + 'px, 0)'
    const clipB = this._horizontal
      ? 'rect(' + p + 'px, 999em, ' + this._bounds.height + 'px,0)'
      : 'rect(0, 999em, ' + this._bounds.height + 'px,' + p + 'px)'

    this._firstMap.getContainer().style.clip = clipA
    this._secondMap.getContainer().style.clip = clipB
    this.currentPosition = p
  }

  private _setPointerEvents(pointEvents: 'auto' | 'none') {
    this._controlContainer.style.pointerEvents = pointEvents
    this._swiper.style.pointerEvents = pointEvents
  }

  private _onMove(e: any) {
    if (this._mousemove) {
      this._setPointerEvents(e.touches ? 'auto' : 'none')
    }

    this._horizontal ? this._setPosition(this._getY(e)) : this._setPosition(this._getX(e))
  }

  private _getY(e: any) {
    e = e.touches ? e.touches[0] : e
    let y = e.clientY - this._bounds.top
    if (y < 0) y = 0
    if (y > this._bounds.height) y = this._bounds.height
    return y
  }

  private _getX(e: any) {
    e = e.touches ? e.touches[0] : e
    let x = e.clientX - this._bounds.left
    if (x < 0) x = 0
    if (x > this._bounds.width) x = this._bounds.width
    return x
  }

  private _onTouchEnd() {
    document.removeEventListener('touchmove', this._onMove)
    document.removeEventListener('touchend', this._onTouchEnd)
  }

  private _onMouseUp() {
    document.removeEventListener('mousemove', this._onMove)
    document.removeEventListener('mouseup', this._onMouseUp)
  }

  private _onDown(e: any) {
    if (e.touches) {
      document.addEventListener('touchmove', this._onMove)
      document.addEventListener('touchend', this._onTouchEnd)
    } else {
      document.addEventListener('mousemove', this._onMove)
      document.addEventListener('mouseup', this._onMouseUp)
    }
  }

  setSlider(p: number) {
    if (!this._removed) {
      const total = this._horizontal ? this._bounds.height : this._bounds.width
      if (p > 1) {
        p = 1
      } else if (p < 0) {
        p = 0
      }
      this._setPosition(p * total)
    }
  }

  remove() {
    if (this._removed) return
    this._firstMap?.remove()
    this._secondMap?.remove()
    this._container.innerHTML = ''
    this._container.style.position = ''
    this._container.classList.remove('map-comparer-container')
    this._removed = true
  }
}
