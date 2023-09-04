<script>

export default{
  name:"Pending_Claims",

  props:{
    apis: Object,
    tk: String
  },

  data(){
    return {
      allData: null
    }
  },

  async created(){
      await this.getAllClaims()
  },

  methods:{

    async updateClaim(claimId, dec){
      if(confirm("Are you sure ?")){
        const res = await fetch(this.apis.resOwnersApi+'/updateApproval/'+claimId,{
          method: 'PATCH',
          headers: {'Content-type': 'application/json',
          'authorization': 'baer '+this.tk},
          body: JSON.stringify({decision: dec})
        })
        const data = await res.json()

        this.allData = this.onlyPendingRes(data.claims)
      }
    },

    // TODO: build getClaims method | change UI page | update ReviewsService methods
    async getAllClaims(){
        const res = await fetch(this.apis.resOwnersApi+'/getAll',{
          method: "GET",
          headers: {'Content-type': 'application/json',
          'authorization': 'baer '+this.tk}
        }
        ).catch(err => console.log(err))
        const data = await res.json()
        console.log(data)

        this.allData = this.onlyPendingRes(data.residenceOwners )
    },

    onlyPendingRes(input){ return input.filter(row => row.approved == 0) }
  }
}
</script>

<template>
  <div class="row">
    <div class="col-12 grid-margin">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Reviews waiting for approval</h4>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>User</th>
                  <th>file</th>
                  <th>Location</th>
                  <th>Creation Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>

                <tr v-for="row of allData" :key="row.id">
                  <td>
                    <img style="width:50px;height:50px" :src="+apis.mainPlatform+'/images/userImages/'+row.userImg"/>
                  </td>
                  <td>{{row.userName}}</td>
                  <td><a :href="'src/assets/images/resProofFiles/'+row.fileProof" target="_blank">{{row.fileProof}}</a> </td>
                  <td>
                    <a href="#">check specific Location</a>
                  </td>
                  <td>
                    <p>{{row.createdOn}}</p>
                  </td>
                  <td>
                    <div
      @click="updateClaim(row.id, 1)"
                      class="badge badge-outline-success asBtn"
                    >
                      Y
                    </div>
                    <div
                      class="badge badge-outline-danger asBtn"
      @click="updateClaim(row.id, 2)"
                    >
                      X
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.asBtn{
  margin: 5px;
  cursor:pointer
}
</style>
