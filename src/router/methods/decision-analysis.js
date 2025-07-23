import Layout from '../../layout/Layout'

const decisionAnalysisRouter = {
  path: '/decision-analysis',
  name: 'decision-analysis',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '决策分析',
    icon: 'decision-analysis',
    power: [1],
    code: '12000000'
  },
  children: [
    {
      path: 'maintenance-analysis',
      name: 'maintenance-analysis',
      component: () => import('@/view/decision-analysis/maintenance-analysis/index'),
      meta: {
        title: '机务分析',
        power: [1],
        code: '12010000'
      }
    },
    {
      path: 'financial-analysis',
      name: 'financial-analysis',
      component: () => import('@/view/decision-analysis/financial-analysis/index'),
      meta: {
        title: '财务分析',
        power: [1],
        code: '12020000'
      }
    },
    {
      path: 'revenue-analysis',
      name: 'revenue-analysis',
      component: () => import('@/view/decision-analysis/revenue-analysis/index'),
      meta: {
        title: '营收分析',
        power: [1],
        code: '12030000'
      }
    },
    {
      path: 'operation-analysis',
      name: 'operation-analysis',
      component: () => import('@/view/decision-analysis/operation-analysis/index'),
      meta: {
        title: '营运分析',
        power: [1],
        code: '12040000'
      }
    }
  ]
}

export default decisionAnalysisRouter
