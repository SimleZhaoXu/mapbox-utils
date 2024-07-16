import { defineConfig } from "vitepress";

export default defineConfig({
  title: "docs:mapbox-utils",
  description: "",
  lang: "zh-CN",
  outDir: "../../dist/mapbox-utils-docs",
  base: "/mapbox-utils-docs/",
  themeConfig: {
    siteTitle: "基于MapBox的地图组件",
    docFooter: { prev: "上一篇", next: "下一篇" },
    sidebar: [
      {
        text: "基础",
        items: [
          { text: "安装与使用", link: "/base/install" },
          { text: "更新日志", link: "/base/changelog" },
          {
            text: "Mapbox Style规范",
            link: "/base/style",
            items: [
              {
                text: "Sources",
                link: "/base/style/sources",
              },
              {
                text: "Layers",
                link: "/base/style/layers",
              },
              {
                text: "Expressions",
                link: "/base/style/expressions",
              },
              {
                text: "Functions",
                link: "/base/style/functions",
              },
            ],
          },
        ],
      },
      {
        text: "图层",
        items: [
          { text: "圆点图层", link: "/layer/circle-point-layer" },
          { text: "图标图层", link: "/layer/symbol-point-layer" },
          { text: "Marker点图层", link: "/layer/marker-point-layer" },
          { text: "线图层", link: "/layer/line-layer" },
          { text: "多边形图层", link: "/layer/polygon-layer" },
          { text: "图标聚合点图层", link: "/layer/symbol-cluster-layer" },
          { text: "圆点聚合点图层", link: "/layer/circle-cluster-layer" },
          { text: "高级点图层", link: "/layer/advance-point-layer" },
          { text: "高级线图层", link: "/layer/advance-line-layer" },
          { text: "高级多边形图层", link: "/layer/advance-polygon-layer" },
          { text: "热力图图层", link: "/layer/heatmap-layer" },
          { text: "缓冲区图层", link: "/layer/buffer-layer" },
          { text: "柱状图图层", link: "/layer/prismoid-layer" },
          { text: "轨迹播放", link: "/layer/car-track" },
          { text: "高级轨迹播放", link: "/layer/advance-car-track" },
          { text: "高级缓冲区", link: "/layer/advance-buffer" },
        ],
      },
      {
        text: "工具",
        items: [
          { text: "坐标选取", link: "/util/point-picker" },
          { text: "路径选取", link: "/util/line-picker" },
          { text: "区域框选（多边形）", link: "/util/polygon-area-picker" },
          { text: "区域框选（矩形）", link: "/util/rect-area-picker" },
          { text: "区域框选（圆）", link: "/util/circle-area-picker" },
          { text: "地图卷帘", link: "/util/map-comparer" },
          { text: "测距", link: "/util/distance-measurer" },
          { text: "测面积", link: "/util/area-measurer" },
          { text: "绘制工具", link: "/util/draw-util" },
        ],
      },
      {
        text: "ThreeJS",
        link: "/three/index",
        items: [
          { text: "加载threejs物体", link: "/three/box" },
          { text: "加载3维模型(glb)", link: "/three/model-glb" },
          { text: "加载3维模型(fbx)", link: "/three/model-fbx" },
          { text: "加载3维模型(gltf)", link: "/three/model-gltf" },
          { text: "加载3D点位", link: "/three/3D-point" },
        ]
      },
      {
        text: "兴趣点管理",
        link: "/poi-management/index",
        items: []
      }
    ],
    outline: {
      level: [1, 3],
    },
  },
  vite: {
    server: {
      host: true,
      // open: true
    },
  },
});
