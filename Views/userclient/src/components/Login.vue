<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    <div style="margin-bottom: 25px; color:rgb(153, 21, 21);" v-if="error" class="error-message">
      {{ errorMsg }}
    </div>
    <Form @submit="login">

      <!-- Email input -->
      <div class="form-outline mb-4">
        <Field name="email" type="email" id="form2Example1" class="form-control" v-model="email" placeholder="Email" />
        <ErrorMessage as="div" name="email" v-slot="{ message }">
          <small id="passwordHelpBlock" class="form-text text-muted">
            {{ message }}
          </small>
        </ErrorMessage>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <Field name="password" type="password" id="form2Example2" class="form-control" v-model="password"
          placeholder="Password" :rules="isRequired" />
        <ErrorMessage as="div" name="password" v-slot="{ message }">
          <small id="passwordHelpBlock" class="form-text text-muted">
            {{ message }}
          </small>
        </ErrorMessage>
      </div>

      <!-- 2 column grid layout for inline styling -->
      <div class="form-outline mb-4">
        <div class="col d-flex">
          <!-- Checkbox -->
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
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

      <div class="form-outline mb-4">
        <!-- Submit button -->
        <button title="Login" class="btn btn-primary btn-md btn-block" type="submit">
          Sign in
        </button>
      </div>

      <div class="form-outline mb-4">
        <button type="button" @click="signInWithGoogle"
          class="bg-black px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
          <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy"
            alt="google logo">
          <span>Login with Google</span>
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
import axios from 'axios';

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
      error: false,
      errorMsg: "",
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

        window.location.href = `http://localhost?token=${data.accessToken}`
      } catch (error: any) {
        console.log(error);

        this.error = true;
        this.errorMsg = (!error.response.data.msg)? error.response.data.message : error.response.data.msg;
        setTimeout(() => this.error = false, 3000);

      }
    },
    register() {
      this.$router.push({ name: "Register-Form" });
    },
    async recoverPassword() {
      this.$router.push({ name: "RecoverPasswordRequest-Form" });
    },
    async signInWithGoogle() {
      //http://localhost/#access_token=ya29.a0AfB_byDZF05iWf9nAYr-Y2dB9dA3GAS-diFeN8plFAKh4sWnzGlj2OS_BHOUccibVCaJJIQ_wnaqE2ZjZn3hAkLHFdUXlNd7oy2cioDJ55mG4_hms3AAYnkU5gAmYOrCypTRuS5T_Fqd-qYd5i9TgIoa4k6vEBZpFgaCgYKAXUSARISFQHGX2Miy01ylQQzllJgVjUZBhlyrw0169&token_type=Bearer&expires_in=3599&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/userinfo.profile&authuser=0&prompt=consent
      const redirectUri = 'http://localhost'; // Set up a redirect URI in your Google Cloud Console
      const clientId = process.env.VUE_APP_CLIENTID; // Your Google Cloud Console OAuth client ID
      const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=openid%20profile%20email`;

      window.location.href = authUrl;
    },
  },
});
</script>
<style></style>
