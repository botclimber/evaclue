<template>
  <div class="container mt-3" style="width: 30%">
    <div class="row" style="margin-bottom: 60px;"><a href="/user/login">go back</a></div>
    <!-- change this to dynamic go to previous page -->
    <div v-if="isRegistered">
      User registered successfully. Check your email to verify your account

      <div class="row mb-4">
        <!-- Submit button -->
        <button type="button" class="btn btn-primary btn-md btn-block" v-on:click="goToLogin">
          Redirect to login page
        </button>
      </div>
    </div>
    <div v-else>
      <div style="margin-bottom: 25px; color:rgb(153, 21, 21);" v-if="error" class="error-message">
        {{ errorMsg }}
      </div>
      <Form @submit="register">
        <!-- First Name input -->
        <div class="form-outline mb-4">
          <Field name="firstName" type="text" class="form-control" id="form2Example1" v-model="firstName"
            placeholder="First Name" :rules="isRequired" />
          <ErrorMessage as="div" name="firstName" v-slot="{ message }">
            <small id="passwordHelpBlock" class="form-text text-muted">
              {{ message }}
            </small>
          </ErrorMessage>
        </div>

        <!-- Last Name input -->
        <div class="form-outline mb-4">
          <Field name="lastName" type="text" id="form2Example1" class="form-control" v-model="lastName"
            placeholder="Last Name" :rules="isRequired" />
          <ErrorMessage as="div" name="lastName" v-slot="{ message }">
            <small id="passwordHelpBlock" class="form-text text-muted">
              {{ message }}
            </small>
          </ErrorMessage>
        </div>

        <!-- Email input -->
        <div class="form-outline mb-4">
          <Field name="email" type="email" id="form2Example1" class="form-control" v-model="email" placeholder="Email"
            :rules="emailRule" />
          <ErrorMessage as="div" name="email" v-slot="{ message }">
            <small id="passwordHelpBlock" class="form-text text-muted">
              {{ message }}
            </small>
          </ErrorMessage>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
          <Field name="password" type="password" id="form2Example2" class="form-control" v-model="password"
            placeholder="Password" :rules="passwordRule" />
          <ErrorMessage as="div" name="password" v-slot="{ message }">
            <small id="passwordHelpBlock" class="form-text text-muted">
              {{ message }}
            </small>
          </ErrorMessage>
        </div>

        <div class="row mb-4">
          <!-- Submit button -->
          <button title="Register" class="btn btn-primary btn-md btn-block" type="submit">
            Register
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import { Form, Field, ErrorMessage } from "vee-validate";
import { Yup } from "../helpers/constants";

export default defineComponent({
  name: "Register-Form",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    return {
      passwordRule: Yup.password,
      isRequired: Yup.required,
      emailRule: Yup.email,
    };
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isRegistered: false,
    };
  },
  methods: {
    async register() {

      UserService.register(
        this.firstName,
        this.lastName,
        this.email,
        this.password
      )
        .then((response) => {
          console.log(`Success response is ${response}`);
          this.isRegistered = true;
        })
        .catch((error: any) => {
          console.error(error);

          this.error = true;
          this.errorMsg = (!error.response.data.msg)? error.response.data.message : error.response.data.msg;
          setTimeout(() => this.error = false, 3000);
        });
    },
    goToLogin() {
      this.$router.push({ name: "Login-Form" });
    },
  },
});
</script>
<style></style>
