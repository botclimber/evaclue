(()=>{"use strict";var e=function e(t,s){if(t===s)return!0;if(t&&s&&"object"==typeof t&&"object"==typeof s){if(t.constructor!==s.constructor)return!1;var i,r,n;if(Array.isArray(t)){if((i=t.length)!=s.length)return!1;for(r=i;0!=r--;)if(!e(t[r],s[r]))return!1;return!0}if(t.constructor===RegExp)return t.source===s.source&&t.flags===s.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===s.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===s.toString();if((i=(n=Object.keys(t)).length)!==Object.keys(s).length)return!1;for(r=i;0!=r--;)if(!Object.prototype.hasOwnProperty.call(s,n[r]))return!1;for(r=i;0!=r--;){var o=n[r];if(!e(t[o],s[o]))return!1}return!0}return t!=t&&s!=s};const s="__googleMapsScriptId";class i{constructor({apiKey:t,channel:r,client:n,id:o=s,libraries:a=[],language:l,region:h,version:c,mapIds:d,nonce:g,retries:u=3,url:m="https://maps.googleapis.com/maps/api/js"}){if(this.CALLBACK="__googleMapsCallback",this.callbacks=[],this.done=!1,this.loading=!1,this.errors=[],this.version=c,this.apiKey=t,this.channel=r,this.client=n,this.id=o||s,this.libraries=a,this.language=l,this.region=h,this.mapIds=d,this.nonce=g,this.retries=u,this.url=m,i.instance){if(!e(this.options,i.instance.options))throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(i.instance.options)}`);return i.instance}i.instance=this}get options(){return{version:this.version,apiKey:this.apiKey,channel:this.channel,client:this.client,id:this.id,libraries:this.libraries,language:this.language,region:this.region,mapIds:this.mapIds,nonce:this.nonce,url:this.url}}get failed(){return this.done&&!this.loading&&this.errors.length>=this.retries+1}createUrl(){let e=this.url;return e+=`?callback=${this.CALLBACK}`,this.apiKey&&(e+=`&key=${this.apiKey}`),this.channel&&(e+=`&channel=${this.channel}`),this.client&&(e+=`&client=${this.client}`),this.libraries.length>0&&(e+=`&libraries=${this.libraries.join(",")}`),this.language&&(e+=`&language=${this.language}`),this.region&&(e+=`&region=${this.region}`),this.version&&(e+=`&v=${this.version}`),this.mapIds&&(e+=`&map_ids=${this.mapIds.join(",")}`),e}load(){return this.loadPromise()}loadPromise(){return new Promise(((e,t)=>{this.loadCallback((s=>{s?t(s):e(window.google)}))}))}loadCallback(e){this.callbacks.push(e),this.execute()}setScript(){if(document.getElementById(this.id))return void this.callback();const e=this.createUrl(),t=document.createElement("script");t.id=this.id,t.type="text/javascript",t.src=e,t.onerror=this.loadErrorCallback.bind(this),t.defer=!0,t.async=!0,this.nonce&&(t.nonce=this.nonce),document.head.appendChild(t)}deleteScript(){const e=document.getElementById(this.id);e&&e.remove()}reset(){this.deleteScript(),this.done=!1,this.loading=!1,this.errors=[],this.onerrorEvent=null}resetIfRetryingFailed(){this.failed&&this.reset()}loadErrorCallback(e){if(this.errors.push(e),this.errors.length<=this.retries){const e=this.errors.length*Math.pow(2,this.errors.length);console.log(`Failed to load Google Maps script, retrying in ${e} ms.`),setTimeout((()=>{this.deleteScript(),this.setScript()}),e)}else this.onerrorEvent=e,this.callback()}setCallback(){window.__googleMapsCallback=this.callback.bind(this)}callback(){this.done=!0,this.loading=!1,this.callbacks.forEach((e=>{e(this.onerrorEvent)})),this.callbacks=[]}execute(){if(this.resetIfRetryingFailed(),this.done)this.callback();else{if(window.google&&window.google.maps&&window.google.maps.version)return console.warn("Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match."),void this.callback();this.loading||(this.loading=!0,this.setCallback(),this.setScript())}}}class r{constructor(){!function(e,t){for(const s in t.prototype)e.prototype[s]=t.prototype[s]}(r,google.maps.OverlayView)}}function n(e){return Object.keys(e).reduce(((t,s)=>(e[s]&&t.push(s+":"+e[s]),t)),[]).join(";")}function o(e){return e?e+"px":void 0}class a extends r{constructor(e,t){super(),this.cluster_=e,this.styles_=t,this.center_=null,this.div_=null,this.sums_=null,this.visible_=!1,this.style=null,this.setMap(e.getMap())}onAdd(){let e,t;const s=this.cluster_.getMarkerClusterer(),[i,r]=google.maps.version.split("."),n=100*parseInt(i,10)+parseInt(r,10);this.div_=document.createElement("div"),this.visible_&&this.show(),this.getPanes().overlayMouseTarget.appendChild(this.div_),this.boundsChangedListener_=google.maps.event.addListener(this.getMap(),"bounds_changed",(function(){t=e})),google.maps.event.addDomListener(this.div_,"mousedown",(()=>{e=!0,t=!1})),n>=332&&google.maps.event.addDomListener(this.div_,"touchstart",(e=>{e.stopPropagation()})),google.maps.event.addDomListener(this.div_,"click",(i=>{if(e=!1,!t){if(google.maps.event.trigger(s,"click",this.cluster_),google.maps.event.trigger(s,"clusterclick",this.cluster_),s.getZoomOnClick()){const e=s.getMaxZoom(),t=this.cluster_.getBounds();s.getMap().fitBounds(t),setTimeout((function(){s.getMap().fitBounds(t),null!==e&&s.getMap().getZoom()>e&&s.getMap().setZoom(e+1)}),100)}i.cancelBubble=!0,i.stopPropagation&&i.stopPropagation()}})),google.maps.event.addDomListener(this.div_,"mouseover",(()=>{google.maps.event.trigger(s,"mouseover",this.cluster_)})),google.maps.event.addDomListener(this.div_,"mouseout",(()=>{google.maps.event.trigger(s,"mouseout",this.cluster_)}))}onRemove(){this.div_&&this.div_.parentNode&&(this.hide(),google.maps.event.removeListener(this.boundsChangedListener_),google.maps.event.clearInstanceListeners(this.div_),this.div_.parentNode.removeChild(this.div_),this.div_=null)}draw(){if(this.visible_){const e=this.getPosFromLatLng_(this.center_);this.div_.style.top=e.y+"px",this.div_.style.left=e.x+"px"}}hide(){this.div_&&(this.div_.style.display="none"),this.visible_=!1}show(){this.div_&&(this.div_.className=this.className_,this.div_.style.cssText=this.createCss_(this.getPosFromLatLng_(this.center_)),this.div_.innerHTML=(this.style.url?this.getImageElementHtml():"")+this.getLabelDivHtml(),void 0===this.sums_.title||""===this.sums_.title?this.div_.title=this.cluster_.getMarkerClusterer().getTitle():this.div_.title=this.sums_.title,this.div_.style.display=""),this.visible_=!0}getLabelDivHtml(){return`\n<div aria-label="${this.cluster_.getMarkerClusterer().ariaLabelFn(this.sums_.text)}" style="${n({position:"absolute",top:o(this.anchorText_[0]),left:o(this.anchorText_[1]),color:this.style.textColor,"font-size":o(this.style.textSize),"font-family":this.style.fontFamily,"font-weight":this.style.fontWeight,"font-style":this.style.fontStyle,"text-decoration":this.style.textDecoration,"text-align":"center",width:o(this.style.width),"line-height":o(this.style.textLineHeight)})}" tabindex="0">\n  <span aria-hidden="true">${this.sums_.text}</span>\n</div>\n`}getImageElementHtml(){const e=(this.style.backgroundPosition||"0 0").split(" "),t=parseInt(e[0].replace(/^\s+|\s+$/g,""),10),s=parseInt(e[1].replace(/^\s+|\s+$/g,""),10);let i={};if(this.cluster_.getMarkerClusterer().getEnableRetinaIcons())i={width:o(this.style.width),height:o(this.style.height)};else{const[e,r,n,o]=[-1*s,-1*t+this.style.width,-1*s+this.style.height,-1*t];i={clip:`rect(${e}px, ${r}px, ${n}px, ${o}px)`}}const r=n(Object.assign({position:"absolute",top:o(s),left:o(t)},i));return`<img alt="${this.sums_.text}" aria-hidden="true" src="${this.style.url}" style="${r}"/>`}useStyle(e){this.sums_=e;let t=Math.max(0,e.index-1);t=Math.min(this.styles_.length-1,t),this.style=this.styles_[t],this.anchorText_=this.style.anchorText||[0,0],this.anchorIcon_=this.style.anchorIcon||[Math.floor(this.style.height/2),Math.floor(this.style.width/2)],this.className_=this.cluster_.getMarkerClusterer().getClusterClass()+" "+(this.style.className||"cluster-"+t)}setCenter(e){this.center_=e}createCss_(e){return n({"z-index":`${this.cluster_.getMarkerClusterer().getZIndex()}`,top:o(e.y),left:o(e.x),width:o(this.style.width),height:o(this.style.height),cursor:"pointer",position:"absolute","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-o-user-select":"none","user-select":"none"})}getPosFromLatLng_(e){const t=this.getProjection().fromLatLngToDivPixel(e);return t.x=Math.floor(t.x-this.anchorIcon_[1]),t.y=Math.floor(t.y-this.anchorIcon_[0]),t}}class l{constructor(e){this.markerClusterer_=e,this.map_=this.markerClusterer_.getMap(),this.minClusterSize_=this.markerClusterer_.getMinimumClusterSize(),this.averageCenter_=this.markerClusterer_.getAverageCenter(),this.markers_=[],this.center_=null,this.bounds_=null,this.clusterIcon_=new a(this,this.markerClusterer_.getStyles())}getSize(){return this.markers_.length}getMarkers(){return this.markers_}getCenter(){return this.center_}getMap(){return this.map_}getMarkerClusterer(){return this.markerClusterer_}getBounds(){const e=new google.maps.LatLngBounds(this.center_,this.center_),t=this.getMarkers();for(let s=0;s<t.length;s++)e.extend(t[s].getPosition());return e}remove(){this.clusterIcon_.setMap(null),this.markers_=[],delete this.markers_}addMarker(e){if(this.isMarkerAlreadyAdded_(e))return!1;if(this.center_){if(this.averageCenter_){const t=this.markers_.length+1,s=(this.center_.lat()*(t-1)+e.getPosition().lat())/t,i=(this.center_.lng()*(t-1)+e.getPosition().lng())/t;this.center_=new google.maps.LatLng(s,i),this.calculateBounds_()}}else this.center_=e.getPosition(),this.calculateBounds_();e.isAdded=!0,this.markers_.push(e);const t=this.markers_.length,s=this.markerClusterer_.getMaxZoom();if(null!==s&&this.map_.getZoom()>s)e.getMap()!==this.map_&&e.setMap(this.map_);else if(t<this.minClusterSize_)e.getMap()!==this.map_&&e.setMap(this.map_);else if(t===this.minClusterSize_)for(let e=0;e<t;e++)this.markers_[e].setMap(null);else e.setMap(null);return!0}isMarkerInClusterBounds(e){return this.bounds_.contains(e.getPosition())}calculateBounds_(){const e=new google.maps.LatLngBounds(this.center_,this.center_);this.bounds_=this.markerClusterer_.getExtendedBounds(e)}updateIcon(){const e=this.markers_.length,t=this.markerClusterer_.getMaxZoom();if(null!==t&&this.map_.getZoom()>t)return void this.clusterIcon_.hide();if(e<this.minClusterSize_)return void this.clusterIcon_.hide();const s=this.markerClusterer_.getStyles().length,i=this.markerClusterer_.getCalculator()(this.markers_,s);this.clusterIcon_.setCenter(this.center_),this.clusterIcon_.useStyle(i),this.clusterIcon_.show()}isMarkerAlreadyAdded_(e){if(this.markers_.indexOf)return-1!==this.markers_.indexOf(e);for(let t=0;t<this.markers_.length;t++)if(e===this.markers_[t])return!0;return!1}}const h=(e,t,s)=>void 0!==e[t]?e[t]:s;class c extends r{constructor(e,t=[],s={}){super(),this.options=s,this.markers_=[],this.clusters_=[],this.listeners_=[],this.activeMap_=null,this.ready_=!1,this.ariaLabelFn=this.options.ariaLabelFn||(()=>""),this.zIndex_=this.options.zIndex||google.maps.Marker.MAX_ZINDEX+1,this.gridSize_=this.options.gridSize||60,this.minClusterSize_=this.options.minimumClusterSize||2,this.maxZoom_=this.options.maxZoom||null,this.styles_=this.options.styles||[],this.title_=this.options.title||"",this.zoomOnClick_=h(this.options,"zoomOnClick",!0),this.averageCenter_=h(this.options,"averageCenter",!1),this.ignoreHidden_=h(this.options,"ignoreHidden",!1),this.enableRetinaIcons_=h(this.options,"enableRetinaIcons",!1),this.imagePath_=this.options.imagePath||c.IMAGE_PATH,this.imageExtension_=this.options.imageExtension||c.IMAGE_EXTENSION,this.imageSizes_=this.options.imageSizes||c.IMAGE_SIZES,this.calculator_=this.options.calculator||c.CALCULATOR,this.batchSize_=this.options.batchSize||c.BATCH_SIZE,this.batchSizeIE_=this.options.batchSizeIE||c.BATCH_SIZE_IE,this.clusterClass_=this.options.clusterClass||"cluster",-1!==navigator.userAgent.toLowerCase().indexOf("msie")&&(this.batchSize_=this.batchSizeIE_),this.setupStyles_(),this.addMarkers(t,!0),this.setMap(e)}onAdd(){this.activeMap_=this.getMap(),this.ready_=!0,this.repaint(),this.prevZoom_=this.getMap().getZoom(),this.listeners_=[google.maps.event.addListener(this.getMap(),"zoom_changed",(()=>{const e=this.getMap(),t=e.minZoom||0,s=Math.min(e.maxZoom||100,e.mapTypes[e.getMapTypeId()].maxZoom),i=Math.min(Math.max(this.getMap().getZoom(),t),s);this.prevZoom_!=i&&(this.prevZoom_=i,this.resetViewport_(!1))})),google.maps.event.addListener(this.getMap(),"idle",(()=>{this.redraw_()}))]}onRemove(){for(let e=0;e<this.markers_.length;e++)this.markers_[e].getMap()!==this.activeMap_&&this.markers_[e].setMap(this.activeMap_);for(let e=0;e<this.clusters_.length;e++)this.clusters_[e].remove();this.clusters_=[];for(let e=0;e<this.listeners_.length;e++)google.maps.event.removeListener(this.listeners_[e]);this.listeners_=[],this.activeMap_=null,this.ready_=!1}draw(){}setupStyles_(){if(!(this.styles_.length>0))for(let e=0;e<this.imageSizes_.length;e++){const t=this.imageSizes_[e];this.styles_.push(c.withDefaultStyle({url:this.imagePath_+(e+1)+"."+this.imageExtension_,height:t,width:t}))}}fitMapToMarkers(){const e=this.getMarkers(),t=new google.maps.LatLngBounds;for(let s=0;s<e.length;s++)!e[s].getVisible()&&this.getIgnoreHidden()||t.extend(e[s].getPosition());this.getMap().fitBounds(t)}getGridSize(){return this.gridSize_}setGridSize(e){this.gridSize_=e}getMinimumClusterSize(){return this.minClusterSize_}setMinimumClusterSize(e){this.minClusterSize_=e}getMaxZoom(){return this.maxZoom_}setMaxZoom(e){this.maxZoom_=e}getZIndex(){return this.zIndex_}setZIndex(e){this.zIndex_=e}getStyles(){return this.styles_}setStyles(e){this.styles_=e}getTitle(){return this.title_}setTitle(e){this.title_=e}getZoomOnClick(){return this.zoomOnClick_}setZoomOnClick(e){this.zoomOnClick_=e}getAverageCenter(){return this.averageCenter_}setAverageCenter(e){this.averageCenter_=e}getIgnoreHidden(){return this.ignoreHidden_}setIgnoreHidden(e){this.ignoreHidden_=e}getEnableRetinaIcons(){return this.enableRetinaIcons_}setEnableRetinaIcons(e){this.enableRetinaIcons_=e}getImageExtension(){return this.imageExtension_}setImageExtension(e){this.imageExtension_=e}getImagePath(){return this.imagePath_}setImagePath(e){this.imagePath_=e}getImageSizes(){return this.imageSizes_}setImageSizes(e){this.imageSizes_=e}getCalculator(){return this.calculator_}setCalculator(e){this.calculator_=e}getBatchSizeIE(){return this.batchSizeIE_}setBatchSizeIE(e){this.batchSizeIE_=e}getClusterClass(){return this.clusterClass_}setClusterClass(e){this.clusterClass_=e}getMarkers(){return this.markers_}getTotalMarkers(){return this.markers_.length}getClusters(){return this.clusters_}getTotalClusters(){return this.clusters_.length}addMarker(e,t){this.pushMarkerTo_(e),t||this.redraw_()}addMarkers(e,t){for(const t in e)Object.prototype.hasOwnProperty.call(e,t)&&this.pushMarkerTo_(e[t]);t||this.redraw_()}pushMarkerTo_(e){e.getDraggable()&&google.maps.event.addListener(e,"dragend",(()=>{this.ready_&&(e.isAdded=!1,this.repaint())})),e.isAdded=!1,this.markers_.push(e)}removeMarker(e,t){const s=this.removeMarker_(e);return!t&&s&&this.repaint(),s}removeMarkers(e,t){let s=!1;for(let t=0;t<e.length;t++){const i=this.removeMarker_(e[t]);s=s||i}return!t&&s&&this.repaint(),s}removeMarker_(e){let t=-1;if(this.markers_.indexOf)t=this.markers_.indexOf(e);else for(let s=0;s<this.markers_.length;s++)if(e===this.markers_[s]){t=s;break}return-1!==t&&(e.setMap(null),this.markers_.splice(t,1),!0)}clearMarkers(){this.resetViewport_(!0),this.markers_=[]}repaint(){const e=this.clusters_.slice();this.clusters_=[],this.resetViewport_(!1),this.redraw_(),setTimeout((function(){for(let t=0;t<e.length;t++)e[t].remove()}),0)}getExtendedBounds(e){const t=this.getProjection(),s=new google.maps.LatLng(e.getNorthEast().lat(),e.getNorthEast().lng()),i=new google.maps.LatLng(e.getSouthWest().lat(),e.getSouthWest().lng()),r=t.fromLatLngToDivPixel(s);r.x+=this.gridSize_,r.y-=this.gridSize_;const n=t.fromLatLngToDivPixel(i);n.x-=this.gridSize_,n.y+=this.gridSize_;const o=t.fromDivPixelToLatLng(r),a=t.fromDivPixelToLatLng(n);return e.extend(o),e.extend(a),e}redraw_(){this.createClusters_(0)}resetViewport_(e){for(let e=0;e<this.clusters_.length;e++)this.clusters_[e].remove();this.clusters_=[];for(let t=0;t<this.markers_.length;t++){const s=this.markers_[t];s.isAdded=!1,e&&s.setMap(null)}}distanceBetweenPoints_(e,t){const s=(t.lat()-e.lat())*Math.PI/180,i=(t.lng()-e.lng())*Math.PI/180,r=Math.sin(s/2)*Math.sin(s/2)+Math.cos(e.lat()*Math.PI/180)*Math.cos(t.lat()*Math.PI/180)*Math.sin(i/2)*Math.sin(i/2);return 2*Math.atan2(Math.sqrt(r),Math.sqrt(1-r))*6371}isMarkerInBounds_(e,t){return t.contains(e.getPosition())}addToClosestCluster_(e){let t=4e4,s=null;for(let i=0;i<this.clusters_.length;i++){const r=this.clusters_[i],n=r.getCenter();if(n){const i=this.distanceBetweenPoints_(n,e.getPosition());i<t&&(t=i,s=r)}}if(s&&s.isMarkerInClusterBounds(e))s.addMarker(e);else{const t=new l(this);t.addMarker(e),this.clusters_.push(t)}}createClusters_(e){if(!this.ready_)return;let t;0===e&&(google.maps.event.trigger(this,"clusteringbegin",this),void 0!==this.timerRefStatic&&(clearTimeout(this.timerRefStatic),delete this.timerRefStatic)),t=this.getMap().getZoom()>3?new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),this.getMap().getBounds().getNorthEast()):new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472,-178.48388434375),new google.maps.LatLng(-85.08136444384544,178.00048865625));const s=this.getExtendedBounds(t),i=Math.min(e+this.batchSize_,this.markers_.length);for(let t=e;t<i;t++){const e=this.markers_[t];!e.isAdded&&this.isMarkerInBounds_(e,s)&&(!this.ignoreHidden_||this.ignoreHidden_&&e.getVisible())&&this.addToClosestCluster_(e)}if(i<this.markers_.length)this.timerRefStatic=window.setTimeout((()=>{this.createClusters_(i)}),0);else{delete this.timerRefStatic,google.maps.event.trigger(this,"clusteringend",this);for(let e=0;e<this.clusters_.length;e++)this.clusters_[e].updateIcon()}}static CALCULATOR(e,t){let s=0;const i=e.length;let r=i;for(;0!==r;)r=Math.floor(r/10),s++;return s=Math.min(s,t),{text:i.toString(),index:s,title:""}}static withDefaultStyle(e){return Object.assign({textColor:"black",textSize:11,textDecoration:"none",textLineHeight:e.height,fontWeight:"bold",fontStyle:"normal",fontFamily:"Arial,sans-serif",backgroundPosition:"0 0"},e)}}if(c.BATCH_SIZE=2e3,c.BATCH_SIZE_IE=500,c.IMAGE_PATH="../images/m",c.IMAGE_EXTENSION="png",c.IMAGE_SIZES=[53,56,66,78,90],!tTime){var d=new Date,g=d.getUTCDay+"/"+d.getUTCMonth+"/"+d.getUTCFullYear;new Date(g).getTime()>new Date(tTime).getTime()&&localStorage.removeItem("t")}var u,m={},_={lat:41.1579438,lng:-8.629105299999999},p=[],v=document.getElementById("iCity"),y=document.getElementById("iStreet"),f=document.getElementById("iBNumber"),k=document.getElementById("nrCity"),M=document.getElementById("nrStreet"),b=document.getElementById("nrBNumber"),C=document.getElementById("nrLat"),I=document.getElementById("nrLng"),S=document.getElementById("nrFloor"),L=document.getElementById("nrSide"),w=0,E=document.getElementById("nrAnon"),x=document.getElementById("nrReview"),B=document.getElementById("newReview"),T=document.getElementById("flag"),z=document.getElementById("st1"),P=document.getElementById("st2"),A=document.getElementById("st3"),O=document.getElementById("st4"),Z=document.getElementById("st5");function R(e){var s=e.locations;u=H(e.address),p=j(u,s,p[0]),function(e,t,s){var i=new google.maps.InfoWindow;t.map(((t,r)=>{t.addListener("click",(n=>{const o=n.latLng.lat(),a=n.latLng.lng();i.setContent("<div style = 'max-height:450px;min-height:40px;'><div class='row mb-3'><div class='col-md-6'><button type=\"button\" class=\"btn mb-3 float-left\" style=\"background-color:#B7410E;color:white;padding:10px 12px;font-size:10px;\" onclick=\"(function(){ if(!localStorage.getItem('t')){ window.location.href = '"+authPage+"/user/login'; } else { console.log('Place registed! Complete Form and add review [marker click] ("+o+", "+a+")'); resLat.value="+o+"; resLng.value="+a+"; nrLat.value = "+o+"; nrLng.value = "+a+"; resCity.value='-'; resCity.disabled=true; resStreet.value='-'; resStreet.disabled=true; resBNumber.value='-'; resBNumber.disabled=true; nrCity.value='-'; nrCity.disabled = true; nrStreet.value='-'; nrStreet.disabled = true; nrBNumber.value='-'; flag.value ='fromMarker'; resFlag.value='fromMarker'; nrBNumber.disabled= true; $('#myForm').modal('show');} })();\">Add Review</button></div> <div class='col-md-6'> <input style='height:35px;font-size:10pt' type='text' class='form-control float-right' onkeyup='filterRevs("+n.latLng.lat()+","+n.latLng.lng()+")' id='filterRevsInput"+(n.latLng.lat()+n.latLng.lng())+"' placeholder='floor - direction' /> </div>  </div><div class='row'><div class='col-md-12'>"+s[r]+"</div></div></div>"),i.open(e,t)}))}))}(u,p[0],p[1]),u.addListener("click",(t=>{(new google.maps.Geocoder).geocode({location:t.latLng},((t,s)=>{if("OK"===s){if(t&&t.length){var i=t.filter((e=>e.types.includes("locality"))),r=i.length?i[0]:t[0];r.address_components&&r.address_components.forEach((t=>{if(t.types.includes("locality")){const s=document.getElementById("resPerCity");document.getElementById("currentCity").innerHTML=t.long_name+": Available residences",fetch(reviewsService+"/resOwner/getByCity?city="+t.long_name).then((e=>e.json())).then((t=>{if(console.log(t),t.msg)s.innerHTML=t.msg;else{s.innerHTML="";const i=[];t.map((t=>{const r=""!==t.floor&&""!==t.flat?"<br > "+t.floor+" - "+t.flat:"",n=parseFloat(t.lat)+parseFloat(t.lng);s.innerHTML+="<tr><td>"+t.userName+"</td><td id = 'goto"+n+"'> "+t.city+", "+t.street+", "+t.nr+" "+r+" </td><td><i class='fa fa-eye'></i></td></tr>",i.push({id:n,data:e,lat:t.lat,lng:t.lng})}));for(let t of i)document.getElementById("goto"+t.id).addEventListener("click",(()=>{e.address.lat=t.lat,e.address.lng=t.lng,R(t.data)}))}})).catch((e=>console.log(e)))}}))}}else console.log("didnt worked")}))})),u.addListener("dblclick",(e=>{if(t){var s=e.latLng.toJSON();T.value="fromMapClick",resFlag.value="fromMapClick",i=s.lat,r=s.lng,console.log("Place registed! complete Form and add review ("+i+", "+r+")"),C.value=i,I.value=r,resLat.value=i,resLng.value=r,resCity.disabled=!1,resStreet.disabled=!1,resBNumber.disabled=!1,k.disabled=!1,M.disabled=!1,b.disabled=!1,k.value="",M.value="",b.value="",resCity.value="",resStreet.value="",resBNumber.value="",$("#myForm").modal("show")}var i,r}))}function F(e,t="",s=""){fetch(reviewsService+"/search?city="+e+"&street="+t+"&nr="+s+"&onlyAppr=1").then((e=>e.json())).then((e=>{console.log(e),R(e)})).catch((e=>console.log(e)))}function N(e){for(let t in e.starsToCheck)e.starsToCheck[t].checkVisibility=!0,document.getElementById(t).style.color="#ffbd00";for(let t in e.starsToUncheck)e.starsToUncheck[t].checkVisibility=!1,document.getElementById(t).style.color="#ccc"}function H(e){const t={center:{lat:parseFloat(e.lat),lng:parseFloat(e.lng)},zoom:19},s=document.getElementById("map");return new google.maps.Map(s,t)}function j(e,t,s=[]){for(let e of s)e.setMap(null);const i=[],r=[];for(const s in t){if(""===t[s].reviews)continue;const n={map:e,position:t[s],icon:"./img/custom_pin.png"},o=new google.maps.Marker(n);i.push(o),r.push(t[s].reviews)}return[i,r]}document.getElementById("mcResidenceBtn"),document.getElementById("mnReviewBtn"),document.getElementById("mcResidence"),document.getElementById("mnReview"),new i({apiKey:"AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ"}).load().then((()=>{u=H(_),p=j(u,m)})),F(new URLSearchParams(window.location.search).get("city")||"Braga"),document.getElementById("sAddress").onclick=function(){F(v.value,y.value,f.value)},B.addEventListener("click",(e=>{""!==k.value&&""!==M.value&&""!==b.value&&""!==x.value?async function(e){console.log(e),await fetch(reviewsService+"/create",{method:"POST",body:JSON.stringify(e),headers:{authorization:"baer "+t,"Content-Type":"application/json"}}).then((e=>e.json())).then((e=>{console.log(e),$("#modalForm").trigger("reset"),$("#myForm").modal("hide"),R(e)})).catch((e=>console.log(e)))}({type:"createReview",lat:C.value,lng:I.value,city:k.value,street:M.value,buildingNumber:b.value,nrFloor:S.value,nrSide:L.value,nrRating:w,nrAnon:parseInt(E.value),nrReview:x.value,userName:fName+" "+lName,userImage:uImage,flag:T.value}):console.log("Fill required fields!")})),z.addEventListener("click",(e=>{w=1,N({starsToCheck:{st1l:z},starsToUncheck:{st2l:P,st3l:A,st4l:O,st5l:Z}})})),P.addEventListener("click",(e=>{w=2,N({starsToCheck:{st1l:z,st2l:P},starsToUncheck:{st3l:A,st4l:O,st5l:Z}})})),A.addEventListener("click",(e=>{w=3,N({starsToCheck:{st1l:z,st2l:P,st3l:A},starsToUncheck:{st4l:O,st5l:Z}})})),O.addEventListener("click",(e=>{w=4,N({starsToCheck:{st1l:z,st2l:P,st3l:A,st4l:O},starsToUncheck:{st5l:Z}})})),Z.addEventListener("click",(e=>{w=5,N({starsToCheck:{st1l:z,st2l:P,st3l:A,st4l:O,st5l:Z},starsToUncheck:{}})})),E.addEventListener("change",(e=>{switch(parseInt(E.value)){case 0:E.value=1;break;case 1:E.value=0}})),document.getElementById("closeModalBot").addEventListener("click",(e=>{k.disabled=!1,M.disabled=!1,b.disabled=!1,$("#modalForm").trigger("reset")})),document.getElementById("closeModalTop").addEventListener("click",(e=>{k.disabled=!1,M.disabled=!1,b.disabled=!1,$("#modalForm").trigger("reset"),$("#resModalForm").trigger("reset")})),document.getElementById("resCloseModalBot").addEventListener("click",(e=>{$("#resModalForm").trigger("reset")}))})();