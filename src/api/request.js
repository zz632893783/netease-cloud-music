import axios from 'axios'
import router from '../router/index.js'
axios.defaults.withCredentials = true
const request = axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL: 'http://192.168.2.101:3000',
    // baseURL: 'http://47.104.65.136:3000',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})
request.interceptors.response.use(response => {
    return response
}, error => {
    switch (error.response.status) {
    case 301:
        alert('请重新登陆')
        router.push({
            path: '/login'
        })
        break
    }
    return Promise.reject(error)
})

export default request
