import Layout from "../../layout/Layout";

const outerLinkManagementRouter = {

    path: '/outer-link-main',
    component: Layout,
    name: '/outer-link-main',
    meta: {
      title: '外链系统',
      icon: '/outer-link-main',
      power: [1],
      code: '5000000',
    },
    children: [
      {
        path: 'https://www.56gps.cn/OnlineStudy/web/index.html',
        name: 'OnlineStudy',
        meta: { title: '精准在线学习系统',
          // icon: 'OnlineStudy',
          power: [1],code: '5010000',},
      },
      {
        path: 'http://122.228.7.74:7003/web/#/login',
        name: 'OnlineStudy',
        meta: { title: '电子站牌管理系统',
          // icon: 'OnlineStudy',
          power: [1],code: '5020000',},
      },
      {
        path: 'https://sugar.aipage.com/dashboard/4c21ba40da3456bb75da21b84a7b7763',
        name: 'ServiceQualityMonitoring',
        component: () => import('@/view/server-management/lost-find/index'),
        meta: {title: '服务质量监控大屏', power: [1], code: '7040000'}
      },
      {
        path: 'https://sugar.aipage.com/dashboard/e3374099152351dfb7a54d18c08d7cad',
        name: 'PingyangPassengerFlow',
        meta: { title: '平阳客流展示大屏', power: [1],code: '8030000',},
      },
      {
        path: 'http://122.228.7.74:7908/dist/#/dashboard',
        name: 'PassengerGuideScreenManagement',
        meta: { title: '导乘屏管理', power: [1],code: '4200000',},
      },
    ],
}

export default outerLinkManagementRouter
