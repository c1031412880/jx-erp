import Layout from "../../layout/Layout";

const documentManage = {
  path: '/document-manage',
  name: 'document-manage',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '公文管理',
    icon: 'document-manage',
    power: [1],
    code: '6000000',
  },
  children: [
    {
      path: 'document-main',
      name: 'document-main',
      component: () => import('@/view/document-manage/document-main/index'),
      meta: {title: '公文管理', power: [1],code: '6010000'},
    },
    {
      path: 'overprint-model',
      name: 'overprint-model',
      component: () => import('@/view/document-manage/overprint-model/index'),
      meta: {title: '套红模板管理', power: [1],code: '6020000'},
    },
    {
      path: 'electronics-seal',
      name: 'electronics-seal',
      component: () => import('@/view/document-manage/electronics-seal/index'),
      meta: {title: '电子印章管理', power: [1],code: '6030000'},
    },
    {
      path: 'document-library',
      name: 'document-library',
      component: () => import('@/view/document-manage/document-library/index'),
      meta: {title: '公文库', power: [1],code: '6060000'},
    },
    {
      path: 'document-his',
      name: 'document-his',
      component: () => import('@/view/document-manage/document-his/index'),
      meta: {title: '上传文件库', power: [1],code: '6070000'},
    },
  ]
}

export default documentManage
