import {createApp} from 'vue'
import App from './App.vue'

const domain = "http://localhost"
const loginPage_PORT = 8011
const mainPage_PORT = 8010

const apis = {
  loginPage: `${domain}:${loginPage_PORT}`,
  mainPlatform: `${domain}:${mainPage_PORT}`,
  reviewsApi: `${domain}/reviews/v1`,
  usersApi: domain
}

const urlParams = new URLSearchParams(window.location.search)
const tk = urlParams.get("t")

async function authVerification (){

    const res = await fetch(apis.usersApi+'/user/profile',{
      method: 'GET',
      headers: {'Content-type': 'application/json',
      'authorization':'baer '+tk,
      },

    }).catch(err => console.log(err))

    const data = await res.json()
    if(!data.blocked && (data.type === "col" || data.type === "admin" || data.type === "superAdmin")){

      createApp(App)

      .provide('apis', apis)
      .provide('tk', tk)
      .provide('firstName', data.firstName)
      .provide('lastName', data.lastName)

      .mount('#app')

    }else window.location.href = `${domain}:${loginPage_PORT}`
}

authVerification()
