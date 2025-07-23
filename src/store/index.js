import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import sidebarMain from './modules/sidebarMain'
// import formDesignStore from './modules/formDesign'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    sidebarMain,
    // formDesignStore
  },
  getters,
  state,
  mutations,
  // strict: debug,
  plugins: debug ? [createLogger()] : [],
})
