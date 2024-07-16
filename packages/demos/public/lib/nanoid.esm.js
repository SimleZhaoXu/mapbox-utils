/**
 * Bundled by jsDelivr using Rollup v2.74.1 and Terser v5.15.1.
 * Original file: /npm/nanoid@4.0.1/index.browser.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const t="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";let e=t=>crypto.getRandomValues(new Uint8Array(t)),r=(t,e,r)=>{let n=(2<<Math.log(t.length-1)/Math.LN2)-1,l=-~(1.6*n*e/t.length);return(o=e)=>{let a="";for(;;){let e=r(l),g=l;for(;g--;)if(a+=t[e[g]&n]||"",a.length===o)return a}}},n=(t,n=21)=>r(t,n,e),l=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"");export{n as customAlphabet,r as customRandom,l as nanoid,e as random,t as urlAlphabet};export default null;
//# sourceMappingURL=/sm/6cd94b03988a42880e994a38bac1502c5ffc5c06e1c3c66619d19b5f0f21a741.map