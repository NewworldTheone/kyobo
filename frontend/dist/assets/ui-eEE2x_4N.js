import{r as a,a as pt,b as F,R as Te,c as mt}from"./vendor-BsK_Cp9f.js";var Ae={exports:{}},Q={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yt=a,gt=Symbol.for("react.element"),bt=Symbol.for("react.fragment"),Et=Object.prototype.hasOwnProperty,kt=yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ct={key:!0,ref:!0,__self:!0,__source:!0};function Ie(e,t,n){var r,o={},c=null,i=null;n!==void 0&&(c=""+n),t.key!==void 0&&(c=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)Et.call(t,r)&&!Ct.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:gt,type:e,key:c,ref:i,props:o,_owner:kt.current}}Q.Fragment=bt;Q.jsx=Ie;Q.jsxs=Ie;Ae.exports=Q;var M=Ae.exports;/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Pe=(...e)=>e.filter((t,n,r)=>!!t&&r.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var wt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=a.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:o="",children:c,iconNode:i,...s},p)=>a.createElement("svg",{ref:p,...wt,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:Pe("lucide",o),...s},[...i.map(([d,l])=>a.createElement(d,l)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=(e,t)=>{const n=a.forwardRef(({className:r,...o},c)=>a.createElement(Mt,{ref:c,iconNode:t,className:Pe(`lucide-${St(e)}`,r),...o}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lr=E("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dr=E("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fr=E("BarChart",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vr=E("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hr=E("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pr=E("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mr=E("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yr=E("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gr=E("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const br=E("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Er=E("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kr=E("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cr=E("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sr=E("FileUp",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wr=E("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=E("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xr=E("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rr=E("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tr=E("Map",[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ar=E("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ir=E("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=E("MoveRight",[["path",{d:"M18 8L22 12L18 16",key:"1r0oui"}],["path",{d:"M2 12H22",key:"1m8cig"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=E("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Or=E("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fr=E("QrCode",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lr=E("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _r=E("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=E("Scan",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jr=E("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=E("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=E("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=E("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=E("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=E("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=E("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hr=E("UserCog",[["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m21.7 16.4-.9-.3",key:"12j9ji"}],["path",{d:"m15.2 13.9-.9-.3",key:"1fdjdi"}],["path",{d:"m16.6 18.7.3-.9",key:"heedtr"}],["path",{d:"m19.1 12.2.3-.9",key:"1af3ki"}],["path",{d:"m19.6 18.7-.4-1",key:"1x9vze"}],["path",{d:"m16.8 12.3-.4-1",key:"vqeiwj"}],["path",{d:"m14.3 16.6 1-.4",key:"1qlj63"}],["path",{d:"m20.7 13.8 1-.4",key:"1v5t8k"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $r=E("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=E("WandSparkles",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=E("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function pe(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Ne(...e){return t=>{let n=!1;const r=e.map(o=>{const c=pe(o,t);return!n&&typeof c=="function"&&(n=!0),c});if(n)return()=>{for(let o=0;o<r.length;o++){const c=r[o];typeof c=="function"?c():pe(e[o],null)}}}}function L(...e){return a.useCallback(Ne(...e),e)}function X(e){const t=xt(e),n=a.forwardRef((r,o)=>{const{children:c,...i}=r,s=a.Children.toArray(c),p=s.find(Tt);if(p){const d=p.props.children,l=s.map(f=>f===p?a.Children.count(d)>1?a.Children.only(null):a.isValidElement(d)?d.props.children:null:f);return M.jsx(t,{...i,ref:o,children:a.isValidElement(d)?a.cloneElement(d,void 0,l):null})}return M.jsx(t,{...i,ref:o,children:c})});return n.displayName=`${e}.Slot`,n}var Yr=X("Slot");function xt(e){const t=a.forwardRef((n,r)=>{const{children:o,...c}=n;if(a.isValidElement(o)){const i=It(o),s=At(c,o.props);return o.type!==a.Fragment&&(s.ref=r?Ne(r,i):i),a.cloneElement(o,s)}return a.Children.count(o)>1?a.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var Rt=Symbol("radix.slottable");function Tt(e){return a.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===Rt}function At(e,t){const n={...t};for(const r in t){const o=e[r],c=t[r];/^on[A-Z]/.test(r)?o&&c?n[r]=(...s)=>{const p=c(...s);return o(...s),p}:o&&(n[r]=o):r==="style"?n[r]={...o,...c}:r==="className"&&(n[r]=[o,c].filter(Boolean).join(" "))}return{...e,...n}}function It(e){var r,o;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(o=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var Pt=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],I=Pt.reduce((e,t)=>{const n=X(`Primitive.${t}`),r=a.forwardRef((o,c)=>{const{asChild:i,...s}=o,p=i?n:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),M.jsx(p,{...s,ref:c})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{});function Nt(e,t){e&&pt.flushSync(()=>e.dispatchEvent(t))}function T(e,t,{checkForDefaultPrevented:n=!0}={}){return function(o){if(e==null||e(o),n===!1||!o.defaultPrevented)return t==null?void 0:t(o)}}function ve(e,t=[]){let n=[];function r(c,i){const s=a.createContext(i),p=n.length;n=[...n,i];const d=f=>{var m;const{scope:h,children:y,...S}=f,u=((m=h==null?void 0:h[e])==null?void 0:m[p])||s,v=a.useMemo(()=>S,Object.values(S));return M.jsx(u.Provider,{value:v,children:y})};d.displayName=c+"Provider";function l(f,h){var u;const y=((u=h==null?void 0:h[e])==null?void 0:u[p])||s,S=a.useContext(y);if(S)return S;if(i!==void 0)return i;throw new Error(`\`${f}\` must be used within \`${c}\``)}return[d,l]}const o=()=>{const c=n.map(i=>a.createContext(i));return function(s){const p=(s==null?void 0:s[e])||c;return a.useMemo(()=>({[`__scope${e}`]:{...s,[e]:p}}),[s,p])}};return o.scopeName=e,[r,Ot(o,...t)]}function Ot(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const r=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(c){const i=r.reduce((s,{useScope:p,scopeName:d})=>{const f=p(c)[`__scope${d}`];return{...s,...f}},{});return a.useMemo(()=>({[`__scope${t.scopeName}`]:i}),[i])}};return n.scopeName=t.scopeName,n}function Ft(e){const t=e+"CollectionProvider",[n,r]=ve(t),[o,c]=n(t,{collectionRef:{current:null},itemMap:new Map}),i=u=>{const{scope:v,children:m}=u,k=F.useRef(null),g=F.useRef(new Map).current;return M.jsx(o,{scope:v,itemMap:g,collectionRef:k,children:m})};i.displayName=t;const s=e+"CollectionSlot",p=X(s),d=F.forwardRef((u,v)=>{const{scope:m,children:k}=u,g=c(s,m),b=L(v,g.collectionRef);return M.jsx(p,{ref:b,children:k})});d.displayName=s;const l=e+"CollectionItemSlot",f="data-radix-collection-item",h=X(l),y=F.forwardRef((u,v)=>{const{scope:m,children:k,...g}=u,b=F.useRef(null),w=L(v,b),R=c(l,m);return F.useEffect(()=>(R.itemMap.set(b,{ref:b,...g}),()=>void R.itemMap.delete(b))),M.jsx(h,{[f]:"",ref:w,children:k})});y.displayName=l;function S(u){const v=c(e+"CollectionConsumer",u);return F.useCallback(()=>{const k=v.collectionRef.current;if(!k)return[];const g=Array.from(k.querySelectorAll(`[${f}]`));return Array.from(v.itemMap.values()).sort((R,C)=>g.indexOf(R.ref.current)-g.indexOf(C.ref.current))},[v.collectionRef,v.itemMap])}return[{Provider:i,Slot:d,ItemSlot:y},S,r]}var V=globalThis!=null&&globalThis.document?a.useLayoutEffect:()=>{},Lt=Te[" useId ".trim().toString()]||(()=>{}),_t=0;function Oe(e){const[t,n]=a.useState(Lt());return V(()=>{n(r=>r??String(_t++))},[e]),t?`radix-${t}`:""}function W(e){const t=a.useRef(e);return a.useEffect(()=>{t.current=e}),a.useMemo(()=>(...n)=>{var r;return(r=t.current)==null?void 0:r.call(t,...n)},[])}var Dt=Te[" useInsertionEffect ".trim().toString()]||V;function Fe({prop:e,defaultProp:t,onChange:n=()=>{},caller:r}){const[o,c,i]=jt({defaultProp:t,onChange:n}),s=e!==void 0,p=s?e:o;{const l=a.useRef(e!==void 0);a.useEffect(()=>{const f=l.current;f!==s&&console.warn(`${r} is changing from ${f?"controlled":"uncontrolled"} to ${s?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),l.current=s},[s,r])}const d=a.useCallback(l=>{var f;if(s){const h=Ut(l)?l(e):l;h!==e&&((f=i.current)==null||f.call(i,h))}else c(l)},[s,e,c,i]);return[p,d]}function jt({defaultProp:e,onChange:t}){const[n,r]=a.useState(e),o=a.useRef(n),c=a.useRef(t);return Dt(()=>{c.current=t},[t]),a.useEffect(()=>{var i;o.current!==n&&((i=c.current)==null||i.call(c,n),o.current=n)},[n,o]),[n,r,c]}function Ut(e){return typeof e=="function"}var Bt=a.createContext(void 0);function Le(e){const t=a.useContext(Bt);return e||t||"ltr"}var ne="rovingFocusGroup.onEntryFocus",Wt={bubbles:!1,cancelable:!0},q="RovingFocusGroup",[le,_e,Vt]=Ft(q),[qt,De]=ve(q,[Vt]),[zt,Ht]=qt(q),je=a.forwardRef((e,t)=>M.jsx(le.Provider,{scope:e.__scopeRovingFocusGroup,children:M.jsx(le.Slot,{scope:e.__scopeRovingFocusGroup,children:M.jsx($t,{...e,ref:t})})}));je.displayName=q;var $t=a.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,orientation:r,loop:o=!1,dir:c,currentTabStopId:i,defaultCurrentTabStopId:s,onCurrentTabStopIdChange:p,onEntryFocus:d,preventScrollOnEntryFocus:l=!1,...f}=e,h=a.useRef(null),y=L(t,h),S=Le(c),[u,v]=Fe({prop:i,defaultProp:s??null,onChange:p,caller:q}),[m,k]=a.useState(!1),g=W(d),b=_e(n),w=a.useRef(!1),[R,C]=a.useState(0);return a.useEffect(()=>{const x=h.current;if(x)return x.addEventListener(ne,g),()=>x.removeEventListener(ne,g)},[g]),M.jsx(zt,{scope:n,orientation:r,dir:S,loop:o,currentTabStopId:u,onItemFocus:a.useCallback(x=>v(x),[v]),onItemShiftTab:a.useCallback(()=>k(!0),[]),onFocusableItemAdd:a.useCallback(()=>C(x=>x+1),[]),onFocusableItemRemove:a.useCallback(()=>C(x=>x-1),[]),children:M.jsx(I.div,{tabIndex:m||R===0?-1:0,"data-orientation":r,...f,ref:y,style:{outline:"none",...e.style},onMouseDown:T(e.onMouseDown,()=>{w.current=!0}),onFocus:T(e.onFocus,x=>{const N=!w.current;if(x.target===x.currentTarget&&N&&!m){const _=new CustomEvent(ne,Wt);if(x.currentTarget.dispatchEvent(_),!_.defaultPrevented){const te=b().filter(O=>O.focusable),ft=te.find(O=>O.active),vt=te.find(O=>O.id===u),ht=[ft,vt,...te].filter(Boolean).map(O=>O.ref.current);We(ht,l)}}w.current=!1}),onBlur:T(e.onBlur,()=>k(!1))})})}),Ue="RovingFocusGroupItem",Be=a.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,focusable:r=!0,active:o=!1,tabStopId:c,children:i,...s}=e,p=Oe(),d=c||p,l=Ht(Ue,n),f=l.currentTabStopId===d,h=_e(n),{onFocusableItemAdd:y,onFocusableItemRemove:S,currentTabStopId:u}=l;return a.useEffect(()=>{if(r)return y(),()=>S()},[r,y,S]),M.jsx(le.ItemSlot,{scope:n,id:d,focusable:r,active:o,children:M.jsx(I.span,{tabIndex:f?0:-1,"data-orientation":l.orientation,...s,ref:t,onMouseDown:T(e.onMouseDown,v=>{r?l.onItemFocus(d):v.preventDefault()}),onFocus:T(e.onFocus,()=>l.onItemFocus(d)),onKeyDown:T(e.onKeyDown,v=>{if(v.key==="Tab"&&v.shiftKey){l.onItemShiftTab();return}if(v.target!==v.currentTarget)return;const m=Yt(v,l.orientation,l.dir);if(m!==void 0){if(v.metaKey||v.ctrlKey||v.altKey||v.shiftKey)return;v.preventDefault();let g=h().filter(b=>b.focusable).map(b=>b.ref.current);if(m==="last")g.reverse();else if(m==="prev"||m==="next"){m==="prev"&&g.reverse();const b=g.indexOf(v.currentTarget);g=l.loop?Zt(g,b+1):g.slice(b+1)}setTimeout(()=>We(g))}}),children:typeof i=="function"?i({isCurrentTabStop:f,hasTabStop:u!=null}):i})})});Be.displayName=Ue;var Kt={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Gt(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function Yt(e,t,n){const r=Gt(e.key,n);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(r))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(r)))return Kt[r]}function We(e,t=!1){const n=document.activeElement;for(const r of e)if(r===n||(r.focus({preventScroll:t}),document.activeElement!==n))return}function Zt(e,t){return e.map((n,r)=>e[(t+r)%e.length])}var Xt=je,Qt=Be;function Jt(e,t){return a.useReducer((n,r)=>t[n][r]??n,e)}var Ve=e=>{const{present:t,children:n}=e,r=en(t),o=typeof n=="function"?n({present:r.isPresent}):a.Children.only(n),c=L(r.ref,tn(o));return typeof n=="function"||r.isPresent?a.cloneElement(o,{ref:c}):null};Ve.displayName="Presence";function en(e){const[t,n]=a.useState(),r=a.useRef(null),o=a.useRef(e),c=a.useRef("none"),i=e?"mounted":"unmounted",[s,p]=Jt(i,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return a.useEffect(()=>{const d=z(r.current);c.current=s==="mounted"?d:"none"},[s]),V(()=>{const d=r.current,l=o.current;if(l!==e){const h=c.current,y=z(d);e?p("MOUNT"):y==="none"||(d==null?void 0:d.display)==="none"?p("UNMOUNT"):p(l&&h!==y?"ANIMATION_OUT":"UNMOUNT"),o.current=e}},[e,p]),V(()=>{if(t){let d;const l=t.ownerDocument.defaultView??window,f=y=>{const u=z(r.current).includes(y.animationName);if(y.target===t&&u&&(p("ANIMATION_END"),!o.current)){const v=t.style.animationFillMode;t.style.animationFillMode="forwards",d=l.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=v)})}},h=y=>{y.target===t&&(c.current=z(r.current))};return t.addEventListener("animationstart",h),t.addEventListener("animationcancel",f),t.addEventListener("animationend",f),()=>{l.clearTimeout(d),t.removeEventListener("animationstart",h),t.removeEventListener("animationcancel",f),t.removeEventListener("animationend",f)}}else p("ANIMATION_END")},[t,p]),{isPresent:["mounted","unmountSuspended"].includes(s),ref:a.useCallback(d=>{r.current=d?getComputedStyle(d):null,n(d)},[])}}function z(e){return(e==null?void 0:e.animationName)||"none"}function tn(e){var r,o;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(o=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var J="Tabs",[nn,Zr]=ve(J,[De]),qe=De(),[rn,he]=nn(J),ze=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:r,onValueChange:o,defaultValue:c,orientation:i="horizontal",dir:s,activationMode:p="automatic",...d}=e,l=Le(s),[f,h]=Fe({prop:r,onChange:o,defaultProp:c??"",caller:J});return M.jsx(rn,{scope:n,baseId:Oe(),value:f,onValueChange:h,orientation:i,dir:l,activationMode:p,children:M.jsx(I.div,{dir:l,"data-orientation":i,...d,ref:t})})});ze.displayName=J;var He="TabsList",$e=a.forwardRef((e,t)=>{const{__scopeTabs:n,loop:r=!0,...o}=e,c=he(He,n),i=qe(n);return M.jsx(Xt,{asChild:!0,...i,orientation:c.orientation,dir:c.dir,loop:r,children:M.jsx(I.div,{role:"tablist","aria-orientation":c.orientation,...o,ref:t})})});$e.displayName=He;var Ke="TabsTrigger",Ge=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:r,disabled:o=!1,...c}=e,i=he(Ke,n),s=qe(n),p=Xe(i.baseId,r),d=Qe(i.baseId,r),l=r===i.value;return M.jsx(Qt,{asChild:!0,...s,focusable:!o,active:l,children:M.jsx(I.button,{type:"button",role:"tab","aria-selected":l,"aria-controls":d,"data-state":l?"active":"inactive","data-disabled":o?"":void 0,disabled:o,id:p,...c,ref:t,onMouseDown:T(e.onMouseDown,f=>{!o&&f.button===0&&f.ctrlKey===!1?i.onValueChange(r):f.preventDefault()}),onKeyDown:T(e.onKeyDown,f=>{[" ","Enter"].includes(f.key)&&i.onValueChange(r)}),onFocus:T(e.onFocus,()=>{const f=i.activationMode!=="manual";!l&&!o&&f&&i.onValueChange(r)})})})});Ge.displayName=Ke;var Ye="TabsContent",Ze=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:r,forceMount:o,children:c,...i}=e,s=he(Ye,n),p=Xe(s.baseId,r),d=Qe(s.baseId,r),l=r===s.value,f=a.useRef(l);return a.useEffect(()=>{const h=requestAnimationFrame(()=>f.current=!1);return()=>cancelAnimationFrame(h)},[]),M.jsx(Ve,{present:o||l,children:({present:h})=>M.jsx(I.div,{"data-state":l?"active":"inactive","data-orientation":s.orientation,role:"tabpanel","aria-labelledby":p,hidden:!h,id:d,tabIndex:0,...i,ref:t,style:{...e.style,animationDuration:f.current?"0s":void 0},children:h&&c})})});Ze.displayName=Ye;function Xe(e,t){return`${e}-trigger-${t}`}function Qe(e,t){return`${e}-content-${t}`}var Xr=ze,Qr=$e,Jr=Ge,eo=Ze;function on(e,t=globalThis==null?void 0:globalThis.document){const n=W(e);a.useEffect(()=>{const r=o=>{o.key==="Escape"&&n(o)};return t.addEventListener("keydown",r,{capture:!0}),()=>t.removeEventListener("keydown",r,{capture:!0})},[n,t])}var an="DismissableLayer",de="dismissableLayer.update",cn="dismissableLayer.pointerDownOutside",sn="dismissableLayer.focusOutside",me,Je=a.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),et=a.forwardRef((e,t)=>{const{disableOutsidePointerEvents:n=!1,onEscapeKeyDown:r,onPointerDownOutside:o,onFocusOutside:c,onInteractOutside:i,onDismiss:s,...p}=e,d=a.useContext(Je),[l,f]=a.useState(null),h=(l==null?void 0:l.ownerDocument)??(globalThis==null?void 0:globalThis.document),[,y]=a.useState({}),S=L(t,C=>f(C)),u=Array.from(d.layers),[v]=[...d.layersWithOutsidePointerEventsDisabled].slice(-1),m=u.indexOf(v),k=l?u.indexOf(l):-1,g=d.layersWithOutsidePointerEventsDisabled.size>0,b=k>=m,w=ln(C=>{const x=C.target,N=[...d.branches].some(_=>_.contains(x));!b||N||(o==null||o(C),i==null||i(C),C.defaultPrevented||s==null||s())},h),R=dn(C=>{const x=C.target;[...d.branches].some(_=>_.contains(x))||(c==null||c(C),i==null||i(C),C.defaultPrevented||s==null||s())},h);return on(C=>{k===d.layers.size-1&&(r==null||r(C),!C.defaultPrevented&&s&&(C.preventDefault(),s()))},h),a.useEffect(()=>{if(l)return n&&(d.layersWithOutsidePointerEventsDisabled.size===0&&(me=h.body.style.pointerEvents,h.body.style.pointerEvents="none"),d.layersWithOutsidePointerEventsDisabled.add(l)),d.layers.add(l),ye(),()=>{n&&d.layersWithOutsidePointerEventsDisabled.size===1&&(h.body.style.pointerEvents=me)}},[l,h,n,d]),a.useEffect(()=>()=>{l&&(d.layers.delete(l),d.layersWithOutsidePointerEventsDisabled.delete(l),ye())},[l,d]),a.useEffect(()=>{const C=()=>y({});return document.addEventListener(de,C),()=>document.removeEventListener(de,C)},[]),M.jsx(I.div,{...p,ref:S,style:{pointerEvents:g?b?"auto":"none":void 0,...e.style},onFocusCapture:T(e.onFocusCapture,R.onFocusCapture),onBlurCapture:T(e.onBlurCapture,R.onBlurCapture),onPointerDownCapture:T(e.onPointerDownCapture,w.onPointerDownCapture)})});et.displayName=an;var un="DismissableLayerBranch",tt=a.forwardRef((e,t)=>{const n=a.useContext(Je),r=a.useRef(null),o=L(t,r);return a.useEffect(()=>{const c=r.current;if(c)return n.branches.add(c),()=>{n.branches.delete(c)}},[n.branches]),M.jsx(I.div,{...e,ref:o})});tt.displayName=un;function ln(e,t=globalThis==null?void 0:globalThis.document){const n=W(e),r=a.useRef(!1),o=a.useRef(()=>{});return a.useEffect(()=>{const c=s=>{if(s.target&&!r.current){let p=function(){nt(cn,n,d,{discrete:!0})};const d={originalEvent:s};s.pointerType==="touch"?(t.removeEventListener("click",o.current),o.current=p,t.addEventListener("click",o.current,{once:!0})):p()}else t.removeEventListener("click",o.current);r.current=!1},i=window.setTimeout(()=>{t.addEventListener("pointerdown",c)},0);return()=>{window.clearTimeout(i),t.removeEventListener("pointerdown",c),t.removeEventListener("click",o.current)}},[t,n]),{onPointerDownCapture:()=>r.current=!0}}function dn(e,t=globalThis==null?void 0:globalThis.document){const n=W(e),r=a.useRef(!1);return a.useEffect(()=>{const o=c=>{c.target&&!r.current&&nt(sn,n,{originalEvent:c},{discrete:!1})};return t.addEventListener("focusin",o),()=>t.removeEventListener("focusin",o)},[t,n]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}function ye(){const e=new CustomEvent(de);document.dispatchEvent(e)}function nt(e,t,n,{discrete:r}){const o=n.originalEvent.target,c=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:n});t&&o.addEventListener(e,t,{once:!0}),r?Nt(o,c):o.dispatchEvent(c)}var to=et,no=tt,re=0;function ro(){a.useEffect(()=>{const e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",e[0]??ge()),document.body.insertAdjacentElement("beforeend",e[1]??ge()),re++,()=>{re===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(t=>t.remove()),re--}},[])}function ge(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var oe="focusScope.autoFocusOnMount",ae="focusScope.autoFocusOnUnmount",be={bubbles:!1,cancelable:!0},fn="FocusScope",vn=a.forwardRef((e,t)=>{const{loop:n=!1,trapped:r=!1,onMountAutoFocus:o,onUnmountAutoFocus:c,...i}=e,[s,p]=a.useState(null),d=W(o),l=W(c),f=a.useRef(null),h=L(t,u=>p(u)),y=a.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;a.useEffect(()=>{if(r){let u=function(g){if(y.paused||!s)return;const b=g.target;s.contains(b)?f.current=b:P(f.current,{select:!0})},v=function(g){if(y.paused||!s)return;const b=g.relatedTarget;b!==null&&(s.contains(b)||P(f.current,{select:!0}))},m=function(g){if(document.activeElement===document.body)for(const w of g)w.removedNodes.length>0&&P(s)};document.addEventListener("focusin",u),document.addEventListener("focusout",v);const k=new MutationObserver(m);return s&&k.observe(s,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",u),document.removeEventListener("focusout",v),k.disconnect()}}},[r,s,y.paused]),a.useEffect(()=>{if(s){ke.add(y);const u=document.activeElement;if(!s.contains(u)){const m=new CustomEvent(oe,be);s.addEventListener(oe,d),s.dispatchEvent(m),m.defaultPrevented||(hn(bn(rt(s)),{select:!0}),document.activeElement===u&&P(s))}return()=>{s.removeEventListener(oe,d),setTimeout(()=>{const m=new CustomEvent(ae,be);s.addEventListener(ae,l),s.dispatchEvent(m),m.defaultPrevented||P(u??document.body,{select:!0}),s.removeEventListener(ae,l),ke.remove(y)},0)}}},[s,d,l,y]);const S=a.useCallback(u=>{if(!n&&!r||y.paused)return;const v=u.key==="Tab"&&!u.altKey&&!u.ctrlKey&&!u.metaKey,m=document.activeElement;if(v&&m){const k=u.currentTarget,[g,b]=pn(k);g&&b?!u.shiftKey&&m===b?(u.preventDefault(),n&&P(g,{select:!0})):u.shiftKey&&m===g&&(u.preventDefault(),n&&P(b,{select:!0})):m===k&&u.preventDefault()}},[n,r,y.paused]);return M.jsx(I.div,{tabIndex:-1,...i,ref:h,onKeyDown:S})});vn.displayName=fn;function hn(e,{select:t=!1}={}){const n=document.activeElement;for(const r of e)if(P(r,{select:t}),document.activeElement!==n)return}function pn(e){const t=rt(e),n=Ee(t,e),r=Ee(t.reverse(),e);return[n,r]}function rt(e){const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const o=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||o?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function Ee(e,t){for(const n of e)if(!mn(n,{upTo:t}))return n}function mn(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function yn(e){return e instanceof HTMLInputElement&&"select"in e}function P(e,{select:t=!1}={}){if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&yn(e)&&t&&e.select()}}var ke=gn();function gn(){let e=[];return{add(t){const n=e[0];t!==n&&(n==null||n.pause()),e=Ce(e,t),e.unshift(t)},remove(t){var n;e=Ce(e,t),(n=e[0])==null||n.resume()}}}function Ce(e,t){const n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function bn(e){return e.filter(t=>t.tagName!=="A")}var En="Portal",kn=a.forwardRef((e,t)=>{var s;const{container:n,...r}=e,[o,c]=a.useState(!1);V(()=>c(!0),[]);const i=n||o&&((s=globalThis==null?void 0:globalThis.document)==null?void 0:s.body);return i?mt.createPortal(M.jsx(I.div,{...r,ref:t}),i):null});kn.displayName=En;var Cn=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},D=new WeakMap,H=new WeakMap,$={},ce=0,ot=function(e){return e&&(e.host||ot(e.parentNode))},Sn=function(e,t){return t.map(function(n){if(e.contains(n))return n;var r=ot(n);return r&&e.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",e,". Doing nothing"),null)}).filter(function(n){return!!n})},wn=function(e,t,n,r){var o=Sn(t,Array.isArray(e)?e:[e]);$[n]||($[n]=new WeakMap);var c=$[n],i=[],s=new Set,p=new Set(o),d=function(f){!f||s.has(f)||(s.add(f),d(f.parentNode))};o.forEach(d);var l=function(f){!f||p.has(f)||Array.prototype.forEach.call(f.children,function(h){if(s.has(h))l(h);else try{var y=h.getAttribute(r),S=y!==null&&y!=="false",u=(D.get(h)||0)+1,v=(c.get(h)||0)+1;D.set(h,u),c.set(h,v),i.push(h),u===1&&S&&H.set(h,!0),v===1&&h.setAttribute(n,"true"),S||h.setAttribute(r,"true")}catch(m){console.error("aria-hidden: cannot operate on ",h,m)}})};return l(t),s.clear(),ce++,function(){i.forEach(function(f){var h=D.get(f)-1,y=c.get(f)-1;D.set(f,h),c.set(f,y),h||(H.has(f)||f.removeAttribute(r),H.delete(f)),y||f.removeAttribute(n)}),ce--,ce||(D=new WeakMap,D=new WeakMap,H=new WeakMap,$={})}},oo=function(e,t,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),o=Cn(e);return o?(r.push.apply(r,Array.from(o.querySelectorAll("[aria-live], script"))),wn(r,o,n,"aria-hidden")):function(){return null}},A=function(){return A=Object.assign||function(t){for(var n,r=1,o=arguments.length;r<o;r++){n=arguments[r];for(var c in n)Object.prototype.hasOwnProperty.call(n,c)&&(t[c]=n[c])}return t},A.apply(this,arguments)};function at(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n}function Mn(e,t,n){if(n||arguments.length===2)for(var r=0,o=t.length,c;r<o;r++)(c||!(r in t))&&(c||(c=Array.prototype.slice.call(t,0,r)),c[r]=t[r]);return e.concat(c||Array.prototype.slice.call(t))}var Y="right-scroll-bar-position",Z="width-before-scroll-bar",xn="with-scroll-bars-hidden",Rn="--removed-body-scroll-bar-size";function se(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function Tn(e,t){var n=a.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var o=n.value;o!==r&&(n.value=r,n.callback(r,o))}}}})[0];return n.callback=t,n.facade}var An=typeof window<"u"?a.useLayoutEffect:a.useEffect,Se=new WeakMap;function In(e,t){var n=Tn(null,function(r){return e.forEach(function(o){return se(o,r)})});return An(function(){var r=Se.get(n);if(r){var o=new Set(r),c=new Set(e),i=n.current;o.forEach(function(s){c.has(s)||se(s,null)}),c.forEach(function(s){o.has(s)||se(s,i)})}Se.set(n,e)},[e]),n}function Pn(e){return e}function Nn(e,t){t===void 0&&(t=Pn);var n=[],r=!1,o={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(c){var i=t(c,r);return n.push(i),function(){n=n.filter(function(s){return s!==i})}},assignSyncMedium:function(c){for(r=!0;n.length;){var i=n;n=[],i.forEach(c)}n={push:function(s){return c(s)},filter:function(){return n}}},assignMedium:function(c){r=!0;var i=[];if(n.length){var s=n;n=[],s.forEach(c),i=n}var p=function(){var l=i;i=[],l.forEach(c)},d=function(){return Promise.resolve().then(p)};d(),n={push:function(l){i.push(l),d()},filter:function(l){return i=i.filter(l),n}}}};return o}function On(e){e===void 0&&(e={});var t=Nn(null);return t.options=A({async:!0,ssr:!1},e),t}var ct=function(e){var t=e.sideCar,n=at(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return a.createElement(r,A({},n))};ct.isSideCarExport=!0;function Fn(e,t){return e.useMedium(t),ct}var st=On(),ie=function(){},ee=a.forwardRef(function(e,t){var n=a.useRef(null),r=a.useState({onScrollCapture:ie,onWheelCapture:ie,onTouchMoveCapture:ie}),o=r[0],c=r[1],i=e.forwardProps,s=e.children,p=e.className,d=e.removeScrollBar,l=e.enabled,f=e.shards,h=e.sideCar,y=e.noRelative,S=e.noIsolation,u=e.inert,v=e.allowPinchZoom,m=e.as,k=m===void 0?"div":m,g=e.gapMode,b=at(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),w=h,R=In([n,t]),C=A(A({},b),o);return a.createElement(a.Fragment,null,l&&a.createElement(w,{sideCar:st,removeScrollBar:d,shards:f,noRelative:y,noIsolation:S,inert:u,setCallbacks:c,allowPinchZoom:!!v,lockRef:n,gapMode:g}),i?a.cloneElement(a.Children.only(s),A(A({},C),{ref:R})):a.createElement(k,A({},C,{className:p,ref:R}),s))});ee.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};ee.classNames={fullWidth:Z,zeroRight:Y};var Ln=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function _n(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=Ln();return t&&e.setAttribute("nonce",t),e}function Dn(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function jn(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Un=function(){var e=0,t=null;return{add:function(n){e==0&&(t=_n())&&(Dn(t,n),jn(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},Bn=function(){var e=Un();return function(t,n){a.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},it=function(){var e=Bn(),t=function(n){var r=n.styles,o=n.dynamic;return e(r,o),null};return t},Wn={left:0,top:0,right:0,gap:0},ue=function(e){return parseInt(e||"",10)||0},Vn=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],o=t[e==="padding"?"paddingRight":"marginRight"];return[ue(n),ue(r),ue(o)]},qn=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Wn;var t=Vn(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},zn=it(),B="data-scroll-locked",Hn=function(e,t,n,r){var o=e.left,c=e.top,i=e.right,s=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(xn,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(s,"px ").concat(r,`;
  }
  body[`).concat(B,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(c,`px;
    padding-right: `).concat(i,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(s,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Y,` {
    right: `).concat(s,"px ").concat(r,`;
  }
  
  .`).concat(Z,` {
    margin-right: `).concat(s,"px ").concat(r,`;
  }
  
  .`).concat(Y," .").concat(Y,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(Z," .").concat(Z,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(B,`] {
    `).concat(Rn,": ").concat(s,`px;
  }
`)},we=function(){var e=parseInt(document.body.getAttribute(B)||"0",10);return isFinite(e)?e:0},$n=function(){a.useEffect(function(){return document.body.setAttribute(B,(we()+1).toString()),function(){var e=we()-1;e<=0?document.body.removeAttribute(B):document.body.setAttribute(B,e.toString())}},[])},Kn=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,o=r===void 0?"margin":r;$n();var c=a.useMemo(function(){return qn(o)},[o]);return a.createElement(zn,{styles:Hn(c,!t,o,n?"":"!important")})},fe=!1;if(typeof window<"u")try{var K=Object.defineProperty({},"passive",{get:function(){return fe=!0,!0}});window.addEventListener("test",K,K),window.removeEventListener("test",K,K)}catch{fe=!1}var j=fe?{passive:!1}:!1,Gn=function(e){return e.tagName==="TEXTAREA"},ut=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!Gn(e)&&n[t]==="visible")},Yn=function(e){return ut(e,"overflowY")},Zn=function(e){return ut(e,"overflowX")},Me=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var o=lt(e,r);if(o){var c=dt(e,r),i=c[1],s=c[2];if(i>s)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},Xn=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},Qn=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},lt=function(e,t){return e==="v"?Yn(t):Zn(t)},dt=function(e,t){return e==="v"?Xn(t):Qn(t)},Jn=function(e,t){return e==="h"&&t==="rtl"?-1:1},er=function(e,t,n,r,o){var c=Jn(e,window.getComputedStyle(t).direction),i=c*r,s=n.target,p=t.contains(s),d=!1,l=i>0,f=0,h=0;do{if(!s)break;var y=dt(e,s),S=y[0],u=y[1],v=y[2],m=u-v-c*S;(S||m)&&lt(e,s)&&(f+=m,h+=S);var k=s.parentNode;s=k&&k.nodeType===Node.DOCUMENT_FRAGMENT_NODE?k.host:k}while(!p&&s!==document.body||p&&(t.contains(s)||t===s));return(l&&Math.abs(f)<1||!l&&Math.abs(h)<1)&&(d=!0),d},G=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},xe=function(e){return[e.deltaX,e.deltaY]},Re=function(e){return e&&"current"in e?e.current:e},tr=function(e,t){return e[0]===t[0]&&e[1]===t[1]},nr=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},rr=0,U=[];function or(e){var t=a.useRef([]),n=a.useRef([0,0]),r=a.useRef(),o=a.useState(rr++)[0],c=a.useState(it)[0],i=a.useRef(e);a.useEffect(function(){i.current=e},[e]),a.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var u=Mn([e.lockRef.current],(e.shards||[]).map(Re),!0).filter(Boolean);return u.forEach(function(v){return v.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),u.forEach(function(v){return v.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var s=a.useCallback(function(u,v){if("touches"in u&&u.touches.length===2||u.type==="wheel"&&u.ctrlKey)return!i.current.allowPinchZoom;var m=G(u),k=n.current,g="deltaX"in u?u.deltaX:k[0]-m[0],b="deltaY"in u?u.deltaY:k[1]-m[1],w,R=u.target,C=Math.abs(g)>Math.abs(b)?"h":"v";if("touches"in u&&C==="h"&&R.type==="range")return!1;var x=Me(C,R);if(!x)return!0;if(x?w=C:(w=C==="v"?"h":"v",x=Me(C,R)),!x)return!1;if(!r.current&&"changedTouches"in u&&(g||b)&&(r.current=w),!w)return!0;var N=r.current||w;return er(N,v,u,N==="h"?g:b)},[]),p=a.useCallback(function(u){var v=u;if(!(!U.length||U[U.length-1]!==c)){var m="deltaY"in v?xe(v):G(v),k=t.current.filter(function(w){return w.name===v.type&&(w.target===v.target||v.target===w.shadowParent)&&tr(w.delta,m)})[0];if(k&&k.should){v.cancelable&&v.preventDefault();return}if(!k){var g=(i.current.shards||[]).map(Re).filter(Boolean).filter(function(w){return w.contains(v.target)}),b=g.length>0?s(v,g[0]):!i.current.noIsolation;b&&v.cancelable&&v.preventDefault()}}},[]),d=a.useCallback(function(u,v,m,k){var g={name:u,delta:v,target:m,should:k,shadowParent:ar(m)};t.current.push(g),setTimeout(function(){t.current=t.current.filter(function(b){return b!==g})},1)},[]),l=a.useCallback(function(u){n.current=G(u),r.current=void 0},[]),f=a.useCallback(function(u){d(u.type,xe(u),u.target,s(u,e.lockRef.current))},[]),h=a.useCallback(function(u){d(u.type,G(u),u.target,s(u,e.lockRef.current))},[]);a.useEffect(function(){return U.push(c),e.setCallbacks({onScrollCapture:f,onWheelCapture:f,onTouchMoveCapture:h}),document.addEventListener("wheel",p,j),document.addEventListener("touchmove",p,j),document.addEventListener("touchstart",l,j),function(){U=U.filter(function(u){return u!==c}),document.removeEventListener("wheel",p,j),document.removeEventListener("touchmove",p,j),document.removeEventListener("touchstart",l,j)}},[]);var y=e.removeScrollBar,S=e.inert;return a.createElement(a.Fragment,null,S?a.createElement(c,{styles:nr(o)}):null,y?a.createElement(Kn,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function ar(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const cr=Fn(st,or);var sr=a.forwardRef(function(e,t){return a.createElement(ee,A({},e,{ref:t,sideCar:cr}))});sr.classNames=ee.classNames;export{Lr as $,lr as A,dr as B,eo as C,oo as D,br as E,kr as F,ro as G,sr as H,Mr as I,X as J,vn as K,Qr as L,Rr as M,et as N,Le as O,Nr as P,Fr as Q,Xr as R,jr as S,qr as T,zr as U,Fe as V,Kr as W,yr as X,gr as Y,mr as Z,hr as _,Er as a,Ar as a0,vr as a1,$r as a2,Dr as a3,Pr as a4,Cr as a5,Hr as a6,no as a7,Ve as a8,to as a9,Nt as aa,Gr as ab,Vr as b,Sr as c,Or as d,wr as e,Yr as f,I as g,Jr as h,xr as i,M as j,_r as k,Wr as l,Br as m,Ir as n,pr as o,fr as p,Tr as q,Ur as r,ve as s,L as t,V as u,W as v,Ft as w,T as x,kn as y,Oe as z};
