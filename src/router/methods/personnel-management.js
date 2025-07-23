import Layout from '../../layout/Layout'
import Blank from './router-view'

const personnelManagementRouter = {
  path: '/personnel-management',
  name: 'personnel-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '人事管理',
    icon: 'personnel-management',
    power: [1],
    code: '3000000'
  },
  children: [
    {
      path: 'staff-manage',
      name: 'staff-manage',
      component: () => import('@/view/personnel-management/staff-manage/index'),
      meta: { title: '员工信息管理', power: [1], code: '3010000' }
    },
    {
      path: 'transfer-management',
      name: 'transfer-management',
      component: () => import('@/view/personnel-management/transfer-management/index'),
      meta: { title: '调动管理', power: [1], code: '3190000' }
    },
    {
      path: 'leave-staff-management',
      name: 'leave-staff-management',
      component: () => import('@/view/personnel-management/leave-staff-management/index'),
      meta: { title: '离职管理', power: [1], code: '3020000' }
    },
    {
      path: 'salary-sheet',
      name: 'salary-sheet',
      component: () => import('@/view/personnel-management/salary-sheet/index'),
      meta: { title: '工资条', power: [1], code: '3030000' }
    },
    {
      path: 'personnel-analysis',
      name: 'personnel-analysis',
      component: () => import('@/view/personnel-management/personnel-analysis/index'),
      meta: { title: '人员分析', power: [1], code: '3040000' }
    },
    {
      path: '/staff-assessment-management-main',
      name: 'staff-assessment-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '员工考核',
        power: [1],
        code: '3050000'
      },
      children: [
        {
          path: 'assessment-management',
          name: 'assessment-management',
          component: () => import('@/view/personnel-management/assessment-management/index'),
          meta: { title: '考核管理', power: [1], code: '3050100' }
        },
        {
          path: 'assessment-template-management',
          name: 'assessment-template-management',
          component: () =>
            import('@/view/personnel-management/assessment-template-management/index'),
          meta: { title: '考核模板管理', power: [1], code: '3050200' }
        },
        {
          path: 'my-assessment-management',
          name: 'my-assessment-management',
          component: () => import('@/view/personnel-management/my-assessment-management/index'),
          meta: { title: '我的考核', power: [1], code: '3050300' }
        }
      ]
    },
    {
      path: 'driver-salary-accounting',
      name: 'driver-salary-accounting',
      component: () => import('@/view/personnel-management/driver-salary-accounting/index'),
      meta: { title: '驾驶员薪资核算', power: [1], code: '3060000' }
    },
    {
      path: 'driver-induction-management',
      name: 'driver-induction-management',
      component: () => import('@/view/personnel-management/driver-induction-management/index'),
      meta: { title: '驾驶员入职管理', power: [1], code: '3070000' }
    },
    {
      path: '/holiday-management-main',
      name: 'holiday-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '假期管理',
        power: [1],
        code: '3080000'
      },
      children: [
        {
          path: 'holiday-rules-setting',
          name: 'holiday-rules-setting',
          component: () => import('@/view/personnel-management/holiday-rules-setting/index'),
          meta: { title: '假期规则', power: [1], code: '3080100' }
        },
        {
          path: 'staff-vacation-balance',
          name: 'staff-vacation-balance',
          component: () => import('@/view/personnel-management/staff-vacation-balance/index'),
          meta: { title: '员工假期余额', power: [1], code: '3080200' }
        }
        // {
        //   path: 'assessment-template-management',
        //   name: 'assessment-template-management',
        //   component: () => import('@/view/personnel-management/assessment-template-management/index'),
        //   meta: {title: '考核模板管理', power: [1],code: '3050200'},
        // },
        // {
        //   path: 'my-assessment-management',
        //   name: 'my-assessment-management',
        //   component: () => import('@/view/personnel-management/my-assessment-management/index'),
        //   meta: {title: '我的考核', power: [1],code: '3050300'},
        // }
      ]
    },
    {
      path: '/attendance-statistics-main',
      name: 'attendance-statistics-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '考勤统计',
        power: [1],
        code: '3090000'
      },
      children: [
        {
          path: 'attendance-statistics-summary',
          name: 'attendance-statistics-summary',
          component: () =>
            import('@/view/personnel-management/attendance-statistics-summary/index'),
          meta: { title: '考勤统计汇总', power: [1], code: '3090100' }
        },
        {
          path: 'attendance-statistics-details',
          name: 'attendance-statistics-details',
          component: () =>
            import('@/view/personnel-management/attendance-statistics-details/index'),
          meta: { title: '考勤统计明细', power: [1], code: '3090200' }
        }
      ]
    },
    {
      path: 'reserve-talent-pool',
      name: 'reserve-talent-pool',
      component: () => import('@/view/personnel-management/reserve-talent-pool/index'),
      meta: { title: '后备人才储备库', power: [1], code: '3100000' }
    },
    {
      path: '/reward-punishment-main',
      name: 'reward-punishment-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '员工奖惩管理',
        power: [1],
        code: '3110000'
      },
      children: [
        {
          path: 'reward-punishment-rules-management',
          name: 'reward-punishment-rules-management',
          component: () =>
            import('@/view/personnel-management/reward-punishment-rules-management/index'),
          meta: { title: '奖惩规定管理', power: [1], code: '3110100' }
        },
        {
          path: 'reward-punishment-record',
          name: 'reward-punishment-record',
          component: () => import('@/view/personnel-management/reward-punishment-record/index'),
          meta: { title: '员工奖惩记录', power: [1], code: '3110200' }
        }
      ]
    },
    {
      path: '/attendance-settings-main',
      name: 'attendance-settings-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '考勤设置',
        power: [1],
        code: '3120000'
      },
      children: [
        {
          path: 'attendance-group-management',
          name: 'attendance-group-management',
          component: () => import('@/view/personnel-management/attendance-group-management/index'),
          meta: { title: '考勤组管理', power: [1], code: '3120100' }
        },
        {
          path: 'shift-management',
          name: 'shift-management',
          component: () => import('@/view/personnel-management/shift-management/index'),
          meta: { title: '班次管理', power: [1], code: '3120200' }
        },
        {
          path: 'overtime-rules',
          name: 'overtime-rules',
          component: () => import('@/view/personnel-management/overtime-rules/index'),
          meta: { title: '加班规则', power: [1], code: '3120300' }
        }
      ]
    },
    {
      path: '/attendance-summary-main',
      name: 'attendance-summary-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '员工考勤汇总',
        power: [1],
        code: '3130000'
      },
      children: [
        {
          path: 'daily-attendance-summary',
          name: 'daily-attendance-summary',
          component: () => import('@/view/personnel-management/daily-attendance-summary/index'),
          meta: { title: '日考勤汇总', power: [1], code: '3130100' }
        },
        {
          path: 'monthly-attendance-summary',
          name: 'monthly-attendance-summary',
          component: () => import('@/view/personnel-management/monthly-attendance-summary/index'),
          meta: { title: '月考勤汇总', power: [1], code: '3130200' }
        },
        {
          path: 'punch-original-record',
          name: 'punch-original-record',
          component: () => import('@/view/personnel-management/punch-original-record/index'),
          meta: { title: '原始记录', power: [1], code: '3130300' }
        },
        {
          path: 'punch-time',
          name: 'punch-time',
          component: () => import('@/view/personnel-management/punch-time/index'),
          meta: { title: '打卡时间', power: [1], code: '3130400' }
        },
        {
          path: 'monthly-attendance-statistics',
          name: 'monthly-attendance-statistics',
          component: () => import('@/view/personnel-management/monthly-attendance-statistics/index'),
          meta: { title: '月考勤统计', power: [1], code: '3130500' }
        }
      ]
    },
    {
      path: 'driver-leave-staff-management',
      name: 'driver-leave-staff-management',
      component: () => import('@/view/personnel-management/driver-leave-staff-management/index'),
      meta: { title: '驾驶员离职管理', power: [1], code: '3140000' }
    },
    {
      path: 'salary-management',
      name: 'salary-management',
      component: () => import('@/view/personnel-management/salary-management/index'),
      meta: { title: '薪资管理', power: [1], code: '3150000' }
    },
    {
      path: '/propaganda-management',
      name: 'propaganda-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '宣传管理',
        power: [1],
        code: '3160000'
      },
      children: [
        {
          path: 'promotion-manuscript-management',
          name: 'promotion-manuscript-management',
          component: () =>
            import('@/view/personnel-management/promotion-manuscript-management/index'),
          meta: { title: '宣传稿件管理', power: [1], code: '3160100' }
        },
        {
          path: 'employee-promotion-statistics',
          name: 'employee-promotion-statistics',
          component: () =>
            import('@/view/personnel-management/employee-promotion-statistics/index'),
          meta: { title: '员工宣传分数统计', power: [1], code: '3160200' }
        }
      ]
    },
    {
      path: '/assessment-management',
      name: 'assessment-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '考核管理',
        power: [1],
        code: '3170000'
      },
      children: [
        {
          path: 'assessment-content',
          name: 'assessment-content',
          component: () =>
            import('@/view/personnel-management/examine-management/assessment-content/index'),
          meta: { title: '考核内容管理', power: [1], code: '3170100' }
        },
        {
          path: 'assessment-template',
          name: 'assessment-template',
          component: () =>
            import('@/view/personnel-management/examine-management/assessment-template/index'),
          meta: { title: '考核模板管理', power: [1], code: '3170200' }
        },
        {
          path: 'check-management',
          name: 'check-management',
          component: () =>
            import('@/view/personnel-management/examine-management/check-management/index'),
          meta: { title: '考核管理', power: [1], code: '3170300' }
        },
        {
          path: 'assessment-score',
          name: 'assessment-score',
          component: () =>
            import('@/view/personnel-management/examine-management/assessment-score/index'),
          meta: { title: '考核评分', power: [1], code: '3170400' }
        },
        {
          path: 'assessment-appeal',
          name: 'assessment-appeal',
          component: () =>
            import('@/view/personnel-management/examine-management/assessment-appeal/index'),
          meta: { title: '考核申诉', power: [1], code: '3170500' }
        },
        {
          path: 'my-assessment',
          name: 'my-assessment',
          component: () =>
            import('@/view/personnel-management/examine-management/my-assessment/index'),
          meta: { title: '我的考核', power: [1], code: '3170600' }
        },
        {
          path: 'monthly-report-assessment-indicators',
          name: 'monthly-report-assessment-indicators',
          component: () =>
            import(
              '@/view/personnel-management/examine-management/monthly-report-assessment-indicators/index'
            ),
          meta: { title: '集团经营业绩考核指标完成情况跟踪月报表', power: [1], code: '3170700' }
        },
        {
          path: 'assessment-statistics',
          name: 'assessment-statistics',
          component: () =>
            import('@/view/personnel-management/examine-management/assessment-statistics/index'),
          meta: { title: '考核统计', power: [1], code: '3170800' }
        }
      ]
    },
    {
      path: '/salary-slip-management',
      name: 'salary-slip-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '工资条管理',
        power: [1],
        code: '3180000'
      },
      children: [
        {
          path: 'salary-project-library',
          name: 'salary-project-library',
          component: () =>
            import(
              '@/view/personnel-management/salary-slip-management/salary-project-library/index'
            ),
          meta: { title: '工资项目库', power: [1], code: '3180100' }
        },
        {
          path: 'payslip-template',
          name: 'payslip-template',
          component: () =>
            import('@/view/personnel-management/salary-slip-management/payslip-template/index'),
          meta: { title: '工资条模板', power: [1], code: '3180200' }
        },
        {
          path: 'payslip-distribution',
          name: 'payslip-distribution',
          component: () =>
            import('@/view/personnel-management/salary-slip-management/payslip-distribution/index'),
          meta: { title: '工资条发放', power: [1], code: '3180300' }
        }
      ]
    },
    {
      path: 'employee-care',
      name: 'employee-care',
      component: () => import('@/view/personnel-management/employee-care/index'),
      meta: { title: '员工关怀', power: [1], code: '3200000' }
    },
  ]
}

export default personnelManagementRouter
