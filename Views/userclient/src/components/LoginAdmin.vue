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
            class="btn btn-primary btn-md btn-block"
            type="submit"
          >
            Sign in
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
  name: "Login-Form",
  components: { Form, Field, ErrorMessage },
  setup() {
    return {
      passwordRule: Yup.password,
      emailRule: Yup.email,
    };
  },
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
      await UserService.loginAdmin(this.email, this.password)
        .then((response) => {
          console.log(response.data)
          this.isLogged = true;
          window.location.href = "http://localhost/admin/?token="+response.data
        })
        .catch((error) => {
          this.qResponse = error["response"].data.message
          console.error(error);
        });
    },

    async changePasswordRequest() {
      this.$router.push({ name: "RecoverPassword-Form" });
    },
  },
});
</script>
<style></style>
