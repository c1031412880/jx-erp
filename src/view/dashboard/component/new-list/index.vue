<template>
  <div class="new-list">
    <el-skeleton v-if="loading" class="news-content" />
    <template v-else>
      <div v-if="data.length" class="news-content">
        <div class="content-left">
          <el-carousel indicator-position="none" :interval="5000">
            <el-carousel-item v-for="item in imgList" :key="item.id">
              <el-image
                :src="item.url"
                :fit="'fill'"
                style="height: 100%; width: 100%"
                @click="openRowNewInfo(item)"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <ul class="content-right">
          <li
            class="content-item"
            v-for="item in data"
            :key="item.id"
            @click="openRowNewInfo(item)">
            <div class="item-left">
              <div :class="{ icon: true, is_read: item.is_read }"></div>
              <el-tooltip class="item" effect="dark" :content="pageName === 'new' ? item.title : item.grassroots_title" placement="left">
                <div class="item-title">
                  {{ pageName === 'new' ? item.title : item.grassroots_title }}
                </div>
              </el-tooltip>
            </div>
            <div class="item-right">{{ setSendTime(item.send_time) }}</div>
          </li>
        </ul>
      </div>
      <el-empty v-else :image="placeholderImage" :image-size="85"></el-empty>
    </template>
  </div>
</template>

<script>
import { getUser, getSession } from '@/utils/auth'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
export default {
  name: 'new-list',
  props: {
    pageName: {
      type: String,
      default: 'new'
    }
  },
  data() {
    return {
      data: [],
      imgList: [],
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
    setSendTime(time) {
      if(!time) return ''
      return time.slice(0,11)
    },
    loadData() {
      this.loading = true
      let params = { context: {} }
      params.context.page_index = 1
      params.context.page_size = 15
      params.context.state = 2
      this.$client.GetErpNewManageHomePageSimple(params).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context.list ? res.context.list : []
          this.imgList = []
          this.data.forEach(item => {
            if (item.home_page) {
              let obj = {
                id: item.id,
                url: item.image_url,
              }
              this.imgList.push(obj)
            }
          })
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
      let type = this.pageName
      let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=${type}`
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
      this.$client.AddNewReadErpNewManage(params).then(res => {
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
.new-list {
  width: 100%;
  height: 100%;
  .news-content {
    height: 100%;
    width: 100%;
    display: flex;
    
    .content-left {
      width: 350px * $NumWidth;
      height: 215px * $NumWidth;
      /deep/ .el-carousel {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    .content-right {
      flex: 1;
      overflow: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      padding-left: 15px * $NumWidth;
      .content-item {
        display: flex;
        align-items: center;
        padding: 11px * $NumWidth;
        justify-content: space-between;
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
            color: #333333;
            font-weight: 500;
            width: 280px * $NumWidth;
            font-size: 14px * $NumWidth;
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
            font-family: Source Han Sans CN, Source Han Sans CN;
          }
        }
        .item-right {
          flex: 0 0 65px * $NumWidth;
          flex-shrink: 0;
          font-size: 12px * $NumWidth;
          font-weight: 400;
          color: #666666;
        }
      }
    }
  }
  .content-empty {
    justify-content: center;
  }
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>

