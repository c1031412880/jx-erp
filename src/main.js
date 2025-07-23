// VUE主体
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'

//UI组件库
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import dataCenter from 'data-center'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import 'element-ui/lib/theme-chalk/index.css';
import '@/components/DynamicForm/styles/index.styl'
import '@/../static/css/global.css'       /*引入公共样式-全局样式*/
// 引入中台样式
import 'data-center/components/styles/index.scss'
import 'data-center/components/styles/global.scss'
import '@/icons' // icon
import '@/permission' // permission control
import 'babel-polyfill'
//复文本应用
// import '../static/ueditor/ueditor.config.js'
// import '../static/ueditor/ueditor.all.js'
// import '../static/ueditor/lang/zh-cn/zh-cn.js'
// import '../static/ueditor/ueditor.parse.min.js'
// import '../static/ueditor/ueditor_custom'

import 'xe-utils'
import _ from 'lodash'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
VXETable.setup({zIndex: 3000});
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
// VXETable.use(VXETablePluginExportXLSX)

// 依赖组件
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import VueClipboard from 'vue-clipboard2'

// 全局函数应用
import {chunk,outFormData} from './utils/index'
import {EventChange} from "./utils/EventChange"; // 添加全局事件通信
import mapDistrict from  './utils/mapDistrict' // 获取地区编码
import {handleTableSpan} from "components/tableHeadercustomSetting/util"; // 添加全局表格合并
import httpTableHeader from "components/tableHeadercustomSetting/httpTableHeader"; // 添加获取表头
import {SignalDom} from './signalr/index'
// import {PrintTemplate} from './utils/print'
import{Base64}from'js-base64'

// 全局组件注入
import trTable from 'components/tableHeadercustomSetting/tr-table'
import trVxeTable from 'components/tableHeadercustomSetting/tr-vxe-table'
import trDialog from 'components/tr-dialog/index'
import customSetting from 'components/tableHeadercustomSetting/custom-setting'
import trPageHeader from 'components/PageHeader'
import getSelectDictionaries from 'components/base/formModel/select/get-select-dictionaries'
import FormControls from './components/FormControls/index.js'
import httpRequest from "./api/http-api";
import reportApi from './api/reportApi'
import dispatchingRequest from './api/dispatchingSystem/methods'


// VUE配置项
Vue.config.productionTip = false

// 组件注入
Vue.use(ElementUI)
Vue.use(dataCenter)
Vue.use(VueClipboard)
Vue.use(VXETable)
Vue.component('tr-vxe-table', trVxeTable)
Vue.component('tr-table',trTable)
Vue.component('tr-dialog',trDialog)
Vue.component('custom-setting',customSetting)
Vue.component('tr-page-header',trPageHeader)
Vue.component('tr-select-dictionaries', getSelectDictionaries)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.use(FormControls)

// 函数注册
Vue.prototype.$moment = moment
Vue.prototype.$chunk = chunk
Vue.prototype.$client = httpRequest
Vue.prototype.$dispatch = dispatchingRequest
Vue.prototype.$reportApi = reportApi
Vue.prototype.log = console.log
Vue.prototype.$mapDistrict = new mapDistrict()
Vue.prototype.$Base64 = Base64
window.eventOn = new EventChange()
window.SignalDom = new SignalDom()
Vue.prototype.$isPowerShow = powerKey => {
  let routerObj = v_vue.$store.state.sidebarMain.newRoutesMain[v_vue.$route.meta.code]
  if(!routerObj) {
    return
  }
  let isPower = false;
  if(!!routerObj.menu_func && routerObj.menu_func.length > 0) {
    routerObj.menu_func.forEach(element => {
      let code = element.code.split('.')[1]
      if(powerKey == code) {
        isPower = true
      }
    });
  }
  return isPower
}
Vue.prototype.$addTime = ((arr = []) => {
  if (arr.length) {
    if (arr[1].indexOf(':') === -1) {
      return [arr[0],arr[1] + ' 23:59:59']
    } else {
      return arr
    }
  }
  return arr
})
Vue.prototype.$outFormData = outFormData
Vue.prototype.$handleTableSpan = handleTableSpan
Vue.prototype.$httpTableHeader = httpTableHeader
// Vue.prototype.$PrintTemplate = PrintTemplate
// VUE主体注册
/* eslint-disable no-new */
const v_vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount( '#app' )
