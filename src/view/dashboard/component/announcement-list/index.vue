<template>
  <div class="announcement-list">
    <el-skeleton v-if="loading" class="announcement-content" />
    <template v-else>
      <ul class="announcement-content" v-loading="loading" v-if="data.length">
        <li 
          class="content-item"
          v-for="item in data"
          :key="item.id"
          @click="openRowNewInfo(item)">
          <div class="item-box">
            <div class="item-left">
              <div :class="{ icon: true, is_read: item.is_read }"></div>
              <el-tooltip class="item" effect="dark" :content="item.title" placement="left">
                <div class="item-title">{{ item.title }}</div>
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
import { getUser, getSession } from '@/utils/auth'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
export default {
  name: 'announcement-list',
  data() {
    return {
      data: [],
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
    // 获取公司公告
    loadData() {
      this.loading = true
      let params = {
        is_read: 3,
        page_index: 1,
        page_size: 15,
        user_id: this.userId
      }
      this.$client.GetRecordCompanyMessage(params).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context ? res.context : []
          // this.data = [
          //   {
          //     id: 0,
          //     title: '暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告',
          //     send_time: '2025-05-06',
          //     is_read: true
          //   },
          //   {
          //     id: 1,
          //     title: '暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告',
          //     send_time: '2025-05-06',
          //     is_read: true
          //   },
          //   {
          //     id: 2,
          //     title: '暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告',
          //     send_time: '2025-05-06',
          //     is_read: true
          //   },
          //   {
          //     id: 3,
          //     title: '暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告',
          //     send_time: '2025-05-06',
          //     is_read: true
          //   },
          //   {
          //     id: 4,
          //     title: '暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告',
          //     send_time: '2025-05-06',
          //     is_read: true
          //   },
          //   {
          //     id: 5,
          //     title: '暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告暂无公告',
          //     send_time: '2025-05-06',
          //     is_read: true
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
    openRowNewInfo(row) {
      let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=company`
        window.open(url, '_blank')
      if (!row.is_read) {
        this.setNewsRead(row.id)
      }
    },
    setNewsRead(id) {
      let params = {
        context: [id]
      }
      this.$client.AddSignCompanyMessage(params)
        .then(res => {
          if (res.head.result == '200' || res.head.result == '201') {
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
.announcement-list {
  width: 100%;
  height: 100%;
  .announcement-content {
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    .item-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px * $NumWidth;
      &:hover {
        cursor: pointer;
        background: #f2f6fc;
        border-radius: 3px;
      }
      .item-left {
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
          width: 240px * $NumWidth;
          color: #333333;
          font-weight: 500;
          font-size: 14px * $NumWidth;
          white-space: nowrap; /* 规定文本是否折行 */
          overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
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
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>