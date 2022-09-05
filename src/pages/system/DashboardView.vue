<template>
  <loading-component :show="loading">
    <div class="col-12 d-flex justify-content-center row">
      <div class="card col-10 mt-3 mb-3">
        <div class="card-body">
          <h3>Productos</h3>
        </div>
      </div>
      <div class="card col-10 mt-2 mb-3">
        <div class="d-flex justify-content-center mt-4" v-if="products.length <= 0">
          sin registros
        </div>
        <div class="card-body row row-cols-1 row-cols-md-4">
          <product-component v-for="(product, index) in products" :key="index" :product="product"></product-component>
        </div>
      </div>
    </div>
  </loading-component>
</template>

<script>
import LoadingComponent from '../../components/LoadingComponent';
import ProductComponent from '@/components/system/dasboard/ProductComponent';

export default {
  name: 'DashboardView',
  components: {
    LoadingComponent,
    ProductComponent
  },
  data: function () {
    return {
      loading: false,
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
    }
  },
  mounted(){
    this.getProducts();
  }
}
</script>

<style scoped>
</style>