# 3D 点位

## Demo
<div class="map-box">
  <div ref="mapContainer" class="map-container" />
</div>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import 'threebox-plugin/dist/threebox.css'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
import { onMounted, ref, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapStyle from '../data/map_tian.json'
import threeboxPlugin from 'threebox-plugin';
import TWEEN, { Group } from '@tweenjs/tween.js'
import textureImg1 from '../data/texture/point_cylinder.png'
import textureImg2 from '../data/texture/point.png'
import textureImg3 from '../data/texture/point_circle.png'
const { Threebox, THREE } = threeboxPlugin
const mapContainer = ref()
let map

onUnmounted(() => {
  window.tb.dispose()
  window.tb = undefined
})
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    zoom: 15,
    minZoom: 1,
    maxZoom: 17.9,
    center: [105.5, 30.6],
    pitch: 60,
    style: MapStyle,
    antialias: true
  })

  window.tb = new Threebox(
    map,
    map.getCanvas().getContext('webgl'),
    { defaultLights: true, enableSelectingObjects: true, multiLayer: true }
  )

  map.on('click', e => {
    const intersects =  window.tb.queryRenderedFeatures(e.point)
    if(intersects?.length) {
      const mesh = intersects[0]
      const parent = window.tb.findParent3DObject(mesh)
      ElMessage.success(`${parent.userData.properties.id}被点击`)
    }
  })

  map.on('load', () => {
    let fRecord
    let tweenGroup
    const animate = () => {
      tweenGroup?.update()
      window.tb.repaint()
      fRecord = requestAnimationFrame(animate)
    }
    const pointLayer = {
      id: '3d-point-layer',
      type: 'custom',
      renderingMode: '3d',
      objects: [],
      onAdd() {
        const loader = new THREE.TextureLoader()
        const texture1 = loader.load(textureImg1)
        const texture2 = loader.load(textureImg2)
        const texture3 = loader.load(textureImg3)
        const point1 = tb.Object3D({
          obj: createLightCylinderObj(0x0463fc, 8, texture1, texture2, texture3),
          anchor: 'center',
          bbox: false
        })
        point1.setCoords([105.49598274796648, 30.599361631560328, 0])
        point1.userData.properties = {
          id: 'point1'
        }
        window.tb.add(point1)
        this.objects.push(point1)
        
        const point2 = tb.Object3D({
          obj: createLightCylinderObj(0xfffb05, 10, texture1, texture2, texture3),
          anchor: 'center',
          bbox: false
        })
        point2.userData.properties = {
          id: 'point2'
        }
        point2.setCoords([105.4989446541893, 30.599430034094055, 0])
        window.tb.add(point2)
        this.objects.push(point2)

        const point3 = tb.Object3D({
          obj: createLightCylinderObj(0xfa7a03, 12, texture1, texture2, texture3),
          anchor: 'center',
          bbox: false
        })
         point3.userData.properties = {
          id: 'point3'
        }
        point3.setCoords([105.5024721550962, 30.599361631560328, 0])
        window.tb.add(point3)
        this.objects.push(point3)

        const point4 = tb.Object3D({
          obj: createLightCylinderObj(0xee0000, 14, texture1, texture2, texture3),
          anchor: 'center',
          bbox: false
        })
         point4.userData.properties = {
          id: 'point4'
        }
        point4.setCoords([105.50545352340475, 30.599061180093443, 0])
        window.tb.add(point4)
        this.objects.push(point4)

        const scale = 1
        tweenGroup = new TWEEN.Group()
        const tween1 = new TWEEN.Tween(
          { scale: scale, opacity: 0 },
          tweenGroup
        )
          .to({ scale: scale * 1.5, opacity: 1 }, 500)
          .delay(100)
          .onUpdate((params) => {
            const { scale, opacity } = params
            this.objects.forEach(obj => {
              const mesh = obj.getObjectByName('light-circle')
              if (!mesh) return
              mesh.scale.set(scale, scale, scale)
              mesh.material.opacity = opacity
            })
          })

        const tween2 = new TWEEN.Tween(
          { scale: scale * 1.5, opacity: 1 },
          tweenGroup
        )
          .to({ scale: scale * 2, opacity: 0 }, 500)
          .onUpdate((params) => {
            const { scale, opacity } = params
            this.objects.forEach(obj => {
              const mesh = obj.getObjectByName('light-circle')
              if (!mesh) return
              mesh.scale.set(scale, scale, scale)
              mesh.material.opacity = opacity
            })
          })

        tween1.chain(tween2)
        tween2.chain(tween1)
        tween1.start()
        animate()
      },
      render() {},
      onRemove() {
        cancelAnimationFrame(fRecord)
        tweenGroup?.removeAll()
        tweenGroup = null
        fRecord = 0
        this.objects.forEach(obj => {
          window.tb.remove(obj)
        })
        this.objects = []
      }
    }

    map.addLayer(pointLayer)
  })
})

function createLightCylinderObj(
  color,
  height,
  texture1,
  texture2,
  texture3
) {
  const group = new THREE.Group()
  // 柱体高度
  // 柱体的geo,6.19=柱体图片高度/宽度的倍数
  const geometry = new THREE.PlaneGeometry(height / 6.219, height)
  // 柱体旋转90度，垂直于Y轴
  geometry.rotateX(Math.PI / 2)
  // 柱体的z轴移动高度一半对齐中心点
  geometry.translate(0, 0, height / 2)
  // 柱子材质
  const material = new THREE.MeshBasicMaterial({
    map: texture1,
    color,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  })
  // 光柱01
  const light01 = new THREE.Mesh(geometry, material)
  light01.name = 'LightPillar01'
  // 光柱02：复制光柱01
  const light02 = light01.clone()
  light02.name = 'LightPillar02'
  // 光柱02，旋转90°，跟 光柱01交叉
  light02.rotateZ(Math.PI / 2)
  // 创建底部标点
  const bottomMesh = createPointMesh(color, texture2, height / 6.219 / 8)
  // 创建光圈
  const lightHalo = createLightHalo(color, texture3, height / 6.219)
  // 将光柱和标点添加到组里
  group.add(bottomMesh, lightHalo, light01, light02)

  return group
}

// 创建点位
const createPointMesh = (color, texture, scaleFactor = 1) => {
  // 标记点：几何体，材质，
  const geometry = new THREE.CircleGeometry(1, 32)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false //禁止写入深度缓冲区数据
  })
  const mesh = new THREE.Mesh(geometry, material)
  const scale = scaleFactor
  mesh.scale.set(scale, scale, scale)
  return mesh
}

/**
 * 创建光圈
 */
const createLightHalo = (color, texture, scaleFactor = 1) => {
  // 标记点：几何体，材质，
  const geometry = new THREE.PlaneGeometry(1, 1)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    side: THREE.DoubleSide,
    opacity: 0,
    transparent: true,
    depthWrite: false //禁止写入深度缓冲区数据
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'light-circle'
  // 缩放
  const scale = scaleFactor
  mesh.scale.set(scale, scale, scale)
  return mesh
}

</script>

<style>
.map-box {
  width: 100%;
  height: 500px;
  position: relative;
}

.map-box .map-container {
  width: 100%;
  height: 100%;
}
</style>

::: details 点击查看代码

```js
import { Threebox, THREE } from "threebox-plugin";
import "threebox-plugin/dist/threebox.css";
import TWEEN, { Group } from "@tweenjs/tween.js";
import textureImg1 from "../data/texture/point_cylinder.png";
import textureImg2 from "../data/texture/point.png";
import textureImg3 from "../data/texture/point_circle.png";
onUnmounted(() => {
  window.tb.dispose();
  window.tb = undefined;
});
const map = new mapboxgl.Map({
  container: mapContainer.value,
  zoom: 15,
  minZoom: 1,
  maxZoom: 17.9,
  center: [105.5, 30.6],
  pitch: 60,
  style: MapStyle,
  antialias: true, // 抗锯齿
});

window.tb = new Threebox(
  map,
  map.getCanvas().getContext("webgl"), // get the context from the map canvas
  { defaultLights: true, enableSelectingObjects: true, multiLayer: true }
);
map.on("click", e => {
  const intersects = window.tb.queryRenderedFeatures(e.point);
  if (intersects?.length) {
    const mesh = intersects[0];
    const parent = window.tb.findParent3DObject(mesh);
    ElMessage.success(`${parent.userData.properties.id}被点击`);
  }
});

map.on("load", () => {
  let fRecord;
  let tweenGroup;
  const animate = () => {
    tweenGroup?.update();
    window.tb.repaint();
    fRecord = requestAnimationFrame(animate);
  };
  const pointLayer = {
    id: "3d-point-layer",
    type: "custom",
    renderingMode: "3d",
    objects: [],
    onAdd() {
      const loader = new THREE.TextureLoader();
      const texture1 = loader.load(textureImg1);
      const texture2 = loader.load(textureImg2);
      const texture3 = loader.load(textureImg3);
      const point1 = tb.Object3D({
        obj: createLightCylinderObj(0x0463fc, 8, texture1, texture2, texture3),
        anchor: "center",
        bbox: false,
      });
      point1.setCoords([105.49598274796648, 30.599361631560328, 0]);
      point1.userData.properties = {
        id: "point1",
      };
      window.tb.add(point1);
      this.objects.push(point1);

      const point2 = tb.Object3D({
        obj: createLightCylinderObj(0xfffb05, 10, texture1, texture2, texture3),
        anchor: "center",
        bbox: false,
      });
      point2.userData.properties = {
        id: "point2",
      };
      point2.setCoords([105.4989446541893, 30.599430034094055, 0]);
      window.tb.add(point2);
      this.objects.push(point2);

      const point3 = tb.Object3D({
        obj: createLightCylinderObj(0xfa7a03, 12, texture1, texture2, texture3),
        anchor: "center",
        bbox: false,
      });
      point3.userData.properties = {
        id: "point3",
      };
      point3.setCoords([105.5024721550962, 30.599361631560328, 0]);
      window.tb.add(point3);
      this.objects.push(point3);

      const point4 = tb.Object3D({
        obj: createLightCylinderObj(0xee0000, 14, texture1, texture2, texture3),
        anchor: "center",
        bbox: false,
      });
      point4.userData.properties = {
        id: "point4",
      };
      point4.setCoords([105.50545352340475, 30.599061180093443, 0]);
      window.tb.add(point4);
      this.objects.push(point4);

      const scale = 1;
      tweenGroup = new TWEEN.Group();
      const tween1 = new TWEEN.Tween({ scale: scale, opacity: 0 }, tweenGroup)
        .to({ scale: scale * 1.5, opacity: 1 }, 500)
        .delay(100)
        .onUpdate(params => {
          const { scale, opacity } = params;
          this.objects.forEach(obj => {
            const mesh = obj.getObjectByName("light-circle");
            if (!mesh) return;
            mesh.scale.set(scale, scale, scale);
            mesh.material.opacity = opacity;
          });
        });

      const tween2 = new TWEEN.Tween(
        { scale: scale * 1.5, opacity: 1 },
        tweenGroup
      )
        .to({ scale: scale * 2, opacity: 0 }, 500)
        .onUpdate(params => {
          const { scale, opacity } = params;
          this.objects.forEach(obj => {
            const mesh = obj.getObjectByName("light-circle");
            if (!mesh) return;
            mesh.scale.set(scale, scale, scale);
            mesh.material.opacity = opacity;
          });
        });

      tween1.chain(tween2);
      tween2.chain(tween1);
      tween1.start();
      animate();
    },
    render() {},
    onRemove() {
      cancelAnimationFrame(fRecord);
      tweenGroup?.removeAll();
      tweenGroup = null;
      fRecord = 0;
      this.objects.forEach(obj => {
        window.tb.remove(obj);
      });
      this.objects = [];
    },
  };

  map.addLayer(pointLayer);
});

function createLightCylinderObj(color, height, texture1, texture2, texture3) {
  const group = new THREE.Group();
  // 柱体高度
  // 柱体的geo,6.19=柱体图片高度/宽度的倍数
  const geometry = new THREE.PlaneGeometry(height / 6.219, height);
  // 柱体旋转90度，垂直于Y轴
  geometry.rotateX(Math.PI / 2);
  // 柱体的z轴移动高度一半对齐中心点
  geometry.translate(0, 0, height / 2);
  // 柱子材质
  const material = new THREE.MeshBasicMaterial({
    map: texture1,
    color,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  // 光柱01
  const light01 = new THREE.Mesh(geometry, material);
  light01.name = "LightPillar01";
  // 光柱02：复制光柱01
  const light02 = light01.clone();
  light02.name = "LightPillar02";
  // 光柱02，旋转90°，跟 光柱01交叉
  light02.rotateZ(Math.PI / 2);
  // 创建底部标点
  const bottomMesh = createPointMesh(color, texture2, height / 6.219 / 8);
  // 创建光圈
  const lightHalo = createLightHalo(color, texture3, height / 6.219);
  // 将光柱和标点添加到组里
  group.add(bottomMesh, lightHalo, light01, light02);

  return group;
}

// 创建点位
const createPointMesh = (color, texture, scaleFactor = 1) => {
  // 标记点：几何体，材质，
  const geometry = new THREE.CircleGeometry(1, 32);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false, //禁止写入深度缓冲区数据
  });
  const mesh = new THREE.Mesh(geometry, material);
  const scale = scaleFactor;
  mesh.scale.set(scale, scale, scale);
  return mesh;
};

/**
 * 创建光圈
 */
const createLightHalo = (color, texture, scaleFactor = 1) => {
  // 标记点：几何体，材质，
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    side: THREE.DoubleSide,
    opacity: 0,
    transparent: true,
    depthWrite: false, //禁止写入深度缓冲区数据
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "light-circle";
  // 缩放
  const scale = scaleFactor;
  mesh.scale.set(scale, scale, scale);
  return mesh;
};
```

:::
