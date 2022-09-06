var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function s(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(e,n,r){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}(n,r))}function l(t,e,n,r){if(t){const s=c(t,e,n,r);return t[0](s)}}function c(t,e,n,r){return t[1]&&r?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](r(e))):n.ctx}function u(t,e,n,r){if(t[2]&&r){const s=t[2](r(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|s[r];return t}return e.dirty|s}return e.dirty}function a(t,e,n,r,s,o){if(s){const i=c(e,n,r,o);t.p(i,s)}}function f(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}function d(t,e){t.appendChild(e)}function h(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function m(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function y(){return $(" ")}function x(){return $("")}function w(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function k(t,e){t.value=null==e?"":e}function C(t,e,n,r){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}class _{constructor(t=!1){this.is_svg=!1,this.is_svg=t,this.e=this.n=null}c(t){this.h(t)}m(t,e,n=null){var r;this.e||(this.is_svg?this.e=(r=e.nodeName,document.createElementNS("http://www.w3.org/2000/svg",r)):this.e=m(e.nodeName),this.t=e,this.c(t)),this.i(n)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let e=0;e<this.n.length;e+=1)h(this.t,this.n[e],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(p)}}let T;function A(t){T=t}const P=[],S=[],H=[],z=[],L=Promise.resolve();let j=!1;function E(t){H.push(t)}const I=new Set;let N=0;function D(){const t=T;do{for(;N<P.length;){const t=P[N];N++,A(t),B(t.$$)}for(A(null),P.length=0,N=0;S.length;)S.pop()();for(let t=0;t<H.length;t+=1){const e=H[t];I.has(e)||(I.add(e),e())}H.length=0}while(P.length);for(;z.length;)z.pop()();j=!1,I.clear(),A(t)}function B(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const O=new Set;let M;function q(){M={r:0,c:[],p:M}}function R(){M.r||r(M.c),M=M.p}function U(t,e){t&&t.i&&(O.delete(t),t.i(e))}function J(t,e,n,r){if(t&&t.o){if(O.has(t))return;O.add(t),M.c.push((()=>{O.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}else r&&r()}function K(t){t&&t.c()}function F(t,n,o,i){const{fragment:l,on_mount:c,on_destroy:u,after_update:a}=t.$$;l&&l.m(n,o),i||E((()=>{const n=c.map(e).filter(s);u?u.push(...n):r(n),t.$$.on_mount=[]})),a.forEach(E)}function G(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(P.push(t),j||(j=!0,L.then(D)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function V(e,s,o,i,l,c,u,a=[-1]){const f=T;A(e);const d=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(f?f.$$.context:[])),callbacks:n(),dirty:a,skip_bound:!1,root:s.target||f.$$.root};u&&u(d.root);let h=!1;if(d.ctx=o?o(e,s.props||{},((t,n,...r)=>{const s=r.length?r[0]:n;return d.ctx&&l(d.ctx[t],d.ctx[t]=s)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](s),h&&Q(e,t)),n})):[],d.update(),h=!0,r(d.before_update),d.fragment=!!i&&i(d.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();s.intro&&U(e.$$.fragment),F(e,s.target,s.anchor,s.customElement),D()}A(f)}class W{$destroy(){G(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function X(t,e){fetch("https://api.publicapis.org"+t).then((t=>t.json())).then((t=>{e(t)}))}function Y(t,e=500){let n;return(...r)=>{clearTimeout(n),n=setTimeout((()=>{t.apply(this,r)}),e)}}function Z(e){let n,r,s;return{c(){n=m("button"),n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',v(n,"class","dark-toggler svelte-2nwa6p"),v(n,"id","darkToggler"),v(n,"title","Current theme: dark. Click to switch")},m(t,e){h(t,n,e),r||(s=w(n,"click",tt),r=!0)},p:t,i:t,o:t,d(t){t&&p(n),r=!1,s()}}}function tt(){if(document.body.classList.contains("dark"))return document.body.classList.remove("dark"),this.title="Current theme: light. Click to switch",void(this.innerHTML='\n          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>\n        ');this.title="Current theme: dark. Click to switch",this.innerHTML='\n        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>\n      ',document.body.classList.add("dark")}class et extends W{constructor(t){super(),V(this,t,null,Z,o,{})}}function nt(e){let n,r,s,o,i,l,c,u;return c=new et({}),{c(){n=m("header"),r=m("div"),s=m("div"),o=m("div"),o.innerHTML='<h1 class="svelte-rivc8z">Public APIs\n          <small class="api-status svelte-rivc8z" id="apiStatus">BETA</small></h1> \n        <h2 class="svelte-rivc8z">Unofficial User Interface for\n          <a href="https://api.publicapis.org/" target="_blank" rel="noopener noreferrer">Public API for Public APIs</a></h2>',i=y(),l=m("div"),K(c.$$.fragment),v(o,"class","flex flex-wrap items-center"),v(s,"class","header__flexbox flex flex-wrap justify-between svelte-rivc8z"),v(r,"class","container--fluid"),v(n,"class","header svelte-rivc8z")},m(t,e){h(t,n,e),d(n,r),d(r,s),d(s,o),d(s,i),d(s,l),F(c,l,null),u=!0},p:t,i(t){u||(U(c.$$.fragment,t),u=!0)},o(t){J(c.$$.fragment,t),u=!1},d(t){t&&p(n),G(c)}}}class rt extends W{constructor(t){super(),V(this,t,null,nt,o,{})}}const st=[];function ot(e,n=t){let r;const s=new Set;function i(t){if(o(e,t)&&(e=t,r)){const t=!st.length;for(const t of s)t[1](),st.push(t,e);if(t){for(let t=0;t<st.length;t+=2)st[t][0](st[t+1]);st.length=0}}}return{set:i,update:function(t){i(t(e))},subscribe:function(o,l=t){const c=[o,l];return s.add(c),1===s.size&&(r=n(i)||t),o(e),()=>{s.delete(c),0===s.size&&(r(),r=null)}}}}const it=ot([]),lt=t=>{let e=[];it.subscribe((t=>{e=[...t]})),e.splice(e.indexOf(t),1),it.set(e)},ct=ot([]);function ut(e){let n,r;return{c(){n=new _(!1),r=x(),n.a=r},m(t,s){n.m(e[1],t,s),h(t,r,s)},p:t,d(t){t&&p(r),t&&n.d()}}}function at(e){let n,r;return{c(){n=new _(!1),r=x(),n.a=r},m(t,s){n.m(e[2],t,s),h(t,r,s)},p:t,d(t){t&&p(r),t&&n.d()}}}function ft(e){let n;function r(t,e){return t[0]?at:ut}let s=r(e),o=s(e);return{c(){o.c(),n=x()},m(t,e){o.m(t,e),h(t,n,e)},p(t,[e]){s===(s=r(t))&&o?o.p(t,e):(o.d(1),o=s(t),o&&(o.c(),o.m(n.parentNode,n)))},i:t,o:t,d(t){o.d(t),t&&p(n)}}}function dt(t,e,n){let{truthy:r}=e;return t.$$set=t=>{"truthy"in t&&n(0,r=t.truthy)},[r,'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"\n  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"\n  class="feather feather-x">\n  <line x1="18" y1="6" x2="6" y2="18"></line>\n  <line x1="6" y1="6" x2="18" y2="18"></line>\n</svg>\n','\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"\n  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"\n  class="feather feather-check">\n  <polyline points="20 6 9 17 4 12"></polyline>\n</svg>\n']}class ht extends W{constructor(t){super(),V(this,t,dt,ft,o,{truthy:0})}}function pt(t){let e,n,r,s,o,i,l,c,u,a,f,g,x,w,k,_,T,A,P,S,H,z,L,j,E,I,N,D,B,O,M,q,R,Q=t[0].API+"",V=t[0].Category+"",W=(t[0].Description.length>30?t[0].Description.substr(0,30)+"...":t[0].Description)+"";return A=new ht({props:{truthy:""===t[0].Auth}}),j=new ht({props:{truthy:t[0].HTTPS}}),O=new ht({props:{truthy:"yes"===t[0].Cors}}),{c(){e=m("article"),n=m("h3"),r=m("a"),s=$(Q),i=m("small"),l=$(V),c=y(),u=m("p"),a=$(W),g=y(),x=m("div"),w=m("span"),k=y(),_=m("span"),_.textContent="Auth",T=y(),K(A.$$.fragment),P=y(),S=m("span"),H=y(),z=m("span"),z.textContent="HTTPS",L=y(),K(j.$$.fragment),E=y(),I=m("span"),N=y(),D=m("span"),D.textContent="CORS",B=y(),K(O.$$.fragment),v(r,"href",o=t[0].Link),v(r,"target","_blank"),v(r,"rel","noopener noreferrer"),v(i,"class","entry__category svelte-15tibmb"),v(n,"class","entry__title flex items-center justify-between svelte-15tibmb"),v(u,"class","entry__description svelte-15tibmb"),v(u,"title",f=t[0].Description),C(w,"display","inline-block"),C(w,"width","8px"),C(w,"height","8px"),C(w,"border-radius","50%"),C(w,"background",""===t[0].Auth?"green":"red"),C(_,"margin","0 2px 0 4px"),C(S,"display","inline-block"),C(S,"width","8px"),C(S,"height","8px"),C(S,"border-radius","50%"),C(S,"background",t[0].HTTPS?"green":"red"),C(z,"margin","0 2px 0 4px"),C(I,"display","inline-block"),C(I,"width","8px"),C(I,"height","8px"),C(I,"border-radius","50%"),C(I,"background","yes"===t[0].Cors?"green":"no"===t[0].Cors?"red":"orange"),C(D,"margin","0 2px 0 4px"),v(x,"class","flex items-center"),C(x,"font-size","0.75rem"),v(x,"title",M=`Auth: ${t[0].Auth} | HTTPS: ${t[0].HTTPS} | Cors: ${t[0].Cors}`),v(e,"class",q="entry "+(t[2]?"recommended":t[1]?"not-recommended":"")+" svelte-15tibmb")},m(t,o){h(t,e,o),d(e,n),d(n,r),d(r,s),d(n,i),d(i,l),d(e,c),d(e,u),d(u,a),d(e,g),d(e,x),d(x,w),d(x,k),d(x,_),d(x,T),F(A,x,null),d(x,P),d(x,S),d(x,H),d(x,z),d(x,L),F(j,x,null),d(x,E),d(x,I),d(x,N),d(x,D),d(x,B),F(O,x,null),R=!0},p(t,[n]){(!R||1&n)&&Q!==(Q=t[0].API+"")&&b(s,Q),(!R||1&n&&o!==(o=t[0].Link))&&v(r,"href",o),(!R||1&n)&&V!==(V=t[0].Category+"")&&b(l,V),(!R||1&n)&&W!==(W=(t[0].Description.length>30?t[0].Description.substr(0,30)+"...":t[0].Description)+"")&&b(a,W),(!R||1&n&&f!==(f=t[0].Description))&&v(u,"title",f),(!R||1&n)&&C(w,"background",""===t[0].Auth?"green":"red");const i={};1&n&&(i.truthy=""===t[0].Auth),A.$set(i),(!R||1&n)&&C(S,"background",t[0].HTTPS?"green":"red");const c={};1&n&&(c.truthy=t[0].HTTPS),j.$set(c),(!R||1&n)&&C(I,"background","yes"===t[0].Cors?"green":"no"===t[0].Cors?"red":"orange");const d={};1&n&&(d.truthy="yes"===t[0].Cors),O.$set(d),(!R||1&n&&M!==(M=`Auth: ${t[0].Auth} | HTTPS: ${t[0].HTTPS} | Cors: ${t[0].Cors}`))&&v(x,"title",M),(!R||6&n&&q!==(q="entry "+(t[2]?"recommended":t[1]?"not-recommended":"")+" svelte-15tibmb"))&&v(e,"class",q)},i(t){R||(U(A.$$.fragment,t),U(j.$$.fragment,t),U(O.$$.fragment,t),R=!0)},o(t){J(A.$$.fragment,t),J(j.$$.fragment,t),J(O.$$.fragment,t),R=!1},d(t){t&&p(e),G(A),G(j),G(O)}}}function gt(t,e,n){let r,s,{entry:o={API:"AdoptAPet",Auth:"apiKey",Category:"Animals",Cors:"yes",Description:"Resource to help get pets adopted",HTTPS:!0,Link:"https://www.adoptapet.com/public/apis/pet_list.html"}}=e;return t.$$set=t=>{"entry"in t&&n(0,o=t.entry)},t.$$.update=()=>{1&t.$$.dirty&&n(2,r=""===o.Auth&&o.HTTPS&&"yes"===o.Cors),1&t.$$.dirty&&n(1,s=""!==o.Auth&&!o.HTTPS&&"yes"!==o.Cors)},[o,s,r]}class mt extends W{constructor(t){super(),V(this,t,gt,pt,o,{entry:0})}}function $t(t,e,n){const r=t.slice();return r[3]=e[n],r}function yt(t,e,n){const r=t.slice();return r[3]=e[n],r}function xt(t){let e;return{c(){e=m("p"),e.textContent="No entry.",v(e,"class","info svelte-10bbv7l")},m(t,n){h(t,e,n)},d(t){t&&p(e)}}}function wt(t){let e,n,r=t[1].slice(0,12),s=[];for(let e=0;e<r.length;e+=1)s[e]=bt($t(t,r,e));const o=t=>J(s[t],1,1,(()=>{s[t]=null}));return{c(){for(let t=0;t<s.length;t+=1)s[t].c();e=x()},m(t,r){for(let e=0;e<s.length;e+=1)s[e].m(t,r);h(t,e,r),n=!0},p(t,n){if(2&n){let i;for(r=t[1].slice(0,12),i=0;i<r.length;i+=1){const o=$t(t,r,i);s[i]?(s[i].p(o,n),U(s[i],1)):(s[i]=bt(o),s[i].c(),U(s[i],1),s[i].m(e.parentNode,e))}for(q(),i=r.length;i<s.length;i+=1)o(i);R()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)U(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)J(s[t]);n=!1},d(t){g(s,t),t&&p(e)}}}function vt(t){let e,n,r=t[1],s=[];for(let e=0;e<r.length;e+=1)s[e]=kt(yt(t,r,e));const o=t=>J(s[t],1,1,(()=>{s[t]=null}));return{c(){for(let t=0;t<s.length;t+=1)s[t].c();e=x()},m(t,r){for(let e=0;e<s.length;e+=1)s[e].m(t,r);h(t,e,r),n=!0},p(t,n){if(2&n){let i;for(r=t[1],i=0;i<r.length;i+=1){const o=yt(t,r,i);s[i]?(s[i].p(o,n),U(s[i],1)):(s[i]=kt(o),s[i].c(),U(s[i],1),s[i].m(e.parentNode,e))}for(q(),i=r.length;i<s.length;i+=1)o(i);R()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)U(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)J(s[t]);n=!1},d(t){g(s,t),t&&p(e)}}}function bt(t){let e,n;return e=new mt({props:{entry:t[3]}}),{c(){K(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.entry=t[3]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){G(e,t)}}}function kt(t){let e,n;return e=new mt({props:{entry:t[3]}}),{c(){K(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.entry=t[3]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){G(e,t)}}}function Ct(e){let n,r,s,o;return{c(){n=m("div"),r=m("button"),r.textContent="Show All",v(n,"class","show-all svelte-10bbv7l")},m(t,i){h(t,n,i),d(n,r),s||(o=w(r,"click",e[2]),s=!0)},p:t,d(t){t&&p(n),s=!1,o()}}}function _t(t){let e,n,r,s,o,i,l,c=(!t[1]||null===t[1]||!t[1].length)&&xt();const u=[vt,wt],a=[];function f(t,e){return t[0]?0:1}r=f(t),s=a[r]=u[r](t);let g=!1===t[0]&&Ct(t);return{c(){e=m("div"),c&&c.c(),n=y(),s.c(),o=y(),g&&g.c(),i=x(),v(e,"class","entries svelte-10bbv7l")},m(t,s){h(t,e,s),c&&c.m(e,null),d(e,n),a[r].m(e,null),h(t,o,s),g&&g.m(t,s),h(t,i,s),l=!0},p(t,[o]){t[1]&&null!==t[1]&&t[1].length?c&&(c.d(1),c=null):c||(c=xt(),c.c(),c.m(e,n));let l=r;r=f(t),r===l?a[r].p(t,o):(q(),J(a[l],1,1,(()=>{a[l]=null})),R(),s=a[r],s?s.p(t,o):(s=a[r]=u[r](t),s.c()),U(s,1),s.m(e,null)),!1===t[0]?g?g.p(t,o):(g=Ct(t),g.c(),g.m(i.parentNode,i)):g&&(g.d(1),g=null)},i(t){l||(U(s),l=!0)},o(t){J(s),l=!1},d(t){t&&p(e),c&&c.d(),a[r].d(),t&&p(o),g&&g.d(t),t&&p(i)}}}function Tt(t,e,n){let r;i(t,ct,(t=>n(1,r=t)));let s=!(r.length>12);return[s,r,()=>n(0,s=!0)]}class At extends W{constructor(t){super(),V(this,t,Tt,_t,o,{})}}function Pt(t){let e,n,r,s,o,i,l,c,u,a,f,g,x,w,k,_,T,A,P,S,H,z,L,j,E,I,N,D,B,O,M=t[0].API+"",q=t[0].Category+"",R=t[0].Description.substr(0,30)+"...";return T=new ht({props:{truthy:""===t[0].Auth}}),L=new ht({props:{truthy:t[0].HTTPS}}),B=new ht({props:{truthy:"yes"===t[0].Cors}}),{c(){e=m("article"),n=m("h3"),r=m("span"),s=$(M),o=m("small"),i=$(q),l=y(),c=m("p"),u=$(R),f=y(),g=m("div"),x=m("span"),w=y(),k=m("span"),k.textContent="Auth",_=y(),K(T.$$.fragment),A=y(),P=m("span"),S=y(),H=m("span"),H.textContent="HTTPS",z=y(),K(L.$$.fragment),j=y(),E=m("span"),I=y(),N=m("span"),N.textContent="CORS",D=y(),K(B.$$.fragment),v(o,"class","entry__category grey svelte-1ahn75l"),v(n,"class","entry__title grey flex items-center justify-between svelte-1ahn75l"),v(c,"class","entry__description grey svelte-1ahn75l"),v(c,"title",a=t[0].Description),C(x,"display","inline-block"),C(x,"width","8px"),C(x,"height","8px"),C(x,"border-radius","50%"),C(x,"background","green"),C(k,"margin","0 2px 0 4px"),C(P,"display","inline-block"),C(P,"width","8px"),C(P,"height","8px"),C(P,"border-radius","50%"),C(P,"background","green"),C(H,"margin","0 2px 0 4px"),C(E,"display","inline-block"),C(E,"width","8px"),C(E,"height","8px"),C(E,"border-radius","50%"),C(E,"background","green"),C(N,"margin","0 2px 0 4px"),v(g,"class","flex items-center grey svelte-1ahn75l"),C(g,"font-size","0.75rem"),v(e,"class","entry recommended svelte-1ahn75l")},m(t,a){h(t,e,a),d(e,n),d(n,r),d(r,s),d(n,o),d(o,i),d(e,l),d(e,c),d(c,u),d(e,f),d(e,g),d(g,x),d(g,w),d(g,k),d(g,_),F(T,g,null),d(g,A),d(g,P),d(g,S),d(g,H),d(g,z),F(L,g,null),d(g,j),d(g,E),d(g,I),d(g,N),d(g,D),F(B,g,null),O=!0},p(t,[e]){(!O||1&e)&&M!==(M=t[0].API+"")&&b(s,M),(!O||1&e)&&q!==(q=t[0].Category+"")&&b(i,q),(!O||1&e)&&R!==(R=t[0].Description.substr(0,30)+"...")&&b(u,R),(!O||1&e&&a!==(a=t[0].Description))&&v(c,"title",a);const n={};1&e&&(n.truthy=""===t[0].Auth),T.$set(n);const r={};1&e&&(r.truthy=t[0].HTTPS),L.$set(r);const o={};1&e&&(o.truthy="yes"===t[0].Cors),B.$set(o)},i(t){O||(U(T.$$.fragment,t),U(L.$$.fragment,t),U(B.$$.fragment,t),O=!0)},o(t){J(T.$$.fragment,t),J(L.$$.fragment,t),J(B.$$.fragment,t),O=!1},d(t){t&&p(e),G(T),G(L),G(B)}}}function St(t,e,n){let{entry:r={API:"AdoptAPet",Auth:"apiKey",Category:"Animals",Cors:"yes",Description:"Resource to help get pets adopted",HTTPS:!0,Link:"https://www.adoptapet.com/public/apis/pet_list.html"}}=e;return t.$$set=t=>{"entry"in t&&n(0,r=t.entry)},[r]}class Ht extends W{constructor(t){super(),V(this,t,St,Pt,o,{entry:0})}}function zt(t,e,n){const r=t.slice();return r[0]=e[n],r[2]=n,r}function Lt(t){let e,n;return e=new Ht({}),{c(){K(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){G(e,t)}}}function jt(e){let n,r,s=Array(12),o=[];for(let t=0;t<s.length;t+=1)o[t]=Lt(zt(e,s,t));return{c(){n=m("div");for(let t=0;t<o.length;t+=1)o[t].c();v(n,"class","entries svelte-1s374q")},m(t,e){h(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null);r=!0},p:t,i(t){if(!r){for(let t=0;t<s.length;t+=1)U(o[t]);r=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)J(o[t]);r=!1},d(t){t&&p(n),g(o,t)}}}class Et extends W{constructor(t){super(),V(this,t,null,jt,o,{})}}function It(t){let e,n;const r=t[1].default,s=l(r,t,t[0],null);return{c(){e=m("div"),s&&s.c(),v(e,"class","form-row svelte-czg3e6")},m(t,r){h(t,e,r),s&&s.m(e,null),n=!0},p(t,[e]){s&&s.p&&(!n||1&e)&&a(s,r,t,t[0],n?u(r,t[0],e,null):f(t[0]),null)},i(t){n||(U(s,t),n=!0)},o(t){J(s,t),n=!1},d(t){t&&p(e),s&&s.d(t)}}}function Nt(t,e,n){let{$$slots:r={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,r]}class Dt extends W{constructor(t){super(),V(this,t,Nt,It,o,{})}}const Bt=t=>({}),Ot=t=>({}),Mt=t=>({}),qt=t=>({});function Rt(t){let e,n,r,s,o;const i=t[1].main,c=l(i,t,t[0],qt),g=t[1].aside,$=l(g,t,t[0],Ot);return{c(){e=m("div"),n=m("main"),c&&c.c(),r=y(),s=m("aside"),$&&$.c(),v(n,"class","main svelte-1aizzw5"),v(s,"class","sidebar relative svelte-1aizzw5"),v(e,"class","main-wrapper container--fluid flex svelte-1aizzw5")},m(t,i){h(t,e,i),d(e,n),c&&c.m(n,null),d(e,r),d(e,s),$&&$.m(s,null),o=!0},p(t,[e]){c&&c.p&&(!o||1&e)&&a(c,i,t,t[0],o?u(i,t[0],e,Mt):f(t[0]),qt),$&&$.p&&(!o||1&e)&&a($,g,t,t[0],o?u(g,t[0],e,Bt):f(t[0]),Ot)},i(t){o||(U(c,t),U($,t),o=!0)},o(t){J(c,t),J($,t),o=!1},d(t){t&&p(e),c&&c.d(t),$&&$.d(t)}}}function Ut(t,e,n){let{$$slots:r={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,r]}class Jt extends W{constructor(t){super(),V(this,t,Ut,Rt,o,{})}}function Kt(e){let n,r,s,o,i,l,c,u,a;return{c(){n=m("label"),r=m("input"),i=y(),l=m("span"),c=$(e[1]),v(r,"type","checkbox"),v(r,"id",s="checkbox_"+e[1]),v(r,"name",e[0]),r.value=e[1],r.checked=o=e[2].includes(e[1]),v(r,"class","svelte-ojm33k"),v(l,"class","svelte-ojm33k"),v(n,"class","flex items-center svelte-ojm33k")},m(t,s){h(t,n,s),d(n,r),d(n,i),d(n,l),d(l,c),u||(a=w(r,"change",e[3]),u=!0)},p(t,[e]){2&e&&s!==(s="checkbox_"+t[1])&&v(r,"id",s),1&e&&v(r,"name",t[0]),2&e&&(r.value=t[1]),6&e&&o!==(o=t[2].includes(t[1]))&&(r.checked=o),2&e&&b(c,t[1])},i:t,o:t,d(t){t&&p(n),u=!1,a()}}}function Ft(t,e,n){let r;i(t,it,(t=>n(2,r=t)));let{name:s}=e,{category:o}=e;function l(t,e){e&&!r.includes(t)&&(t=>{it.update((e=>[...e,t]))})(t),!e&&r.includes(t)&&lt(t)}return t.$$set=t=>{"name"in t&&n(0,s=t.name),"category"in t&&n(1,o=t.category)},[s,o,r,t=>l(t.target.value,t.target.checked)]}class Gt extends W{constructor(t){super(),V(this,t,Ft,Kt,o,{name:0,category:1})}}function Qt(t,e,n){const r=t.slice();return r[4]=e[n],r}function Vt(t){let e,n,r=t[1],s=[];for(let e=0;e<r.length;e+=1)s[e]=Wt(Qt(t,r,e));const o=t=>J(s[t],1,1,(()=>{s[t]=null}));return{c(){for(let t=0;t<s.length;t+=1)s[t].c();e=x()},m(t,r){for(let e=0;e<s.length;e+=1)s[e].m(t,r);h(t,e,r),n=!0},p(t,n){if(2&n){let i;for(r=t[1],i=0;i<r.length;i+=1){const o=Qt(t,r,i);s[i]?(s[i].p(o,n),U(s[i],1)):(s[i]=Wt(o),s[i].c(),U(s[i],1),s[i].m(e.parentNode,e))}for(q(),i=r.length;i<s.length;i+=1)o(i);R()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)U(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)J(s[t]);n=!1},d(t){g(s,t),t&&p(e)}}}function Wt(t){let e,n;return e=new Gt({props:{name:"categories",category:t[4]}}),{c(){K(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.category=t[4]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){G(e,t)}}}function Xt(t){let e,n,r,s,o,i,l,c,u,a,f,g=t[1]&&Vt(t);return{c(){e=m("div"),n=m("h3"),r=$("Filter by categories "),s=$(t[0]),o=y(),i=m("input"),l=y(),c=m("div"),g&&g.c(),v(i,"class","w-full mb-4"),v(i,"placeholder","Search category"),v(c,"class","category-checkboxes svelte-4ydsdf"),v(c,"id","categoryOptions"),v(e,"class","category-widget svelte-4ydsdf")},m(p,m){h(p,e,m),d(e,n),d(n,r),d(n,s),d(e,o),d(e,i),k(i,t[0]),d(e,l),d(e,c),g&&g.m(c,null),u=!0,a||(f=w(i,"input",t[3]),a=!0)},p(t,[e]){(!u||1&e)&&b(s,t[0]),1&e&&i.value!==t[0]&&k(i,t[0]),t[1]?g?(g.p(t,e),2&e&&U(g,1)):(g=Vt(t),g.c(),U(g,1),g.m(c,null)):g&&(q(),J(g,1,1,(()=>{g=null})),R())},i(t){u||(U(g),u=!0)},o(t){J(g),u=!1},d(t){t&&p(e),g&&g.d(),a=!1,f()}}}const Yt="PUBLIC_API_CATEGORIES";function Zt(t,e,n){let r,s=[],o="";if(sessionStorage.getItem(Yt)){const t=JSON.parse(sessionStorage.getItem(Yt));t?(s=t,r=s):console.log("Something went wrong",{savedCategories:t})}else X("/categories",(function(t){t&&t.categories?(sessionStorage.setItem(Yt,JSON.stringify(t.categories)),n(2,s=t.categories),n(1,r=s)):console.log("Something went wrong",{res:t})}));return t.$$.update=()=>{5&t.$$.dirty&&n(1,r=""===o?s:s.filter((t=>t.toLowerCase().includes(o.toLowerCase()))))},[o,r,s,function(){o=this.value,n(0,o)}]}class te extends W{constructor(t){super(),V(this,t,Zt,Xt,o,{})}}function ee(t,e,n){const r=t.slice();return r[2]=e[n],r}function ne(t){let e,n,r,s,o=t[2]+"";function i(){return t[1](t[2])}return{c(){e=m("span"),n=$(o),v(e,"class","selected-category svelte-wafgqv")},m(t,o){h(t,e,o),d(e,n),r||(s=w(e,"click",i),r=!0)},p(e,r){t=e,1&r&&o!==(o=t[2]+"")&&b(n,o)},d(t){t&&p(e),r=!1,s()}}}function re(e){let n,r,s=e[0],o=[];for(let t=0;t<s.length;t+=1)o[t]=ne(ee(e,s,t));return{c(){n=m("div");for(let t=0;t<o.length;t+=1)o[t].c();v(n,"class",r="selected-categories "+(e[0].length?"filled":"")+" svelte-wafgqv"),v(n,"id","selectedCategories"),C(n,"width","70%")},m(t,e){h(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null)},p(t,[e]){if(1&e){let r;for(s=t[0],r=0;r<s.length;r+=1){const i=ee(t,s,r);o[r]?o[r].p(i,e):(o[r]=ne(i),o[r].c(),o[r].m(n,null))}for(;r<o.length;r+=1)o[r].d(1);o.length=s.length}1&e&&r!==(r="selected-categories "+(t[0].length?"filled":"")+" svelte-wafgqv")&&v(n,"class",r)},i:t,o:t,d(t){t&&p(n),g(o,t)}}}function se(t,e,n){let r;i(t,it,(t=>n(0,r=t)));return[r,t=>lt(t)]}class oe extends W{constructor(t){super(),V(this,t,se,re,o,{})}}function ie(t){let e,n;return e=new At({}),{c(){K(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){G(e,t)}}}function le(t){let e,n;return e=new Et({}),{c(){K(e.$$.fragment)},m(t,r){F(e,t,r),n=!0},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){G(e,t)}}}function ce(t){let e,n,r,s,o,i;e=new oe({});const l=[le,ie],c=[];function u(t,e){return t[1]?0:1}return r=u(t),s=c[r]=l[r](t),{c(){K(e.$$.fragment),n=y(),s.c(),o=x()},m(t,s){F(e,t,s),h(t,n,s),c[r].m(t,s),h(t,o,s),i=!0},p(t,e){let n=r;r=u(t),r!==n&&(q(),J(c[n],1,1,(()=>{c[n]=null})),R(),s=c[r],s||(s=c[r]=l[r](t),s.c()),U(s,1),s.m(o.parentNode,o))},i(t){i||(U(e.$$.fragment,t),U(s),i=!0)},o(t){J(e.$$.fragment,t),J(s),i=!1},d(t){G(e,t),t&&p(n),c[r].d(t),t&&p(o)}}}function ue(t){let e,n,r;return{c(){e=m("input"),v(e,"class","w-full border svelte-1pn3l3v"),v(e,"placeholder","Search")},m(s,o){h(s,e,o),k(e,t[0]),n||(r=w(e,"input",t[3]),n=!0)},p(t,n){1&n&&e.value!==t[0]&&k(e,t[0])},d(t){t&&p(e),n=!1,r()}}}function ae(t){let e,n,r,s,o;return n=new Dt({props:{$$slots:{default:[ue]},$$scope:{ctx:t}}}),s=new te({}),{c(){e=m("div"),K(n.$$.fragment),r=y(),K(s.$$.fragment),v(e,"class","sticky top-0")},m(t,i){h(t,e,i),F(n,e,null),d(e,r),F(s,e,null),o=!0},p(t,e){const r={};65&e&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){o||(U(n.$$.fragment,t),U(s.$$.fragment,t),o=!0)},o(t){J(n.$$.fragment,t),J(s.$$.fragment,t),o=!1},d(t){t&&p(e),G(n),G(s)}}}function fe(t){let e,n,r,s;return e=new rt({}),r=new Jt({props:{$$slots:{aside:[ae],main:[ce]},$$scope:{ctx:t}}}),{c(){K(e.$$.fragment),n=y(),K(r.$$.fragment)},m(t,o){F(e,t,o),h(t,n,o),F(r,t,o),s=!0},p(t,[e]){const n={};67&e&&(n.$$scope={dirty:e,ctx:t}),r.$set(n)},i(t){s||(U(e.$$.fragment,t),U(r.$$.fragment,t),s=!0)},o(t){J(e.$$.fragment,t),J(r.$$.fragment,t),s=!1},d(t){G(e,t),t&&p(n),G(r,t)}}}function de(t,e,n){const r={init:[]};let s=!0,o="";const i=Y((t=>{if(!!t.replace(/\s/g,"").length&&!1===s){n(1,s=!0);let e=[];const r=new Promise((e=>{X(`/entries?title=${t}`,(function(t){e(t)}))})),o=new Promise((e=>{X(`/entries?description=${t}`,(function(t){e(t)}))}));Promise.all([r,o]).then((t=>{t.forEach((t=>{t.count&&(e=[...e,...t.entries])}))})).finally((()=>{n(1,s=!1),ct.set(e)}))}})),l=Y((t=>{const e=[];let o=[];t.forEach((t=>{r[t]?o=[...o,...r[t]]:e.push(new Promise(((e,s)=>{X(`/entries?category=${t}`,(function(s){s&&s.entries&&(n(2,r[t]=s.entries,r),e(s))}))})))})),e.length?(n(1,s=!0),Promise.all(e).then((t=>{t.forEach((t=>{o=[...o,...t.entries]}))})).finally((()=>{n(1,s=!1),ct.set(o)}))):(n(1,s=!1),ct.set(o))}));return X("/entries?auth=null&cors=yes&https=true",(function(t){t&&t.entries&&(n(2,r.init=t.entries,r),ct.set(t.entries)),n(1,s=!1)})),it.subscribe((t=>{!1===s&&l(t)})),t.$$.update=()=>{5&t.$$.dirty&&(""===o?ct.set(r.init):i(o))},[o,s,r,function(){o=this.value,n(0,o)}]}return new class extends W{constructor(t){super(),V(this,t,de,fe,o,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
