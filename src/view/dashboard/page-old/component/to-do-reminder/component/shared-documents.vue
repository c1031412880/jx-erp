<template>
  <div class="shared-documents">
    <el-skeleton v-if="loading" />
    <div
      style="width: 100%; height: 100%"
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
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      data: [],
      loading: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
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
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.shared-documents {
  width: 100%;
  height: 100%;
  .content-box {
    height: 100%;
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