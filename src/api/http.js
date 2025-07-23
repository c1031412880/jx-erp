// import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
// import baseUrl from '@/api/config'
// import baseUrl from '../../static/js/httpConfig'
import {Message, MessageBox} from 'element-ui'
import {getSession, getUser, removeToken, removeUser, removeRoleIds, removeSession} from '@/utils/auth'
// import {removeToken, removeUser, removeRoleIds, removeSession} from './auth'
import store from '../store'
import router from '../router'

import ApiImplement from "./ApiImplement/index";

const testingHelp = new ApiImplement()
let  isFirstLogOut = true  //是否是第一次登出
let sourceType = '' //接口来源
let urlType = '' // 接口类型
let TenantId=  window.newHttpConfig ? window.newHttpConfig.TenantId : '447668493877317'
axios.defaults.timeout = 2 * 60 * 1000
axios.defaults.baseURL = window.newHttpConfig ? window.newHttpConfig.URL_EASYMOCK : ''
const SERVER_ID = window.newHttpConfig ? window.newHttpConfig.SERVER_ID : '60.191.59.11'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // return
    // const token = store.state.user.token
    // console.log(getSession())
    const token = getSession()

    config.headers = {
      'Access-Control-Allow-Origin':'*',
      'Authorization': token,
      'TenantId': TenantId,
      // "Access-Control-Allow-Headers":"Authorization,Origin, X-Requested-With, Content-Type, Accept"
    }
    if (urlType == 'login') {
      config.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8"
      config.data = qs.stringify(config.data)
    }
    // 序列化get请求传数组方式
    if (config.method === 'get') {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    // console.log('请求参数',config);
    
    return config
  },error => {
    return Promise.reject(err)
  }
)

// 响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
      // const res = response.data + '';
    const statusCode = response.status + '';
    
    if (statusCode != '200') {
      return Promise.reject('error')
    } else {
      if(!!response.data.head && response.data.head.result == '401') {
        
        // return Promise.reject('error')
        if(isFirstLogOut) {
          isFirstLogOut = false
          MessageBox.confirm(
            '登录已过期,请重新登陆',
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
              // 如果是中台免登的  退回中台
              if (JSON.parse(localStorage.getItem('FreeLogin'))) {
                let url = localStorage.getItem('centerUrl')
                window.location.href = url
              } else {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              }
            })
          })
        }
        
      }else{
        return response
      }
    }
  }, err => {
    console.log('连接到服务器失败'+JSON.stringify(err));
    if (sourceType != 'center' && err.response.status != 400) {
      Message.error({
        'message':'服务器开小差了，请稍后重试',
        'showClose':true,
        'customClass': 'pop-class-error',
        'duration': 3000
      })
    }
    return Promise.reject(err.response)

    if (err && err.response) {
      switch (err.response.status) {
        case 300:
            Message.error({
              'message': err.response.statusText,
              'showClose':true,
              'customClass': 'pop-class-error',
              'duration': 3000
            })
          break;
        case 400:
            Message.error({
              'message': err.response.statusText,
              'showClose':true,
              'customClass': 'pop-class-error',
              'duration': 3000
            })
          break;
        case 401:
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
          break;
        case 403:
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
          break;
        case 404:
          Message.error({
            'message': err.response.statusText,
            'showClose':true,
            'customClass': 'pop-class-error',
            'duration': 3000
          })
          console.log('请求错误,未找到该资源')
          break;
        case 405:
          console.log('请求方法未允许')
          break;
        case 408:
          console.log('请求超时')
          break;
        case 400:
          Message.error({
            'message': err.response.statusText,
            'showClose':true,
            'customClass': 'pop-class-error',
            'duration': 3000
          })
          console.log(JSON.stringify(err.response));
        break;
        case 500:
          Message.error({
            'message': err.response.statusText,
            'showClose':true,
            'customClass': 'pop-class-error',
            'duration': 3000
          })
          console.log('服务器端出错')
          break;
        case 501:
          console.log('网络未实现')
          break;
        case 502:
          console.log('网络错误')
          break;
        case 503:
          console.log('服务不可用')
          break;
        case 504:
          console.log('网络超时')
          break;
        case 505:
          console.log('http版本不支持该请求')
          break;
        default:
          console.log(`连接错误${JSON.stringify(err.response)}`)
      }
      console.log(`连接错误${JSON.stringify(err)}`)
    } else {
      console.log('连接到服务器失败'+JSON.stringify(err));
    }
    return Promise.reject(err.response)
})


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }


 /**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function postFile(url,data = {}) {
   let config = {
    headers: {'Content-Type': 'multipart/form-data'}
   }

   return new Promise((resolve,reject) => {
     axios.post(url,data,config)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err);
        })
   })
 }



 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function deleteData(url, params = {}){
  return new Promise((resolve,reject) => {
    axios.delete(url,{params:params})
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}


 /**
 * 统一封装请求数据方式
 * @param url 地址
 * @param method 请求方式
 * @param params 参数
 * @param source 来源  比如 中台
 * @returns {Promise}
 */

 const httpReq = (url = '',method = 'get',params, source,type) => {
  if (!testingHelp.testingApi(url)) {
    return new Promise((resolve,reject) => {
      reject({
        err: '不能重复请求'
      })
    })
  }
  const reqMode = method.toLowerCase();

  if(reqMode != 'postfile' && !source) {
    if(params == undefined) {
      var params = {};
    }
    params.server_id = SERVER_ID;
  }

  if (source == 'center') {
    sourceType = 'center'
    axios.defaults.baseURL = window.newHttpConfig.login_url
  } else if(source == 'lost') {
    sourceType = 'lost'
    axios.defaults.baseURL = 'https://erp.jiaxingbus.com'
  } else {
    sourceType = ''
    axios.defaults.baseURL = window.newHttpConfig ? window.newHttpConfig.URL_EASYMOCK : ''
  }
  urlType = type

  switch(reqMode) {
    case 'get':
      return fetch(url,params);
      break;
    case 'post':
      return post(url,params);
      break;
    case 'delete':
      return deleteData(url,params);
      break;
    case 'patch':
      return patch(url,params);
      break;
    case 'put':
      return put(url,params);
      break;
    case 'postfile':
      params.append("menu_code", router.history.current.meta.code);
      params.append("server_id", SERVER_ID);
      return postFile(url,params);
      break;
  }
}

export default httpReq
