import{M as e}from"./chunks/map-view.3fe756a0.js";import{J as t}from"./chunks/mapbox-utils.esm.43c6f587.js";import{d as c}from"./chunks/lineData.56e046f8.js";import{a1 as r,h as y,i as D,E as F,N as o}from"./chunks/framework.73679867.js";import"./chunks/mapbox-gl.95dcea97.js";import"./chunks/index.4ed993c7.js";import"./chunks/map_tian.a52cb535.js";const i=o("",57),B=o("",1),b=JSON.parse('{"title":"高级线图层(AdvanceLineLayer)","description":"","frontmatter":{},"headers":[],"relativePath":"layer/advance-line-layer.md"}'),d={name:"layer/advance-line-layer.md"},v=Object.assign(d,{setup(A){let a,s;const p=n=>{a=n,s=new t({key:"id",data:c,layerPool:{default:{type:"line",paint:{"line-width":4,"line-color":"#ff0000"},layout:{"line-cap":"round","line-join":"round"}},highlight:{type:"line",paint:{"line-width":4,"line-color":"#00ff00"},layout:{"line-cap":"round","line-join":"round"}},highlightOuter:{type:"line",paint:{"line-width":16,"line-color":"#00ff00","line-opacity":.4},layout:{"line-cap":"round","line-join":"round"}}},layers:["default"],highlightTrigger:"click",highlightLayers:["highlightOuter","highlight"],fitBoundsOptions:{padding:20}}),s.addTo(a),s.on("click",l=>{s.easeTo(l.data.id)})};return r(()=>{s==null||s.remove()}),(n,l)=>(y(),D("div",null,[i,F(e,{class:"map-view",style:{height:"600px","border-radius":"5px",overflow:"hidden"},onLoad:p}),B]))}});export{b as __pageData,v as default};
