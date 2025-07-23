import Layout from '@/layout/Layout'


// 隐藏路由集合
const routerArr = [
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    // code: 999999,
    meta: {
      title: '功能菜单',
      icon: 'maintenance-management',
      power: [1],
      code: '9999990000',
    },
    children: [
      {
        path: '/download-center',
        name: 'download-center',
        component: () => import('@/view/main-Interface-entrance/download-center/index'),
        meta: { title: '下载中心', power: [1] ,code: '9999990100',},
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        // code: 999999,
        component: () => import('@/view/dashboard/index'),
        meta: { title: '首页', icon: 'home', power: [1]},
      },
      {
        path: '/app-list',
        name: 'app-list',
        component: () => import('@/view/main-Interface-entrance/app-list/index'),
        meta: { title: '快速通道', icon: 'home', power: [1]},
      },
      // {
      //   path: '/new-approve',
      //   name: 'new-approve',
      //   component: () => import('@/view/main-Interface-entrance/launch-affair/component/all-box/new-approve'),
      //   meta: { title: '审批申请', power: [1] },
      // },
      // {
      //   path: '/launch-affair',
      //   name: 'launch-affair',
      //   component: () => import('@/view/main-Interface-entrance/launch-affair/index'),
      //   meta: { title: '待办事项', power: [1], code: '9999990300'  },
      // },
      {
        path: '/news-core',
        name: 'news-core',
        component: () => import('@/view/main-Interface-entrance/news-core/index'),
        meta: { title: '消息通知', power: [1] },
      },
      {
        path: '/news-details/:id/:title/:model',
        name: 'news-details',
        component: () => import('@/view/main-Interface-entrance/news-details/index'),
        meta: { title: '消息处理', power: [1] },
      },
      {
        path: '/import-export',
        name: 'import-export',
        component: () => import('@/view/main-Interface-entrance/Import-export/index'),
        meta: { title: '导入导出记录', power: [1],code: '9999990400', },
      },
      {
        path: '/schedule-todo',
        name: 'schedule-todo',
        component: () => import('@/view/main-Interface-entrance/schedule-todo/index'),
        meta: { title: '日程待办', power: [1] },
      },
      {
        path: '/online-number',
        name: 'online-number',
        component: () => import('@/view/main-Interface-entrance/online-number/index'),
        meta: { title: '在线人数', power: [1] },
      },
      {
        path: '/address-book',
        name: 'address-book',
        component: () => import('@/view/main-Interface-entrance/address-book/index'),
        meta: { title: '通讯录管理', power: [1],code: '9999990600',},
      },
      // {
      //   path: '/news-management',
      //   name: 'news-management',
      //   component: () => import('@/view/main-Interface-entrance/news-management/index'),
      //   meta: { title: '新闻管理', power: [1] },
      // },
      {
        path: '/driver-management',
        name: 'driver-management',
        component: () => import('@/view/personnel-management/driver-management/index'),
        meta: { title: '驾驶员信息', power: [1] ,code: '9999990700',},
      },
   
    ]
  },
  { path: '/login', component: () => import('@/view/login/index'), hidden: true },
  { path: '/login_noToken', component: () => import('@/view/login/no_token'), hidden: true },
  { path: '/change-password',name: 'change-password', component: () => import('@/view/change-password/index'), hidden: true },
  { path: '/404', component: () => import('@/view/404'), hidden: true },
  { path: '/documentView', component: () => import('@/components/document-model/document-view'), hidden: true },
  { path: '*', redirect: '/404', hidden: true },
  {path: '/401', redirect: '/401', component: () => import('@/view/401'), hidden: true},
  {path: '/fill-submit-form',name: 'fill-submit-form', component: () => import('@/view/process-design-management/fill-submit-form/index'), hidden: true},
]

export default routerArr
