import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import recommend from '../views/recommend.vue'
import songListDetail from '../views/songListDetail'

Vue.use(VueRouter)

const routes = [{
    path: '/home',
    name: 'home',
    component: home,
    children: [{
        path: 'recommend',
        name: 'recommend',
        component: recommend
    }]
}, {
    path: '/login',
    name: 'login',
    component: login
}, {
    path: '/songListDetail',
    name: 'songListDetail',
    component: songListDetail
}]

const router = new VueRouter({
    routes
})

export default router
