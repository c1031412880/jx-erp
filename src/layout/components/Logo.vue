<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!--<svg-icon icon-class="login" class="sidebar-logo" v-if="logo"/>-->
        <!--<svg-icon icon-class="login" style="margin-right: 5px;width: 20px;height: 20px;"/>-->
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <!--        <h1 v-else class="sidebar-title">{{ title }} </h1>-->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <!--<svg-icon icon-class="login" class="sidebar-logo" v-if="logo"/>-->
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
    <!--    <el-input-->
    <!--      v-if="!collapse"-->
    <!--      placeholder="请输入内容"-->
    <!--      prefix-icon="el-icon-search"-->
    <!--      v-model="routerTitle">-->
    <!--    </el-input>-->
  </div>
</template>

<script>
import logo from '@/assets/bg/logo.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '综合信息管理系统',
      logo: logo,
      routerTitle: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  //background: #1d1e23;
  //border-bottom: 1px solid #101117;
  //border-right: 1px solid #101117;
  // background: #fff;
  background: #242729;
  //border-bottom: 1px solid #fff;
  //border-right: 1px solid #fff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 50px;
    width: 100%;

    & .sidebar-logo {
      width: auto;
      height: 20px;
      vertical-align: middle;
      margin-right: 5px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      // color: #333333;
      color: #e6e4e1;
      //color: #f6ca9d;
      font-weight: 500;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin: 9px;
    }
  }
}
</style>
