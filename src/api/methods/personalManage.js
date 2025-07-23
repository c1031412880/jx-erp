import httpReq from "../http";

// 离职管理
const Dimission = {
  // 查询离职记录
  listDimission: function (params) {
    let url = '/api/ERPWeb/Dimission/List';
    return httpReq(url, 'post', params);
  },
  // 办理离职
  dimissionDimission: function (params) {
    let url = '/api/ERPWeb/Dimission/Dimission';
    return httpReq(url, 'post', params);
  },
  // 确认离职
  confirmDimission: function (params) {
    let url = '/api/ERPWeb/Dimission/Confirm';
    return httpReq(url, 'post', params);
  },
  // 撤销离职
  cancelDimission: function (params) {
    let url = '/api/ERPWeb/Dimission/Cancel';
    return httpReq(url, 'post', params);
  },
  // 导出离职记录
  exportDimission: function (params) {
    let url = '/api/ERPWeb/Dimission/Export';
    return httpReq(url, 'post', params);
  },
  // 导出离职记录
  ImportDimission: function (params) {
    let url = '/api/ERPWeb/Dimission/Import';
    return httpReq(url, 'post', params);
  },
}

// 驾驶员离职管理
const DriverLeave = {
  // 查询离职记录
  listDriverLeave: function (params) {
    let url = '/api/ERPWeb/DriverLeave/List';
    return httpReq(url, 'post', params);
  },
  // 办理离职
  dimissionDriverLeave: function (params) {
    let url = '/api/ERPWeb/DriverLeave/Dimission';
    return httpReq(url, 'post', params);
  },
  // 确认离职
  confirmDriverLeave: function (params) {
    let url = '/api/ERPWeb/DriverLeave/Confirm';
    return httpReq(url, 'post', params);
  },
  // 撤销离职
  cancelDriverLeave: function (params) {
    let url = '/api/ERPWeb/DriverLeave/Cancel';
    return httpReq(url, 'post', params);
  },
  // 导出离职记录
  exportDriverLeave: function (params) {
    let url = '/api/ERPWeb/DriverLeave/Export';
    return httpReq(url, 'post', params);
  },
}

// 员工信息管理
const EmployeeManage = {
  // 员工类型统计
  getStaffTypeCount: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/GetEmpCount';
    return httpReq(url, 'get', params);
  },
  // 获取年龄
  getRelatedAge: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/GetAge';
    return httpReq(url, 'get', params);
  },
  // 获取档案编号
  getRecordNumber: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/GetRecordNumber';
    return httpReq(url, 'get', params);
  },
  // 查询员工详情
  getEmployeeManageDetail: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/Get';
    return httpReq(url, 'get', params);
  },
  // 查询员工(驾驶员)详情
  GetDriverEmployeeManageDetail: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/GetDriver';
    return httpReq(url, 'get', params);
  },
  // 查询人员记录
  getEmployeeManageList: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/List';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑员工信息
  addMployeeInfo: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/AddEmp';
    return httpReq(url, 'post', params);
  },
  // 离职
  sureMployeeDimission: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/Dimission';
    return httpReq(url, 'post', params);
  },
  // 修改离职信息
  editMployeeDimission: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/EditDimission';
    return httpReq(url, 'post', params);
  },
  // 图片上传
  uploadPicture: function (params,src) {
    let url = ''
    if(!src) {
      url = "/api/ERPWeb/EmployeeManage/UploadPicture"
    } else {
      url = src
    }
    return httpReq(url, 'postFile', params.file)
  },
  // 导入人员记录
  importStaffInfo: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/Import';
    return httpReq(url, 'postFile', params);
  },
  // 导出人员记录
  exportStaffInfo: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/Export';
    return httpReq(url, 'post', params);
  },

  // 根据部门查人员
  GetDeptUser: function (params) {
    let url = '/api/ERPWeb/EmployeeManage/GetDeptUser';
    return httpReq(url, 'get', params);
  },
}

// 岗位管理
const PostChange = {
  // 查询调岗记录
  ListPostChange: function (params) {
    let url = '/api/ERPWeb/PostChange/List';
    return httpReq(url, 'post', params);
  },
  // 岗位调动
  PostChangePostChange: function (params) {
    let url = '/api/ERPWeb/PostChange/PostChange';
    return httpReq(url, 'post', params);
  },
  //确认调岗
  ConfirmPostChange: function (params) {
    let url = '/api/ERPWeb/PostChange/Confirm';
    return httpReq(url, 'post', params);
  },
  // 撤销
  CancelPostChange: function (params) {
    let url = '/api/ERPWeb/PostChange/Cancel';
    return httpReq(url, 'post', params);
  },
  // 导出调岗记录
  ExportPostChange: function (params) {
    let url = '/api/ERPWeb/PostChange/Export';
    return httpReq(url, 'post', params);
  }
}

// 人事首页
const EmployeeAnalysis = {
  // 人员情况图
  QueryEmpTypeEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpCondition';
    return httpReq(url, 'post', params);
  },
  // 薪资支出总额
  QueryEmpPayExpendEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpSalary';
    return httpReq(url, 'post', params);
  },
  //人车数量图
  QueryEmpVehicleEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpVehicle';
    return httpReq(url, 'get', params);
  },
  // 男女数量图
  QueryEmpGenderEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpGender';
    return httpReq(url, 'get', params);
  },
  // 薪资范围分布图
  QueryEmpSalaryEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpSalary';
    return httpReq(url, 'get', params);
  },
  // 年龄范围分布图
  QueryEmpAgeEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpAge';
    return httpReq(url, 'get', params);
  },
  // 社保参保率
  QueryEmpSocialRateEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpSocialRate';
    return httpReq(url, 'get', params);
  },
  // 离职分析数据
  QueryEmpDimissionAnalysisDataEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpDimissionAnalysisData';
    return httpReq(url, 'post', params);
  },
  // 离职分析
  QueryEmpDimissionAnalysisEmployeeAnalysis: function (params) {
    let url = '/api/ERPWeb/EmployeeAnalysis/QueryEmpDimissionAnalysis';
    return httpReq(url, 'post', params);
  }
}

// 驾驶员薪资核算列表
const SalaryList = {
  // 薪资规则设定
  SalaryRuleSetSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/SalaryRuleSet';
    return httpReq(url, 'post', params);
  },
  // 批量薪资规则设定
  SalaryRuleBatchSetSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/SalaryRuleBatchSet';
    return httpReq(url, 'post', params);
  },
  // 查询薪资规则设定
  ListSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/List';
    return httpReq(url, 'post', params);
  },
  // 删除薪资规则设定
  BatchDeleteSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 添加奖金预检查
  AddSalaryPreSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/AddSalaryPre';
    return httpReq(url, 'post', params);
  },
  // 添加奖金
  AddSalarySalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/AddSalary';
    return httpReq(url, 'post', params);
  },
  // 工资详情
  QuerySalaryDetailSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/QuerySalaryDetail';
    return httpReq(url, 'post', params);
  },
  // 按人员/线路核算
  QuerySalaryByEmpSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/QuerySalaryByEmp';
    return httpReq(url, 'post', params);
  },
  // 导出薪资列表(按人员,按线路)
  ExportSalaryList: function (params) {
    let url = '/api/ERPWeb/SalaryList/Export';
    return httpReq(url, 'post', params);
  }
}

// 假期规则
const LeaveRule = {
  // 分页获取假期规则
  GetByPageLeaveRule: function (params) {
    let url = '/api/ERPWeb/LeaveRule/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增假期规则
  AddLeaveRule: function (params) {
    let url = '/api/ERPWeb/LeaveRule/Add';
    return httpReq(url, 'post', params);
  },
  // 修改假期规则
  UpdateLeaveRule: function (params) {
    let url = '/api/ERPWeb/LeaveRule/Update';
    return httpReq(url, 'post', params);
  },
  // 修改假期规则状态
  UpdateStateLeaveRule: function (params) {
    let url = '/api/ERPWeb/LeaveRule/UpdateState';
    return httpReq(url, 'post', params);
  },
  // 删除假期规则
  DelteLeaveRule: function (params) {
    let url = '/api/ERPWeb/LeaveRule/Delte';
    return httpReq(url, 'post', params);
  }
}

// 假期余额
const LeaveBalance = {
  // 分页获取用户假期
  GetByPageLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取用户假期余额明细
  GetDetailLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/GetDetail';
    return httpReq(url, 'get', params);
  },
  // 导出员工假期余额
  ExportLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/Export';
    return httpReq(url, 'post', params);
  },
  // 导入
  ImportLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/Import';
    return httpReq(url, 'postFile', params);
  },

  // 获取年假明细
  GetOaLeaveDetailByIdLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/GetOaLeaveDetailById';
    return httpReq(url, 'get', params);
  },
  // 修改年假余额
  UpdateYearBalanceLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/UpdateYearBalance';
    return httpReq(url, 'post', params);
  },
  // 获取用户年假剩余天数
  GetYearBalanceByUserLeaveBalance: function (params) {
    let url = '/api/ERPWeb/LeaveBalance/GetYearBalanceByUser';
    return httpReq(url, 'get', params);
  },
}

// 考勤统计汇总
const AttendanceStatistics = {
  // 分页获取考勤统计汇总
  AttendanceStatisticsAttendanceStatistics: function (params) {
    let url = '/api/ERPWeb/AttendanceStatistics/AttendanceStatistics';
    return httpReq(url, 'post', params);
  },
  // 考勤统计汇总导出
  ExportAttendanceStatistics: function (params) {
    let url = '/api/ERPWeb/AttendanceStatistics/Export';
    return httpReq(url, 'post', params);
  },
  // 考勤统计汇总请假/加班详情
  DetailAttendanceStatistics: function (params) {
    let url = '/api/ERPWeb/AttendanceStatistics/Detail';
    return httpReq(url, 'post', params);
  },
  // 考勤统计明细
  AttendanceDetailAttendanceStatistics: function (params) {
    let url = '/api/ERPWeb/AttendanceStatistics/AttendanceDetail';
    return httpReq(url, 'post', params);
  },
  // 考勤统计明细导出
  ExportDetailAttendanceStatistics: function (params) {
    let url = '/api/ERPWeb/AttendanceStatistics/ExportDetail';
    return httpReq(url, 'post', params);
  }
}

// 后备人才储备库
const TalentPool = {
  // 分页获取人才储备记录
  GetByPageTalentPool: function (params) {
    let url = '/api/ERPWeb/TalentPool/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增
  CreateTalentPool: function (params) {
    let url = '/api/ERPWeb/TalentPool/Create';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdateTalentPool: function (params) {
    let url = '/api/ERPWeb/TalentPool/Update';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteTalentPool: function (params) {
    let url = '/api/ERPWeb/TalentPool/Delete';
    return httpReq(url, 'post', params);
  },
  // 导出
  ExportTalentPool: function (params) {
    let url = '/api/ERPWeb/TalentPool/Export';
    return httpReq(url, 'post', params);
  }
}


// 员工奖惩管理
const Reward = {
  // 分页获取奖惩种类
  GetKindByPageReward: function (params) {
    let url = '/api/ERPWeb/Reward/GetKindByPage';
    return httpReq(url, 'get', params);
  },
  // 查询全部奖惩种类
  GetAllKindReward: function (params) {
    let url = '/api/ERPWeb/Reward/GetAllKind';
    return httpReq(url, 'get', params);
  },
  // 根据类别查询奖惩种类
  GetKindByTypeReward: function (params) {
    let url = '/api/ERPWeb/Reward/GetKindByType';
    return httpReq(url, 'get', params);
  },
  // 新增奖惩种类
  CreateKindReward: function (params) {
    let url = '/api/ERPWeb/Reward/CreateKind';
    return httpReq(url, 'post', params);
  },
  // 修改奖惩种类
  UpdateKindReward: function (params) {
    let url = '/api/ERPWeb/Reward/UpdateKind';
    return httpReq(url, 'post', params);
  },
  // 删除奖惩种类
  DeleteKindReward: function (params) {
    let url = '/api/ERPWeb/Reward/DeleteKind';
    return httpReq(url, 'post', params);
  },
  // 奖惩种类排序
  ChangeKindSortReward: function (params) {
    let url = '/api/ERPWeb/Reward/ChangeKindSort';
    return httpReq(url, 'post', params);
  },


  // 分页获取奖惩情形
  GetCaseByPageReward: function (params) {
    let url = '/api/ERPWeb/Reward/GetCaseByPage';
    return httpReq(url, 'get', params);
  },
  // 查询全部奖惩情形
  GetAllCaseReward: function (params) {
    let url = '/api/ERPWeb/Reward/GetAllCase';
    return httpReq(url, 'get', params);
  },
  // 根据类别查询奖惩情形
  GetCaseByTypeReward: function (params) {
    let url = '/api/ERPWeb/Reward/GetCaseByType';
    return httpReq(url, 'get', params);
  },
  // 新增奖惩情形
  CreateKindRewardReward: function (params) {
    let url = '/api/ERPWeb/Reward/CreateCase';
    return httpReq(url, 'post', params);
  },
  // 修改奖惩情形
  UpdateCaseReward: function (params) {
    let url = '/api/ERPWeb/Reward/UpdateCase';
    return httpReq(url, 'post', params);
  },
  // 删除奖惩情形
  DeleteCaseReward: function (params) {
    let url = '/api/ERPWeb/Reward/DeleteCase';
    return httpReq(url, 'post', params);
  },
  // 奖惩情形排序
  ChangeCaseSortReward: function (params) {
    let url = '/api/ERPWeb/Reward/ChangeCaseSort';
    return httpReq(url, 'post', params);
  },
}

// 员工奖惩记录
const RewardRecord = {
  // 获取员工奖惩数据
  GetDataRewardRecord: function (params) {
    let url = '/api/ERPWeb/RewardRecord/GetData';
    return httpReq(url, 'post', params);
  },
  // 添加数据
  AddRewardRecord: function (params) {
    let url = '/api/ERPWeb/RewardRecord/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑数据
  EditRewardRecord: function (params) {
    let url = '/api/ERPWeb/RewardRecord/Edit';
    return httpReq(url, 'post', params);
  },
  // 删除数据
  DeleteRewardRecord: function (params) {
    let url = '/api/ERPWeb/RewardRecord/Delete';
    return httpReq(url, 'post', params);
  }
}

// 班次管理
const OaKqbc = {
  // 分页获取班次
  GetByPageOaKqbc: function (params) {
    let url = '/api/ERPWeb/OaKqbc/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增班次
  AddOaKqbc: function (params) {
    let url = '/api/ERPWeb/OaKqbc/Add';
    return httpReq(url, 'post', params);
  },
  // 修改班次
  UpdateOaKqbc: function (params) {
    let url = '/api/ERPWeb/OaKqbc/Update';
    return httpReq(url, 'post', params);
  },
  // 删除班次
  DeleteOaKqbc: function (params) {
    let url = '/api/ERPWeb/OaKqbc/Delete';
    return httpReq(url, 'post', params);
  }
}

// 加班规则管理
const OaJbgz = {
  // 分页获取加班规则
  GetDataOaJbgz: function (params) {
    let url = '/api/ERPWeb/OaJbgz/GetData';
    return httpReq(url, 'get', params);
  },
  // 获取指定人加班规则数据
  GetUserRuleOaJbgz: function (params) {
    let url = '/api/ERPWeb/OaJbgz/GetUserRule';
    return httpReq(url, 'get', params);
  },
  // 添加规则
  AddOaJbgz: function (params) {
    let url = '/api/ERPWeb/OaJbgz/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑规则
  EditOaJbgz: function (params) {
    let url = '/api/ERPWeb/OaJbgz/Edit';
    return httpReq(url, 'post', params);
  },
  // 删除规则
  DeleteOaJbgz: function (params) {
    let url = '/api/ERPWeb/OaJbgz/Delete';
    return httpReq(url, 'post', params);
  }
}

// 考勤组管理
const OaKqz = {
  // 分页获取班次
  GetByPageOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 根据用户id获取考勤规则
  GetByIdOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/GetById';
    return httpReq(url, 'get', params);
  },
  // 根据用户id获取考勤班次
  GetKqbcOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/GetKqbc';
    return httpReq(url, 'get', params);
  },
  // 修改默认考勤组
  UpdateDefaultOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/UpdateDefault';
    return httpReq(url, 'post', params);
  },
  // 新增考勤组
  AddOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/Add';
    return httpReq(url, 'post', params);
  },
  // 修改考勤组
  UpdateOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/Update';
    return httpReq(url, 'post', params);
  },
  // 删除考勤组
  DeleteOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/Delete';
    return httpReq(url, 'post', params);
  },
  // 获取排班详情
  GetScheduling: function (params) {
    let url = '/api/ERPWeb/OaKqz/GetScheduling';
    return httpReq(url, 'post', params);
  },
  // 新增编辑排班
  AddOrUpdateScheduling: function (params) {
    let url = '/api/ERPWeb/OaKqz/AddOrUpdateScheduling';
    return httpReq(url, 'post', params);
  },
  // 月排班导入
  ReadExcelFileOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/ReadExcelFile';
    return httpReq(url, 'postFile', params);
  },
  // 更新单人月排班考勤
  UpdateSchedulingOaKqz: function (params) {
    let url = '/api/ERPWeb/OaKqz/UpdateScheduling';
    return httpReq(url, 'post', params);
  },
  // 清空排班
  EmptyScheduling: function (params) {
    let url = '/api/ERPWeb/OaKqz/EmptyScheduling';
    return httpReq(url, 'post', params);
  },
}

// 日考勤汇总报表
const DayKqReport = {
  // 获取日考勤汇总数据
  GetDataDayKqReport: function (params) {
    let url = '/api/ERPWeb/DayKqReport/GetData';
    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportDayKqReport: function (params) {
    let url = '/api/ERPWeb/DayKqReport/Export';
    return httpReq(url, 'post', params);
  }
}

// 日考勤汇总报表
const MonthKqReport = {
  // 获取月考勤汇总数据
  GetDataMonthKqReport: function (params) {
    let url = '/api/ERPWeb/MonthKqReport/GetData';
    return httpReq(url, 'post', params);
  },
  // 获取月考勤明细数据
  GetDetailMonthKqReport: function (params) {
    let url = '/api/ERPWeb/MonthKqReport/GetDetail';
    return httpReq(url, 'post', params);
  },
  // 数据导出月考勤汇总数据
  ExportMonthKqReport: function (params) {
    let url = '/api/ERPWeb/MonthKqReport/Export';
    return httpReq(url, 'post', params);
  },
  // 数据导出月考勤明细数据
  ExportDetailMonthKqReport: function (params) {
    let url = '/api/ERPWeb/MonthKqReport/ExportDetail';
    return httpReq(url, 'post', params);
  },
}

// 考勤统计
const KqRecord = {
  // 考勤原始数据
  AttendanceStatisticsKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/AttendanceStatistics';
    return httpReq(url, 'post', params);
  },
  // 员工考勤原始记录导出
  ExportDetailKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/ExportDetail';
    return httpReq(url, 'post', params);
  },
  // 打卡时间数据
  ClockTimeStatisticsKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/ClockTimeStatistics';
    return httpReq(url, 'post', params);
  },
  // 打卡时间数据导出
  ExportClockTimeKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/ExportClockTime';
    return httpReq(url, 'post', params);
  },
  // 打卡记录详情
  DetailKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/Detail';
    return httpReq(url, 'post', params);
  },
  // 管理员修改打卡结果
  UpdateClockKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/UpdateClock';
    return httpReq(url, 'post', params);
  },
  // 获取用户指定时间内考勤详情
  GetOaClockKqRecord: function (params) {
    let url = '/api/ERPWeb/KqRecord/GetOaClock';
    return httpReq(url, 'post', params);
  },
}

// 员工关怀
const ErpUserCare = {
  // 员工提醒（首页）
  GetHomePageRemindErpUserCare: function (params) {
    let url = '/api/ERPWeb/ErpUserCare/GetHomePageRemind';
    return httpReq(url, 'get', params);
  },
  // 员工代办（首页）
  GetHomePageWaitDoErpUserCare: function (params) {
    let url = '/api/ERPWeb/ErpUserCare/GetHomePageWaitDo';
    return httpReq(url, 'get', params);
  },
  // 获取
  GetByPageErpUserCare: function (params) {
    let url = '/api/ERPWeb/ErpUserCare/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 保存设置
  BatchModifyErpUserCare: function (params) {
    let url = '/api/ERPWeb/ErpUserCare/BatchModify';
    return httpReq(url, 'post', params);
  },
  // 获取设置
  GetListErpUserCare: function (params) {
    let url = '/api/ERPWeb/ErpUserCare/GetList';
    return httpReq(url, 'post', params);
  },
}


// 人事管理
const PersonalManage = {
  ...Dimission,
  ...EmployeeManage,
  ...PostChange,
  ...EmployeeAnalysis,
  ...SalaryList,
  ...LeaveRule,
  ...LeaveBalance,
  ...AttendanceStatistics,
  ...TalentPool,
  ...Reward,
  ...RewardRecord,
  ...OaKqbc,
  ...OaJbgz,
  ...OaKqz,
  ...DayKqReport,
  ...MonthKqReport,
  ...KqRecord,
  ...DriverLeave,
  ...ErpUserCare,
}

export default PersonalManage
