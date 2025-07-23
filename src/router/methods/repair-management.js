import Layout from "../../layout/Layout";
import Blank from "./router-view";

const repairManagement = {
  path: '/vehicle-maintenance-management-main',
  name: 'vehicle-maintenance-management-main',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '维修管理',
    icon: 'maintenance-management',
    power: [1],
    code: '1090000',
  },
  children: [
    {
      path: 'maintenance-organization-manage',
      name: 'maintenance-organization-manage',
      component: () => import('@/view/maintenance-management/maintenance-organization-manage/index'),
      meta: {title: '维修组织管理', power: [1],code: '1090100'},
    },
    {
      path: 'maintenance-project-manage',
      name: 'maintenance-project-manage',
      component: () => import('@/view/maintenance-management/maintenance-project-manage/index'),
      meta: {title: '维修项目管理', power: [1],code: '1090200'}
    },
    {
      path: 'fault-diagnosis-manage',
      name: 'fault-diagnosis-manage',
      component: () => import('@/view/maintenance-management/fault-diagnosis-manage/index'),
      meta: {title: '故障诊断库管理', power: [1],code: '1090300'}
    },
    {
      path: 'repairs-management',
      name: 'repairs-management',
      component: () => import('@/view/maintenance-management/repairs-management/index'),
      meta: {title: '报修管理', power: [1],code: '1090400'}
    },
    {
      path: 'workorder-management',
      name: 'workorder-management',
      component: () => import('@/view/maintenance-management/workorder-management/index'),
      meta: {title: '工单管理', power: [1],code: '1090500'}
    },
    {
      path: 'completion-management',
      name: 'completion-management',
      component: () => import('@/view/maintenance-management/completion-management/index'),
      meta: {title: '竣工及审核管理', power: [1],code: '1090600'}
    },
    {
      path: 'settlement-management',
      name: 'settlement-management',
      component: () => import('@/view/maintenance-management/settlement-management/index'),
      meta: {title: '完工结算管理', power: [1],code: '1090700'}
    },
    {
      path: 'maintenance',
      name: 'maintenance',
      component: () => import('@/view/maintenance-management/maintenance/index'),
      meta: {title: '维修管理', power: [1],code: '1090800'}
    },
    {
      path: 'outside-repair-management',
      name: 'outside-repair-management',
      component: () => import('@/view/maintenance-management/outside-repair-management/index'),
      meta: {title: '外修管理', power: [1],code: '1090900'}
    },
    {
      path: 'vehicle-maintenance-registration',
      name: 'vehicle-maintenance-registration',
      component: () => import('@/view/maintenance-management/vehicle-maintenance-registration/index'),
      meta: {title: '车辆维保登记', power: [1],code: '1091000'}
    },
    {
      path: 'maintenance-hours',
      name: 'maintenance-hours',
      component: () => import('@/view/maintenance-management/maintenance-hours/index'),
      meta: {title: '维修工时统计', power: [1],code: '1091100'}
    },
    {
      path: 'third-services',
      name: 'third-services',
      component: () => import('@/view/maintenance-management/third-services/index'),
      meta: {title: '维修三包管理', power: [1],code: '1091200'}
    },
    {
      path: 'maintenance-waste-management',
      name: 'maintenance-waste-management',
      component: () => import('@/view/maintenance-management/maintenance-waste-management/index'),
      meta: {title: '维修废料管理', power: [1],code: '1091300'}
    },
    {
      path: 'maintenance-push-rule',
      name: 'maintenance-push-rule',
      component: () => import('@/view/maintenance-management/maintenance-push-rule/index'),
      meta: {title: '维修推送规则', power: [1],code: '1091400'}
    },
    {
      path: 'vehicle-maintain-static',
      name: 'vehicle-maintain-static',
      component: () => import('@/view/maintenance-management/vehicle-maintain-static/index'),
      meta: {title: '车辆保养维修统计', power: [1],code: '1200500'},
    },
    {
      path: '/maintenance-report',
      name: 'maintenance-report',
      component: Blank,
      alwaysShow: true,
      meta: {title: '维修报表', power: [1],code: '1091500'},
      children: [
        {
          path: 'vehicle-maintenance-statistics',
          name: 'vehicle-maintenance-statistics',
          component: () => import('@/view/maintenance-management/vehicle-maintenance-statistics/index'),
          meta: {title: '车辆维修统计', power: [1],code: '1200100'},
        },
        {
          path: 'vehicletype-maintenance-statistics',
          name: 'vehicletype-maintenance-statistics',
          component: () => import('@/view/maintenance-management/vehicletype-maintenance-statistics/index'),
          meta: {title: '车型维修统计', power: [1],code: '1200200'},
        },
        {
          path: 'single-vehicle-maintenance-cost-total',
          name: 'single-vehicle-maintenance-cost-total',
          component: () => import('@/view/maintenance-management/single-vehicle-maintenance-cost-total/index'),
          meta: {title: '单车维修费用汇总', power: [1],code: '1200400'},
        },
      ]
    },
    {
      path: 'rescue-vehicle-dispatch',  
      name: 'rescue-vehicle-dispatch',
      component: () => import('@/view/maintenance-management/rescue-vehicle-dispatch/index'),
      meta: {title: '施救车派工单', power: [1],code: '1091700'}
    },
  ]
}

export default repairManagement
