### ## 基于mapboxgl的地图组件仓库

本仓库使用lerna构建monorepo，其中包括三个项目，其中packages/docs为组件库文档，packages/mapbox-utils为组件库源码，packages/mapbox-utils-demo为组件dem示例，包括在线代码编辑以及在线快速配置功能，方便开发者熟悉组件功能及用法

### 安装依赖

```
yarn install
```

### 清空依赖

执行此命令会删除所有node_modules文件夹

```
yarn run clean
```


### 打包

执行打包命令后打包后会将组件demo及文档分别打包到当前目录下的`dist`文件夹

```
yarn run build
```