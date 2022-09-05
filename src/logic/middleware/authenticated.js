import { createApp } from 'vue'
import App from '../../App.vue'

const app = createApp(App)

//notificaciones
require("../notify.js");

export default function authenticated({ next, router }) {
  if (!window.localStorage.getItem('auth-granados') || !window.localStorage.getItem('user-granados')) {
    app.toasted.global.r_error({
      message : 'Debe estar logueado'
    });
    return router.push({ name: 'login' });
  }
  return next();
}