"use strict";

var resCity= document.getElementById("resCity")
var resStreet= document.getElementById("resStreet")
var resBNumber= document.getElementById("resBNumber")
var resFloor= document.getElementById("resFloor")
var resSide= document.getElementById("resSide")

var resLat= document.getElementById("resLat")
var resLng= document.getElementById("resLng")
var resFlag= document.getElementById("resFlag")

var resFreeNo= document.getElementById("resFreeNo")
var resFreeYes= document.getElementById("resFreeYes")

var fileProof = document.getElementById("fileProof")

var claimResidenceBtn = document.getElementById("claimResidence")

// check if data filled in order to then make request to server
claimResidenceBtn.addEventListener("click", async (event) => {
    if( ((resLat.value !== "" && resLng.value !== "") || resCity.value !=="" && resStreet.value !== "" && resBNumber.value !== "" ) && (resFloor.value !== "" && resSide.value !== "" && fileProof.files[0] && (resFreeNo.checked || resFreeYes.checked))){

        console.log(fileProof.files)
        const free = (resFreeNo.checked )? 1 : 0

        const data = {
            resLat: resLat.value,
            resLng: resLng.value,
            floor: resFloor.value,
            flat: resSide.value,
            free: free,
            city: resCity.value,
            street: resStreet.value,
            buildingNumber: resBNumber.value,
            postalCode: "0000-000",
            country: "PT",
            flag: resFlag.value,
            userName: fName+" "+lName,
            userImage: uImage,
        }

        const fileData = new FormData()
        fileData.append("file", fileProof.files[0])
        fileData.append("data", JSON.stringify(data))
        
        await fetch(reviewsService+'/resOwner/createResOwner',{
            method: 'POST',
            headers: {
                'authorization':'baer '+t,
                //'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            body: fileData,
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); 
            $('#resModalForm').trigger("reset"); 
            $('#myForm').modal('hide'); 
        })
        .catch(err => console.log(err))

    }else console.log("Fill all required fields!")

})