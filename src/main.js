import { createApp } from 'vue'
import App from './App.vue'

//agregamos axios y las configuraciones de default
require("./logic/http-common.js");
//notificaciones
require("./logic/notify.js");

//agregamos las rutas de la app
import router from './logic/router'

//filtros
require("./logic/filters");

//vuex
import store from './store'

createApp(App).use(router).use(store).mount('#app')
