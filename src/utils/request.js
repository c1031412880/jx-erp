import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import {removeToken, removeUser, removeRoleIds, removeSession} from './auth'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 50000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.error_code) {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.error_code === '50008' || res.error_code === '50012' || res.error_code === '50014'|| res.error_code === '50009') {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            try {
              removeToken()
              removeUser()
              removeRoleIds()
              removeSession()
            } catch (error) {
              console.log(error)
            }
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
