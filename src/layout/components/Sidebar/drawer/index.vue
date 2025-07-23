<template>
  <el-drawer
    direction="ltr"
    :visible="visible"
    append-to-body
    size="95%"
    :before-close="handleClose"
  >
    <template slot="title">
      <div class="top">
        <div class="top-left">
          <el-input
            ref="searchInput"
            size="mini"
            v-model="searchKeys"
            placeholder="请输入搜索关键字"
            prefix-icon="el-icon-search"
            @input="searchMenuList"
            clearable
          ></el-input>
        </div>
        <div class="top-right" v-if="commonUseData.length">
          <div class="top-right-title">常用模块：</div>
          <div class="top-right-list">
            <div
              class="top-right-list-item"
              v-for="item in commonUseData"
              :key="item.name"
              @click="itemClick(item)"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="content">
      <div class="container">
        <div class="menu" v-for="menu in menuRoutes" :key="menu.path">
          <div class="menu-title">{{ menu.meta.title }}</div>
          <template v-if="menu.children && menu.children.length">
            <menu-item
              v-for="item in menu.children"
              :key="item.path"
              :item="item"
              :level="1"
              @item-click="itemClick"
            />
          </template>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import menuItem from './menu-item.vue'
import commonMenuUse from '@/mixin/common-menu-use.js'
export default {
  components: { menuItem },
  mixins: [commonMenuUse],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    Routes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchKeys: '',
      menuRoutes: []
    }
  },
  watch: {
    visible(bool) {
      if (bool) {
        this.getCommonUseData()
        this.menuRoutes = this.Routes.filter(x => x.name && x.children && x.meta && x.meta.title)
        this.$nextTick(() => {
          this.$refs.searchInput.focus()
        })
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    itemClick(data) {
      if (data.children && data.children.length) return
      if (this.$route.name === data.name) {
        this.handleClose()
        return
      } 
      this.setCommonUseData({
        name: data.name,
        title: data.title || data.meta.title
      })
      this.handleClose()
      this.$router.push({
        name: data.name
      })
    },
    // 路由关键字搜索
    searchMenuList(value) {
      // 匹配路由
      this.menuRoutes = this.matchingRoute(
        value,
        this.Routes.filter(x => x.name && x.children && x.meta && x.meta.title)
      )
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
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__header {
  padding: 20px;
  margin-bottom: 0;

  .top {
    width: 100%;
    height: 100%;
    display: flex;

    &-left {
      width: 200px;
      height: 100%;
    }

    &-right {
      flex: 1;
      margin-left: 20px;
      line-height: 30px;
      font-size: 13px;
      display: flex;
      color: #000;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      &-title {
        height: 100%;
        font-weight: 900;
        margin-right: 10px;
      }

      &-list {
        flex: 1;
        display: flex;
        gap: 10px;

        &-item {
          color: #000;
          font-weight: 300;
          padding-right: 10px;
          cursor: pointer;
          position: relative;

          &:hover {
            color: #a31e30;
          }

          &::after {
            content: '';
            width: 1px;
            height: 13px;
            background-color: #cbcacd;
            position: absolute;
            top: 8.5px;
            right: 0;
          }

          &:last-child::after {
            background-color: transparent;
          }
        }
      }
    }
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 40px;
  overflow: auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 20px;

    .menu {
      width: 200px;
      height: 100%;
      flex-shrink: 0;

      &-title {
        width: 100%;
        height: 20px;
        font-size: 16px;
        font-weight: 600;
        color: #373737;
        text-indent: 20px;
        border-left: 1px solid #cbcacd;
        position: relative;

        &::before {
          content: '';
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #c61d29;
          position: absolute;
          left: -8px;
          top: 0;
        }

        &::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #fff;
          top: 6px;
          left: -0.5px;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
