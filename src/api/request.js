import axios from 'axios'
axios.defaults.withCredentials = true
const request = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})
export default request
