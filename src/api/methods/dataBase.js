import httpReq from "../http";

// 基础资料
const DataBase = {
  // 获取组织人员
  getUserEmps: function (params) {
    let url = '/api/ERPWeb/DataBase/GetDeptEmpTree';
    return httpReq(url, 'get', params);
  },
  // 获取组织人员(包含在线人数)
  getOnLineUserEmps: function (params) {
    let url = '/api/ERPWeb/DataBase/GetOnLineDeptEmpTree';
    return httpReq(url, 'get', params);
  },
  // 部门人员树（无权限）
  GetFillDeptEmpTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetFillDeptEmpTree';
    return httpReq(url, 'get', params);
  },
  // 角色人员树（无权限）
  GetFillRoleEmpTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetFillRoleEmpTree';
    return httpReq(url, 'get', params);
  },
  // 获取驾驶员
  getDeptDriverTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetDeptDriverTree';
    return httpReq(url, 'get', params);
  },
  // 人员树（包括人员和驾驶员无权限）
  GetAllDeptEmpTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetAllDeptEmpTree';
    return httpReq(url, 'get', params);
  },
  // 获取岗位信息
  GetPositionDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetPosition';
    return httpReq(url, 'get', params);
  },
  // 获取部门下面的岗位信息
  GetAllPositionJobDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetAllPositionJob';
    return httpReq(url, 'get', params);
  },
  // 获取中台部门下全部职务
  GetAllPositionDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetAllDeptPositionJob';
    return httpReq(url, 'get', params);
  },
  // 获取角色信息
  GetRoleDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetRole';
    return httpReq(url, 'get', params);
  },
  // 获取页面信息下的所有部门（驾驶员星级情况、）  
  GetAllOperationDept: function (params) {
    let url = '/api/ERPWeb/DataBase/GetAllOperationDepts';
    return httpReq(url, 'get', params);
  },
  // 获取字典分类树
  getClassyfyTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetClassyfyTree';
    return httpReq(url, 'get', params);
  },
  // 字典查询
  getDictionaryDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetDictionary';
    return httpReq(url, 'post', params);
  },
  // 获取车辆树
  getVehicleTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetVehicleTree';
    return httpReq(url, 'get', params);
  },
  // 获取带筛选类型的车辆树 （车牌、自编号、自编号（车牌号）三合一）
  GetNewVehicleTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetNewVehicleTree';
    return httpReq(url, 'get', params);
  },
  // 获取车辆自编号树
  getVehicleCodeTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetVehicleCodeTree';
    return httpReq(url, 'get', params);
  },
  // 获取线路树
  getLineTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetLineTree';
    return httpReq(url, 'get', params);
  },
  // 获取维修组织树
  getMaintainTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetMaintainTree';
    return httpReq(url, 'get', params);
  },
  // 获取维修项目分类
  getMoldProjectTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetMaintainProjectTree';
    return httpReq(url, 'get', params);
  },
  // 获取故障诊断分类
  getFaultDiagonosisTree: function (params) {
    let url = '/api/ERPWeb/DataBase/GetFaultDiagonosisTree';
    return httpReq(url, 'get', params);
  },
  // 图片上传
  AddrepairspicUpload: function (params) {
    let url = '/api/ERPWeb/DataBase/UploadPicture';
    return httpReq(url, 'postFile', params.file);
  },
  // 文件上传  返回只有 url
  AddTxtfileUpload: function (params) {
    let url = '/api/ERPWeb/DataBase/UploadFile';
    return httpReq(url, 'postFile', params.file);
  },
  // 文件上传   返回包含 id url
  NewAddTxtfileUpload: function (params) {
    let url = '/api/ERPWeb/DataBase/UploadFileNew';
    return httpReq(url, 'postFile', params.file);
  },
  // 上传word文档(公文用，后期废弃)
  UploadOnlineFileDataBase: function(params) {
    let url = '/api/ERPWeb/DataBase/UploadOnlineFile'
    return httpReq(url, 'postFile', params);
  },
  // 查询线路记录
  getLineSelectListDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetLines';
    return httpReq(url, 'get', params);
  },
  // 获取充电站信息
  getChargeStationTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetChargeStationTree';
    return httpReq(url, 'get', params);
  },
  // 修改密码
  alterPasswordDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/AlterPassword';
    return httpReq(url, 'get', params);
  },
  // 获取党组织机构树
  getPartyOrgTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetPartyOrgTree';
    return httpReq(url, 'get', params);
  },
  // 获取党员树
  getPartyUserTreeDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetPartyUserTree';
    return httpReq(url, 'get', params);
  },
  // 获取审计日志
  GetAuditLogDataBase: function (params) {
    let url = '/api/ERPWeb/DataBase/GetAuditLog';
    return httpReq(url, 'get', params);
  },
  
  // 获取车辆统计数据
  getVehicleStatistics: function (params) {
    let url = '/api/ERPWeb/HomePage/GetVehicleStatistics';
    return httpReq(url, 'get', params);
  },

  // ================== 大屏图表相关接口 ==================
  // 注意：这些接口需要与大屏项目保持完全一致的URL路径

  // 车辆各年各类型数量分布 (来自综合服务)
  getvehiclemodeldistributiondtoasync: function (params) {
    let url = '/api/integratedsvr/digitaltrans/getvehiclemodeldistributiondtoasync';
    return httpReq(url, 'postjson', params);
  },

  // 车辆能源类型分析 (来自综合服务)
  getalarmmonitoroperateratedtoasync: function (params) {
    let url = '/api/integratedsvr/vehiclealarmmonitor/getalarmmonitoroperateratedtoasync';
    return httpReq(url, 'postjson', params);
  },

  // 车辆品牌分析 (来自综合服务)
  getdigitalvehiclebranddtolistasync: function (params) {
    let url = '/api/integratedsvr/digitaltrans/getdigitalvehiclebranddtolistasync';
    return httpReq(url, 'postjson', params);
  },

  // 车辆标台系数分析 (来自综合服务)
  getdigitalplatformcoefficientdtolistasync: function (params) {
    let url = '/api/integratedsvr/digitaltrans/getdigitalplatformcoefficientdtolistasync';
    return httpReq(url, 'postjson', params);
  },

  // 机务成本分析 (来自ERP服务)
  GetVehicleCostAnalysis: function (params) {
    let url = '/api/ERPWeb/AccidentManage/GetVehicleCostAnalysis';
    return httpReq(url, 'get', params);
  },

  // 维修材料费分析 (来自ERP服务)
  GetMaterialFee: function (params) {
    let url = '/api/ERPWeb/AccidentManage/GetMaterialFee';
    return httpReq(url, 'get', params);
  },

  // 车辆能耗分析 (用于燃料消耗趋势，来自ERP服务)
  ErpGetVehicleEnergy: function (params) {
    let url = '/api/ERPWeb/AccidentManage/GetVehicleEnergy';
    return httpReq(url, 'get', params);
  },
  // 燃料消耗TOP10 (来自ERP服务)
  GetFuelConsumptionTop10: function (params) {
    let url = '/api/ERPWeb/HomePage/GetFuelConsumptionTop10';
    return httpReq(url, 'get', params);
  },

  // ******************上传 start ******************************
  // 视频上传文件(支持分片,断点续传)  返回只有url
  UpLoadFileBreakPointResumeUpload: function (params) {
    let url = '/api/ERPWeb/Upload/UpLoadFileThumbnail';
    return httpReq(url, 'postFile', params);
  },
  // 视频上传文件(支持分片,断点续传)   返回包含id url
  NewUpLoadFileBreakPointResumeUpload: function (params) {
    let url = '/api/ERPWeb/Upload/UpLoadFileThumbnailNew';
    return httpReq(url, 'postFile', params);
  },
  // ******************上传 end ******************************

  // ******************表格排序 start ******************************

  // 查询表头
  GetTitleTableOrder: function (params) {
    let url = '/api/ERPWeb/TableOrder/GetTitle';
    return httpReq(url, 'get', params);
  },
  // 新增/编辑表格排序
  AddOrEidtTableOrder: function (params) {
    let url = '/api/ERPWeb/TableOrder/AddOrEidt';
    return httpReq(url, 'post', params);
  },
  // 获取自定义表单数据
  GetFormDataSource: function (params) {
    let url = '/api/ERPWeb/TableOrder/GetFormDataSource';
    return httpReq(url, 'get', params);
  },
  // 批量删除
  BatchDeleteTableOrder: function (params) {
    let url = '/api/ERPWeb/TableOrder/BatchDelete';
    return httpReq(url, 'post', params);
  },
  // ******************表格排序 end ******************************

}


export default DataBase
