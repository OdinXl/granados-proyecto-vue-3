<template>
  <loading-component :show="loading">
    <div class="col">
      <div class="card">
        <img @click="openModal()" :src="product.img" height="150px" class="card-img-top" style="cursor: pointer;" alt="...">
        <div class="card-body">
          <h5 class="card-title">{{ $filters.capitalize(product.name) }}</h5>
          <p class="card-text">{{ product.description }}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">$ {{ $filters.decimal(product.price) }}</li>
        </ul>
        <div class="card-body d-grid">
          <button class="btn btn-primary btn-sm" @click="addToCart()" type="button">Agregar al Carrito</button>
        </div>
      </div>
    </div>
    <product-detail-modal v-if="showModalDetail" @closeModal="closeModal" @addToCart="addToCart" :product="product"></product-detail-modal>
  </loading-component>
</template>

<script>
import LoadingComponent from './../../LoadingComponent.vue';
import ProductDetailModal from './ProductDetailModal.vue';

export default {
  name: 'ProductComponent',
  components: {
    LoadingComponent,
    ProductDetailModal
  },
  props: {
    product: Object,
  },
  data: function () {
    return {
      loading: false,
      showModalDetail: false
    }
  },
  methods: {
    addToCart(){
      this.loading = true;
      let data = {
        product_id: this.product.id,
        amount: 1
      };
      let vm = this;
      this.$axios.post('/edit_cart', data).then(function (response) {
        if(response.data?.success){
          let message = response.data.message;
          vm.$toasted.global.r_success({
            message : message
          });
        }
      }).catch(function (error) {
        if(error?.response?.data?.data){
          let message = error.response.data.data;
          vm.$toasted.global.r_error({
            message : message
          });
        }
      }).finally(() => {
        this.loading = false;
        this.$store.dispatch('getDatos');
      });
    },
    openModal(){
      this.showModalDetail = true;
    },
    closeModal(){
      this.showModalDetail = false;
    }
  }
}
</script>

<style scoped>
</style>