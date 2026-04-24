import{r as n,j as e,H as $}from"./app-B3yCUP1L.js";import{N as T}from"./Navbar-CGQzg4Dg.js";import{F as U}from"./Footer-D-yAv4gR.js";const D="AIzaSyAP-pYLeiSe1kZulYR16WvNHlNswMtR5zc";function H({auth:N,places:w=[],categories:C=[],userLocation:z=null,radius:M=500}){const j=n.useRef(null),i=n.useRef(null),l=n.useRef([]),[m,P]=n.useState(!1),[u,S]=n.useState(null),[o,c]=n.useState(null),[O,y]=n.useState(null),[d,E]=n.useState(!1),[s,k]=n.useState(z),[p,L]=n.useState(null),[v,f]=n.useState(!1),R={lat:36.7873,lng:-6.9869},x=n.useCallback(()=>{let a=w;return p&&(a=a.filter(t=>Number(t.category_id)===Number(p))),d&&s&&(a=a.filter(t=>t.within_radius)),a},[w,p,d,s]),F=()=>new Promise((a,t)=>{if(window.google&&window.google.maps){a();return}const r=document.createElement("script");r.src=`https://maps.googleapis.com/maps/api/js?key=${D}&libraries=places`,r.async=!0,r.defer=!0,r.onload=a,r.onerror=t,document.head.appendChild(r)}),b=n.useCallback(async()=>{try{await F();const a=s?{lat:s.lat,lng:s.lng}:R,t=new window.google.maps.Map(j.current,{center:a,zoom:14,mapId:"DEMO_MAP_ID",disableDefaultUI:!1,zoomControl:!0,mapTypeControl:!1,streetViewControl:!1,fullscreenControl:!0});i.current=t,P(!0),window.google.maps.event.addListener(t,"click",()=>{c(null),y(null)})}catch(a){console.error("Error loading Google Maps:",a),S("Error al cargar el mapa. Por favor, intenta de nuevo.")}},[s]);n.useEffect(()=>{b()},[b]);const I=()=>{l.current.forEach(a=>a.setMap(null)),l.current=[]};n.useEffect(()=>{if(!m||!i.current)return;I();const a=x(),t=new window.google.maps.LatLngBounds;if(a.forEach(r=>{if(!r.latitude||!r.longitude)return;const g=new window.google.maps.Marker({position:{lat:parseFloat(r.latitude),lng:parseFloat(r.longitude)},map:i.current,title:r.name,zIndex:1e3,icon:{path:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",fillColor:"#D97706",fillOpacity:1,strokeColor:"#ffffff",strokeWeight:3,scale:1.8,anchor:new window.google.maps.Point(12,22)}});g.addListener("click",()=>{c(r),y({position:g.getPosition(),place:r})}),l.current.push(g),t.extend(g.getPosition())}),s){const r=new window.google.maps.Marker({position:{lat:s.lat,lng:s.lng},map:i.current,title:"Tu ubicación",zIndex:999,icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:12,fillColor:"#3B82F6",fillOpacity:1,strokeColor:"#ffffff",strokeWeight:3}});l.current.push(r),t.extend(r.getPosition())}l.current.length>0&&i.current.fitBounds(t,50)},[m,x,s]);const _=()=>{if(!navigator.geolocation){alert("Tu navegador no soporta la geolocalización");return}f(!0),navigator.geolocation.getCurrentPosition(a=>{const t={lat:a.coords.latitude,lng:a.coords.longitude};k(t),f(!1),window.history.pushState({},"",`/mapa?lat=${t.lat}&lng=${t.lng}`)},a=>{console.error("Error getting location:",a),alert("No se pudo obtener tu ubicación. Verifica los permisos."),f(!1)},{enableHighAccuracy:!0,timeout:1e4})},A=()=>{k(null),window.history.pushState({},"","/mapa")},h=x();return e.jsxs(e.Fragment,{children:[e.jsx($,{title:"Mapa - DescubreSanlúcar"}),e.jsxs("div",{className:"page-root",children:[e.jsx(T,{auth:N}),e.jsx("main",{className:"map-page",children:e.jsxs("div",{className:"map-container",children:[e.jsxs("div",{className:"map-sidebar",children:[e.jsxs("div",{className:"map-sidebar-header",children:[e.jsx("h1",{children:"Mapa de Sanlúcar"}),e.jsxs("p",{children:[h.length," lugares"]})]}),e.jsxs("div",{className:"map-filters",children:[e.jsx("button",{className:`filter-btn ${d?"active":""}`,onClick:()=>E(!d),disabled:!s,title:s?"Mostrar solo lugares a menos de 500m":"Activa tu ubicación primero",children:"📍 Más cercanos (500m)"}),s?e.jsx("button",{className:"filter-btn secondary",onClick:A,children:"✕ Quitar mi ubicación"}):e.jsx("button",{className:"filter-btn primary",onClick:_,disabled:v,children:v?"📡 Localizando...":"📍 Mi ubicación"}),e.jsxs("select",{className:"filter-select",value:p||"",onChange:a=>L(a.target.value?Number(a.target.value):null),children:[e.jsx("option",{value:"",children:"Todas las categorías"}),C.map(a=>e.jsxs("option",{value:a.id,children:[a.icon," ",a.label]},a.id))]})]}),d&&s&&e.jsx("div",{className:"nearest-notice",children:e.jsxs("span",{children:["📍 Mostrando lugares a menos de ",M,"m de ti"]})}),e.jsx("div",{className:"map-results",children:h.length>0?h.map(a=>e.jsxs("div",{className:`map-result-item ${o?.id===a.id?"selected":""}`,onClick:()=>{c(a),a.latitude&&a.longitude&&i.current&&(i.current.panTo({lat:parseFloat(a.latitude),lng:parseFloat(a.longitude)}),i.current.setZoom(16))},children:[e.jsx("h3",{children:a.name}),e.jsxs("p",{className:"place-category",children:[a.category?.icon," ",a.category?.label]}),e.jsx("p",{className:"place-address",children:a.address}),a.distance&&e.jsxs("span",{className:"place-distance",children:[a.distance,"m"]})]},a.id)):e.jsx("div",{className:"no-results",children:e.jsx("p",{children:"No hay lugares para mostrar"})})})]}),e.jsxs("div",{className:"map-wrapper",children:[u&&e.jsxs("div",{className:"map-error",children:[e.jsx("p",{children:u}),e.jsx("button",{onClick:b,children:"Reintentar"})]}),e.jsx("div",{ref:j,className:"google-map"}),!m&&!u&&e.jsxs("div",{className:"map-loading",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"Cargando mapa..."})]}),o&&e.jsx("div",{className:"place-card-overlay",onClick:()=>c(null),children:e.jsxs("div",{className:"place-card",onClick:a=>a.stopPropagation(),children:[e.jsx("button",{className:"place-card-close",onClick:()=>c(null),children:"✕"}),o.image?e.jsx("img",{src:o.image,alt:o.name,className:"place-card-image"}):e.jsx("div",{className:"place-card-image place-card-image-placeholder",children:e.jsx("span",{children:o.category?.icon||"📍"})}),e.jsxs("div",{className:"place-card-content",children:[e.jsx("h3",{className:"place-card-title",children:o.name}),e.jsxs("p",{className:"place-card-category",children:[o.category?.icon," ",o.category?.label]}),e.jsx("p",{className:"place-card-address",children:o.address}),o.distance&&e.jsxs("p",{className:"place-card-distance",children:["📍 A ",o.distance,"m"]}),e.jsxs("div",{className:"place-card-actions",children:[e.jsx("a",{href:`/lugares/${o.id}`,className:"place-card-btn place-card-btn-primary",children:"Ver página"}),e.jsx("a",{href:`https://www.google.com/maps/dir/?api=1&destination=${o.latitude},${o.longitude}`,target:"_blank",rel:"noopener noreferrer",className:"place-card-btn place-card-btn-secondary",children:"Cómo llegar"})]})]})]})})]})]})}),e.jsx(U,{sections:[]})]}),e.jsx("style",{children:`
                .map-page {
                    height: calc(100vh - 64px);
                    display: flex;
                }

                .map-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }

                .map-sidebar {
                    width: 350px;
                    min-width: 350px;
                    background: #fff;
                    border-right: 1px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .map-sidebar-header {
                    padding: 16px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .map-sidebar-header h1 {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0 0 4px;
                    color: #1f2937;
                }

                .map-sidebar-header p {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0;
                }

                .map-filters {
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .filter-btn {
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                    color: #374151;
                }

                .filter-btn:hover:not(:disabled) {
                    background: #f3f4f6;
                }

                .filter-btn.active {
                    background: #fef3c7;
                    border-color: #d97706;
                    color: #92400e;
                }

                .filter-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .filter-btn.primary {
                    background: #3b82f6;
                    color: white;
                    border: none;
                }

                .filter-btn.primary:hover:not(:disabled) {
                    background: #2563eb;
                }

                .filter-btn.secondary {
                    background: #f3f4f6;
                    border: none;
                }

                .filter-select {
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 14px;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                    color: #374151;
                    cursor: pointer;
                }

                .nearest-notice {
                    padding: 8px 12px;
                    background: #dbeafe;
                    font-size: 13px;
                    color: #1e40af;
                    text-align: center;
                }

                .map-results {
                    flex: 1;
                    overflow-y: auto;
                    padding: 8px;
                }

                .map-result-item {
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border: 1px solid transparent;
                    margin-bottom: 8px;
                }

                .map-result-item:hover {
                    background: #f9fafb;
                }

                .map-result-item.selected {
                    background: #fef3c7;
                    border-color: #d97706;
                }

                .map-result-item h3 {
                    font-size: 15px;
                    font-weight: 500;
                    margin: 0 0 4px;
                    color: #1f2937;
                }

                .place-category {
                    font-size: 13px;
                    color: #6b7280;
                    margin: 0 0 4px;
                }

                .place-address {
                    font-size: 12px;
                    color: #9ca3af;
                    margin: 0;
                }

                .place-distance {
                    display: inline-block;
                    margin-top: 6px;
                    padding: 2px 8px;
                    background: #dbeafe;
                    color: #1e40af;
                    border-radius: 12px;
                    font-size: 12px;
                }

                .map-wrapper {
                    flex: 1;
                    position: relative;
                }

                .google-map {
                    width: 100%;
                    height: 100%;
                }

                .map-error {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    padding: 20px;
                    background: #fee;
                    border-radius: 8px;
                }

                .map-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 12px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .no-results {
                    text-align: center;
                    padding: 40px 20px;
                    color: #6b7280;
                }

                @media (max-width: 768px) {
                    .map-container {
                        flex-direction: column-reverse;
                    }
                    .map-sidebar {
                        width: 100%;
                        min-width: unset;
                        height: 40%;
                    }
                    .map-wrapper {
                        height: 60%;
                    }
                }

                .place-card-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .place-card {
                    background: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 400px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    position: relative;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .place-card-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: none;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: #374151;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                }

                .place-card-close:hover {
                    background: #f3f4f6;
                }

                .place-card-image {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }

                .place-card-image-placeholder {
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                }

                .place-card-content {
                    padding: 16px;
                }

                .place-card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 4px;
                }

                .place-card-category {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0 0 4px;
                }

                .place-card-address {
                    font-size: 13px;
                    color: #9ca3af;
                    margin: 0 0 8px;
                }

                .place-card-distance {
                    font-size: 13px;
                    color: #3b82f6;
                    margin: 0 0 12px;
                    font-weight: 500;
                }

                .place-card-actions {
                    display: flex;
                    gap: 10px;
                }

                .place-card-btn {
                    flex: 1;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: center;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .place-card-btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .place-card-btn-primary:hover {
                    background: #2563eb;
                }

                .place-card-btn-secondary {
                    background: white;
                    color: #374151;
                    border: 1px solid #e5e7eb;
                }

                .place-card-btn-secondary:hover {
                    background: #f3f4f6;
                }
            `})]})}export{H as default};
