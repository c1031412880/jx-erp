import Layout from "../../layout/Layout";

const ticketManagementRouter = {
  path: '/ticket-management',
  name: 'ticket-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '票务管理',
    icon: 'warehouse-management',
    power: [1],
    code:'8000000'
  },
  children: [
    {
      path: 'counting-input',
      name: 'counting-input',
      component: () => import('@/view/ticket-management/counting-input/index'),
      meta: {title: '点钞录入', power: [1],code:'8010000'}
    },
    {
      path: 'money-reconcilia',
      name: 'money-reconcilia',
      component: () => import('@/view/ticket-management/money-reconcilia/index'),
      meta: {title: '现金对账', power: [1],code:'8020000'}
    },
    {
      path: 'ic-card-consume',
      name: 'ic-card-consume',
      component: () => import('@/view/ticket-management/ic-card-consume/index'),
      meta: {title: '刷卡消费统计', power: [1],code:'8040000'}
    },
    {
      path: 'revenue-statistics',
      name: 'revenue-statistics',
      component: () => import('@/view/ticket-management/revenue-statistics/index'),
      meta: {title: '营收统计', power: [1],code:'8050000'}
    },
    {
      path: 'money-bag-input',
      name: 'money-bag-input',
      component: () => import('@/view/ticket-management/money-bag-input/index'),
      meta: {title: '日钱袋录入', power: [1],code:'8060000'}
    },
    {
      path: 'money-bag-statistics',
      name: 'money-bag-statistics',
      component: () => import('@/view/ticket-management/money-bag-statistics/index'),
      meta: {title: '营收汇总', power: [1],code:'8070000'}
    },
    {
      path: 'coin-input',
      name: 'coin-input',
      component: () => import('@/view/ticket-management/coin-input/index'),
      meta: {title: '投币录入(按币种录入)', power: [1],code:'8080000'}
    },
    {
      // 嘉兴(新)
      path: 'ic-card-detail',
      name: 'ic-card-detail',
      component: () => import('@/view/ticket-management/ic-card-detail/index'),
      meta: {title: '刷卡消费明细', power: [1],code:'8090000'}
    },
    {
      // 嘉兴(新)
      path: 'money-bag-summary',
      name: 'money-bag-summary',
      component: () => import('@/view/ticket-management/money-bag-summary/index'),
      meta: {title: '刷卡营收汇总', power: [1],code:'8100000'}
    },
    {
      // 嘉兴(新)
      path: 'ic-card-statistics',
      name: 'ic-card-statistics',
      component: () => import('@/view/ticket-management/ic-card-statistics/index'),
      meta: {title: '刷卡营收统计', power: [1],code:'8110000'}
    },
    // {
    //   path: 'ic-card',
    //   name: 'ic-card',
    //   component: () => import('@/view/ticket-management/ic-card/index'),
    //   meta: {title: '刷卡', power: [1]}
    // },
  ]
}

export default ticketManagementRouter
