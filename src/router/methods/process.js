import Layout from "../../layout/Layout";

const processRouter = {
  path: '/process',
  name: 'process',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '流程设计',
    icon: 'system-user',
    power: [1]
  },
  children: [
    {
      path: 'process-design',
      name: 'process-design',
      component: () => import('@/view/admin/approver'),
      meta: {title: '流程设计', power: [1]}
    }
  ]
}

export default processRouter
