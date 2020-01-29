import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import recommend from '../views/recommend.vue'
import songListDetail from '../views/songListDetail'
import singer from '../views/singer'
import rank from '../views/rank'
import singerDetail from '../views/singerDetail'
import search from '../views/search'

Vue.use(VueRouter)

const routes = [{
    path: '/home',
    name: 'home',
    component: home,
    children: [{
        path: '/',
        name: 'recommend',
        component: recommend
    }, {
        path: 'singer',
        name: 'singer',
        component: singer
    }, {
        path: 'rank',
        name: 'rank',
        component: rank
    }]
}, {
    path: '/login',
    name: 'login',
    component: login
}, {
    path: '/songListDetail',
    name: 'songListDetail',
    component: songListDetail
}, {
    path: '/singerDetail',
    name: 'singerDetail',
    component: singerDetail
}, {
    path: '/search',
    name: 'search',
    component: search
}]

const router = new VueRouter({
    routes
})

export default router
