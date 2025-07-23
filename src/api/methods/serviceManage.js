import httpReq from '../http'

// 乘客服务管理
const PassengerServiceNew = {
  // 查询乘客服务记录
  PassengerServiceNewList: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/List'
    return httpReq(url, 'post', params)
  },
  // 查询乘客服务记录
  listPassengerServiceNew: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/List'
    return httpReq(url, 'post', params)
  },
  // 草稿
  DraftPassengerService: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/DraftPassengerService'
    return httpReq(url, 'post', params)
  },
  // 新增-------------new
  AddPassengerService: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/AddPassengerService'
    return httpReq(url, 'post', params)
  },
  // 编辑-------------new
  EditProcessPassengerServiceFlow: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/ProcessPassengerServiceFlow'
    return httpReq(url, 'post', params)
  },
  // 编辑
  EditPassengerService: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/EditPassengerService'
    return httpReq(url, 'post', params)
  },
  // 批量删除-------------new
  PassengerServiceNewBatchDelete: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导出new
  PassengerServiceNewExport: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/Export'
    return httpReq(url, 'post', params)
  },
  // 导入
  PassengerServiceNewImport: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/Import'
    return httpReq(url, 'post', params)
  },

  // 更新超时级别-------------new
  UpdateTimeOutRule: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/UpdateTimeOutRule'
    return httpReq(url, 'post', params)
  },
  // 获取超时级别new
  GetTimeOutRules: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetTimeOutRules'
    return httpReq(url, 'get', params)
  },

  // 更新部门经办人-------------new
  UpdatePassengerDeptDuty: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/UpdatePassengerDeptDuty'
    return httpReq(url, 'post', params)
  },
  // 获取部门经办人new
  GetPassengerDeptDuty: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetPassengerDeptDuty'
    return httpReq(url, 'get', params)
  },

  // 公共自行车乘客服务统计表
  // 更新
  UpdatePassengerBicycleTotal: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/UpdatePassengerBicycleTotal'
    return httpReq(url, 'post', params)
  },
  // 获取
  GetPassengerBicycleTotals: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetPassengerBicycleTotals'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportBicycle: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/ExportBicycle'
    return httpReq(url, 'post', params)
  },
  // 获取节假日休息日
  GetRestAndHolidays: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetRestAndHolidays'
    return httpReq(url, 'get', params)
  },
   // 新增编辑提醒规则-------------new
  AddOrUpdateRulePassengerServiceRule: function (params) {
    var url = '/api/ERPWeb/PassengerServiceRemindRule/AddOrUpdateRule'
    return httpReq(url, 'post', params)
  },
  // 删除提醒规则-------------new
  DeleteRulePassengerServiceRule: function (params) {
    var url = '/api/ERPWeb/PassengerServiceRemindRule/DeleteRule'
    return httpReq(url, 'post', params)
  },
  // 获取提醒规则-------------new
  GetListPassengerServiceRule: function (params) {
    var url = '/api/ERPWeb/PassengerServiceRemindRule/GetList'
    return httpReq(url, 'get', params)
  },
  // 获取回复模板-------------new
  GetReplyTemplateList: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetReplyTemplateList'
    return httpReq(url, 'get', params)
  },
  // 新增编辑回复模板-------------new
  SaveReplyTemplate: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/SaveReplyTemplate'
    return httpReq(url, 'post', params)
  },
  // 分页获取乘客服务列表-------------new
  GetPassengerServiceList: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetPassengerServiceList'
    return httpReq(url, 'post', params)
  },
  // 获取回复单
  GetPassengerServiceDocs: function (params) {
    var url = '/api/ERPWeb/PassengerServiceNew/GetPassengerServiceDocs'
    return httpReq(url, 'get', params)
  }
}
// 乘客投诉表扬统计
const PassengerServiceAnalysis = {
  // 获取乘客投诉表扬汇总
  GetPassengerServiceSummary: function (params) {
    var url = '/api/ERPWeb/PassengerServiceAnalysis/GetPassengerServiceSummary'
    return httpReq(url, 'get', params)
  },
  // 导出乘客投诉表扬记录
  exportPassengerServiceAnalysis: function (params) {
    var url = '/api/ERPWeb/PassengerServiceAnalysis/Export'
    return httpReq(url, 'get', params)
  },
  // 导出有责投诉明细
  exportDetailPassengerServiceAnalysis: function (params) {
    var url = '/api/ERPWeb/PassengerServiceAnalysis/ExportDetail'
    return httpReq(url, 'post', params)
  },
}
// 失误招领
const LostArticle = {
  // 查询失物招领记录
  getListLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/GetLostFoundByPage'

    return httpReq(url, 'post', params)
  },

  // 添加失物招领记录
  addLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/AddLostFound'

    return httpReq(url, 'post', params)
  },
  // 编辑失物招领记录
  editLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/UpdateLostFound'

    return httpReq(url, 'post', params)
  },

  // 删除失物招领记录
  DeleteLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/DeleteLostFound'

    return httpReq(url, 'post', params)
  },

  // 导出失物招领记录
  exportLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/ExportLostFound'

    return httpReq(url, 'post', params)
  },
  // 导入失物招领记录
  importLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/Import'

    return httpReq(url, 'post', params)
  },

  // 查询失物招领类型
  getListLostType: function (params) {
    var url = '/api/ERPWeb/LostFound/GetLostFoundTypeByPage'

    return httpReq(url, 'post', params)
  },

  // 添加失物招领类型
  addLostArticleType: function (params) {
    var url = '/api/ERPWeb/LostFound/AddLostFoundType'

    return httpReq(url, 'post', params)
  },
  // 编辑失物招领类型
  editLostArticleType: function (params) {
    var url = '/api/ERPWeb/LostFound/UpdateLostFoundType'

    return httpReq(url, 'post', params)
  },

  // 删除失物招领类型
  DeleteLostArticleType: function (params) {
    var url = '/api/ERPWeb/LostFound/DeleteLostFoundType'

    return httpReq(url, 'post', params)
  },

  // 认领
  lostClaimLostArticle: function (params) {
    var url = '/api/ERPWeb/LostFound/Claim'

    return httpReq(url, 'post', params)
  },

  // 批量发布
  BatchUpdatePublishState: function (params) {
    var url = '/api/ERPWeb/LostFound/BatchUpdatePublishState'

    return httpReq(url, 'post', params)
  }
}
// 驾驶员星级考核规则
const DriverStarRule = {
  // 查询考核规则
  ListDriverStarRule: function (params) {
    var url = '/api/ERPWeb/DriverStarRule/List'

    return httpReq(url, 'get', params)
  },
  // 添加/编辑考核规则
  AddRuleDriverStarRule: function (params) {
    var url = '/api/ERPWeb/DriverStarRule/AddRule'

    return httpReq(url, 'post', params)
  },
  // 删除考核规则
  DeleteRuleDriverStarRule: function (params) {
    var url = '/api/ERPWeb/DriverStarRule/DeleteRule'

    return httpReq(url, 'post', params)
  },
  // ****************新*************************
  // 获取升星规则
  GetDriverStarRule: function (params) {
    let url = '/api/ERPWeb/DriverStar/GetDriverStarRule'
    return httpReq(url, 'get', params)
  },
  // 新增编辑规则
  AddOrUpdateRule: function (params) {
    let url = '/api/ERPWeb/DriverStar/AddOrUpdateRule'
    return httpReq(url, 'post', params)
  },
  // 获取驾驶员星级月度排序
  DriverStarGetMonthSort: function (params) {
    let url = '/api/ERPWeb/DriverStar/GetMonthSort'
    return httpReq(url, 'post', params)
  }
}
// 驾驶员星级考核统计
const DriverStartSummary = {
  // 查询考核规则
  GetDriverStarSummaryDriverStartSummary: function (params) {
    var url = '/api/ERPWeb/DriverStartSummary/GetDriverStarSummary'

    return httpReq(url, 'post', params)
  },
  // 导出驾驶员星级考核记录
  ExportDriverStartSummary: function (params) {
    var url = '/api/ERPWeb/DriverStartSummary/Export'

    return httpReq(url, 'post', params)
  }
}
// 分公司绩效考核
const BranchCompanyPerformanceAssessment = {
  // 查询考核记录
  ListBranchCompanyPerformanceAssessment: function (params) {
    var url = '/api/ERPWeb/BranchCompanyPerformanceAssessment/List'

    return httpReq(url, 'post', params)
  },
  // 导出分公司绩效考核
  ExportBranchCompanyPerformanceAssessment: function (params) {
    var url = '/api/ERPWeb/BranchCompanyPerformanceAssessment/Export'

    return httpReq(url, 'post', params)
  }
}

// 新闻资讯
const InfoDocument = {
  // 分页获取模板
  GetInfoDocumentsInfoDocument: function (params) {
    var url = '/api/ERPWeb/InfoDocument/GetInfoDocuments'
    return httpReq(url, 'post', params)
  },
  //新增
  AddInfoDocumentInfoDocument: function (params) {
    var url = '/api/ERPWeb/InfoDocument/AddInfoDocument'
    return httpReq(url, 'post', params)
  },
  //编辑
  EditInfoDocumnetInfoDocument: function (params) {
    var url = '/api/ERPWeb/InfoDocument/EditInfoDocumnet'
    return httpReq(url, 'post', params)
  },
  //新增丽水
  AddLiShuiDocumentInfoDocument: function (params) {
    var url = '/api/ERPWeb/InfoDocument/AddLiShuiDocument'
    return httpReq(url, 'post', params)
  },
  //编辑丽水
  EditLiShuiDocumnetInfoDocument: function (params) {
    var url = '/api/ERPWeb/InfoDocument/EditLiShuiDocumnet'
    return httpReq(url, 'post', params)
  },
  //删除
  DeleteInfoDocumnetInfoDocument: function (params) {
    var url = '/api/ERPWeb/InfoDocument/DeleteInfoDocumnet'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员星级考核规则
const DriverStar = {
  // 新增编辑升星规则
  AddOrUpdateAssesRule: function (params) {
    var url = '/api/ERPWeb/DriverStar/AddOrUpdateAssesRule'
    return httpReq(url, 'post', params)
  },
  // 新增编辑降星规则
  AddOrUpdateDropRule: function (params) {
    var url = '/api/ERPWeb/DriverStar/AddOrUpdateDropRule'
    return httpReq(url, 'post', params)
  },
  // 获取升星规则
  GetAdvertPlatformsDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/GetAdvertPlatforms'
    return httpReq(url, 'get', params)
  },
  // 获取降星规则
  GetDriverStarDropRule: function (params) {
    var url = '/api/ERPWeb/DriverStar/GetDriverStarDropRule'
    return httpReq(url, 'get', params)
  },
  // 获取驾驶员星级情况
  GetRecordDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/GetRecord'
    return httpReq(url, 'post', params)
  },
  // 根据司机id获取星级变更记录
  GetChangeRecordDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/GetChangeRecord'
    return httpReq(url, 'get', params)
  },
  // 编辑驾驶员星级
  UpdateDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/UpdateDriverStar'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetDriverStarByPage: function (params) {
    var url = '/api/ERPWeb/DriverStar/GetDriverStarByPage'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportTotalDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/ExportTotal'
    return httpReq(url, 'post', params)
  },
  // 重新生成驾驶员星级评定
  CountDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/CountDriverStar'
    return httpReq(url, 'post', params)
  },
  // 更新驾驶员星级评定
  UpdateDriverStarJudge: function (params) {
    var url = '/api/ERPWeb/DriverStar/UpdateDriverStarJudge'
    return httpReq(url, 'post', params)
  },
  // 获取驾驶员星级评定
  GetByPageDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/DriverStarGetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出驾驶员星级评定
  ExportDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/Export'
    return httpReq(url, 'post', params)
  },
  // 提交驾驶员星级评定
  SetRecordDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 驾驶员星级评定详情
  LookDetailDriverStar: function (params) {
    var url = '/api/ERPWeb/DriverStar/LookDetail'
    return httpReq(url, 'get', params)
  },
  // ========== 先进驾驶员相关接口 ==========
  // 先进驾驶员导入
  ImportDriverAdvanced: function (params) {
    var url = '/api/ERPWeb/DriverStar/ImportDriverAdvanced'
    return httpReq(url, 'post', params)
  },
  // 新增/编辑驾驶员先进信息
  AddOrUpdateAdvancedDriver: function (params) {
    var url = '/api/ERPWeb/DriverStar/SaveDriverAdvanced'
    return httpReq(url, 'post', params)
  },
  // 批量删除驾驶员先进信息
  BatchDeleteDriverAdvanced: function (params) {
    var url = '/api/ERPWeb/DriverStar/BatchDeleteDriverAdvanced'
    return httpReq(url, 'post', params)
  },
  // 获取驾驶员先进信息列表
  GetDriverAdvancedList: function (params) {
    var url = '/api/ERPWeb/DriverStar/GetDriverAdvancedList'
    return httpReq(url, 'post', params)
  },
  // 导出驾驶员先进信息
  ExportDriverAdvanced: function (params) {
    var url = '/api/ERPWeb/DriverStar/ExportDriverAdvanced'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员星级微调
const DriverStarAdjust = {
  // 获取驾驶员星级微调
  GetRecordDriverStarAdjust: function (params) {
    var url = '/api/ERPWeb/DriverStarAdjust/GetDriverStarAdjustRecordWithRelation'
    return httpReq(url, 'post', params)
  },
  // 驾驶员星级微调详情
  GetDetailDriverStarAdjust: function (params) {
    var url = '/api/ERPWeb/DriverStarAdjust/GetDriverStarAdjustRecordDetailAsyinc'
    return httpReq(url, 'get', params)
  },
  // 添加编辑驾驶员星级微调草稿
  AddDraftDriverStarAdjust: function (params) {
    var url = '/api/ERPWeb/DriverStarAdjust/AddDriverStarAdjustDraft'
    return httpReq(url, 'post', params)
  },
  // 提交驾驶员星级微调
  AddDriverStarAdjust: function (params) {
    var url = '/api/ERPWeb/DriverStarAdjust/AddDriverStarAdjustFlow'
    return httpReq(url, 'post', params)
  },
  // 导出驾驶员星级微调
  ExportRecordDriverStarAdjust: function (params) {
    var url = '/api/ERPWeb/DriverStarAdjust/ExportRecord'
    return httpReq(url, 'post', params)
  }
}

// 乘客服务管理
const PassengerServiceManage = {
  // 查询乘客服务记录
  listPassengerServiceManage: function (params) {
    var url = '/api/ERPWeb/PassengerServiceManage/List'
    return httpReq(url, 'post', params)
  },
  // 乘客服务上传文件
  uploadFilePassengerServiceManage: function (params) {
    var url = '/api/ERPWeb/PassengerServiceManage/UploadFile'
    return httpReq(url, 'postFile', params.file)
  }
}

// 合同提醒（服务管理新需求、王云鹏）
const ErpContractRemind = {
  // 获取提醒规则
  GetRulesErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/GetErpContractRemindRules'
    return httpReq(url, 'get', params)
  },
  // 新增编辑单条规则
  UpdateRuleErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/AddOrUpdateRule'
    return httpReq(url, 'post', params)
  },
  // 删除单条规则
  DeleteRuleErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/DeleteRule'
    return httpReq(url, 'post', params)
  },
  // 分页获取合同
  GetRecordErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/GetRecord'
    return httpReq(url, 'post', params)
  },
  // 付款导入合同
  PayImportErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/PayContractImport'
    return httpReq(url, 'post', params)
  },
  // 收款导入合同
  ReceivedImportErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/ReceivedContractImport'
    return httpReq(url, 'post', params)
  },
  // 付款导出合同
  PayExportErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/ExportPayContract'
    return httpReq(url, 'post', params)
  },
  // 收款导出合同
  ReceivedExportErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/ExportReceivedContract'
    return httpReq(url, 'post', params)
  },
  // 获取所有部门
  GetAllHandlerDeptErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/GetAllHandlerDeptName'
    return httpReq(url, 'get', params)
  },
  // 编辑提醒部门
  UpdateHandleDeptErpContractRemind: function (params) {
    var url = '/api/ERPWeb/ErpContractRemind/UpdateHandleDept'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员病、工、事假记录
const DriverQualityCheck = {
  // 查询驾驶员病、工、事假记录
  GetDriverQualityCheck: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/GetDriverLeaveList'
    return httpReq(url, 'post', params)
  },
  // 新增驾驶员病、工、事假记录
  SaveDriverLeaveRecord: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/SaveDriverLeaveRecord'
    return httpReq(url, 'post', params)
  },
  // 删除驾驶员病、工、事假记录
  DeleteDriverLeaveRecord: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导出驾驶员病、工、事假记录
  ExportDriverLeaveRecord: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/ExportDriverLeaveRecord'
    return httpReq(url, 'post', params)
  }
}

// 服务管理
const serviceManage = {
  ...PassengerServiceNew,
  ...PassengerServiceAnalysis,
  ...LostArticle,
  ...DriverStarRule,
  ...DriverStartSummary,
  ...BranchCompanyPerformanceAssessment,
  ...InfoDocument,
  ...DriverStar,
  ...DriverStarAdjust,
  ...PassengerServiceManage,
  ...ErpContractRemind,
  ...DriverQualityCheck
}
export default serviceManage
