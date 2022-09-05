<template>
    <loading-component :show="loading">
      <div class="col-12 d-flex justify-content-center row">
        <div class="card mt-5 mb-3" style="max-width: 540px;">
          <img src="./../assets/login.png" class="rounded mx-auto d-block card-img-top mt-4" style="max-width: 100px;" alt="...">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-center">Login</h5>
            <form @submit.prevent="loginForm()">
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
              <button type="submit" class="btn btn-primary btn-sm">Ingresar</button>
            </form>
            <p class="card-text"><small class="text-muted">No tienes una cuenta? <a href="javascript:void(0)" @click="$router.push('/register')">Registrarse</a></small></p>
          </div>
        </div>
      </div>
    </loading-component>
</template>

<script>
import LoadingComponent from '../components/LoadingComponent';

export default {
  name: 'LoginView',
  components: {
    LoadingComponent
  },
  data: function () {
    return {
      loading: false,
      errors: {},
      user: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    loginForm(){
      this.loading = true;
      this.errors = {};
      let data = {
        'email': this.user.email,
        'password': this.user.password
      };
      let vm = this;
      this.$axios.post('/login', data).then(function (response) {
        if(response.data?.success){
          //descomentar solo si quieres que el usuario ingrese en cuando sea registrado
          localStorage.setItem('auth-granados', response.data.data.token);
          localStorage.setItem('user-granados', JSON.stringify(response.data.data.user));
          vm.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data.token;
          let message = response.data.message+' '+response.data.data.user.name;
          vm.$toasted.global.r_success({
            message : message
          });

          if(response.data.data.user.is_admin){
            vm.$router.push({ name: 'admin_dashboard' });
          }else{
            vm.$nextTick(() => {
              vm.$router.push({ name: 'dashboard' });
            });
          }
        }
      }).catch(function (error) {
        console.log(error);
        if(error.response?.data?.message){
          if(error.response?.data?.data?.error){
            vm.$toasted.global.r_error({
              message : error.response?.data?.data?.error
            });
          }else{
            vm.errors = error.response.data.data;
          }
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