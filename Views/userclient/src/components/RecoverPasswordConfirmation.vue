<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    <Form>
      <!-- Password input -->
      <div class="form-outline mb-4">
        <Field
          name="password"
          type="password"
          id="form2Example2"
          class="form-control"
          v-model="password"
          placeholder="Password"
          :rules="passwordRule"
        />
        <ErrorMessage as="div" name="password" v-slot="{ message }">
          <small id="passwordHelpBlock" class="form-text text-muted">
            {{ message }}
          </small></ErrorMessage
        >
      </div>

      <!-- Confirm password input -->
      <div class="form-outline mb-4">
        <Field
          name="confirmPassword"
          type="password"
          id="form2Example2"
          class="form-control"
          v-model="confirmPassword"
          placeholder="Confirm password"
        />
      </div>
      <div v-if="confirmPasswordError">Confirm password is different</div>

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
    </Form>
    <div v-if="changedPasswordSuccess">Password updated successfully</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import { Form, Field, ErrorMessage } from "vee-validate";
import { Yup } from "../helpers/constants";

export default defineComponent({
  name: "RecoverPasswordConfirmation-Form",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    return {
      passwordRule: Yup.password,
      isRequired: Yup.required,
    };
  },
  data() {
    return {
      changedPasswordSuccess: false,
      confirmPasswordError: false,
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async changePassword() {
      if (this.password != this.confirmPassword) {
        this.confirmPasswordError = true;
      } else {
        this.confirmPasswordError = false;
        await UserService.recoverUserPasswordConfirmation(
          this.$route.params.token as string,
          this.password
        )
          .then((response) => {
            console.log(response.data);
            this.changedPasswordSuccess = true;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
});
</script>
<style></style>
