import httpReq from "../http";

const Provider = {
  //供应商管理
  GetProviderPage: function (params) {
    let url = '/api/ERPWeb/Provider/GetByPage';
    return httpReq(url, 'post', params);
  },
  //供应商字典
  GetProviderSymple: function (params) {
    let url = '/api/ERPWeb/Provider/GetSymple';
    return httpReq(url, 'post', params);
  },
  //供应商添加编辑
  GetProviderSetRecord: function (params) {
    let url = '/api/ERPWeb/Provider/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 供应商删除
  DeleteProviderRecord: function (params) {
    let url = '/api/ERPWeb/Provider/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 导出车辆数据
  ExportProviderExport: function (params) {
    let url = '/api/ERPWeb/Provider/Export';
    return httpReq(url, 'post', params);
  },
  // 供应商启用状态
  SetProviderUsablet: function (params) {
    let url = `/api/ERPWeb/Provider/SetUsable`;
    return httpReq(url, 'get', params);
  },
}
//物料管理
const Material = {
  // 获取物料分组树
  GetMaterialGroup: function (params) {
    let url = '/api/ERPWeb/Material/GetGroup';
    return httpReq(url, 'get', params);
  },
  // 物料设置可用性
  setUsableMaterial: function (params) {
    let url = '/api/ERPWeb/Material/SetUsable';
    return httpReq(url, 'get', params);
  },
  // 新增编辑 物料分组树
  SetMaterialGroup: function (params) {
    let url = '/api/ERPWeb/Material/SetGroup'
    return httpReq(url, 'post', params);
  },
  // 删除分组树
  deleteMaterialGroup: function (params) {
    let url = '/api/ERPWeb/Material/DeleteGroup'
    return httpReq(url, 'post', params);
  },
  // 获取物料信息
  getMaterialPage: function (params) {
    let url = '/api/ERPWeb/Material/GetByPage'
    return httpReq(url, 'post', params);
  },
  // 新增编辑物料信息
  setRecordMaterial: function (params) {
    let url = '/api/ERPWeb/Material/SetRecord'
    return httpReq(url, 'post', params);
  },
  // 删除编辑物料信息
  deleteRecordMaterial: function (params) {
    let url = '/api/ERPWeb/Material/DeleteRecord'
    return httpReq(url, 'post', params);
  },
  // 物料信息数据导出
  exportMaterial: function (params) {
    let url = '/api/ERPWeb/Material/Export'
    return httpReq(url, 'post', params);
  },
  // 物料信息数据导入
  importMaterial: function (params) {
    let url = '/api/ERPWeb/Material/Import'
    return httpReq(url, 'postFile', params);
  },
}
const Store = {
  // 判断是否为仓库人员
  confirmWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/Confirm';
    return httpReq(url, 'get', params);
  },
  // 获取当前用户仓库
  GetUserWHWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/GetUserWH';
    return httpReq(url, 'get', params);
  },
  // 获取仓库分组树
  getDeptTreeWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/GetDeptTree';
    return httpReq(url, 'get', params);
  },
  // 仓库初始化
  setInitWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/SetInit';
    return httpReq(url, 'get', params);
  },
  // 新增仓库分组树
  setRecordWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 获取仓库详情信息
  getRecordWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/GetRecord';
    return httpReq(url, 'get', params);
  },
  // 获取仓库简要信息
  getRecord1Warehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/GetRecord1';
    return httpReq(url, 'get', params);
  },
  // 删除仓库
  deleteRecordWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 新增人员
  addPersonWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/AddPerson';
    return httpReq(url, 'post', params);
  },
  // 删除仓库
  deletePersonWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/DeletePerson';
    return httpReq(url, 'post', params);
  },
  // 设置取消仓管员
  setOperatorWarehouse: function (params) {
    let url = '/api/ERPWeb/Warehouse/SetOperator';
    return httpReq(url, 'get', params);
  },
  // 获取所有仓库所有人员
  GetWHPerson: function (params) {
    let url = '/api/ERPWeb/Warehouse/GetWHPerson';
    return httpReq(url, 'get', params);
  },
}
//仓库初始化录入
const initialization = {
  // 获取仓库初始化信息
  getByPageHouseInit: function (params) {
    let url = '/api/ERPWeb/HouseInit/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑仓库
  setRecordHouseInit: function (params) {
    let url = '/api/ERPWeb/HouseInit/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 删除仓库
  deleteRecordHouseInit: function (params) {
    let url = '/api/ERPWeb/HouseInit/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 导出初始化仓库
  exportHouseInit: function (params) {
    let url = '/api/ERPWeb/HouseInit/Export';
    return httpReq(url, 'post', params);
  },
  // 导入初始化仓库
  importHouseInit: function (params) {
    let url = '/api/ERPWeb/HouseInit/Import';
    return httpReq(url, 'postFile', params);
  },
}
//入库管理
const stockControl = {
  // 入库查询
  getByPageEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 编辑入库
  setRecordEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 获取入库某一详情数据
  getDataEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/GetData';
    return httpReq(url, 'get', params);
  },
  // 导出入库信息
  exportEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/Export';
    return httpReq(url, 'post', params);
  },
  // 审核入库信息
  reviewRecordEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/ReviewRecord';
    return httpReq(url, 'post', params);
  },
  // 删除入库信息
  deleteRecordEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 根据流程审批入库
  AddByFlowEnterHouse: function (params) {
    let url = '/api/ERPWeb/EnterHouse/AddByFlow';
    return httpReq(url, 'post', params);
  },
}

// 调拨单管理
const InventoryTrans = {
  // 查询
  GetByPageInventoryTrans: function (params) {
    let url = '/api/ERPWeb/InventoryTrans/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取详情
  GetRecordInventoryTrans: function (params) {
    let url = '/api/ERPWeb/InventoryTrans/GetRecord';
    return httpReq(url, 'get', params);
  },
  // 编辑出库
  SetRecordInventoryTrans: function (params) {
    let url = '/api/ERPWeb/InventoryTrans/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 审核出库信息
  GetReviewInventoryTrans: function (params) {
    let url = '/api/ERPWeb/InventoryTrans/GetReview';
    return httpReq(url, 'post', params);
  },
  //删除出库信息
  DeleteInventoryTrans: function (params) {
    let url = '/api/ERPWeb/InventoryTrans/Delete';
    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportInventoryTrans: function (params) {
    let url = '/api/ERPWeb/InventoryTrans/Export';
    return httpReq(url, 'post', params);
  },
}

//出库管理
const stockremoval = {
  // 出库查询
  getByPageLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取出库某一详情数据
  getDataLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/GetData';
    return httpReq(url, 'get', params);
  },
  // 编辑出库
  setRecordLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 审核出库信息
  reviewRecordLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/ReviewRecord';
    return httpReq(url, 'post', params);
  },
  // 导出入库信息
  exportLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/Export';
    return httpReq(url, 'post', params);
  },
  // 导出入库信息    丽水专用
  exportLeaveHouseLiShui: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/ExportLiShui';
    return httpReq(url, 'post', params);
  },
  //删除出库信息
  deleteRecordLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  //物料出库信息
  getPartInfoLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/GetPartInfo';
    return httpReq(url, 'get', params);
  },
  //获取已审核出库单数据
  getRecordLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/getRecord';
    return httpReq(url, 'get', params);
  },
  // 根据流程审批出库
  AddByFlowLeaveHouse: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/AddByFlow';
    return httpReq(url, 'post', params);
  },
  // 出库明细
  GetLeaveDetailStatic: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/GetLeaveDetailStatic';
    return httpReq(url, 'post', params);
  },
  // 出库明细导出
  LeaveDetailExport: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/LeaveDetailExport';
    return httpReq(url, 'post', params);
  },
  // 获取出库记录统计 新
  GetLeaceDetailStatistic: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/GetLeaceDetailStatistic';
    return httpReq(url, 'post', params);
  },
  // 出库记录统计导出 新
  LeaceDetailStatisticExport: function (params) {
    let url = '/api/ERPWeb/LeaveHouse/LeaceDetailStatisticExport';
    return httpReq(url, 'post', params);
  }
}
// 即时库存查询
const nowInventory = {
  // 获取某物料当月统计数
  getDetailCountTimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetDetailCount';
    return httpReq(url, 'get', params);
  },
  // 获取当月统计数
  getCountTimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetCount';
    return httpReq(url, 'get', params);
  },
  // 获取不按批次号数据
  getByPage1TimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetByPage1';
    return httpReq(url, 'post', params);
  },
  //获取按批次号数据
  getByPageTimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetByPage';
    return httpReq(url, 'post', params);
  },
  //物料字典
  GetSimpleMaterial: function (params) {
    let url = '/api/ERPWeb/Material/GetSimple';
    return httpReq(url, 'post', params);
  },
  //库存字典
  GetSimpleTimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetSimple';
    return httpReq(url, 'post', params);
  },
  //获取单物料信息
  GetSingleMaterial: function (params) {
    let url = '/api/ERPWeb/Material/GetSingle';
    return httpReq(url, 'post', params);
  },
  // 不按批次号导出
  export1TimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/Export1';
    return httpReq(url, 'post', params);
  },
  // 不按批次号导出
  exportTimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/Export';
    return httpReq(url, 'post', params);
  },
  //某物料导出
  export2TimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/Export2';
    return httpReq(url, 'post', params);
  },
  // 获取某物料明细数据
  getDetailDataTimerHouse: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetDetailData';
    return httpReq(url, 'post', params);
  },
  // 物料收发汇总
  GetMaterialReceiveList: function (params) {
    let url = '/api/ERPWeb/TimerHouse/GetMaterialReceiveList';
    return httpReq(url, 'post', params);
  },
  // 物料收发汇总
  ExportMaterialReceiveLis: function (params) {
    let url = '/api/ERPWeb/TimerHouse/ExportMaterialReceiveLis';
    return httpReq(url, 'post', params);
  },
}
// 轮胎出库明细报表
const TireDetail = {
  // 获取数据
  GetDataTireDetail: function (params) {
    let url = '/api/ERPWeb/TireDetail/GetData';
    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportTireDetail: function (params) {
    let url = '/api/ERPWeb/TireDetail/Export';
    return httpReq(url, 'post', params);
  },
}

// 库存月结查询
const TimerBackup = {
  //获取按批次号数据
  GetByPageTimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取不按批次号数据
  GetByPage1TimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/GetByPage1';
    return httpReq(url, 'post', params);
  },
  // 获取当月统计数
  GetCountTimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/GetCount';
    return httpReq(url, 'get', params);
  },
  // 获取某物料当月统计数
  GetDetailCountTimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/GetDetailCount';
    return httpReq(url, 'get', params);
  },
  // 获取某物料明细数据
  GetDetailDataTimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/GetDetailData';
    return httpReq(url, 'post', params);
  },
  // 不按批次号导出
  ExportTimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/Export';
    return httpReq(url, 'post', params);
  },
  // 不按批次号导出
  Export1TimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/Export1';
    return httpReq(url, 'post', params);
  },
  //某物料导出
  Export2TimerBackup: function (params) {
    let url = '/api/ERPWeb/TimerBackup/Export2';
    return httpReq(url, 'post', params);
  },
}

// 采购订单管理
const PurchaseOrder = {
  // 分页查询(全部/待提交)
  GetByPagePurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 分页查询待我处理
  GetWaitMeByPagePurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/GetWaitMeByPage';
    return httpReq(url, 'post', params);
  },
  // 分页查询我已处理
  GetFinishByPagePurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/GetFinishByPage';
    return httpReq(url, 'post', params);
  },
  // 分页查询我提交的
  GetSubmitByPagePurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/GetSubmitByPage';
    return httpReq(url, 'post', params);
  },
  // 分页查询待提交
  GetNoSubmitByPagePurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/GetNoSubmitByPage';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑草稿
  CreateOrUpdateReqPurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/CreateOrUpdateReq';
    return httpReq(url, 'post', params);
  },
  // 提交审核
  SubmitPurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/Submit';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeletePurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/Delete';
    return httpReq(url, 'post', params);
  },
  // 查看详情
  LookDetailPurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 获取自己保存的草稿
  GetByUserPurchaseOrder: function (params) {
    let url = '/api/ERPWeb/PurchaseOrder/GetByUser';
    return httpReq(url, 'get', params);
  },
}

// 盘点管理
const WarehouseCheck = {
  // 分页获取主表
  GetByPageWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 分页获取明细
  GetDetailByPageWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/GetDetailByPage';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑
  CreateOrUpdateWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/CreateOrUpdate';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/Delete';
    return httpReq(url, 'post', params);
  },
  // 导出
  ExportWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/Export';
    return httpReq(url, 'post', params);
  },
  // 导出明细
  ExportDetailWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/ExportDetail';
    return httpReq(url, 'post', params);
  },
  // 审核盘点记录
  ReviewRecordWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/ReviewRecord';
    return httpReq(url, 'post', params);
  },
  // 物料导出
  ImportWarehouseCheck: function (params) {
    let url = '/api/ERPWeb/WarehouseCheck/Import';
    return httpReq(url, 'postFile', params);
  },
}

// 单车维修费用汇总
const VehicleRepair = {
  // 分页获取数据
  GetDataVehicleRepair: function (params) {
    let url = '/api/ERPWeb/VehicleRepair/GetData';
    return httpReq(url, 'post', params);
  },
  // 导出数据
  ExportVehicleRepair: function (params) {
    let url = '/api/ERPWeb/VehicleRepair/Export';
    return httpReq(url, 'post', params);
  }
}

// 维修配件出库明细
const RepairParts = {
  // 维修配件数据获取
  GetDataRepairParts: function (params) {
    let url = '/api/ERPWeb/RepairParts/GetData';
    return httpReq(url, 'post', params);
  },
  // 导出数据
  ExportRepairParts: function (params) {
    let url = '/api/ERPWeb/RepairParts/Export';
    return httpReq(url, 'post', params);
  }
}

// 维修配件入库明细
const RepairEnterParts = {
  // 维修配件数据获取
  GetDataRepairEnterParts: function (params) {
    let url = '/api/ERPWeb/RepairEnterParts/GetData';
    return httpReq(url, 'post', params);
  },
  // 导出数据
  ExportRepairEnterParts: function (params) {
    let url = '/api/ERPWeb/RepairEnterParts/Export';
    return httpReq(url, 'post', params);
  },
  // 导出数据---丽水专用
  ExportRepairEnterPartsLiShui: function (params) {
    let url = '/api/ERPWeb/RepairEnterParts/ExportLiShui';
    return httpReq(url, 'post', params);
  },
  // 获取工时明细(报修工单管理下)
  GetRepairHourDetailsMaintRepairOrder: function (params) {
    let url = '/api/ERPWeb/MaintRepairOrder/GetRepairHourDetails';
    return httpReq(url, 'post', params);
  },
  // 维修工时明细导出(报修工单管理下)
  ExportRepairDetailMaintRepairOrder: function (params) {
    let url = '/api/ERPWeb/MaintRepairOrder/ExportRepairDetail';
    return httpReq(url, 'post', params);
  },
  // 维修工时明细工时编辑(报修工单管理下)
  UpdateItemHoursMaintRepairOrder: function (params) {
    let url = '/api/ERPWeb/MaintRepairOrder/UpdateItemHours';
    return httpReq(url, 'post', params);
  },
}

// 轮胎月结统计
const TireMonthStatistic = {
  // 获取轮胎月结统计
  GetByPageTireMonthStatistic: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 导出数据
  ExportTireMonthStatistic: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/Export';
    return httpReq(url, 'post', params);
  },
  // 获取入库明细
  GetEnterByPage: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/GetEnterByPage';
    return httpReq(url, 'post', params);
  },
  // 导出入库明细
  EnterExportTireMonthStatistic: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/EnterExport';
    return httpReq(url, 'post', params);
  },
  // 获取出库明细
  GetOutByPage: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/GetOutByPage';
    return httpReq(url, 'post', params);
  },
  // 导出出库明细
  OutExportTireMonthStatistic: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/OutExport';
    return httpReq(url, 'post', params);
  },
  // 获取盘点明细
  GetInventoryByPage: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/GetInventoryByPage';
    return httpReq(url, 'post', params);
  },
  // 导出盘点明细
  InventoryExportTireMonthStatistic: function (params) {
    let url = '/api/ERPWeb/TireMonthStatistic/InventoryExport';
    return httpReq(url, 'post', params);
  },
}

// 考核内容管理
const AssessContent = {
  // 获取考核类型树
  GetAssessGroupTree: function (params) {
    let url = '/api/ERPWeb/AssessContent/GetAssessGroupTree';
    return httpReq(url, 'get', params);
  },
  // 添加考核类型
  AddAssessGroup: function (params) {
    let url = '/api/ERPWeb/AssessContent/AddAssessGroup';
    return httpReq(url, 'post', params);
  },
  // 修改考核类型
  UpdateAssessGroup: function (params) {
    let url = '/api/ERPWeb/AssessContent/UpdateAssessGroup';
    return httpReq(url, 'post', params);
  },
  // 删除考核类型
  DeleteAssessGroup: function (params) {
    let url = '/api/ERPWeb/AssessContent/DeleteAssessGroup';
    return httpReq(url, 'post', params);
  },
  // 分页查询考核内容
  GetAssessContentByPage: function (params) {
    let url = '/api/ERPWeb/AssessContent/GetAssessContentByPage';
    return httpReq(url, 'get', params);
  },
  // 添加考核内容
  AddAssessContent: function (params) {
    let url = '/api/ERPWeb/AssessContent/AddAssessContent';
    return httpReq(url, 'post', params);
  },
  // 修改考核内容
  UpdateAssessContent: function (params) {
    let url = '/api/ERPWeb/AssessContent/UpdateAssessContent';
    return httpReq(url, 'post', params);
  },
  // 批量删除考核内容
  DeleteAssessContent: function (params) {
    let url = '/api/ERPWeb/AssessContent/DeleteAssessContent';
    return httpReq(url, 'post', params);
  },
  // 批量启停用考核内容
  StopAssessContent: function (params) {
    let url = '/api/ERPWeb/AssessContent/StopAssessContent';
    return httpReq(url, 'post', params);
  },
  // 导入考核内容
  ImportAssessContent: function (params) {
    let url = '/api/ERPWeb/AssessContent/ImportAssessContent';
    return httpReq(url, 'post', params);
  },
  // 导出考核内容
  ExportAssessContent: function (params) {
    let url = '/api/ERPWeb/AssessContent/ExportAssessContent';
    return httpReq(url, 'post', params);
  },
}

// 考核模板管理
const AssessModel = {
  // 获取所有考核模板
  GetAllAssessModel: function (params) {
    let url = '/api/ERPWeb/AssessModel/GetAllAssessModel';
    return httpReq(url, 'get', params);
  },
  // 添加考核模板
  AddAssessModel: function (params) {
    let url = '/api/ERPWeb/AssessModel/AddAssessModel';
    return httpReq(url, 'post', params);
  },
  // 修改考核模板
  UpdateAssessModel: function (params) {
    let url = '/api/ERPWeb/AssessModel/UpdateAssessModel';
    return httpReq(url, 'post', params);
  },
  // 删除考核模板
  DeleteAssessModel: function (params) {
    let url = '/api/ERPWeb/AssessModel/DeleteAssessModel';
    return httpReq(url, 'post', params);
  },
  // 分页查询考核模板内容
  GetAssessModelContentByPage: function (params) {
    let url = '/api/ERPWeb/AssessModel/GetAssessModelContentByPage';
    return httpReq(url, 'get', params);
  },
  // 添加/删除考核模板内容
  SetAssessModelContent: function (params) {
    let url = '/api/ERPWeb/AssessModel/SetAssessModelContent';
    return httpReq(url, 'post', params);
  },
  // 导入考核模板内容
  ImportAssessModelContent: function (params) {
    let url = '/api/ERPWeb/AssessModel/ImportAssessModelContent';
    return httpReq(url, 'post', params);
  },
  // 导出考核模板
  ExportAssessModel: function (params) {
    let url = '/api/ERPWeb/AssessModel/ExportAssessModel';
    return httpReq(url, 'post', params);
  },
}

// 考核管理
const AssessManage = {
  // 分页查询考核记录
  GetAssessRecordByPage: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetAssessRecordByPage';
    return httpReq(url, 'get', params);
  },
  // 添加考核记录/模板入参
  AddAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/AddAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 修改草稿
  UpdateAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/UpdateAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 批量删除考核记录
  DeleteAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/DeleteAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 发布考核
  ReleaseAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/ReleaseAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 考核评分
  ApproveAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/ApproveAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 考核评分审核
  ReviewAssessRecordScore: function (params) {
    let url = '/api/ERPWeb/AssessManage/ReviewAssessRecordScore';
    return httpReq(url, 'post', params);
  },
  // 考核确认
  ConfirmAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/ConfirmAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 考核申诉
  AppealAssessRecord: function (params) {
    let url = '/api/ERPWeb/AssessManage/AppealAssessRecord';
    return httpReq(url, 'post', params);
  },
  // 分页查询申诉记录
  GetAssessAppealByPage: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetAssessAppealByPage';
    return httpReq(url, 'get', params);
  },
  // 考核申诉处理
  DealAssessAppeal: function (params) {
    let url = '/api/ERPWeb/AssessManage/DealAssessAppeal';
    return httpReq(url, 'post', params);
  },
  // 撤销申诉
  RevokeAssessAppeal: function (params) {
    let url = '/api/ERPWeb/AssessManage/RevokeAssessAppeal';
    return httpReq(url, 'post', params);
  },
  // 获取审批单详情
  GetAssessRecordDetail: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetAssessRecordDetail';
    return httpReq(url, 'get', params);
  },
  // 审核考核申述处理结果
  AuditAssessAppeal: function (params) {
    let url = '/api/ERPWeb/AssessManage/AuditAssessAppeal';
    return httpReq(url, 'post', params);
  },

  // 月度汇总表
  GetMonthTotalSummary: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetMonthTotalSummary';
    return httpReq(url, 'post', params);
  },
  // 月度总分汇总表
  GetMonthTotalScore: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetMonthTotalScore';
    return httpReq(url, 'post', params);
  },
  // 季度汇总表
  GetQuarterTotalSummary: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetQuarterTotalSummary';
    return httpReq(url, 'post', params);
  },
  // 季度总分汇总表
  GetQuarterTotalScore: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetQuarterTotalScore';
    return httpReq(url, 'post', params);
  },
  // 年度总分汇总表
  GetYearTotalSummary: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetYearTotalSummary';
    return httpReq(url, 'post', params);
  },

  // 抄送
  // 根据id  获取抄送记录
  GetCopyRecordsAssessManage: function (params) {
    let url = '/api/ERPWeb/AssessManage/GetCopyRecords';
    return httpReq(url, 'post', params);
  },
  // 抄送
  AddCopyAssessManage: function (params) {
    let url = '/api/ERPWeb/AssessManage/AddCopy';
    return httpReq(url, 'post', params);
  },
  // 抄送已读
  ReadCopyAssessManage: function (params) {
    let url = '/api/ERPWeb/AssessManage/ReadCopy';
    return httpReq(url, 'post', params);
  },
}


// 经营业绩考核完成情况跟踪管理
const CheckCompletedReport = {
  // 分页查询
  GetPageListCheckCompletedReport: function (params) {
    let url = '/api/ERPWeb/CheckCompletedReport/GetPageList';
    return httpReq(url, 'post', params);
  },
  // 新增
  InsertCheckCompletedReport: function (params) {
    let url = '/api/ERPWeb/CheckCompletedReport/Insert';
    return httpReq(url, 'post', params);
  },
  // 编辑
  UpdateCheckCompletedReport: function (params) {
    let url = '/api/ERPWeb/CheckCompletedReport/Update';
    return httpReq(url, 'post', params);
  },
  // 查详情
  GetDetailCheckCompletedReport: function (params) {
    let url = '/api/ERPWeb/CheckCompletedReport/GetDetail';
    return httpReq(url, 'get', params);
  },


  // 重点任务指标
  // 导入
  ImportDataKeyPointTask: function (params) {
    let url = '/api/ERPWeb/KeyPointTask/ImportData';
    return httpReq(url, 'postFile', params);
  },
  // 导出
  ExportDataKeyPointTask: function (params) {
    let url = '/api/ERPWeb/KeyPointTask/ExportData';
    return httpReq(url, 'get', params);
  },

  // 综合管理指标
  // 导入
  ImportDataComprehensiveManagement: function (params) {
    let url = '/api/ERPWeb/ComprehensiveManagement/ImportData';
    return httpReq(url, 'postFile', params);
  },
  // 导出
  ExportDataComprehensiveManagement: function (params) {
    let url = '/api/ERPWeb/ComprehensiveManagement/ExportData';
    return httpReq(url, 'post', params);
  },


  // 经济效益指标
  // 导入
  ImportDataEconomicEfficiency: function (params) {
    let url = '/api/ERPWeb/EconomicEfficiency/ImportData';
    return httpReq(url, 'postFile', params);
  },
  // 导出
  ExportDataEconomicEfficiency: function (params) {
    let url = '/api/ERPWeb/EconomicEfficiency/ExportData';
    return httpReq(url, 'post', params);
  },

  // 党建工作指标
  // 导入
  ImportDataPartyBuilding: function (params) {
    let url = '/api/ERPWeb/PartyBuilding/ImportData';
    return httpReq(url, 'postFile', params);
  },
  // 导出
  ExportDataPartyBuilding: function (params) {
    let url = '/api/ERPWeb/PartyBuilding/ExportData';
    return httpReq(url, 'post', params);
  },

  // 新增消息提醒
  InsertOrUpdateNoticeRule: function (params) {
    let url = '/api/ERPWeb/CheckCompletedReport/InsertOrUpdateNoticeRule';
    return httpReq(url, 'post', params);
  },
  // 获取消息提醒
  GetNoticeRule: function (params) {
    let url = '/api/ERPWeb/CheckCompletedReport/GetNoticeRule';
    return httpReq(url, 'get', params);
  },
}


// 工资条
const PaySlip = {
  // 获取工资条项目
  GetCheckTemplateTrees: function (params) {
    let url = '/api/ERPWeb/PaySlip/GetCheckTemplateTrees';
    return httpReq(url, 'get', params);
  },
  // 新增工资条项目
  AddOrUpdatePaySlip: function (params) {
    let url = '/api/ERPWeb/PaySlip/AddOrUpdate';
    return httpReq(url, 'post', params);
  },
  // 启用/禁用工资条项目
  UpdateStatePaySlipItem: function (params) {
    let url = '/api/ERPWeb/PaySlip/UpdateStatePaySlipItem';
    return httpReq(url, 'post', params);
  },

  // 获取工资条模板
  GetPaySlipTemplates: function (params) {
    let url = '/api/ERPWeb/PaySlip/GetPaySlipTemplates';
    return httpReq(url, 'get', params);
  },
  // 新增/编辑工资条模板
  AddOrUpdatePaySlipTemplate: function (params) {
    let url = '/api/ERPWeb/PaySlip/AddOrUpdatePaySlipTemplate';
    return httpReq(url, 'post', params);
  },
  // 删除工资条模板
  DeletePaySlipTemplate: function (params) {
    let url = '/api/ERPWeb/PaySlip/DeletePaySlipTemplate';
    return httpReq(url, 'post', params);
  },
  // 根据模板id获取工资条项目
  GetItemByTemplateId: function (params) {
    let url = '/api/ERPWeb/PaySlip/GetItemByTemplateId';
    return httpReq(url, 'get', params);
  },
  // 新增/编辑/排序工资条模板包含内容
  AddTemplateItem: function (params) {
    let url = '/api/ERPWeb/PaySlip/AddTemplateItem';
    return httpReq(url, 'post', params);
  },
  // 根据模板id导出模板文件
  ExportTemplateFile: function (params) {
    let url = '/api/ERPWeb/PaySlip/ExportTemplateFile';
    return httpReq(url, 'post', params);
  },

  // 工资条发放历史
  GetPaySlipHistories: function (params) {
    let url = '/api/ERPWeb/PaySlip/GetPaySlipHistories';
    return httpReq(url, 'post', params);
  },
  // 根据工资条id获取工资条发放详情
  GetByPaySlipId: function (params) {
    let url = '/api/ERPWeb/PaySlip/GetByPaySlipId';
    return httpReq(url, 'get', params);
  },
  // 根据id下发工资
  SendOutPaySlip: function (params) {
    let url = '/api/ERPWeb/PaySlip/SendOut';
    return httpReq(url, 'post', params);
  },
  // 删除工资记录
  DeletePaySlip: function (params) {
    let url = '/api/ERPWeb/PaySlip/Delete';
    return httpReq(url, 'post', params);
  },
  // 撤回工资记录
  RevokePaySlip: function (params) {
    let url = '/api/ERPWeb/PaySlip/Revoke';
    return httpReq(url, 'post', params);
  },
  // 根据模板id导入工资条
  ImportPaySlip: function (params) {
    let url = '/api/ERPWeb/PaySlip/ImportPaySlip';
    return httpReq(url, 'postFile', params);
  },
}

// 退货单
const ReturnsOrder = {
  // 审核
  AuditReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/Audit';
    return httpReq(url, 'post', params);
  },
  // 获取退货单列表
  GetPageListReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/GetList';
    return httpReq(url, 'post', params);
  },
  //导出
  ExportReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/Export';
    return httpReq(url, 'post', params);
  },
  // 获取退货单明细
  GetReturnsOrderDetailReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/GetReturnsOrderDetail';
    return httpReq(url, 'post', params);
  },
  // 导出退货单明细
  ExportDetailReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/ExportDetail';
    return httpReq(url, 'post', params);
  },
  // 获取详情
  GetDetailReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/GetDetail';
    return httpReq(url, 'get', params);
  },
  // 新增
  InsertReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/Insert';
    return httpReq(url, 'post', params);
  },
  // 编辑
  UpdateReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/Update';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteReturnsOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/Delete';
    return httpReq(url, 'post', params);
  },
  // 导入
  ImportReturnOrder: function (params) {
    let url = '/api/ERPWeb/ReturnsOrder/ImportReturnOrder';
    return httpReq(url, 'postFile', params);
  },
}

// 采购询价
const PurchaseOrderAsk = {
  // 分页获取主表
  GetListPurchaseOrderAsk: function (params) {
    let url = '/api/ERPWeb/PurchaseOrderAsk/GetListData';
    return httpReq(url, 'post', params);
  },
  // 获取详情
  GetDetailPurchaseOrderAsk: function (params) {
    let url = '/api/ERPWeb/PurchaseOrderAsk/GetDetail';
    return httpReq(url, 'get', params);
  },
  // 新增
  InsertPurchaseOrderAsk: function (params) {
    let url = '/api/ERPWeb/PurchaseOrderAsk/Insert';
    return httpReq(url, 'post', params);
  },
  // 编辑
  UpdatePurchaseOrderAsk: function (params) {
    let url = '/api/ERPWeb/PurchaseOrderAsk/Update';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeletePurchaseOrderAsk: function (params) {
    let url = '/api/ERPWeb/PurchaseOrderAsk/Delete';
    return httpReq(url, 'post', params);
  },
  // 导出
  ExportPurchaseOrderAsk: function (params) {
    let url = '/api/ERPWeb/PurchaseOrderAsk/Export';
    return httpReq(url, 'post', params);
  },
}

// 嘉兴定制 分公司物料
const InventoryReport = {
  // 分公司物料领用分组汇总报表
  GetDeptLeaveInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/GetDeptLeave';
    return httpReq(url, 'post', params);
  },

  // 导出分公司材料领用报表
  DeptLeaveExportInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/DeptLeaveExport';
    return httpReq(url, 'post', params);
  },

  // 分公司物料领用分组明细报表
  GetDeptVehicleLeaveInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/GetDeptVehicleLeave';
    return httpReq(url, 'post', params);
  },

  // 导出分公司物料领用分组明细报表
  DeptVehicleLeaveExportInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/DeptVehicleLeaveExport';
    return httpReq(url, 'post', params);
  },

  // 物料收发结存表查询
  GetDeptReceiveInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/GetDeptReceive';
    return httpReq(url, 'post', params);
  },

  // 导出物料收发结存表
  DeptReceiveExportInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/DeptReceiveExport';
    return httpReq(url, 'post', params);
  },

  // 零库存客户表查询
  GetProviderInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/GetProvider';
    return httpReq(url, 'post', params);
  },

  // 导出零库存客户表
  GetProviderExportInventoryReport: function (params) {
    let url = '/api/ERPWeb/InventoryReport/GetProviderExport';
    return httpReq(url, 'post', params);
  }
}

// 库存规则管理
const InventoryRule = {
  // 获取库存规则
  GetInventoryRule: function (params) {
    let url = '/api/ERPWeb/InventoryRule/GetRule';
    return httpReq(url, 'get', params);
  },
  // 设置库存规则
  SetInventoryRule: function (params) {
    let url = '/api/ERPWeb/InventoryRule/SetRule';
    return httpReq(url, 'post', params);
  }
}

// 物资管理
const MaterialManage = {
  ...nowInventory,
  ...stockControl,
  ...Provider,
  ...Material,
  ...Store,
  ...initialization,
  ...stockremoval,
  ...TireDetail,
  ...TimerBackup,
  ...WarehouseCheck,
  ...PurchaseOrder,
  ...VehicleRepair,
  ...RepairParts,
  ...RepairEnterParts,
  ...TireMonthStatistic,
  ...AssessContent,
  ...AssessModel,
  ...AssessManage,
  ...CheckCompletedReport,
  ...PaySlip,
  ...ReturnsOrder,
  ...PurchaseOrderAsk,
  ...InventoryTrans,
  ...InventoryReport,
  ...InventoryRule
}

export default MaterialManage
