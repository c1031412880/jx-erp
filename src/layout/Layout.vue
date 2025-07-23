<template>
  <div :class="classObj" class="app-wrapper">
    <navbar ref="navbar" @menuSelect="menuSelect" @show-drawer="showDrawer" />
    <div class="app-wrapper-main">
      <div
        v-if="device === 'mobile' && sidebar.opened"
        class="drawer-bg"
        @click="handleClickOutside"
      />
      <sidebar ref="sidebar" @set-root-routes="setRootRoutes" class="sidebar-container" />
      <div class="main-container">
        <tags-view></tags-view>
        <app-main />
        <!--      <footer-tool></footer-tool>-->
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, FooterTool } from './components'
import ResizeMixin from './mixin/ResizeHandler'
// import {signalDom} from "./signalr";

// const signalDomDD = new signalDom()
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    FooterTool
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    setRootRoutes(routes, menuRoutes) {
      console.log('routes', routes)
      console.log('menuRoutes', menuRoutes)
      this.$refs.navbar.routerList = routes
      this.$refs.navbar.menuRoutes = menuRoutes
    },
    menuSelect(path) {
      console.log('path', path)
      if(path == '/maintenance-management'){
        this.$router.push({
          name: 'maintenance-management',
          params: {
            activeName: '机务管理首页'
          }
        })
      }
      if(path == '/operational-analysis'){
        this.$router.push({
          name: 'operational-management',
          params: {
            activeName: '营运管理首页'
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.sidebar.menuSelect(path)
      })
    },
    showDrawer() {
      this.$refs.sidebar.showDrawer()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .app-wrapper-main {
    height: calc(100vh - 50px);
    width: 100%;
    position: relative;
  }
}
.drawer-bg {
  //background: #000;
  background: #dedfe3;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
