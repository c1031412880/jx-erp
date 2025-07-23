import httpReq from "./request";

// SugarService 通用请求封装
function sugarRequest(cmdName, params = {}) {
  // 补充 SugarService 调用所需的固定参数
  const baseParams = {
    cmd: cmdName,
    strsvr: window.dispatch_system.strsvr || '111.1.29.14',
    uid: window.dispatch_system.uid || '33554647'
  };
  // 合并业务参数
  const data = Object.assign({}, baseParams, params);
  // SugarService 统一使用 post 表单提交
  return httpReq('/SugarService', 'post', data);
}

// 报表
const reportTable = {
  //获取车辆排班司机
  GetWorkDriverDriverService: function (params) {
    let url = '/BaseData/DriverService/GetWorkDriver';
    return httpReq(url, 'post', params);
  },
  //获取车辆里程
  GetVehicleMileage: function (params) {
    return sugarRequest('GetVehicleMileage', params);
  },
  //获取车辆能耗分析
  GetVehicleEnergy: function (params) {
    return sugarRequest('GetVehicleEnergy', params);
  },
  // get_line_dispatch
  getLineDispatch: function (params) {
    return sugarRequest('get_line_dispatch', params);
  },
  // get_day_passenger
  getDayPassenger: function (params) {
    return sugarRequest('get_day_passenger', params);
  },
  // get_hour_passenger
  getHourPassenger: function (params) {
    return sugarRequest('get_hour_passenger', params);
  },
  // get_line_passenger_range
  getLinePassengerRange: function (params) {
    return sugarRequest('get_line_passenger_range', params);
  },
  // get_station_passenger_range
  getStationPassengerRange: function (params) {
    return sugarRequest('get_station_passenger_range', params);
  },
  // get_revenue_month
  getRevenueMonth: function (params) {
    return sugarRequest('get_revenue_month', params);
  },
  // GetLineMileageStatic近七天线路里程top10和实际里程变化情况
  GetLineMileageStatic: function (params) {
    return sugarRequest('GetLineMileageStatic', params);
  },
  // 
  getMileageView: function (params) {
    return sugarRequest('get_mileage_view', params);
  },
  // get_dispatch_interval获取班次的发车间隔
  getDispatchInterval: function (params) {
    return sugarRequest('get_dispatch_interval', params);
  },
  // get_dispatch_speed获取班次的速度
  getDispatchSpeed: function (params) {
    return sugarRequest('get_dispatch_speed', params);
  },
  // 获取调度监控报表
  getDispatchMonitorReport: function (params) {
    return sugarRequest('get_dispatch_monitor_real', params);
  },
  // get_dispatch_compare获取班次完成率
  getDispatchCompare: function (params) {
    return sugarRequest('get_dispatch_compare', params);
  },
  // get_home_first_line
  getHomeFirstLine: function (params) {
    return sugarRequest('get_home_first_line', params);
  }
}

// 调度接口
const HttpDispatchingSystem = {
  ...reportTable,
}

export default HttpDispatchingSystem
