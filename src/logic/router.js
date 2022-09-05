import { createApp } from 'vue'
import App from '../App.vue'

const app = createApp(App)

import VueRouter from 'vue-router';
import axios from 'axios'

//vuex
import store from '../store'

import authenticated from './middleware/authenticated';
import unauthenticated from './middleware/unauthenticated';
import admin from './middleware/admin';
import comunidad from './middleware/comunidad';

import LoginView from '../pages/LoginView'
import RegisterView from '../pages/RegisterView'
import NavComponent from '../components/system/NavComponent'
import DashboardView from '../pages/system/DashboardView'
import CartView from '../pages/system/CartView'

import NavAdminComponent from '../components/system/NavAdminComponent'
import DashboardAdminView from '../pages/system/DashboardAdminView'

import ErrorCuatroCeroCuatro from '../components/ErrorCuatroCeroCuatro'

app.use(VueRouter);

let auth = window.localStorage.getItem('auth-granados');
let user = JSON.parse(window.localStorage.getItem('user-granados'));

const router =  new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: () => { return auth && user ? user.is_admin ? { name: 'admin_dashboard' } : 'dashboard' : 'login' },
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {
                middleware: [unauthenticated],
            },
        },
        {
            path: '/logout',
            name: 'logout',
            beforeEnter: async (to, from, next) => {
                window.localStorage.removeItem('auth-granados');
                window.localStorage.removeItem('user-granados');
                delete axios.defaults.headers.common["Authorization"];

                let response = await store.dispatch('setCart', []);
                if(response){
                    return next({
                        name: 'login'
                    })
                }
            },
            meta: {
                middleware: [authenticated],
            },
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: {
                middleware: [unauthenticated],
            },
        },
        {
            path: '/admin/',
            component: NavAdminComponent,
            children: [
                { 
                    path: 'dashboard', 
                    name: 'admin_dashboard',
                    component: DashboardAdminView,
                    meta: {
                        // Hint: try to switch those two around to see
                        // how this affects execution of the callbacks.
                        middleware: [authenticated, admin]
                    }
                }
            ]
        },
        {
            path: '/',
            component: NavComponent,
            children: [
                {
                    path: '/cart',
                    name: 'cart',
                    component: CartView,
                    meta: { middleware: [authenticated, comunidad] }
                },
                { 
                    path: '/dashboard', 
                    name: 'dashboard',
                    component: DashboardView,
                    meta: {
                        // Hint: try to switch those two around to see
                        // how this affects execution of the callbacks.
                        middleware: [authenticated, comunidad]
                    }
                }
            ]
        },
        {
            path: '/*',
            name: 'a',
            component: ErrorCuatroCeroCuatro,
        }
    ]
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
        ? to.meta.middleware
        : [to.meta.middleware];

    const context = {
        from,
        next,
        router,
        to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
    }

    return next();
});

export default router;