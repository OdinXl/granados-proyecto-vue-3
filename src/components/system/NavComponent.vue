<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="javascript:void(0)">Bienvenido: {{ auth.name }} {{ auth.lastname }}</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/dashboard" class="nav-link">Inicio</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/cart" class="nav-link">Carrito</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/logout" class="nav-link">Salir</router-link>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
        <router-view></router-view>
    </div>    
</template>

<script>
export default {
  name: 'NavComponent',
  data: function () {
    return {
        auth:{
            name: null,
            lastname: null
        }
    }
  },
  methods: {
    getDataUser(){
        this.auth = JSON.parse(window.localStorage.getItem('user-granados'));
    }
  },
  mounted(){
    this.getDataUser();
  }
}
</script>

<style scoped>
</style>