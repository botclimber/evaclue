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