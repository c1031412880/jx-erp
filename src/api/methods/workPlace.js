import httpReq from "../http";

// 消息通知
const MessageCenter = {
  // 查询消息
  ListMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/List';
    return httpReq(url, 'post', params);
  },
  // 阅读消息
  ReadMessageMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/ReadMessage';
    return httpReq(url, 'post', params);
  },
  // 删除消息
  DeleteMessageMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/DeleteMessage';
    return httpReq(url, 'post', params);
  },
  // 全部已读
  ReadAllMessageMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/ReadAllMessage';
    return httpReq(url, 'get', params);
  },
  // 一键清空消息
  EmptyAllMessageMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/EmptyAllMessage';
    return httpReq(url, 'post', params);
  },
  // 查询应急消息(综合服务平台关联消息)
  DsMessageListMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/DsMessageList';
    return httpReq(url, 'get', params);
  },
  // 查看应急消息详情
  DSMessageDetailMessageCenter: function (params) {
    let url = '/api/ERPWeb/MessageCenter/DSMessageDetail';
    return httpReq(url, 'get', params);
  },
}

const DownloadCenter = {
  // 获取文件列表
  GetListDownloadCenter: function (params) {
    let url = '/api/ERPWeb/DownloadCenter/GetList';
    return httpReq(url, 'post', params);
  },
  // 上传文件
  CreateDownloadCenter: function (params) {
    let url = '/api/ERPWeb/DownloadCenter/Create';
    return httpReq(url, 'post', params);
  },
  // 批量删除
  DeleteDownloadCenter: function (params) {
    let url = '/api/ERPWeb/DownloadCenter/Delete';
    return httpReq(url, 'post', params);
  },
}

// 工作台首页
const WorkPlaceHome = {
  // 获取工作台顶部汇总
  GetTopInfoSummaryWorkPlace: function (params) {
    let url = '/api/ERPWeb/WorkPlace/GetTopInfoSummary';
    return httpReq(url, 'get', params);
  },
}

// 导入导出
const ImportExport = {
  GetImportExport: function (params) {
    let url = '/api/ERPWeb/ImportExport/GetByPage'
    return httpReq(url, 'post', params);
  },
}

// 在线人数
const OnLineUser = {
  GetListOnLineUser: function (params) {
    let url = '/api/ERPWeb/OnLineUser/GetList'
    return httpReq(url, 'post', params);
  },
}
// 首页模块（dataBase）
const HomePage = {
  // 维修分析
  GetMaintainData: function (params) {
    let url = '/api/ERPWeb/HomePage/GetMaintainData'
    return httpReq(url, 'post', params);
  },
  // 服务分析
  GetServiceData: function (params) {
    let url = '/api/ERPWeb/HomePage/GetServiceData'
    return httpReq(url, 'post', params);
  },
  // 企业管理
  GetApprovalData: function (params) {
    let url = '/api/ERPWeb/HomePage/GetApprovalData'
    return httpReq(url, 'get', params);
  },
  // 集团资源
  GetBusData: function (params) {
    let url = '/api/ERPWeb/HomePage/GetBusData'
    return httpReq(url, 'get', params);
  },
  // 营收分析
  GetKeLiu: function (params) {
    let url = '/api/ERPWeb/HomePage/GetKeLiu'
    return httpReq(url, 'get', params);
  },
  // 机务分析
  GetVehicleEnergy: function (params) {
    let url = '/api/ERPWeb/AccidentManage/GetVehicleEnergy'
    return httpReq(url, 'get', params);
  },
  // 维修材料费分析
  GetMaterialFee: function (params) {
    let url = '/api/ERPWeb/AccidentManage/GetMaterialFee'
    return httpReq(url, 'get', params);
  },
  // 材料使用排名
  GetMateriarStatistic: function (params) {
    let url = '/api/ERPWeb/AccidentManage/GetMateriarStatistic'
    return httpReq(url, 'get', params);
  },
}


// 工作台
const WorkPlace = {
  ...MessageCenter,
  ...DownloadCenter,
  ...WorkPlaceHome,
  ...ImportExport,
  ...OnLineUser,
  ...HomePage,
}


export default WorkPlace
