import * as types from './muatation-types'
let hasCondition = ( state, formId, needIndex = false ) => {
  let index = state.processConditions.findIndex( d => d.formId === formId )
  return needIndex ? index : index > -1
}
const mutations = {
  [types.SET_TROUBLE_TREE](state, troubleTree) {
    state.troubleTree = troubleTree
  },
  [types.SET_REMARK_BTN](state, remarkBtn) {
    state.remarkBtn = remarkBtn
  },
  [types.SET_REPAIR_TREE](state, repairTree) {
    state.repairTree = repairTree
  },
  [types.SET_REPAIR_REMARK_BTN](state, repairRemarkBtn) {
    state.repairRemarkBtn = repairRemarkBtn
  },
  [types.SET_KIND_TREE](state, kindTree) {
    state.kindTree = kindTree
  },
  [types.SET_KIND_ADD_BTN](state, kindAddBtn) {
    state.kindAddBtn = kindAddBtn
  },
  [types.SET_KIND_USER_BTN](state, kindUserBtn) {
    state.kindUserBtn = kindUserBtn
  },
  [types.SET_KIND_TREE_REFRESH](state, kindTreeRefresh) {
    state.kindTreeRefresh = kindTreeRefresh
  },
  [types.SET_KIND_INFO_EDIT](state, kindInfoEdit) {
    state.kindInfoEdit = kindInfoEdit
  },
  [types.SET_TROUBLE_TREE_REFRESH](state, troubleTreeRefresh) {
    state.troubleTreeRefresh = troubleTreeRefresh
  },
  [types.SET_REPAIR_TREE_REFRESH](state, repairTreeRefresh) {
    state.repairTreeRefresh = repairTreeRefresh
  },
  //所有mutations中的方法的第一个参数一定是state变量，用来进行对state中的状态的操作
  //第二个参数是可选参数，用于调用该 mutations 方法的时候传参
  initPConditions ( state, data ) {
    state.processConditions = data
  },
  addPCondition ( state, data ) {
    if ( data.formId === null || data.formId === undefined ) return
    if ( !hasCondition( state, data.formId ) ) {
      state.processConditions.unshift( data )
    }
  },
  delPCondition ( state, formId ) {
    if ( formId === null || formId === undefined ) return
    let index = hasCondition( state, formId, true )
    let cons = state.processConditions
    index > -1 && cons.splice( index, 1 )
  },
  //  * 清除所有的条件
  clearPCondition ( state ) {
    state.processConditions = []
  },
  updateFormItemList ( state, list ) {
    state.formItemList = list
  }
}

export default mutations
