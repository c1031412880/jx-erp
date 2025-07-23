const sidebarMain = {
  state: {
    newRoutesMain: {},
    todoCount: 0, // 代办数量
    newCount: 0 //消息数量
  },
  mutations: {
    SET_NEW_ROUTES_MAIN: (state, keysObj) => {
      state.newRoutesMain = keysObj
    },
    SET_TODO_COUNT: (state, keysObj) => {
      state.todoCount = keysObj
    },
    SET_NEW_COUNT: (state, keysObj) => {
      state.newCount = keysObj
    }
  },
  actions: {
    SetNewRouterMain: ({ commit }, keysObj) => {
      commit('SET_NEW_ROUTES_MAIN', keysObj)
    },
    SetTodoCount: ({ commit }, keysObj) => {
      commit('SET_TODO_COUNT', keysObj)
    },
    SetNewCount: ({ commit }, keysObj) => {
      commit('SET_NEW_COUNT', keysObj)
    }
  }
}

export default sidebarMain
