<template>
  <div ref="exampleModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <loading-component :show="loading">
          <div class="modal-header">
          <h5 class="modal-title">{{ $filters.capitalize(product.name) }}</h5>
          <button type="button" class="btn-close" @click="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img :src="product.img" class="d-block w-100" alt="...">
                </div>
              </div>
            </div>
            {{ product.long_description }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="closeModal()">Volver</button>
            <button class="btn btn-primary btn-sm" @click="addToCart()" type="button">Agregar al Carrito</button>
          </div>
        </loading-component>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingComponent from './../../LoadingComponent.vue';

/* eslint-disable*/

export default {
  name: 'ProductComponent',
  components: {
    LoadingComponent
  },
  props: {
    product: Object,
  },
  data: function () {
    return {
      loading: false,
      modal: null
    }
  },
  methods: {
    openModal(){
      this.modal.show();
    },
    closeModal(){
      this.modal.hide();
      this.$emit("closeModal");
    },
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
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.exampleModal, {backdrop: 'static'});
    this.openModal();
  }
}
</script>

<style scoped>
</style>