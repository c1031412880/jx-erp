import httpReq from "../http";

// 公车管理
const BusManage = {
  // 获取公车数据
  getByPageBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 公车新增，编辑记录
  setRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 公车删除记录
  deleteRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 获取公车使用记录
  getUseRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/GetUseRecord';
    return httpReq(url, 'get', params);
  },
  // 获取公车未完成记录
  GetReServedRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/GetReServedRecord';
    return httpReq(url, 'post', params);
  },
  // 获取公车已完成记录
  GetFinishRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/GetFinishRecord';
    return httpReq(url, 'post', params);
  },
  // 公车借车
  setBorrowRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/SetBorrowRecord';
    return httpReq(url, 'post', params);
  },

  // 更新借车申请所借车辆
  UpdateBorrowBus: function (params) {
    let url = '/api/ERPWeb/BusManage/UpdateBorrowBus';
    return httpReq(url, 'post', params);
  },
  // 新增公车借车
  CreateBorrow: function (params) {
    let url = '/api/ERPWeb/BusManage/CreateBorrow';
    return httpReq(url, 'post', params);
  },
  // 获取公车借车详情
  LookBorrowDetail: function (params) {
    let url = '/api/ERPWeb/BusManage/LookBorrowDetail';
    return httpReq(url, 'get', params);
  },
  // 新增公车借车草稿
  SaveBorrowDraft: function (params) {
    let url = '/api/ERPWeb/BusManage/SaveBorrowDraft';
    return httpReq(url, 'post', params);
  },
  // 获取公车借车草稿
  LookBorrowDraft: function (params) {
    let url = '/api/ERPWeb/BusManage/LookBorrowDraft';
    return httpReq(url, 'get', params);
  },

  // 公车还车
  setBackRecordBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/SetBackRecord';
    return httpReq(url, 'post', params);
  },

  // 新增公车还车
  CreateBack: function (params) {
    let url = '/api/ERPWeb/BusManage/CreateBack';
    return httpReq(url, 'post', params);
  },
  // 获取公车还车详情
  LookBackDetail: function (params) {
    let url = '/api/ERPWeb/BusManage/LookBackDetail';
    return httpReq(url, 'get', params);
  },
  // 新增公车还车草稿
  SaveBackDraft: function (params) {
    let url = '/api/ERPWeb/BusManage/SaveBackDraft';
    return httpReq(url, 'post', params);
  },
  // 获取公车还车草稿
  LookBackDraft: function (params) {
    let url = '/api/ERPWeb/BusManage/LookBackDraft';
    return httpReq(url, 'get', params);
  },

  // 获取公车使用记录详情
  DetailBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/Detail';
    return httpReq(url, 'get', params);
  },

  // 根据公车id获取公车预约记录
  GetBusRequestBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/GetBusRequest';
    return httpReq(url, 'get', params);
  },
  // 获取公车预约记录详情
  GetBusRequestDetailBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/GetBusRequestDetail';
    return httpReq(url, 'get', params);
  },
  // 获取公车预约草稿
  GetBusRequestDraftByUser: function (params) {
    let url = '/api/ERPWeb/BusManage/GetBusRequestDraftByUser';
    return httpReq(url, 'get', params);
  },
   // 提交公车预约草稿
   SaveBusRequestDraft: function (params) {
    let url = '/api/ERPWeb/BusManage/SaveBusRequestDraft';
    return httpReq(url, 'post', params);
  },
  // 公车预约
  CreateBusRequestBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/CreateBusRequest';
    return httpReq(url, 'post', params);
  },
  // 取消公车预约
  CancelBusRequestBusManage: function (params) {
    let url = '/api/ERPWeb/BusManage/CancelBusRequest';
    return httpReq(url, 'get', params);
  },
  // 公车提醒规则
   // 获取车辆年审规则
   GetBusMsgYearList: function (params) {
    let url = '/api/ERPWeb/BusMsg/GetBusMsgYearList';
    return httpReq(url, 'get', params);
  },
  // 添加车辆年审规则
  CreateBusMsgYear: function (params) {
    let url = '/api/ERPWeb/BusMsg/CreateBusMsgYear';
    return httpReq(url, 'post', params);
  },
  // 修改车辆年审规则
  UpdateBusMsgYear: function (params) {
    let url = '/api/ERPWeb/BusMsg/UpdateBusMsgYear';
    return httpReq(url, 'post', params);
  },
  // 启用、禁用车辆年审规则
  EnableBusMsgYear: function (params) {
    let url = '/api/ERPWeb/BusMsg/EnableBusMsgYear';
    return httpReq(url, 'post', params);
  },
  // 删除车辆年审规则
  DeleteBusMsgYear: function (params) {
    let url = '/api/ERPWeb/BusMsg/DeleteBusMsgYear';
    return httpReq(url, 'post', params);
  },


  // 获取车辆保养规则
  GetBusMsgMaintainList: function (params) {
    let url = '/api/ERPWeb/BusMsg/GetBusMsgMaintainList';
    return httpReq(url, 'get', params);
  },
  // 添加车辆保养规则
  CreateBusMsgMaintain: function (params) {
    let url = '/api/ERPWeb/BusMsg/CreateBusMsgMaintain';
    return httpReq(url, 'post', params);
  },
  // 修改车辆保养规则
  UpdateBusMsgMaintain: function (params) {
    let url = '/api/ERPWeb/BusMsg/UpdateBusMsgMaintain';
    return httpReq(url, 'post', params);
  },
  // 启用、禁用车辆保养规则
  EnableBusMsgMaintain: function (params) {
    let url = '/api/ERPWeb/BusMsg/EnableBusMsgMaintain';
    return httpReq(url, 'post', params);
  },
  // 删除车辆保养规则
  DeleteBusMsgMaintain: function (params) {
    let url = '/api/ERPWeb/BusMsg/DeleteBusMsgMaintain';
    return httpReq(url, 'post', params);
  },


  // 获取车辆保养规则
  GetBusMsgInsuranceList: function (params) {
    let url = '/api/ERPWeb/BusMsg/GetBusMsgInsuranceList';
    return httpReq(url, 'get', params);
  },
  // 添加车辆保养规则
  CreateBusMsgInsurance: function (params) {
    let url = '/api/ERPWeb/BusMsg/CreateBusMsgInsurance';
    return httpReq(url, 'post', params);
  },
  // 修改车辆保养规则
  UpdateBusMsgInsurance: function (params) {
    let url = '/api/ERPWeb/BusMsg/UpdateBusMsgInsurance';
    return httpReq(url, 'post', params);
  },
  // 启用、禁用车辆保养规则
  EnableBusMsgInsurance: function (params) {
    let url = '/api/ERPWeb/BusMsg/EnableBusMsgInsurance';
    return httpReq(url, 'post', params);
  },
  // 删除车辆保养规则
  DeleteBusMsgInsurance: function (params) {
    let url = '/api/ERPWeb/BusMsg/DeleteBusMsgInsurance';
    return httpReq(url, 'post', params);
  },


  // 公车管理编辑、详情
  //添加公车维修记录
  AddRepair: function (params) {
    let url = '/api/ERPWeb/BusManage/AddRepair';
    return httpReq(url, 'post', params);
  },
  //修改公车维修记录
  EditBusRepair: function (params) {
    let url = '/api/ERPWeb/BusManage/EditBusRepair';
    return httpReq(url, 'post', params);
  },
  //公车维修统计
  BusRepairStatistics: function (params) {
    let url = '/api/ERPWeb/BusManage/BusRepairStatistics';
    return httpReq(url, 'post', params);
  },
  //公车维修统计导出
  ExportRepairStatistics: function (params) {
    let url = '/api/ERPWeb/BusManage/ExportRepairStatistics';
    return httpReq(url, 'post', params);
  },

  //添加公车加油记录
  AddBusOil: function (params) {
    let url = '/api/ERPWeb/BusManage/AddBusOil';
    return httpReq(url, 'post', params);
  },
  //修改公车加油记录
  EditBusOil: function (params) {
    let url = '/api/ERPWeb/BusManage/EditBusOil';
    return httpReq(url, 'post', params);
  },
  //公车加油统计
  BusOilStatistics: function (params) {
    let url = '/api/ERPWeb/BusManage/BusOilStatistics';
    return httpReq(url, 'post', params);
  },
  //公车加油统计导出
  ExportOilStatistics: function (params) {
    let url = '/api/ERPWeb/BusManage/ExportOilStatistics';
    return httpReq(url, 'post', params);
  },


  //添加公车保险记录
  CreateInsurance: function (params) {
    let url = '/api/ERPWeb/ErpBusInsurance/Create';
    return httpReq(url, 'post', params);
  },
  //修改公车保险记录
  UpdateInsurance: function (params) {
    let url = '/api/ERPWeb/ErpBusInsurance/Update';
    return httpReq(url, 'post', params);
  },
  //删除公车保险记录
  DeleteInsurance: function (params) {
    let url = '/api/ERPWeb/ErpBusInsurance/Delete';
    return httpReq(url, 'post', params);
  },
  //公车保险查询
  GetListInsurance: function (params) {
    let url = '/api/ERPWeb/ErpBusInsurance/GetListByPage';
    return httpReq(url, 'post', params);
  },
  //公车保险统计导出
  ExportInsurance: function (params) {
    let url = '/api/ERPWeb/ErpBusInsurance/Export';
    return httpReq(url, 'post', params);
  },


   //添加公车保养记录
  CreateBusMaintain: function (params) {
    let url = '/api/ERPWeb/ErpBusMaintain/Create';
    return httpReq(url, 'post', params);
  },
  //修改公车保养记录
  UpdateBusMaintain: function (params) {
    let url = '/api/ERPWeb/ErpBusMaintain/Edit';
    return httpReq(url, 'post', params);
  },
  //删除公车保养记录
  DeleteBusMaintain: function (params) {
    let url = '/api/ERPWeb/ErpBusMaintain/Delete';
    return httpReq(url, 'post', params);
  },
  //公车保养查询
  GetListBusMaintain: function (params) {
    let url = '/api/ERPWeb/ErpBusMaintain/GetByPage';
    return httpReq(url, 'post', params);
  },
  //公车保养统计导出
  ExportBusMaintain: function (params) {
    let url = '/api/ERPWeb/ErpBusMaintain/Export';
    return httpReq(url, 'post', params);
  },


  //添加公车年审记录
  CreateBusYear: function (params) {
    let url = '/api/ERPWeb/ErpBusYear/Create';
    return httpReq(url, 'post', params);
  },
  //修改公车年审记录
  UpdateBusYear: function (params) {
    let url = '/api/ERPWeb/ErpBusYear/Edit';
    return httpReq(url, 'post', params);
  },
  //删除公车年审记录
  DeleteBusYear: function (params) {
    let url = '/api/ERPWeb/ErpBusYear/Delete';
    return httpReq(url, 'post', params);
  },
  //公车年审查询
  GetListBusYear: function (params) {
    let url = '/api/ERPWeb/ErpBusYear/GetByPage';
    return httpReq(url, 'post', params);
  },
  //公车年审统计导出
  ExportBusYear: function (params) {
    let url = '/api/ERPWeb/ErpBusYear/Export';
    return httpReq(url, 'post', params);
  },


  //获取公车借车统计
  GetBusRecordStatic: function (params) {
    let url = '/api/ERPWeb/BusManage/GetBusRecordStatic';
    return httpReq(url, 'post', params);
  },
  //获取公车预约统计
  GetBusRequestQueueStatic: function (params) {
    let url = '/api/ERPWeb/BusManage/GetBusRequestQueueStatic';
    return httpReq(url, 'post', params);
  },
  //导出公车借车统计
  ExportBusRecordStatic: function (params) {
    let url = '/api/ERPWeb/BusManage/ExportBusRecordStatic';
    return httpReq(url, 'post', params);
  },
  // 导出公车预约统计
  ExportBusRequestQueueStatic: function (params) {
    let url = '/api/ERPWeb/BusManage/ExportBusRequestQueueStatic';
    return httpReq(url, 'post', params);
  },
}
// 采购申请单
const ErpPurchaseReq = {
  // 获取(统计)
  GetByPageErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取草稿
  GetDraftByUserErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/GetDraftByUser';
    return httpReq(url, 'get', params);
  },
  // 保存草稿
  SaveDraftErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/SaveDraft';
    return httpReq(url, 'post', params);
  },
  // 提交
  CreateErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/Create';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdateErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/Update';
    return httpReq(url, 'post', params);
  },
  // 查看详情
  LookDetailErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 采购申请审批导出
  ExportStatisticsErpPurchaseReq: function (params) {
    let url = '/api/ERPWeb/ErpPurchaseReq/ExportStatistics';
    return httpReq(url, 'get', params);
  },
}

// 会议室管理
const MeetingRoom = {
  // 上传会议室图片
  uploadPictureMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/UploadPicture';
    return httpReq(url, 'postFile', params.file)
  },
  // 查询会议室记录
  listMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/List';
    return httpReq(url, 'post', params);
  },
  // 查询详情记录
  DetailMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/Detail';
    return httpReq(url, 'get', params);
  },
  // 添加/编辑会议室
  addMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/AddMeetingRoom';
    return httpReq(url, 'post', params);
  },
  // 批量删除会议室记录
  batchDeleteMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 批量删除会议室记录
  listReserveHistoryMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/ListReserveHistory';
    return httpReq(url, 'post', params);
  },
  // 查询会议室预定信息
  listBookRecordsMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/ListBookRecords';
    return httpReq(url, 'get', params);
  },
  // 会议室预约
  bookMeetingRoomMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/BookMeetingRoom';
    return httpReq(url, 'post', params);
  },
  // 查询我的预订信息
  listMyBookRecordsMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/ListMyBookRecords';
    return httpReq(url, 'get', params);
  },
  // 取消预定
  cancelBookMeetingRoom: function (params) {
    let url = '/api/ERPWeb/MeetingRoom/CancelBook';
    return httpReq(url, 'post', params);
  },
}

// 水电费管理
const WaterAndElectricFee = {
  // 获取电表所属单元
  getElectricUnit: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/GetUnit';
    return httpReq(url, 'get', params);
  },
  // 获取单元下的电表
  getElectricUnitChild: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/GetElectricUnitChild';
    return httpReq(url, 'get', params);
  },
  // 获取电表组织信息
  getElectricTree: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/GetElectricTree';
    return httpReq(url, 'get', params);
  },
  // 添加/编辑电表
  addElectricGroup: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/AddElectricGroup';
    return httpReq(url, 'post', params);
  },
  // 批量删除电表信息
  batchElectricGroupDelete: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/BatchElectricGroupDelete';
    return httpReq(url, 'post', params);
  },
  // 查询电费记录
  electricListWaterAndElectricFee: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/ElectricList';
    return httpReq(url, 'post', params);
  },
  // 电费录入
  addElectricWaterAndElectricFee: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/AddElectric';
    return httpReq(url, 'post', params);
  },
  // 批量删除电费记录
  batchElectricRecordDelete: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/BatchElectricRecordDelete';
    return httpReq(url, 'post', params);
  },
  // 导入电费记录
  ImportElectricRecord: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/ImportElectric'
    return httpReq(url, 'postFile', params);
  },
  // 导出电费记录
  exportElectricWaterAndElectricFee: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/ExportElectric'
    return httpReq(url, 'post', params);
  },
  // 获取水表所属单元
  getWaterUnit: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/GetWaterUnit';
    return httpReq(url, 'get', params);
  },
  // 获取单元下的水表
  getWaterUnitChild: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/GetWaterUnitChild';
    return httpReq(url, 'get', params);
  },
  // 获取水表组织信息
  getWaterTreeWaterAndElectricFee: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/GetWaterTree';
    return httpReq(url, 'get', params);
  },
  // 添加/编辑水表
  addWaterGroup: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/AddWaterGroup';
    return httpReq(url, 'post', params);
  },
  // 批量删除水表信息
  batchWaterGroupDelete: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/BatchWaterGroupDelete';
    return httpReq(url, 'post', params);
  },
  // 查询水费记录
  getWaterRecordList: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/WaterList';
    return httpReq(url, 'post', params);
  },
  // 水费录入
  addWaterRecord: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/AddWater';
    return httpReq(url, 'post', params);
  },
  // 批量删除水费记录
  batchWaterRecordDelete: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/BatchWaterRecordDelete';
    return httpReq(url, 'post', params);
  },
  // 导入水费费记录
  ImportWaterRecord: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/ImportWater';
    return httpReq(url, 'postFile', params);
  },
  // 导出水费记录
  exportWaterWaterAndElectricFee: function (params) {
    let url = '/api/ERPWeb/WaterAndElectricFee/ExportWater';
    return httpReq(url, 'post', params);
  },
}

// 广告源管理
const AdSource = {
  // 获取广告源数据
  GetByPageAdSource: function (params) {
    let url = '/api/ERPWeb/AdSource/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取无合同车辆树
  getVehicleTreeAdSource: function (params) {
    let url = '/api/ERPWeb/AdSource/GetVehicleTree';
    return httpReq(url, 'get', params);
  },
  // 数据导出
  exportAdSource: function (params) {
    let url = '/api/ERPWeb/AdSource/Export';
    return httpReq(url, 'post', params);
  },
}

// 合同管理
const Contract = {
  // 获取合同数据
  getByPageContract: function (params) {
    let url = '/api/ERPWeb/Contract/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取合同编号
  GetCodeContract: function (params) {
    let url = '/api/ERPWeb/Contract/GetCode';
    return httpReq(url, 'get', params);
  },
  // 新增，编辑房屋数据记录
  setRecordContract: function (params) {
    let url = '/api/ERPWeb/Contract/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 删除合同记录
  deleteRecordContract: function (params) {
    let url = '/api/ERPWeb/Contract/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 解除合同
  relieveRecordContract: function (params) {
    let url = '/api/ERPWeb/Contract/RelieveRecord';
    return httpReq(url, 'post', params);
  },
  // 新增合同缴费记录
  AddFeeContract: function (params) {
    let url = '/api/ERPWeb/Contract/AddFee';
    return httpReq(url, 'post', params);
  },
}

// 客户管理
const Customer = {
  // 获取客户数据
  getByPageCustomer: function (params) {
    let url = '/api/ERPWeb/Customer/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增，编辑客户数据记录
  setRecordCustomer: function (params) {
    let url = '/api/ERPWeb/Customer/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 删除客服记录
  deleteRecordCustomer: function (params) {
    let url = '/api/ERPWeb/Customer/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 导出客服记录
  exportCustomer: function (params) {
    let url = '/api/ERPWeb/Customer/Export';
    return httpReq(url, 'post', params);
  },
}

// 租房管理
const House = {
  // 获取房屋数据
  getByPageHouse: function (params) {
    let url = '/api/ERPWeb/House/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增，编辑房屋数据记录
  setRecordHouse: function (params) {
    let url = '/api/ERPWeb/House/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 删除房屋数据记录
  deleteRecordHouse: function (params) {
    let url = '/api/ERPWeb/House/DeleteRecord';
    return httpReq(url, 'post', params);
  },
}

// 党组织管理
const PartyOrgan = {
  // 查询党组织记录
  ListPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/List';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑党组织
  AddPartyOrganPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/AddPartyOrgan';
    return httpReq(url, 'post', params);
  },
  // 批量删除党组织记录
  BatchDeletePartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 查询班子记录
  ListClassPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/ListClass';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑班子
  AddPartyClassPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/AddPartyClass';
    return httpReq(url, 'post', params);
  },
  // 批量删除班子
  BatchDeleteClassPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/BatchDeleteClass';
    return httpReq(url, 'post', params);
  },
  // 查询班子成员记录
  ListClassUserPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/ListClassUser';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑班子成员
  AddPartyClassUserPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/AddPartyClassUser';
    return httpReq(url, 'post', params);
  },
  // 批量删除班子成员
  BatchDeleteClassUserPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/BatchDeleteClassUser';
    return httpReq(url, 'post', params);
  },
  // 查询党组织荣誉记录
  ListPartyHonorPartyOrgan: function (params) {
    let url = '/api/ERPWeb/PartyOrgan/ListPartyHonor';
    return httpReq(url, 'post', params);
  },
}

// 党员档案管理
const PartyRecord = {
  // 获取党员档案详情
  GetPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/Get';
    return httpReq(url, 'get', params);
  },
  // 获取党组织下党员id
  OrganUserListPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/OrganUserList';
    return httpReq(url, 'post', params);
  },
  // 查询党员档案
  ListPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/List';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑党员档案
  AddPartyUserPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/AddPartyUser';
    return httpReq(url, 'post', params);
  },
  // 批量删除党员档案记录
  BatchDeletePartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 导出党员档案记录
  ExportElectricPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/ExportElectric';
    return httpReq(url, 'post', params);
  },
  // 查询党内职务信息
  ListPositionPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/ListPosition';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑党内职务信息
  AddPartyPositionPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/AddPartyPosition';
    return httpReq(url, 'post', params);
  },
  // 批量删除党内职务信息
  BatchDeletePositionPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/BatchDeletePosition';
    return httpReq(url, 'post', params);
  },
  // 查询两代表一委员信息
  ListMemberPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/ListMember';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑两代表一委员信息
  AddPartyMemberPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/AddPartyMember';
    return httpReq(url, 'post', params);
  },
  // 批量删除两代表一委员信息
  BatchDeleteMemberPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/BatchDeleteMember';
    return httpReq(url, 'post', params);
  },
  // 查询党员荣誉记录
  ListPartyHonorPartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/ListPartyHonor';
    return httpReq(url, 'post', params);
  },
  // 查询家庭成员信息
  ListUserHomePartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/ListUserHome';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑家庭成员信息
  AddPartyUserHomePartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/AddPartyUserHome';
    return httpReq(url, 'post', params);
  },
  // 批量删除家庭成员信息
  BatchDeleteUserHomePartyRecord: function (params) {
    let url = '/api/ERPWeb/PartyRecord/BatchDeleteUserHome';
    return httpReq(url, 'post', params);
  },
}

// 党组织活动管理
const PartyActivity = {
  // 查询党组织活动记录
  ListPartyActivity: function (params) {
    let url = '/api/ERPWeb/PartyActivity/List';
    return httpReq(url, 'post', params);
  },
  // 查询党组织活动详情
  DetailPartyActivity: function (params) {
    let url = '/api/ERPWeb/PartyActivity/Detail';
    return httpReq(url, 'get', params);
  },
  // 添加/编辑党组织活动
  AddPartyActivityPartyActivity: function (params) {
    let url = '/api/ERPWeb/PartyActivity/AddPartyActivity';
    return httpReq(url, 'post', params);
  },
  // 批量删除党组织活动
  BatchDeletePartyActivity: function (params) {
    let url = '/api/ERPWeb/PartyActivity/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 导出党组织活动记录
  ExportPartyActivity: function (params) {
    let url = '/api/ERPWeb/PartyActivity/Export';
    return httpReq(url, 'post', params);
  },
}

// 党费管理
const PartyFee = {
  // 比例查询
  PartyFeeQueryPartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/PartyFeeQuery';
    return httpReq(url, 'get', params);
  },
  // 查询缴纳比例记录
  PartyFeeListPartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/PartyFeeList';
    return httpReq(url, 'get', params);
  },
  // 比例设置
  PartyFeeSetPartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/PartyFeeSet';
    return httpReq(url, 'post', params);
  },
  // 查询党费记录
  ListPartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/List';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑党费
  AddPartyFeePartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/AddPartyFee';
    return httpReq(url, 'post', params);
  },
  // 批量删除党费记录
  BatchDeletePartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 导入党费记录
  ImportPartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/Import';
    return httpReq(url, 'postFile', params);
  },
  // 导出党费记录
  ExportPartyFee: function (params) {
    let url = '/api/ERPWeb/PartyFee/Export';
    return httpReq(url, 'post', params);
  },

}

// 荣誉墙
const PartyHonor = {
  // 查询荣誉记录
  ListPartyHonor: function (params) {
    let url = '/api/ERPWeb/PartyHonor/List';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑荣誉
  AddPartyHonorPartyHonor: function (params) {
    let url = '/api/ERPWeb/PartyHonor/AddPartyHonor';
    return httpReq(url, 'post', params);
  },
  // 批量删除荣誉记录
  BatchDeletePartyHonor: function (params) {
    let url = '/api/ERPWeb/PartyHonor/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // 上传图片
  UploadPicturePartyHonor: function (params) {
    let url = '/api/ERPWeb/PartyHonor/UploadPicture';
    return httpReq(url, 'postFile', params.file);
  },
  // 上传文件
  UploadFilePartyHonor: function (params) {
    let url = '/api/ERPWeb/PartyHonor/UploadFile';
    return httpReq(url, 'postFile', params.file);
  },
}

// 发展党员管理
const PartyDevelop = {
  // 查询发展党员记录
  ListPartyDevelop: function (params) {
    let url = '/api/ERPWeb/PartyDevelop/List';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑发展党员记录
  AddPartyDevelopPartyDevelop: function (params) {
    let url = '/api/ERPWeb/PartyDevelop/AddPartyDevelop';
    return httpReq(url, 'post', params);
  },
  // 批量删除发展党员
  BatchDeletePartyDevelop: function (params) {
    let url = '/api/ERPWeb/PartyDevelop/BatchDelete';
    return httpReq(url, 'post', params);
  },
}
// 工会会员管理
const ErpTradeMainManage = {
  // 工会会员管理分页获取
  GetByPageErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增时获取档案编号
  GetCodeErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/GetCode';
    return httpReq(url, 'get', params);
  },
  // 新增/编辑
  CreateOrUpdateErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/CreateOrUpdate';
    return httpReq(url, 'post', params);
  },
  // 批量删除
  DeleteErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/Delete';
    return httpReq(url, 'post', params);
  },
  // 导入工会会员信息
  ImportErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/Import';
    return httpReq(url, 'postFile', params);
  },
  // 工会会员信息导出
  ExportErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/Export';
    return httpReq(url, 'post', params);
  },

  // 分页获取会员申请
  GetReqByPageErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/GetReqByPage';
    return httpReq(url, 'post', params);
  },
  // 分页获取待我处理的会员申请
  GetWaitReqByPageErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/GetWaitReqByPage';
    return httpReq(url, 'post', params);
  },
  // 工会会员信息导出
  CreateOrUpdateReqErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/CreateOrUpdateReq';
    return httpReq(url, 'post', params);
  },
  // 提交草稿
  SubmitErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/Submit';
    return httpReq(url, 'post', params);
  },
  // 获取会员申请详情
  LookDetailErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 获取自己保存的草稿
  GetByUserErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/GetByUser';
    return httpReq(url, 'post', params);
  },
  // 获取入会确认的会员申请
  GetReqErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/GetReq';
    return httpReq(url, 'post', params);
  },
  // 确认入会
  ConfirmErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/Confirm';
    return httpReq(url, 'get', params);
  },
  // 撤销入会
  RevokeErpTradeMainManage: function (params) {
    let url = '/api/ERPWeb/ErpTradeMainManage/Revoke';
    return httpReq(url, 'get', params);
  },

}
// 工会人员成长记录
const TradeEmployeesLife = {
  // 获取工会人员成长记录
  GetByPageTradeEmployeesLife: function (params) {
    let url = '/api/ERPWeb/TradeEmployeesLife/GetByPage';
    return httpReq(url, 'get', params);
  },
  // 工会人员成长添加入会时间
  SetDraftRecordTradeEmployeesLife: function (params) {
    let url = '/api/ERPWeb/TradeEmployeesLife/SetDraftRecord';
    return httpReq(url, 'post', params);
  },
}

// 工资条
const OaWage = {
  // 导入工资条
  ImportOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/Import';
    return httpReq(url, 'postFile', params);
  },
  // 获取最近一次上传的工资条
  GetRecentOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/GetRecent';
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/Delete';
    return httpReq(url, 'post', params);
  },
  // 获取发放记录
  GetSendRecordOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/GetSendRecord';
    return httpReq(url, 'post', params);
  },
  // 查看发放记录详情
  GetSendDetailOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/GetSendDetail';
    return httpReq(url, 'post', params);
  },
  // 发放详情导出
  ExportOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/Export';
    return httpReq(url, 'post', params);
  },
  // 下发工资条
  SendOaWage: function (params) {
    let url = '/api/ERPWeb/OaWage/Send';
    return httpReq(url, 'post', params);
  },
}

// 资产信息管理
const AssetsInfo = {
  // 获取资产数量部门树
  GetDeptGroupAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/GetDeptGroup';
    return httpReq(url, 'get', params);
  },
  // 获取物料分组树
  GetGroupAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/GetGroup';
    return httpReq(url, 'get', params);
  },
  // 新增，编辑组记录
  SetGroupAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/SetGroup';
    return httpReq(url, 'post', params);
  },
  // 删除组记录
  DeleteGroupAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/DeleteGroup';
    return httpReq(url, 'post', params);
  },
  // 获取物料信息
  GetByPageAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增，编辑记录
  SetRecordAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 领用
  ReceiveAssetsAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/ReceiveAssets';
    return httpReq(url, 'post', params);
  },
  // 归还
  BackAssetsAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/BackAssets';
    return httpReq(url, 'post', params);
  },
  // 删除记录
  DeleteRecordAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/DeleteRecord';
    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/Export';
    return httpReq(url, 'post', params);
  },
  // 数据导入
  ImportAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/Import';
    return httpReq(url, 'postFile', params);
  },
  // 查询资产使用记录
  GetUseHistoryAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/GetUseHistory';
    return httpReq(url, 'post', params);
  },
  // 资产报废
  ScrapRecordAssetsInfo: function (params) {
    let url = '/api/ERPWeb/AssetsInfo/ScrapRecord';
    return httpReq(url, 'post', params);
  },
}

// 资产生命周期
const AssetsLife = {
  // 资产使用记录
  GetByPageAssetsLife: function (params) {
    let url = '/api/ERPWeb/AssetsLife/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 物品领用记录
  GetGoodsAssetsLife: function (params) {
    let url = '/api/ERPWeb/AssetsLife/GetGoods';
    return httpReq(url, 'get', params);
  },
  // 查询物品入库记录
  GetGoodsEnterLifeAssetsLife: function (params) {
    let url = '/api/ERPWeb/AssetsLife/GetGoodsEnterLife';
    return httpReq(url, 'post', params);
  },
  // 物品入库记录导出
  ExportAssetsLife: function (params) {
    let url = '/api/ERPWeb/AssetsLife/ExportEnterLifeStatistics';
    return httpReq(url, 'post', params);
  },
}

// 资产报废
const AssetsScrap = {
  // 分页查询
  GetByPageAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 查看详情
  LookDetailAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 获取草稿
  GetDraftByUserAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/GetDraftByUser';
    return httpReq(url, 'get', params);
  },
  // 保存草稿
  SaveDraftAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/SaveDraft';
    return httpReq(url, 'post', params);
  },
  // 提交
  CreateAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/Create';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdateAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/Update';
    return httpReq(url, 'post', params);
  },
  // 资产报废审批导出
  ExportStatisticsAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/ExportStatistics';
    return httpReq(url, 'post', params);
  },
  // 获取报废提醒规则
  GetScrapRuleAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/GetScrapRule';
    return httpReq(url, 'get', params);
  },
  // 保存报废提醒规则
  SaveScrapRuleAssetsScrap: function (params) {
    let url = '/api/ERPWeb/AssetsScrap/SaveScrapRule';
    return httpReq(url, 'post', params);
  },
}

// 资产报修
const AssetsRepair = {
  // 分页查询
  GetByPageAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 查看详情
  LookDetailAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 获取草稿
  GetDraftByUserAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/GetDraftByUser';
    return httpReq(url, 'get', params);
  },
  // 保存草稿
  SaveDraftAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/SaveDraft';
    return httpReq(url, 'post', params);
  },
  // 提交
  CreateAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/Create';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdateAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/Update';
    return httpReq(url, 'post', params);
  },
  // 资产报修审批导出
  ExportStatisticsAssetsRepair: function (params) {
    let url = '/api/ERPWeb/AssetsRepair/ExportStatistics';
    return httpReq(url, 'post', params);
  },
}

// 资产分类
const AssetsType = {
  // 获取资产分类树
  GetGroupAssetsType: function (params) {
    let url = '/api/ERPWeb/AssetsType/GetGroup';
    return httpReq(url, 'get', params);
  },
  // 新增，编辑组记录
  SetTypeAssetsType: function (params) {
    let url = '/api/ERPWeb/AssetsType/SetType';
    return httpReq(url, 'post', params);
  },
   // 删除
  DeleteGroupAssetsType: function (params) {
    let url = '/api/ERPWeb/AssetsType/DeleteGroup';
    return httpReq(url, 'post', params);
  },
   // 查询
  GetByPageAssetsType: function (params) {
    let url = '/api/ERPWeb/AssetsType/GetByPage';
    return httpReq(url, 'post', params);
  },
   // 导出
  ExportAssetsType: function (params) {
    let url = '/api/ERPWeb/AssetsType/Export';
    return httpReq(url, 'post', params);
  },
   // 导入
  ImportAssetsType: function (params) {
    let url = '/api/ERPWeb/AssetsType/Import';
    return httpReq(url, 'post', params);
  },
}

// 出租车信息管理
const Taxi = {
  // 获取出租车数据
  GetDataTaxi: function (params) {
    let url = '/api/ERPWeb/Taxi/GetData';
    return httpReq(url, 'post', params);
  },
  // 添加出租车
  AddTaxi: function (params) {
    let url = '/api/ERPWeb/Taxi/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑出租车
  EditTaxi: function (params) {
    let url = '/api/ERPWeb/Taxi/Edit';
    return httpReq(url, 'post', params);
  },
  // 删除出租车
  DeleteTaxi: function (params) {
    let url = '/api/ERPWeb/Taxi/Delete';
    return httpReq(url, 'post', params);
  },
  // 导出数据
  ExportTaxi: function (params) {
    let url = '/api/ERPWeb/Taxi/Export';
    return httpReq(url, 'post', params);
  },
  // 导入数据
  ImportTaxi: function (params) {
    let url = '/api/ERPWeb/Taxi/Import';
    return httpReq(url, 'postFile', params);
  }
}

// 出租车驾驶员信息管理
const TaxiDriver = {
  // 获取出租车数据
  GetDataTaxiDriver: function (params) {
    let url = '/api/ERPWeb/TaxiDriver/GetData';
    return httpReq(url, 'post', params);
  },
  // 添加出租车司机
  AddTaxiDriver: function (params) {
    let url = '/api/ERPWeb/TaxiDriver/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑出租车司机
  EditTaxiDriver: function (params) {
    let url = '/api/ERPWeb/TaxiDriver/Edit';
    return httpReq(url, 'post', params);
  },
  // 删除出租车司机
  DeleteTaxiDriver: function (params) {
    let url = '/api/ERPWeb/TaxiDriver/Delete';
    return httpReq(url, 'post', params);
  },
  // 导出数据
  ExportTaxiDriver: function (params) {
    let url = '/api/ERPWeb/TaxiDriver/Export';
    return httpReq(url, 'post', params);
  },
  // 导入数据
  ImportTaxiDriver: function (params) {
    let url = '/api/ERPWeb/TaxiDriver/Import';
    return httpReq(url, 'postFile', params);
  }
}

// 资产物品预警规则管理
const ErpGoodsInventoryRule = {
  // 获取物品预警规则
  GetGoodsInventoryRule: function (params) {
    let url = '/api/ERPWeb/ErpGoodsInventoryRule/GetGoodsInventoryRule';
    return httpReq(url, 'get', params);
  },
  // 新增物品预警规则
  AddGoodsInventoryRule: function (params) {
    let url = '/api/ERPWeb/ErpGoodsInventoryRule/AddGoodsInventoryRule';
    return httpReq(url, 'post', params);
  }
}

// 资产入库单管理
const EnterInfo = {
  // 采购生成入库单
  CreateRecordEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/CreateRecord';
    return httpReq(url, 'post', params);
  },
  // 提交入库单
  SetRecordEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 编辑入库单
  EditRecordEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/EditRecord';
    return httpReq(url, 'post', params);
  },
  // 审核入库单
  AuditRecordEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/AuditRecord';
    return httpReq(url, 'post', params);
  },
  // 删除入库单
  DelRecordEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/DelRecord';
    return httpReq(url, 'post', params);
  },
  // 入库单查询
  EnterInfoStatisticsEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/EnterInfoStatistics';
    return httpReq(url, 'post', params);
  },
  // 入库单导出
  ExportEnterInfoStatisticsEnterInfo: function (params) {
    let url = '/api/ERPWeb/EnterInfo/ExportEnterInfoStatistics';
    return httpReq(url, 'post', params);
  },
}

// 资产领用归还
const ErpReceive = {
  // 查看详情
  LookDetailErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 分页获取(统计)
  GetByPageErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取草稿
  GetDraftByUserErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/GetDraftByUser';
    return httpReq(url, 'get', params);
  },
  // 保存草稿
  SaveDraftErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/SaveDraft';
    return httpReq(url, 'post', params);
  },
  // 提交
  CreateErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/Create';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdateErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/Update';
    return httpReq(url, 'post', params);
  },
  // 资产领用归还审批导出
  ExportStatisticsErpReceive: function (params) {
    let url = '/api/ERPWeb/ErpReceive/ExportStatistics';
    return httpReq(url, 'post', params);
  },
}

// 资产物品管理
const GoodsInfo = {
  // 获取物料分组树
  GetGroupGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/GetGroup';
    return httpReq(url, 'get', params);
  },
  // 新增，编辑资产物品记录
  SetTypeGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/SetType';
    return httpReq(url, 'post', params);
  },
  // 删除资产物品记录
  DeleteGroupGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/DeleteGroup';
    return httpReq(url, 'post', params);
  },
  // 获取物品编号
  GetGoodInfoCodeGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/GetGoodInfoCode';
    return httpReq(url, 'get', params);
  },
  // 获取资产物品信息
  GetByPageGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/Export';
    return httpReq(url, 'post', params);
  },
  // 数据导入
  ImportGoodsInfo: function (params) {
    let url = '/api/ERPWeb/GoodsInfo/Import';
    return httpReq(url, 'post', params);
  },
}

// 资产采购管理
const Purchase = {
  // 获取采购申请单数据详情
  LookDetailPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/LookDetail';
    return httpReq(url, 'get', params);
  },
  GetByPagePurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 根据用户获取采购申请单草稿
  GetByUserPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/GetByUser';
    return httpReq(url, 'get', params);
  },
  // 提交采购申请单
  SetRecordPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/SetRecord';
    return httpReq(url, 'post', params);
  },
  // 更新采购申请单
  EditRecordPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/EditRecord';
    return httpReq(url, 'post', params);
  },
  // 提交采购申请单草稿
  SetDraftRecordPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/SetDraftRecord';
    return httpReq(url, 'post', params);
  },
  // 采购申请统计
  FormEntertainStatisticsPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/FormEntertainStatistics';
    return httpReq(url, 'post', params);
  },
  // 采购申请导出
  ExportEntertainStatisticsPurchase: function (params) {
    let url = '/api/ERPWeb/Purchase/ExportEntertainStatistics';
    return httpReq(url, 'post', params);
  }
}

// 活动管理
const ActivityManage = {
  // 分页查询
  GetByPageActivityManage: function (params) {
    let url = '/api/ERPWeb/ActivityManage/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增
  AddActivityManage: function (params) {
    let url = '/api/ERPWeb/ActivityManage/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑
  EditActivityManage: function (params) {
    let url = '/api/ERPWeb/ActivityManage/Edit';
    return httpReq(url, 'post', params);
  },
  // 发布
  PublishRecordActivityManage: function (params) {
    let url = '/api/ERPWeb/ActivityManage/PublishRecord';
    return httpReq(url, 'post', params);
  },
  // 删除记录
  DeleteRecordActivityManage: function (params) {
    let url = '/api/ERPWeb/ActivityManage/DeleteRecord';
    return httpReq(url, 'post', params);
  }
}

// 供应商管理
const SupplierManage = {
  // 分页查询
  GetByPageSupplierManage: function (params) {
    let url = '/api/ERPWeb/SupplierManage/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 删除  + 校验
  DeleteSupplierManage: function (params) {
    let url = '/api/ERPWeb/SupplierManage/Delete';
    return httpReq(url, 'post', params);
  },
  // 删除
  DirectDeleteSupplierManage: function (params) {
    let url = '/api/ERPWeb/SupplierManage/DirectDelete';
    return httpReq(url, 'post', params);
  },
  // 新增 + 校验
  SetInfoSupplierManage: function (params) {
    let url = '/api/ERPWeb/SupplierManage/SetInfo';
    return httpReq(url, 'post', params);
  },
  // 新增
  DirectSetInfoSupplierManage: function (params) {
    let url = '/api/ERPWeb/SupplierManage/DirectSetInfo';
    return httpReq(url, 'post', params);
  },
  // 导出
  ExportSupplierManage: function (params) {
    let url = '/api/ERPWeb/SupplierManage/Export';
    return httpReq(url, 'post', params);
  }
}

// 自行车管理
const BicycleManage = {
  // 新增 或编辑
  AddOrUpdateBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/AddOrUpdate';
    return httpReq(url, 'post', params);
  },
  // 获取我的
  GetByUserIdBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/GetByUserId';
    return httpReq(url, 'post', params);
  },
  // 获取全部
  GetALLBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/GetALL';
    return httpReq(url, 'post', params);
  },
  // 报表查询、按时间段查询
  GetTotalBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/GetTotal';
    return httpReq(url, 'post', params);
  },
  // 获取明细
  GetDetailBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/GetDetail';
    return httpReq(url, 'post', params);
  },
  // 导出明细
  ExportDetailBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/ExportDetail';
    return httpReq(url, 'post', params);
  },
  // 自行车ic卡管理分页获取
  GetBicycleIcByPageBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/GetBicycleIcByPage';
    return httpReq(url, 'post', params);
  },
  // 退卡
  BicycleIcReturnBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/BicycleIcReturn';
    return httpReq(url, 'post', params);
  },
  // 更新本人当天备注
  BicycleIcUpdateRemarkBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/BicycleIcUpdateRemark';
    return httpReq(url, 'post', params);
  },
  // 获取自行车IC卡退卡汇总
  GetBicycleCardTotalBicycleManage: function (params) {
    let url = '/api/ERPWeb/BicycleManage/GetBicycleCardTotal';
    return httpReq(url, 'post', params);
  },
  // Ic卡导出
  ExportBicycleManage: function (params){
    let url = '/api/ERPWeb/BicycleManage/Export';
    return httpReq(url, 'post', params);
  },
  // Ic卡退卡明细
  GetBicycleCardDetail: function (params){
    let url = '/api/ERPWeb/BicycleManage/GetBicycleCardDetail';
    return httpReq(url, 'post', params);
  },
  // Ic卡退卡明细导出
  BicycleCardDetailExport: function (params){
    let url = '/api/ERPWeb/BicycleManage/DetailExport';
    return httpReq(url, 'post', params);
  }
}

// 民主评分
const DemocraticScore = {
  // 查询
  GetPageListDemocraticScore: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/GetPageList';
    return httpReq(url, 'post', params);
  },
  // 评分
  CommitDemocraticScore: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/Commit';
    return httpReq(url, 'post', params);
  },
  // 新增
  CreateAuthorization: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/CreateAuthorization';
    return httpReq(url, 'post', params);
  },
  // 编辑
  UpdateAuthorization: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/UpdateAuthorization';
    return httpReq(url, 'post', params);
  },
  // 获取明细
  GetAuthorizationDetail: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/GetAuthorizationDetail';
    return httpReq(url, 'get', params);
  },
  // 删除
  DeleteDemocraticScore: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/Delete';
    return httpReq(url, 'post', params);
  },
  // 导出
  ExportDemocraticScore: function (params) {
    let url = '/api/ERPWeb/DemocraticScore/Export';
    return httpReq(url, 'post', params);
  },

  // 统计
  GetPageListDemocraticScoreReport: function (params) {
    let url = '/api/ERPWeb/DemocraticScoreReport/GetPageList';
    return httpReq(url, 'post', params);
  },
  // 统计导出
  ExportDemocraticScoreReport: function (params) {
    let url = '/api/ERPWeb/DemocraticScoreReport/Export';
    return httpReq(url, 'post', params);
  },
}
// 企业管理
const EnterpriseManage = {
  ...BusManage,
  ...MeetingRoom,
  ...WaterAndElectricFee,
  ...AdSource,
  ...Contract,
  ...Customer,
  ...House,
  ...PartyOrgan,
  ...PartyRecord,
  ...PartyActivity,
  ...PartyFee,
  ...PartyHonor,
  ...PartyDevelop,
  ...ErpTradeMainManage,
  ...TradeEmployeesLife,
  ...OaWage,
  ...ErpPurchaseReq,
  ...AssetsInfo,
  ...Taxi,
  ...TaxiDriver,
  ...AssetsLife,
  ...AssetsScrap,
  ...AssetsRepair,
  ...AssetsType,
  ...ErpGoodsInventoryRule,
  ...EnterInfo,
  ...ErpReceive,
  ...GoodsInfo,
  ...Purchase,
  ...ActivityManage,
  ...SupplierManage,
  ...BicycleManage,
  ...DemocraticScore
}

export default EnterpriseManage
