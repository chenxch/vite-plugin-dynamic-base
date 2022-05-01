// import './publicPath'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Basic from './views/Basic.vue'

const routes = [
  { path: '/', component: ()=> import('./views/Home.vue') },
  { path: '/about', component: ()=> import('./views/About.vue')  },
  {
    path: '/basic', component: Basic
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  // strict: true,
  // scrollBehavior: () => ({ left: 0, top: 0 }),
});

createApp(App).use(router).mount('#app')
