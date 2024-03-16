<script>

export default {
    name: "New_Col",

    props:{
        tk: String,
        apis: Object
    },

    data(){
        return {
        type: "",
        typeOpt: [
          { text: 'Colaborator', value: 'col' },
          { text: 'Admin', value: 'admin' },
          { text: 'Super Admin', value: 'superAdmin' }
        ],
        firstName: "",
        lastName: "",
        email: "",
        pass: ""

        }
    },

    methods: {
      async registNewUser(){

          if(confirm("confirm this action, please!")){

            const res = await fetch(this.apis.usersApi+'/registerAdmin',{
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                'authorization':this.tk
              },
              body: JSON.stringify({firstName: this.firstName, lastName: this.lastName, email: this.email, type: this.type, password: this.pass})
              }).catch(err => console.log(err))

            const data = await res.json()
            console.log(data)

          }
      }
  }
}

</script>

<template>

<div class="row">

  <div class="col-md-6 grid-margin stretch-card">
    <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">New Colaborator</h4>
                    <p class="card-description"> Give access to managment platform. </p>
                    <form class="forms-sample">

      <div class="card">
        <div class="card-body">
          <div class="form-group"><input class="form-control" v-model="firstName"  placeholder="First Name" /></div>
          <div class="form-group"><input class="form-control" v-model="lastName"  placeholder="Last Name" /></div>
          <div class="form-group"><input class="form-control" v-model="email"  placeholder="Email" /></div>
          <div class="form-group"><input class="form-control" type="password" v-model="pass"  placeholder="Password" /></div>
          <div class="form-group"><input class="form-control" type="password" v-model="confPass"  placeholder="Confirm Password" /></div>
          <div class="form-group">
            <select class="form-control" v-model="type">
            <option v-for="option in typeOpt" :value="option.value">
            {{ option.text }}
            </option>
          </select>
          </div>

          <button type="button" @click="registNewUser()" class="btn btn-primary mr-2">Submit</button>
</div>
</div>
</form>
            </div>
            </div>
            </div>

        </div>
</template>

<style>
.nto{
padding:10px;
}
.formPadding {
  padding: 10px
}
</style>
