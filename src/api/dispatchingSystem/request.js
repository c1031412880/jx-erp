import axios from 'axios'
import qs from 'qs'
// axios 配置
const serviceERP = axios.create({
  baseURL: window.dispatch_system.dispatch_url, // api 的 base_url
  timeout: 60000 * 5, // 请求超时时间
})

// http request 拦截器
serviceERP.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8"
    config.data = qs.stringify(config.data)
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

serviceERP.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

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

export function post(url, params = {}) {
  return new Promise((resolve,reject) => {
    serviceERP.post(url, params)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

const httpReq = (url,  method = 'post', params) => {
  const reqMode = method.toLowerCase();
  switch(reqMode) {
    case 'get':
      return fetch(url, params);
      break;
    case 'post':
      return post(url, params);
      break;
  }
}

export default httpReq
