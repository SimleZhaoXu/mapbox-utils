# 安装与使用

## 安装

使用npm进行安装，目前只部署在公司内部npm上，安装时需指定npm镜像为 http://npm.cestc.cn

```
npm install mapbox-utils --save --registry=http://npm.cestc.cn
```

## 使用

按需导入进行使用

```js
import 'mapbox-utils/dist/index.css' // 导入css样式
import { CirclePointLayer } from 'mapbox-utils'
```