import Layout from "../../layout/Layout";

const processDesignRouter = {
  path: '/process-design',
  name: 'process-design',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '流程设计',
    icon: 'warehouse-management',
    power: [1]
  },
  children: [
    {
      path: 'form-design',
      name: 'form-design',
      component: () => import('@/view/process-design-management/form-design/index'),
      meta: {title: '表单设计', power: [1]}
    },
    {
        path: 'process-design',
        name: 'process-design',
        component: () => import('@/view/process-design-management/process-design/index'),
        meta: {title: '流程设计', power: [1]}
      },
      {
        path: 'fill-form',
        name: 'fill-form',
        component: () => import('@/view/process-design-management/fill-form/index'),
        meta: {title: '表单填写', power: [1]}
      },
      // {
      //   path: 'fill-submit-form',
      //   name: 'fill-submit-form',
      //   component: () => import('@/view/process-design-management/fill-submit-form/index1'),
      //   meta: {title: '表单填写内容'},
      //   // hidden:true
      // },
      {
        path: 'process-show',
        name: 'process-show',
        component: () => import('@/view/process-design-management/process-show/index'),
        meta: {title: '流程显示组件', power: [1]},
        // hidden:true
      },

      {
        path: 'step',
        name: 'step',
        component: () => import('@/view/step'),
        meta: {title: '流程步骤', power: [1]},
        hidden:true
      },

  ]
}

export default processDesignRouter
