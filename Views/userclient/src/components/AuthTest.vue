<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    Login successful for email {{ email }}
  </div>

  <div class="container" style="margin-top: 60px; width: 30%">
    <button @click="logout">logout</button>
  </div>

  <div class="container" style="margin-top: 60px; width: 30%">
    <button @click="teste">teste</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { IUser } from "../models/User";


export default defineComponent({
  name: "Login-Form",
  mounted() {
    try {
        const access_Token = localStorage.getItem("token") as string;
        var { email } = jwt_decode(access_Token) as IUser;
        this.email = email;
      } catch (error) {
        console.log(error);
      }
  },
  data() {
    return {
      email: "",
    };
  },
  methods: {
    async logout() {
      try {
        await UserService.logout();
        this.$router.push({ name: "Login-Form" });
      } catch (error) {
        console.log(error);
      }
    },
    async teste() {
      try {
        const access_Token = localStorage.getItem("token") as string;
        var decoded = jwt_decode(access_Token);
        console.log(decoded);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style></style>
