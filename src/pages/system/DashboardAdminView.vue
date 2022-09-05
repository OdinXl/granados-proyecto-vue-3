<template>
  <loading-component :show="loading">
    <div class="col-12 d-flex justify-content-center row">
      <div class="card col-10 mt-3 mb-3">
        <div class="card-body">
          <h3>Productos</h3>
          <button type="button" @click="openModal('store')" class="btn btn-success btn-sm">Registrar</button>
        </div>
      </div>
      <div class="card col-10 mt-2 mb-3">
        <div class="card-body table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Foto</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio Unitario</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="products.length <= 0">
                <th scope="row" colspan="5">
                  <div class="d-flex justify-content-center">sin registros</div>
                </th>
              </tr>
              <tr v-for="(product, index) in products" :key="index">
                <th scope="row">{{ product.id }}</th>
                <td>
                  <img :src="product.img" height="30px" alt="..."/>
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>
                  <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                    <button type="button" @click="openModal('show', product)" class="btn btn-sm btn-info">Ver</button>
                    <button type="button" @click="openModal('update', product)" class="btn btn-sm btn-warning">Editar</button>
                    <button type="button" @click="destroy(product)" class="btn btn-sm btn-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <product-admin-modal v-if="showModal" @closeModal="closeModal" @updateData="updateData" :type="type" :product="product"></product-admin-modal>
  </loading-component>
</template>

<script>
import LoadingComponent from '../../components/LoadingComponent';
import ProductAdminModal from '../../components/system/dasboard/ProductAdminModal';

export default {
  name: 'DashboardView',
  components: {
    LoadingComponent,
    ProductAdminModal
  },
  data: function () {
    return {
      loading: false,
      showModal: false,
      type: 'store',
      product: {},
      products: []
    }
  },
  methods: {
    getProducts(){
      this.loading = true;
      let vm = this;

      this.$axios.get('/get_products').then(function (response) {
        if(response.data?.success){
          vm.products = response.data.data.products;
        }
      }).catch(function (error) {
        console.log(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    openModal(type, product = {}){
      this.type = type;
      this.product = product;
      this.showModal = true;
    },
    closeModal(){
      this.showModal = false;
      this.product = {};
    },
    async updateData(){
      await this.closeModal();
      await this.getProducts();
    },
    destroy(product){
      this.loading = true;
      let id = product.id;
      let vm = this;
      
      this.$axios.delete('/product/'+id).then(async function (response) {
        if(response.data?.success){
          let message = response.data.message;
          vm.$toasted.global.r_success({
              message : message
          });

          await vm.getProducts();
        }
      }).catch(function (error) {
        if(error.response?.data?.message){
          let message = error.response.data.data;
          vm.$toasted.global.r_error({
              message : message
          });
        }
      }).finally(() => {
          this.loading = false;
      });
    }
  },
  mounted(){
    this.getProducts();
  }
}
</script>

<style scoped>
</style>