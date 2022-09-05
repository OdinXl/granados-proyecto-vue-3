<template>
  <div ref="exampleModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <loading-component :show="loading">
            <form @submit.prevent="submitForm()">
                <div class="modal-header">
                    <h5 v-show="type == 'store'" class="modal-title">Registrar</h5>
                    <h5 v-show="type == 'update'" class="modal-title">Actualizar</h5>
                    <h5 v-show="type == 'show'" class="modal-title">Ver</h5>
                    <button type="button" class="btn-close" @click="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="img" class="form-label">Imagen</label>
                        <input type="url" v-model="product_modal.img" class="form-control" id="img" placeholder="Url - Max 1000 caracteres" max="1000" :disabled="type == 'show'" required>
                    </div>
                    <p v-for="error in errors.img" :key="error" class="text-danger">{{ error }}</p>

                    <div class="mb-3">
                        <label for="name" class="form-label">Nombre</label>
                        <input type="text" v-model="product_modal.name" class="form-control" id="name" placeholder="Nombre" max="50" :disabled="type == 'show'" required>
                    </div>
                    <p v-for="error in errors.name" :key="error" class="text-danger">{{ error }}</p>

                    <div class="mb-3">
                        <label for="description" class="form-label">Descripcion</label>
                        <input type="text" v-model="product_modal.description" class="form-control" id="description" placeholder="Desccripcion" max="50" :disabled="type == 'show'" required>
                    </div>
                    <p v-for="error in errors.description" :key="error" class="text-danger">{{ error }}</p>

                    <div class="mb-3">
                        <label for="long_description" class="form-label">Descripcion Larga</label>
                        <input type="text" v-model="product_modal.long_description" class="form-control" id="long_description" placeholder="Desccripcion Larga" max="255" :disabled="type == 'show'" required>
                    </div>
                    <p v-for="error in errors.long_description" :key="error" class="text-danger">{{ error }}</p>
                    
                    <div class="mb-3">
                        <label for="price" class="form-label">Precio Unitario</label>
                        <input type="number" v-model="product_modal.price" class="form-control" id="price" placeholder="Precio Unitario" :disabled="type == 'show'" required>
                    </div>
                    <p v-for="error in errors.price" :key="error" class="text-danger">{{ error }}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" @click="closeModal()">Volver</button>
                <button v-show="type == 'store'" class="btn btn-primary btn-sm"  type="submit">Registrar</button>
                <button v-show="type == 'update'" class="btn btn-primary btn-sm"  type="submit">Actualizar</button>
            </div>
          </form>
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
    type: String,
    product: Object
  },
  data: function () {
    return {
      loading: false,
      modal: null,
      product_modal: {},
      errors: {}
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
    async updateData(){
        this.modal.hide();
        this.$emit("updateData");
    },
    async submitForm(){
        if(this.type == 'store'){
            await this.storeForm();
        }

        if(this.type == 'update'){
            await this.updateForm();
        }
    },
    storeForm(){
        this.loading = true;
        this.errors = {};

        let data = {
            'img': this.product_modal.img,
            'name': this.product_modal.name,
            'description': this.product_modal.description,
            'long_description': this.product_modal.long_description,
            'price': this.product_modal.price
        };

        let vm = this;
        this.$axios.post('/product', data).then(function (response) {
            if(response.data?.success){
                let message = response.data.message;
                vm.$toasted.global.r_success({
                    message : message
                });
                vm.updateData();
            }
        }).catch(function (error) {
            if(error.response?.data?.message){
                vm.errors = error.response.data.data;
            }
        }).finally(() => {
            this.loading = false;
        });
    },
    updateForm(){
        this.loading = true;
        this.errors = {};

        let data = {
            'img': this.product_modal.img,
            'name': this.product_modal.name,
            'description': this.product_modal.description,
            'long_description': this.product_modal.long_description,
            'price': this.product_modal.price
        };

        let vm = this;
        this.$axios.put('/product/'+this.product_modal.id, data).then(function (response) {
            if(response.data?.success){
                let message = response.data.message;
                vm.$toasted.global.r_success({
                    message : message
                });

                vm.updateData();
            }
        }).catch(function (error) {
            if(error.response?.data?.message){
                vm.errors = error.response.data.data;
            }
        }).finally(() => {
            this.loading = false;
        });
    }
  },
  mounted(){
    this.product_modal = this.product;
    this.modal = new bootstrap.Modal(this.$refs.exampleModal, {backdrop: 'static'});
    this.openModal();
  }
}
</script>

<style scoped>
</style>