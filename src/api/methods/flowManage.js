import httpReq from '../http'

// 流程管理
const flowManage = {
  // 获取表单分类列表
  GetFormTypeFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetFormType'
    return httpReq(url, 'get', params);
  },
  // 获取流程分类列表
  GetFlowTypeFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetFlowType'
    return httpReq(url, 'get', params);
  },
  // 获取流程列表
  GetListFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetList'
    return httpReq(url, 'get', params);
  },
  // 获取流程合计节点
  GetByFlowIdFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetByFlowId'
    return httpReq(url, 'get', params);
  },
  // 根据表单数据获取流程设计所有节点
  GetByFormDataFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetByFormData'
    return httpReq(url, 'post', params);
  },
  // 新增
  AddFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/Add'
    return httpReq(url, 'post', params);
  },
  // 编辑
  UpdateFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/Update'
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/Delete'
    return httpReq(url, 'post', params);
  }
  ,
  // 作废
  UpdateScrapFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/UpdateScrap'
    return httpReq(url, 'post', params);
  },
  // 根据id获取是否可以代他人提交
  GetBehalfByIdFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetBehalfById'
    return httpReq(url, 'get', params);
  },
  // 保存草稿
  AddDraftFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/AddDraft'
    return httpReq(url, 'post', params);
  },
  // 获取个人所有草稿列表
  GetDraftRecordsDraftFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetDraftRecords'
    return httpReq(url, 'get', params);
  },
  // 获取草稿
  GetDraftRecordFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetDraftRecord'
    return httpReq(url, 'get', params);
  },
  // 删除草稿
  DeleteDraftRecordFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/DeleteDraftRecord'
    return httpReq(url, 'post', params);
  },
  // 保存流程
  AddStepFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/AddStep'
    return httpReq(url, 'post', params);
  },
  // 删除流程
  DelStepFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/DelStep'
    return httpReq(url, 'post', params);
  },
  // 获取流程
  GetStepRecordFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetStepRecord'
    return httpReq(url, 'get', params);
  },
  // 根据id获取是否可以更改流程时间
  GetUpdateFormById: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetUpdateFormById'
    return httpReq(url, 'get', params);
  },
  // 获取流程条件列表
  GetFlowConditionDict: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetFlowConditionDict'
    return httpReq(url, 'get', params);
  },
  // 获取发文或收文流程  30发文  40收文
  GetBySimplifyFlowManage: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetBySimplify'
    return httpReq(url, 'get', params);
  },

  // 根据ids 获取主管和分管领导
  GetUsersLeader: function (params) {
    let url = '/api/ERPWeb/DataBase/GetUsersLeader'
    return httpReq(url, 'post', params);
  },

  // 获取流程配置
  GetFlowConfigByFlowId: function (params) {
    let url = '/api/ERPWeb/FlowManage/GetFlowConfigByFlowId'
    return httpReq(url, 'get', params);
  },
}

// 流程记录
const FlowRecord = {
  // 发起流程
  AddFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/Add'
    return httpReq(url, 'post', params);
  },
  // 发起流程
  StartFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/Start'
    return httpReq(url, 'post', params);
  },
  // 流程通过后再抄送
  FlowCopyFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/FlowCopy'
    return httpReq(url, 'post', params);
  },
  // 获取全部
  getListFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetList'
    return httpReq(url, 'post', params);
  },
  // 待处理
  getWaitFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetWait'
    return httpReq(url, 'post', params);
  },
  // 已处理
  getFinishFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetFinish'
    return httpReq(url, 'post', params);
  },
  // 已发起
  getSubmitFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetSubmit'
    return httpReq(url, 'post', params);
  },
  // 已抄送
  GetMyMarkFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetMyMark'
    return httpReq(url, 'post', params);
  },
  // 我的标记
  GetCopyFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetCopy'
    return httpReq(url, 'post', params);
  },
  // 新增或编辑流程标记
  AddFormMarkCopyFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/AddFormMarkCopy'
    return httpReq(url, 'post', params);
  },
  // 取消流程标记
  DelFormMarkCopyFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/DelFormMarkCopy'
    return httpReq(url, 'post', params);
  },
  // 抄送阅读
  ReadCopyFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/ReadCopy'
    return httpReq(url, 'post', params);
  },
  // 抄送全部已读
  ReadAllCopyFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/ReadAllCopy'
    return httpReq(url, 'get', params);
  },
  // 获取审批进度
  GetFlowStepFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetFlowStep'
    return httpReq(url, 'get', params);
  },
  // 审核
  checkFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/Check'
    return httpReq(url, 'post', params);
  },
  // 撤销
  CancelFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/Cancel'
    return httpReq(url, 'post', params);
  },
  // 获取可退回节点
  GetBackStepFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/GetBackStep'
    return httpReq(url, 'get', params);
  },
  // 退回再次提交 
  BackCommitFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/BackCommit'
    return httpReq(url, 'post', params);
  },
  // 催办
  RushFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/Rush'
    return httpReq(url, 'post', params);
  },
  // 修改流程节点时间 
  UpdateCheckDate: function (params) {
    let url = '/api/ERPWeb/FlowRecord/UpdateCheckDate'
    return httpReq(url, 'post', params);
  },
  // 移除流程
  FlowRemoveFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/FlowRemove'
    return httpReq(url, 'post', params);
  },
  // 删除流程
  FlowDeleteFlowRecord: function (params) {
    let url = '/api/ERPWeb/FlowRecord/FlowDelete'
    return httpReq(url, 'post', params);
  },
}

// 流程评论
const FlowComment = {
  // 获取流程节点下的评论
  GetByStepIdFlowComment: function (params) {
    let url = '/api/ERPWeb/FlowComment/GetByStepId'
    return httpReq(url, 'get', params);
  },
  // 添加评论
  AddFlowComment: function (params) {
    let url = '/api/ERPWeb/FlowComment/Add'
    return httpReq(url, 'post', params);
  },
   // 根据id删除评论
   DeleteFlowComment: function (params) {
    let url = '/api/ERPWeb/FlowComment/Delete'
    return httpReq(url, 'post', params);
  },
}
// 流程表单字段
const FlowFieid= {
  // 获取配置流程表单字段
  getConFlowFieid: function (params) {
    let url = '/api/ERPWeb/FlowFieid/getConFlowFieid'
    return httpReq(url, 'get', params);
  },
  // 获取流程表单字段
  GetFlowFieid: function (params) {
    let url = '/api/ERPWeb/FlowFieid/GetFlowFieid'
    return httpReq(url, 'get', params);
  },
   // 新增流程表单字段
   AddFlowFieid: function (params) {
    let url = '/api/ERPWeb/FlowFieid/Add'
    return httpReq(url, 'post', params);
  },
}

// 流程管理
const FlowManage = {
  ...flowManage,
  ...FlowRecord,
  ...FlowComment,
  ...FlowFieid
}

/// 流程管理
export default FlowManage

