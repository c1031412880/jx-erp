import Vue from 'vue'
import Router from 'vue-router'

import systemUserRouter from './methods/system-user'
import maintenanceManageRouter from './methods/maintenance-management'
import materialsManagementRouter from './methods/materials-management'
import personnelManagementRouter from './methods/personnel-management'
import safeManagementRouter from './methods/safe-management'
import ticketManagementRouter from './methods/ticket-management'
import serverManagementRouter from './methods/server-management'
import outerLinkManagementRouter from './methods/outer-link-management'
import documentManage from './methods/document-manage'
import companyManagementRouter from './methods/company-management'
import hiddenArr from './methods/hidden-arr'
import decisionAnalysis from "./methods/decision-analysis";
import InitiateApproval from "./methods/Initiate-approval";
import repairManagement from "./methods/repair-management";
import operational from './methods/operational-analysis'

Vue.use(Router)

export const constantRouterMap = [
  // 隐藏路由
  ...hiddenArr,
  // 机务管理
  maintenanceManageRouter,
  // 物资管理
  materialsManagementRouter,
  // 人事管理
  personnelManagementRouter,
  // 安全管理
  safeManagementRouter,
  // 票务管理
  ticketManagementRouter,
  // 公文管理
  documentManage,
  // 系统设置
  systemUserRouter,
  // 服务管理
  serverManagementRouter,
  // 企业管理
  companyManagementRouter,
  // 外链系统跳转
  outerLinkManagementRouter,
  // 决策分析
  decisionAnalysis,
  // 待办事项
  InitiateApproval,
  //维修管理
  repairManagement,
  // 营运分析 
  operational
];

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// router.beforeEach((to, from, next) => {
//   console.log(to)
//   console.log(from)
//   if (to.path == '/login') {
//     next()
//   }

//   if(to.path != '/login' && !getSession()) {
//     next({path: '/login'})
//   }
//   // 如果用户未能验证身份，则 `next` 会被调用两次
//   next()
// })

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
