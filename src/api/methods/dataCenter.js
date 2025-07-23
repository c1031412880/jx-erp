import httpReq from "../http";

// 中台接口
const dataCenter = {
  // 中台统一登陆接口 
  userLogin: function (params) {
    let url = '/connect/token';
    return httpReq(url, 'post', params,'center','login');
  },

  // 中台统一路由菜单接口 
  getMunePermission: function (params) {
    let url = '/api/sass/user/permission';
    return httpReq(url, 'get', params,'center');
  },

  // 中台统一 修改密码
  changePwd: function (params) {
    let url = '/api/sass/user/change-pwd';
    return httpReq(url, 'post', params,'center');
  },

  // 中台统一 修改人员信息（通讯录）
  changeUserInfo: function (params) {
    let url = '/api/sass/user/update-by-erp';
    return httpReq(url, 'post', params,'center');
  },

  // 中台统一 角色
  getRoleTree_center: function (params) {
    let url = '/api/sass/role/role-tree';
    return httpReq(url, 'get', params,'center');
  },

  // 中台统一 数据字典
  byDictKey_center: function (params) {
    let url = '/api/sass/dictionaryitem/by-dict-key';
    return httpReq(url, 'get', params,'center');
  },

  // 失物招领小程序上传
  uploadPicture_lost: function (params) {
    let url = '/api/ERPWeb/PartyHonor/UploadPicture';
    return httpReq(url, 'postFile', params, 'lost');
  },
}

export default dataCenter
