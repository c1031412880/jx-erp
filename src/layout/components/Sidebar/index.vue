<template>
  <div :class="{ 'has-logo': true }">
    <!--    <logo :collapse="isCollapse" />-->
    <div class="show-flex-box-r show-flex-center" style="padding: 5px" v-if="!isCollapse">
      <!-- <el-input
        v-if="!showUserBar"
        size="mini"
        v-model="searchKeys"
        placeholder="请输入搜索关键字"
        prefix-icon="el-icon-search"
        @input="searchMenuList"
        clearable
        style=""
      ></el-input> -->
      <div class="user-container">
        <div class="user-bar">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" />
          </div>
          <div class="text-wrapper">
            <span>{{ getUserInfos('user_name', '') }}</span>
          </div>
          <div class="text-wrapper dept-name">
            <span>{{ getUserInfos('dept_name', '') }}</span>
          </div>
          <div class="text-wrapper dept-name">
            <span>职务：{{ getUserInfos('position_name', '') }}</span>
          </div>
          <div
            :class="{ 'text-wrapper': true, 'dept-name': true, 'has-click': todoCount }"
            @click="goTodo"
          >
            <span>待办事项：</span>  
            <span :class="{ 'has-todo': todoCount }">{{ todoCount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-scrollbar style="height: calc(100vh - 270px)" wrap-class="scrollbar-wrapper">
      <el-menu
        v-if="showUserBar"
        mode="vertical"
        :unique-opened="true"
        :collapse-transition="true"
        background-color="#242729"
        text-color="#e6e4e1"
        active-text-color="red"
        :default-openeds="['1']"
        @select="commonUseSelect"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>常用功能</span>
          </template>
          <el-menu-item v-for="item in commonUseData" :index="item.name" :key="item.name">
            {{ item.title }}
          </el-menu-item>
        </el-submenu>
      </el-menu>

      <el-menu
        v-else
        ref="sidebarMenu"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        :unique-opened="true"
        :collapse-transition="true"
        background-color="#242729"
        text-color="#e6e4e1"
        active-text-color="red"
        :default-openeds="defaultOpeneds"
      >
        <sidebar-item
          v-for="(route, i) in currentRoutes"
          :key="`${route.path}${i}`"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <Drawer ref="drawer" :visible.sync="drawerVisible" :Routes="newRoutes" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
import Item from './Item'
import Drawer from './drawer/index'
import { getUser } from '@/utils/auth'
import commonMenuUse from '@/mixin/common-menu-use.js'

export default {
  components: { Item, SidebarItem, Logo, Drawer },
  mixins: [commonMenuUse],
  data() {
    return {
      drawerVisible: false,
      defaultOpeneds: [],
      menuListMap: {},
      routesList: [],
      newRoutes: [],
      currentRoutes: [],
      navRoutes: [],
      allRoutes: [],
      routerKeyMap: {},
      searchKeys: '',
      routerList: [
        {
          path: '/new-approve',
          icon: 'all-box',
          name: '审批申请'
        }
      ],
      showUserBar: true,
      initCount: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'todoCount']),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    $route(val) {
      this.setCurrentRoutes()
      const noadd = ['Dashboard', 'launch-affair', 'news-details']
      if (!noadd.includes(val.name)) {
        this.setCommonUseData({
          name: val.name,
          title: val.title || val.meta.title
        })
        this.getCommonUseData()
      }
    }
  },
  created() {
    // this.loadData()
    // console.log(this.$router.options.routes)
    console.log('路由菜单', this.newRoutes)
    this.loadDataCenter()
    this.getCommonUseData()
  },
  mounted() {
    this.$nextTick(() => {
      window.SignalDom.on('AppWaitCount', res => {
        this.$store.dispatch('SetTodoCount', res.msg)
      })
      if(!this.initCount) {
        try {
          let params = {
            page_index: 1,
            page_size: 1000
          }
          this.$client.getWaitFlowRecord(params).then(res => {
            let num = res.context.total ? res.context.total : 0
            this.$store.dispatch('SetTodoCount', num)
            this.initCount = true
          })
        } catch (error) {
          console.log(error)
        }
      }
    })
  },
  methods: {
    // 中台路由菜单接口
    loadDataCenter() {
      this.routesList = this.$router.options.routes
      this.bulidRoutesMap(this.routesList)
      let params = {
        tenant_id: window.newHttpConfig.TenantId,
        id: JSON.parse(getUser()).user_id,
        app_key: 'erp-web'
      }
      this.$client
        .getMunePermission(params)
        .then(res => {
          if (res.errcode === 200) {
            let menuList = res.data[0].trees
            this.bulidRoutes(menuList, this.addRouter)
            if (this.newRoutes.length > 0) {
              this.bulidRouterKeyMap(this.newRoutes)
              this.$store.dispatch('SetNewRouterMain', this.routerKeyMap)
            }
            this.setRootRoutes()
            this.setCurrentRoutes()

            // 消息通信
            // 解决一下 部分页面查询接口  需要用到权限 参数
            eventOn.$emit('update-router')
            window.hasRouter = true
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    setRootRoutes() {
      const menuRoutes = this.newRoutes.filter(x => x.name && x.children && x.meta && x.meta.title)
      const navRoutes = menuRoutes.map(item => {
        if (item.children.length == 1 && !item.children[0].children) {
          const sigle = item.children[0]
          return {
            path: sigle.path.includes('/') ? sigle.path : `${item.path}/${sigle.path}`,
            name: item.children[0].meta.title
          }
        } else {
          return {
            path: item.path,
            name: item.meta.title
          }
        }
      })
      navRoutes.unshift({
        path: '/dashboard',
        name: '首页'
      })
      this.navRoutes = navRoutes
      this.$emit('set-root-routes', navRoutes, menuRoutes)
    },
    setCurrentRoutes() {
      const menuRoutes = this.newRoutes.filter(x => x.name && x.children && x.meta && x.meta.title)
      const list = this.filterMenuRoutes(menuRoutes, x => this.$route.path.includes(x.path))
      if (!list.length) {
        this.showUserBar = true
        this.currentRoutes = []
        this.setSideBarState()
        return
      }
      const rootpath = list[0].path
      const item = this.navRoutes.find(item => item.path == rootpath)
      if (item) {
        this.menuSelect(item.path)
      } else {
        this.showUserBar = true
        this.currentRoutes = []
        this.setSideBarState()
      }
    },
    menuSelect(path) {
      const selectRoute = this.newRoutes.find(item => item.path == path)
      // console.log(selectRoute, 'selectRoute')
      if (selectRoute) {
        this.currentRoutes = selectRoute.children
        this.showUserBar = false
      } else {
        this.showUserBar = true
        this.$router.push(path)
        this.currentRoutes = []
      }
      this.allRoutes = [...this.currentRoutes]
      this.setSideBarState()
    },
    setSideBarState() {
      if (this.sidebar.opened) return
      // const actionsKey = this.currentRoutes.length ? 'OpenSideBar' : 'CloseSideBar'
      const actionsKey = 'OpenSideBar'
      this.$store.dispatch(actionsKey, { withoutAnimation: false })
    },
    filterMenuRoutes(data, predicate) {
      return data
        .map(node => {
          const newNode = { ...node }
          if (node.children) {
            newNode.children = this.filterMenuRoutes(node.children, predicate)
          }
          const isMatchingLeaf = !node.children && predicate(node)
          const hasMatchingDescendants = newNode.children && newNode.children.length
          return isMatchingLeaf || hasMatchingDescendants ? newNode : null
        })
        .filter(x => x)
    },
    // 构建路由对应页面权限库
    bulidRouterKeyMap(list) {
      list.forEach(item => {
        if (!!item.code) {
          if (!!item.menu_func && item.menu_func.length > 0) {
            this.routerKeyMap[item.code] = item
          }
          if (!!item.children && item.children.length > 0) {
            this.bulidRouterKeyMap(item.children)
          }
        }
      })
    },
    // 加载全部路由
    bulidRoutesMap(list) {
      list.forEach(item => {
        if (!!item.meta && !!item.meta.code) {
          this.menuListMap[item.meta.code] = {
            path: item.path,
            name: item.name,
            meta: item.meta,
            component: item.component,
            code: item.meta.code,
            hidden: item.hidden || false
          }
          if (item.alwaysShow) {
            this.menuListMap[item.meta.code].alwaysShow = item.alwaysShow
          }
          if (!!item.children && item.children.length > 0) {
            this.bulidRoutesMap(item.children)
          }
        }
      })
    },
    // 判断是否存在路由code
    isHasRouterCode(code) {
      return this.menuListMap.hasOwnProperty(code)
    },
    // 构建显示菜单路由
    bulidRoutes(list, callback) {
      list.forEach((item, index) => {
        if (!!item.code && this.isHasRouterCode(item.code)) {
          let routeObj = {}
          routeObj = this.menuListMap[item.code]
          // 更换第一级菜单名字 图标 等操作
          if (!!routeObj.meta) {
            routeObj.meta.title = item.name
          }
          if (!!item.menu_func && item.menu_func.length > 0) {
            routeObj.menu_func = item.menu_func
          }
          this.newRoutes.push(routeObj)
          typeof callback === 'function' && callback(item, routeObj)
        }
      })
    },
    // 构建显示菜单路由回调函数
    addRouter(item, routeObj) {
      if (item.type == 1 && !!item.child && item.child.length > 0) {
        // console.log(routeObj)
        routeObj.children = []
        item.child.forEach(obj => {
          if (!!obj.code && this.isHasRouterCode(obj.code)) {
            let secondRouteObj = this.menuListMap[obj.code]
            // 更换第一级下面所有字菜单名字 图标 等操作
            if (!!secondRouteObj.meta) {
              secondRouteObj.meta.title = obj.name
            }
            if (!!obj.menu_func && obj.menu_func.length > 0) {
              secondRouteObj.menu_func = obj.menu_func
            }

            if (!!obj.path) {
              secondRouteObj.path = obj.path
            }
            routeObj.children.push(this.menuListMap[obj.code])
            this.addRouter(obj, secondRouteObj)
          }
        })
      }
    },
    // 路由关键字搜索
    searchMenuList(value) {
      // console.log(value)
      // 匹配路由
      this.currentRoutes = this.matchingRoute(value, this.allRoutes)
    },
    matchingRoute(value, routesList) {
      let newRouterArr = []
      routesList.forEach(element => {
        if (!!element.meta && element.meta.title.indexOf(value) > -1) {
          newRouterArr.push(element)
        } else {
          if (!!element.children && element.children.length > 0) {
            let routeData = this.matchingRoute(value, element.children)
            if (routeData && routeData.length > 0) {
              let obj = {
                ...element,
                children: routeData
              }
              newRouterArr.push(obj)
            }
          }
        }
      })
      return newRouterArr
    },
    showDrawer() {
      this.drawerVisible = true
    },
    getUserInfos(key, noneVal) {
      if (getUser()) {
        return JSON.parse(getUser())[key] || noneVal
      }
      return noneVal
    },
    commonUseSelect(value) {
      this.$router.push({
        name: value
      })
    },
    goTodo() {
      if (!this.todoCount) return
      this.$router.push({
        name: 'launch-affair',
        params: {
          activeName: '待处理'
        }
      })
      // 当前页面是协同办公时，打开待处理页签
      if(this.$route.name === 'launch-affair') {
        window.eventOn.$emit('update-todo')
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-menu-item:hover {
  background: rgba(191,203,217,.1) !important;
}
.el-menu-item {
  width: 100%;
}
.el-menu--horizontal>.el-menu-item {
  border-bottom: 0 !important;
}
.el-menu-item, .is-active {
  border-bottom: 0 !important;
}
.user-container{
  width: 100%;

  .user-bar {
    width: 100%;
    height: 200px;
    text-align: center;

    .avatar-wrapper{
      width: 100%;
      height: 50px;
      margin: 10px 0 0 0;
      img{
        height: 100%;
      }
    }

    .text-wrapper{
      font-size: 18px;
      color: #e6e4e1;
      margin-top: 20px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dept-name{
      font-size: 13px;
    }

    .has-click{
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;

      .has-todo{
        border-radius: 10px;
        color: #FFF;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        line-height: 16px;
        padding: 0 6px;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #FFF;
        background-color: #F56C6C;
      }
    }

  }
}
</style>
