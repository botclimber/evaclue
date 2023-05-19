<template>
  <div class="container" style="margin-top: 60px; width: 30%">
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
          title="Register"
          class="btn btn-primary btn-md btn-block"
          type="submit"
        >
          Send recover email
        </button>
      </div>
    </Form>
    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <modal :show="isShow" :message="modalBody" @close="onModalClose">
        <template #header>
          <h3>{{ modalHeader }}</h3>
        </template>
      </modal>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "../services/UserService";
import Modal from "../components/Modal.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { Yup } from "../helpers/constants";

export default defineComponent({
  name: "Login-Form",
  components: { Modal, Form, Field, ErrorMessage },
  setup() {
    return {
      passwordRule: Yup.password,
      emailRule: Yup.email,
    };
  },
  data() {
    return {
      email: "",
      isShow: false,
      modalHeader: "",
      modalBody: "",
    };
  },
  methods: {
    async sendRecoverEmail() {
      await UserService.changePasswordRequest(this.email)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      this.setModalValues(
        "Email sent",
        "If a user with this email already exists, a recovery email will be sent to it."
      );
    },
    async onModalClose() {
      this.modalBody = "";
      this.modalHeader = "";
      this.isShow = false;
    },
    async setModalValues(header: string, body: string) {
      this.modalBody = body;
      this.modalHeader = header;
      this.isShow = true;
    },
  },
});
</script>
