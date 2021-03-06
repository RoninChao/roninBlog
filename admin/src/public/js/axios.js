import Vue from 'vue'
import Axios from 'axios'
import router from '@/router/router'
import jsCookie from 'js-cookie'

// 公共axios配置
const config = {
    baseURL:'http://localhost:3000/api/admin',
    timeout:5000,
    headers:{
        "Content-type": "application/json; charset=utf-8"
    }
}
//创建一个axios实例
const instance = Axios.create(config)
//请求拦截器
instance.interceptors.request.use(
    config => {
        //发送token
        if(jsCookie.get('mToken')){
            config.headers.Authriozation = 'Bearer:'+ jsCookie.get('mToken')
        }
        console.log(config)
        return config;
    }, 
    err => {
        return Promise.reject(err)
    }
)
// 响应拦截器
instance.interceptors.response.use(
    res => {
        return res;
    },
    err => {
        // 对于要登录的状态码统一设置为401
        if(err.response.status === 401){
            router.push('/loginAdmin')
        }
        Vue.prototype.$message(err.response.data.message)
        return Promise.reject(err)
    }
)
export default{
    instance
}