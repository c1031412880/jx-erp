import httpReq from '../http'

// 电瓶管理
const BatBottle = {
  // 分页查询电瓶信息
  getBatBottleList: function (params) {
    let url = '/api/ERPWeb/BatBottle/List'
    return httpReq(url, 'post', params)
  },
  // 新增或者编辑电瓶信息
  setBatBottleInfo: function (params) {
    let url = '/api/ERPWeb/BatBottle/SetModel'
    return httpReq(url, 'post', params)
  },
  // 删除电瓶及其使用记录
  deleteBatBottleInfo: function (params) {
    let url = '/api/ERPWeb/BatBottle/DeleteModel'
    return httpReq(url, 'post', params)
  },
  // 批量报废电瓶
  scrapBatBottleInfo: function (params) {
    let url = '/api/ERPWeb/BatBottle/ScrapModel'
    return httpReq(url, 'post', params)
  },
  // 导出电瓶数据
  exportBatBottleList: function (params) {
    let url = '/api/ERPWeb/BatBottle/ExportBatBottle'
    return httpReq(url, 'post', params)
  },
  // 获取电瓶使用记录
  getBatBottleUseHistory: function (params) {
    let url = '/api/ERPWeb/BatBottle/GetUseHistory'
    return httpReq(url, 'get', params)
  },
  // 获取电瓶生命周期
  getBatBottleLife: function (params) {
    let url = '/api/ERPWeb/BatBottle/GetBatLife'
    return httpReq(url, 'get', params)
  },
  // 根据车辆ID获取电瓶使用信息
  getRecordByVehicleidBatBottle: function (params) {
    let url = '/api/ERPWeb/BatBottle/GetRecordByVehicleid'
    return httpReq(url, 'get', params)
  }
}

// 电池管理
const BatteryManage = {
  // 分页查询电池类型
  getBatteryTypeByPage: function (params) {
    let url = '/api/ERPWeb/BatteryManage/GetByPage'
    return httpReq(url, 'get', params)
  },
  // 新增或修改电池类型
  AddBatteryModel: function (params) {
    let url = '/api/ERPWeb/BatteryManage/AddModel'
    return httpReq(url, 'post', params)
  },
  // 删除电池类型
  deleteBatteryModel: function (params) {
    let url = '/api/ERPWeb/BatteryManage/DeleteModel'
    return httpReq(url, 'post', params)
  }
}

// 压力容器管理
const ContainerManage = {
  // 分页压力容器
  getContainerByPage: function (params) {
    let url = '/api/ERPWeb/ContainerManage/GetByPage'
    return httpReq(url, 'get', params)
  },
  // 新增或修改 压力容器
  addContainerInfo: function (params) {
    let url = '/api/ERPWeb/ContainerManage/Add'
    return httpReq(url, 'post', params)
  },
  // 删除压力容器
  deleteContainerInfo: function (params) {
    let url = '/api/ERPWeb/ContainerManage/Delete'
    return httpReq(url, 'post', params)
  },
  // 批量报废压力容器
  batchScrapeContainer: function (params) {
    let url = '/api/ERPWeb/ContainerManage/Scrape'
    return httpReq(url, 'post', params)
  },
  // 获取压力容器生命周期
  getContainerLife: function (params) {
    let url = '/api/ERPWeb/ContainerManage/GetContainerLife'
    return httpReq(url, 'get', params)
  },
  // 获取压力容器绑定车辆记录
  getContainerVehicle: function (params) {
    let url = '/api/ERPWeb/ContainerManage/GetContainerVehicle'
    return httpReq(url, 'get', params)
  },
  // 获取绑定车辆信息
  GetContainerVehicleInfoContainerManage: function (params) {
    let url = '/api/ERPWeb/ContainerManage/GetContainerVehicleInfo'
    return httpReq(url, 'get', params)
  },
  // 导出压力容器数据
  exportContainerManage: function (params) {
    let url = '/api/ERPWeb/ContainerManage/Export'
    return httpReq(url, 'post', params)
  }
}

// 维修项目管理
const MaintainProject = {
  // 查询维修所属类别
  getMaintainProjectGroup: function (params) {
    let url = '/api/ERPWeb/MaintainProject/GetGroup'
    return httpReq(url, 'get', params)
  },
  // 新增/编辑维修分类
  AddMaintainProjectGroup: function (params) {
    let url = '/api/ERPWeb/MaintainProject/AddGroup'
    return httpReq(url, 'post', params)
  },
  // 删除分类
  deleteMaintainProjectGroup: function (params) {
    let url = '/api/ERPWeb/MaintainProject/DeleteGroup'
    return httpReq(url, 'post', params)
  },
  // 查询维修项目记录
  getMaintainProjectList: function (params) {
    let url = '/api/ERPWeb/MaintainProject/List'
    return httpReq(url, 'post', params)
  },
  // 新增/编辑维修项目信息
  addMaintainProject: function (params) {
    let url = '/api/ERPWeb/MaintainProject/AddMaintainProject'
    return httpReq(url, 'post', params)
  },
  // 删除维修项目记录
  removeMaintainProject: function (params) {
    let url = '/api/ERPWeb/MaintainProject/RemoveMaintainProject'
    return httpReq(url, 'post', params)
  },
  // 导入维修项目记录
  importMaintainProject: function (params) {
    let url = '/api/ERPWeb/MaintainProject/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出维修项目记录
  exportMaintainProject: function (params) {
    let url = '/api/ERPWeb/MaintainProject/Export'
    return httpReq(url, 'post', params)
  },
  // 维修项目调整排序
  sortMaintainProject: function (params) {
    let url = '/api/ERPWeb/MaintainProject/GroupSort'
    return httpReq(url, 'post', params)
  }
}

// 故障诊断库管理
const MaintainFaultDiagnosis = {
  // 查询故障分类
  queryFaultDiagnosis: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/GetGroup'
    return httpReq(url, 'get', params)
  },
  // 添加/编辑故障诊断分类
  addFaultDiagnosis: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/AddGroup'
    return httpReq(url, 'post', params)
  },
  // 删除故障诊断分类
  deleteFaultDiagnosis: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/DeleteGroup'
    return httpReq(url, 'post', params)
  },
  // 查询维修项目记录
  queryRepairProject: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/List'
    return httpReq(url, 'post', params)
  },
  // 添加/编辑故障诊断信息
  addFaultMessage: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/AddMaintainDiagnosis'
    return httpReq(url, 'post', params)
  },
  // 删除维修项目记录
  removeRepairProject: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/RemoveMaintainDiagnosis'
    return httpReq(url, 'post', params)
  },
  // 导入维修项目记录
  importRepairProject: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出维修项目记录
  exportRepairProject: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/Export'
    return httpReq(url, 'post', params)
  },
  // 调整排序
  sortFaultDiagnosis: function (params) {
    let url = '/api/ERPWeb/MaintainFaultDiagnosis/GroupSort'
    return httpReq(url, 'post', params)
  }
}

// 报修类别管理
const MaintainKind = {
  // 查询报修类别
  ListMaintainKind: function (params) {
    let url = '/api/ERPWeb/MaintainKind/List'
    return httpReq(url, 'post', params)
  },
  // 新增/编辑报修类别
  AddMoldMaintainKind: function (params) {
    let url = '/api/ERPWeb/MaintainKind/AddMold'
    return httpReq(url, 'post', params)
  },
  // 批量删除
  BatchDeleteMaintainKind: function (params) {
    let url = '/api/ERPWeb/MaintainKind/BatchDelete'
    return httpReq(url, 'post', params)
  }
}

// 维修组织管理
const MaintainOrg = {
  // 添加或修改维修组织
  addMaintainOrg: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/AddMaintainOrg'
    return httpReq(url, 'post', params)
  },
  // 删除维修组织
  deleteMaintainOrg: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/Dimission'
    return httpReq(url, 'post', params)
  },
  // 维修组织详情
  getMaintainOrgDetail: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/Get'
    return httpReq(url, 'get', params)
  },
  // 查询人员记录
  QueryEmpMaintainOrg: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/QueryEmp'
    return httpReq(url, 'post', params)
  },
  // 添加维修组织人员
  addMaintainOrgEmp: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/AddMaintainEmp'
    return httpReq(url, 'post', params)
  },
  // 移除维修组织人员
  deleteMaintainOrgEmp: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/RemoveMaintainEmp'
    return httpReq(url, 'post', params)
  },
  // 获取维修车间
  getMaintainDepart: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/GetMaintainDepart'
    return httpReq(url, 'get', params)
  },
  // 获取维修车间
  getMaintainShop: function (params) {
    let url = '/api/ERPWeb/MaintainOrg/GetMaintainShop'
    return httpReq(url, 'get', params)
  }
}

// 轮胎报废、翻新、修补
const TyreFail = {
  // 分页查询轮胎报废、翻新、修补
  getTyreFailByPage: function (params) {
    let url = '/api/ERPWeb/TyreFail/GetByPage'
    return httpReq(url, 'get', params)
  },
  // 新增或修改轮胎报废、翻新、修补
  AddTyreFailModel: function (params) {
    let url = '/api/ERPWeb/TyreFail/Add'
    return httpReq(url, 'post', params)
  },
  // 删除轮胎报废、翻新、修补
  deleteTyreFailModel: function (params) {
    let url = '/api/ERPWeb/TyreFail/Delete'
    return httpReq(url, 'post', params)
  },
  // 审核/反审核
  checkTyreFail: function (params) {
    let url = '/api/ERPWeb/TyreFail/Check'
    return httpReq(url, 'post', params)
  },
  // 导出轮胎报废数据
  exportTyreFailModel: function (params) {
    let url = '/api/ERPWeb/TyreFail/ExportTyreFailModel'
    return httpReq(url, 'get', params)
  }
}

// 轮胎管理
const TyreManage = {
  // 分页查询轮胎
  getByPageTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增或修改轮胎
  addTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/Add'
    return httpReq(url, 'post', params)
  },
  // 删除轮胎
  deleteTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/Delete'
    return httpReq(url, 'post', params)
  },
  // 批量报废
  moreScrapeTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/Scrape'
    return httpReq(url, 'post', params)
  },
  // 获取轮胎生命周期
  getTyreLifeTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/GetTyreLife'
    return httpReq(url, 'get', params)
  },
  // 获取轮胎安装车辆
  getTyreVehicleTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/GetTyreVehicle'
    return httpReq(url, 'get', params)
  },
  // 导出轮胎记录
  ExportTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/Export'
    return httpReq(url, 'post', params)
  },
  // 分页查询轮胎使用记录
  getTyreVehicleByPageTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/GetTyreVehicleByPage'
    return httpReq(url, 'post', params)
  },
  // 导出轮胎使用记录
  ExportTyreRecord: function (params) {
    let url = '/api/ERPWeb/TyreManage/ExportTyreRecord'
    return httpReq(url, 'post', params)
  },
  // 获取轮胎统计
  getTyreCountTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/GetTyreCount'
    return httpReq(url, 'post', params)
  },
  // 导出轮胎统计
  ExportCountTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/ExportCount'
    return httpReq(url, 'post', params)
  },
  // 导入轮胎信息
  ImportTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/Import'
    return httpReq(url, 'postFile', params)
  },
  // 分页查询轮胎使用情况(十二月分 崔旭林写)
  GetTyreConditionsTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/GetTyreConditions'
    return httpReq(url, 'post', params)
  },
  // 同车转移轮胎(十二月分 崔旭林写)
  ChangeTyreManage: function (params) {
    let url = '/api/ERPWeb/TyreManage/Change'
    return httpReq(url, 'post', params)
  },
  // 车辆轮胎使用(十二月分 崔旭林写)
  GetListTyreUseRecord: function (params) {
    let url = '/api/ERPWeb/TyreUseRecord/GetList'
    return httpReq(url, 'post', params)
  },
  // 车辆轮胎使用删除(十二月分 崔旭林写)
  DeleteTyreUseRecord: function (params) {
    let url = '/api/ERPWeb/TyreUseRecord/Delete'
    return httpReq(url, 'post', params)
  }
}

// 轮胎型号
const TyreModel = {
  // 分页查询轮胎型号
  getTyreModelByPage: function (params) {
    let url = '/api/ERPWeb/TyreModel/GetByPage'
    return httpReq(url, 'get', params)
  },
  // 新增或修改轮胎型号
  AddTyreModel: function (params) {
    let url = '/api/ERPWeb/TyreModel/AddModel'
    return httpReq(url, 'post', params)
  },
  // 删除轮胎型号
  deleteTyreModel: function (params) {
    let url = '/api/ERPWeb/TyreModel/DeleteModel'
    return httpReq(url, 'post', params)
  },
  // 获取轮胎物料列表
  GetMaterialsTyreModel: function (params) {
    let url = '/api/ERPWeb/TyreModel/GetMaterials'
    return httpReq(url, 'get', params)
  }
}

// 车辆年检计划管理
const CheckPlan = {
  // 获取年检计划
  getCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/GetCheckPlan'
    return httpReq(url, 'post', params)
  },
  // 生成年检计划
  MakePlanTestCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/MakePlanTest'
    return httpReq(url, 'post', params)
  },
  // 提交审核记录
  submitRecord: function (params) {
    let url = '/api/ERPWeb/CheckPlan/SubmitRecord'
    return httpReq(url, 'post', params)
  },
  // 审核记录
  CheckRecordCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/CheckRecord'
    return httpReq(url, 'get', params)
  },
  // 批量年检
  submitMangCheck: function (params) {
    let url = '/api/ERPWeb/CheckPlan/SubmitMangCheck'
    return httpReq(url, 'get', params)
  },
  // 年检历史记录查询
  getCheckHistory: function (params) {
    let url = '/api/ERPWeb/CheckPlan/GetCheckHistory'
    return httpReq(url, 'get', params)
  },
  // 年检计划审核进度查询
  GetReviewProcessCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/GetReviewProcess'
    return httpReq(url, 'get', params)
  },
  // 年检历史记录查询(车辆信息关联查询)
  GetHisRecordCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/GetHisRecord'
    return httpReq(url, 'get', params)
  },
  // 提交年检凭证
  SubmitVoucherCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/SubmitVoucher'
    return httpReq(url, 'post', params)
  },
  // 年检计划导出
  ExportCheckPlan: function (params) {
    let url = '/api/ERPWeb/CheckPlan/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆报废计划管理
const DiscardPlan = {
  // 报废计划查询
  GetDiscarPlanDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/GetDiscarPlan'
    return httpReq(url, 'post', params)
  },
  // 获取指定流程报废计划
  DetailDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/Detail'
    return httpReq(url, 'get', params)
  },
  // 获取统计简要数据
  CountDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/Count'
    return httpReq(url, 'get', params)
  },
  // 报废提交审核记录
  SubmitRecordDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/SubmitRecord'
    return httpReq(url, 'post', params)
  },
  // 新增车辆报废记录
  AddDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/Add'
    return httpReq(url, 'post', params)
  },
  // 删除车辆报废记录
  DeleteDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/Delete'
    return httpReq(url, 'post', params)
  },
  // 重新生成报废计划
  BuildPlansDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/BuildPlans'
    return httpReq(url, 'get', params)
  },
  // 车辆报废计划导出
  ExportDiscardPlan: function (params) {
    let url = '/api/ERPWeb/DiscardPlan/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆保养计划管理
const UpKeepPlan = {
  // 保养计划查询
  getUpkeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/GetUpkeepPlan'
    return httpReq(url, 'post', params)
  },
  // 回退保养计划
  BackPlanUpKeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/BackPlan'
    return httpReq(url, 'post', params)
  },
  // 下发保养计划
  allotUpkeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/AllotPlan'
    return httpReq(url, 'post', params)
  },
  // 确认保养计划
  confirmUpkeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/ConfirmPlan'
    return httpReq(url, 'post', params)
  },
  // 再次确认保养计划
  onceConfirmUpkeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/OnceConfirmPlan'
    return httpReq(url, 'post', params)
  },
  // 删除车辆保养计划
  deleteUpkeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/DeletePlan'
    return httpReq(url, 'post', params)
  },
  // 添加、编辑车辆保养计划
  setUpKeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/SetUpKeepPlan'
    return httpReq(url, 'post', params)
  },
  // 获取车辆截止到前一天的里程数
  getBeforeDayDistance: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/GetDistance'
    return httpReq(url, 'get', params)
  },
  // 获取车辆的计划信息
  GetVehiclePlanUpKeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/GetVehiclePlan'
    return httpReq(url, 'get', params)
  },
  // 保养计划导出
  ExportUpKeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/Export'
    return httpReq(url, 'post', params)
  },
  // 数据导入
  ImportUpKeepPlan: function (params) {
    let url = '/api/ERPWeb/UpKeepPlan/Import'
    return httpReq(url, 'postFile', params)
  }
}

// 车辆信息管理
const VehicleManager = {
  // 车辆相关图片上传操作
  AddCarInfoImageUpload: function (params) {
    let url = '/api/ERPWeb/VehicleManager/AddCarInfoImage'
    return httpReq(url, 'postFile', params.file)
  },
  // 新增车型信息设置
  SetCarModelVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/SetCarModel'
    return httpReq(url, 'post', params)
  },
  // 编辑车型信息设置
  UpdateCarModelVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/UpdateCarModel'
    return httpReq(url, 'post', params)
  },
  // 删除车型信息设置
  deleteCarModelVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/DeleteCarModel'
    return httpReq(url, 'post', params)
  },
  // 车型信息获取
  GetCarModelVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCarModel'
    return httpReq(url, 'post', params)
  },
  // 添加车辆信息设置
  SetCarInfoVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/SetCarInfo'
    return httpReq(url, 'post', params)
  },
  // 编辑车辆信息
  EditCarInfoVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/EditCarInfo'
    return httpReq(url, 'post', params)
  },
  // 车辆信息删除
  DeleteCarInfoVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/DeleteCarInfo'
    return httpReq(url, 'post', params)
  },
  //获取车辆信息
  GetCarInfoVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCarInfo'
    return httpReq(url, 'get', params)
  },
  //获取车辆信息
  getCarinfo: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCarInfo'
    return httpReq(url, 'post', params)
  },
  //获取车辆信息
  GetVehicleInfoById: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetVehicleInfoById'
    return httpReq(url, 'get', params)
  },
  // 车辆证件信息设置
  SetCarCerficateVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/SetCarCerficate'
    return httpReq(url, 'post', params)
  },
  // 车辆证件删除
  DeletetCarCerficateVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/DeletetCarCerficate'
    return httpReq(url, 'post', params)
  },
  // 车辆证件信息获取
  GetCarCerficateVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCarCerficate'
    return httpReq(url, 'get', params)
  },
  // 获取部分车型信息
  GetCMDataVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCMData'
    return httpReq(url, 'get', params)
  },
  // 导入车型数据
  ImportCardModelVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ImportCardModel'
    return httpReq(url, 'postFile', params)
  },
  // 导出车型数据
  ExportCarModelVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ExportCarModel'
    return httpReq(url, 'post', params)
  },
  // 导入车辆数据
  ImportCardInfoVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ImportCardInfo'
    return httpReq(url, 'postFile', params)
  },
  // 导出车辆数据
  ExportCarInfoVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ExportCarInfo'
    return httpReq(url, 'post', params)
  },
  // 变更车辆所属组织（调度）
  ChageCarDeptVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ChageCarDept'
    return httpReq(url, 'post', params)
  },
  // 获取变更车辆所属组织（调度）
  GetCarChangeRecordVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCarChangeRecord'
    return httpReq(url, 'get', params)
  },
  // 获取车辆统计数据
  GetCountVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetCount'
    return httpReq(url, 'get', params)
  },
  // 获取车辆提醒事项
  GetNoticeVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetNotice'
    return httpReq(url, 'get', params)
  },
  // 获取车辆生命周期
  GetVehicelLifeVehicleManager: function (params) {
    let url = '/api/ERPWeb/VehicleManager/GetVehicelLife'
    return httpReq(url, 'get', params)
  },
  // 车辆报废
  ScrapCarInfo: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ScrapCarInfo'
    return httpReq(url, 'post', params)
  },
  // 查询车辆燃料消耗统计
  VehicleOilSummaty: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/VehicleOilSummaty'
    return httpReq(url, 'post', params)
  },
  // 导出车辆燃料消耗统计
  ExportVehicleOilSummaty: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/Export'
    return httpReq(url, 'post', params)
  },
  // 导出车辆档案
  ExportVehicleInfo: function (params) {
    let url = '/api/ERPWeb/VehicleManager/ExportVehicleInfo'
    return httpReq(url, 'post', params)
  }
}

// 车辆年检规则
const MaintCheckRule = {
  // 查询年检记录
  getAnnualInspectionList: function (params) {
    let url = '/api/ERPWeb/MaintCheckRule/List'
    return httpReq(url, 'post', params)
  },
  //添加编辑年检规则
  addAnnualInspectionRule: function (params) {
    let url = '/api/ERPWeb/MaintCheckRule/Rule'
    return httpReq(url, 'post', params)
  },
  // 年检规则启用/停用
  annualInspectionEnabRule: function (params) {
    let url = '/api/ERPWeb/MaintCheckRule/EnabRule'
    return httpReq(url, 'get', params)
  },
  // 年检规则删除
  deleteAnnualInspectionRule: function (params) {
    let url = '/api/ERPWeb/MaintCheckRule/DeleteRule'
    return httpReq(url, 'post', params)
  }
}

// 车辆报废规则
const MaintDiscardRule = {
  // 查询报废规则列表记录
  getMaintDiscardList: function (params) {
    let url = '/api/ERPWeb/MaintDiscardRule/List'
    return httpReq(url, 'post', params)
  },
  // 添加编辑报废规则
  addMaintDiscardRule: function (params) {
    let url = '/api/ERPWeb/MaintDiscardRule/Rule'
    return httpReq(url, 'post', params)
  },
  // 报废规则启用/停用
  annualMaintDiscardEnabRule: function (params) {
    let url = '/api/ERPWeb/MaintDiscardRule/EnabRule'
    return httpReq(url, 'get', params)
  },
  // 报废规则删除
  deleteMaintDiscardRule: function (params) {
    let url = '/api/ERPWeb/MaintDiscardRule/DeleteRule'
    return httpReq(url, 'post', params)
  }
}

// 车辆保养规则
const MaintMaintainRule = {
  // 查询一保 二保记录
  getMaintainList: function (params) {
    let url = '/api/ERPWeb/MaintMaintainRule/List'
    return httpReq(url, 'post', params)
  },
  // 添加编辑一保 二保规则
  addMaintainRule: function (params) {
    let url = '/api/ERPWeb/MaintMaintainRule/Rule'
    return httpReq(url, 'post', params)
  },
  // 一保 二保规则启用/停用
  annualMaintainEnabRule: function (params) {
    let url = '/api/ERPWeb/MaintMaintainRule/EnabRule'
    return httpReq(url, 'get', params)
  },
  // 一保 二保规则删除
  deleteMaintainRule: function (params) {
    let url = '/api/ERPWeb/MaintMaintainRule/DeleteRule'
    return httpReq(url, 'post', params)
  }
}

// 车辆里程管理
const VehicleMileManage = {
  // 里程记录明细列表
  getVehicleMileManage: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/List'
    return httpReq(url, 'post', params)
  },
  // 里程记录汇总列表
  getVehicleMileTotalVehicleMileManage: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/GetVehicleMileTotal'
    return httpReq(url, 'post', params)
  },
  // 补录/编辑车辆里程
  additionVehicleMile: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/AdditionMile'
    return httpReq(url, 'post', params)
  },
  // 删除里程记录
  deleteVehicleMile: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/Delete'
    return httpReq(url, 'post', params)
  },
  // 导入里程记录
  importVehicleMile: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出里程明细记录
  exportVehicleMile: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/Export'
    return httpReq(url, 'post', params)
  },
  // 导出里程汇总
  ExportTotalVehicleMileManage: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/ExportTotal'
    return httpReq(url, 'post', params)
  },
  GetGpsMileVehicleMileManage: function (params) {
    let url = '/api/ERPWeb/VehicleMileManage/GetGpsMile'
    return httpReq(url, 'get', params)
  }
}

// 发动机型号管理
const EngineItem = {
  // 分页查询发动机型号
  getEngineModelByPage: function (params) {
    let url = '/api/ERPWeb/EngineItem/GetEngineModelByPage'
    return httpReq(url, 'get', params)
  },
  // 新增/编辑发动机型号
  addEngineModel: function (params) {
    let url = '/api/ERPWeb/EngineItem/AddModel'
    return httpReq(url, 'post', params)
  },
  // 删除发动机型号
  deleteEngineModel: function (params) {
    let url = '/api/ERPWeb/EngineItem/DeleteModel'
    return httpReq(url, 'post', params)
  }
}

// 发动机管理
const EngineManage = {
  // 查询发动机记录
  getEngineManage: function (params) {
    let url = '/api/ERPWeb/EngineManage/List'
    return httpReq(url, 'post', params)
  },
  // 新增/编辑发动机信息
  AddEngineManageInfo: function (params) {
    let url = '/api/ERPWeb/EngineManage/AddEngine'
    return httpReq(url, 'post', params)
  },
  // 发动机详情查看
  getEngineManageDetail: function (params) {
    let url = '/api/ERPWeb/EngineManage/Detail'
    return httpReq(url, 'get', params)
  },
  // 批量报废
  batchScrapEngine: function (params) {
    let url = '/api/ERPWeb/EngineManage/BatchScrap'
    return httpReq(url, 'post', params)
  },
  // 批量删除
  batchDeleteEngine: function (params) {
    let url = '/api/ERPWeb/EngineManage/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导出发动机记录
  exportEngineInfo: function (params) {
    let url = '/api/ERPWeb/EngineManage/Export'
    return httpReq(url, 'post', params)
  },
  // 获取车辆发动机记录
  getByVehIdEngineManage: function (params) {
    let url = '/api/ERPWeb/EngineManage/GetByVehId'
    return httpReq(url, 'post', params)
  }
}

// 车辆充电明细
const VehicleChargeDetail = {
  // 接收充电状态信息
  ReceiveEquipChargeStatusVehicleChargeDetail: function (params) {
    let url = '/api/ERPWeb/VehicleChargeDetail/ReceiveEquipChargeStatus'
    return httpReq(url, 'post', params)
  },
  // 接收充电订单信息
  ReceiveChargeOrderInfoVehicleChargeDetail: function (params) {
    let url = '/api/ERPWeb/VehicleChargeDetail/ReceiveChargeOrderInfo'
    return httpReq(url, 'post', params)
  },
  // 车辆充电明细
  ListVehicleChargeDetail: function (params) {
    let url = '/api/ERPWeb/VehicleChargeDetail/List'
    return httpReq(url, 'post', params)
  },
  // 删除车辆充电明细
  BatchDeleteVehicleChargeDetail: function (params) {
    let url = '/api/ERPWeb/VehicleChargeDetail/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入车辆充电明细
  ImportVehicleChargeDetail: function (params) {
    let url = '/api/ERPWeb/VehicleChargeDetail/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出车辆充电明细
  ExportVehicleChargeDetail: function (params) {
    let url = '/api/ERPWeb/VehicleChargeDetail/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆充电汇总
const VehicleChargeSummary = {
  // 获取车辆充电汇总
  ChargeSummaryVehicleChargeSummary: function (params) {
    let url = '/api/ERPWeb/VehicleChargeSummary/ChargeSummary'
    return httpReq(url, 'post', params)
  },
  // 获取车辆充电汇总列表
  ChargeListSummaryVehicleChargeSummary: function (params) {
    let url = '/api/ERPWeb/VehicleChargeSummary/ChargeListSummary'
    return httpReq(url, 'post', params)
  },
  // 导出车辆充电汇总
  exportVehicleChargeSummary: function (params) {
    let url = '/api/ERPWeb/VehicleChargeSummary/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆等级评定
const VehicleLevel = {
  // 获取车辆等级数据
  GetByPageVehicleLevel: function (params) {
    let url = '/api/ERPWeb/VehicleLevel/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增或编辑车辆等级记录
  SetRecordVehicleLevel: function (params) {
    let url = '/api/ERPWeb/VehicleLevel/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 删除车辆等级记录
  DeleteVehicleLevel: function (params) {
    let url = '/api/ERPWeb/VehicleLevel/Delete'
    return httpReq(url, 'post', params)
  },
  // 导出车辆等级评定数据
  ExportVehicleLevel: function (params) {
    let url = '/api/ERPWeb/VehicleLevel/Export'
    return httpReq(url, 'post', params)
  }
}

// 线路考核标准
const LineStandard = {
  // 获取线路规则数据
  GetDataLineStandard: function (params) {
    let url = '/api/ERPWeb/LineStandard/GetData'
    return httpReq(url, 'post', params)
  },
  // 新增或编辑线路规则
  SetRecordLineStandard: function (params) {
    let url = '/api/ERPWeb/LineStandard/SetRecord'
    return httpReq(url, 'post', params)
  },
  // 删除线路规则
  DeletePlanLineStandard: function (params) {
    let url = '/api/ERPWeb/LineStandard/DeletePlan'
    return httpReq(url, 'post', params)
  }
}

// 车辆重复维修标准
const VehReaRepair = {
  // 获取规则数据
  GetDataVehReaRepair: function (params) {
    let url = '/api/ERPWeb/VehReaRepair/GetData'
    return httpReq(url, 'get', params)
  },
  // 编辑规则
  SetRecordVehReaRepair: function (params) {
    let url = '/api/ERPWeb/VehReaRepair/SetRecord'
    return httpReq(url, 'post', params)
  }
}

// 车辆油耗录入
const VehicleOilRecord = {
  // 查询车辆油耗
  ListVehicleOilRecord: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecord/List'
    return httpReq(url, 'post', params)
  },
  // 添加/编辑车辆油耗
  AddOrEditVehicleOilRecord: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecord/AddOrEdit'
    // let url = '/api​/ERPWeb​/VehicleOilRecord/AddOrEdit'
    return httpReq(url, 'post', params)
  },
  // 批量删除车辆油耗
  BatchDeleteVehicleOilRecord: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecord/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入车辆油耗
  ImportVehicleOilRecord: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecord/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出车辆油耗
  ExportVehicleOilRecord: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecord/Export'
    return httpReq(url, 'post', params)
  },
  // 批量新增
  BatchCreateVehicleOilRecord: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecord/BatchCreate'
    return httpReq(url, 'post', params)
  }
}
//车辆气耗录入
const VehicleGas = {
  //校验记录是否已存在
  VerifyVehicleGasRecordExist: function (params) {
    let url = '/api/ERPWeb/VehicleGas/VerifyContains'
    return httpReq(url, 'post', params)
  },
  //分页查询车辆气耗记录
  ListVehicleGasRecord: function (params) {
    let url = '/api/ERPWeb/VehicleGas/GetPageList'
    return httpReq(url, 'post', params)
  },
  //不分页查询车辆气耗记录
  DataListVehicleGasRecord: function (params) {
    let url = '/api/ERPWeb/VehicleGas/GetDataList'
    return httpReq(url, 'post', params)
  },
  //添加 编辑气耗录入
  AddOrEditVehicleGasRecord: function (params) {
    let url = '/api/ERPWeb/VehicleGas/AddOrEdit'
    return httpReq(url, 'post', params)
  },
  //批量删除
  BatchDeleteVehicleGasRecord: function (params) {
    let url = '/api/ERPWeb/VehicleGas/BatchDelete'
    return httpReq(url, 'post', params)
  },
  //批量录入
  VehicleGasBatchInsert: function (params) {
    let url = '/api/ERPWeb/VehicleGas/BatchInsert'
    return httpReq(url, 'post', params)
  },
  //查看明细
  GetVehicleGasDetailList: function (params) {
    let url = '/api/ERPWeb/VehicleGas/GetDetailList'
    return httpReq(url, 'post', params)
  },
  //导出氢气消耗录入
  ExportVehicleGasRecord: function (params) {
    let url = '/api/ERPWeb/VehicleGas/ExportRecord'
    return httpReq(url, 'post', params)
  },
  //导入氢气消耗录入
  ImportVehicleGasRecord: function (params) {
    let url = '/api/ERPWeb/VehicleGas/ImportRecord'
    return httpReq(url, 'post', params)
  },
  //导出氢气消耗明细
  ExportVehicleGasDetail: function (params) {
    let url = '/api/ERPWeb/VehicleGas/ExportDetail'
    return httpReq(url, 'post', params)
  },
  //导入氢气消耗明细
  ImportVehicleGasDetail: function (params) {
    let url = '/api/ERPWeb/VehicleGas/ImportDetail'
    return httpReq(url, 'post', params)
  }
}
//车辆氢气录入
const VehicleHydrogen = {
  //校验数据是否已存在
  VerifyVehicleHydrogenRecordExist: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/VerifyContains'
    return httpReq(url, 'post', params)
  },
  //分页查询车辆氢气消耗记录
  ListVehicleHydrogenRecord: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/GetPageList'
    return httpReq(url, 'post', params)
  },
  //不分页查询车辆氢气消耗记录
  DataListVehicleHydrogenRecord: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/GetDataList'
    return httpReq(url, 'post', params)
  },
  //添加 编辑氢气录入
  AddOrEditVehicleHydrogenRecord: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/AddOrEdit'
    return httpReq(url, 'post', params)
  },
  //批量删除
  BatchDeleteVehicleHydrogenRecord: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/BatchDelete'
    return httpReq(url, 'post', params)
  },
  //消耗明细
  GetVehicleHydrogenDetailList: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/GetDetailList'
    return httpReq(url, 'post', params)
  },
  //批量添加
  VehicleHydrogenBatchInsert: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/BatchInsert'
    return httpReq(url, 'post', params)
  },
  //导出氢气消耗录入
  ExportVehicleHydrogenRecord: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/ExportRecord'
    return httpReq(url, 'post', params)
  },
  //导入氢气消耗录入
  ImportVehicleHydrogenRecord: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/ImportRecord'
    return httpReq(url, 'post', params)
  },
  //导出氢气消耗明细
  ExportVehicleHydrogenDetail: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/ExportDetail'
    return httpReq(url, 'post', params)
  },
  //导入氢气消耗明细
  ImportVehicleHydrogenDetail: function (params) {
    let url = '/api/ERPWeb/VehicleHydrogen/ImportDetail'
    return httpReq(url, 'post', params)
  }
}
// 车辆电耗录入
const VehicleElectricRecord = {
  // 查询车辆电耗
  ListVehicleElectricRecord: function (params) {
    let url = '/api/ERPWeb/VehicleElectricRecord/List'
    return httpReq(url, 'post', params)
  },
  // 添加/编辑车辆电耗
  AddOrEditVehicleElectricRecord: function (params) {
    let url = '/api/ERPWeb/VehicleElectricRecord/AddOrEdit'
    // let url = '/api​/ERPWeb​/VehicleElectricRecord/AddOrEdit'
    return httpReq(url, 'post', params)
  },
  // 批量删除车辆电耗
  BatchDeleteVehicleElectricRecord: function (params) {
    let url = '/api/ERPWeb/VehicleElectricRecord/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入车辆电耗
  ImportVehicleElectricRecord: function (params) {
    let url = '/api/ERPWeb/VehicleElectricRecord/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出车辆电耗
  ExportVehicleElectricRecord: function (params) {
    let url = '/api/ERPWeb/VehicleElectricRecord/Export'
    return httpReq(url, 'post', params)
  }
}
//分公司车辆每月分布情况表
const VehicleMonthDistributionReport = {
  GetVehicleMonthDistributionReport: function (params) {
    let url = '/api/ERPWeb/VehicleMonthDistributionReport/GetVehicleMonthDistributionReports'
    return httpReq(url, 'post', params)
  },
  // 获取车辆品牌型号列表数据
  GetDistinctVehicleModel: function (params) {
    let url = '/api/ERPWeb/VehicleMonthDistributionReport/GetDistinctVehicleModel'
    return httpReq(url, 'post', params)
  },
  // 获取车辆类型列表数据
  GetDistinctVehicleType: function (params) {
    let url = '/api/ERPWeb/VehicleMonthDistributionReport/GetDistinctVehicleType'
    return httpReq(url, 'post', params)
  }
}

// 车辆电耗录入（丽水）
const VehicleChargeEnter = {
  // 查询车辆电耗
  ListVehicleChargeEnter: function (params) {
    let url = '/api/ERPWeb/VehicleChargeEnter/List'
    return httpReq(url, 'post', params)
  },
  // 添加/编辑车辆电耗
  AddOrEditVehicleChargeEnter: function (params) {
    let url = '/api/ERPWeb/VehicleChargeEnter/AddOrEdit'
    return httpReq(url, 'post', params)
  },
  // 批量删除车辆电耗
  BatchDeleteVehicleChargeEnter: function (params) {
    let url = '/api/ERPWeb/VehicleChargeEnter/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入车辆电耗
  ImportVehicleChargeEnter: function (params) {
    let url = '/api/ERPWeb/VehicleChargeEnter/Import'
    return httpReq(url, 'postFile', params)
  },
  // 导出车辆电耗
  ExportVehicleChargeEnter: function (params) {
    let url = '/api/ERPWeb/VehicleChargeEnter/Export'
    return httpReq(url, 'post', params)
  }
}

// 车型维修统计
const VehicleKindRepairCount = {
  // 获取表头
  GetTitleVehicleKindRepairCount: function (params) {
    let url = '/api/ERPWeb/VehicleKindRepairCount/GetTitle'
    return httpReq(url, 'post', params)
  },
  // 获取车型维修统计
  GetTyreCountVehicleKindRepairCount: function (params) {
    let url = '/api/ERPWeb/VehicleKindRepairCount/GetTyreCount'
    return httpReq(url, 'post', params)
  },
  // 导出车型维修统计
  ExportVehicleKindRepairCount: function (params) {
    let url = '/api/ERPWeb/VehicleKindRepairCount/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆燃料消耗统计
const VehicleOilRecordSummary = {
  // 查询车辆燃料消耗统计
  VehicleOilSummatyVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/VehicleOilSummaty'
    return httpReq(url, 'post', params)
  },
  // 导出车辆消耗燃料统计
  ExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/Export'
    return httpReq(url, 'post', params)
  },
  // 车辆油耗统计
  OilSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/OilSummay'
    return httpReq(url, 'post', params)
  },
  // 导出车辆油耗消耗统计
  OilExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/OilExport'
    return httpReq(url, 'post', params)
  },
  // 车辆电耗统计
  ElectricSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/ElectricSummay'
    return httpReq(url, 'post', params)
  },
  // 导出车辆电耗消耗统计
  EleOilExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/EleOilExport'
    return httpReq(url, 'post', params)
  },
  // 车辆里程统计
  MileSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/MileSummay'
    return httpReq(url, 'post', params)
  },
  // 导出车辆里程统计
  MileExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/MileExport'
    return httpReq(url, 'post', params)
  },
  // 车辆里程明细
  MileDetailSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/MileDetailSummay'
    return httpReq(url, 'post', params)
  },
  // 导出车辆里程明细
  MileDetailExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/MileDetailExport'
    return httpReq(url, 'post', params)
  },
  // 司机里程统计
  DriverMileSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/DriverMileSummay'
    return httpReq(url, 'post', params)
  },
  // 导出司机里程统计
  DriverMileExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/DriverMileExport'
    return httpReq(url, 'post', params)
  },
  // 单个司机里程统计
  DriverDetailMileSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/DriverDetailMileSummay'
    return httpReq(url, 'post', params)
  },
  // 单个司机里程详细统计
  DriverTripMileSummayVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/DriverTripMileSummay'
    return httpReq(url, 'post', params)
  },
  // 导出单个司机里程统计
  DriverMileDetailExportVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/DriverMileDetailExport'
    return httpReq(url, 'post', params)
  },
  // 重新计算里程统计
  ReCountMileVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/ReCountMile'
    return httpReq(url, 'post', params)
  },
  // 更新里程明细
  UpdateMileDetailVehicleOilRecordSummary: function (params) {
    let url = '/api/ERPWeb/VehicleOilRecordSummary/UpdateMileDetail'
    return httpReq(url, 'post', params)
  }
}

// 维修废料管理
const MaintRepairWaste = {
  // 分页获取
  GetByPageMaintRepairWaste: function (params) {
    let url = '/api/ERPWeb/MaintRepairWaste/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增/编辑
  CreateOrUpdateMaintRepairWaste: function (params) {
    let url = '/api/ERPWeb/MaintRepairWaste/CreateOrUpdate'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeleteMaintRepairWaste: function (params) {
    let url = '/api/ERPWeb/MaintRepairWaste/Delete'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportMaintRepairWaste: function (params) {
    let url = '/api/ERPWeb/MaintRepairWaste/Export'
    return httpReq(url, 'post', params)
  },
  // 导入
  ImportInfoMaintRepairWaste: function (params) {
    let url = '/api/ERPWeb/MaintRepairWaste/ImportInfo'
    return httpReq(url, 'postFile', params)
  }
}

// 车辆保养计划执行统计
const UKPlanExcute = {
  // 保养计划执行记录查询
  GetDataUKPlanExcute: function (params) {
    let url = '/api/ERPWeb/UKPlanExcute/GetData'
    return httpReq(url, 'post', params)
  },
  // 数据导出
  ExportUKPlanExcute: function (params) {
    let url = '/api/ERPWeb/UKPlanExcute/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆保养维护统计
const VehicleKeepRepair = {
  // 查询数据
  GetDataVehicleKeepRepair: function (params) {
    let url = '/api/ERPWeb/VehicleKeepRepair/GetData'
    return httpReq(url, 'post', params)
  },
  // 数据导出
  ExportVehicleKeepRepair: function (params) {
    let url = '/api/ERPWeb/VehicleKeepRepair/Export'
    return httpReq(url, 'post', params)
  }
}

// 车辆燃料消耗月统计报表
const GetErpFuelMonthReports = {
  // 查询数据
  GetErpFuelMonthReports: function (params) {
    let url = '/api/ERPWeb/ErpFuelMonthReport/GetErpFuelMonthReports'
    return httpReq(url, 'post', params)
  },
  // 数据导出
  ExportErpFuelMonthReport: function (params) {
    let url = '/api/ERPWeb/ErpFuelMonthReport/Export'
    return httpReq(url, 'post', params)
  },
  // 车辆型号获取（崔旭林写只针对此表单）
  GetVehicleModelsErpFuelMonthReport: function (params) {
    let url = '/api/ERPWeb/ErpFuelMonthReport/GetVehicleModels'
    return httpReq(url, 'get', params)
  },
  // 燃料类型获取（崔旭林写只针对此表单）
  GetFuelTypesErpFuelMonthReport: function (params) {
    let url = '/api/ERPWeb/ErpFuelMonthReport/GetFuelTypes'
    return httpReq(url, 'get', params)
  },
  // 车辆类型获取（崔旭林写只针对此表单）
  GetVehicleTypesErpFuelMonthReport: function (params) {
    let url = '/api/ERPWeb/ErpFuelMonthReport/GetVehicleTypes'
    return httpReq(url, 'get', params)
  }
}

// 年度燃料消耗，维保费统计
const GetAnnualFuelConsumptionReports = {
  // 年度燃料消耗统计报表
  GetAnnualFuelConsumption: function (params) {
    let url = '/api/ERPWeb/AnnualFuelConsumption/GetAnnualFuelConsumptionReports'
    return httpReq(url, 'post', params)
  },
  // 年度燃料消耗明细数据
  GetAnnualDetailAnnualFuelConsumption: function (params) {
    let url = '/api/ERPWeb/AnnualFuelConsumption/GetAnnualFuelConsumptionDetailReports'
    return httpReq(url, 'post', params)
  },
  // 查询有效里程明细数据
  GetEffectDetailAnnualFuelConsumption: function (params) {
    let url = '/api/ERPWeb/AnnualFuelConsumption/GetEffectMileDataDetailReports'
    return httpReq(url, 'post', params)
  },
  // GPS里程车辆明细数据
  GetGpsDetailAnnualFuelConsumption: function (params) {
    let url = '/api/ERPWeb/AnnualFuelConsumption/GetGpsMileDataDetailReports'
    return httpReq(url, 'post', params)
  }
}

// 年度燃料消耗，维保费统计
const RegisteredVehicleReport = {
  // 查询数据
  GetRegisteredVehicleReports: function (params) {
    let url = '/api/ERPWeb/RegisteredVehicleReport/GetRegisteredVehicleReports'
    return httpReq(url, 'post', params)
  },
  // 获取常住人口数
  GetPersonRegisteredVehicleReport: function (params) {
    let url = '/api/ERPWeb/RegisteredVehicleReport/GetPerson'
    return httpReq(url, 'post', params)
  },
  // 跟新常住人口数
  UpdatePersonRegisteredVehicleReport: function (params) {
    let url = '/api/ERPWeb/RegisteredVehicleReport/UpdatePerson'
    return httpReq(url, 'post', params)
  }
}

// 各批次车辆型号燃料，里程消耗统计
const VehicleModelBatchReport = {
  // 查询数据
  GetVehicleModelBatchReports: function (params) {
    let url = '/api/ERPWeb/VehicleModelBatchReport/GetVehicleModelBatchReports'
    return httpReq(url, 'post', params)
  }
}

// 获取燃料价格
const MaintenanceReportSetting = {
  // 查询数据
  GetMaintenanceReportSetting: function (params) {
    let url = '/api/ERPWeb/FuelPriceSetting/GetFuelPriceSetting'
    return httpReq(url, 'post', params)
  },
  // 跟新
  UpdateFuelPriceSetting: function (params) {
    let url = '/api/ERPWeb/FuelPriceSetting/UpdateFuelPriceSetting'
    return httpReq(url, 'post', params)
  }
}

// 车辆调动汇总
const TransferSummaryReport = {
  // 查询数据
  GetTransferSummaryReports: function (params) {
    let url = '/api/ERPWeb/TransferSummaryReport/GetTransferSummaryReports'
    return httpReq(url, 'post', params)
  },
  // 导出数据
  ExportTransferSummaryReport: function (params) {
    let url = '/api/ERPWeb/TransferSummaryReport/Export'
    return httpReq(url, 'post', params)
  }
}

// 获取车辆保有量统计报表数据
const VehicleInventoryReport = {
  // 查询数据
  GetVehicleInventoryReports: function (params) {
    let url = '/api/ERPWeb/VehicleInventoryReport/GetVehicleInventoryReports'
    return httpReq(url, 'post', params)
  }
}
// 各车型燃料消耗汇总
const VehicleModelFuelConsumptionReport = {
  // 查询数据
  GetVehicleModelFuelConsumptionReports: function (params) {
    let url = '/api/ERPWeb/VehicleModelFuelConsumptionReport/GetVehicleModelFuelConsumptionReports'
    return httpReq(url, 'post', params)
  }
}

// 在册车辆座位数统计表
const VehicleRegisteredSeatsReport = {
  // 查询数据
  GetVehicleRegisteredSeatsReports: function (params) {
    let url = '/api/ERPWeb/VehicleRegisteredSeatsReport/GetVehicleRegisteredSeatsReports'
    return httpReq(url, 'post', params)
  }
}

// 燃气规则
const GasManage = {
  // 规则
  // 获取燃气规则
  GetListGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/GetList'
    return httpReq(url, 'get', params)
  },
  // 添加/编辑
  AddOrUpdateRuleGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/AddOrUpdateRule'
    return httpReq(url, 'post', params)
  },
  // 启用/停用
  EnabRuleGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/EnabRule'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeleteRuleGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/DeleteRule'
    return httpReq(url, 'post', params)
  },

  // 气瓶
  // 分页获取
  GetByPageGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 新增 / 编辑
  AddOrUpdateAirBottle: function (params) {
    let url = '/api/ERPWeb/GasManage/AddOrUpdateAirBottle'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeleteAirBottle: function (params) {
    let url = '/api/ERPWeb/GasManage/DeleteAirBottle'
    return httpReq(url, 'post', params)
  },
  // 停用
  StopAirBottle: function (params) {
    let url = '/api/ERPWeb/GasManage/StopAirBottle'
    return httpReq(url, 'post', params)
  },
  // 批量检验
  BatchCheckGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/BatchCheck'
    return httpReq(url, 'post', params)
  },
  // 检验导出
  CheckExportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/CheckExport'
    return httpReq(url, 'post', params)
  },
  // 批量检验导入
  CheckImportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/CheckImport'
    return httpReq(url, 'postFile', params)
  },
  // 导入
  AirImportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/AirImport'
    return httpReq(url, 'postFile', params)
  },
  // 导出
  AirExportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/AirExport'
    return httpReq(url, 'post', params)
  },

  // 压力表
  // 分页查询
  GetPressureGageByPage: function (params) {
    let url = '/api/ERPWeb/GasManage/GetByPagePressureGage'
    return httpReq(url, 'post', params)
  },
  // 新增 / 编辑
  AddOrUpdatePressureGage: function (params) {
    let url = '/api/ERPWeb/GasManage/AddOrUpdatePressureGage'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeletePressureGage: function (params) {
    let url = '/api/ERPWeb/GasManage/DeletePressureGage'
    return httpReq(url, 'post', params)
  },
  // 批量检验
  BatchCheckPressureGage: function (params) {
    let url = '/api/ERPWeb/GasManage/BatchCheckPressureGage'
    return httpReq(url, 'post', params)
  },
  // 检验导出
  CheckExportPressureGage: function (params) {
    let url = '/api/ERPWeb/GasManage/CheckExportGage'
    return httpReq(url, 'post', params)
  },
  // 批量检验导入
  CheckImportPressureGage: function (params) {
    let url = '/api/ERPWeb/GasManage/CheckImportGage'
    return httpReq(url, 'postFile', params)
  },
  // 导入
  PressureGageImportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/GageImport'
    return httpReq(url, 'postFile', params)
  },
  // 导出
  PressureGageExportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/GageExport'
    return httpReq(url, 'post', params)
  },

  // 安全阀
  // 分页查询
  GetSafetyValveByPage: function (params) {
    let url = '/api/ERPWeb/GasManage/GetByPageSafetyValve'
    return httpReq(url, 'post', params)
  },
  // 新增 / 编辑
  AddOrUpdateSafetyValve: function (params) {
    let url = '/api/ERPWeb/GasManage/AddOrUpdateSafetyValve'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeleteSafetyValve: function (params) {
    let url = '/api/ERPWeb/GasManage/DeleteSafetyValve'
    return httpReq(url, 'post', params)
  },
  // 批量检验
  BatchCheckSafetyValve: function (params) {
    let url = '/api/ERPWeb/GasManage/BatchCheckSafetyValve'
    return httpReq(url, 'post', params)
  },
  // 检验导出
  CheckExportSafetyValve: function (params) {
    let url = '/api/ERPWeb/GasManage/CheckExportSafety'
    return httpReq(url, 'post', params)
  },
  // 批量检验导入
  CheckImportSafetyValve: function (params) {
    let url = '/api/ERPWeb/GasManage/CheckImportSafety'
    return httpReq(url, 'postFile', params)
  },
  // 导入
  SafetyValveImportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/SafetyImport'
    return httpReq(url, 'postFile', params)
  },
  // 导出
  SafetyValveExportGasManage: function (params) {
    let url = '/api/ERPWeb/GasManage/SafetyExport'
    return httpReq(url, 'post', params)
  }
}

// 一日三检
const DayCheck = {
  // 检查内容
  // 获取
  GetByPageDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetByPage'
    return httpReq(url, 'post', params)
  },
  // 添加/编辑
  AddOrUpdateDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/AddOrUpdate'
    return httpReq(url, 'post', params)
  },
  // 删除
  BatchDeleteDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/BatchDelete'
    return httpReq(url, 'post', params)
  },
  // 导入
  ImportDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/Import'
    return httpReq(url, 'postFile', params)
  },

  // 检查模板
  // 获取
  GetCheckTemplateTreesDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetCheckTemplateTrees'
    return httpReq(url, 'get', params)
  },
  // 获取详情
  GetContentsByTemplateIdDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetContentsByTemplateId'
    return httpReq(url, 'get', params)
  },
  // 新增或编辑模板
  AddOrUpdateTemplateDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/AddOrUpdateTemplate'
    return httpReq(url, 'post', params)
  },
  // 删除
  DeleteTemplateDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/DeleteTemplate'
    return httpReq(url, 'post', params)
  },
  // 新增或编辑模板关联项目
  AddOrUpdateTemplateContent: function (params) {
    let url = '/api/ERPWeb/DayCheck/AddOrUpdateTemplateContent'
    return httpReq(url, 'post', params)
  },
  // 排序
  SortTemplateContent: function (params) {
    let url = '/api/ERPWeb/DayCheck/SortTemplateContent'
    return httpReq(url, 'post', params)
  },

  // 统计表

  // 根据 id 获取详情
  GetCheckDetailDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetCheckDetail'
    return httpReq(url, 'get', params)
  },
  // 分页获取内容
  GetDayCheckTotalsWeb: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetDayCheckTotalsWeb'
    return httpReq(url, 'post', params)
  },
  // 处理
  UpdateHandleStateDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/UpdateHandleState'
    return httpReq(url, 'post', params)
  },
  // 获取检查情况首页标题
  GetDayCheckWebTitle: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetDayCheckWebTitle'
    return httpReq(url, 'get', params)
  },
  // 首页获取待处理事项
  GetWaitHandleDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetWaitHandle'
    return httpReq(url, 'get', params)
  },
  // 获取提醒规则
  GetWarnDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetWarn'
    return httpReq(url, 'get', params)
  },
  // 新增提醒规则
  AddOrUpdateWarnDayCheck: function (params) {
    let url = '/api/ERPWeb/DayCheck/AddOrUpdateWarn'
    return httpReq(url, 'post', params)
  },
  // 获取检查情况首页柱状图统计
  GetDayCheckImageToal: function (params) {
    let url = '/api/ERPWeb/DayCheck/GetDayCheckImageToal'
    return httpReq(url, 'get', params)
  },
  // 导出
  DayCheckExport: function (params) {
    let url = '/api/ERPWeb/DayCheck/DayCheckExport'
    return httpReq(url, 'post', params)
  }
}

// 动力电池管理
const PowerBattery = {
  // 获取动力电池列表数据
  GetListPowerBattery: function (params) {
    let url = '/api/ERPWeb/PowerBattery/GetList'
    return httpReq(url, 'post', params)
  },
  // 获取详情
  GetDetailPowerBattery: function (params) {
    let url = '/api/ERPWeb/PowerBattery/GetDetail'
    return httpReq(url, 'get', params)
  },
  // 单条新增
  SingleInsertPowerBattery: function (params) {
    let url = '/api/ERPWeb/PowerBattery/SingleInsert'
    return httpReq(url, 'post', params)
  },
  // 单条编辑
  SingleUpdatePowerBattery: function (params) {
    let url = '/api/ERPWeb/PowerBattery/SingleUpdate'
    return httpReq(url, 'post', params)
  },
  // 批量删除
  DeletePowerBattery: function (params) {
    let url = '/api/ERPWeb/PowerBattery/Delete'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportPowerBattery: function (params) {
    let url = '/api/ERPWeb/PowerBattery/Export'
    return httpReq(url, 'post', params)
  }
}

// 动力电池报废管理
const PowerBatteryScrap = {
  // 获取动力电池报废列表数据
  GetListPowerBatteryScrap: function (params) {
    let url = '/api/ERPWeb/PowerBatteryScrap/GetList'
    return httpReq(url, 'post', params)
  },
  // 获取详情
  GetDetailPowerBatteryScrap: function (params) {
    let url = '/api/ERPWeb/PowerBatteryScrap/GetDetail'
    return httpReq(url, 'get', params)
  },
  // 批量编辑
  UpdatePowerBatteryScrap: function (params) {
    let url = '/api/ERPWeb/PowerBatteryScrap/Update'
    return httpReq(url, 'post', params)
  },
  // 批量删除
  DeletePowerBatteryScrap: function (params) {
    let url = '/api/ERPWeb/PowerBatteryScrap/Delete'
    return httpReq(url, 'post', params)
  },
  // 导出
  ExportPowerBatteryScrap: function (params) {
    let url = '/api/ERPWeb/PowerBatteryScrap/Export'
    return httpReq(url, 'post', params)
  }
}

// 机务管理
const MaintainManage = {
  ...BatBottle,
  ...BatteryManage,
  ...ContainerManage,
  ...MaintainProject,
  ...MaintainFaultDiagnosis,
  ...MaintainKind,
  ...MaintainOrg,
  ...TyreFail,
  ...TyreManage,
  ...TyreModel,
  ...CheckPlan,
  ...DiscardPlan,
  ...UpKeepPlan,
  ...VehicleManager,
  ...MaintCheckRule,
  ...MaintDiscardRule,
  ...MaintMaintainRule,
  ...VehicleMileManage,
  ...EngineItem,
  ...EngineManage,
  ...VehicleChargeDetail,
  ...VehicleChargeSummary,
  ...VehicleLevel,
  ...LineStandard,
  ...VehReaRepair,
  ...VehicleOilRecord,
  ...VehicleGas,
  ...VehicleHydrogen,
  ...VehicleElectricRecord,
  ...VehicleChargeEnter,
  ...VehicleKindRepairCount,
  ...VehicleOilRecordSummary,
  ...MaintRepairWaste,
  ...UKPlanExcute,
  ...VehicleKeepRepair,
  ...GetErpFuelMonthReports,
  ...GetAnnualFuelConsumptionReports,
  ...RegisteredVehicleReport,
  ...VehicleModelBatchReport,
  ...MaintenanceReportSetting,
  ...TransferSummaryReport,
  ...VehicleMonthDistributionReport,
  ...VehicleInventoryReport,
  ...VehicleRegisteredSeatsReport,
  ...VehicleModelFuelConsumptionReport,
  ...GasManage,
  ...DayCheck,
  ...PowerBattery,
  ...PowerBatteryScrap
}

export default MaintainManage
