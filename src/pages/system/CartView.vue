<template>
    <loading-component :show="loading">
        <div class="col-12 d-flex justify-content-center row">
            <div class="card col-10 mt-3 mb-3">
                <div class="card-body">
                <h3>Carrito</h3>
                </div>
            </div>
            <div class="card col-10 mt-2 mb-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Precio Unitario</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="$store.state.cart.length <= 0">
                            <th scope="row" colspan="5">
                                <div class="d-flex justify-content-center">no hay productos cargados en el carrito</div>
                            </th>
                        </tr>
                        <tr v-for="(product, index) in $store.state.cart" :key="index">
                            <td>{{ $filters.capitalize(product.name) }}</td>
                            <td>
                                <button @click="editCart(product, -1)" type="button" class="btn btn-outline-danger btn-sm">-</button>
                                {{ product.amount }}
                                <button @click="editCart(product, 1)" type="button" class="btn btn-outline-success btn-sm">+</button>
                            </td>
                            <td>$ {{ $filters.decimal(product.price) }}</td>
                            <td>$ {{ $filters.decimal(product.price * product.amount) }}</td>
                        </tr>
                        <tr v-if="$store.state.cart.length != 0">
                            <td>

                            </td>
                            <td>
                                
                            </td>
                            <th>
                                Total Final
                            </th>
                            <th>
                                $ {{ $filters.decimal(totalFinal()) }}                               
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-10 mt-2 mb-3" v-if="$store.state.cart.length != 0">
                <button class="btn btn-primary btn-sm float-end" @click="solicitarDatos" type="button">Realizar compra</button>
            </div>
        </div>
        <div ref="exampleModal" class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="submitForm()">
                        <loading-component :show="loading">
                            <div class="modal-header">
                                <h5 class="modal-title"></h5>
                                <button type="button" class="btn-close" @click="closeModal()"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="direccion" class="form-label">Direccion</label>
                                    <input type="text" v-model="direccion.direccion" class="form-control" id="direccion" placeholder="Direccion" max="150" required>
                                </div>
                                <div class="mb-3">
                                    <label for="name" class="form-label">Quien Recibe</label>
                                    <input type="text" v-model="direccion.name" class="form-control" id="name" placeholder="Quien Recibe" max="50" required>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-sm" @click="closeModal()">Volver</button>
                                <button class="btn btn-primary btn-sm" type="submit">Realizar compra</button>
                            </div>
                        </loading-component>
                    </form>
                </div>
            </div>
        </div>
    </loading-component>
</template>

<script>

import LoadingComponent from '../../components/LoadingComponent';

/* eslint-disable*/

export default {
    name: 'CartView',
    components: {
        LoadingComponent,
    },
    data: function () {
        return {
            loading: false,
            modal: null,
            direccion:{}
        }
    },
    methods: {
        async getCart(){
            this.loading = true;
            
            let response = await this.$store.dispatch('getDatos');
            if(response){
                this.loading = false;
            }
        },
        editCart(product, amount){
            this.loading = true;
            let data = {
                product_id: product.product_id,
                amount: amount
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
            }).finally(async () => {
                let response = await vm.$store.dispatch('getDatos');
                if(response){
                    vm.loading = false;
                }
            });
        },
        totalFinal(){
            let total_final = 0;
            this.$store.state.cart.forEach((item) => {
                total_final += item.price * item.amount;
            });

            return total_final;
        },
        solicitarDatos(){
            this.modal.show();
        },
        closeModal(){
            this.modal.hide();
            this.$emit("closeModal");
        },
        submitForm(){
            this.loading = true;
            let vm = this;

            this.$axios.post('/finish_cart').then(function (response) {
                if(response.data?.success){
                    let message = response.data.message;
                    vm.$toasted.global.r_success({
                        message : message
                    });
                    vm.closeModal();
                    vm.direccion = {};
                }
            }).catch(function (error) {
                if(error?.response?.data?.data){
                    let message = error.response.data.data;
                    vm.$toasted.global.r_error({
                        message : message
                    });
                }
            }).finally(async () => {
                let response = await vm.$store.dispatch('getDatos');
                if(response){
                    vm.loading = false;
                }
            });
        }
    },
    mounted(){
        this.getCart();
        this.modal = new bootstrap.Modal(this.$refs.exampleModal, {backdrop: 'static'});
    }
}
</script>

<style>

</style>