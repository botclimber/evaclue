import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import login from "../components/Login.vue";
import loginAdmin from "../components/LoginAdmin.vue";
import register from "../components/Register.vue";
import recoverPasswordConfirmation from "../components/RecoverPasswordConfirmation.vue";
import recoverPasswordRequest from "../components/RecoverPasswordRequest.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/login",
    name: "Login-Form",
    component: login,
  },
  {
    path: "/user/register",
    name: "Register-Form",
    component: register,
  },
  {
    path: "/user/recover-password/confirmation/:token",
    name: "RecoverPasswordConfirmation-Form",
    component: recoverPasswordConfirmation,
  },
  {
    path: "/user/recover-password/request",
    name: "RecoverPasswordRequest-Form",
    component: recoverPasswordRequest,
  },
  {
    path: "/user/loginAdmin",
    name: "Login-Admin",
    component: loginAdmin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
