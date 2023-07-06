"use strict"
/**
 * 
 *  Values coming from in.js file:
 *  fName   user first name
 *  lName   user last name
 *  uEmail  user email
 *  t       token
 *  uId     user id
 * 
 *  authPage = "http://localhost:8081"
 *  reviewsService = "http://localhost:8000"
 *  userService = "http://localhost:8001"
 */ 

const proImg = document.getElementById("profileImage")
proImg.src = "images/userImages/"+uImage

document.getElementById("_userName").innerHTML = fName + " " + lName
document.getElementById("_userEmail").innerHTML = uEmail

async function chgPassword(){
    const c_password = document.getElementById("c_password")
    const n_password = document.getElementById("n_password")
    const cn_password = document.getElementById("cn_password")
    const chgPasswordMsg = document.getElementById("chgPasswordMsg")

    await fetch(userService+'/user/manualPassChange/'+uId+'/'+t,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({oldPassword: c_password.value, newPassword: n_password.value})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); 
        chgPasswordMsg.innerHTML = data.message 
    })
    .catch(err => console.log(err))

}

async function updateProfileImg(files){

  const data = new FormData()
  data.append("userImg", files[0]) 

  await fetch(userService+'/user/updateProfileImg/'+uId,{
    method: 'PUT',
    headers: {
      //'Content-Type': 'application/json; multipart/form-data;',
      'authorization': 'baer '+t
    },
    body: data
  })
  .then(res =>{ if(res.ok){ return res.json() } else return false })
  .then(data => {
      console.log(data); 
      
      if(data){

        localStorage.setItem(uImg, data.img)
        proImg.src = "images/userImages/"+data.img
      }
  })
  .catch(err => console.log(err))

}

const byCities = document.getElementById("byCities")
const byRentPriceMin = document.getElementById("byRentPriceMin")
const byRentPriceMax = document.getElementById("byRentPriceMax")
const enable = document.getElementById("enable")
const resMsg = document.getElementById("responseMsg")

function mountView (data) {

  byCities.value = (data.values && data.values.cities)? data.values.cities : byCities.value
  byRentPriceMin.value = (data.values && data.values.rentMin >= 0)? data.values.rentMin : byRentPriceMin.value
  byRentPriceMax.value = (data.values && data.values.rentMin >= 0)? data.values.rentMax : byRentPriceMax.value
}

async function setFilters(){
  const enableValue = (enable.checked)? 1 : 0
  
  const data = {
    userName: `${fName} ${lName}`,
    byCities: byCities.value,
    byRentPriceMin: byRentPriceMin.value,
    byRentPriceMax: byRentPriceMax.value,
    enable: enableValue,
  }

  try{
    const res = await fetch(reviewsService+'/setFilter',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'baer '+t
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        resMsg.innerHTML = data.msg
        return data 
    })

    mountView(res)
  }catch(err){
    console.log(err)
  }

}

async function getFilters(){

  try{
    const res = await fetch(reviewsService+`/getFilter/${uId}`,{
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); 
        enable.checked = (data.values.enable)? data.values.enable : false
        return data
    })   

    mountView(res)
  }catch(err){
    console.log(err)
  }

}

// TODO: write this function | response message more pretty
function setCheckBoxUnchecked(){
  enable.checked = false
  resMsg.innerHTML = "Enable filter after seting up all required filters"
}

getFilters()