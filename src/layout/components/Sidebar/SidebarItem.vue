<template>
  <div v-if="!item.hidden && isSidebarShow(item) && getPower(item)" class="menu-wrapper">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            v-if="onlyOneChild.meta"
            :icon="onlyOneChild.meta.icon || item.meta.icon"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>
      <template v-for="(child, i) in item.children" v-if="!child.hidden && getPower(child)">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
        <app-link v-else :to="resolvePath(child.path)" :key="child.name + i">
          <el-menu-item :index="resolvePath(child.path)" @click="csol">
            <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { getRoleIds } from '@/utils/auth'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    csol() {
      console.log(this.$route.matched)
    },
    hasOneShowingChild(children, parent) {
      if (!children) {
        this.onlyOneChild = parent
        return true
      }
      const showingChildren = children.filter(item => {
        if (item.hidden && !this.getPower(item)) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      // console.log('菜单路径', routePath)
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      // return path.resolve(this.basePath, routePath)
      return routePath
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    isSidebarShow(item) {
      if (window.sidebarShow) {
        try {
          if (item.meta.title) {
            return window.sidebarShow(item.meta.title)
          } else {
            return true
          }
        } catch (e) {
          return true
        }
      } else {
        return true
      }
    },
    getPower(to) {
      try {
        if (!to.meta) {
          return true
        }
        let arr = to.meta.power || undefined
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            if (this.isPower(arr[i]) === true) {
              return true
            }
          }
          return false
        }
        return true
      } catch (e) {
        return true
      }
    },
    isPower(key) {
      if (getRoleIds()) {
        if (getRoleIds().indexOf(key) > -1) {
          return true
        } else {
          return false
        }
      }
      return false
    }
  }
}
</script>

<style lang="stylus">
.menu-wrapper>.el-submenu>.el-submenu__title{
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
}
</style>
