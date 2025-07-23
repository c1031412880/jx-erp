<template>
  <div class="base-list">
    <el-skeleton v-if="loading" class="base-content" />
    <template v-else>
      <ul class="base-content" v-loading="loading" v-if="data.length">
        <li
          class="content-item"
          v-for="item in data"
          :key="item.id"
          @click="checkRowInfo(item)">
          <div class="item-left">
            <el-image :src="item.image_url ? item.image_url : bgImg" :fit="'fill'"></el-image>
          </div>
          <div class="item-right">
            <div class="item-right-left">
              <div :class="{ icon: true, is_read: item.is_read }"></div>
              <el-tooltip class="item" effect="dark" :content="item.grassroots_title" placement="left">
                <div class="item-title">{{ item.grassroots_title }}</div>
              </el-tooltip>
            </div>
            <div class="item-time">{{ item.send_time }}</div>
          </div>
        </li>
      </ul>
      <el-empty v-else :image="placeholderImage" :image-size="85"></el-empty>
    </template>
  </div>
</template>

<script>
import bgImg from "@/assets/notice-image/bj.png"
import { getUser, getSession } from '@/utils/auth'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
export default {
  name: 'base-list',
  data() {
    return {
      data: [],
      bgImg: bgImg,
      loading: false,
      token: getSession(),
      placeholderImage: placeholderImage,
      userId: Number(JSON.parse(getUser()).user_id),
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      let params = { context: {} }
      params.context.page_index = 1
      params.context.page_size = 15
      params.context.state = 2
      this.$client.GetHomeErpGrassrootsDynamics(params).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context.list ? res.context.list : []
          // this.data = [
          //   {
          //     id: 0,
          //     image_url: '',
          //     is_read: 0,
          //     send_time: '2025-01-01',
          //     grassroots_title: '草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态',
          //   },
          //   {
          //     id: 2,
          //     image_url: '',
          //     is_read: 0,
          //     send_time: '2025-01-01',
          //     grassroots_title: '草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态',
          //   },
          //   {
          //     id: 3,
          //     image_url: '',
          //     is_read: 0,
          //     send_time: '2025-01-01',
          //     grassroots_title: '草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态草根动态',
          //   },
          // ]
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查看
    checkRowInfo(row) {
      let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=dynamic`
      window.open(url, '_blank')
      if (row.is_read == 0) {
        this.setNewsRead(row.id)
      }
    },
    // 新闻已读
    setNewsRead(id) {
      let params = { context: {} }
      params.context.id = id
      params.context.user_id = this.userId
      this.$client.AddNewReadErpGrassrootsDynamics(params).then(res => {
        this.isShowAddNews = false
        if (res.head.result == '200') {
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.base-list {
  width: 100%;
  height: 100%;
  .base-content {
    height: 100%;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    .content-item {
      display: flex;
      padding: 6px * $NumWidth;
      &:hover {
        cursor: pointer;
        background: #f2f6fc;
        border-radius: 3px;
      }
      .item-left {
        margin-right: 15px * $NumWidth;
        .el-image {
          width: 86px * $NumWidth;
          height: 57px * $NumWidth;
          flex-shrink: 0;
          border-radius: 3px;
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.075);
        }
      }
      .item-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-right-left {
          display: flex;
          align-items: center;
          .icon {
            width: 8px * $NumWidth;
            height: 8px * $NumWidth;
            background: #f56c6c;
            margin-right: 10px * $NumWidth;
            flex-shrink: 0; // 确保在 flex 布局中不被压缩
          }
          .is_read {
            width: 8px * $NumWidth;
            height: 8px * $NumWidth;
            background: #ffffff;
            margin-right: 10px * $NumWidth;
            flex-shrink: 0; // 确保在 flex 布局中不被压缩
          }
          .item-title {
            width: 150px * $NumWidth;
            color: #333333;
            font-weight: 500;
            font-size: 14px * $NumWidth;
            line-height: 18px * $NumWidth;
            display: -webkit-box; /* 使用旧版弹性盒子模型 */
            -webkit-box-orient: vertical; /* 内容垂直排列 */
            -webkit-line-clamp: 3; /* 显示的最大行数 */
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: Source Han Sans CN, Source Han Sans CN;
          }
        }
        .item-time {
          flex-shrink: 0;
          font-size: 12px * $NumWidth;
          font-weight: 400;
          flex: 0 0 65px * $NumWidth;
          color: #666666;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>