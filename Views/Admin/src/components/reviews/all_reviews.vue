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
          if(this.reviews) this.reviews.map(row => modals.set('modal'+row.id, false))
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
                          <tr v-for="row of allData" :key="row.id">
                            <SimpleModal v-if="modals.get('modal'+row.id)" :title="'teste de teste'" >
                                <template #body>
                                <div>
                                  <div>
                                    <h2>Address ({{row.addr.lat}}, {{row.addr.lng}})</h2>
                                    <p>{{row.addr.country}}, {{row.addr.city}}, {{row.addr.street}} nr. {{row.addr.nr}}, {{row.addr.postalCode}}, {{row.res.floor}} {{row.res.direction}}</p>
                                  </div>
                                  <div>
                                    <h2>Review</h2>
                                    <p>id: {{row.id}}</p>
                                    <p>UserID: {{row.userId}}</p>
                                    <p>Approved by AdminID: {{row.adminId}}</p>
                                    <p>anonymous: {{row.anonymous ? 'Yes' : 'No'}}</p>
                                    <p>review: {{row.review}}</p>
                                    <p>rating: {{row.rating}}</p>
                                    <p v-if="row.approved === 1">Approved: Yes</p>
                                    <p v-else-if="row.approved === 2">Approved: Rejected</p>
                                    <p v-else>Approved: Pending</p>
                                    <p>approved on: {{row.approvedOn}}</p>
                                    <p>created on: {{row.createdOn}}</p>
                                  </div>
                                </div>
                                </template>
                                <template #footer>
                                <button @click="close(row.id)">Close</button>
                                </template>
                            </SimpleModal>
                            <td class="py-1">
                              <button @click="callModal(row.id)"><img src="../../../public/assets/images/faces-clipart/pic-1.png" alt="image" /></button>
                            </td>
                            <td> {{ row.review }} </td>
                            <td>
                              {city}, {street} nr. {building number}
                            </td>
                            <td> {{ row.createdOn }}</td>
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
