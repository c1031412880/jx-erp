import { postJsonToBigScreen } from './bigScreenService';

const reportApi = {
  /**
   * 获取车辆排班司机
   * @param {object} params - 请求参数
   * @returns {Promise}
   */
  GetWorkDriverDriverService: function (params) {
    // 注意：这个接口的URL格式与其他接口不同，请确认它是否也属于大屏服务
    // 如果是，请确保URL路径正确
    const url = '/BaseData/DriverService/GetWorkDriver';
    return postJsonToBigScreen(url, params);
  },

  /**
   * 车辆能源占比分析
   * @param {object} params - 请求参数
   * @returns {Promise}
   */
  getalarmmonitoroperateratedtoasync: function (params) {
    const url = '/api/integratedsvr/vehiclealarmmonitor/getalarmmonitoroperateratedtoasync';
    return postJsonToBigScreen(url, params);
  },

  /**
   * 数字机务 获取车辆品牌分布
   * @param {object} params - 请求参数
   * @returns {Promise}
   */
  getdigitalvehiclebranddtolistasync: function (params) {
    const url = '/api/integratedsvr/digitaltrans/getdigitalvehiclebranddtolistasync';
    return postJsonToBigScreen(url, params);
  },

  /**
   * 数字机务 获取车辆标台系数分析
   * @param {object} params - 请求参数
   * @returns {Promise}
   */
  getdigitalplatformcoefficientdtolistasync: function (params) {
    const url = '/api/integratedsvr/digitaltrans/getdigitalplatformcoefficientdtolistasync';
    return postJsonToBigScreen(url, params);
  },

  /**
   * 数字机务 车辆年类型分布
   * @param {object} params - 请求参数
   * @returns {Promise}
   */
  getvehiclemodeldistributiondtoasync: function (params) {
    const url = '/api/integratedsvr/digitaltrans/getvehiclemodeldistributiondtoasync';
    return postJsonToBigScreen(url, params);
  },
};

export default reportApi; 