import{M as c}from"./chunks/map-view.3fe756a0.js";import{P as b}from"./chunks/mapbox-utils.esm.43c6f587.js";import{E as r}from"./chunks/index.6cef4780.js";import{_ as v,a1 as y,h as D,i,y as s,E as F,N as l}from"./chunks/framework.73679867.js";import"./chunks/mapbox-gl.95dcea97.js";import"./chunks/index.4ed993c7.js";import"./chunks/map_tian.a52cb535.js";import"./chunks/theme.fe21c5c1.js";const B=l("",28),A=l("",1),q=JSON.parse('{"title":"区域框选（圆）(CircleAreaPicker)","description":"","frontmatter":{},"headers":[],"relativePath":"util/circle-area-picker.md"}'),E={name:"util/circle-area-picker.md"},h=Object.assign(E,{setup(g){let e,a;const o=t=>{e=t,a=new b({style:{"fill-color":"#44cef6","fill-opacity":.2,"stroke-width":2,"stroke-color":"#44cef6","stroke-opacity":.5,"stroke-dasharray":[5,3]},finishedStyle:{"fill-opacity":.3,"stroke-opacity":1,"stroke-dasharray":[1,0]}}),a.addTo(e),a.on("finish",n=>{r.success(`绘制完成，面积：${n.acreage}平方米`)})},p=()=>{a==null||a.clear()},d=()=>{console.log(a==null?void 0:a.getData())};return y(()=>{a==null||a.remove()}),(t,n)=>(D(),i("div",null,[B,s("div",null,[F(c,{class:"map-view",style:{height:"600px","border-radius":"5px",overflow:"hidden"},onLoad:o}),s("div",{class:"button-wrapper"},[s("div",{class:"button",onClick:p},"清除"),s("div",{class:"button",onClick:d},"获取")])]),A]))}}),T=v(h,[["__scopeId","data-v-e44373b4"]]);export{q as __pageData,T as default};
