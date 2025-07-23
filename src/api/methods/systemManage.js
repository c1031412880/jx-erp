import httpReq from "../http";

// 组织架构管理
const OrganizationManager = {
  // 获取部门树结构
  getOrganizationTree: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/GetDeptTree';
    return httpReq(url, 'get', params);
  },
  // 获取部门详情
  getOrganizationDetail: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/GetDeptInfo';
    return httpReq(url, 'get', params);
  },
  // 添加组织
  setOrganization: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/SetDeptment';
    return httpReq(url, 'post', params);
  },
  // 编辑部门
  EditDeptmentOrganizationManager: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/EditDeptment';
    return httpReq(url, 'post', params);
  },

  // 删除部门及其所属人员信息
  deleteOrganizationInfo: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/DeleteDeptment';
    return httpReq(url, 'get', params);
  },
  // 获取指定部门全部人员
  getDeptPerson: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/GetDeptPerson';
    return httpReq(url, 'get', params);
  },
  // 移除部门人员
  deleteDeptPerson: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/DeletePerson';
    return httpReq(url, 'get', params);
  },
  // 人员组织调整
  changeUserDept: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/ChangeDept';
    return httpReq(url, 'post', params);
  },
  // 修改部门或者人员排序
  changeUSerAndDeptSort: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/ChangeSort';
    return httpReq(url, 'post', params);
  },
  // 获取人员主副部门
  GetUserDept: function (params) {
    let url = '/api/ERPWeb/OrganizationManager/GetUserDept';
    return httpReq(url, 'get', params);
  },
}

// 角色组管理
const RoleGroupManager = {
  // 根据角色组id获取组织
  GetGroupDeptByGroupId: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/GetGroupDeptByGroupId';
    return httpReq(url, 'get', params);
  },
  // 保存角色组组织
  SetRoleGroupDept: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/SetRoleGroupDept';
    return httpReq(url, 'post', params);
  },
  // 根据角色组id获取用户
  GetGroupUserByGroupId: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/GetGroupUserByGroupId';
    return httpReq(url, 'get', params);
  },
  // 保存角色组用户
  SetRoleGroupUser: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/SetRoleGroupUser';
    return httpReq(url, 'post', params);
  },
  // 根据角色组id获取角色组权限
  GetGroupPrivilegeByGroupId: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/GetGroupPrivilegeByGroupId';
    return httpReq(url, 'get', params);
  },
  // 保存角色组权限
  SetRoleGroupPrivilege: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/SetRoleGroupPrivilege';
    return httpReq(url, 'post', params);
  },
  // 移除角色组用户
  RemoveRoleUserGroupUser: function (params) {
    let url = '/api/ERPWeb/RoleGroupManager/RemoveRoleUserGroupUser';
    return httpReq(url, 'post', params);
  }
}
// 角色管理
const RoleManager = {
  // 获取角色树结构
  getRoleTree: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRoleTree';
    return httpReq(url, 'get', params);
  },
  // 角色信息设置
  setRoleInfo: function (params) {
    let url = '/api/ERPWeb/RoleManager/SetRole';
    return httpReq(url, 'post', params);
  },
  // 编辑角色
  EditRoleRoleManager: function (params) {
    let url = '/api/ERPWeb/RoleManager/EditRole';
    return httpReq(url, 'post', params);
  },
  // 角色组信息设置
  setRoleGroupInfo: function (params) {
    let url = '/api/ERPWeb/RoleManager/SetRoleGroup';
    return httpReq(url, 'post', params);
  },
  // 编辑角色组
  EditRoleGroupRoleManager: function (params) {
    let url = '/api/ERPWeb/RoleManager/EditRoleGroup';
    return httpReq(url, 'post', params);
  },
  // 角色用户信息获取
  getRolePerson: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRolePerson';
    return httpReq(url, 'get', params);
  },
  // 关联用户
  addRolePerson: function (params) {
    let url = '/api/ERPWeb/RoleManager/AddRolePerson';
    return httpReq(url, 'post', params);
  },
  // 移除用户
  deleteRolePerson: function (params) {
    let url = '/api/ERPWeb/RoleManager/DeleteRolePerson';
    return httpReq(url, 'post', params);
  },
  // 删除角色
  deleteRole: function (params) {
    let url = '/api/ERPWeb/RoleManager/DeleteRole';
    return httpReq(url, 'get', params);
  },
  // 删除角色组
  deleteRoleGroup: function (params) {
    let url = '/api/ERPWeb/RoleManager/DeleteRoleGroup';
    return httpReq(url, 'get', params);
  },
  // 角色功能权限设置
  setRolePriData: function (params) {
    let url = '/api/ERPWeb/RoleManager/SetRolePriData';
    return httpReq(url, 'post', params);
  },
  // 角色权限数据获取
  getRolePriData: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRolePriData';
    return httpReq(url, 'get', params);
  },
  // 角色权限数据获取
  GetRolePriData1RoleManager: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRolePriData1';
    return httpReq(url, 'get', params);
  },
  // 获取菜单功能权限树数据
  getPriTree: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetPriTree';
    return httpReq(url, 'get', params);
  },
  //设置角色数据分配
  setRoleDataDistribution: function (params,type) {
    let urlMap = {
      '1': '/api/ERPWeb/RoleManager/SetRoleDepData', // 角色组织架构数据分配设置
      '2': '/api/ERPWeb/RoleManager/SetRoleVehicleData', //角色车辆数据分配设置
      '3': '/api/ERPWeb/RoleManager/SetRoleLineData' //角色线路数据分配设置
    }
    let url = urlMap[type];
    return httpReq(url, 'post', params);
  },
  // 角色数组织架构据获取
  getRoleDepDataRoleManager: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRoleDepData';
    return httpReq(url, 'get', params);
  },
  // 角色车辆数据获取
  getRoleVehicleDataRoleManager: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRoleVehicleData';
    return httpReq(url, 'get', params);
  },
  // 角色线路数据获取
  getRoleLineDataRoleManager: function (params) {
    let url = '/api/ERPWeb/RoleManager/GetRoleLineData';
    return httpReq(url, 'get', params);
  },
}

// 车载机管理
const Machine = {
  // 获取车载机数据
  GetDataMachine: function (params) {
    let url = '/api/ERPWeb/Machine/GetData';
    return httpReq(url, 'post', params);
  },
  // 数据导出
  ExportMachine: function (params) {
    let url = '/api/ERPWeb/Machine/Export';
    return httpReq(url, 'post', params);
  },
}

// 自定义报表管理
const ReportManage = {
  // 获取全部
  GetAllReportManage: function (params) {
    let url = '/api/ERPWeb/ReportManage/GetAll';
    return httpReq(url, 'get', params);
  },
  // 根据sql获取
  GetReportBySqlReportManage: function (params) {
    let url = '/api/ERPWeb/ReportManage/GetReportBySql';
    return httpReq(url, 'post', params);
  },
  // 根据报表编号获取
  GetReportByCodeReportManage: function (params) {
    let url = '/api/ERPWeb/ReportManage/GetReportByCode';
    return httpReq(url, 'post', params);
  },
  // 新增
  AddReportReportManage: function (params) {
    let url = '/api/ERPWeb/ReportManage/AddReport';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdateReportManage: function (params) {
    let url = '/api/ERPWeb/ReportManage/Update';
    return httpReq(url, 'post', params);
  },
}

// 充电站管理
const ChargeStation = {
  // 获取充电站列表信息
  getStationDropList: function (params) {
    let url = '/api/ERPWeb/ChargeStation/GetStationDropList';
    return httpReq(url, 'get', params);
  },
  // 获取充电站信息
  getStationChargeStation: function (params) {
    let url = '/api/ERPWeb/ChargeStation/GetStation';
    return httpReq(url, 'get', params);
  },
  // 获取充电桩信息
  getPileChargeStation: function (params) {
    let url = '/api/ERPWeb/ChargeStation/GetPile';
    return httpReq(url, 'get', params);
  },
  // 添加/编辑充电站
  addStationChargeStation: function (params) {
    let url = '/api/ERPWeb/ChargeStation/AddStation';
    return httpReq(url, 'post', params);
  },
  // 添加/编辑充电桩
  addPileChargeStation: function (params) {
    let url = '/api/ERPWeb/ChargeStation/AddPile';
    return httpReq(url, 'post', params);
  },
  // 删除充电站/桩数据
  deleteChargeStation: function (params) {
    let url = '/api/ERPWeb/ChargeStation/Delete';
    return httpReq(url, 'get', params);
  },
}

// 字典管理
const DictionaryManage = {
  // 获取所属组
  getClassifyGroupDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/GetClassifyGroup';
    return httpReq(url, 'get', params);
  },
  // 新增/编辑 分类/字典
  addDictClassifyDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/AddDict';
    return httpReq(url, 'post', params);
  },
  // 批量删除分类
  batchDeleteClassifyDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/BatchDeleteClassify';
    return httpReq(url, 'post', params);
  },
  // 查询数字字典
  listDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/List';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑 字典明细
  addDictDetailDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/AddDictDetail';
    return httpReq(url, 'post', params);
  },
  // 批量删除字典
  batchDeleteDicDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/BatchDeleteDic';
    return httpReq(url, 'post', params);
  },
  // 调整排序
  dicSortDictionaryManage: function (params) {
    let url = '/api/ERPWeb/DictionaryManage/DicSort';
    return httpReq(url, 'post', params);
  },
}

// 线路信息管理
const LineManage = {
  // 查询线路记录
  getLineManage: function (params) {
    let url = '/api/ERPWeb/LineManage/List';
    return httpReq(url, 'post', params);
  },
  // 获取线路下的站点信息
  GetLineStationsLineManage: function (params) {
    let url = '/api/ERPWeb/LineManage/GetLineStations';
    return httpReq(url, 'post', params);
  },

  // 新增/编辑线路信息
  addLineInfo: function (params) {
    let url = '/api/ERPWeb/LineManage/AddLine';
    return httpReq(url, 'post', params);
  },
  // 删除线路
  deleteLineInfo: function (params) {
    let url = '/api/ERPWeb/LineManage/Delete';
    return httpReq(url, 'post', params);
  },
  // 停用线路
  stopLineInfo: function (params) {
    let url = '/api/ERPWeb/LineManage/StopLine';
    return httpReq(url, 'post', params);
  },
  // 导入线路记录
  importLineInfo: function (params) {
    let url = '/api/ERPWeb/LineManage/Import';
    return httpReq(url, 'postFile', params);
  },
  // 导出线路记录
  exportLineInfo: function (params) {
    let url = '/api/ERPWeb/LineManage/Export';
    return httpReq(url, 'post', params);
  },
}

// 站点信息管理
const StationManage = {
  // 获取全部站点数据
  GetStationsStationManage: function (params) {
    let url = '/api/ERPWeb/StationManage/GetStations';
    return httpReq(url, 'post', params);
  },
  // 数据导出站点
  ExportStationManage: function (params) {
    let url = '/api/ERPWeb/StationManage/Export';
    return httpReq(url, 'post', params);
  },

  // 获取场站数据
  GetSiteStationsStationManage: function (params) {
    let url = '/api/ERPWeb/StationManage/GetSiteStations';
    return httpReq(url, 'post', params);
  },

  // 数据导出场站
  ExportSiteStationsStationManage: function (params) {
    let url = '/api/ERPWeb/StationManage/ExportSiteStations  ';
    return httpReq(url, 'post', params);
  },
}

// 功能菜单管理
const SysMenu = {
  // 获取菜单列表
  getMenuRecordsSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetMenuRecords';
    return httpReq(url, 'get', params);
  },
  // 获取指定菜单下属列表
  getMenuRecordsByIDSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetMenuRecordsByID';
    return httpReq(url, 'get', params);
  },
  // 新增，编辑菜单记录
  setMenuRecordSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/SetMenuRecord';
    return httpReq(url, 'post', params);
  },
  // 删除菜单记录
  deleteMenuRecordSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/DeleteMenuRecord';
    return httpReq(url, 'post', params);
  },
  // 菜单排序
  sortMenusSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/SortMenus';
    return httpReq(url, 'post', params);
  },
  // 获取全部常用菜单
  GetAllMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetAllMenu';
    return httpReq(url, 'get', params);
  },
  // 获取用户常用菜单
  GetUserCommonMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetUserCommonMenu';
    return httpReq(url, 'get', params);
  },
  // 批量新增全部菜单
  BatchAddMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/BatchAddMenu';
    return httpReq(url, 'post', params);
  },
  // 批量删除全部菜单
  BatchDeleteMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/BatchDeleteMenu';
    return httpReq(url, 'post', params);
  },
  // 批量新增用户常用菜单
  BatchAddUserMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/BatchAddUserMenu';
    return httpReq(url, 'post', params);
  },
  // 批量删除用户常用菜单
  BatchDeleteUserCommonMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/BatchDeleteUserCommonMenu';
    return httpReq(url, 'post', params);
  },
  // 获取用户快速通道
  GetUserFastMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetUserFastMenu';
    return httpReq(url, 'get', params);
  },
  // 新增用户快速通道
  AddFastMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/AddFastMenu';
    return httpReq(url, 'post', params);
  },
  // 编辑用户快速通道
  EditFastMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/EditFastMenu';
    return httpReq(url, 'post', params);
  },
  // 用户快速通道排序
  EditFastMenuSortSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/EditFastMenuSort';
    return httpReq(url, 'post', params);
  },
  // 批量删除用户快速通道
  DelFastMenuSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/DelFastMenu';
    return httpReq(url, 'post', params);
  },
  // 新增编辑公共通讯录分组
  AddCommunicateGroupSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/AddCommunicateGroup';
    return httpReq(url, 'post', params);
  },
  // 获取公共通讯录分组
  GetCommunicateGroupSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetCommunicateGroup';
    return httpReq(url, 'get', params);
  },
  // 删除公共通讯录分组
  DelCommunicateGroupSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/DelCommunicateGroup';
    return httpReq(url, 'post', params);
  },
  // 新增编辑公共通讯录
  AddPublicCommunicateSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/AddPublicCommunicate';
    return httpReq(url, 'post', params);
  },
  // 编辑公司通讯录信息
  UpdateUserCommunicateInfoSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/UpdateUserCommunicateInfo';
    return httpReq(url, 'post', params);
  },
  // 查询公共通讯录
  GetCommunicateBookSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetCommunicateBook';
    return httpReq(url, 'post', params);
  },
  // 查询公司通讯录
  GetCompanyCommunicateSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/GetCompanyCommunicate';
    return httpReq(url, 'post', params);
  },
  // 公司通讯录导出
  ExportCompanyCommunicateSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/ExportCompanyCommunicate';
    return httpReq(url, 'post', params);
  },
  // 公共通讯录导出
  ExportPublicCommunicateSysMenu: function (params) {
    let url = '/api/ERPWeb/SysMenu/ExportPublicCommunicate';
    return httpReq(url, 'post', params);
  },
}

// 用户管理
const SysPerson = {
  // 查询用户列表
  listSysPerson: function (params) {
    let url = '/api/ERPWeb/SysPerson/List';
    return httpReq(url, 'post', params);
  },
  // 新增用户信息
  addUserSysPerson: function (params) {
    let url = '/api/ERPWeb/SysPerson/AddUser';
    return httpReq(url, 'post', params);
  },
  // 新增用户信息
  EditUserSysPerson: function (params) {
    let url = '/api/ERPWeb/SysPerson/EditUser';
    return httpReq(url, 'post', params);
  },
  // 删除用户信息
  DelUserSysPerson: function (params) {
    let url = '/api/ERPWeb/SysPerson/DelUser';
    return httpReq(url, 'post', params);
  },
  // 停用用户
  enabledSysPerson: function (params) {
    let url = '/api/ERPWeb/SysPerson/Enabled';
    return httpReq(url, 'post', params);
  },
  // 重置密码
  resetPasswordSysPerson: function (params) {
    let url = '/api/ERPWeb/SysPerson/ResetPassword';
    return httpReq(url, 'get', params);
  },
}

// 岗位管理
const SysPosition = {
  // 查询岗位记录
  // getSysPositionList: function (params) {
  //   let url = '/api/ERPWeb/SysPosition/List';
  //   return httpReq(url, 'post', params);
  // },
  // 新增/编辑岗位
  addSysPositionInfo: function (params) {
    let url = '/api/ERPWeb/SysPosition/AddPosition';
    return httpReq(url, 'post', params);
  },
  // 批量岗位删除
  deleteSysPositionInfo: function (params) {
    let url = '/api/ERPWeb/SysPosition/BatchDelete';
    return httpReq(url, 'post', params);
  },
}

// 表单管理(1)废
const FormManager = {
  // 新建分组
  addInsertGroup: function (params) {
    let url = '/api/ERPWeb/FormManager/InsertGroup';
    return httpReq(url, 'post', params);
  },
  // 查询分组
  GetGroupTree: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/GetGroupTree';
    return httpReq(url, 'get', params);
  },
  // 查询分组
  queryFromGroup: function (params) {
    let url = '/api/ERPWeb/FormManager/QueryGroup';
    return httpReq(url, 'get', params);
  },
  // 分组排序
  groupSort: function (params) {
    let url = '/api/ERPWeb/FormManager/GroupSort';
    return httpReq(url, 'post', params);
  },
  // 删除分组
  deleteFormGroup: function (params) {
    let url = '/api/ERPWeb/FormManager/DeleteGroup';
    return httpReq(url, 'post', params);
  },
  // 获取表单分组记录
  reqFormSortGroup: function (params) {
    let url = '/api/ERPWeb/FormManager/FormSortGroup';
    return httpReq(url, 'get', params);
  },
  // 调整表单分组
  adjustFormGroup: function (params) {
    let url = '/api/ERPWeb/FormManager/AdjustFormGroup';
    return httpReq(url, 'post', params);
  },
  // 获取表单分组排序记录
  reqFormSortList: function (params) {
    let url = '/api/ERPWeb/FormManager/FormSortList';
    return httpReq(url, 'get', params);
  },
  // 调整表单分组
  updateFormSort: function (params) {
    let url = '/api/ERPWeb/FormManager/FormSort';
    return httpReq(url, 'post', params);
  },
  // 创建表单
  createForm: function (params) {
    let url = '/api/ERPWeb/FormManager/CreateForm';
    return httpReq(url, 'post', params);
  },
  // 获取表单
  getForm: function (params) {
    let url = '/api/ERPWeb/FormManager/GetForm';
    return httpReq(url, 'get', params);
  },
  // 编辑表单
  editForm: function (params) {
    let url = '/api/ERPWeb/FormManager/EditForm';
    return httpReq(url, 'post', params);
  },
  // 停用表单
  enableForm: function (params) {
    let url = '/api/ERPWeb/FormManager/EnableForm';
    return httpReq(url, 'get', params);
  },
  // 获取全部流程数据
  getAllFlowFormManager: function (params) {
    let url = '/api/ERPWeb/FormManager/GetAllFlow';
    return httpReq(url, 'get', params);
  },
  // 修改表单可见范围
  editFormVisible: function (params) {
    let url = '/api/ERPWeb/FormManager/EditFormVisible';
    return httpReq(url, 'get', params);
  },
  // 删除表单
  deleteForm: function (params) {
    let url = '/api/ERPWeb/FormManager/DeleteForm';
    return httpReq(url, 'post', params);
  },
  // 获取分类表单数据
  getAllFormsFlowManager: function (params) {
    let url = '/api/ERPWeb/FormManager/GetAllForms';
    return httpReq(url, 'get', params);
  },
  // 获取指定表单数据
  getFormDataFlowManager: function (params) {
    let url = '/api/ERPWeb/FormManager/GetFormData';
    return httpReq(url, 'get', params);
  },
  // 提交自定义表单数据
  submitFormDataFormManager: function (params) {
    let url = '/api/ERPWeb/FormManager/SubmitFormData';
    return httpReq(url, 'post', params);
  },
  // 获取审核进度查询
  getReviewProcess: function (params) {
    let url = '/api/ERPWeb/FormManager/GetReviewProcess';
    return httpReq(url, 'get', params);
  },
  // 单条审核记录
  checkRecord: function (params) {
    let url = '/api/ERPWeb/FormManager/CheckRecord';
    return httpReq(url, 'get', params);
  },
  // 转交,回退表单记录
  transferRecord: function (params) {
    let url = '/api/ERPWeb/FormManager/TransferRecord';
    return httpReq(url, 'get', params);
  },
  // 获取当前人员待处理全部表单记录
  getPendCollectFormManager : function(params) {
    let url = '/api/ERPWeb/FormManager/GetPendCollect';
    return httpReq(url, 'get', params);
  },
  // 获取当前人员以处理全部表单记录
  getHandleCollectFormManager : function(params) {
    let url = '/api/ERPWeb/FormManager/GetHandleCollect';
    return httpReq(url, 'get', params);
  },
  // 获取当前人员发起全部表单记录
  getStartCollectFormManager : function(params) {
    let url = '/api/ERPWeb/FormManager/GetStartCollect';
    return httpReq(url, 'get', params);
  },
  // 获取当前人员抄送全部表单记录
  getCopyCollectFormManager : function(params) {
    let url = '/api/ERPWeb/FormManager/GetCopyCollect';
    return httpReq(url, 'get', params);
  },
  // 获取全部表单记录
  GetAllCollectFormManager : function(params) {
    let url = '/api/ERPWeb/FormManager/GetAllCollect';
    return httpReq(url, 'get', params);
  },
}

// 表单管理(2)
const FormManagerNew = {
  // 获取分组
  getFormGroupList: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/GetGroupList';
    return httpReq(url, 'get', params);
  },
  // 添加分组
  addFormGroup: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/AddGroup';
    return httpReq(url, 'post', params);
  },
  // 修改分组
  updateFormGroup: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/UpdateGroup';
    return httpReq(url, 'post', params);
  },
  // 分组排序
  updateFormGroupSort: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/UpdateGroupSort';
    return httpReq(url, 'post', params);
  },
  // 删除分组
  deleteNewFormGroup: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/DeleteGroup';
    return httpReq(url, 'post', params);
  },
  // 添加表单
  addNewForm: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/AddForm';
    return httpReq(url, 'post', params);
  },
  // 编辑表单
  EditNewForm: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/EditForm';
    return httpReq(url, 'post', params);
  },
  // 启用/停用表单
  enableNewForm: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/EnableForm';
    return httpReq(url, 'get', params);
  },
  // 表单排序
  updateNewFormSort: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/UpdateFromSort';
    return httpReq(url, 'post', params);
  },
  // 表单移动
  updateNewForm: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/UpdateFromGroup';
    return httpReq(url, 'get', params);
  },
  // 删除表单
  deleteNewForm: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/DeleteFrom';
    return httpReq(url, 'get', params);
  },
  // 添加表单权限
  AddFormPermissionFormManagerNew: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/AddFormPermission';
    return httpReq(url, 'post', params);
  },
  // 获取表单权限
  GetFormPermissionFormManagerNew: function (params) {
    let url = '/api/ERPWeb/FormManagerNew/GetFormPermission';
    return httpReq(url, 'get', params);
  },
}
// 流程管理  可能废除
const FlowManager = {
  // 根据流程ID删除流程数据
  deleteFlowDataFlowManager : function (params) {
    var url = '/api/ERPWeb/FlowManager/DeleteFlowData';
    return httpReq(url, 'get', params);
  },
  // 获取审批流程数据
  getReviewData: function (params) {
    var url = '/api/ERPWeb/FlowManager/GetReviewData';
    return httpReq(url, 'get', params);
  },
  // 新增自定义流程
  addNewFlowFlowManager: function (params) {
    var url = '/api/ERPWeb/FlowManager/addNewFlow';
    return httpReq(url, 'post', params);
  },
  // 更新罗成原始数据
  updateFlowDataFlowManager : function(params) {
    var url = '/api/ERPWeb/FlowManager/UpdateFlowData';
    return httpReq(url, 'post', params);
  },
}

// 操作明细日志
const SysOpLog = {
  // 获取操作明细
  getSysOpLog: function(params) {
    var url = '/api/ERPWeb/SysOpLog/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 导出
  exportSysOpLog: function(params) {
    var url = '/api/ERPWeb/SysOpLog/Export';
    return httpReq(url, 'post', params);
  }
}

// 系统公告
const SysVersion = {
  // 获取公告记录
  GetRecordSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/GetRecord';
    return httpReq(url, 'post', params);
  },
  // 获取系统公告已读未读人员
  GetReadSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/GetRead';
    return httpReq(url, 'post', params);
  },
  // 获取公告记录详情
  GetDetailSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/GetDetail';
    return httpReq(url, 'get', params);
  },
  // 新增公告
  AddSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/Add';
    return httpReq(url, 'post', params);
  },
  // 加入已读标记
  AddSignSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/AddSign';
    return httpReq(url, 'post', params);
  },
  // 删除公告
  DeleteSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/Delete';
    return httpReq(url, 'post', params);
  },
  // 最新未读公告
  GetLatestSysVersion: function(params) {
    var url = '/api/ERPWeb/SysVersion/GetLatest';
    return httpReq(url, 'get', params);
  },
}

// 工作通知
const WorkMessage = {
  // 获取工作通知记录
  GetRecordWorkMessage: function(params) {
    var url = '/api/ERPWeb/WorkMessage/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 获取工作通知详情
  GetByIdWorkMessage: function(params) {
    var url = '/api/ERPWeb/WorkMessage/GetById';
    return httpReq(url, 'post', params);
  },
  // 获取工作通知已读未读人员
  GetDetailWorkMessage: function(params) {
    var url = '/api/ERPWeb/WorkMessage/GetRead';
    return httpReq(url, 'post', params);
  },
  // 新增工作通知
  AddWorkMessage: function(params) {
    var url = '/api/ERPWeb/WorkMessage/Add';
    return httpReq(url, 'post', params);
  },
  // 加入已读标记
  AddSignWorkMessage: function(params) {
    var url = '/api/ERPWeb/WorkMessage/Read';
    return httpReq(url, 'post', params);
  },
  // 删除工作通知
  DeleteWorkMessage: function(params) {
    var url = '/api/ERPWeb/WorkMessage/Del';
    return httpReq(url, 'post', params);
  },
}

// 公司公告
const companyMessage = {
  // 获取公司公告记录
  GetRecordCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/GetRecord';
    return httpReq(url, 'post', params);
  },
  // 获取公司公告详情
  GetByIdCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/GetDetail';
    return httpReq(url, 'get', params);
  },
  // 获取公司公告已读未读人员
  GetDetailCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/GetRead';
    return httpReq(url, 'post', params);
  },
  // 新增公司公告
  AddCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑公司公告
  EditCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/Edit';
    return httpReq(url, 'post', params);
  },
  // 加入已读标记
  AddSignCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/AddSign';
    return httpReq(url, 'post', params);
  },
  // 删除公司公告
  DeleteCompanyMessage: function(params) {
    var url = '/api/ERPWeb/ErpCompanyMessage/Delete';
    return httpReq(url, 'post', params);
  },
}

// 消息规则管理
const MessageRule = {
  // 获取规则数据
  GetRulesMessageRule: function(params) {
    var url = '/api/ERPWeb/MessageRule/GetRules';
    return httpReq(url, 'post', params);
  },
  // 添加规则
  AddRuleMessageRule: function(params) {
    var url = '/api/ERPWeb/MessageRule/AddRule';
    return httpReq(url, 'post', params);
  },
  // 修改规则
  UpdateRuleMessageRule: function(params) {
    var url = '/api/ERPWeb/MessageRule/UpdateRule';
    return httpReq(url, 'post', params);
  }
}

// 设置中心
const SettingCenter = {
  // 获取安全设置
  GetLoginSettingSettingCenter: function(params) {
    var url = '/api/ERPWeb/SettingCenter/GetLoginSetting';
    return httpReq(url, 'get', params);
  },
  // 设置安全设置
  SetLoginSettingSettingCenter: function(params) {
    var url = '/api/ERPWeb/SettingCenter/SetLoginSetting';
    return httpReq(url, 'post', params);
  },

  //新增登录页轮播图
  AddLoginImage: function(params) {
    var url = '/api/ERPWeb/SysMenu/AddLoginPage';
    return httpReq(url, 'post', params);
  },
   //编辑登录页轮播图
   EditLoginImage: function(params) {
    var url = '/api/ERPWeb/SysMenu/EditLoginPage';
    return httpReq(url, 'post', params);
  },
   //删除登录页轮播图
   DelLoginImage: function(params) {
    var url = '/api/ERPWeb/SysMenu/DelLoginPage';
    return httpReq(url, 'post', params);
  },
}

// 合理化建议
const AdviceRecord = {
  // 查询合理化建议
  ListAdviceRecord: function(params) {
    var url = '/api/ERPWeb/AdviceRecord/List';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑
  AddOrEditAdviceRecord: function(params) {
    var url = '/api/ERPWeb/AdviceRecord/AddOrEdit';
    return httpReq(url, 'post', params);
  },
  // 批量删除
  BatchDeleteAdviceRecord: function(params) {
    var url = '/api/ERPWeb/AdviceRecord/BatchDelete';
    return httpReq(url, 'post', params);
  }
}


// 打印模板
const PrintTemp = {
  // 分页获取模板
  GetByPage: function(params) {
    var url = '/api/ERPWeb/PrintTemp/GetByPage';
    return httpReq(url, 'post', params);
  },
  // 新增/编辑
  AddPrintTemp: function(params) {
    var url = '/api/ERPWeb/PrintTemp/Add';
    return httpReq(url, 'post', params);
  },
  // 修改
  UpdatePrintTemp: function(params) {
    var url = '/api/ERPWeb/PrintTemp/Update';
    return httpReq(url, 'post', params);
  },
  //删除
  DeletePrintTemp: function(params) {
    var url = '/api/ERPWeb/PrintTemp/Delete';
    return httpReq(url, 'post', params);
  },
  //启用/禁用
  EditStatePrintTemp: function(params) {
    var url = '/api/ERPWeb/PrintTemp/EditState';
    return httpReq(url, 'post', params);
  }
}

// 常用语管理 (流程管理)
const CommonPhrase = {
  // 分页获取常用语管理
  GetListCommonPhrase: function(params) {
    var url = '/api/ERPWeb/CommonPhrase/GetList';
    return httpReq(url, 'post', params);
  },
  // 新增
  AddCommonPhrase: function(params) {
    var url = '/api/ERPWeb/CommonPhrase/Add';
    return httpReq(url, 'post', params);
  },
  // 修改
  EditCommonPhrase: function(params) {
    var url = '/api/ERPWeb/CommonPhrase/Edit';
    return httpReq(url, 'post', params);
  },
  //删除
  DeleteCommonPhrase: function(params) {
    var url = '/api/ERPWeb/CommonPhrase/Delete';
    return httpReq(url, 'post', params);
  },
}

// 新闻管理 
const ErpNewManage = {
  // 新增
  AddErpNewManage: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/AddOrEditErpNew';
    return httpReq(url, 'post', params);
  },
  // 获取
  GetErpNewManage: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/GetCommunicateGroup';
    return httpReq(url, 'get', params);
  },
  // 获取(首页用(详情))
  GetHomeErpNewManage: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/GetCommunicateGroupHomePage';
    return httpReq(url, 'post', params);
  },
  // 获取(首页用)
  GetErpNewManageHomePageSimple: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/GetErpNewManageHomePageSimple';
    return httpReq(url, 'post', params);
  },
  // 删除
  DelErpNewManage: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/DelCommunicateGroup';
    return httpReq(url, 'post', params);
  },
  //新增已读
  AddNewReadErpNewManage: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/AddNewRead';
    return httpReq(url, 'post', params);
  },
  //更新状态
  UpdateStateErpNewManage: function(params) {
    var url = '/api/ERPWeb/ErpNewManage/UpdateState';
    return httpReq(url, 'post', params);
  },
}

// 基层动态
const ErpGrassrootsDynamics = {
  // 新增
  AddErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/AddOrEditErpGrassrootsDynamics';
    return httpReq(url, 'post', params);
  },
  // 获取
  GetErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/GetErpGrassrootsDynamics';
    return httpReq(url, 'post', params);
  },
  // 获取（首页用）
  GetHomeErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/GetErpGrassrootsDynamicsHomePage';
    return httpReq(url, 'post', params);
  },
  // 获取详情
  LookDetailErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/LookDetail';
    return httpReq(url, 'get', params);
  },
  // 删除
  DelErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/DelErpGrassrootsDynamics';
    return httpReq(url, 'post', params);
  },
  //新增已读
  AddNewReadErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/AddNewRead';
    return httpReq(url, 'post', params);
  },
  //保存需要审批的部门
  AddNeedErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/AddNeedFlowDept';
    return httpReq(url, 'post', params);
  },
  //获取需要审批的部门
  GetNeedErpGrassrootsDynamics: function(params) {
    var url = '/api/ERPWeb/ErpGrassrootsDynamics/GetNeedFlowDept';
    return httpReq(url, 'get', params);
  },
}

// 日程管理 
const ScheduleManage = {
  // 新增日程代办类型
  AddTypeScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/AddSysScheduleType';
    return httpReq(url, 'post', params);
  },
  // 删除日程代办类型
  DelTypeScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/DelSysScheduleType';
    return httpReq(url, 'post', params);
  },
  // 获取日程代办类型
  GetTypeScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/GetScheduleTypes';
    return httpReq(url, 'get', params);
  },
  //新增日程
  AddScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/AddSysUserSchedule';
    return httpReq(url, 'post', params);
  },
  //编辑日程计划
  EditScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/EditSysSchedulePlan';
    return httpReq(url, 'post', params);
  },
  //删除日程
  DelScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/DelSysUserSchedule';
    return httpReq(url, 'post', params);
  },
  //删除计划
  DelPlanScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/DelPlanSchedule';
    return httpReq(url, 'post', params);
  },
  //新增日程评论
  AddScheduleCommentScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/AddScheduleComment';
    return httpReq(url, 'post', params);
  },
  //删除日程评论或变动记录
  DelScheduleCommentScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/DelScheduleComment';
    return httpReq(url, 'post', params);
  },
  //接收、拒绝、暂定 日程
  UpdateScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/UpdateAcceptState';
    return httpReq(url, 'post', params);
  },
  //日程已读
  ReadScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/ReadSchedule';
    return httpReq(url, 'post', params);
  },
  //获取指定日期范围内的日程
  GetUserScheduleScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/GetUserSchedule';
    return httpReq(url, 'post', params);
  },
  //根据iid获取指定日程
  GetScheduleByIDScheduleManage: function(params) {
    var url = '/api/ERPWeb/ScheduleManage/GetScheduleByID';
    return httpReq(url, 'get', params);
  },
}
// 系统管理
const SystemManage = {
  ...ReportManage,
  ...OrganizationManager,
  ...RoleGroupManager,
  ...RoleManager,
  ...ChargeStation,
  ...Machine,
  ...DictionaryManage,
  ...LineManage,
  ...StationManage,
  ...SysMenu,
  ...SysPerson,
  ...SysPosition,
  ...FormManager,
  ...FormManagerNew,
  ...FlowManager,
  ...SysOpLog,
  ...SysVersion,
  ...MessageRule,
  ...SettingCenter,
  ...AdviceRecord,
  ...PrintTemp,
  ...WorkMessage,
  ...companyMessage,
  ...CommonPhrase,
  ...ErpNewManage,
  ...ErpGrassrootsDynamics,
  ...ScheduleManage
}

export default SystemManage
