import httpReq from '../http'

// 加班申请管理
const OaWorkOvertime = {
  // 获取指定人员加班单数据
  GetTimesDataOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/GetTimesData'
    return httpReq(url, 'get', params)
  },
  // 根据用户id获取是否需要显示补偿类型
  GetByUserIdOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/GetByUserId'
    return httpReq(url, 'get', params)
  },
  // 计算每日最大加班时长
  GetDayMaxHourOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/GetDayMaxHour'
    return httpReq(url, 'get', params)
  },
  // 新增加班申请
  CreateOrUpdateReqOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/CreateOrUpdateReq'
    return httpReq(url, 'post', params)
  },
  // 修改加班申请
  UpdateOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/Update'
    return httpReq(url, 'post', params)
  },
  // 获取加班申请详情
  LookDetailOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 统计
  GetListOaWorkOvertime: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/GetList'
    return httpReq(url, 'post', params)
  },
  // 导出统计
  ExportOaWorkOvertimeStatists: function (params) {
    let url = '/api/ERPWeb/OaWorkOvertime/Export'
    return httpReq(url, 'post', params)
  }
}

// 出差单
const TripRecord = {
  // 查看出差单详情
  LookDetailTripRecord: function (params) {
    let url = '/api/ERPWeb/TripRecord/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordTripRecord: function (params) {
    let url = '/api/ERPWeb/TripRecord/Create'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateTripRecord: function (params) {
    let url = '/api/ERPWeb/TripRecord/Update'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetListTripRecord: function (params) {
    let url = '/api/ERPWeb/TripRecord/GetList'
    return httpReq(url, 'post', params)
  },
  // 导出统计
  ExportTripRecordStatists: function (params) {
    let url = '/api/ERPWeb/TripRecord/ExportStatistical'
    return httpReq(url, 'post', params)
  }
}

// 请假管理
const RestManage = {
  // 根据用户考勤班次计算请假时长
  GetRestHourRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/GetRestHour'
    return httpReq(url, 'post', params)
  },
  // 获取调休余额
  getCompensatoryById: function (params) {
    let url = '/api/ERPWeb/RestManage/GetByUserId'
    return httpReq(url, 'get', params)
  },
  // 编辑
  EditRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取请假数据
  GetByPageRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增，编辑记录
  SetRecordRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 获取详情
  LookDetailRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/LookDetail'
    return httpReq(url, 'get', params)
  },

  // 获取用户调休余额明细
  GetCompensatoryDetailRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/GetCompensatoryDetail'
    return httpReq(url, 'post', params)
  },
  // 获取该加班单调休明细
  GetOverCompensatoryDetailsRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/GetOverCompensatoryDetails'
    return httpReq(url, 'post', params)
  },
  // 新增或修改调休余额过期规则
  UpdateCompenRuleRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/AddOrUpdateCompenRule'
    return httpReq(url, 'post', params)
  },
  // 获取调休余额过期规则
  GetRuleRestManage: function (params) {
    let url = '/api/ERPWeb/RestManage/GetCompensatoryLeaveRule'
    return httpReq(url, 'get', params)
  },

  // 驾驶员
  // 新增
  DriverSetRecord: function (params) {
    let url = '/api/ERPWeb/RestManage/DriverSetRecord'
    return httpReq(url, 'post', params)
  },
  // 编辑
  DriverEdit: function (params) {
    let url = '/api/ERPWeb/RestManage/DriverEdit'
    return httpReq(url, 'post', params)
  },
  // 查询
  GetDriverByPage: function (params) {
    let url = '/api/ERPWeb/RestManage/GetDriverByPage'
    return httpReq(url, 'post', params)
  },
  // 查询
  DriverLookDetail: function (params) {
    let url = '/api/ERPWeb/RestManage/DriverLookDetail'
    return httpReq(url, 'get', params)
  }
}

// 新闻信息管理
const OaFormNews = {
  // 查看新闻信息管理详情
  LookDetailOaFormNews: function (params) {
    let url = '/api/ERPWeb/OaFormNews/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordOaFormNews: function (params) {
    let url = '/api/ERPWeb/OaFormNews/CreateOrUpdateReq'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateOaFormNews: function (params) {
    let url = '/api/ERPWeb/OaFormNews/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取审批单数据
  GetListOaFormNews: function (params) {
    let url = '/api/ERPWeb/OaFormNews/GetList'
    return httpReq(url, 'post', params)
  }
}

// 工作联系单
const WorkDeal = {
  // 查看工作联系单详情
  LookDetailWorkDeal: function (params) {
    let url = '/api/ERPWeb/WorkDeal/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordWorkDeal: function (params) {
    let url = '/api/ERPWeb/WorkDeal/Create'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateWorkDeal: function (params) {
    let url = '/api/ERPWeb/WorkDeal/Update'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetListWorkDeal: function (params) {
    let url = '/api/ERPWeb/WorkDeal/GetList'
    return httpReq(url, 'post', params)
  },
  // 导出统计
  ExportWorkDealStatists: function (params) {
    let url = '/api/ERPWeb/WorkDeal/ExportStatistical'
    return httpReq(url, 'post', params)
  }
}

// 盖章审批单
const SealCanCel = {
  // 查看盖章审批单详情
  LookDetailSealCanCel: function (params) {
    let url = '/api/ERPWeb/SealCanCel/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordSealCanCel: function (params) {
    let url = '/api/ERPWeb/SealCanCel/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditSealCanCel: function (params) {
    let url = '/api/ERPWeb/SealCanCel/Edit'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetByPageSealCanCel: function (params) {
    let url = '/api/ERPWeb/SealCanCel/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出统计
  ExportSealCanCelStatists: function (params) {
    let url = '/api/ERPWeb/SealCanCel/ExportStatistics'
    return httpReq(url, 'post', params)
  }
}

// 线路调整审批单
const LineAdjust = {
  // 查看线路调整审批单详情
  LookDetailLineAdjust: function (params) {
    let url = '/api/ERPWeb/LineAdjust/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordLineAdjust: function (params) {
    let url = '/api/ERPWeb/LineAdjust/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateLineAdjust: function (params) {
    let url = '/api/ERPWeb/LineAdjust/Update'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetByPageLineAdjust: function (params) {
    let url = '/api/ERPWeb/LineAdjust/GetByPage'
    return httpReq(url, 'post', params)
  }
}
// 新招聘员工申请审批管理
const NewRecruitPerson = {
  // 查看新招聘员工申请审批管理详情
  LookDetailNewRecruitPerson: function (params) {
    let url = '/api/ERPWeb/NewRecruitPerson/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  CreateNewRecruitPerson: function (params) {
    let url = '/api/ERPWeb/NewRecruitPerson/Create'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditNewRecruitPerson: function (params) {
    let url = '/api/ERPWeb/NewRecruitPerson/Edit'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetByPageNewRecruitPerson: function (params) {
    let url = '/api/ERPWeb/NewRecruitPerson/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportNewRecruitPerson: function (params) {
    let url = '/api/ERPWeb/NewRecruitPerson/ExportStatistics'
    return httpReq(url, 'post', params)
  }
}

// 新进职工分配管理
const NewPersonAllocation = {
  // 查看新进职工分配管理详情
  LookDetailNewPersonAllocation: function (params) {
    let url = '/api/ERPWeb/NewPersonAllocation/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  CreateNewPersonAllocation: function (params) {
    let url = '/api/ERPWeb/NewPersonAllocation/Create'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditNewPersonAllocation: function (params) {
    let url = '/api/ERPWeb/NewPersonAllocation/Edit'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetByPageNewPersonAllocation: function (params) {
    let url = '/api/ERPWeb/NewPersonAllocation/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportNewPersonAllocation: function (params) {
    let url = '/api/ERPWeb/NewPersonAllocation/ExportStatistics'
    return httpReq(url, 'post', params)
  }
}

// 新进职工试用期考核表
const NewPersonTryCheck = {
  // 查看新进职工试用期考核表详情
  LookDetailNewPersonTryCheck: function (params) {
    let url = '/api/ERPWeb/NewPersonTryCheck/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordNewPersonTryCheck: function (params) {
    let url = '/api/ERPWeb/NewPersonTryCheck/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateNewPersonTryCheck: function (params) {
    let url = '/api/ERPWeb/NewPersonTryCheck/UpdateBorrow'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetByPageNewPersonTryCheck: function (params) {
    let url = '/api/ERPWeb/NewPersonTryCheck/GetByPage'
    return httpReq(url, 'post', params)
  }
}

// 劳动用工联系单
const WorkLaborContract = {
  // 查看劳动用工联系单详情
  LookDetailWorkLaborContract: function (params) {
    let url = '/api/ERPWeb/WorkLaborContract/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordWorkLaborContract: function (params) {
    let url = '/api/ERPWeb/WorkLaborContract/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditWorkLaborContract: function (params) {
    let url = '/api/ERPWeb/WorkLaborContract/Edit'
    return httpReq(url, 'post', params)
  },
  // 统计
  GetByPageWorkLaborContract: function (params) {
    let url = '/api/ERPWeb/WorkLaborContract/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportWorkLaborContract: function (params) {
    let url = '/api/ERPWeb/WorkLaborContract/ExportRestStatistics'
    return httpReq(url, 'post', params)
  }
}

// 岗位聘任申请表
const PostAppointment = {
  // 查看岗位聘任申请表详情
  LookDetailPostAppointment: function (params) {
    let url = '/api/ERPWeb/PostAppointment/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordPostAppointment: function (params) {
    let url = '/api/ERPWeb/PostAppointment/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdatePostAppointment: function (params) {
    let url = '/api/ERPWeb/PostAppointment/UpdateContract'
    return httpReq(url, 'post', params)
  },
  // 获取数据
  GetByPagePostAppointment: function (params) {
    let url = '/api/ERPWeb/PostAppointment/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 统计
  ContractPostAppointment: function (params) {
    let url = '/api/ERPWeb/PostAppointment/ContractStatistics'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportPostAppointment: function (params) {
    let url = '/api/ERPWeb/PostAppointment/ExportContractStatistics'
    return httpReq(url, 'post', params)
  }
}

// 劳务派遣人员辞职报告申请单
const LaborDepart = {
  // 查看劳务派遣人员辞职报告申请单详情
  LookDetailLaborDepart: function (params) {
    let url = '/api/ERPWeb/LaborDepart/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordLaborDepart: function (params) {
    let url = '/api/ERPWeb/LaborDepart/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateLaborDepart: function (params) {
    let url = '/api/ERPWeb/LaborDepart/UpdateEntertain'
    return httpReq(url, 'post', params)
  },
  // 获取数据
  GetByPageLaborDepart: function (params) {
    let url = '/api/ERPWeb/LaborDepart/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 统计
  ContractLaborDepart: function (params) {
    let url = '/api/ERPWeb/LaborDepart/FormEntertainStatistics'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportLaborDepart: function (params) {
    let url = '/api/ERPWeb/LaborDepart/ExportEntertainStatistics'
    return httpReq(url, 'post', params)
  }
}

// 职工退休返聘申请管理
const EmployRetirement = {
  // 查看职工退休返聘申请管理详情
  LookDetailEmployRetirement: function (params) {
    let url = '/api/ERPWeb/EmployRetirement/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  CreateEmployRetirement: function (params) {
    let url = '/api/ERPWeb/EmployRetirement/Create'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditEmployRetirement: function (params) {
    let url = '/api/ERPWeb/EmployRetirement/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取数据
  GetListEmployRetirement: function (params) {
    let url = '/api/ERPWeb/EmployRetirement/GetList'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportEmployRetirement: function (params) {
    let url = '/api/ERPWeb/EmployRetirement/ExportStatistics'
    return httpReq(url, 'post', params)
  }
}

// 银行开户单管理
const BankOpen = {
  // 查看银行开户单管理详情
  LookDetailBankOpen: function (params) {
    let url = '/api/ERPWeb/BankOpen/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  CreateBankOpen: function (params) {
    let url = '/api/ERPWeb/BankOpen/CreateOrUpdate'
    return httpReq(url, 'post', params)
  },
  // 修改
  UpdateBankOpen: function (params) {
    let url = '/api/ERPWeb/BankOpen/Update'
    return httpReq(url, 'post', params)
  },
  // 获取数据
  GetByPageBankOpen: function (params) {
    let url = '/api/ERPWeb/BankOpen/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportBankOpen: function (params) {
    let url = '/api/ERPWeb/BankOpen/ExportStatistics'
    return httpReq(url, 'post', params)
  }
}

// 申请银行销户审批表
const BankCancle = {
  // 查看申请银行销户审批表详情
  LookDetailBankCancle: function (params) {
    let url = '/api/ERPWeb/BankCancle/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordBankCancle: function (params) {
    let url = '/api/ERPWeb/BankCancle/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditBankCancle: function (params) {
    let url = '/api/ERPWeb/BankCancle/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取数据
  GetByPageBankCancle: function (params) {
    let url = '/api/ERPWeb/BankCancle/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 统计
  RestManageBankCancle: function (params) {
    let url = '/api/ERPWeb/BankCancle/RestManageStatistics'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportBankCancle: function (params) {
    let url = '/api/ERPWeb/BankCancle/ExportRestStatistics'
    return httpReq(url, 'post', params)
  }
}

// 奖励登记表单
const RewardRegistration = {
  // 查看奖励登记表单详情
  LookDetailRewardRegistration: function (params) {
    let url = '/api/ERPWeb/RewardRegistration/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordRewardRegistration: function (params) {
    let url = '/api/ERPWeb/RewardRegistration/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditRewardRegistration: function (params) {
    let url = '/api/ERPWeb/RewardRegistration/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取数据
  GetByPageRewardRegistration: function (params) {
    let url = '/api/ERPWeb/RewardRegistration/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 统计
  RestManageRewardRegistration: function (params) {
    let url = '/api/ERPWeb/RewardRegistration/RestManageStatistics'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportRewardRegistration: function (params) {
    let url = '/api/ERPWeb/RewardRegistration/ExportRestStatistics'
    return httpReq(url, 'post', params)
  }
}

// 宣传信息
const AdvertInfo = {
  // 查看宣传信息详情
  LookDetailAdvertInfo: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交
  SetRecordAdvertInfo: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 修改
  EditAdvertInfo: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取宣传信息数据
  GetByPageAdvertInfo: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetByPage'
    return httpReq(url, 'post', params)
  },

  // 新增编辑录用媒体
  AddOrEditAdvertPlatform: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/AddOrEditAdvertPlatform'
    return httpReq(url, 'post', params)
  },
  // 删除录用媒体
  DirectDelAdvertPlatform: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/DirectDelAdvertPlatform'
    return httpReq(url, 'post', params)
  },
  // 获取录用媒体
  GetAdvertPlatforms: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetAdvertPlatforms'
    return httpReq(url, 'post', params)
  },
  // 新增编辑宣传稿件
  AddOrEditAdvertManuscript: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/AddOrEditAdvertManuscript'
    return httpReq(url, 'post', params)
  },
  // 删除宣传稿件
  DirectDelAdvertManuscript: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/DirectDelAdvertManuscript'
    return httpReq(url, 'post', params)
  },
  // 更新宣传稿件状态
  UpdateStateAdvertManuscript: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/UpdateStateAdvertManuscript'
    return httpReq(url, 'post', params)
  },
  // 获取宣传稿件
  GetAdvertManuscript: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetAdvertManuscript'
    return httpReq(url, 'post', params)
  },
  // 员工宣传分数统计
  GetUserAdvertScoreTotal: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetUserAdvertScoreTotal'
    return httpReq(url, 'post', params)
  },
  // 员工宣传分数统计导出
  ExportUserAdvertScoreTotal: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/ExportUserAdvertScoreTotal'
    return httpReq(url, 'post', params)
  },
  // 员工宣传分数明细
  GetUserAdvertScoreDetail: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetUserAdvertScoreDetail'
    return httpReq(url, 'post', params)
  },
  // 员工宣传分数明细导出
  ExportUserAdvertScoreDetail: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/ExportUserAdvertScoreDetail'
    return httpReq(url, 'post', params)
  },
  // 部门宣传分数统计
  GetDeptAdvertTotal: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetDeptAdvertTotal'
    return httpReq(url, 'post', params)
  },
  // 部门宣传分数统计导出
  ExportDeptAdvertTotal: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/ExportDeptAdvertTotal'
    return httpReq(url, 'post', params)
  },
  // 部门录取篇数统计
  GetDeptAdvertEnter: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetDeptAdvertEnter'
    return httpReq(url, 'post', params)
  },
  // 部门录取篇数统计导出
  ExportDeptAdvertEnter: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/ExportDeptAdvertEnter'
    return httpReq(url, 'post', params)
  },
  // 部门上报篇数统计
  GetDeptAdvertReport: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetDeptAdvertReport'
    return httpReq(url, 'post', params)
  },
  // 部门上报篇数统计导出
  ExportDeptAdvertReport: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/ExportDeptAdvertReport'
    return httpReq(url, 'post', params)
  },

  // 获取稿费
  GetAdvertFee: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/GetAdvertFee'
    return httpReq(url, 'get', params)
  },
  // 新增稿费
  AddAdvertFee: function (params) {
    let url = '/api/ERPWeb/AdvertInfo/AddAdvertFee'
    return httpReq(url, 'post', params)
  },
  // 导入宣传稿件
  ImportAdvertInfo: function (params) {
    let url = 'api/ERPWeb/AdvertInfo/Import'
    return httpReq(url, 'post', params)
  },
  // 导出宣传稿件
  ExportAdvertInfo: function (params) {
    let url = 'api/ERPWeb/AdvertInfo/ExportAdvertManuscript'
    return httpReq(url, 'post', params)
  }
}

// 车辆外修联系单管理
const VehicleRepairContract = {
  // 获取车辆外修联系单数据
  GetByPageVehicleRepairContract: function (params) {
    let url = '/api/ERPWeb/VehicleRepairContract/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 获取车辆外修联系单
  LookDetailVehicleRepairContract: function (params) {
    let url = '/api/ERPWeb/VehicleRepairContract/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交车辆外修联系单单
  SetRecordVehicleRepairContract: function (params) {
    let url = '/api/ERPWeb/VehicleRepairContract/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 编辑车辆外修联系单单
  EditRecordVehicleRepairContract: function (params) {
    let url = '/api/ERPWeb/VehicleRepairContract/EditRecord'
    return httpReq(url, 'post', params)
  },
  // 车辆外修联系单导出
  ExportVehicleRepairContract: function (params) {
    let url = '/api/ERPWeb/VehicleRepairContract/ExportReimbursementStatistics'
    return httpReq(url, 'post', params)
  }
}

// 大额汽车配件领用审批单单
const OaVehiclePartsReceive = {
  // 获取大额汽车配件领用审批单
  GetByPageOaVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 获取大额汽车配件领用审批单
  GetByPage1OaVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/GetByPage1'
    return httpReq(url, 'post', params)
  },
  // 获取大额汽车配件领用审批单
  LookDetailVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 提交大额汽车配件领用审批单
  SetRecordOaVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 编辑大额汽车配件领用审批单
  EditOaVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/Edit'
    return httpReq(url, 'post', params)
  },
  // 大额汽车配件领用审批单单统计
  StatisticsOaVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/RestManageStatistics'
    return httpReq(url, 'post', params)
  },
  // 大额汽车配件领用审批单导出
  ExportOaVehiclePartsReceive: function (params) {
    let url = '/api/ERPWeb/OaVehiclePartsReceive/ExportStatistics'
    return httpReq(url, 'post', params)
  }
}

// 车辆安全技术检查汇总表
const VehicleSafeCheck = {
  // 车辆安全技术检查汇总表统计
  GetListVehicleSafeCheck: function (params) {
    let url = '/api/ERPWeb/VehicleSafeCheck/GetList'
    return httpReq(url, 'post', params)
  },
  // 提交车辆安全技术检查汇总表
  CreateVehicleSafeCheck: function (params) {
    let url = '/api/ERPWeb/VehicleSafeCheck/CreateOrUpdateReq'
    return httpReq(url, 'post', params)
  },
  // 编辑车辆安全技术检查汇总表
  EditVehicleSafeCheck: function (params) {
    let url = '/api/ERPWeb/VehicleSafeCheck/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取车辆安全技术检查汇总表
  LookDetailVehicleSafeCheck: function (params) {
    let url = '/api/ERPWeb/VehicleSafeCheck/LookDetail'
    return httpReq(url, 'get', params)
  },
  // 车辆安全技术检查汇总表导出
  ExportVehicleSafeCheck: function (params) {
    let url = '/api/ERPWeb/VehicleSafeCheck/Export'
    return httpReq(url, 'post', params)
  }
}
// 公司内部车辆调配变更审批管理
const VehicleDeploy = {
  // 新增
  AddByFlowVehicleDeploy: function (params) {
    let url = '/api/ERPWeb/VehicleDeploy/AddByFlow'
    return httpReq(url, 'post', params)
  },
  // 编辑
  EditFlowVehicleDeploy: function (params) {
    let url = '/api/ERPWeb/VehicleDeploy/EditFlow'
    return httpReq(url, 'post', params)
  },
  // 查询
  GetDetailsVehicleDeploy: function (params) {
    let url = '/api/ERPWeb/VehicleDeploy/GetDetails'
    return httpReq(url, 'get', params)
  },
  // 根据部门ID获取所属线路列表
  GetLineInfoByDept: function (params) {
    let url = '/api/ERPWeb/VehicleDeploy/GetLineInfoByDept'
    return httpReq(url, 'get', params)
  },
  // 根据车辆ID列表获取调出部门和调出线路信息
  GetDeployInfoByVehicles: function (params) {
    let url = '/api/ERPWeb/VehicleDeploy/GetDeployInfoByVehicles'
    return httpReq(url, 'post', params)
  }
}

// 乘客误刷处理单
const MistakeHandle = {
  // 分页查询
  GetByPageMistakeHandle: function (params) {
    let url = '/api/ERPWeb/OaMitakeHandle/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 乘客误刷处理单新增
  CreateMistakeHandle: function (params) {
    let url = '/api/ERPWeb/OaMitakeHandle/Create'
    return httpReq(url, 'post', params)
  },
  // 编辑
  EditMistakeHandle: function (params) {
    let url = '/api/ERPWeb/OaMitakeHandle/Edit'
    return httpReq(url, 'post', params)
  },
  // 获取公司内部车辆调配变更审批管理
  LookDetailMistakeHandle: function (params) {
    let url = '/api/ERPWeb/OaMitakeHandle/LookDetail'
    return httpReq(url, 'get', params)
  }
}

// 人员调动
const OaPersonTransfer = {
  // 员工调动分配新增 不发起流程
  CreateNoFlowOaPersonTransfer: function (params) {
    let url = '/api/ERPWeb/OaPersonTransfer/CreateNoFlow'
    return httpReq(url, 'post', params)
  },
  // 员工调动编辑新增 不发起流程
  EditNoFlowOaPersonTransfer: function (params) {
    let url = '/api/ERPWeb/OaPersonTransfer/EditNoFlow'
    return httpReq(url, 'post', params)
  },
  // 分页获取员工调动
  GetByPageOaPersonTransfer: function (params) {
    let url = '/api/ERPWeb/OaPersonTransfer/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 人员调动新增
  CreateOaPersonTransfer: function (params) {
    let url = '/api/ERPWeb/OaPersonTransfer/Create'
    return httpReq(url, 'post', params)
  },
  // 人员调动编辑
  EditOaPersonTransfer: function (params) {
    let url = '/api/ERPWeb/OaPersonTransfer/Edit'
    return httpReq(url, 'post', params)
  },
  // 详情
  LookDetailOaPersonTransfer: function (params) {
    let url = '/api/ERPWeb/OaPersonTransfer/LookDetail'
    return httpReq(url, 'get', params)
  }
}

// 假勤统计
const RestStatistics = {
  // 获取个人假勤统计
  GetRestStatistics: function (params) {
    let url = '/api/ERPWeb/RestStatistics/GetRestStatistics'
    return httpReq(url, 'post', params)
  },
  // 获取个人假勤统计类别详情
  GetRestRecordDetail: function (params) {
    let url = '/api/ERPWeb/RestStatistics/GetRecordDetail'
    return httpReq(url, 'post', params)
  },
  // 根据id获取个人假勤统计
  GetRestMainDetail: function (params) {
    let url = '/api/ERPWeb/RestStatistics/GetRestMainDetail'
    return httpReq(url, 'get', params)
  },
  // 请假单统计
  GetRestManageStatistics: function (params) {
    let url = '/api/ERPWeb/RestStatistics/RestManageStatistics'
    return httpReq(url, 'post', params)
  },
  // 请假单统计导出
  ExportRestStatistics: function (params) {
    let url = '/api/ERPWeb/RestStatistics/ExportRestStatistics'
    return httpReq(url, 'post', params)
  },
  // 获取指定时间范围内用户假勤记录(加班、请假、出差)
  GetUserRest: function (params) {
    let url = '/api/ERPWeb/RestStatistics/GetUserRest'
    return httpReq(url, 'post', params)
  }
}

// 稽查管理
const InspectManage = {
  // 分页查询
  ListInspectManage: function (params) {
    let url = '/api/ERPWeb/InspectManage/List'
    return httpReq(url, 'post', params)
  },
  // 导入
  ImportInspectManage: function (params) {
    let url = '/api/ERPWeb/InspectManage/Import'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportInspectManage: function (params) {
    let url = '/api/ERPWeb/InspectManage/Export'
    return httpReq(url, 'post', params)
  },
  // 新增
  AddInspectManageService: function (params) {
    let url = '/api/ERPWeb/InspectManage/AddInspectManageService'
    return httpReq(url, 'post', params)
  },
  // 编辑
  EditInspectManageService: function (params) {
    let url = '/api/ERPWeb/InspectManage/EditInspectManageService'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeleteInspectManageService: function (params) {
    let url = '/api/ERPWeb/InspectManage/DeleteInspectManageService'
    return httpReq(url, 'post', params)
  },
  // 分页查询车辆稽查情况
  GetInspectManageTotal: function (params) {
    let url = '/api/ERPWeb/InspectManage/GetInspectManageTotal'
    return httpReq(url, 'post', params)
  },
  // 车辆稽查情况导出
  total_exportInspectManage: function (params) {
    let url = '/api/ERPWeb/InspectManage/total_export'
    return httpReq(url, 'post', params)
  },
  // 查看详情
  LookDetailInspectManage: function (params) {
    let url = '/api/ERPWeb/InspectManage/LookDetail'
    return httpReq(url, 'get', params)
  }
}

// 小额采购审批单(九月份新需求)
const SmallPurchase = {
  // 新增或者保存草稿
  CreateSmallPurchase: function (params) {
    let url = '/api/ERPWeb/SmallPurchase/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataSmallPurchase: function (params) {
    let url = '/api/ERPWeb/SmallPurchase/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateSmallPurchase: function (params) {
    let url = '/api/ERPWeb/SmallPurchase/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailSmallPurchase: function (params) {
    let url = '/api/ERPWeb/SmallPurchase/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  },
  // 统计
  GetByPageDetailSmallPurchase: function (params) {
    let url = '/api/ERPWeb/SmallPurchase/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportDetailSmallPurchase: function (params) {
    let url = '/api/ERPWeb/SmallPurchase/ExportTotal'
    return httpReq(url, 'post', params)
  }
}

// 停驶车辆申请报告(九月份新需求)
const StopVehicle = {
  // 新增或者保存草稿
  CreateStopVehicle: function (params) {
    let url = '/api/ERPWeb/StopVehicle/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataStopVehicle: function (params) {
    let url = '/api/ERPWeb/StopVehicle/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateStopVehicle: function (params) {
    let url = '/api/ERPWeb/StopVehicle/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailStopVehicle: function (params) {
    let url = '/api/ERPWeb/StopVehicle/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 合理化意见审批单(十月份新需求)
const CustomSuggestion = {
  // 新增或者保存草稿
  CreateCustomSuggestion: function (params) {
    let url = '/api/ERPWeb/CustomSuggestion/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataCustomSuggestion: function (params) {
    let url = '/api/ERPWeb/CustomSuggestion/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateCustomSuggestion: function (params) {
    let url = '/api/ERPWeb/CustomSuggestion/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailCustomSuggestion: function (params) {
    let url = '/api/ERPWeb/CustomSuggestion/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  },
  // 分页获取
  GetPageListCustomSuggestion: function (params) {
    let url = '/api/ERPWeb/CustomSuggestion/GetPageList'
    return httpReq(url, 'post', params)
  }
}

// 公车装饰维修审批单(十一月份新需求)
const CompanyBusDecorate = {
  // 新增或者保存草稿
  CreateCompanyBusDecorate: function (params) {
    let url = '/api/ERPWeb/CompanyBusDecorate/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataCompanyBusDecorate: function (params) {
    let url = '/api/ERPWeb/CompanyBusDecorate/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateCompanyBusDecorate: function (params) {
    let url = '/api/ERPWeb/CompanyBusDecorate/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetCompanyBusDecorate: function (params) {
    let url = '/api/ERPWeb/CompanyBusDecorate/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
  // // 分页获取
  // CompanyBusDecorate: function (params) {
  //   let url = '/api/ERPWeb/CompanyBusDecorate/GetPageList';
  //   return httpReq(url, 'post', params);
  // },
}

// 燃料考核审批单(十一月份新需求)
const FuelAssess = {
  // 新增或者保存草稿
  CreateFuelAssess: function (params) {
    let url = '/api/ERPWeb/FuelAssess/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataFuelAssess: function (params) {
    let url = '/api/ERPWeb/FuelAssess/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateFuelAssess: function (params) {
    let url = '/api/ERPWeb/FuelAssess/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailFuelAssess: function (params) {
    let url = '/api/ERPWeb/FuelAssess/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 聘用工及临时性用工审批单(十一月份新需求)
const Outsourcing = {
  // 新增或者保存草稿
  CreateOutsourcing: function (params) {
    let url = '/api/ERPWeb/Outsourcing/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataOutsourcing: function (params) {
    let url = '/api/ERPWeb/Outsourcing/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateOutsourcing: function (params) {
    let url = '/api/ERPWeb/Outsourcing/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailOutsourcing: function (params) {
    let url = '/api/ERPWeb/Outsourcing/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 外派培训申请表
const OverseasTraining = {
  // 新增或者保存草稿
  CreateOverseasTraining: function (params) {
    let url = '/api/ERPWeb/OverseasTraining/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataOverseasTraining: function (params) {
    let url = '/api/ERPWeb/OverseasTraining/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateOverseasTraining: function (params) {
    let url = '/api/ERPWeb/OverseasTraining/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailOverseasTraining: function (params) {
    let url = '/api/ERPWeb/OverseasTraining/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 禾骑行用户退押金清单
const HeBicycle = {
  // 新增或者保存草稿
  CreateHeBicycle: function (params) {
    let url = '/api/ERPWeb/HeBicycle/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataHeBicycle: function (params) {
    let url = '/api/ERPWeb/HeBicycle/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateHeBicycle: function (params) {
    let url = '/api/ERPWeb/HeBicycle/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailHeBicycle: function (params) {
    let url = '/api/ERPWeb/HeBicycle/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 禾骑行用户退押金清单列表
const HeBicycleDetail = {
  // 分页获取列表数据
  GetPageListHeBicycleDetail: function (params) {
    let url = '/api/ERPWeb/HeBicycleDetail/GetPageList'
    return httpReq(url, 'post', params)
  }
}

// 叮嗒租车超时费退款单
const DingDaCar = {
  // 新增或者保存草稿
  CreateDingDaCar: function (params) {
    let url = '/api/ERPWeb/DingDaCar/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataDingDaCar: function (params) {
    let url = '/api/ERPWeb/DingDaCar/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateDingDaCar: function (params) {
    let url = '/api/ERPWeb/DingDaCar/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailDingDaCar: function (params) {
    let url = '/api/ERPWeb/DingDaCar/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 叮嗒租车超时费退款单列表
const DingDaCarDetail = {
  // 分页获取列表数据
  GetPageListDingDaCarDetail: function (params) {
    let url = '/api/ERPWeb/HeBicycleDetail/GetPageList'
    return httpReq(url, 'post', params)
  }
}

// 员工工作服配置审批单(十一月份新需求)
const EmployeeWearSetting = {
  // 新增或者保存草稿
  CreateEmployeeWearSetting: function (params) {
    let url = '/api/ERPWeb/EmployeeWearSetting/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataEmployeeWearSetting: function (params) {
    let url = '/api/ERPWeb/EmployeeWearSetting/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateEmployeeWearSetting: function (params) {
    let url = '/api/ERPWeb/EmployeeWearSetting/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailEmployeeWearSetting: function (params) {
    let url = '/api/ERPWeb/EmployeeWearSetting/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 劳务用工审批单(十一月份新需求)
const LaborService = {
  // 新增或者保存草稿
  CreateLaborService: function (params) {
    let url = '/api/ERPWeb/LaborService/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 新增或者保存草稿有返回值
  CreateReturnDataLaborService: function (params) {
    let url = '/api/ERPWeb/LaborService/CreateAuthorizationReturnData'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateLaborService: function (params) {
    let url = '/api/ERPWeb/LaborService/UpdateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 详情
  GetDetailLaborService: function (params) {
    let url = '/api/ERPWeb/LaborService/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 行车安全优秀驾驶员审批表(25年一月份新需求)
const OaDriverSafety = {
  // 获取列表数据
  GetListByPageOaDriverSafety: function (params) {
    let url = '/api/ERPWeb/OaDriverSafety/GetListByPage'
    return httpReq(url, 'post', params)
  },
  // 导入
  ImportOaDriverSafety: function (params) {
    let url = '/api/ERPWeb/OaDriverSafety/ImportTranslation'
    return httpReq(url, 'post', params)
  },
  // 新增
  CreateOaDriverSafety: function (params) {
    let url = '/api/ERPWeb/OaDriverSafety/CreateAuthorization'
    return httpReq(url, 'post', params)
  },
  // 编辑
  UpdateOaDriverSafety: function (params) {
    let url = '/api/ERPWeb/OaDriverSafety/UpdateAuthorization'
    return httpReq(url, 'get', params)
  },
  // 详情
  GetDetailOaDriverSafety: function (params) {
    let url = '/api/ERPWeb/OaDriverSafety/GetAuthorizationDetail'
    return httpReq(url, 'get', params)
  }
}

// 工作台
const OaManage = {
  ...OaWorkOvertime,
  ...RestManage,
  ...TripRecord,
  ...OaFormNews,
  ...WorkDeal,
  ...SealCanCel,
  ...LineAdjust,
  ...NewRecruitPerson,
  ...NewPersonAllocation,
  ...NewPersonTryCheck,
  ...WorkLaborContract,
  ...PostAppointment,
  ...LaborDepart,
  ...EmployRetirement,
  ...BankOpen,
  ...BankCancle,
  ...RewardRegistration,
  ...AdvertInfo,
  ...VehicleRepairContract,
  ...OaVehiclePartsReceive,
  ...VehicleSafeCheck,
  ...VehicleDeploy,
  ...MistakeHandle,
  ...OaPersonTransfer,
  ...RestStatistics,
  ...InspectManage,
  ...SmallPurchase,
  ...StopVehicle,
  ...CustomSuggestion,
  ...CompanyBusDecorate,
  ...FuelAssess,
  ...Outsourcing,
  ...OverseasTraining,
  ...HeBicycle,
  ...HeBicycleDetail,
  ...DingDaCar,
  ...DingDaCarDetail,
  ...EmployeeWearSetting,
  ...LaborService,
  ...OaDriverSafety
}

export default OaManage
