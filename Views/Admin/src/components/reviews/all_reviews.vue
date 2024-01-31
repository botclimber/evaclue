<script>
import SimpleModal from '../modals/simple_modal.vue'

export default {
    name: "All_Reviews",
    components:{ SimpleModal},
    props:{
        reviews: Object
    },

    data(){
        console.log(this.reviews)
        return {
          modals: this.getModals(),
          allData: this.reviews

        }
    },

    methods: {
        getModals (){
          const modals = new Map()
          if(this.reviews) this.reviews.map(row => modals.set('modal'+row.rev.id, false))
          else "???"

          console.log(modals)
          return modals

        },
        close(key){this.modals.set('modal'+key, false)},
        callModal(key){this.modals.set('modal'+key, true)}
    }
  }

</script>

<template>

<div class="row">

    <div class="col-12 grid-margin">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Reviews</h4>
          <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th> User </th>
                            <th> Review </th>
                            <th> Address </th>
                            <th> CreatedAt </th>
                            <th>  </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row of allData" :key="row.rev.id">
                            <SimpleModal v-if="modals.get('modal'+row.rev.id)" :title="'teste de teste'" >
                                <template #body>
                                <div>
                                  <div>
                                    <h2>Address ({{row.location.addr.lat}}, {{row.location.addr.lng}})</h2>
                                    <p>{{row.location.addr.country}}, {{row.location.addr.city}}, {{row.location.addr.street}} nr. {{row.location.addr.nr}}, {{row.location.addr.postalCode}}, {{row.location.res.floor}} {{row.location.res.direction}}</p>
                                  </div>
                                  <div>
                                    <h2>Review</h2>
                                    <p>id: {{row.rev.id}}</p>
                                    <p>UserID: {{row.rev.userId}}</p>
                                    <p>Approved by AdminID: {{row.rev.adminId}}</p>
                                    <p>anonymous: {{row.rev.anonymous ? 'Yes' : 'No'}}</p>
                                    <p>review: {{row.rev.review}}</p>
                                    <p>rating: {{row.rev.rating}}</p>
                                    <p v-if="row.rev.approved === 1">Approved: Yes</p>
                                    <p v-else-if="row.rev.approved === 2">Approved: Rejected</p>
                                    <p v-else>Approved: Pending</p>
                                    <p>approved on: {{row.rev.approvedOn}}</p>
                                    <p>created on: {{row.rev.createdOn}}</p>
                                  </div>
                                </div>
                                </template>
                                <template #footer>
                                <button @click="close(row.rev.id)">Close</button>
                                </template>
                            </SimpleModal>
                            <td class="py-1">
                              <button @click="callModal(row.rev.id)"><img src="../../../public/assets/images/faces-clipart/pic-1.png" alt="image" /></button>
                            </td>
                            <td> {{ row.rev.review }} </td>
                            <td>
                              {{ row.location.addr.city }}, {{ row.location.addr.street }} nr. {{ row.location.addr.nr }}
                            </td>
                            <td> {{ row.rev.createdOn }}</td>
                            <td> </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
            </div>

        </div>
</template>
