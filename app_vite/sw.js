if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,o)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let t={};const d=e=>n(e,r),l={module:{uri:r},exports:t,require:d};i[r]=Promise.all(s.map((e=>l[e]||d(e)))).then((e=>(o(...e),t)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-f97d2bf7.js",revision:null},{url:"assets/workbox-window.prod.es5-a7b12eab.js",revision:null},{url:"index.html",revision:"d9d3abfec8f9429bb589cf1c572a0b3d"},{url:"icon.png",revision:"917515db74ea8d1aee6a246cfbcc0b45"},{url:"manifest.webmanifest",revision:"4eb25bbf3ea570ec694ad562dec34a6f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/^\/api/]}))}));
