<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    <form>
      <!-- Password input -->
      <div class="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          class="form-control"
          v-model="password"
          placeholder="Password"
        />
      </div>

      <div class="row mb-4">
        <!-- Submit button -->
        <button
          type="button"
          class="btn btn-primary btn-md btn-block"
          v-on:click="changePassword"
        >
          Change Password
        </button>
      </div>
    </form>
    <div v-if="changedPasswordSuccess">Password updated successfully</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";

export default defineComponent({
  name: "ChangePassword-Form",
  data() {
    return {
      changedPasswordSuccess: false,
      password: "",
    };
  },
  methods: {
    async changePassword() {
      await UserService.updatePassword(
        +this.$route.params.id,
        this.password,
        this.$route.params.passwordToken as string
      )
        .then((response) => {
          console.log(response.data);
          this.changedPasswordSuccess = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
</script>
<style></style>
