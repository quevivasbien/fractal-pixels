(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(2695)}])},1516:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDomainLocale=function(e,t,r,n){return!1},("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5569:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(2648).Z,l=r(7273).Z,o=n(r(7294)),a=r(4532),s=r(3353),i=r(1410),c=r(9064),u=r(370),f=r(9955),d=r(4224),p=r(508),h=r(1516),x=r(4266);let b=new Set;function v(e,t,r,n,l){if(l||s.isLocalURL(t)){if(!n.bypassPrefetchedCheck){let l=void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0,o=t+"%"+r+"%"+l;if(b.has(o))return;b.add(o)}Promise.resolve(e.prefetch(t,r,n)).catch(e=>{})}}function m(e){return"string"==typeof e?e:i.formatUrl(e)}let g=o.default.forwardRef(function(e,t){let r,n;let{href:i,as:b,children:g,prefetch:y,passHref:j,replace:M,shallow:_,scroll:H,locale:C,onClick:k,onMouseEnter:S,onTouchStart:E,legacyBehavior:N=!1}=e,w=l(e,["href","as","children","prefetch","passHref","replace","shallow","scroll","locale","onClick","onMouseEnter","onTouchStart","legacyBehavior"]);r=g,N&&("string"==typeof r||"number"==typeof r)&&(r=o.default.createElement("a",null,r));let P=!1!==y,O=o.default.useContext(f.RouterContext),I=o.default.useContext(d.AppRouterContext),L=null!=O?O:I,T=!O,{href:R,as:D}=o.default.useMemo(()=>{if(!O){let e=m(i);return{href:e,as:b?m(b):e}}let[e,t]=a.resolveHref(O,i,!0);return{href:e,as:b?a.resolveHref(O,b):t||e}},[O,i,b]),U=o.default.useRef(R),A=o.default.useRef(D);N&&(n=o.default.Children.only(r));let K=N?n&&"object"==typeof n&&n.ref:t,[q,Z,B]=p.useIntersection({rootMargin:"200px"}),F=o.default.useCallback(e=>{(A.current!==D||U.current!==R)&&(B(),A.current=D,U.current=R),q(e),K&&("function"==typeof K?K(e):"object"==typeof K&&(K.current=e))},[D,K,R,B,q]);o.default.useEffect(()=>{L&&Z&&P&&v(L,R,D,{locale:C},T)},[D,R,Z,C,P,null==O?void 0:O.locale,L,T]);let X={ref:F,onClick(e){N||"function"!=typeof k||k(e),N&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),L&&!e.defaultPrevented&&function(e,t,r,n,l,a,i,c,u,f){let{nodeName:d}=e.currentTarget,p="A"===d.toUpperCase();if(p&&(function(e){let t=e.currentTarget,r=t.getAttribute("target");return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!u&&!s.isLocalURL(r)))return;e.preventDefault();let h=()=>{"beforePopState"in t?t[l?"replace":"push"](r,n,{shallow:a,locale:c,scroll:i}):t[l?"replace":"push"](n||r,{forceOptimisticNavigation:!f})};u?o.default.startTransition(h):h()}(e,L,R,D,M,_,H,C,T,P)},onMouseEnter(e){N||"function"!=typeof S||S(e),N&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),L&&(P||!T)&&v(L,R,D,{locale:C,priority:!0,bypassPrefetchedCheck:!0},T)},onTouchStart(e){N||"function"!=typeof E||E(e),N&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),L&&(P||!T)&&v(L,R,D,{locale:C,priority:!0,bypassPrefetchedCheck:!0},T)}};if(c.isAbsoluteUrl(D))X.href=D;else if(!N||j||"a"===n.type&&!("href"in n.props)){let e=void 0!==C?C:null==O?void 0:O.locale,t=(null==O?void 0:O.isLocaleDomain)&&h.getDomainLocale(D,e,null==O?void 0:O.locales,null==O?void 0:O.domainLocales);X.href=t||x.addBasePath(u.addLocale(D,e,null==O?void 0:O.defaultLocale))}return N?o.default.cloneElement(n,X):o.default.createElement("a",Object.assign({},w,X),r)});t.default=g,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},508:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useIntersection=function(e){let{rootRef:t,rootMargin:r,disabled:i}=e,c=i||!o,[u,f]=n.useState(!1),d=n.useRef(null),p=n.useCallback(e=>{d.current=e},[]);n.useEffect(()=>{if(o){if(c||u)return;let e=d.current;if(e&&e.tagName){let n=function(e,t,r){let{id:n,observer:l,elements:o}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=s.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=a.get(n)))return t;let l=new Map,o=new IntersectionObserver(e=>{e.forEach(e=>{let t=l.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e);return t={id:r,observer:o,elements:l},s.push(r),a.set(r,t),t}(r);return o.set(e,t),l.observe(e),function(){if(o.delete(e),l.unobserve(e),0===o.size){l.disconnect(),a.delete(n);let e=s.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&s.splice(e,1)}}}(e,e=>e&&f(e),{root:null==t?void 0:t.current,rootMargin:r});return n}}else if(!u){let e=l.requestIdleCallback(()=>f(!0));return()=>l.cancelIdleCallback(e)}},[c,r,t,u,d.current]);let h=n.useCallback(()=>{f(!1)},[]);return[p,u,h]};var n=r(7294),l=r(29);let o="function"==typeof IntersectionObserver,a=new Map,s=[];("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2695:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return f}});var n=r(5893),l=r(7294);function o(e){let[t,r]=l.useState(0),[o,a]=l.useState(!1);if(l.useEffect(()=>{a(!0)},[]),!o)return(0,n.jsx)("div",{className:"text-3l",children:e.text});let{text:s,colors:i}=e,c=[];for(let e=0;e<s.length;e++){let r=s[e],l=i[(t+e)%i.length].darkened(30,10).toHex();c.push((0,n.jsx)("span",{style:{color:l},children:r},e))}return setTimeout(()=>{r((t+1)%i.length)},e.flashInterval),(0,n.jsx)("div",{className:"text-3xl",children:c})}var a=r(1163);function s(){let[e,t]=l.useState(!1),r=(0,a.useRouter)(),o=e=>{e.preventDefault();let t=e.target,n=t.levelSelect.value;r.push("/game/".concat(n))};return(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"text-gray-600",children:"Select a difficulty:"}),(0,n.jsxs)("form",{className:"space-y-4",onSubmit:o,children:[(0,n.jsxs)("div",{className:"space-x-4",children:[(0,n.jsxs)("label",{className:"space-x-2",onClick:()=>t(!0),children:[(0,n.jsx)("input",{type:"radio",name:"levelSelect",value:"easy"}),(0,n.jsx)("span",{children:"Easy"})]}),(0,n.jsxs)("label",{className:"space-x-2",onClick:()=>t(!0),children:[(0,n.jsx)("input",{type:"radio",name:"levelSelect",value:"medium"}),(0,n.jsx)("span",{children:"Medium"})]}),(0,n.jsxs)("label",{className:"space-x-2",onClick:()=>t(!0),children:[(0,n.jsx)("input",{type:"radio",name:"levelSelect",value:"hard"}),(0,n.jsx)("span",{children:"Hard"})]})]}),(0,n.jsx)("button",{className:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform duration-300 disabled:opacity-25 disabled:bg-blue-500",type:"submit",disabled:!e,children:"Play ➜"})]})]})}var i=r(5540),c=r(1664),u=r.n(c);function f(){return(0,n.jsx)("div",{className:"flex flex-col justify-center items-center",children:(0,n.jsxs)("div",{className:"border border-gray-200 rounded-lg space-y-4 p-8 text-center bg-gray-100",children:[(0,n.jsx)(o,{text:"FractalPixels!",flashInterval:500,colors:(0,i.q0)()}),(0,n.jsx)(s,{}),(0,n.jsx)("div",{className:"pt-4",children:(0,n.jsx)(u(),{className:"italic text-gray-600 hover:text-red-800 hover:font-bold",href:"/learn",children:"Learn to play"})})]})})}},5540:function(e,t,r){"use strict";r.d(t,{ZP:function(){return n},pF:function(){return s},q0:function(){return a}});class n{static fromHex(e){"#"===e[0]&&(e=e.slice(1));let t=parseInt(e.slice(0,2),16),r=parseInt(e.slice(2,4),16),l=parseInt(e.slice(4,6),16);return new n(t,r,l)}toHex(){return"#"+this.r.toString(16).padStart(2,"0")+this.g.toString(16).padStart(2,"0")+this.b.toString(16).padStart(2,"0")}inverted(){return new n(255-this.r,255-this.g,255-this.b)}static invertedHex(e){return n.fromHex(e).inverted().toHex()}darkened(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return new n(Math.max(t,Math.floor(this.r-e)),Math.max(t,Math.floor(this.g-e)),Math.max(t,Math.floor(this.b-e)))}static darkenedHex(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return n.fromHex(e).darkened(t,r).toHex()}lightened(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:255;return new n(Math.min(t,Math.floor(this.r+e)),Math.min(t,Math.floor(this.g+e)),Math.min(t,Math.floor(this.b+e)))}static lightenedHex(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:255;return n.fromHex(e).lightened(t,r).toHex()}constructor(e,t,r){this.r=e,this.g=t,this.b=r}}class l{static fromHexes(e){return new l(e.map(e=>n.fromHex(e)))}constructor(e){this.colors=e}}let o=[l.fromHexes(["be6e46","cde7b0","a3bfa8","7286a0","59594a"]),l.fromHexes(["adbca5","e8b9ab","e09891","cb769e","8c5f66"]),l.fromHexes(["7fb069","fffbbd","e6aa68","ca3c25","1d1a05"]),l.fromHexes(["545e75","63adf2","a7cced","304d6d","82a0bc"]),l.fromHexes(["ff9fb2","fbdce2","0acdff","60ab9a","dedee0"]),l.fromHexes(["91f9e5","76f7bf","5fdd9d","499167","3f4531"]),l.fromHexes(["ffc857","e9724c","c5283d","481d24","255f85"]),l.fromHexes(["bce7fd","c492b1","af3b6e","424651","21fa90"])];function a(){return o[Math.floor(Math.random()*o.length)].colors}let s=n.fromHex("#C0C0C0")},1664:function(e,t,r){e.exports=r(5569)},1163:function(e,t,r){e.exports=r(6885)}},function(e){e.O(0,[774,888,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);