import httpReq from "../http";

// 登录，权限相关
const Auth = {
  // 登录
  // userLogin: function (params) {
  //   let url = '/api/ERPWeb/Auth/GetToken';
  //   return httpReq(url, 'get', params);
  // },
  // 服务方鉴权
  QueryTokenAuth: function (params) {
    let url = '/api/ERPWeb/Auth/QueryToken';
    return httpReq(url, 'post', params);
  },
  // 登录
  updateLogin: function (params) {
    let url = '/api/ERPWeb/Auth/UpdateLogin';
    return httpReq(url, 'get', params);
  },
  // 更新token
  updateToken: function (params) {
    let url = '/api/ERPWeb/Auth/UpdateToken';
    return httpReq(url, 'get', params);
  },
  // 获取用户信息
  getUserInfo: function(params) {
    let url = 'api/ERPWeb/EmployeeManage/GetCurrentUser';
    return httpReq(url, 'get', params);
  },
  //获取轮播图
  getBackgroundImages: function(params) {
    let url = '/api/ERPWeb/Auth/GetLoginPages';
    return httpReq(url, 'get', params);
  },
}

export default Auth
