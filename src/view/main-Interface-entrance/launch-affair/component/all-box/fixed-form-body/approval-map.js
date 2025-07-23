/**
 * 审批单 id ->文件 映射
 * key ： 填写对应的表单文件名称！！！
 * AddApi: 添加审批单接口函数名
 * updateApi: 修改审批单接口函数名
 */
export default {
  // 资产采购申请单
  1280: {
    key: 'assets-purchase',
    AddApi: 'SetRecordPurchase',
    updateApi: 'EditRecordPurchase'
  },
  // 资产领用单
  1300: {
    key: 'assets-borrow',
    AddApi: 'CreateErpReceive',
    updateApi: 'UpdateErpReceive'
  },
  // 施救车派工单
  1650: {
    key: 'rescue-vehicle-dispatch-form',
    AddApi: 'InsertRescueVehicle',
    updateApi: 'EditRescueVehicle'
  },
  // 员工请（休）假审批表
  5000: {
    key: 'leave-form',
    AddApi: 'SetRecordRestManage',
    updateApi: 'EditRestManage'
  },
  // 加班单
  5010: {
    key: 'work-overtime',
    AddApi: 'CreateOrUpdateReqOaWorkOvertime',
    updateApi: 'UpdateOaWorkOvertime'
  },
  // 出差单
  5020: {
    key: 'business-trip-form',
    AddApi: 'SetRecordTripRecord',
    updateApi: 'UpdateTripRecord'
  },
  // 工作联系单
  5030: {
    key: 'work-contact',
    AddApi: 'SetRecordWorkDeal',
    updateApi: 'UpdateWorkDeal'
  },
  // 月度工作信息表
  5040: {
    key: 'monthly-work',
    AddApi: 'SetRecordOaFormNews',
    updateApi: 'UpdateOaFormNews'
  },
  // 宣传信息审批单
  5050: {
    key: 'promotion-information-form',
    AddApi: 'SetRecordAdvertInfo',
    updateApi: 'EditAdvertInfo'
  },
  // 盖章审批单
  5060: {
    key: 'stamp-approval-form',
    AddApi: 'SetRecordSealCanCel',
    updateApi: 'EditSealCanCel'
  },
  // 线路调整审批单
  5070: {
    key: 'line-adjustment-form',
    AddApi: 'SetRecordLineAdjust',
    updateApi: 'UpdateLineAdjust'
  },
  // 车辆外修联系单
  5080: {
    key: 'vehicle-exterior-repair',
    AddApi: 'SetRecordVehicleRepairContract',
    updateApi: 'EditRecordVehicleRepairContract'
  },
  // 大额汽车配件领用审批单
  5090: {
    key: 'auto-parts-removed',
    AddApi: 'SetRecordOaVehiclePartsReceive',
    updateApi: 'EditOaVehiclePartsReceive'
  },
  // 车辆安全技术检查汇总表
  5100: {
    key: 'vehicle-safe-inspect',
    AddApi: 'CreateVehicleSafeCheck',
    updateApi: 'EditVehicleSafeCheck'
  },
  // 公司内部车辆调配变更审批
  5110: {
    key: 'vehicle-transfer-change',
    AddApi: 'AddByFlowVehicleDeploy',
    updateApi: 'EditFlowVehicleDeploy'
  },
  // 新招聘员工申请表
  5120: {
    key: 'new-hire-application-form',
    AddApi: 'CreateNewRecruitPerson',
    updateApi: 'EditNewRecruitPerson'
  },
  // 新进职工分配表
  5130: {
    key: 'new-employee-allocation-form',
    AddApi: 'CreateNewPersonAllocation',
    updateApi: 'EditNewPersonAllocation'
  },
  // 新进职工（含派遣）试用期考核表
  5140: {
    key: 'employee-assessment-form',
    AddApi: 'SetRecordNewPersonTryCheck',
    updateApi: 'UpdateNewPersonTryCheck'
  },
  // 劳动用工联系单
  5150: {
    key: 'employment-contact-form',
    AddApi: 'SetRecordWorkLaborContract',
    updateApi: 'EditWorkLaborContract'
  },
  // 岗位聘任申请表
  5160: {
    key: 'appointment-application-form',
    AddApi: 'SetRecordPostAppointment',
    updateApi: 'UpdatePostAppointment'
  },
  // 劳务派遣人员辞职报告处理单
  5170: {
    key: 'resignation-dispatch-form',
    AddApi: 'SetRecordLaborDepart',
    updateApi: 'UpdateLaborDepart'
  },
  // 职工退休返聘申请表
  5180: {
    key: 'retirement-employees-form',
    AddApi: 'CreateEmployRetirement',
    updateApi: 'EditEmployRetirement'
  },
  // 申请银行开户审批表
  5190: {
    key: 'bank-opening-form',
    AddApi: 'CreateBankOpen',
    updateApi: 'UpdateBankOpen'
  },
  // 申请银行销户审批表
  5200: {
    key: 'bank-cancellation-form',
    AddApi: 'SetRecordBankCancle',
    updateApi: 'EditBankCancle'
  },
  // 奖励登记表
  5210: {
    key: 'reward-registration-form',
    AddApi: 'SetRecordRewardRegistration',
    updateApi: 'EditRewardRegistration'
  },
  // 驾驶员请假
  5230: {
    key: 'leave-driver-form',
    AddApi: 'DriverSetRecord',
    updateApi: 'DriverEdit'
  },
  // 乘客误刷处理单
  5250: {
    key: 'passengers-mistakenly-form',
    AddApi: 'CreateMistakeHandle',
    updateApi: 'EditMistakeHandle'
  },
  // 星级微调
  5260: {
    key: 'star-trim-form',
    AddApi: 'AddDriverStarAdjust',
    updateApi: ''
  },
  // 人员调动审批
  5290: {
    key: 'staff-movement-form',
    AddApi: 'CreateOaPersonTransfer',
    updateApi: 'EditOaPersonTransfer'
  },
  // 小额采购审批
  6500: {
    key: 'small-purchase-form',
    AddApi: 'CreateSmallPurchase',
    updateApi: 'UpdateSmallPurchase'
  },
  // 停驶车辆申请报告
  6600: {
    key: 'parking-vehicle-form',
    AddApi: 'CreateStopVehicle',
    updateApi: 'UpdateStopVehicle'
  },
  // 合理化意见反馈表
  6700: {
    key: 'rationalization-feedback-form',
    AddApi: 'CreateCustomSuggestion',
    updateApi: 'UpdateCustomSuggestion'
  },
  // 公车装饰维修审批单
  6800: {
    key: 'bus-decoration-maintenance-form',
    AddApi: 'CreateCompanyBusDecorate',
    updateApi: 'UpdateCompanyBusDecorate'
  },
  // 燃料考核审批单
  6900: {
    key: 'fuel-assess-approval-form',
    AddApi: 'CreateFuelAssess',
    updateApi: 'UpdateFuelAssess'
  },
  // 安全隐患记录
  // 7100: {
  //   key:'safety-hazard-form',
  //   AddApi: '',
  //   updateApi: ''
  // },
  // 安全隐患记录反馈
  7200: {
    key: 'corrective-feedback-form',
    AddApi: 'CreateHiddenDangerFeedBack',
    updateApi: ''
  },
  // 员工工作服配置审批单
  8000: {
    key: 'worker-clothes-configuration-form',
    AddApi: 'CreateEmployeeWearSetting',
    updateApi: 'UpdateEmployeeWearSetting'
  },
  // 劳务用工审批单
  8100: {
    key: 'labor-employment-approval-form',
    AddApi: 'CreateLaborService',
    updateApi: 'UpdateLaborService'
  },
  // 聘用工及临时性用工审批单
  8200: {
    key: 'employment-temporary-employment-form',
    AddApi: 'CreateOutsourcing',
    updateApi: 'UpdateOutsourcing'
  },
  // 禾骑行用户退押金清单
  8400: {
    key: 'he-deposit-refund-form',
    AddApi: 'CreateHeBicycle',
    updateApi: 'UpdateHeBicycle'
  },
  // 叮嗒租车超时费退款单
  8500: {
    key: 'ding-overtime-refund-form',
    AddApi: 'CreateDingDaCar',
    updateApi: 'UpdateDingDaCar'
  },
  // 外派培训申请表
  8600: {
    key: 'expatriate-train-apply-form',
    AddApi: 'CreateOverseasTraining',
    updateApi: 'UpdateOverseasTraining'
  },
  // 行车安全优秀驾驶员审批表
  8700: {
    key: 'driving-excellent-driver-form',
    AddApi: 'CreateOaDriverSafety',
    updateApi: 'UpdateOaDriverSafety'
  }
}
