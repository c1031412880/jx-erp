<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{tag.title}}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <div class="all-close" @click="closeAllTags" >关闭所有</div>
  </div>
</template>

<script>
  import ScrollPane from '@/components/ScrollPane'
  import { deepCopy } from '@/utils/index'
  export default {
    components: { ScrollPane },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {}
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      },
      tagsView() {
        return this.$store.state.tagsView
      }
    },
    watch: {
      $route() {
        this.addViewTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addViewTags()
    },
    methods: {
      isActive(route) {
        return route.path === this.$route.path
      },
      addViewTags() {
        // 缓存 解决刷新获取不到的问题
        let historyObj = JSON.parse(sessionStorage.getItem('routerObj'))
        let routerObj = JSON.stringify(this.$store.state.sidebarMain.newRoutesMain) === '{}' ? historyObj : this.$store.state.sidebarMain.newRoutesMain
        let historyRouterObj = deepCopy(routerObj)
        sessionStorage.setItem('routerObj',JSON.stringify(historyRouterObj))
        let first = this.$route
        // console.log(first, 'addViewTags');
        if (first.meta.code) {
          let obj = routerObj[first.meta.code]
          if (obj) {
            first.meta.title = obj.meta.title
          }
        }
        let obj = {}
        for (let k in first) {
          if (k !== 'matched' && k !== 'components') {
            obj[k] = first[k]
          }
        }
        this.$store.dispatch('addView', obj)
        return false
      },
      moveToCurrentTag() {
        this.$nextTick(() => {
          const tags = this.$refs.tag
          console.log(tags)
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      refreshSelectedTag(view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          const { fullPath } = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            const latestView = visitedViews.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView)
            } else {
              this.$router.push('/')
              if (view.title === '监测台') {
                this.addViewTags()
              }
            }
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
        if (this.$route.path === '/dashboard') {
          this.addViewTags()
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }
        this.top = e.clientY

        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    display: flex;
    height: 32px;
    width: 100%;
    //box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .12), 0 0 1px 0 rgba(0, 0, 0, .04);
    .all-close{
      width: 80px;
      height: 26px;
      line-height: 26px;
      font-size: 12px;
      text-align: center;
      background: #C61D29;
      border-radius: 2px 2px 2px 2px;
      margin-top: 3px;
      color: #fff;
      cursor: pointer;
    }
    .tags-view-wrapper {
      flex: 1;
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        //border: 1px solid #d8dce5;
        color: #495060;
        background: #F5F5F9;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 3px;
        &:first-of-type {
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          background-color: #FEF6F7;
          color: #C61D29;
          &::before {
            content: '';
            background: #C61D29;
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #C61D29;
          color: #fff;
        }
      }
    }
  }
</style>
