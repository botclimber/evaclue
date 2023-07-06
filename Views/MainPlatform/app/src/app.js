/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';

  if(!tTime){
    // check if time has expired if yes remove actual token
    var actDate = new Date()
    var onlyDate = actDate.getUTCDay + "/" + actDate.getUTCMonth + "/" + actDate.getUTCFullYear

    if(new Date(onlyDate).getTime() > new Date(tTime).getTime()){
      localStorage.removeItem("t")
    }
  }

  const apiOptions = {
    apiKey: "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ"
  }
  
  var locations = {}
  var data = {
    address: {lat: 41.1579438, lng:-8.629105299999999}
  }
  
  var map
  var markers = []
  
  var iCity = document.getElementById("iCity")
  var iStreet = document.getElementById("iStreet")
  var iBNumber = document.getElementById("iBNumber")
  
  var nrCity = document.getElementById("nrCity")
  var nrStreet = document.getElementById("nrStreet")
  var nrBNumber = document.getElementById("nrBNumber")
  var nrLat = document.getElementById("nrLat")
  var nrLng = document.getElementById("nrLng")
  var nrFloor = document.getElementById("nrFloor")
  var nrSide = document.getElementById("nrSide")
  var nrRating = 0
  var nrAnon = document.getElementById("nrAnon")
  var nrReview = document.getElementById("nrReview")
  var newReview = document.getElementById("newReview")
  var flag = document.getElementById("flag")

  var st1 = document.getElementById("st1")
  var st2 = document.getElementById("st2")
  var st3 = document.getElementById("st3")
  var st4 = document.getElementById("st4")
  var st5 = document.getElementById("st5")

  var mcResidenceBtn = document.getElementById("mcResidenceBtn")
  var mnReviewbtn = document.getElementById("mnReviewBtn")
  var mcResidence = document.getElementById("mcResidence")
  var mnReview = document.getElementById("mnReview")
  
  const loader = new Loader(apiOptions)
  loader.load().then(() => {
    map = displayMap(data.address);
    markers = addMarkers(map, locations);
  });
  
  const urlParams = new URLSearchParams(window.location.search)
  const city = urlParams.get("city") || "Braga"
  
  function makeCallBack(data, lat, lng){

      
}

  function mountPage(data){
    var locations = data.locations
  
    //if(data.type == "address") map = displayMap(data.address);
    map = displayMap(data.address);
    markers = addMarkers(map, locations, markers[0]);
  
    //clustering marks is a bit buggy so lets remove it for now
    //clusterMarkers(map, markers[0]);
    addPanToMarker(map, markers[0], markers[1]);
  
    map.addListener("click", (event) =>{
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({
        location: event.latLng,
      }, (results, status) => {
        if(status === 'OK') {
          if(results && results.length) {
              var filtered_array = results.filter(result => result.types.includes("locality")); 
              var addressResult = filtered_array.length ? filtered_array[0]: results[0];

              if(addressResult.address_components) {
                  addressResult.address_components.forEach((component) => {
                      if(component.types.includes('locality')) {
                        const outputId = document.getElementById("resPerCity")
                        const currentCity = document.getElementById("currentCity")

                        currentCity.innerHTML = component.long_name+": Available residences"
                        
                        fetch(reviewsService+'/resOwner/getByCity?city='+component.long_name)
                        .then(res => res.json())
                        .then((dataFromServer) => {
                          console.log(dataFromServer)

                          if(dataFromServer.msg){
                            outputId.innerHTML = dataFromServer.msg
                          }else {
                            outputId.innerHTML = ""
                            const els = []

                            dataFromServer.map(row => {

                              const optional = (row.floor !== "" && row.flat !== "")? "<br > "+row.floor+" - "+row.flat : ""
                              const locId = parseFloat(row.lat) + parseFloat(row.lng)
                              
                              outputId.innerHTML += "<tr><td>"+row.userName+"</td><td id = 'goto"+locId+"'> "+row.city+", "+row.street+", "+row.nr+" "+optional+" </td><td><i class='fa fa-eye'></i></td></tr>"

                              els.push({id: locId, data:data, lat: row.lat, lng: row.lng})

                            })

                            for(let x of els){
                              document.getElementById('goto'+x.id).addEventListener('click', () => {
                                data.address.lat = x.lat
                                data.address.lng = x.lng
                                mountPage(x.data)
                              })
                            }

                          }
                        })
                        .catch(err => console.log(err))
                        
                      }
                  });
              }
          }
        }else console.log("didnt worked")
      })

      //var coords = event.latLng.toJSON()
      //console.log(coords)
    }); 


    // Configure the click listener.
    map.addListener("dblclick", (mapsMouseEvent) => {
  
      if(t){
      var coords = mapsMouseEvent.latLng.toJSON()
      flag.value = "fromMapClick"
      resFlag.value = "fromMapClick"

      revFromClick(coords.lat, coords.lng)
    }
  
    });

    
  }
  
  function search(city, street = "", nr = ""){
  
    fetch(reviewsService+'/search?city='+city+"&street="+street+"&nr="+nr+"&onlyAppr=1")
    .then(res => res.json())
    .then((data) => {console.log(data); mountPage(data)})
    .catch(err => console.log(err))
  
  }
  
  search(city)
  
  function revFromClick(lat, lng){


    console.log('Place registed! complete Form and add review ('+lat+', '+lng+')')

    nrLat.value = lat
    nrLng.value = lng

    resLat.value = lat
    resLng.value = lng

    resCity.disabled= false
    resStreet.disabled = false
    resBNumber.disabled = false
  
    nrCity.disabled= false
    nrStreet.disabled = false
    nrBNumber.disabled = false
  
    nrCity.value = ""
    nrStreet.value = ""
    nrBNumber.value = ""

    resCity.value = ""
    resStreet.value = ""
    resBNumber.value = ""
  
    $('#myForm').modal('show');
  }
  
  document.getElementById("sAddress").onclick = function(){
  
    search(iCity.value, iStreet.value, iBNumber.value)
  }
  
  /* NEW REVIEW */
  newReview.addEventListener('click', (event) => {

    if(nrCity.value !=="" && nrStreet.value !=="" && nrBNumber.value !=="" && nrReview.value !==""){
  
      cReview({
        type: "createReview",
        lat: nrLat.value,
        lng: nrLng.value,
        city: nrCity.value,
        street: nrStreet.value,
        buildingNumber: nrBNumber.value,
        nrFloor: nrFloor.value,
        nrSide: nrSide.value,
        nrRating: nrRating,
        nrAnon: parseInt(nrAnon.value),
        nrReview: nrReview.value,
        userName: fName+" "+lName,
        userImage: uImage,
        flag: flag.value
      })
  
    }else console.log("Fill required fields!")
  });
  
  async function cReview(data){
    console.log(data)
    await fetch(reviewsService+'/create',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'authorization':'baer '+t,
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
    .then(res => res.json())
    .then((data) => {console.log(data); $('#modalForm').trigger("reset"); $('#myForm').modal('hide'); mountPage(data)})
    .catch(err => console.log(err))
  }

  st1.addEventListener('click', (event) => {
    nrRating = 1
    starStatus({starsToCheck: {st1l: st1}, starsToUncheck: { st2l: st2, st3l: st3, st4l: st4, st5l: st5}})
  })

  st2.addEventListener('click', (event) => {
    nrRating = 2
    starStatus({starsToCheck: {st1l: st1, st2l: st2}, starsToUncheck: { st3l: st3, st4l: st4, st5l: st5}})
  })
  
  st3.addEventListener('click', (event) => {
    nrRating = 3
    starStatus({starsToCheck: {st1l: st1, st2l: st2, st3l: st3}, starsToUncheck: { st4l: st4, st5l: st5}})
  })

  st4.addEventListener('click', (event) => {
    nrRating = 4
    starStatus({starsToCheck: {st1l:st1, st2l: st2, st3l: st3, st4l: st4}, starsToUncheck: { st5l: st5}})
  })

  st5.addEventListener('click', (event) => {
    nrRating = 5
    starStatus({starsToCheck: {st1l: st1, st2l: st2, st3l: st3, st4l: st4, st5l: st5}, starsToUncheck: {}})
  })

  // obj = {starsToCheck: [], starsToUncheck: []}
  function starStatus(v){

    for(let x in v.starsToCheck){

      v.starsToCheck[x].checkVisibility = true
      document.getElementById(x).style.color = "#ffbd00"
    }

    for(let y in v.starsToUncheck){

      v.starsToUncheck[y].checkVisibility = false
      document.getElementById(y).style.color = "#ccc"
    }
  }
  
  /*nrAnon.addEventListener('change', (event) => {
  
    switch(parseInt(nrAnon.value)){
      case 0: nrAnon.value = 1; break;
      case 1: nrAnon.value = 0; break;
    }
  
  })*/
  
  function displayMap(cityCoords) {
    const mapOptions = {
      // change here city coords
        center: { lat: cityCoords.lat, lng: cityCoords.lng },
  
    // zoom must be adapted to user search
    /* TODO:
    if searching for a specific street zoom in
    if searching for city zoom out
  
    */
     zoom: 19
  
      //mapId: 'YOUR_MAP_ID'
    };
  
    const mapDiv = document.getElementById("map");
    return new google.maps.Map(mapDiv, mapOptions);
  }
  
  function addMarkers(map, locations, toRemoveMarkers = []) {
  
    //remove all markers
    for(let mark of toRemoveMarkers){
      mark.setMap(null) }
  
    /*const locations = {
      operaHouse: { lat: -33.8567844, lng: 151.213108 },
      tarongaZoo: { lat: -33.8472767, lng: 151.2188164 },
      manlyBeach: { lat: -33.8209738, lng: 151.2563253 },
      hyderPark: { lat: -33.8690081, lng: 151.2052393 },
      theRocks: { lat: -33.8587568, lng: 151.2058246 },
      circularQuay: { lat: -33.858761, lng: 151.2055688 },
      harbourBridge: { lat: -33.852228, lng: 151.2038374 },
      kingsCross: { lat: -33.8737375, lng: 151.222569 },
      botanicGardens: { lat: -33.864167, lng: 151.216387 },
      museumOfSydney: { lat: -33.8636005, lng: 151.2092542 },
      maritimeMuseum: { lat: -33.869395, lng: 151.198648 },
      kingStreetWharf: { lat: -33.8665445, lng: 151.1989808 },
      aquarium: { lat: -33.869627, lng: 151.202146 },
      darlingHarbour: { lat: -33.87488, lng: 151.1987113 },
      barangaroo: { lat: - 33.8605523, lng: 151.1972205 }
    }*/
    const markers = [];
    const reviews = [];
    for (const location in locations) {
  
      if(locations[location].reviews === "") continue

      const markerOptions = {
        map: map,
        position: locations[location],
        icon: './img/custom_pin.png'
      }
  
      const marker = new google.maps.Marker(markerOptions);
      markers.push(marker);
      reviews.push(locations[location].reviews)
    }
  
    return [markers, reviews];
  }
  
  /*function clusterMarkers(map, markers) {
    const clustererOptions = { imagePath: './img/m' };
    const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
  }*/
  
  
  function addPanToMarker(map, markers, reviews) {
    let circle;
    var infoWindow = new google.maps.InfoWindow();
  
    markers.map( (marker, idx) => {
      marker.addListener('click', event => {
        const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  
        infoWindow.setContent("<div style = 'max-height:450px;min-height:40px;'><div class='row mb-3'><div class='col-md-6'><button type=\"button\" class=\"btn mb-3 float-left\" style=\"background-color:#B7410E;color:white;padding:10px 12px;font-size:10px;\" onclick=\"(function(){ if(!localStorage.getItem('t')){ window.location.href = '"+authPage+"/user/login'; } else { console.log('Place registed! Complete Form and add review [marker click] ("+location.lat+", "+location.lng+")'); resLat.value="+location.lat+"; resLng.value="+location.lng+"; nrLat.value = "+location.lat+"; nrLng.value = "+location.lng+"; resCity.value='-'; resCity.disabled=true; resStreet.value='-'; resStreet.disabled=true; resBNumber.value='-'; resBNumber.disabled=true; nrCity.value='-'; nrCity.disabled = true; nrStreet.value='-'; nrStreet.disabled = true; nrBNumber.value='-'; flag.value ='fromMarker'; resFlag.value='fromMarker'; nrBNumber.disabled= true; $('#myForm').modal('show');} })();\">Add Review</button></div> <div class='col-md-6'> <input style='height:35px;font-size:10pt' type='text' class='form-control float-right' onkeyup='filterRevs("+event.latLng.lat()+","+event.latLng.lng()+")' id='filterRevsInput"+(event.latLng.lat()+event.latLng.lng())+"' placeholder='floor - direction' /> </div>  </div><div class='row'><div class='col-md-12'>" + reviews[idx] + "</div></div></div>");
        infoWindow.open(map, marker);
  
      });
    });
  }
  
  function drawCircle(map, location) {
    const circleOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      map: map,
      center: location,
      radius: 800
    }
    const circle = new google.maps.Circle(circleOptions);
    return circle;
  }

  function changeStarStatus(v){
    for (let x = v; x > 0; x--){
        document.getElementById("st"+v).style.backgroundColor = "yellow"
    }
}

/**
 * +--------------------+
 * | Close modal clean  |
 * +--------------------+
 */

document.getElementById("closeModalBot").addEventListener("click", (event) => {
  nrCity.disabled = false
  nrStreet.disabled = false
  nrBNumber.disabled = false

  $('#modalForm').trigger("reset");
})

document.getElementById("closeModalTop").addEventListener("click", (event) => {
  nrCity.disabled = false
  nrStreet.disabled = false
  nrBNumber.disabled = false

  $('#modalForm').trigger("reset");
  $('#resModalForm').trigger("reset");
})

document.getElementById("resCloseModalBot").addEventListener("click", (event) => {

  $('#resModalForm').trigger("reset");
})
