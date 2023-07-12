import {createApp} from 'vue'
import App from './App.vue'

const domain = "http://www.evaclue.com"
const authPage = "/login"
const mainPage = "/"

const apis = {
  loginPage: `${domain}${authPage}`,
  mainPlatform: `${domain}${mainPage}`,
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

    }else window.location.href = apis.loginPage
}

authVerification()
