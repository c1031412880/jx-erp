import httpReq from "../http";

// 包车管理
const ChariotManage = {
  // 查询
  GetByPageChariotManage: function (params) {
    let url = '/api/ERPWeb/ChariotManage/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 包车分析 /api/ERPWeb/ServiceHomePage/getChariotAnalysis
  getChariotAnalysis: function (params) {
    let url = '/api/ERPWeb/ServiceHomePage/GetChariotAnalysis';
    return httpReq(url, 'get', params);
  },
 
  // 新增/ 编辑
  AddOrUpdateChariotReport: function (params) {
    let url = '/api/ERPWeb/ChariotManage/AddOrUpdateChariotReport';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteChariotReport: function (params) {
    let url = '/api/ERPWeb/ChariotManage/DeleteChariotReport';
    return httpReq(url, 'post', params);
  },
  // 导出
  // ExportChariotTotal: function (params) {
  //   let url = '/api/ERPWeb/ChariotManage/ExportChariotTotal';
  //   return httpReq(url, 'post', params);
  // },
  // 完结
  UpdateEndChariotManage: function (params) {
    let url = '/api/ERPWeb/ChariotManage/UpdateEnd';
    return httpReq(url, 'post', params);
  },

  // 统计
  GetByPageTotalChariotManage: function (params) {
    let url = '/api/ERPWeb/ChariotManage/GetByPageTotal';
    return httpReq(url, 'post', params);
  },
   // 统计导出
   ExportChariotTotal: function (params) {
    let url = '/api/ERPWeb/ChariotManage/ExportChariotTotal';
    return httpReq(url, 'post', params);
  },
  // 获取首页代办事项
  GetHomePageReminderChariotManage: function (params) {
    let url = '/api/ERPWeb/ChariotManage/GetHomePageReminder';
    return httpReq(url, 'get', params);
  },
}

// 工作台
const operation = {
  ...ChariotManage
}


export default operation
