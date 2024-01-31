<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    <Form @submit="login">
      <!-- Email input -->
      <div class="form-outline mb-4">
        <Field
          name="email"
          type="email"
          id="form2Example1"
          class="form-control"
          v-model="email"
          placeholder="Email"
        />
        <ErrorMessage as="div" name="email" v-slot="{ message }">
          <small id="passwordHelpBlock" class="form-text text-muted">
            {{ message }}
          </small></ErrorMessage
        >
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <Field
          name="password"
          type="password"
          id="form2Example2"
          class="form-control"
          v-model="password"
          placeholder="Password"
          :rules="isRequired"
        />
        <ErrorMessage as="div" name="password" v-slot="{ message }">
          <small id="passwordHelpBlock" class="form-text text-muted">
            {{ message }}
          </small></ErrorMessage
        >
      </div>

      <!-- 2 column grid layout for inline styling -->
      <div class="row mb-4">
        <div class="col d-flex">
          <!-- Checkbox -->
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="form2Example31"
              checked
            />
            <label class="form-check-label" for="form2Example31">
              Remember me
            </label>
          </div>
        </div>

        <div class="col">
          <!-- Simple link -->
          <a href="#!" @click="recoverPassword">Forgot password?</a>
        </div>
      </div>

      <div class="row mb-4">
          <!-- Submit button -->
          <button
            title="Login"
            class="btn btn-primary btn-md btn-block"
            type="submit"
          >
            Sign in
          </button>
        </div>

      <!-- Register buttons -->
      <div class="text-center">
        <p>Not a member? <a href="" @click="register">Register</a></p>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import { Form, Field, ErrorMessage } from "vee-validate";
import { Yup } from "../helpers/constants";
import axios from "axios";

export default defineComponent({
  name: "Login-Form",
  components: { Form, Field, ErrorMessage },
  setup() {
    return {
      isRequired: Yup.required,
    };
  },
  data() {
    return {
      email: "",
      password: "",
      isLogged: false,
      isShow: false,
    };
  },
  methods: {
    async login() {
      try {
        const data = await UserService.login(this.email, this.password);
        console.log(data);
        localStorage.setItem("token", data as string);
        window.location.href = `http://localhost?token=${data}`
      } catch (error) {
        console.log(error);
      }
    },

    async teste() {
      try {
        const data = await UserService.teste();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    register() {
      this.$router.push({ name: "Register-Form" });
    },
    async recoverPassword() {
      this.$router.push({ name: "RecoverPasswordRequest-Form" });
    },
  },
});
</script>
<style></style>
