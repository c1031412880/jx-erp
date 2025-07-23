import Layout from "../../layout/Layout";

const systemUserRouter = {
  path: '/system-user',
  name: 'system-user',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '系统管理',
    icon: 'system-user',
    power: [1],
    code: '4000000',
  },
  children: [
    {
      path: 'personnel-manage',
      name: 'personnel-manage',
      component: () => import('@/view/system-user/personnel-manage/index'),
      meta: {title: '用户管理', power: [1],code: '4010000'}
    },
    {
      path: 'report-manage',
      name: 'report-manage',
      component: () => import('@/view/system-user/report-manage/index'),
      meta: {title: '自定义报表', power: [1],code: '4160000'},
    },
    {
      path: 'process-manage',
      name: 'process-manage',
      component: () => import('@/view/system-user/process-manage/index'),
      meta: {title: '审批流程管理', power: [1],code: '4070000'}
    },
    {
      path: 'organization-chart-manage',
      name: 'organization-chart-manage',
      component: () => import('@/view/system-user/organization-chart-manage/index'),
      meta: {title: '组织架构管理', power: [1],code: '4030000'}
    },
    {
      path: 'role-management',
      name: 'role-management',
      component: () => import('@/view/system-user/role-management/index'),
      meta: {title: '角色管理', power: [1],code: '4020000'}
    },
    {
      path: 'job-management',
      name: 'job-management',
      component: () => import('@/view/system-user/job-management/index'),
      meta: {title: '职位管理', power: [1],code: '4040000'}
    },
    {
      path: 'vehicle-lines-manage',
      name: 'vehicle-lines-manage',
      component: () => import('@/view/system-user/vehicle-lines-manage/index'),
      meta: {title: '线路信息管理', power: [1],code: '4050000'}
    },
    {
      path: 'data-dictionaries-maintain',
      name: 'data-dictionaries-maintain',
      component: () => import('@/view/system-user/data-dictionaries-maintain/index'),
      meta: {title: '数据字典管理', power: [1],code: '4090000'}
    },
    {
      path: 'from-manage',
      name: 'from-manage',
      component: () => import('@/view/system-user/from-manage/index'),
      meta: {title: '表单管理', power: [1],code: '4060000'}
    },
    {
      path: 'charge-station-manage',
      name: 'charge-station-manage',
      component: () => import('@/view/system-user/charge-station-manage/index'),
      meta: {title: '充电站管理', power: [1],code: '4080000'}
    },
    {
      path: 'menu-manage',
      name: 'menu-manage',
      component: () => import('@/view/system-user/menu-manage/index'),
      meta: {title: '功能菜单栏管理', power: [1],code: '4100000'}
    },
    {
      path: 'audit-log',
      name: 'audit-log',
      component: () => import('@/view/system-user/audit-log/index'),
      meta: {title: '审计日志', power: [1],code: '4110000'}
    },
    {
      path: 'site-information-management',
      name: 'site-information-management',
      component: () => import('@/view/system-user/site-information-management/index'),
      meta: {title: '站点信息管理', power: [1],code: '4120000'}
    },
    {
      path: 'board-machine-management',
      name: 'board-machine-management',
      component: () => import('@/view/system-user/board-machine-management/index'),
      meta: {title: '车载机管理', power: [1],code: '4130000'}
    },
    {
      path: 'operating-particulars',
      name: 'operating-particulars',
      component: () => import('@/view/system-user/operating-particulars/index'),
      meta: {title: '操作日志明细', power: [1],code: '4140000'}
    },
    {
      path: 'system-announcement-managemnet',
      name: 'system-announcement-managemnet',
      component: () => import('@/view/system-user/system-announcement-managemnet/index'),
      meta: {title: '系统公告', power: [1],code: '4150000'}
    },
    {
      path: 'setting-center',
      name: 'setting-center',
      component: () => import('@/view/system-user/setting-center/index'),
      meta: {title: '设置中心', power: [1],code: '4170000'}
    },
    {
      path: 'station-management',
      name: 'station-management',
      component: () => import('@/view/system-user/station-management/index'),
      meta: {title: '场站管理', power: [1],code: '4180000'}
    },
    {
      path: 'rationalization-suggestions',
      name: 'rationalization-suggestions',
      component: () => import('@/view/system-user/rationalization-suggestions/index'),
      meta: {title: '合理化建议', power: [1],code: '4190000'}
    },
    {
      path: 'emergency-command-information',
      name: 'emergency-command-information',
      component: () => import('@/view/system-user/emergency-command-information/index'),
      meta: {title: '应急指挥信息', power: [1],code: '4210000'}
    },
    {
      path: 'print-template',
      name: 'print-template',
      component: () => import('@/view/system-user/print-template/index'),
      meta: {title: '打印模板管理', power: [1],code: '4220000'}
    },
    {
      path: 'common-language-management',
      name: 'common-language-management', 
      component: () => import('@/view/system-user/common-language-management/index'),
      meta: {title: '常用语管理', power: [1],code: '4230000'}
    },
    {
      path: 'bus-assistant',
      name: 'bus-assistant', 
      component: () => import('@/view/system-user/bus-assistant/index'),
      meta: {title: '公交助手', power: [1],code: '4240000'}
    },
  ]
}

export default systemUserRouter
