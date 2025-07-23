import Layout from "../../layout/Layout";
import Blank from "./router-view";

const safeManagementRouter = {
  path: '/safe-management',
  name: 'safe-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '安全管理',
    icon: 'safe-management',
    power: [1],
    code: '2000000',
  },
  children: [
    {
      path: '/accident-manage-main',
      name: 'accident-manage-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '事故管理',
        power: [1],
        code: '2010000',
      },
      children: [
        {
          path: 'accident-manage',
          name: 'accident-manage',
          component: () => import('@/view/safe-manage/accident-manage/index'),
          meta: {title: '事故管理', power: [1], code: '2010100'},
          // code: '2010100'
        },
        {
          path: 'accident-analysis',
          name: 'accident-analysis',
          component: () => import('@/view/safe-manage/accident-analysis/index'),
          meta: {title: '事故分析', power: [1],code: '2010200'},
        },
        {
          path: 'accident-detail-dispose',
          name: 'accident-detail-dispose',
          component: () => import('@/view/safe-manage/accident-detail-dispose/index'),
          meta: {title: '事故详情', power: [1],code: '2010300'},
        },
        {
          path: 'accident-nature-summary',
          name: 'accident-nature-summary',
          component: () => import('@/view/safe-manage/accident-nature-summary/index'),
          meta: {title: '事故性质汇总', power: [1],code: '2010400'},
        },
        {
          path: 'violation-types-summary',
          name: 'violation-types-summary',
          component: () => import('@/view/safe-manage/violation-types-summary/index'),
          meta: {title: '违章类型汇总', power: [1],code: '2010500'},
        },
        {
          path: 'accidents-violations-analysis',
          name: 'accidents-violations-analysis',
          component: () => import('@/view/safe-manage/accidents-violations-analysis/index'),
          meta: {title: '事故违章综合分析', power: [1],code: '2010600'},
        },
      ]
    },
    {
      path: '/check-manage-main',
      name: 'check-manage-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '稽查管理',
        power: [1],
        code: '2020000',
      },
      
      children: [
        {
          path: 'violation-manage',
          name: 'violation-manage',
          component: () => import('@/view/safe-manage/violation-manage/index'),
          meta: {title: '违法管理', power: [1], code: '2020100'},
        },
        {
          path: 'violation-project',
          name: 'violation-project',
          component: () => import('@/view/safe-manage/violation-project/index'),
          meta: {title: '违法项目管理', power: [1],code: '2020200'},
        },
        {
          path: 'violation-inspect-manage',
          name: 'violation-inspect-manage',
          component: () => import('@/view/safe-manage/violation-inspect-manage/index'),
          meta: {title: '违规检查奖罚管理', power: [1],code: '2020300'},
        },
        {
          path: 'driver-violation-record',
          name: 'driver-violation-record',
          component: () => import('@/view/safe-manage/driver-violation-record/index'),
          meta: {title: '驾驶员违规记录', power: [1],code: '2020400'},
        },
        {
          path: 'speed-statistics',
          name: 'speed-statistics',
          component: () => import('@/view/safe-manage/speed-statistics/index'),
          meta: {title: '超速统计', power: [1],code: '2020500'},
        },
      ]
    },
    
    {
      path: 'car-insurance-manage',
      name: 'car-insurance-manage',
      component: () => import('@/view/safe-manage/car-insurance-manage/index'),
      meta: {title: '车辆保险管理', power: [1],code: '2030000'},
    },
    {
      path: 'driver-safetyfile-manage',
      name: 'driver-safetyfile-manage',
      component: () => import('@/view/safe-manage/driver-safetyfile-manage/index'),
      meta: {title: '驾驶员安全档案', power: [1],code: '2040000'}
    },
    {
      path: '/safety-statistics-main',
      name: 'safety-statistics-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '统计报表',
        power: [1],
        code: '2050000',
      },
      children: [
        {
          path: 'vehicle-accident-statistics',
          name: 'vehicle-accident-statistics',
          component: () => import('@/view/safe-manage/vehicle-accident-statistics/index'),
          meta: {title: '车辆事故统计', power: [1], code: '2050100'},
          
        },
        {
          path: 'accident-summary-statistics',
          name: 'accident-summary-statistics',
          component: () => import('@/view/safe-manage/accident-summary-statistics/index'),
          meta: {title: '事故汇总', power: [1],code: '2050200'},
        },
        {
          path: 'illegal-summary-statistics',
          name: 'illegal-summary-statistics',
          component: () => import('@/view/safe-manage/illegal-summary-statistics/index'),
          meta: {title: '违法汇总', power: [1],code: '2050300'},
        },
        {
          path: 'speed-multiple-station',
          name: 'speed-multiple-station',
          component: () => import('@/view/safe-manage/speed-multiple-station/index'),
          meta: {title: '超速多发站点', power: [1],code: '2050400'},
        },
        {
          path: 'policy-benefit-analysis',
          name: 'policy-benefit-analysis',
          component: () => import('@/view/safe-manage/policy-benefit-analysis/index'),
          meta: {title: '保单效益分析', power: [1],code: '2050500'},
        },
        {
          path: 'violations-summary',
          name: 'violations-summary',
          component: () => import('@/view/safe-manage/violations-summary/index'),
          meta: {title: '违规汇总', power: [1],code: '2050600'},
        }
      ]
    },
    {
      path: 'insurance-type-manage',
      name: 'insurance-type-manage',
      component: () => import('@/view/safe-manage/insurance-type-manage/index'),
      meta: {title: '保险类型管理', power: [1],code: '2060000'},
    },
    {
      path: 'driver-evaluation-record',
      name: 'driver-evaluation-record',
      component: () => import('@/view/safe-manage/driver-evaluation-record/index'),
      meta: {title: '驾驶员考核记录', power: [1],code: '2070000'}
    },
    {
      path: 'safety-hazard-manage',
      name: 'safety-hazard-manage',
      component: () => import('@/view/safe-manage/safety-hazard-manage/index'),
      meta: {title: '安全隐患管理', power: [1],code: '2080000'}
    },
    {
      path: 'safety-meeting-record',
      name: 'safety-meeting-record',
      component: () => import('@/view/safe-manage/safety-meeting-record/index'),
      meta: {title: '安全会议记录', power: [1],code: '2090000'}
    },
    {
      path: 'safety-training-record',
      name: 'safety-training-record',
      component: () => import('@/view/safe-manage/safety-training-record/index'),
      meta: {title: '安全培训记录', power: [1],code: '2100000'}
    },
    // {
    //   path: 'driver-violation-recor',
    //   name: 'driver-violation-recor',
    //   component: () => import('@/view/safe-manage/driver-violation-recor/index'),
    //   meta: {title: '驾驶员违规', power: [1]}
    // },
    // {
    //   path: '/business-manage-main',
    //   name: 'business-manage-main',
    //   component: Blank,
    //   alwaysShow: true,
    //   meta: {
    //     title: '业务管理',
    //     power: [1],
    //     code: '2080000',
    //   },
    //   children: [
    //     {
    //       path: 'violation-management',
    //       name: 'violation-management',
    //       component: () => import('@/view/safe-manage/violation-management/index'),
    //       meta: {title: '违章管理', power: [1], code: '2080100'},
          
    //     }
    //   ]
    // },
    {
      path: 'safe-data-center',
      name: 'safe-data-center',
      component: () => import('@/view/safe-manage/safe-data-center/index'),
      meta: {title: '安全数据中心', power: [1],code: '2110000'}
    },
  ]
}

export default safeManagementRouter
