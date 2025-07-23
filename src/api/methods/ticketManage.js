import httpReq from "../http";

// 现金对账
const CashEnter = {
  // 获取现金对账信息
  getByPageCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/GetByPage';

    return httpReq(url, 'post', params);
  },
   // 现金对账新增，编辑记录
   setRecordCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/SetRecord';

    return httpReq(url, 'post', params);
  },
   // 现金对账删除记录
   deleteRecordCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/DeleteRecord';

    return httpReq(url, 'post', params);
  },
   // 现金对账取消审核记录
   reviewCancelRecordCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/ReviewCancelRecord';

    return httpReq(url, 'post', params);
  },
   // 现金对账批量审核记录
   reviewRecordCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/ReviewRecord';

    return httpReq(url, 'post', params);
  },
  // 现金对账数据导出
  exportCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/Export';

    return httpReq(url, 'post', params);
  },
  // 现金对账数据导入
  importCashEnter: function (params) {
    var url = '/api/ERPWeb/CashEnter/Import';

    return httpReq(url, 'postFile', params);
  },

}
// 刷卡消费统计
const CreditCartConsumptionSummary = {
  // 获取刷卡消费统计汇总
  GetCreditCardConsumptionSummary: function (params) {
    var url = '/api/ERPWeb/CreditCartConsumptionSummary/GetCreditCardConsumptionSummary'
    return httpReq(url, 'post', params);
  },

  // 查看明细
  GetCreditCardConsumptionDetl: function (params) {
    var url = '/api/ERPWeb/CreditCartConsumptionSummary/GetCreditCardConsumptionDetl'

    return httpReq(url, 'post', params);
  },

  // 导出刷卡消费记录
  CreditCartConsumptionSummary: function (params) {
    var url = '/api/ERPWeb/CreditCartConsumptionSummary/Export'

    return httpReq(url, 'post', params);
  },
  // 导出刷卡消费明细
  CreditCreditCardConsumptionSummary: function (params) {
    var url = '/api/ERPWeb/CreditCartConsumptionSummary/ExportDetl'

    return httpReq(url, 'post', params);
  },
}

// 日钱袋录入
const DayPurse = {
  // 获取日钱袋信息
  GetByPageDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/GetByPage';

    return httpReq(url, 'post', params);
  },
  // 新增，编辑记录
  SetRecordDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/SetRecord';

    return httpReq(url, 'post', params);
  },
  // 删除记录
  DeleteRecordDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/DeleteRecord';

    return httpReq(url, 'post', params);
  },
  // 批量审核记录
  ReviewRecordDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/ReviewRecord';

    return httpReq(url, 'post', params);
  },
  // 取消审核记录
  ReviewCancelRecordDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/ReviewCancelRecord';

    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/Export';

    return httpReq(url, 'post', params);
  },
  // 数据导入
  ImportDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/Import';

    return httpReq(url, 'postFile', params);
  },
  // 获取批量录入数据
  GetSimpleDataDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/GetSimpleData';

    return httpReq(url, 'post', params);
  },
  // 批量录入保存
  SaveSimpleDataDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/SaveSimpleData';

    return httpReq(url, 'post', params);
  },
  // 日钱袋线路统计
  GetLineSummaryDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/GetLineSummary';

    return httpReq(url, 'post', params);
  },
  // 线路汇总数据导出
  LineSummaryExportDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/LineSummaryExport';

    return httpReq(url, 'post', params);
  },
  // 获取日钱袋车辆汇总信息
  GetVehicleSummaryDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/GetVehicleSummary';

    return httpReq(url, 'post', params);
  },
  // 车辆汇总数据导出
  VehicleSummaryExportDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/VehicleSummaryExport';

    return httpReq(url, 'post', params);
  },
  // IC卡数据导入
  ICImportDayPurse: function (params) {
    var url = '/api/ERPWeb/DayPurse/ICImport';

    return httpReq(url, 'post', params);
  },
}

// 点钞录入
const RecKon = {
  // 获取现金对账信息
  getByPageRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/GetByPage';

    return httpReq(url, 'post', params);
  },
  // 新增，编辑记录
  setRecordRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/SetRecord';

    return httpReq(url, 'post', params);
  },
  // 删除记录
  deleteRecordRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/DeleteRecord';

    return httpReq(url, 'post', params);
  },
  // 批量审核记录
  reviewRecordRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/ReviewRecord';

    return httpReq(url, 'post', params);
  },
  // 取消审核记录
  reviewCancelRecordRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/ReviewCancelRecord';

    return httpReq(url, 'post', params);
  },
  // 点钞录入数据导出
  exportRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/Export';

    return httpReq(url, 'post', params);
  },
  // 点钞录入数据导入
  importRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/Import';

    return httpReq(url, 'postFile', params);
  },
  // 根据线路ID获取所属车辆
  getVehiclesRecKon: function (params) {
    var url = '/api/ERPWeb/RecKon/GetVehicles';

    return httpReq(url, 'get', params);
  },
}
// 营收统计
const RevenueSummary = {
  // 获取表头
  getTitleRevenueSummary: function (params) {
    var url = '/api/ERPWeb/RevenueSummary/GetTitle';

    return httpReq(url, 'get', params);
  },
  // 获取营收统计汇总
  getRevenueList: function (params) {
    var url = '/api/ERPWeb/RevenueSummary/GetRevenueList';

    return httpReq(url, 'post', params);
  },
  // 导出营收统计汇总记录
  exportRevenueSummary: function (params) {
    var url = '/api/ERPWeb/RevenueSummary/Export';

    return httpReq(url, 'post', params);
  },

}

// 刷卡消费明细、营收汇总、营收统计、营运分析(嘉兴新)
const DayConsumptionDetail = {
  // 获取刷卡消费明细
  ListDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/List';

    return httpReq(url, 'post', params);
  },
  // 柱状图刷卡消费明细
  GetDayConHistogramsDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/GetDayConHistograms';

    return httpReq(url, 'post', params);
  },
  // 导出刷卡消费明细
  ExportDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/Export';

    return httpReq(url, 'post', params);
  },
  // 营收汇总获取
  GetDayConTotalDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/GetDayConTotal';

    return httpReq(url, 'post', params);
  },
  // 营收汇总导出
  ExportTotalDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/ExportTotal';

    return httpReq(url, 'post', params);
  },
  // 刷卡营收统计线路
  GetLineSummaryDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/GetLineSummary';

    return httpReq(url, 'post', params);
  },
  // 刷卡营收统计车辆
  GetVehicleDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/GetVehicleSummary';

    return httpReq(url, 'post', params);
  },
  // 刷卡营收统计线路导出
  ExportTotalLineDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/ExportTotalLine';

    return httpReq(url, 'post', params);
  },
  // 刷卡营收统计车辆导出
  ExportTotalVehicleDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/ExportTotalVehicle';

    return httpReq(url, 'post', params);
  },
  // 营运分析
  GetOperationSummaryDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/GetOperationSummary';

    return httpReq(url, 'post', params);
  },
  // 营运分析导出
  ExportOperationTotalDayConsumptionDetail: function (params) {
    var url = '/api/ERPWeb/DayConsumptionDetail/ExportOperationTotal';

    return httpReq(url, 'post', params);
  },
}
// 票务管理
const TicketManage = {
  ...CashEnter,
  ...CreditCartConsumptionSummary,
  ...DayPurse,
  ...RecKon,
  ...RevenueSummary,
  ...DayConsumptionDetail,
}
export default TicketManage
