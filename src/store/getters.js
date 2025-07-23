// export const troubleTree = state => state.troubleTree
// export const remarkBtn = state => state.remarkBtn
// export const repairTree = state => state.repairTree
// export const repairRemarkBtn = state => state.repairRemarkBtn
// export const kindTree = state => state.kindTree
// export const kindAddBtn = state => state.kindAddBtn
// export const kindUserBtn = state => state.kindUserBtn
// export const kindTreeRefresh = state => state.kindTreeRefresh
// export const kindInfoEdit = state => state.kindInfoEdit
// export const troubleTreeRefresh = state => state.troubleTreeRefresh
// export const repairTreeRefresh = state => state.repairTreeRefresh
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  troubleTree: state => state.troubleTree,
  remarkBtn: state => state.remarkBtn,
  repairTree: state => state.repairTree,
  repairRemarkBtn: state => state.repairRemarkBtn,
  kindTree: state => state.kindTree,
  kindAddBtn: state => state.kindAddBtn,
  kindUserBtn: state => state.kindUserBtn,
  kindTreeRefresh: state => state.kindTreeRefresh,
  kindInfoEdit: state => state.kindInfoEdit,
  troubleTreeRefresh: state => state.troubleTreeRefresh,
  repairTreeRefresh: state => state.repairTreeRefresh,
  newRoutesMain: state => state.sidebarMain.newRoutesMain,
  todoCount: state => state.sidebarMain.todoCount,
  newCount: state => state.sidebarMain.newCount,
  sidebarMain: state => state.sidebarMain
  // alarmReq: state => state.alarmConfig.alarmReq
}
export default getters
