export default {
  // 发动机信息
  engineConfig: {
    apiKey: 'getByVehIdEngineManage',
    title: '发动机信息',
    apiForm: {
      vehicle_ids: []
    },
    TableHeight: 300,
    TableHeader: [
      {label: "发动机编号", prop: "code", width: "140",sortable:true},
      {label: "发动机类型", prop: "model_name", width: "120"},
      {label: "购买日期", prop: "buy_date", width: "120",sortable:true},
      {label: "安装日期", prop: "install_date", width: "120",sortable:true},
      {label: "拆卸日期", prop: "dismantle", width: "120",sortable:true},
      {label: "随车里程(km)", prop: "mileage", width: "150",sortable:true},
      {label: "品牌", prop: "brand", width: "120"},
      {label: "厂牌", prop: "firm", width: "120"},
      {label: "功率", prop: "power", width: "120",sortable:true},
      {label: "备注", prop: "remark", width: "120"},
    ],
  },
  // 电瓶信息
  batteryConfig: {
    apiKey: 'getRecordByVehicleidBatBottle',
    title: '电瓶信息',
    TableHeight: 300,
    apiForm: {
      vehicle_id: ''
    },
    TableHeader: [
      {label: "电瓶编号", prop: "code", width: "120",sortable:true},
      {label: "电瓶类型", prop: "name", width: "120"},
      {label: "购买日期", prop: "buy_date", width: "120",sortable:true},
      {label: "单价", prop: "price", width: "120",sortable:true},
      {label: "放置位置", prop: "position_name", width: "120"},
      {label: "额定容量", prop: "rate_capacity", width: "120",sortable:true},
      {label: "混合动力类型", prop: "type_name", width: "120"},
      {label: "电瓶种类", prop: "bat_type", width: "120"},
      {label: "电瓶品牌", prop: "brand", width: "120"},
      {label: "安装日期", prop: "install_date", width: "120",sortable:true},
      {label: "拆卸日期", prop: "dismantle_date", width: "120",sortable:true},
      {label: "随车里程", prop: "miles", width: "120",sortable:true},
      {label: "备注", prop: "remark", width: "120"},
    ]
  },
  // 轮胎信息
  tyreConfig: {
    apiKey: 'getByPageTyreManage',
    title: '轮胎信息',
    apiForm: {
      vehicle_ids: []
    },
    TableHeight: 300,
    TableHeader: [
      {label: "轮胎编号", prop: "code", width: "120",sortable:true},
      {label: "轮胎规格型号", prop: "type_name", width: "120"},
      {label: "轮胎品牌", prop: "tyre_mode_brand", width: "120"},
      {label: "轮胎厂牌", prop: "tyre_mode_firm", width: "120"},
      {label: "轮胎类别", prop: "type_name", width: "120"},
      {label: "所属组织", prop: "department_name", width: "120"},
      {label: "单价", prop: "price", width: "120",sortable:true}
    ]
  },
  // 车辆保险记录
  vehicleInsurance: {
    apiKey: 'getByPageVehicleInsurance',
    label: '说明：车辆保险记录数据来源于安全管理--车辆保险管理',
    TableHeight: 450,
    apiForm: {
      vehicle_ids: []
    },
    TableHeader: [
      {label: "投保日期", prop: "insurance_start", width: "120",sortable:true},
      {label: "到期日期", prop: "insurance_end", width: "120",sortable:true},
      {label: "保险种类", prop: "type_name", width: "120"},
      {label: "投保金额", prop: "insure_fee", width: "120",sortable:true},
      {label: "实付金额", prop: "actual_fee", width: "120",sortable:true},
      {label: "保险公司", prop: "company_name", width: "120"},
      {label: "保险单号", prop: "insurance_code", width: "120",sortable:true},
      {label: "备注", prop: "remark", width: "120"}
    ]
  },
  // 车辆年检记录
  vehicleYearlyInspection: {
    apiKey: 'GetHisRecordCheckPlan',
    apiForm: {
      vehicle_id: ''
    },
    TableHeight: 450,
    TableHeader: [
      {label: "登记证书日期", prop: "regist_date", width: "120",sortable:true},
      {label: "实际年检日期", prop: "check_true", width: "120",sortable:true},
      {label: "计划年检截止日期", prop: "check_paln", width: "140",sortable:true},
      {label: "相关图片", prop: "img_path", width: "120"},
      {label: "备注", prop: "remark", width: "120"},
    ]
  },
  // 车辆维修记录
  vehicleRepair: {
    apiKey: '',
    TableHeight: 450,
    apiForm: {
      vehicle_id: ''
    },
    TableHeader: [
      {label: "工单号", prop: "lp_num", width: "120",sortable:true},
      {label: "自编号", prop: "lp_num", width: "120",sortable:true},
      {label: "车牌号", prop: "lp_num", width: "120",sortable:true},
      {label: "车型", prop: "lp_num", width: "120"},
      {label: "线路", prop: "lp_num", width: "120",sortable:true},
      {label: "驾驶员", prop: "lp_num", width: "120"},
    ]
  },
  // 车辆保养记录
  vehicleMaintain: {
    apiKey: '',
    TableHeight: 450,
    apiForm: {
      vehicle_id: ''
    },
    TableHeader: [
      {label: "工单号", prop: "lp_num", width: "120"},
      {label: "自编号", prop: "lp_num", width: "120"},
      {label: "车牌号", prop: "lp_num", width: "120"},
      {label: "车型", prop: "lp_num", width: "120"},
      {label: "线路", prop: "lp_num", width: "120"},
      {label: "驾驶员", prop: "lp_num", width: "120"},
    ]
  },
  // 车辆调动记录
  vehicleTransfer: {
    apiKey: 'GetCarChangeRecordVehicleManager',
    apiForm: {
      vehicle_id: ''
    },
    TableHeight: 450,
    label: '说明：车辆调动记录数据来源于机务管理--车辆调动管理',
    TableHeader: [
      {label: "自编号", prop: "vehicle_num", width: "120"},
      {label: "车牌号", prop: "lp_num", width: "120"},
      {label: "车辆类型", prop: "vehicle_kind", width: "120"},
      {label: "车龄", prop: "vehicle_age", width: "120"},
      {label: "原组织", prop: "origin_dept", width: "120"},
      {label: "新组织", prop: "new_dept", width: "120"},
      {label: "操作人", prop: "operate_person", width: "120"},
      {label: "操作时间", prop: "operate_time", width: "120"},
    ]
  },
  // 事故记录
  accidentRecord: {
    apiKey: 'getAccidentRecordList',
    TableHeight: 450,
    label: '说明：车辆事故记录数据来源于安全管理--车辆事故管理',
    apiForm: {
      i_vehicle_id: []
    },
    TableHeader: [
      {label: "自编号", prop: "vehicle_number", width: "120",sortable:true},
      {label: "车牌号", prop: "lincense_plate_number", width: "120",sortable:true},
      {label: "所属部门", prop: "department_name", width: "120"},
      {label: "线路", prop: "line", width: "120"},
      {label: "事故发生时间", prop: "d_accident_date", width: "160",sortable:true},
      {label: "驾驶员", prop: "driver_name", width: "120"},
      {label: "事故描述", prop: "c_describe", width: "120"},
      {label: "事故类型", prop: "accident_type", width: "120"},
      {label: "事故原因", prop: "accident_reason", width: "120"},
      {label: "事故地点", prop: "c_accident_address", width: "120"},
      {label: "事故责任", prop: "accident_duty", width: "120"},
      {label: "事故损失合计（元）", prop: "n_estimate_fee", width: "170"},
      {label: "事故净损失（元）", prop: "n_loss_fee", width: "170"},
      // {label: "实际理赔", prop: "actual_fee", width: "120",sortable:true},
    ]
  }
}
