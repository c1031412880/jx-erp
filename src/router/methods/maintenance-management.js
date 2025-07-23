import Layout from "../../layout/Layout";
import Blank from "./router-view";

const maintenanceManageRouter = {
  path: '/maintenance-management',
  name: 'maintenance-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '机务管理',
    icon: 'maintenance-management',
    power: [1],
    code: '1000000',
  },
  children: [
    {
      path: 'dashboard',
      name: 'maintenance-management-dashboard',
      component: () => import('@/view/maintenance-management/maintenance-management/index'),
      meta: {title: '机务管理首页', power: [1], code: '1000001'},
    },
   
    {
      path: '/vehicle-info-main',
      name: 'vehicle-info-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '车辆管理',
        power: [1],
        code: '1010000'
      },
      children: [
        {
          path: 'vehinfo-manage',
          name: 'vehinfo-manage',
          component: () => import('@/view/maintenance-management/vehinfo-manage/index'),
          meta: {title: '车辆信息管理', power: [1],code: '1010100',},
        },
        {
          path: 'vehmodel-manage',
          name: 'vehmodel-manage',
          component: () => import('@/view/maintenance-management/vehmodel-manage/index'),
          meta: {title: '车辆型号管理', power: [1],code: '1010200'},
        },
        {
          path: 'vehicle-yearly-inspection',
          name: 'vehicle-yearly-inspection',
          component: () => import('@/view/maintenance-management/vehicle-yearly-inspection/index'),
          meta: {title: '车辆年检管理', power: [1],code: '1010300'},
        },
        {
          path: 'vehicle-scrap',
          name: 'vehicle-scrap',
          component: () => import('@/view/maintenance-management/vehicle-scrap/index'),
          meta: {title: '车辆报废管理', power: [1],code: '1010400'}
        },
        {
          path: 'vehicle-rating',
          name: 'vehicle-rating',
          component: () => import('@/view/maintenance-management/vehicle-rating/index'),
          meta: {title: '车辆等级评定', power: [1],code: '1010500'},
        },
      ]
    },
    {
      path: '/engine-management-main',
      name: 'engine-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '发动机管理',
        power: [1],
        code: '1020000',
      },
      children: [
        {
          path: 'engine-model-management',
          name: 'engine-model-management',
          component: () => import('@/view/maintenance-management/engine-model-management/index'),
          meta: {title: '发动机型号管理', power: [1],code: '1020100'},
        },
        {
          path: 'engine-management',
          name: 'engine-management',
          component: () => import('@/view/maintenance-management/engine-management/index'),
          meta: {title: '发动机管理', power: [1],code: '1020200'},
        },
      ]
    },
    {
      path: '/tyre-management-main',
      name: 'tyre-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '轮胎管理',
        power: [1],
        code: '1030000',
      },
      children: [ 
        {
          path: 'tyre-model-manage',
          name: 'tyre-model-manage',
          component: () => import('@/view/maintenance-management/tyre-model-manage/index'),
          meta: {title: '轮胎型号管理', power: [1],code: '1030100'},
        },
        {
          path: 'tyre-manage',
          name: 'tyre-manage',
          component: () => import('@/view/maintenance-management/tyre-manage/index'),
          meta: {title: '轮胎管理', power: [1],code: '1030200'},
        },
        {
          path: 'tyre-maintain',
          name: 'tyre-maintain',
          component: () => import('@/view/maintenance-management/tyre-maintain/index'),
          meta: {title: '轮胎报废、翻新、修补', power: [1],code: '1030300'},
        },
        {
          path: 'tyre-usage-record',
          name: 'tyre-usage-record',
          component: () => import('@/view/maintenance-management/tyre-usage-record/index'),
          meta: {title: '轮胎使用记录', power: [1],code: '1030400'},
        },
        {
          path: 'tyre-usage-statistic',
          name: 'tyre-usage-statistic',
          component: () => import('@/view/maintenance-management/tyre-usage-statistic/index'),
          meta: {title: '轮胎采购报废修补统计', power: [1],code: '1030500'},
        },
        {
          path: 'vheicle-tyre-condition',
          name: 'vheicle-tyre-condition',
          component: () => import('@/view/maintenance-management/vheicle-tyre-condition/index'),
          meta: {title: '车辆轮胎情况', power: [1],code: '1030600'},
        },
      ]
    },
    {
      path: '/battery-management-main',
      name: 'battery-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '电瓶管理',
        power: [1],
        code: '1040000',
      },
      children: [
        {
          path: 'battery-type-manage',
          name: 'battery-type-manage',
          component: () => import('@/view/maintenance-management/battery-type-manage/index'),
          meta: {title: '电瓶类型管理', power: [1],code: '1040100'},
        },
        {
          path: 'battery-manage',
          name: 'battery-manage',
          component: () => import('@/view/maintenance-management/battery-manage/index'),
          meta: {title: '电瓶管理', power: [1],code: '1040200'},
        },
      ]
    },
    {
      path: 'pressure-vessel-manage',
      name: 'pressure-vessel-manage',
      component: () => import('@/view/maintenance-management/pressure-vessel-manage/index'),
      meta: {title: '压力容器管理', power: [1],code: '1050000'},
    },
    // {
    //   path: 'maintenance-rules-setting',
    //   name: 'maintenance-rules-setting',
    //   component: () => import('@/view/maintenance-management/maintenance-rules-setting/index'),
    //   meta: {title: '机务规则设置', power: [1],code: '1060000'}
    // },
    {
      path: '/maintenance-rules-setting-main',
      name: 'maintenance-rules-setting-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '标准设定',
        power: [1],
        code: '1060000'
      },
      children: [
        {
          path: 'maintenance-rules-setting',
          name: 'maintenance-rules-setting',
          component: () => import('@/view/maintenance-management/maintenance-rules-setting/index'),
          meta: {title: '提醒规则设置', power: [1],code: '1060100'}
        },
        {
          path: 'appraisal-standard-setting',
          name: 'appraisal-standard-setting',
          component: () => import('@/view/maintenance-management/appraisal-standard-setting/index'),
          meta: {title: '考核标准设定', power: [1],code: '1060200'},
        },
      ]
    },
    {
      path: '/vehicle-charge-management-main',
      name: 'vehicle-charge-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '燃料消耗',
        power: [1],
        code: '1070000'
      },
      children: [
        {
          path: 'charge-detailed',
          name: 'charge-detailed',
          component: () => import('@/view/maintenance-management/charge-detailed/index'),
          meta: {title: '车辆充电明细', power: [1],code: '1070100'},
        },
        {
          path: 'charge-summary',
          name: 'charge-summary',
          component: () => import('@/view/maintenance-management/charge-summary/index'),
          meta: {title: '车辆充电汇总', power: [1],code: '1070200'},
        },
        {
          path: 'fuel-consumption-entry',
          name: 'fuel-consumption-entry',
          component: () => import('@/view/maintenance-management/fuel-consumption-entry/index'),
          meta: {title: '车辆油耗录入', power: [1],code: '1070300'},
        },
        {
          path: 'electric-consumption-entry',
          name: 'electric-consumption-entry',
          component: () => import('@/view/maintenance-management/electric-consumption-entry/index'),
          meta: {title: '车辆电耗录入', power: [1],code: '1070400'},
        },
        {
          path: 'vehicle-electric-entry',
          name: 'vehicle-electric-entry',
          component: () => import('@/view/maintenance-management/vehicle-electric-entry/index'),
          meta: {title: '车辆电耗录入', power: [1],code: '1070500'},
        },
        {
          path: 'vehicle-gas-entry',
          name: 'vehicle-gas-entry',
          component: () => import('@/view/maintenance-management/vehicle-gas-entry/index'),
          meta: {title: '车辆气耗录入', power: [1],code: '1070600'},
        },
        {
          path: 'vehicle-hydrogen-entry',
          name: 'vehicle-hydrogen-entry',
          component: () => import('@/view/maintenance-management/vehicle-hydrogen-entry/index'),
          meta: {title: '车辆氢气消耗录入', power: [1],code: '1070610'},
        },
        {
          path: 'summary-fuel-consumption',
          name: 'summary-fuel-consumption',
          component: () => import('@/view/maintenance-management/summary-fuel-consumption/index'),
          meta: {title: '油耗汇总统计', power: [1],code: '1200600'},
        },
        {
          path: 'summary-electricity-consumption',
          name: 'summary-electricity-consumption',
          component: () => import('@/view/maintenance-management/summary-electricity-consumption/index'),
          meta: {title: '电耗汇总统计', power: [1],code: '1200700'},
        },
      ]
    },
    {
      path: 'vehicle-mileage-manage',
      name: 'vehicle-mileage-manage',
      component: () => import('@/view/maintenance-management/vehicle-mileage-manage/index'),
      meta: {title: '车辆里程管理', power: [1],code: '1080000'},
    },
    {
      path: 'vehicle-mileage-statistics',
      name: 'vehicle-mileage-statistics',
      component: () => import('@/view/maintenance-management/vehicle-mileage-statistics/index'),
      meta: {title: '车辆里程统计', power: [1],code: '1110000'},
    },
    {
      path: 'driver-mileage-statistics',
      name: 'driver-mileage-statistics',
      component: () => import('@/view/maintenance-management/driver-mileage-statistics/index'),
      meta: {title: '驾驶员里程统计', power: [1],code: '1400000'},
    },
    // {
    //   path: '/vehicle-maintenance-management-main',
    //   name: 'vehicle-maintenance-management-main',
    //   component: Blank,
    //   alwaysShow: true,
    //   meta: {
    //     title: '维修管理',
    //     power: [1],
    //     code: '1090000',
    //     icon: 'maintenance-management'
    //   },
    //   children: [
    //     {
    //       path: 'maintenance-organization-manage',
    //       name: 'maintenance-organization-manage',
    //       component: () => import('@/view/maintenance-management/maintenance-organization-manage/index'),
    //       meta: {title: '维修组织管理', power: [1],code: '1090100'},
    //     },
    //     {
    //       path: 'maintenance-project-manage',
    //       name: 'maintenance-project-manage',
    //       component: () => import('@/view/maintenance-management/maintenance-project-manage/index'),
    //       meta: {title: '维修项目管理', power: [1],code: '1090200'}
    //     },
    //     {
    //       path: 'fault-diagnosis-manage',
    //       name: 'fault-diagnosis-manage',
    //       component: () => import('@/view/maintenance-management/fault-diagnosis-manage/index'),
    //       meta: {title: '故障诊断库管理', power: [1],code: '1090300'}
    //     },
    //     {
    //       path: 'repairs-management',
    //       name: 'repairs-management',
    //       component: () => import('@/view/maintenance-management/repairs-management/index'),
    //       meta: {title: '报修管理', power: [1],code: '1090400'}
    //     },
    //     {
    //       path: 'workorder-management',
    //       name: 'workorder-management',
    //       component: () => import('@/view/maintenance-management/workorder-management/index'),
    //       meta: {title: '工单管理', power: [1],code: '1090500'}
    //     },
    //     {
    //       path: 'completion-management',
    //       name: 'completion-management',
    //       component: () => import('@/view/maintenance-management/completion-management/index'),
    //       meta: {title: '竣工及审核管理', power: [1],code: '1090600'}
    //     },
    //     {
    //       path: 'settlement-managementt',
    //       name: 'settlement-management',
    //       component: () => import('@/view/maintenance-management/settlement-management/index'),
    //       meta: {title: '完工结算管理', power: [1],code: '1090700'}
    //     },
    //     {
    //       path: 'maintenance',
    //       name: 'maintenance',
    //       component: () => import('@/view/maintenance-management/maintenance/index'),
    //       meta: {title: '维修管理', power: [1],code: '1090800'}
    //     },
    //     {
    //       path: 'outside-repair-management',
    //       name: 'outside-repair-management',
    //       component: () => import('@/view/maintenance-management/outside-repair-management/index'),
    //       meta: {title: '外修管理', power: [1],code: '1090900'}
    //     },
    //     {
    //       path: 'vehicle-maintenance-registration',
    //       name: 'vehicle-maintenance-registration',
    //       component: () => import('@/view/maintenance-management/vehicle-maintenance-registration/index'),
    //       meta: {title: '车辆维保登记', power: [1],code: '1091000'}
    //     },
    //     {
    //       path: 'maintenance-hours',
    //       name: 'maintenance-hours',
    //       component: () => import('@/view/maintenance-management/maintenance-hours/index'),
    //       meta: {title: '维修工时统计', power: [1],code: '1091100'}
    //     },
    //     {
    //       path: 'third-services',
    //       name: 'third-services',
    //       component: () => import('@/view/maintenance-management/third-services/index'),
    //       meta: {title: '维修三包管理', power: [1],code: '1091200'}
    //     },
    //     {
    //       path: 'maintenance-waste-management',
    //       name: 'maintenance-waste-management',
    //       component: () => import('@/view/maintenance-management/maintenance-waste-management/index'),
    //       meta: {title: '维修废料管理', power: [1],code: '1091300'}
    //     },
    //     {
    //       path: 'maintenance-push-rule',
    //       name: 'maintenance-push-rule',
    //       component: () => import('@/view/maintenance-management/maintenance-push-rule/index'),
    //       meta: {title: '维修推送规则', power: [1],code: '1091400'}
    //     },
    //     {
    //       path: 'vehicle-maintain-static',
    //       name: 'vehicle-maintain-static',
    //       component: () => import('@/view/maintenance-management/vehicle-maintain-static/index'),
    //       meta: {title: '车辆保养维修统计', power: [1],code: '1200500'},
    //     },
    //     {
    //       path: 'maintenance-report',
    //       name: 'maintenance-report',
    //       component: Blank,
    //       alwaysShow: true,
    //       meta: {title: '维修报表', power: [1],code: '1091500'},
    //       children: [
    //         {
    //           path: 'vehicle-maintenance-statistics',
    //           name: 'vehicle-maintenance-statistics',
    //           component: () => import('@/view/maintenance-management/vehicle-maintenance-statistics/index'),
    //           meta: {title: '车辆维修统计', power: [1],code: '1200100'},
    //         },
    //         {
    //           path: 'vehicletype-maintenance-statistics',
    //           name: 'vehicletype-maintenance-statistics',
    //           component: () => import('@/view/maintenance-management/vehicletype-maintenance-statistics/index'),
    //           meta: {title: '车型维修统计', power: [1],code: '1200200'},
    //         },
    //         {
    //           path: 'single-vehicle-maintenance-cost-total',
    //           name: 'single-vehicle-maintenance-cost-total',
    //           component: () => import('@/view/maintenance-management/single-vehicle-maintenance-cost-total/index'),
    //           meta: {title: '单车维修费用汇总', power: [1],code: '1200400'},
    //         },
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/maintenance-management-main',
      name: 'maintenance-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '保养管理',
        power: [1],
        code: '1100000'
      },
      children: [
        {
          path: 'maintenance-schedule',
          name: 'maintenance-schedule',
          component: () => import('@/view/maintenance-management/maintenance-schedule/index'),
          meta: {title: '保养计划下发', power: [1],code: '1100100'},
        },
        {
          path: 'maintenance-schedule-confirm',
          name: 'maintenance-schedule-confirm',
          component: () => import('@/view/maintenance-management/maintenance-schedule-confirm/index'),
          meta: {title: '保养计划确认', power: [1],code: '1100200'},
        },
        {
          path: 'maintenance-plan-execution-statistics',
          name: 'maintenance-plan-execution-statistics',
          component: () => import('@/view/maintenance-management/maintenance-plan-execution-statistics/index'),
          meta: {title: '保养计划执行统计', power: [1],code: '1100300'},
        },
      ],
    },
    {
      path: '/maintenance-statement-main',
      name: 'maintenance-statement-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '机务报表',
        power: [1],
        code: '1200000'
      },
      children: [
        {
          path: 'vehicle-energy-consume-statistics',
          name: 'vehicle-energy-consume-statistics',
          component: () => import('@/view/maintenance-management/vehicle-energy-consume-statistics/index'),
          meta: {title: '车辆能源消耗统计', power: [1],code: '1200300'},
        },
        {
          path: 'vehicle-monthly-consume-statistics',
          name: 'vehicle-monthly-consume-statistics',
          component: () => import('@/view/maintenance-management/vehicle-monthly-consume-statistics/index'),
          meta: {title: '车辆燃料消耗月统计表', power: [1],code: '1200800'},
        },
        {
          path: 'annual-consumption-maintenance-statistics',
          name: 'annual-consumption-maintenance-statistics',
          component: () => import('@/view/maintenance-management/annual-consumption-maintenance-statistics/index'),
          meta: {title: '年度燃料消耗、维保费统计', power: [1],code: '1200900'},
        },
        {
          path: 'registered-vehicles-number-statistics',
          name: 'registered-vehicles-number-statistics',
          component: () => import('@/view/maintenance-management/registered-vehicles-number-statistics/index'),
          meta: {title: '在册车辆标台数统计', power: [1],code: '1201000'},
        },
        {
          path: 'vehicle-mobilization-summary',
          name: 'vehicle-mobilization-summary',
          component: () => import('@/view/maintenance-management/vehicle-mobilization-summary/index'),
          meta: {title: '车辆调动汇总', power: [1],code: '1201100'},
        },
        {
          path: 'each-batch-statistical',
          name: 'each-batch-statistical',
          component: () => import('@/view/maintenance-management/each-batch-statistical/index'),
          meta: {title: '各批次车辆型号燃料、里程消耗统计表', power: [1],code: '1201200'},
        },
        {
          path: 'vehicle-ownership-statistics',
          name: 'vehicle-ownership-statistics',
          component: () => import('@/view/maintenance-management/vehicle-ownership-statistics/index'),
          meta: {title: '车辆保有量统计', power: [1],code: '1201300'},
        },
        {
          path: 'vehicle-fuel-summary',
          name: 'vehicle-fuel-summary',
          component: () => import('@/view/maintenance-management/vehicle-fuel-summary/index'),
          meta: {title: '各车型燃料消耗汇总', power: [1],code: '1201400'},
        },
        {
          path: 'vehicle-seat-statistics',
          name: 'vehicle-seat-statistics',
          component: () => import('@/view/maintenance-management/vehicle-seat-statistics/index'),
          meta: {title: '在册车辆座位统计表', power: [1],code: '1201500'},
        },
        {
          path: 'branch-company-vehicle-distribution',
          name: 'branch-company-vehicle-distribution',
          component: () => import('@/view/maintenance-management/branch-company-vehicle-distribution/index'),
          meta: {title: '分公司车辆每月分布情况表', power: [1],code: '1201600'},
        },
      ],
    },
    {
      path: 'Gas-system-inspection',
      name: 'Gas-system-inspection',
      component: () => import('@/view/maintenance-management/Gas-system-inspection/index'),
      meta: {title: '燃气系统检验', power: [1],code: '1500000'},
    },
    {
      path: '/three-inspections-per-management',
      name: 'three-inspections-per-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '一日三检管理',
        power: [1],
        code: '1120000'
      },
      children: [
        {
          path: 'inspection-content',
          name: 'inspection-content',
          component: () => import('@/view/maintenance-management/three-inspections-per-management/inspection-content/index'),
          meta: {title: '检查内容', power: [1],code: '1120100'}
        },
        {
          path: 'inspection-template',
          name: 'inspection-template',
          component: () => import('@/view/maintenance-management/three-inspections-per-management/inspection-template/index'),
          meta: {title: '检查模板', power: [1],code: '1120200'},
        },
        {
          path: 'three-inspections-statistical',
          name: 'three-inspections-statistical',
          component: () => import('@/view/maintenance-management/three-inspections-per-management/three-inspections-statistical/index'),
          meta: {title: '一日三检统计表', power: [1],code: '1120300'},
        },
      ]
    },
    {
      path: 'power-battery-management',
      name: 'power-battery-management',
      component: () => import('@/view/maintenance-management/power-battery-management/index'),
      meta: {title: '动力电池管理', power: [1],code: '1130000'},
    },
    {
      path: '/maintenance-management',
      name: 'maintenance-management',
      component: () => import('@/view/maintenance-management/maintenance-management/index'),
      meta: { title: '机务管理首页', power: [1] ,code: '1130100',},
    }
  ]
}

export default maintenanceManageRouter
