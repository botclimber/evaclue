<script>

export default{
  name:"Pending_Reviews",

  props:{
    apis: Object,
    reviews: Object,
    tk: String
  },

  data(){
    return {
      allData: this.reviews.filter(row => row.rev.approved == 0)
    }
  },

  methods:{

    async updateReview(revId, dec){
      if(confirm("Are you sure ?")){
        const res = await fetch(this.apis.reviewsApi+'/update/'+revId,{
          method: 'PATCH',
          headers: {'Content-type': 'application/json',
          'authorization': 'baer '+this.tk},
          body: JSON.stringify({decision: dec})
        })
        const data = await res.json()

        if(res.status === 200){
          this.allData = this.allData.filter (e => e.rev.id !== revId)

        }else console.log(data)
      }
    }
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
                  <th>User</th>
                  <th>Review</th>
                  <th>Location</th>
                  <th></th>
                  <th>Creation Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>

                <tr v-for="row of allData" :key="row.rev.id">
                  <td>{{ row.rev.id }}</td>
                  <td>
                    {{ row.rev.review }}
                  </td>
                  <td>{{row.location.addr.city}}, {{row.location.addr.street}} {{row.location.addr.nr}}</td>
                  <td>
                    <iframe style="border-radius:10px"
                      width="200"
                      height="150"
                      loading="lazy"
                      allowfullscreen
                      referrerpolicy="no-referrer-when-downgrade"
                      :src="
                        'https://www.google.com/maps/embed/v1/place?key=AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ&q=' +
                        row.location.addr.lat +
                        ',' +
                        row.location.addr.lng +
                        '&zoom=19'
                      "
                    >
                    </iframe>
                  </td>
                  <td>
                    <p>{{ row.rev.createdOn }}</p>
                  </td>
                  <td>
                    <div
      @click="updateReview(row.rev.id, 1)"
                      class="badge badge-outline-success asBtn"
                    >
                      Y
                    </div>
                    <div
                      class="badge badge-outline-danger asBtn"
      @click="updateReview(row.rev.id, 2)"
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
