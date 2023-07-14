<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    <div v-if="isLogged">Login successful for user with email {{ email }}</div>
    <div v-else>
    <p>{{qResponse}}</p>
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
            :rules="emailRule"
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
            :rules="passwordRule"
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
            <a href="#!" @click="changePasswordRequest">Forgot password?</a>
          </div>
        </div>

        <div class="row mb-4">
          <!-- Submit button -->
          <button
            title="Login"
            style="backgroundColor: rgb(221 131 92); color:white"
            class="btn btn-default"
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import { Form, Field, ErrorMessage } from "vee-validate";
import { Yup } from "../helpers/constants";

export default defineComponent({
  name: "Login-Form",
  components: { Form, Field, ErrorMessage },
  //setup() {
  //  return {
  //    passwordRule: Yup.password,
  //    emailRule: Yup.email,
  //  };
  //},
  data() {
    return {
      email: "",
      password: "",
      isLogged: false,
      isShow: false,
      modalHeader: "",
      modalBody: "",
      qResponse: ""
    };
  },
  methods: {
    async login() {
      await UserService.login(this.email, this.password)
        .then((response) => {
          console.log(response.data);
          // if true
          // regist token in localStorage
          // redirect to rentify home page
          console.log(response.data)
          this.isLogged = true;
          window.location.href = "http://localhost:8080/?uImage="+response.data.user.uImage+"&firstName="+response.data.user.firstName+"&lastName="+response.data.user.lastName+"&userEmail="+response.data.user.userEmail+"&t="+response.data.token+"&tType="+response.data.user.userType+"&tTime="+response.data.user.expTime+"&uId="+response.data.user.uId
        })
        .catch((error) => {
          this.qResponse = error["response"].data.message
          console.error(error);
        });
    },
    register() {
      this.$router.push({ name: "Register-Form" });
    },
    async changePasswordRequest() {
      this.$router.push({ name: "RecoverPassword-Form" });
    },
  },
});
</script>
<style></style>