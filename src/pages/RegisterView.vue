<template>
  <loading-component :show="loading">
    <div class="col-12 d-flex justify-content-center row">
      <div class="card mt-5 mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="./../assets/user-300x300.png" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">Registro</h5>
              <form @submit.prevent="registerForm()" class="mt-4">
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombres</label>
                  <input type="text" v-model="user.name" class="form-control" id="nombre" placeholder="Aldo Daniel" required>
                </div>
                <p v-for="error in errors.name" :key="error" class="text-danger">{{ error }}</p>
                <div class="mb-3">
                  <label for="apellidos" class="form-label">Apellidos</label>
                  <input type="text" v-model="user.lastname" class="form-control" id="apellidos" placeholder="Granados Martinez" required>
                </div>
                <p v-for="error in errors.lastname" :key="error" class="text-danger">{{ error }}</p>
                <div class="mb-3">
                  <label for="email" class="form-label">Correo Electronico</label>
                  <input type="email" v-model="user.email" class="form-control" id="email" placeholder="al221410556@gmail.com" required>
                </div>
                <p v-for="error in errors.email" :key="error" class="text-danger">{{ error }}</p>
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input type="password" v-model="user.password" class="form-control" id="password" placeholder="********" required>
                </div>
                <p v-for="error in errors.password" :key="error" class="text-danger">{{ error }}</p>
                <button type="submit" class="btn btn-primary btn-sm">Registrarse</button>
              </form>
              <p class="card-text"><small class="text-muted">Ya tienes una cuenta? <a href="javascript:void(0)" @click="$router.push('/login')">Ingresar</a></small></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </loading-component>
</template>

<script>
import LoadingComponent from '../components/LoadingComponent';

export default {
  name: 'RegisterView',
  components: {
    LoadingComponent
  },
  data: function () {
    return {
      loading: false,
      errors: {},
      user: {
        name: null,
        lastname: null,
        email: null,
        password: null
      }
    }
  },
  methods: {
    cleanUser(){
      this.user = {
        name: null,
        lastname: null,
        email: null,
        password: null
      }
    },
    registerForm(){
      this.loading = true;
      this.errors = {};

      let vm = this;
      this.$axios.post('/register', this.user).then(function (response) {
        if(response.data?.success){
          //descomentar solo si quieres que el usuario ingrese en cuando sea registrado
          //localStorage.setItem('auth-granados', response.data.data.token);
          let message = response.data.message+' '+response.data.data.name;
          vm.$toasted.global.r_success({
            message : message
          });
          vm.$router.push('/login')
        }
      }).catch(function (error) {
        if(error.response?.data?.message){
          vm.errors = error.response.data.data;
        }
      }).finally(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped>
</style>