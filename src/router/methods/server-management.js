import Layout from '../../layout/Layout'
import Blank from './router-view'
const serverManagementRouter = {
  path: '/server-management',
  name: 'server-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '服务管理',
    icon: 'warehouse-management',
    power: [1],
    code: '7000000'
  },
  children: [
    {
      path: 'passenger-server-management',
      name: 'passenger-server-management',
      component: () => import('@/view/server-management/passenger-server-management-use/index'),
      meta: { title: '乘客服务管理', power: [1], code: '7010000' }
    },
    {
      path: 'passenger-complaint-prasie-statistics',
      name: 'passenger-complaint-prasie-statistics',
      component: () =>
        import('@/view/server-management/passenger-complaint-prasie-statistics/index'),
      meta: { title: '乘客投诉表扬统计', power: [1], code: '7020000' }
    },
    {
      path: 'lost-find',
      name: 'lost-find',
      component: () => import('@/view/server-management/lost-find/index'),
      meta: { title: '失物招领', power: [1], code: '7030000' }
    },
    {
      path: 'drivers-star-setting-rules',
      name: 'drivers-star-setting-rules',
      component: () => import('@/view/server-management/drivers-star-setting-rules/index'),
      meta: {title: '驾驶员星级考核规则', power: [1], code: '7050000'}
    },
    // {
    //   path: 'drivers-star-setting-rules',
    //   name: 'drivers-star-setting-rules',
    //   component: () => import('@/view/server-management/driver-star-assessment-rules/index'),
    //   meta: { title: '驾驶员星级考核规则', power: [1], code: '7050000' }
    // },
    {
      path: 'driver-star-rating-situation',
      name: 'driver-star-rating-situation',
      component: () => import('@/view/server-management/driver-star-rating-situation/index'),
      meta: { title: '驾驶员星级情况', power: [1], code: '7100000' }
    },
    {
      path: 'driving-star-rating',
      name: 'driving-star-rating',
      component: () => import('@/view/server-management/driving-star-rating/index'),
      meta: { title: '驾驶员星级考核', power: [1], code: '7060000' }
    },
    {
      path: 'filiale-performance-assessment',
      name: 'filiale-performance-assessment',
      component: () => import('@/view/server-management/filiale-performance-assessment/index'),
      meta: { title: '分公司绩效考核', power: [1], code: '7070000' }
    },
    {
      path: 'driver-service-quality-statistics',
      name: 'driver-service-quality-statistics',
      component: () => import('@/view/server-management/driver-service-quality-statistics/index'),
      meta: { title: '驾驶员服务质量考核统计', power: [1], code: '7080000' }
    },
    {
      path: 'news-information',
      name: 'news-information',
      component: () => import('@/view/server-management/news-information'),
      meta: { title: '新闻资讯', power: [1], code: '7090000' }
    },
    {
      path: 'bicycle-service-statistical',
      name: 'bicycle-service-statistical',
      component: () => import('@/view/server-management/bicycle-service-statistical/index'),
      meta: { title: '公共自行车乘客服务统计表', power: [1], code: '7011000' }
    },
    {
      path: 'passenger-mistakenly-statistics',
      name: 'passenger-mistakenly-statistics',
      component: () => import('@/view/server-management/passenger-mistakenly-statistics/index'),
      meta: { title: '乘客误刷统计', power: [1], code: '7015000' }
    },
    {
      path: '/star-rating-assessment',
      name: 'star-rating-assessment',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '星级考核',
        power: [1],
        code: '7016000'
      },
      children: [
        {
          path: 'democratic-rating',
          name: 'democratic-rating',
          component: () => import('@/view/server-management/democratic-rating/index'),
          meta: { title: '民主评分', power: [1], code: '7016100' }
        },
        {
          path: 'star-rating-statistics',
          name: 'star-rating-statistics',
          component: () => import('@/view/server-management/star-rating-statistics/index'),
          meta: { title: '星级评分统计', power: [1], code: '7016200' }
        },
        {
          path: 'star-rating',
          name: 'star-rating',
          component: () => import('@/view/server-management/star-rating/index'),
          meta: { title: '星级评定', power: [1], code: '7016300' }
        },
        {
          path: 'month-assessment-ranking',
          name: 'month-assessment-ranking',
          component: () => import('@/view/server-management/month-assessment-ranking/index'),
          meta: { title: '月考核排名', power: [1], code: '7016500' }
        },
        {
          path: 'star-trim',
          name: 'star-trim',
          component: () => import('@/view/server-management/star-trim/index'),
          meta: { title: '星级微调', power: [1], code: '7016400' }
        },
        {
          path: 'driver-leave-record',
          name: 'driver-leave-record',
          component: () => import('@/view/server-management/driver-leave-record/index'),
          meta: { title: '驾驶员病、工、事假记录', power: [1], code: '7016600' }
        }
      ]
    },
    {
      path: 'inspection-management',
      name: 'inspection-management',
      component: () => import('@/view/server-management/inspection-management/index'),
      meta: { title: '稽查管理', power: [1], code: '7017000' }
    },
    {
      path: 'driving-safety-excellent-driver',
      name: 'driving-safety-excellent-driver',
      component: () => import('@/view/server-management/driving-safety-excellent-driver/index'),
      meta: { title: '行车安全优秀驾驶员', power: [1], code: '7018000' }
    },
    // {
    //   path: 'server-dashboard',
    //   name: 'server-dashboard',
    //   component: () => import('@/view/server-management/server-dashboard/index'),
    //   meta: { title: '服务分析', power: [1], code: '7110000' }
    // }
  ]
}

export default serverManagementRouter
