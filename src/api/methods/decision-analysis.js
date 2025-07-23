import httpReq from "../http";

// 财务分析
const FinanceAnalysis = {
  // 查询年度指标
  DetailFinanceAnalysis: function (params) {
    var url = '/api/ERPWeb/FinanceAnalysis/Detail';

    return httpReq(url, 'get', params);
  },
   // 添加/编辑年度指标
   AddOrEditFinanceAnalysis: function (params) {
    var url = '/api/ERPWeb/FinanceAnalysis/AddOrEdit';

    return httpReq(url, 'post', params);
  },
   // 导入财务数据
   ImportFinanceAnalysis: function (params) {
    var url = '/api/ERPWeb/FinanceAnalysis/Import';

    return httpReq(url, 'postFile', params);
  },
   // 导出财务分析
   ExportFinanceAnalysis: function (params) {
    var url = '/api/ERPWeb/FinanceAnalysis/Export';

    return httpReq(url, 'post', params);
  },
   // 查询财务分析
   ListFinanceAnalysis: function (params) {
    var url = '/api/ERPWeb/FinanceAnalysis/List';

    return httpReq(url, 'post', params);
  },
   // 查询管理费用
   ManageFeeListFinanceAnalysis: function (params) {
    var url = '/api/ERPWeb/FinanceAnalysis/ManageFeeList';

    return httpReq(url, 'post', params);
  },
}

// 营运分析
const OperationalAnalysis = {
  // 获取表头
  GetTitleOperationalAnalysis: function (params) {
    var url = '/api/ERPWeb/OperationalAnalysis/GetTitle';

    return httpReq(url, 'get', params);
  },
  // 获取营运分析
  GetListOperationalAnalysis: function (params) {
    var url = '/api/ERPWeb/OperationalAnalysis/GetList';

    return httpReq(url, 'post', params);
  },
  // 导出营运分析
  ExportOperationalAnalysis: function (params) {
    var url = '/api/ERPWeb/OperationalAnalysis/Export';

    return httpReq(url, 'post', params);
  },
}

// 营收分析
const RevenueAnalysis = {
  // 获取营收分析
  GetRecentRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/GetRecent';

    return httpReq(url, 'post', params);
  },
  // 营收分析导出
  ExportRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/Export';

    return httpReq(url, 'post', params);
  },
  // 获取营收分析(车辆)
  GetRecentByVehicleRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/GetRecentByVehicle';
    return httpReq(url, 'post', params);
  },
  // 获取营收分析(线路)
  GetRecentByLineRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/GetRecentByLine';
    return httpReq(url, 'post', params);
  },
  // 获取营收分析(组织)
  GetRecentByDeptRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/GetRecentByDept';
    return httpReq(url, 'post', params);
  },
  // 营收分析导出(车辆)
  ExportVehicleRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/ExportVehicle';
    return httpReq(url, 'post', params);
  },
  // 营收分析导出(线路)
  ExportLineRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/ExportLine';
    return httpReq(url, 'post', params);
  },
  // 营收分析导出(组织)
  ExportDeptRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/ExportDept';
    return httpReq(url, 'post', params);
  },

   // 批量更新
   UpdateStateRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/UpdateState';
    return httpReq(url, 'post', params);
  },
   //导入 
   ImportRevenueAnalysis: function (params) {
    var url = '/api/ERPWeb/RevenueAnalysis/Import';
    return httpReq(url, 'postFile', params);
  },
}

// 机务分析
const MaintManageAnalysis = {
  // 按车辆汇总
  MaintSummaryByVehicleMaintManageAnalysis: function (params) {
    let url = '/api/ERPWeb/MaintManageAnalysis/MaintSummaryByVehicle'
    return httpReq(url, 'post', params);
  },
  // 按线路汇总
  MaintSummaryByLineMaintManageAnalysis: function (params) {
    let url = '/api/ERPWeb/MaintManageAnalysis/MaintSummaryByLine'
    return httpReq(url, 'post', params);
  },
  // 按驾驶员汇总
  MaintSummaryByDriverMaintManageAnalysis: function (params) {
    let url = '/api/ERPWeb/MaintManageAnalysis/MaintSummaryByDriver'
    return httpReq(url, 'post', params);
  },
  // 按线组织汇总
  MaintSummaryByDeptMaintManageAnalysis: function (params) {
    let url = '/api/ERPWeb/MaintManageAnalysis/MaintSummaryByDept'
    return httpReq(url, 'post', params);
  },
  // 导出(按车辆汇总)
  ExportByVehicleMaintManageAnalysis: function (params) {
    var url = '/api/ERPWeb/MaintManageAnalysis/ExportByVehicle';
    return httpReq(url, 'post', params);
  },
  // 导出(按线路汇总)
  ExportByLineMaintManageAnalysis: function (params) {
    var url = '/api/ERPWeb/MaintManageAnalysis/ExportByLine';
    return httpReq(url, 'post', params);
  },
  // 导出(按驾驶员汇总)
  ExportByDriverMaintManageAnalysis: function (params) {
    var url = '/api/ERPWeb/MaintManageAnalysis/ExportByDriver';
    return httpReq(url, 'post', params);
  },
  // 导出(按线组织汇总)
  ExportByDeptMaintManageAnalysis: function (params) {
    var url = '/api/ERPWeb/MaintManageAnalysis/ExportByDept';
    return httpReq(url, 'post', params);
  },

  // 按车型组织汇总
  MaintSummaryByVehicleModel: function (params) {
    let url = '/api/ERPWeb/MaintManageAnalysis/MaintSummaryByVehicleModel'
    return httpReq(url, 'post', params);
  },
  // 导出
  ExportByModelMaintManageAnalysis: function (params) {
    let url = '/api/ERPWeb/MaintManageAnalysis/ExportByModel '
    return httpReq(url, 'post', params);
  },
}

// 决策分析
const decisionAnalysis = {
  ...FinanceAnalysis,
  ...OperationalAnalysis,
  ...RevenueAnalysis,
  ...MaintManageAnalysis
}
export default decisionAnalysis
