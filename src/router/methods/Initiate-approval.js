import Layout from "../../layout/Layout";
import Blank from "./router-view";


const InitiateApprovalRouter = {
  path: '/main-Interface-entrance',
  name: 'main-Interface-entrance',
  component: Layout,
  // alwaysShow: true,
  meta: {
    title: '审批管理',
    icon: 'all-box',
    power: [1],
    code: '999999',
  },
  children: [
    {
      path: '/launch-affair',
      name: 'launch-affair',
      component: () => import('@/view/main-Interface-entrance/launch-affair/index'),
      meta: {title: '待办事项', power: [1],code: '9999990300'},
    }

  ]
}

export default InitiateApprovalRouter