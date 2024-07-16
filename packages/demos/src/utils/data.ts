import * as turf from '@turf/turf'
// import { bboxList } from '@/data/baseData'
import borderData from '@/data/sn_border.json'

// 随机生成点位等数据
export const getPointGeoJson = (data: Array<any>) => {
  return turf.featureCollection(
    data.map((item) => {
      const { coordinates, ...rest } = item
      return turf.point(coordinates, {
        ...item
      })
    })
  )
}

export const getPolygonGeoJson = (data: Array<any>): GeoJSON.FeatureCollection<GeoJSON.Polygon> => {
  return turf.featureCollection(
    data.map((item) => {
      const { coordinates, ...rest } = item
      return turf.polygon(coordinates, {
        ...rest
      })
    })
  )
}

export const getLineGeoJson = (data: Array<any>): GeoJSON.FeatureCollection<GeoJSON.LineString> => {
  return turf.featureCollection(
    data.map((item) => {
      const { coordinates, ...rest } = item
      return turf.lineString(coordinates, {
        ...rest
      })
    })
  )
}

export const getData = (num = 100) => {
  // 点位
  const points = turf.randomPoint(num, { bbox: turf.bbox(borderData) })
  return turf.pointsWithinPolygon(points, borderData as any)
}

export const getPointData = (num = 1000) => {
  const coords = []
  coords.push(...turf.coordAll(getData(num)))
  return coords.map((item: any, index: number) => {
    const num = Math.floor(Math.random() * 4 + 1)
    return {
      coordinates: item,
      id: index + 1,
      type: num + ''
    }
  })
}

export const getHeatmapData = (num = 1000) => {
  const coords = []
  coords.push(...turf.coordAll(getData(num)))
  return coords.map((item: any, index: number) => {
    return {
      coordinates: item,
      id: index + 1
      // 权重 TODO:
    }
  })
}

export const getAreaData = (num = 20) => {
  const bbox = turf.bbox(borderData)
  // 六边形网格
  // const polygons = turf.hexGrid(bbox, 2, {units: 'miles'});
  const polygons = turf.randomPolygon(num, { bbox, max_radial_length: 0.1 })
  return polygons.features.map((item, index) => {
    return {
      coordinates: item.geometry.coordinates,
      name: '区域' + (index + 1)
    }
  })
}

export const getLineData = (num = 50) => {
  const bbox = turf.bbox(borderData)
  const lines = turf.randomLineString(num, {
    bbox,
    max_length: 0.1,
    num_vertices: 5,
    max_rotation: Math.PI / 20
  })
  return lines.features.map((item, index) => {
    return {
      coordinates: item.geometry.coordinates,
      id: index + 1
    }
  })
}
