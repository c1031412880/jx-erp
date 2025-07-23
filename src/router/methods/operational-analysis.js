import Layout from "../../layout/Layout";
import Blank from "./router-view";

const operational = {
  path: '/operational-analysis',
  name: 'operational-analysis',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '营运管理',
    icon: 'warehouse-management',
    power: [1],
    code: '11000000',
  },
  children: [
    {
      path: 'operational-management',
      name: 'operational-management',
      component: () => import('@/view/operational-analysis/operational-management/index'),
      meta: {title: '营运管理首页', power: [1],code: '11000100'}
    },
    {
      path: '/operational-basic',
      name: 'operational-basic',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '基础数据',
        power: [1],
        code: '11010000',
      },
      children: [
        {
          path: 'yard-tation-manage',
          name: 'yard-tation-manage',
          component: () => import('@/view/operational-analysis/yard-tation-manage/index'),
          meta: {title: '场站管理', power: [1],code: '11010100'}
        },
        {
          path: 'vehicle-lines-manage-life-cycle',
          name: 'vehicle-lines-manage-life-cycle',
          component: () => import('@/view/operational-analysis/vehicle-lines-manage-life-cycle/index'),
          meta: {title: '线路周期管理', power: [1],code: '11010200'}
        },
        {
          path: 'vehicle-equipment-setting',
          name: 'vehicle-equipment-setting',
          component: () => import('@/view/operational-analysis/vehicle-equipment-setting/index'),
          meta: {title: '车载设备管理', power: [1],code: '11010300'}
        },
        {
          path: 'change-approval',
          name: 'change-approval',
          component: () => import('@/view/operational-analysis/change-approval/index'),
          meta: {title: '变更审批', power: [1],code: '11010400'}
        },
      ]
    },
    {
      path: '/car-charter-management',
      name: 'car-charter-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '包车管理',
        power: [1],
        code: '11020000',
      },
      children: [
        {
          path: 'car-charter-filling',
          name: 'car-charter-filling',
          component: () => import('@/view/operational-analysis/car-charter-filling/index'),
          meta: {title: '包车填报', power: [1],code: '11020100'}
        },
        {
          path: 'charter-statistics',
          name: 'charter-statistics',
          component: () => import('@/view/operational-analysis/charter-statistics/index'),
          meta: {title: '包车统计', power: [1],code: '11020200'}
        },
      ]
    },
    {
      path: '/operations-statistics',
      name: 'operations-statistics',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '营运统计',
        power: [1],
        code: '11030000',
      },
      children: [
        {
          path: 'client-total-mileage-report',
          name: 'client-total-mileage-report',
          component: () => import('@/view/operational-analysis/client-total-mileage-report/index'),
          meta: {title: '总里程报表:', power: [1], code: '11030300'},
        },
        {
          path: 'client-transit-punctuality-rate',
          name: 'client-transit-punctuality-rate',
          component: () => import('@/view/operational-analysis/client-transit-punctuality-rate/index'),
          meta: {title: '公交准点率报表:', power: [1], code: '11030400'},
        },
        {
          path: 'client-punctuality-rate',
          name: 'client-punctuality-rate',
          component: () => import('@/view/operational-analysis/client-punctuality-rate/index'),
          meta: {title: '班次准班准点率:', power: [1], code: '11030500'},
        },
        {
          path: 'client-unprocessed-abnormal-shift-summary',
          name: 'client-unprocessed-abnormal-shift-summary',
          component: () => import('@/view/operational-analysis/client-unprocessed-abnormal-shift-summary/index'),
          meta: {title: '未处理异常班次汇总:', power: [1], code: '11030600'},
        },
        {
          path: 'client-first-and-last-punctuality-rate',
          name: 'client-first-and-last-punctuality-rate',
          component: () => import('@/view/operational-analysis/client-first-and-last-punctuality-rate/index'),
          meta: {title: '首末班准点率报表:', power: [1], code: '11030700'},
        },
        {
          path: 'client-over-speed-report',
          name: 'client-over-speed-report',
          component: () => import('@/view/operational-analysis/client-over-speed-report/index'),
          meta: {title: '超速统计报表:', power: [1], code: '11030800'},
        },
        {
          path: 'client-shift-implement-rate',
          name: 'client-shift-implement-rate',
          component: () => import('@/view/operational-analysis/client-shift-implement-rate/index'),
          meta: {title: '班次执行率:', power: [1], code: '11030900'},
        },
        {
          path: 'client-entry-exit-details',
          name: 'client-entry-exit-details',
          component: () => import('@/view/operational-analysis/client-entry-exit-details/index'),
          meta: {title: '到离场站查询:', power: [1], code: '11031000'},
        },
        {
          path: 'client-mileage-utilize-rate',
          name: 'client-mileage-utilize-rate',
          component: () => import('@/view/operational-analysis/client-mileage-utilize-rate/index'),
          meta: {title: '里程利用率:', power: [1], code: '11031100'},
        },
        {
          path: 'client-operating-assessment-report',
          name: 'client-operating-assessment-report',
          component: () => import('@/view/operational-analysis/client-operating-assessment-report/index'),
          meta: {title: '营运早晚点考核报表(运营考核表):', power: [1], code: '11031200'},
        },

        {
          path: 'client-departure-interval',
          name: 'client-departure-interval',
          component: () => import('@/view/operational-analysis/client-departure-interval/index'),
          meta: {title: '发班间隔:', power: [1], code: '11031300'},
        },
        {
          path: 'client-cross-border-statistics',
          name: 'client-cross-border-statistics',
          component: () => import('@/view/operational-analysis/client-cross-border-statistics/index'),
          meta: {title: '越界统计:', power: [1], code: '11031400'},
        },
        {
          path: 'client-driving-safety-alarm',
          name: 'client-driving-safety-alarm',
          component: () => import('@/view/operational-analysis/client-driving-safety-alarm/index'),
          meta: {title: '驾驶安全报警:', power: [1], code: '11031500'},
        },
        {
          path: 'client-vehicles-average-operating-speed',
          name: 'client-vehicles-average-operating-speed',
          component: () => import('@/view/operational-analysis/client-vehicles-average-operating-speed/index'),
          meta: {title: '车辆平均运营时速:', power: [1], code: '11031600'},
        },
        {
          path: 'client-line-operation-statistics',
          name: 'client-line-operation-statistics',
          component: () => import('@/view/operational-analysis/client-line-operation-statistics/index'),
          meta: {title: '线路运营统计:', power: [1], code: '11031700'},
        },
      ]
    },
  ]
}

export default operational
