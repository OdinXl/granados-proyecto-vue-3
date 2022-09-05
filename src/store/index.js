import { createStore } from 'vuex'

import axios from 'axios'

export default createStore({
    state: {
        cart: []
    },
    mutations: {
        cambiarCart: (state, payload) => {
            if(payload){
                state.cart = payload;
            }
        }
    },
    actions: {
        setCart: ({ commit }, payload) => {
            return new Promise((resolve) => {
                commit("cambiarCart", payload)
                resolve(true);
            });
        },
        getDatos:({commit}) => {
            return new Promise((resolve) => {
                axios.get('/get_cart').then(function (response) {
                    resolve(response);
                    if(response.data?.success){
                        let datos = response.data.data.cart;
                        commit("cambiarCart", datos)
                    }
                });
            });
        }
    }
})