import axios from 'axios';
import { Base64 } from 'js-base64';

// 创建一个新的axios实例，专门用于请求大屏服务
const bigScreenService = axios.create({
  // 从全局配置中获取大屏服务的URL
  baseURL: window.big_screen_url,
  timeout: 300000, // 设置请求超时时间
});

// 请求拦截器
bigScreenService.interceptors.request.use(
  config => {
    // 统一设置Content-Type为JSON
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    
    // 如果需要token，可以在这里添加。
    // 暂时假设大屏接口也使用与ERP相同的token机制。
    // 注意：这里的 'Admin-Token' 和 store 结构需要根据ERP项目实际情况调整
    // if (store.getters.token) {
    //   config.headers['Admin-Token'] = store.getters.token;
    // }

    return config;
  },
  error => {
    // 请求错误处理
    console.error('Big Screen API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
bigScreenService.interceptors.response.use(
  response => {
    const res = response.data;
    // 这里可以根据大屏接口的实际返回格式，进行统一的数据处理或错误判断
    // 示例：如果返回的code不是0，则认为是错误
    // if (res.code !== 0) {
    //   console.error('Big Screen API Response Error:', res.message);
    //   return Promise.reject(new Error(res.message || 'Error'));
    // }
    return res;
  },
  error => {
    console.error('Big Screen API Response Error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * 封装用于调用大屏接口的 postJson 方法
 * @param {string} url - 接口路径，相对于baseURL
 * @param {object} params - 请求参数，会以JSON格式发送
 * @returns {Promise}
 */
export function postJsonToBigScreen(url, params = {}) {
  // 从大屏复制过来的逻辑可能需要对参数进行特殊处理，例如Base64编码
  // 这里我们假设参数需要转为JSON字符串后再进行Base64编码
  const reqData = params
  return bigScreenService.post(url, reqData);
} 