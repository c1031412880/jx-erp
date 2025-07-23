import httpReq from "../http";

//  维修组织
const FlowRecord = {
    // 获取维修组织下拉框
    getMaintainDep: function (params) {
        let url = '/api/ERPWeb/FlowRecord/GetDepartment';
        return httpReq(url, 'get', params);
    },
    // 查询维修班组
    getMaintDeptGetShop: function (params) {
        let url = '/api/ERPWeb/FlowRecord/GetShop';
        return httpReq(url, 'get', params);
    },
    // 查询维修人员
    getMaintDeptGetPerson: function (params) {
        let url = '/api/ERPWeb/FlowRecord/GetPerson';
        return httpReq(url, 'get', params);
    },
}
//工单结算
const MaintRepairFee = {
    // 获取结算信息
    getByOrderIdMaintRepairFee: function (params) {
        let url = '/api/ERPWeb/MaintRepairFee/GetByOrderId';
        return httpReq(url, 'get', params);
    },
    // 新增结算
    addMaintRepairFee: function (params) {
        let url = '/api/ERPWeb/MaintRepairFee/Add';
        return httpReq(url, 'post', params);
    },
    // 更新结算
    updatedMaintRepairFee: function (params) {
        let url = '/api/ERPWeb/MaintRepairFee/Update';
        return httpReq(url, 'post', params);
    },
    // 更改结算状态
    updateStateMaintRepairFee: function (params) {
        let url = '/api/ERPWeb/MaintRepairFee/UpdateState';
        return httpReq(url, 'post', params);
    },
}
// 工单管理
const MaintRepairOrder = {
      // 工单操作记录
  getRepairLife: function (params) {
    let url = '/api/ERPWeb/MaintRepairOrder/GetRepairLife';
    return httpReq(url, 'get', params);
  },
    // 查询工单管理记录
    getrOrderList: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetByPage';
        return httpReq(url, 'post', params);
    },
    // 编辑工单管理记录
    updateOrderList: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/Update';
        return httpReq(url, 'post', params);
    },
    //工单状态更改状态
    updateOrderState: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/UpdateState';
        return httpReq(url, 'post', params);
    },
    // 派工
    addOrderItem: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/AddOrderItem';
        return httpReq(url, 'post', params);
    },
    // 删除派工
    DeleteByIdsMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/DeleteByIds';
        return httpReq(url, 'post', params);
    },
    //上传维修资料
    AddOrderFile: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/AddOrderFile';
        return httpReq(url, 'post', params);
    },
    //获取维修资料
    getOrderFile: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetOrderFile';
        return httpReq(url, 'get', params);
    },
    // 工单统计
    getOrderCount: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetOrderTotalData';
        return httpReq(url, 'get', params);
    },
    // 工单操作记录
    getStepById: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetStepById';
        return httpReq(url, 'get', params);
    },
    //工单作废
    updateOrderScrap: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/UpdateScrap';
        return httpReq(url, 'post', params);
    },
    // 导出工单记录
    exporMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/Export';
        return httpReq(url, 'post', params);
    },
    // 导出车辆维修记录
    exportVehMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/Export1';
        return httpReq(url, 'post', params);
    },
    // 导出单车维修费用汇总
    exportCarFeeDetail: function (params) {
      let url = '/api/ERPWeb/MaintRepairOrder/ExportCarFeeDetail';
      return httpReq(url, 'post', params);
    },
    // 无流程工单列表
    getByPageSimpletMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetByPageSimple';
        return httpReq(url, 'post', params);
    },
    // 无流程工单列表(车辆详情用)
    GetNewByPageSimpleMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetNewByPageSimple';
        return httpReq(url, 'post', params);
    },
    // 新增无流程工单
    addSimpleMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/AddSimple';
        return httpReq(url, 'post', params);
    },
    // 修改无流程工单
    updateSimpleMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/UpdateSimple';
        return httpReq(url, 'post', params);
    },
    // 修改无流程工单明细
    EditItemHourMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/EditItemHour';
        return httpReq(url, 'post', params);
    },
    // 删除工单
    DeleteManyMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/DeleteMany';
        return httpReq(url, 'post', params);
    },
    // 报废工单
    CancelManyMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/Cancel';
        return httpReq(url, 'post', params);
    },
    // 导出结算单
    ExportTableMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/ExportTable';
        return httpReq(url, 'get', params);
    },

    // 新增，编辑领料记录
    addMaintRepairPick: function (params) {
      let url = '/api/ERPWeb/MaintRepairPick/SetRecord';
      return httpReq(url, 'post', params);
    },
    // 查询领料记录
    getMaintRepairPick: function (params) {
      let url = '/api/ERPWeb/MaintRepairPick/GetByPage'
      return httpReq(url, 'post', params);
    },
    // 删除领料记录
    delMaintRepairPick: function (params) {
      let url = '/api/ERPWeb/MaintRepairPick/DeleteRecord'
      return httpReq(url, 'post', params);
    },
    // 导出领料记录
    exportMaintRepairPick: function (params) {
      let url = '/api/ERPWeb/MaintRepairPick/Export'
      return httpReq(url, 'post', params);
    },
    // 新增退料记录
    addMaintRepairRefund: function (params) {
      let url = '/api/ERPWeb/MaintRepairRefund/SetRecord';
      return httpReq(url, 'post', params);
    },
    // 查询退料记录
    getMaintRepairRefund: function (params) {
      let url = '/api/ERPWeb/MaintRepairRefund/GetByPage'
      return httpReq(url, 'post', params);
    },
    // 删除退料记录
    delMaintRepairRefund: function (params) {
      let url = '/api/ERPWeb/MaintRepairRefund/DeleteRecord'
      return httpReq(url, 'post', params);
    },
    // 导出退料记录
    exportMaintRepairRefund: function (params) {
      let url = '/api/ERPWeb/MaintRepairRefund/Export'
      return httpReq(url, 'post', params);
    },
    // 获取工单简要信息
    getMaintRepairSimpleData: function (params) {
      let url = '/api/ERPWeb/MaintRepairOrder/GetSimpleData'
      return httpReq(url, 'get', params);
    },
    // 事故维修费用同步
    ToAccientMaintRepairOrder: function (params) {
      let url = '/api/ERPWeb/MaintRepairOrder/ToAccient'
      return httpReq(url, 'get', params);
    },
    // 批量完工
    CompleteManyOrderMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/CompleteManyOrder'
        return httpReq(url, 'post', params);
    },
    // 检验是否重复维修项目
    NoticeRepeatMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/NoticeRepeatRepairItem';
        return httpReq(url, 'get', params);
    },

}
//报修管理
const MaintRepairRecord1= {
    // 分页查询报修管理
    getByPageMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/GetByPage';

        return httpReq(url, 'post', params);
    },
    // 获取报修信息
    getMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/GetById';

        return httpReq(url, 'get', params);
    },
    // 添加报修管理
    addMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/Add';
        return httpReq(url, 'post', params);
    },
    // 编辑报修管理
    editMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/Update';
        return httpReq(url, 'post', params);
    },
    // 删除报修管理
    deletecRepair: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/DeleteMany';

        return httpReq(url, 'post', params);
    },
    //报修管理检验
    checkMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/Check';
        return httpReq(url, 'post', params);
    },
    //报修大额审批大
    checkFlowMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/CheckWithAuthorization';
        return httpReq(url, 'post', params);
    },
    //获取检验信息
    GetByRepairId: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/GetByRepairId';
        return httpReq(url, 'get', params);
    },
    // 导出报修记录
    exporMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/Export';
        return httpReq(url, 'post', params);
    },
     // 导出报修单
     exportTableMaintRepairRecord: function (params) {
        let url = '/api/ERPWeb/MaintRepairRecord/ExportTable';
        return httpReq(url, 'get', params);
    },
    // 获取维修计划执行率
    GetMaintenancePlanExecutionReportHomePage: function (params) {
        let url = '/api/ERPWeb/HomePage/GetMaintenancePlanExecutionReport';
        return httpReq(url, 'get', params);
    },
}
// 外修管理
const outsideRepairRecord = {
    // 分页查询外修管理
    getByPageRepairOut: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/GetByPage';
        return httpReq(url, 'post', params);
    },
    // 查看详情
    lookMaintRepairOut: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/Look';
        return httpReq(url, 'get', params);
    },
    // 撤销外修管理
    // revokeRepairOutside: function (params) {
    //     let url = '/api/ERPWeb/MaintRepairOut/Revoke';
    //     return httpReq(url, 'post', params);
    // },
    // 添加外修管理
    addMaintRepairOut: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/Add';
        return httpReq(url, 'post', params);
    },
    // 编辑外修管理
    updateMaintRepairOut: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/Update';
        return httpReq(url, 'post', params);
    },
    // 删除外修管理
    deleteMaintRepairOut: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/Delete';
        return httpReq(url, 'post', params);
    },
    // 导出外修信息
    exportMaintRepairOut: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/Export';
        return httpReq(url, 'post', params);
    },
    // 获取外修送修单位
    getRepairUnit: function (params) {
        let url = '/api/ERPWeb/MaintRepairOut/GetRepairUnit';
        return httpReq(url, 'get', params);
    },
}
//无流程维修
const Seamless ={
      //获得车辆出库单
      getMaterialByVehMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetMaterialByVeh';
        return httpReq(url, 'get', params);
    },
        //获得出库单详情
        getByLeaveNumMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetByLeaveNum';
        return httpReq(url, 'get', params);
    },
        //获得工单物料
        getMaterialByOrderMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/GetMaterialByOrder';
        return httpReq(url, 'get', params);
    },
      // 保存物料工单
      addMaterialMaintRepairOrder: function (params) {
        let url = '/api/ERPWeb/MaintRepairOrder/AddMaterial';
        return httpReq(url, 'post', params);
    },
}
//三包维修
const thirdservices ={
      // 获取三包维修分页
    getByPageMaintRepairPackage: function (params) {
        let url = '/api/ERPWeb/MaintRepairPackage/GetByPage';
        return httpReq(url, 'post', params);
    },
      // 新增三包维修
    setRecordMaintRepairPackage: function (params) {
        let url = '/api/ERPWeb/MaintRepairPackage/SetRecord';
        return httpReq(url, 'post', params);
    },
      // 删除三包维修
    deleteRecordMaintRepairPackage: function (params) {
        let url = '/api/ERPWeb/MaintRepairPackage/DeleteRecord';
        return httpReq(url, 'post', params);
    },
    //导出三包维修
    exportMaintRepairPackage: function (params) {
        let url = '/api/ERPWeb/MaintRepairPackage/Export';
        return httpReq(url, 'post', params);
    },
}
// 维修报表管理
const MaintRepairReport ={
   //获取工时计价规则明细
    getRulesMaintRepairReport: function (params) {
        let url = '/api/ERPWeb/MaintRepairReport/GetRules';
        return httpReq(url, 'get', params);
    },
      //新增工时计价规则
    addRulesMaintRepairReport: function (params) {
        // let url = '​/api/ERPWeb/MaintRepairReport/AddRules';
        let url = '/api/ERPWeb/MaintRepairReport/AddRules';
        return httpReq(url, 'post', params);
    },
      //获取工时报表记录
    getRecordMaintRepairReport: function (params) {
        let url = '/api/ERPWeb/MaintRepairReport/GetRecord';
        return httpReq(url, 'post', params);
    },
      //导出工时报表
    exportMaintRepairReport: function (params) {
        let url = '/api/ERPWeb/MaintRepairReport/Export';
        return httpReq(url, 'post', params);
    },
   //获取全部维修人员
    getPersonsMaintRepairReport: function (params) {
        let url = '/api/ERPWeb/MaintRepairReport/GetPersons';
        return httpReq(url, 'post', params);
    },
    //获取详情
    getDetailMaintRepairReport: function (params) {
        let url = '/api/ERPWeb/MaintRepairReport/GetDetail';
        return httpReq(url, 'post', params);
    },
    //获取详情导出
    exportDetailMaintRepairReport: function (params) {
        let url = '/api/ERPWeb/MaintRepairReport/ExportDetail';
        return httpReq(url, 'post', params);
    },

}
//维修物料费用统计表
const RepairMaterialFeeReport ={
    //获取表头
    getTitleRepairMaterialFeeReport: function (params) {
        let url = '/api/ERPWeb/RepairMaterialFeeReport/GetTitle';
        return httpReq(url, 'get', params);
    },
     //按车辆汇总
    getDataByVehicleRepairMaterialFeeReport: function (params) {
        let url = '/api/ERPWeb/RepairMaterialFeeReport/GetDataByVehicle';
        return httpReq(url, 'post', params);
    },
     //按线路汇总
    getDataByLineRepairMaterialFeeReport: function (params) {
        let url = '/api/ERPWeb/RepairMaterialFeeReport/GetDataByLine';
        return httpReq(url, 'post', params);
    },
     //按供应商汇总
    GetTotalBySupplierRepairMaterialFeeReport: function (params) {
        let url = '/api/ERPWeb/RepairMaterialFeeReport/GetTotalBySupplier';
        return httpReq(url, 'post', params);
    },
     //按车辆导出
    exportVehicleRepairMaterialFeeReport: function (params) {
        let url = '/api/ERPWeb/RepairMaterialFeeReport/ExportVehicle';
        return httpReq(url, 'post', params);
    },
    //按线路导出
    exportLineRepairMaterialFeeReport: function (params) {
        let url = '/api/ERPWeb/RepairMaterialFeeReport/ExportLine';
        return httpReq(url, 'post', params);
    },
}
//报修推送规则
const MaintNoticeRule ={
    //获取车间推送规则记录
    GeRuleDataMaintNoticeRule: function (params) {
        let url = '/api/ERPWeb/MaintNoticeRule/GeRuleData';
        return httpReq(url, 'get', params);
    },
     //保存（批量新增、编辑数据）
     SaveRulesMaintNoticeRule: function (params) {
        let url = '/api/ERPWeb/MaintNoticeRule/SaveRules';
        return httpReq(url, 'post', params);
    },
     //单条新增推送规则
     AddRulesMaintNoticeRule: function (params) {
        let url = '/api/ERPWeb/MaintNoticeRule/AddRules';
        return httpReq(url, 'post', params);
    },
     //重置推送规则
     DeleteRulesMaintNoticeRule: function (params) {
        let url = '/api/ERPWeb/MaintNoticeRule/DeleteRules';
        return httpReq(url, 'post', params);
    }
}

//维修全局设置（十二月新需求、崔旭林）
const MaintMainRule ={
    //获取列表
    GetListMaintMainRule: function (params) {
        let url = '/api/ERPWeb/MaintMainRule/GetList';
        return httpReq(url, 'post', params);
    },
     //获取详情
     GetDetailMaintMainRule: function (params) {
        let url = '/api/ERPWeb/MaintMainRule/GetDetail';
        return httpReq(url, 'get', params);
    },
     //单条新增
     SingleInsertMaintMainRule: function (params) {
        let url = '/api/ERPWeb/MaintMainRule/SingleInsert';
        return httpReq(url, 'post', params);
    },
     //单条编辑
     SingleUpdateMaintMainRule: function (params) {
        let url = '/api/ERPWeb/MaintMainRule/SingleUpdate';
        return httpReq(url, 'post', params);
    },
     //保存编辑
     BatchModifyMaintMainRule: function (params) {
        let url = '/api/ERPWeb/MaintMainRule/BatchModify';
        return httpReq(url, 'post', params);
    }
}

//班组人员完工（十二月新需求、崔旭林）
const CompletedSignDetail ={
    //确认完工
    CompleteStateCompletedSignDetail: function (params) {
        let url = '/api/ERPWeb/CompletedSignDetail/CompleteStateOption';
        return httpReq(url, 'post', params);
    },
     //获取列表
     GetListCompletedSignDetail: function (params) {
        let url = '/api/ERPWeb/CompletedSignDetail/GetList';
        return httpReq(url, 'post', params);
    },
     //保存或编辑
     BatchModifyCompletedSignDetail: function (params) {
        let url = '/api/ERPWeb/CompletedSignDetail/BatchModify';
        return httpReq(url, 'post', params);
    },
}

//施救车派工单
const RescueVehicle ={
    //分页获取列表数据
    GetPageListRescueVehicle: function (params) {
        let url = '/api/ERPWeb/RescueVehicle/GetPageList';
        return httpReq(url, 'post', params);
    },
     //添加
    InsertRescueVehicle: function (params) {
        let url = '/api/ERPWeb/RescueVehicle/CreateAuthorization';
        return httpReq(url, 'post', params);
    },
     //获取详情数据
    GetDetailsRescueVehicle: function (params) {
        let url = '/api/ERPWeb/RescueVehicle/GetAuthorizationDetail';
        return httpReq(url, 'get', params);
    },
     //编辑
    EditRescueVehicle: function (params) {
        let url = '/api/ERPWeb/RescueVehicle/UpdateAuthorization';
        return httpReq(url, 'post', params);
    },
     //数据导出
    ExportRescueVehicle: function (params) {
        let url = '/api/ERPWeb/RescueVehicle/Export';
        return httpReq(url, 'post', params);
    }
}

//大额维修审批单
const LimitRepairOrder ={
    //添加
    InsertLimitRepairOrder: function (params) {
        let url = '/api/ERPWeb/LimitRepairOrder/Insert';
        return httpReq(url, 'post', params);
    },
     //获取详情数据
    GetDetailsLimitRepairOrder: function (params) {
        let url = '/api/ERPWeb/LimitRepairOrder/GetAuthorizationDetail';
        return httpReq(url, 'get', params);
    },
}

//返修统计表
const RepairRepeatReport ={
    //分页获取
    GetPageListRepairRepeatReport: function (params) {
        let url = '/api/ERPWeb/RepairRepeatReport/GetPageList';
        return httpReq(url, 'post', params);
    },
     //获取详情数据
    GetDetailsRepairRepeatReport: function (params) {
        let url = '/api/ERPWeb/RepairRepeatReport/GetDetails';
        return httpReq(url, 'get', params);
    },
     //审核
    AuditRepairRepeatReport: function (params) {
        let url = '/api/ERPWeb/RepairRepeatReport/Audit';
        return httpReq(url, 'post', params);
    },
     //导出
    ExportRepairRepeatReport: function (params) {
        let url = '/api/ERPWeb/RepairRepeatReport/Export';
        return httpReq(url, 'post', params);
    },
     //返修统计表提醒人员获取
    GetDetailRepeatRepairNotice: function (params) {
        let url = '/api/ERPWeb/RepeatRepairNotice/GetDetail';
        return httpReq(url, 'get', params);
    },
     //返修统计表提醒人员设置
    InsertRepeatRepairNotice: function (params) {
        let url = '/api/ERPWeb/RepeatRepairNotice/Insert';
        return httpReq(url, 'post', params);
    },
}

// 报修管理
const MaintRepairRecord = {
    ...Seamless,
    ...FlowRecord,
    ...MaintRepairFee,
    ...MaintRepairOrder,
    ...MaintRepairRecord1,
    ...thirdservices,
    ...outsideRepairRecord,
    ...MaintRepairReport,
    ...RepairMaterialFeeReport,
    ...MaintNoticeRule,
    ...MaintMainRule,
    ...CompletedSignDetail,
    ...RescueVehicle,
    ...LimitRepairOrder,
    ...RepairRepeatReport,
}

export default MaintRepairRecord
