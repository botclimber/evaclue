import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "vue-universal-modal/dist/index.css";

import VueUniversalModal from "vue-universal-modal";

import BootstrapVue3 from "bootstrap-vue-3";

// Since every component imports their Bootstrap functionality,
// the following line is not necessary:
// import 'bootstrap'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

createApp(App)
  .use(store)
  .use(router)
  .use(BootstrapVue3)
  .mount("#app");
