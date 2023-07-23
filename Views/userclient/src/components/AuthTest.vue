<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    Login successful
  </div>

  <div class="container" style="margin-top: 60px; width: 30%">
    <button @click="logout">logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import axios from "axios";

export default defineComponent({
  name: "Login-Form",
  methods: {
    async logout() {
      try {
        await UserService.logout();
        this.$router.push({ name: "Login-Form" });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style></style>
