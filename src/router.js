import Vue from 'vue'
import Router from 'vue-router'
import Inicio from './views/Inicio.vue'
import VistaGeneral from './views/VistaGeneral.vue'
import Login from './views/Login.vue'
import store from '@/store'
import Tablas from './views/Tablas.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
     {
       path: '/',
       name: 'inicio',
       component: Inicio,
       meta: {
         autenticacion: true
       }
     },
     {
      path: '/vistaGeneral',
      name: 'vistaGeneral',
      component: VistaGeneral,
      meta: {
        autenticacion: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/tablas',
      name: 'tablas',
      component: Tablas,
      meta: {
        autenticacion: true
      }
    }
    ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.autenticacion)) {
    if (store.state.usuario) {
      next();
    }else{
      next({name: 'login'});
    }
  }else{
    next();
  }
})

export default router
