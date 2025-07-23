<template>
  <div class="app-list">
    <div class="content-left" v-if="dataList.length">
      <el-scrollbar
        ref="scrollContainer"
        :vertical="false"
        class="scroll-container"
        @wheel.native.prevent="handleScroll"
      >
        <div class="item-list" v-for="item in dataList" :key="item.id" @click="openApp(item)">
          <safe-image
            :imgUrl="item.image"
            :authToken="token"
            @click="handleClick(item)"
          ></safe-image>
          <span>{{ item.name }}</span>
        </div>
      </el-scrollbar>
    </div>
    <div class="content-left" v-else>
      <div class="item-list">
        <el-image :src="require('@/assets/home-image/common-1.png')"></el-image>
        <span>您还没有添加快速通呦~</span>
      </div>
    </div>
    <div class="all-btn">
      <el-button type="text" @click="lookRouter">
        查看全部
        <i class="el-icon-arrow-right"></i>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>

    <div class="dialog-div">
      <all-app-list ref="allAppList" :dialogBool.sync="isShowAllAppList"></all-app-list>
    </div>
  </div>
</template>

<script>
import { getUser, getSession } from '@/utils/auth'
import allAppList from './component/all-app-list'
import safeImage from '@/components/image-box/component/safe-image'
export default {
  components: { allAppList, safeImage },
  data() {
    return {
      dataList: [],
      isShowAllAppList: false,
      token: ''
    }
  },
  mounted() {
    this.token = getSession()
    this.loadData()
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },
    // 获取用户快速通道
    loadData() {
      let user_id = Number(JSON.parse(getUser()).user_id)
      let params = { user_id: user_id }
      this.$client.GetUserFastMenuSysMenu(params).then(res => {
        if (res.head.result == '200') {
          this.dataList = res.context
        } else {
          this.$message({ message: res.head.describle, type: 'error' })
        }
      })
    },
    // 查看全部
    lookRouter() {
      this.$router.push({
        path: '/app-list'
      })
    },
    openApp(val) {
      window.open(val.url, '_blank')
    },
    handleClick(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.app-list {
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 10px * $NumWidth 20px * $NumWidth;
  .content-left {
    flex: 1;
    display: flex;
    overflow-x: auto;
    margin-right: 20px * $NumWidth;
    scrollbar-width: thin;
    scrollbar-color: #9f9f9f #fcfcfc;
    /deep/ .el-scrollbar__view {
      display: flex;
    }
    /deep/ .el-scrollbar__bar {
      opacity: 0;
    }
    .item-list {
      display: flex;
      justify-content: center;
      align-items: center;
      width: fit-content;
      padding: 5px * $NumWidth 10px * $NumWidth;
      margin: 0 20px * $NumWidth 0 0;
      &:hover {
        cursor: pointer;
        border-radius: 3px;
        transform: scale(1.02);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        background-color: #f2f6fc;
      }
      /deep/ .el-image {
        height: 20px * $NumWidth;
        width: 20px * $NumWidth;
        flex-shrink: 0;
        margin-right: 5px * $NumWidth;
        border-radius: 3px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.075);
      }
      span {
        flex: 1;
        white-space: nowrap;
        font-size: 14px * $NumWidth;
        line-height: 20px * $NumWidth;
        font-weight: 400;
        margin: 0 10px * $NumWidth;
        white-space: nowrap; /* 规定文本是否折行 */
        overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
        text-overflow: ellipsis;
      }
    }
  }
  .all-btn > .el-button--text {
    font-size: 16px * $NumWidth;
    .el-icon-arrow-right:nth-last-child(1) {
      margin-left: -10px * $NumWidth;
    }
  }
  ::-webkit-scrollbar {
    height: 3px * $NumWidth;
    background-color: #fcfcfc;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px * $NumWidth;
    height: 3px * $NumWidth;
    background-color: #9f9f9f;
  }
}
</style>
