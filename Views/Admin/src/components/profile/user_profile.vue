<script>
import SimpleModal from '../modals/simple_modal.vue'

export default {
  name: "User_Profile",

  components: { SimpleModal },

  props: {
    tk: String,
    apis: Object
  },

  created() {
    this.getUserData()
  },

  data() {
    console.log(this.reviews)
    return {
      load: true,
      userData: null,
      modalChangePassword: false,
      cpForm: { oldPassword: null, newPassword: null, confirmPassword: null },

    }
  },

  methods: {
    async getUserData() {
      const res = await fetch(this.apis.usersApi + '/profile', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'authorization': 'baer ' + this.tk,
        },

      }).catch(err => console.log(err))

      const data = await res.json()

      console.log(data)
      this.userData = data
      this.load = false

    },

    callModal() { this.modalChangePassword = true },

    closeModal() { this.modalChangePassword = false },

    // when existing change this request to one where old password verification exists
    async changePassword() {
      fetch(this.apis.usersApi + '/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "authorization": `baer ${this.tk}`
        },
        body: JSON.stringify({ oldPassword: this.cpForm.oldPassword, newPassword: this.cpForm.newPassword }),
      })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))

    }

  }
}

</script>

<template>
  <div class="row">

    <div class="col-12 grid-margin">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">User Profile</h4>


          <div v-if="!load">
            <p><b>Name:</b> {{ userData.firstName }}</p>
            <p><b>Last Name</b>: {{ userData.lastName }}</p>
            <p><b>Email</b>: {{ userData.email }}</p>
            <p><b>type</b>: {{ userData.firstName }}</p>
            <p><b>Email verified</b>: {{ userData.verified ? 'Yes' : 'No' }}</p>
            <button @click="callModal()">Change password</button>

          </div>
          <p v-else> loading ...</p>

          <SimpleModal v-if="modalChangePassword" :title="'Change Password'">
            <template #body>

              <div>

                <div class="formPadding">
                  <h4>Old Password</h4>
                  <input v-model="cpForm.oldPassword" type="password" />
                </div>

                <div class="formPadding">
                  <h4>New Password</h4>
                  <input v-model="cpForm.newPassword" type="password" />
                </div>

                <div class="formPadding">
                  <h4>Confirm new Password</h4>
                  <input v-model="cpForm.confirmPassword" type="password" />
                </div>

              </div>
            </template>
            <template #footer>
              <button @click="changePassword()">Confirm</button>
              <button @click="closeModal()">Close</button>
            </template>
          </SimpleModal>

        </div>
      </div>
    </div>

  </div>
</template>

<style>
.formPadding {
  padding: 10px
}
</style>
