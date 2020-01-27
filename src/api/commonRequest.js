import request from './request'
export default function commonRequest (api, params = {}, type = 'post') {
    // console.log(JSON.stringify(params))
    return request({
        url: api,
        methods: type,
        params
    })
}
