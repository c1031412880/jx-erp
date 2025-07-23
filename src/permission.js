import router from './router'
import {constantRouterMap} from './router'
import Layout from '@/layout/Layout'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getUser, getRoleIds } from '@/utils/auth' // 验权

const whiteList = [
  '/login', 
  '/fill-submit-form',
  '/change-password', 
  '/documentView', 
  'news-core',
  '/login_noToken'] // 不重定向白名单
let obj = null
router.beforeEach((to, from, next) => {
  // 只适用三级目录  更多级需另外优化
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name == 'Blank') {
        to.matched.splice(i, 1)
      }
    }
  }
  NProgress.start()
  handleKeepAlive(to)
  if (updateDate() === true) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      return false
    }
    if (to.path === '/login') {
      next({ path: '/' })
      return false
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (to.path !== '/') {
       // outLiveRouter(to)
      }
      // 通知详情
      if (to.name === 'news-details') {
        to.meta.title = to.params.title
      }
      // handleKeepAlive(to)
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          console.log('用户')
          next()
          return false
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
            return false
          })
        })
      } else {
        getPowerIs(to, next)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      return false
    } else {
        // 如果是中台免登的  退回中台
      if (JSON.parse(localStorage.getItem('FreeLogin'))) {
        let url = localStorage.getItem('centerUrl')
        window.location.href = url
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        return false
        NProgress.done()
      }
    }
  }
})

function handleKeepAlive(to) {
  console.log('长度', to)
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length;i++) {
      const element = to.matched[i]
      console.log('单个',element)
      if (element.components.default.name === 'Blank') {
        to.matched.splice(i, 1)
        handleKeepAlive(to)
      }
    }
  }
}

function outLiveRouter(to) {
  let collection = {
    path: '/collection-live',
    component: Layout,
    meta: {
      icon: 'warehouse-management',
      title: '收藏',
      power: [1]
    },
    children: []
  }
  outRouterConfig(constantRouterMap, to)
  collection.children.push(obj)
  if (obj) {
    router.addRoute(collection)
    console.log('配置', collection,router.getRoutes())
  }
}

function outRouterConfig(routers,toObj) {
  let bool = true
  router.getRoutes().forEach(item => {
    if (item.path.indexOf('collection') > -1) {
      bool = false
    }
  })
  if (!bool) {
    return false
  }
  routers.forEach(item => {
    if (item.name === toObj.name) {
      item.path = item.path + '-live'
      obj = item
      console.log(obj)
    } else {
      if (item.children) {
        outRouterConfig(item.children, toObj)
      }
    }
  })
}

function getPowerIs(to, next) {
  console.log(to)
  if (to.meta) {
    let arr = to.meta.power
    if (arr) {
      console.log(arr)
      for (let i =0; i< arr.length;i++) {
        if (isPower(arr[i])) {
          next()
          NProgress.done()
          return false
        }
      }
      next({ path: '/401' })
      NProgress.done()
    } else {
      next({ path: '/' })
      NProgress.done()
    }
  } else {
    next({ path: '/' })
    NProgress.done()
  }
}

// 验证权限
function isPower(key) {
  if (getRoleIds()) {
    if (getRoleIds().indexOf(key) > -1) {
      return true
    } else {
      return false
    }
  }
  return false
}

function updateDate() {
  let date = new Date().getTime()
  date = date - 24 * 60 * 60 * 1000
  if (getUser()) {
    if (JSON.parse(getUser()).date) {
      date = JSON.parse(getUser()).date
    } else {
      return false
    }
  } else {
    return false
  }
  let d1 = new Date()
  if (d1 > date) {
    return false
  }else {
    return true
  }
}

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
