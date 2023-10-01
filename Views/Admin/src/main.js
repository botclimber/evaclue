import {createApp} from 'vue'
import App from './App.vue'

const domain = "http://localhost"
const loginPage_PORT = "/login"
const mainPage_PORT = "/"

const apis = {
  loginPage: `${domain}:${loginPage_PORT}`,
  mainPlatform: `${domain}:${mainPage_PORT}`,
  reviewsApi: `${domain}/reviews/v2`,
  geoLocationApi: `${domain}/geo/v1`,
  resOwnersApi: `${domain}/resowners/v1`, 
  usersApi: `${domain}/users/v1`
}

const urlParams = new URLSearchParams(window.location.search)
const tk = urlParams.get("t")
console.log(tk)

async function authVerification (){

    const res = await fetch(apis.usersApi+'/profile',{
      method: 'GET',
      headers: {'Content-type': 'application/json',
      'authorization':'baer '+tk,
      },

    }).catch(err => console.log(err))

    const data = await res.json()
    console.log(data)

    //if(!data.blocked && (data.type === "col" || data.type === "admin" || data.type === "superAdmin")){
    if((data.userType === "col" || data.userType === "admin" || data.userType === "superAdmin")){

      createApp(App)

      .provide('apis', apis)
      .provide('tk', tk)
      .provide('firstName', "???")
      .provide('lastName', "???")

      .mount('#app')

    }else window.location.href = apis.loginPage
}

authVerification()
