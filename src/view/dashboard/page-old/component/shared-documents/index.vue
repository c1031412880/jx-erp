<template>
  <el-card class="shared-documents">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-6.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          共享文件
        </span>
      </div>
      <div class="header-right">
        <el-button @click="lookRouter" type="text" style="padding: 5px 0">
          查看全部
          <i class="el-icon-arrow-right"></i>
          <i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    <el-skeleton v-if="loading" />
    <div
      style="width: 100%; height: 370px"
      class="show-flex-box-r show-flex-center"
      v-if="!data.length && !loading"
    >
      <el-empty :image="require('@/assets/home-image/placeholder-2.png')">
        <!-- <span slot="description">暂无数据</span> -->
      </el-empty>
    </div>
    <ul class="content-box" v-else>
      <li class="content-item" v-for="item in data" :key="item.id" @click="itemClick(item)">
        <div class="content-item-top">
          <!-- <div class="content-img"> -->
          <el-image :src="require('@/assets/home-image/common-3.png')"></el-image>
          <!-- </div> -->
          <div class="content">
            <div type="text" size="mini" class="content-title">{{ item.name }}</div>
            <div class="content-time">{{ item.created_date }}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </li>
    </ul>
  </el-card>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'shared-documents',
  data() {
    return {
      data: [],
      loading: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    // 查看全部
    lookRouter() {
      this.$router.push({
        path: '/download-center'
      })
    },
    // 加载数据
    loadData() {
      let form = {
        page_index: 1,
        page_size: 15,
      }
      this.loading = true
      this.$client.GetListDownloadCenter(form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context
        } else {
          this.data = []
        }
      })
    },
    // 打开i文档
    itemClick(item) {
      window.open(item.url)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.shared-documents {
  margin-top: 10px;
  /deep/ .el-card__header {
    padding: 12px 20px * $NumWidth;
    .clearfix {
      display: flex;
      justify-content: space-between;
      .header-left {
        display: flex;
        align-items: center;
        .el-image {
          flex-shrink: 0;
          margin-right: 10px * $NumWidth;
        }
      }
      .header-right {
        justify-content: end;
      }
    }
    .clearfix:after {
      content: none;
    }
  }
  /deep/ .el-card__body {
    padding: 6px 20px * $NumWidth 12px;
  }
  .content-box {
    height: 366px;
    width: 100%;
    .content-item {
      padding: 0 10px;
      width: 100%;
      &:hover {
        cursor: pointer;
        background: #f2f6fc;
        border-radius: 3px;
      }
      .el-divider {
        margin: 0;
      }
      .content-item-top {
        display: flex;
        width: 100%;
        align-items: center;
        margin-bottom: 7px;
        .el-image {
          margin-right: 10px;
        }
        .content {
          width: calc(100% - 26px); 
          .content-title {
            color: #409eff;
            line-height: 26px;
            font-size: 14px;
            font-weight: 400;
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
          }
          .content-time {
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
