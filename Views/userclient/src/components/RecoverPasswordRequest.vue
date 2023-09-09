<template>
  <div class="container" style="margin-top: 60px; width: 30%">
    <div v-if="isEmailSent">
        If a user with this email exists, a recovery email will be sent to it.
    </div>
    <div v-else>
      <Form @submit="sendRecoverEmail">
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

        <div class="row mb-4">
          <!-- Submit button -->
          <button
            title="Send"
            class="btn btn-primary btn-md btn-block"
            type="submit"
          >
            Send recover email
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
  name: "RecoverPasswordRequest-Form",
  components: { Form, Field, ErrorMessage },
  setup() {
    return {
      emailRule: Yup.email,
    };
  },
  data() {
    return {
      email: "",
      isEmailSent: false,
    };
  },
  methods: {
    async sendRecoverEmail() {
      await UserService.recoverUserPasswordEmailRequest(this.email)
        .then((response) => {
          console.log(response.data);
          this.isEmailSent = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
</script>
