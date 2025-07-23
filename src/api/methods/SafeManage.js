import httpReq from '../http'

// 部门管理
const DeptManage = {
  // 获取分公司简易信息
  GetSimpleDeptList: function (params) {
    let url = '/api/ERPWeb/SafeOverview/GetSimpleDeptList'
    return httpReq(url, 'get', params)
  }
}

// 机务管理
const MachineManage = {
  // 获取机务数据总览
  GetMachineDataOverviewmonth: function (params) {
    let url = '/api/ERPWeb/HomePage/GetMachineDataOverview'
    return httpReq(url, 'get', params)
  }
}

// 事故统计报表
const AccidentReport = {
  // 车辆事故统计
  AccidentStatisticsAccidentReport: function (params) {
    let url = '/api/ERPWeb/AccidentReport/AccidentStatistics'
    return httpReq(url, 'post', params)
  },
  // 导出车辆事故统计记录
  exportAccidentReport: function (params) {
    let url = '/api/ERPWeb/AccidentReport/Export'
    return httpReq(url, 'post', params)
  },
  // 车辆事故汇总
  AccidentSummaryAccidentReport: function (params) {
    let url = '/api/ERPWeb/AccidentReport/AccidentSummary'
    return httpReq(url, 'post', params)
  },
  // 导出车辆事故汇总记录
  ExportSumamryAccidentReport: function (params) {
    let url = '/api/ERPWeb/AccidentReport/ExportSumamry'
    return httpReq(url, 'post', params)
  },
  // 违法汇总
  ViolationSummaryViolationReport: function (params) {
    let url = '/api/ERPWeb/ViolationReport/ViolationSummary'
    return httpReq(url, 'post', params)
  },
  // 导出违法汇总
  ExportSumamryViolationReport: function (params) {
    let url = '/api/ERPWeb/ViolationReport/ExportSumamry'
    return httpReq(url, 'post', params)
  }
}

// 车辆保险管理
const VehicleInsurance = {
  // 获取车辆保险记录
  getByPageVehicleInsurance: function (params) {
    var url = '/api/ERPWeb/VehicleInsurance/GetByPage'
    return httpReq(url, 'post', params)
  },

  // 新增或修改 车辆保险
  addVehicleInsurance: function (params) {
    var url = '/api/ERPWeb/VehicleInsurance/Add'
    return httpReq(url, 'post', params)
  },

  // 删除车辆保险
  deleteVehicleInsurance: function (params) {
    var url = '/api/ERPWeb/VehicleInsurance/Delete'
    return httpReq(url, 'post', params)
  },

  // 获取保险到期车辆信息
  getInsuranceEndVehicle: function (params) {
    var url = '/api/ERPWeb/VehicleInsurance/GetInsuranceEndVehicle'
    return httpReq(url, 'get', params)
  },

  // 导入车辆保险记录
  importVehicleInsurance: function (params) {
    var url = '/api/ERPWeb/VehicleInsurance/Import'
    return httpReq(url, 'postFile', params)
  },

  // 导出车辆保险记录
  exportVehicleInsurance: function (params) {
    var url = '/api/ERPWeb/VehicleInsurance/Export'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员安全档案
const DriverSafeArchives = {
  // 查询驾驶员简讯
  getDirverSlimDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/GetDirverSlim'
    return httpReq(url, 'get', params)
  },
  // 查询驾驶员安全档案
  getListDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/List'
    return httpReq(url, 'post', params)
  },
  // 新增驾驶员安全档案
  AddDriverInfoDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/AddDriverInfo'
    return httpReq(url, 'post', params)
  },
  // 编辑驾驶员安全档案
  editDriverInfoDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/EditDriverInfo'
    return httpReq(url, 'post', params)
  },
  // 保存驾驶员考勤照片
  UploadDriverImgdriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/UploadDriverImg'
    return httpReq(url, 'post', params)
  },
  // 删除考勤照片
  deleteDriverImgDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/DeleteDriverImg'
    return httpReq(url, 'get', params)
  },
  // 导出驾驶员安全档案
  exportDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/Export'
    return httpReq(url, 'post', params)
  },
  // 导入驾驶员记录
  ImportDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/Import'
    return httpReq(url, 'postFile', params)
  },
  // 查询驾驶员调动记录
  GetChangeByUserIdDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/GetChangeByUserId'
    return httpReq(url, 'get', params)
  },
  // 查询驾驶员调动记录
  DriverChangeListDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/DriverChangeList'
    return httpReq(url, 'post', params)
  },
  // 添加/编辑驶员调动
  AddOrEditDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/AddOrEdit'
    return httpReq(url, 'post', params)
  },
  // 查询驾驶员考核记录
  GetByPageDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 查询驾驶员考核记录
  GetDetailByPageDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/GetDetailByPage'
    return httpReq(url, 'post', params)
  },
  // 更新驾驶员考核记录
  UpdateDriverCheckDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/UpdateDriverCheck'
    return httpReq(url, 'post', params)
  },
  // 导出驾驶员月底考核
  CheckExportDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/CheckExport'
    return httpReq(url, 'post', params)
  },
  // 自动生成驾驶员考核记录
  AutoDriverCheckDriverSafeArchives: function (params) {
    var url = '/api/ERPWeb/DriverSafeArchives/AutoDriverCheck'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员违规记录
const DriverViolation = {
  // 获取驾驶员违规记录
  getDriverRecord: function (params) {
    var url = '/api/ERPWeb/DriverViolation/GetRecord'
    return httpReq(url, 'post', params)
  },
  // 新增、编辑违规记录
  addDriverRecord: function (params) {
    var url = '/api/ERPWeb/DriverViolation/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 删除项目记录
  deleteDriverRecord: function (params) {
    var url = '/api/ERPWeb/DriverViolation/DeleteRecord'
    return httpReq(url, 'post', params)
  },
  // 导出驾驶员违规记录
  exportDriverRecord: function (params) {
    var url = '/api/ERPWeb/DriverViolation/Export'
    return httpReq(url, 'post', params)
  },
  // 违规记录作废
  InvalidRecordDriverViolation: function (params) {
    var url = '/api/ERPWeb/DriverViolation/InvalidRecord'
    return httpReq(url, 'post', params)
  },
  // 获取记录详情
  DetailDriverViolation: function (params) {
    var url = '/api/ERPWeb/DriverViolation/Detail'
    return httpReq(url, 'get', params)
  }
}

// 违规检查奖罚管理
const RewardPunish = {
  // 获取项目树
  GetItemsTreeRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/GetItemsTree'
    return httpReq(url, 'get', params)
  },
  // 获取项目类别
  getGroupRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/GetGroup'
    return httpReq(url, 'get', params)
  },
  // 新增、编辑项目类别
  setGroupRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/SetGroup'
    return httpReq(url, 'post', params)
  },
  // 删除项目类别
  deleteGroupRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/DeleteGroup'
    return httpReq(url, 'post', params)
  },
  // 获取项目明细
  getProItems: function (params) {
    var url = '/api/ERPWeb/RewardPunish/GetItems'
    return httpReq(url, 'get', params)
  },
  // 新增、编辑项目明细
  setItemsRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/SetItems'
    return httpReq(url, 'post', params)
  },
  // 删除项目明细
  deleteItemsRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/DeleteItems'
    return httpReq(url, 'post', params)
  },
  // 项目调整排序
  groupSortRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/GroupSort'
    return httpReq(url, 'post', params)
  },
  // 项目调整排序
  GroupTypeSortRewardPunish: function (params) {
    var url = '/api/ERPWeb/RewardPunish/GroupTypeSort'
    return httpReq(url, 'post', params)
  }
}

// 违章项目管理
const ViolationItem = {
  // 查询违章项目管理
  listViolationItem: function (params) {
    var url = '/api/ERPWeb/ViolationItem/List'
    return httpReq(url, 'post', params)
  },

  // 添加/修改 违章项目管理
  addItemViolationItem: function (params) {
    var url = '/api/ERPWeb/ViolationItem/AddItem'
    return httpReq(url, 'post', params)
  },

  // 批量删除违章项目管理
  batchDeleteViolationItem: function (params) {
    var url = '/api/ERPWeb/ViolationItem/BatchDelete'
    return httpReq(url, 'post', params)
  }
}

// 违章管理
const ViolationManage = {
  // 查询违章记录
  getListViolationManage: function (params) {
    var url = '/api/ERPWeb/ViolationManage/List'
    return httpReq(url, 'post', params)
  },
  // 添加违章记录
  addViolationManageInfo: function (params) {
    var url = '/api/ERPWeb/ViolationManage/Add'
    return httpReq(url, 'post', params)
  },
  // 编辑违章记录
  EditViolationManage: function (params) {
    var url = '/api/ERPWeb/ViolationManage/Edit'
    return httpReq(url, 'post', params)
  },
  // 批量删除
  batchDeleteViolationManage: function (params) {
    var url = '/api/ERPWeb/ViolationManage/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入违章记录
  importViolationManage: function (params) {
    var url = '/api/ERPWeb/ViolationManage/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出违章记录
  exportViolationManage: function (params) {
    var url = '/api/ERPWeb/ViolationManage/Export'
    return httpReq(url, 'post', params)
  },
  // 图片上传(违章证据)操作
  UploadPictureViolationManage: function (params) {
    var url = '/api/ERPWeb/ViolationManage/UploadPicture'
    return httpReq(url, 'postFile', params)
  },
  // 新增或编辑经办人
  AddOrEditErpViolationPerson: function (params) {
    var url = '/api/ERPWeb/ViolationManage/UpdateErpViolationPerson'
    return httpReq(url, 'post', params)
  },
  // 获取部门经办人
  GetErpViolationPerson: function (params) {
    var url = '/api/ERPWeb/ViolationManage/GetErpViolationPerson'
    return httpReq(url, 'post', params)
  },

  // 饼图
  GetViolationTypeSummaryPie: function (params) {
    var url = '/api/ERPWeb/ViolationManage/GetViolationTypeSummaryPie'
    return httpReq(url, 'get', params)
  },
  // 柱状图
  GetViolationTypeSummaryBar: function (params) {
    var url = '/api/ERPWeb/ViolationManage/GetViolationTypeSummaryBar'
    return httpReq(url, 'get', params)
  },
  // 汇总统计
  GetViolationTypeSummaryByType: function (params) {
    var url = '/api/ERPWeb/ViolationManage/GetViolationTypeSummaryByType'
    return httpReq(url, 'get', params)
  }
}

// 超速统计
const OverSpeed = {
  // 获取超速明细
  GetOverSpeedOverSpeed: function (params) {
    var url = '/api/ERPWeb/OverSpeed/GetOverSpeed'
    return httpReq(url, 'post', params)
  },

  // 按车辆汇总超速明细
  getOverSpeedStatisticsByVehicle: function (params) {
    var url = '/api/ERPWeb/OverSpeed/GetOverSpeedGroupByV'
    return httpReq(url, 'post', params)
  },

  // 根据驾驶员汇总超速明细
  getOverSpeedStatisticsByDriver: function (params) {
    var url = '/api/ERPWeb/OverSpeed/GetOverSpeedGroupByD'
    return httpReq(url, 'post', params)
  },

  // 导出超速明细
  ExportOverSpeedStatistics: function (params) {
    var url = '/api/ERPWeb/OverSpeed/Export'
    return httpReq(url, 'post', params)
  },

  // 获取超速统计数据
  GetOverSpeedReportOverSpeed: function (params) {
    var url = '/api/ERPWeb/OverSpeed/GetOverSpeedReport'
    return httpReq(url, 'post', params)
  }
}

// 事故分析
const AccidentAnalysis = {
  // 获取事故汇总
  getAccidentSummaryAccidentAnalysis: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentSummary'
    return httpReq(url, 'post', params)
  },

  // 获取事故责任分析
  getAccidentDutyAnalysisAccidentAnalysis: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentDutyAnalysis'
    return httpReq(url, 'get', params)
  },

  // 获取事故原因分析
  getAccidentReasonAnalysisAccidentAnalysis: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentReasonAnalysis'
    return httpReq(url, 'get', params)
  },

  // 获取事故驾驶员分析
  getAccidentDriverAnalysisAccidentAnalysis: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentDriverAnalysis'
    return httpReq(url, 'get', params)
  },

  // 获取事故易发时段分析
  getAccidentTimeAnalysisAccidentAnalysis: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentTimeAnalysis'
    return httpReq(url, 'get', params)
  },

  // 获取事故易发路段分析
  getAccidentRoadAnalysisAccidentAnalysis: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentRoadAnalysis'
    return httpReq(url, 'get', params)
  },

  // 获取事故性质汇总饼图
  GetAccidentNatureSummaryPie: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentNatureSummaryPie'
    return httpReq(url, 'get', params)
  },
  // 获取事故性质汇总柱状图
  GetAccidentNatureSummaryBar: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentNatureSummaryBar'
    return httpReq(url, 'get', params)
  },
  // 获取事故性质汇总月/分公司统计
  GetAccidentNatureSummaryByType: function (params) {
    var url = '/api/ERPWeb/AccidentAnalysis/GetAccidentNatureSummaryByType'
    return httpReq(url, 'get', params)
  }
}

// 事故管理
const AccidentManage = {
  // 查询事故记录
  getAccidentRecordList: function (params) {
    var url = '/api/ERPWeb/AccidentManage/List'
    return httpReq(url, 'post', params)
  },
  // 查询事故记录详情
  DetailAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/Detail'
    return httpReq(url, 'get', params)
  },
  // 获取车辆相关信息
  getVehicleRelationInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/GetCarRelation'
    return httpReq(url, 'get', params)
  },
  // 添加事故记录
  addAccidentRecordInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/AddAccident'
    return httpReq(url, 'post', params)
  },
  //编辑事故记录
  EditAccidentRecordInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/EditAccident'
    return httpReq(url, 'post', params)
  },
  // 批量删除事故记录
  deleteAccidentInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入事故记录
  importAccidentRecord: function (params) {
    var url = '/api/ERPWeb/AccidentManage/Import'
    return httpReq(url, 'post', params)
  },
  // 导出事故记录
  exportAccidentRecord: function (params) {
    var url = '/api/ERPWeb/AccidentManage/Export'
    return httpReq(url, 'post', params)
  },
  // 查询伤亡记录
  getCasualtiesRecordList: function (params) {
    var url = '/api/ERPWeb/AccidentManage/ListCasualties'
    return httpReq(url, 'post', params)
  },
  // 添加伤亡记录
  addCasualtiesRecordInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/AddCasualties'
    return httpReq(url, 'post', params)
  },
  // 编辑伤亡记录
  EditCasualtiesAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/EditCasualties'
    return httpReq(url, 'post', params)
  },
  // 获取驾驶员信息
  getDriverInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/GetEmpInfo'
    return httpReq(url, 'get', params)
  },
  // 删除伤亡记录
  deleteCasualtiesInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/DeleteCasualties'
    return httpReq(url, 'post', params)
  },
  // 导出伤亡记录
  exportCasualties: function (params) {
    var url = '/api/ERPWeb/AccidentManage/ExportCasualties'
    return httpReq(url, 'post', params)
  },
  // 查询车损记录
  getDamageRecordList: function (params) {
    var url = '/api/ERPWeb/AccidentManage/ListDamage'
    return httpReq(url, 'post', params)
  },
  // 添加车损记录
  addDamageInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/AddDamage'
    return httpReq(url, 'post', params)
  },
  // 编辑车损记录
  EditDamageAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/EditDamage'
    return httpReq(url, 'post', params)
  },
  // 删除车损记录
  deleteDamageInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/DeleteDamage'
    return httpReq(url, 'post', params)
  },

  // 导出车损记录
  exportDamageInfo: function (params) {
    var url = '/api/ERPWeb/AccidentManage/ExportDamage'
    return httpReq(url, 'post', params)
  },
  // 上传事故图片
  uploadAccidenPicture: function (params) {
    var url = '/api/ERPWeb/AccidentManage/UploadPicture'
    return httpReq(url, 'postFile', params)
  },
  // 上传事故文档文件
  uploadAccidenFile: function (params) {
    var url = '/api/ERPWeb/AccidentManage/UploadFile'
    return httpReq(url, 'postFile', params.file)
  },
  // 查询事故资料记录
  queryAccidentData: function (params) {
    var url = '/api/ERPWeb/AccidentManage/QueryAccidentData'
    return httpReq(url, 'get', params)
  },
  // 添加事故资料
  addAccidentData: function (params) {
    var url = '/api/ERPWeb/AccidentManage/AddAccidentData'

    return httpReq(url, 'post', params)
  },
  // 批量删除事故资料
  batchDeleteAccidentData: function (params) {
    var url = '/api/ERPWeb/AccidentManage/BatchDeleteData'
    return httpReq(url, 'post', params)
  },
  // 查询理赔记录
  listCostAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/ListCost'
    return httpReq(url, 'post', params)
  },
  // 添加理赔记录
  addCostAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/AddCost'
    return httpReq(url, 'post', params)
  },
  // 编辑理赔记录
  EditCostAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/EditCost'
    return httpReq(url, 'post', params)
  },
  // 删除理赔记录
  deleteCostAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/DeleteCost'
    return httpReq(url, 'post', params)
  },
  // 导出理赔记录
  exportCostAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/ExportCost'
    return httpReq(url, 'post', params)
  },
  // 查询事故费用信息
  GetAccidentFeeAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/GetAccidentFee'
    return httpReq(url, 'get', params)
  },
  // 作废事故记录
  InvalidAccidentAccidentManage: function (params) {
    var url = '/api/ERPWeb/AccidentManage/InvalidAccident'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员入职管理
const DriverEntry = {
  // 查询驾驶员入职记录
  ListDriverEntry: function (params) {
    var url = '/api/ERPWeb/DriverEntry/List'
    return httpReq(url, 'post', params)
  },

  // 查询驾驶员入职记录
  DetailDriverEntry: function (params) {
    var url = '/api/ERPWeb/DriverEntry/Detail'
    return httpReq(url, 'get', params)
  },

  // 添加/编辑驾驶员入职记录
  AddOrEditDriverEntry: function (params) {
    var url = '/api/ERPWeb/DriverEntry/AddOrEdit'
    return httpReq(url, 'post', params)
  },

  // 批量删除驾驶员入职记录
  BatchDeleteDriverEntry: function (params) {
    var url = '/api/ERPWeb/DriverEntry/BatchDelete'
    return httpReq(url, 'post', params)
  },

  // 批量作废乘驾驶员入职记录
  BatchDisabledDriverEntry: function (params) {
    var url = '/api/ERPWeb/DriverEntry/BatchDisabled'
    return httpReq(url, 'post', params)
  }
}

// 驾驶员服务质量考核统计
const DriverQualityCheck = {
  // 查询驾驶员服务质量考核统计
  ListDriverQualityCheck: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/List'
    return httpReq(url, 'post', params)
  },

  // 导出驾驶员服务质量考核统计
  ExportDriverQualityCheck: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/Export'
    return httpReq(url, 'post', params)
  },

  // 导出驾驶员服务质量考核统计
  CancelDriverQualityCheck: function (params) {
    var url = '/api/ERPWeb/DriverQualityCheck/CancelQuality'
    return httpReq(url, 'post', params)
  }
}

// 获取数据记录
const InsuranceAnalysis = {
  // 查询驾驶员服务质量考核统计
  GetDataInsuranceAnalysis: function (params) {
    var url = '/api/ERPWeb/InsuranceAnalysis/GetData'
    return httpReq(url, 'post', params)
  },

  // 导出数据记录
  ExportInsuranceAnalysis: function (params) {
    var url = '/api/ERPWeb/InsuranceAnalysis/Export'
    return httpReq(url, 'post', params)
  }
}

// 违规汇总报表
const ViolationSummary = {
  // 获取表格数据
  GetDataViolationSummary: function (params) {
    var url = '/api/ERPWeb/ViolationSummary/GetData'
    return httpReq(url, 'post', params)
  },
  // 获取驾驶员违规明细记录
  GetDriverDetailViolationSummary: function (params) {
    var url = '/api/ERPWeb/ViolationSummary/GetDriverDetail'
    return httpReq(url, 'post', params)
  },
  // 获取乘客投诉明细记录
  GetPassengerDetailViolationSummary: function (params) {
    var url = '/api/ERPWeb/ViolationSummary/GetPassengerDetail'
    return httpReq(url, 'post', params)
  },
  // 导出违规记录
  ExportViolationSummary: function (params) {
    var url = '/api/ERPWeb/ViolationSummary/Export'
    return httpReq(url, 'post', params)
  }
}

// 安全会议记录
const SafeMeetingMain = {
  // 获取安全会议记录
  GetByPageSafeMeetingMain: function (params) {
    var url = '/api/ERPWeb/SafeMeetingMain/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增安全会议记录
  InsertSafeMeetingMain: function (params) {
    var url = '/api/ERPWeb/SafeMeetingMain/InsertSingleWithRelation'
    return httpReq(url, 'post', params)
  },
  // 更新安全会议记录
  UpdateSafeMeetingMain: function (params) {
    var url = '/api/ERPWeb/SafeMeetingMain/UpdateSingle'
    return httpReq(url, 'post', params)
  },
  // 删除安全会议记录
  DeleteSafeMeetingMain: function (params) {
    var url = '/api/ERPWeb/SafeMeetingMain/DeleteSingleWithRelation'
    return httpReq(url, 'post', params)
  },
  // 导出安全会议记录
  ExportSafeMeetingMain: function (params) {
    var url = '/api/ERPWeb/SafeMeetingMain/Export'
    return httpReq(url, 'post', params)
  }
}

// 安全培训记录
const SafeTrainMain = {
  // 获取安全培训记录
  GetByPageSafeTrainMain: function (params) {
    var url = '/api/ERPWeb/SafeTrainMain/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增安全培训记录
  InsertSafeTrainMain: function (params) {
    var url = '/api/ERPWeb/SafeTrainMain/InsertSingleWithRelation'
    return httpReq(url, 'post', params)
  },
  // 更新安全培训记录
  UpdateSafeTrainMain: function (params) {
    var url = '/api/ERPWeb/SafeTrainMain/UpdateSingle'
    return httpReq(url, 'post', params)
  },
  // 删除安全培训记录
  DeleteSafeTrainMain: function (params) {
    var url = '/api/ERPWeb/SafeTrainMain/DeleteSingleWithRelation'
    return httpReq(url, 'post', params)
  },
  // 导出安全培训记录
  ExportSafeTrainMain: function (params) {
    var url = '/api/ERPWeb/SafeTrainMain/Export'
    return httpReq(url, 'post', params)
  }
}

// 违规汇总报表
const SalaryManage = {
  // 新增员工工资
  AddSalaryManage: function (params) {
    var url = '/api/ERPWeb/SalaryManage/AddSalaryManage'
    return httpReq(url, 'post', params)
  },
  // 编辑员工工资
  EditSalaryManage: function (params) {
    var url = '/api/ERPWeb/SalaryManage/EditSalaryManage'
    return httpReq(url, 'post', params)
  },
  // 分页获取薪资管理
  GetByPageSalaryManage: function (params) {
    var url = '/api/ERPWeb/SalaryManage/GetByPageSalaryManage'
    return httpReq(url, 'post', params)
  },
  // 新增薪资设定
  AddSalarySetting: function (params) {
    var url = '/api/ERPWeb/SalaryManage/AddSalarySetting'
    return httpReq(url, 'post', params)
  },
  // 获取薪资设定
  GetSalarySetting: function (params) {
    var url = '/api/ERPWeb/SalaryManage/GetSalarySetting'
    return httpReq(url, 'get', params)
  },
  // 导入集团员工
  ReadPersonFile: function (params) {
    var url = '/api/ERPWeb/SalaryManage/ReadPersonFile'
    return httpReq(url, 'postFile', params)
  },
  // 导入驾驶员薪资
  ReadDriverFile: function (params) {
    var url = '/api/ERPWeb/SalaryManage/ReadDriverFile'
    return httpReq(url, 'postFile', params)
  }
}

// 违规汇总报表
const AccidentsReport = {
  // 查询事故记录
  QueryAccidentInfo: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/QueryAccidentInfo'
    return httpReq(url, 'get', params)
  },
  // 新增编辑风险标准
  AddOrUpdateSetting: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/AddOrUpdateSetting'
    return httpReq(url, 'post', params)
  },
  // 获取风险标准
  GetSettingAccidentsReport: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetSetting'
    return httpReq(url, 'get', params)
  },
  // 查询统计头部数据
  GetAccidentTitle: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetAccidentTitle'
    return httpReq(url, 'post', params)
  },
  // 获取营运分公司数据
  GetDeptInfoCaches: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetDeptInfoCaches'
    return httpReq(url, 'get', params)
  },
  // 获取行车事故率
  GetAccidentRateTotal: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetAccidentRateTotal'
    return httpReq(url, 'post', params)
  },
  // 获取行车违章率
  GetViolationRateTotal: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetViolationRateTotal'
    return httpReq(url, 'post', params)
  },
  // 获取事故率
  GetAccidentTypeTotal: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetAccidentTypeTotal'
    return httpReq(url, 'post', params)
  },
  // 获取饼图
  GetAccidentImage: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetAccidentImage'
    return httpReq(url, 'post', params)
  },

  // 导出行车事故率汇总
  ExportAccidentsReport: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/Export'
    return httpReq(url, 'post', params)
  },
  // 导出行车违章率汇总
  ExportViolationRate: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/ExportViolationRate'
    return httpReq(url, 'post', params)
  },
  // 获取部门月里程数据
  GetDeptMonthMiles: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/GetDeptMonthMiles'
    return httpReq(url, 'get', params)
  },
  // 编辑部门月里程数据
  AddOrUpdateMile: function (params) {
    var url = '/api/ERPWeb/AccidentsReport/AddOrUpdateMile'
    return httpReq(url, 'post', params)
  }
}

// 安全隐患管理(八月份)
const HiddenDanger = {
  // 查询
  GetPageListHiddenDanger: function (params) {
    var url = '/api/ERPWeb/HiddenDanger/GetPageList'
    return httpReq(url, 'post', params)
  },
  // 新增
  CreateHiddenDanger: function (params) {
    var url = '/api/ERPWeb/HiddenDanger/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateHiddenDanger: function (params) {
    var url = '/api/ERPWeb/HiddenDanger/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailHiddenDanger: function (params) {
    var url = '/api/ERPWeb/HiddenDanger/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  },
  // 删除
  DeleteHiddenDanger: function (params) {
    var url = '/api/ERPWeb/HiddenDanger/Delete'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportHiddenDanger: function (params) {
    var url = '/api/ERPWeb/HiddenDanger/Export'
    return httpReq(url, 'post', params)
  }
}

// 安全隐患管理反馈(八月份)
const HiddenDangerFeedBack = {
  // 新增
  CreateHiddenDangerFeedBack: function (params) {
    var url = '/api/ERPWeb/HiddenDangerFeedBack/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailHiddenDangerFeedBack: function (params) {
    var url = '/api/ERPWeb/HiddenDangerFeedBack/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  },
  // 获取
  GetListHiddenDangerFeedBack: function (params) {
    var url = '/api/ERPWeb/HiddenDangerFeedBack/GetList'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateHiddenDangerFeedBack: function (params) {
    var url = '/api/ERPWeb/HiddenDangerFeedBack/UpdateAuthorization'
    return httpReq(url, 'post', params)
  }
}

// 安全总览(安全管理新需求)
const SafeOverview = {
  // 事故总览文本
  GetAccidentOverviewText: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetAccidentOverviewText'
    return httpReq(url, 'get', params)
  },
  // 事故总览图表
  GetAccidentOverviewChart: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetAccidentOverviewChart'
    return httpReq(url, 'get', params)
  },
  // 违章总览文本
  GetViolationAnalysisTextInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetViolationAnalysisTextInfo'
    return httpReq(url, 'get', params)
  },
  // 违章总览图表
  GetViolationAnalysisChartInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetViolationAnalysisChartInfo'
    return httpReq(url, 'get', params)
  },
  // 营运分析
  GetYingYun: function (params) {
    var url = '/api/ERPWeb/HomePage/GetYingYun'
    return httpReq(url, 'get', params)
  },
  // 营运分析
  GetYunYing: function (params) {
    var url = '/api/ERPWeb/HomePage/GetYunYing'
    return httpReq(url, 'get', params)
  },
  // 营运分析
  GetYunYingCompare: function (params) {
    var url = '/api/ERPWeb/HomePage/GetYunYingCompare'
    return httpReq(url, 'get', params)
  },
  // 分公司简易信息
  GetSimpleDeptList: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetSimpleDeptList'
    return httpReq(url, 'get', params)
  },
  // 安全总览信息
  GetSafeOverviewInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetSafeOverviewInfo'
    return httpReq(url, 'get', params)
  },
  // 获取分公司安全排名信息
  GetSafeDeptRankInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetSafeDeptRankInfo'
    return httpReq(url, 'get', params)
  },
  // 获取安全隐患整改情况
  GetHiddenDangerFixInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetHiddenDangerFixInfo'
    return httpReq(url, 'get', params)
  },
  // 获取安全培训信息
  GetSafeTrainInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetSafeTrainInfo'
    return httpReq(url, 'get', params)
  },
  // 获取违章类型分析
  GetViolationTypeAnalysisInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetViolationTypeAnalysisInfo'
    return httpReq(url, 'get', params)
  },
  // 获取事故性质分析
  GetAccidentNatureAnalysis: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetAccidentNatureAnalysis'
    return httpReq(url, 'get', params)
  },
  // 获取事故责任信息
  GetAccidentDutyInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetAccidentDutyInfo'
    return httpReq(url, 'get', params)
  },
  // 获取事故原因分析
  GetAccidentReasonAnalysis: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetAccidentReasonAnalysis'
    return httpReq(url, 'get', params)
  },
  // 获取安全总览基础信息
  GetSafeOverviewBasicInfo: function (params) {
    var url = '/api/ERPWeb/SafeOverview/GetSafeOverviewBasicInfo'
    return httpReq(url, 'get', params)
  },
}

// 安全管理
const SafeManage = {
  ...DeptManage,
  ...MachineManage,
  ...AccidentReport,
  ...VehicleInsurance,
  ...DriverSafeArchives,
  ...DriverViolation,
  ...RewardPunish,
  ...ViolationItem,
  ...ViolationManage,
  ...AccidentAnalysis,
  ...AccidentManage,
  ...OverSpeed,
  ...DriverEntry,
  ...DriverQualityCheck,
  ...InsuranceAnalysis,
  ...SafeMeetingMain,
  ...SafeTrainMain,
  ...ViolationSummary,
  ...SalaryManage,
  ...AccidentsReport,
  ...HiddenDanger,
  ...HiddenDangerFeedBack,
  ...SafeOverview,
}

export default SafeManage
