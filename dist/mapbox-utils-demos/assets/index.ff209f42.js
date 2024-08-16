import{b as m,M as g,F as _}from"./mapbox-utils.esm.1d7eedb7.js";import{i as h,a as E,B as O}from"./index.2419e32d.js";import{r as B,b as v}from"./sn_border.2879f07a.js";import{_ as C,d as f,r as A,m as D,g as k,c as x,h as I,e as w,o as S,O as N}from"./index.3f3ae0c4.js";const y={"stroke-color":"#000000","stroke-width":1,"stroke-blur":0,"stroke-opacity":1,"stroke-dasharray":[1,0],"fill-opacity":1,"fill-color":"#000000"},l={style:{"stroke-color":"#177cb0","stroke-width":1,"stroke-blur":0,"stroke-opacity":1,"stroke-dasharray":[1,0],"fill-opacity":.2,"fill-color":"#44cef6"},units:"kilometers",radius:5,steps:64,manual:!1,centerLayer:"node"},c=localStorage.getItem("BufferLayerOptions"),n=c?JSON.parse(c):l,T=()=>{const u=Object.create(null);return u.style=Object.create(null),Object.keys(n.style).forEach(o=>{JSON.stringify(n.style[o])!==JSON.stringify(y[o])&&(u.style[o]=n.style[o])}),Object.keys(n).forEach(o=>{!["style","centerLayer"].includes(o)&&n[o]!==l[o]&&(u[o]=n[o])}),u.centerLayer={show:!1},u};const U={class:"buffer-gui"},G=f({__name:"index",setup(u){const o=A();D(()=>{var t;(t=o.value)==null||t.appendChild(r.domElement),r.domElement.classList.add("custom-gui")});let i,e;const F=t=>{i=t,d()},d=()=>{if(!i){N.warning("\u8BF7\u7B49\u5F85\u5730\u56FE\u52A0\u8F7D\u5B8C\u6210");return}e==null||e.remove(),e=new _({...T()}),e.on("change",t=>{console.log(`
    \u4E2D\u5FC3\uFF1A${t.center}, 
    \u534A\u5F84\uFF1A${t.radius}, 
    \u534A\u5F84\u5355\u4F4D\uFF1A${t.units}, 
    \u7F13\u51B2\u533A\uFF1A${JSON.stringify(t.buffer)}`)}),e.addTo(i)};k(()=>{r.destroy(),e==null||e.remove(),i.remove(),i=void 0,e=void 0});const p=()=>{localStorage.setItem("BufferLayerOptions",JSON.stringify(n)),d()},r=new h.GUI({name:"buffer",autoPlace:!1,width:400,closeOnTop:!0});E(r,n,O,p);const a={steps:64,radius:5,units:"kilometers",addTo:()=>{e==null||e.addTo(i)},remove:()=>{e==null||e.remove()},clear:()=>{e==null||e.clear()},setCenter:()=>{const t=B(1,{bbox:m(v)});e==null||e.setOptions({center:t.features[0].geometry.coordinates})},getData:()=>{console.log(e.getData())}},s=r.addFolder("API");return s.open(),s.add(a,"addTo").name("\u6DFB\u52A0\u5230\u5730\u56FE----addTo(map)"),s.add(a,"remove").name("\u4ECE\u5730\u56FE\u79FB\u9664---remove()"),s.add(a,"clear").name("\u6E05\u9664\u7F13\u51B2\u533A----clear()"),s.add(a,"getData").name("\u83B7\u53D6\u7F13\u51B2\u533A----getData()"),s.add(a,"setCenter").name("\u53C2\u6570\u4FEE\u6539\uFF08\u4E2D\u5FC3\uFF09----setOptions({center})"),s.add(a,"radius",1,99,1).name("\u53C2\u6570\u4FEE\u6539\uFF08\u534A\u5F84\uFF09").onFinishChange(t=>{e==null||e.setOptions({radius:t})}),s.add(a,"units",["meters","kilometers"]).name("\u53C2\u6570\u4FEE\u6539\uFF08\u5355\u4F4D\uFF09").onFinishChange(t=>{e==null||e.setOptions({units:t})}),s.add(a,"steps",3,512,1).name("\u53C2\u6570\u4FEE\u6539\uFF08\u8FB9\u6570\uFF09").onFinishChange(t=>{e==null||e.setOptions({steps:t})}),(t,J)=>(S(),x("div",U,[I(g,{onLoad:F}),w("div",{ref_key:"container",ref:o,class:"gui-container"},null,512)]))}});var V=C(G,[["__scopeId","data-v-1f541cd8"]]);export{V as default};
