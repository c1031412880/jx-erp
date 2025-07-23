<template>
  <el-card class="news-box">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-4.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          {{pageName === 'new' ? '公司新闻' : '基层动态'}}
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
    <el-skeleton v-if="loading" class="news-content" />
    <template v-else>
      <div class="news-content" v-loading="loading" v-if="data.length">
        <div class="carousel-box" v-if="pageName === 'new'">
          <el-carousel height="404px">
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
            @click="openRowNewInfo(item)"
          >
            <div :class="{ icon: true, is_read: item.is_read }"></div>
            <el-tooltip class="item" effect="dark" :content="pageName === 'new' ? item.title : item.grassroots_title" placement="top-start">
              <div class="item-left">
                {{ pageName === 'new' ? item.title : item.grassroots_title }}
              </div>
            </el-tooltip>
            <div class="item-right">{{ setSendTime(item.send_time) }}</div>
          </li>
        </ul>
      </div>
      <div class="news-content content-empty" v-else>
        <el-empty :image="placeholderImage" :image-size="160"></el-empty>
      </div>
    </template>

    <new-dialog
      ref="newInfoDialog"
      :isAudit="false"
      :title="pageName === 'new' ? '新闻详情' : '基层动态详情'"
      :dialogBool.sync="isShowNewDialog"
    ></new-dialog>
  </el-card>
</template>

<script>
import { getUser, getSession } from '@/utils/auth'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
import newDialog from '../../../main-Interface-entrance/news-management/component/new-dialog'
export default {
  name: 'news-box',
  components: { newDialog },
  props: {
    pageName: {
      type: String,
      default: 'new'
    }
  },
  data() {
    return {
      token: getSession(),
      userId: Number(JSON.parse(getUser()).user_id),
      placeholderImage: placeholderImage,
      loading: false,
      isShowNewDialog: false,
      imgList: [
        // 'http://122.225.198.118:11066/wwwroot/Files/Enterprise/PartyConstruction/Images/1697788085微信图片_20230322201101.jpg',
        // 'http://122.225.198.118:11066/wwwroot/Files/Enterprise/PartyConstruction/Images/1697788090微信图片_20230322201127.jpg',
      ],
      data: [
        // {id: 1,title: '测试数据测试数据测试数据测试数据1',send_time: '1900-01-01 00:00:00'},
        // {id: 2,title: '测试数据测试数据测试数据测试数据2',send_time: '1900-01-01 00:00:00'},
      ]
    }
  },
  created() {
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
      let objHttp = {
        'new': 'GetErpNewManageHomePageSimple',
        'dynamic': 'GetHomeErpGrassrootsDynamics',
      }
      // params.context.is_read = 2
      this.$client[objHttp[this.pageName]](params).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context.list ? res.context.list : []
          // let arr = []
          // for(let i = 0; i < 10; i++) {
          //   let obj = {
          //     id: i,
          //     image_url: '@/assets/home-image/common-1.png',
          //     title: '测试数据测试数据测试数据测试数据测试数据测试数据测试数据1',
          //     grassroots_title: '嘉通交运集团2024年度先进集体、先进个人名单公示',
          //     send_time: '1900-01-01',
          //     home_page: true
          //   }
          //   arr.push(obj)
          // }
          // this.data = arr
          this.imgList = []
          this.data.forEach(item => {
            if (item.home_page) {
              let obj = {
                id: item.id,
                url: item.image_url
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
      // .catch(err => {
      //   this.loading = false;
      //   this.$message({
      //     showClose: true,
      //     message: err.body.message,
      //     type: "error",
      //   });
      // })
    },
    // 查看
    openRowNewInfo(row) {
      let type = this.pageName
      let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=${type}`
      window.open(url, '_blank')
      if (row.is_read == 0) {
        this.setNewsRead(row.id)
      }
        return
      if(this.pageName === 'new') {
        if (row.is_read == 0) {
          this.setNewsRead(row.id)
        }
        // this.openNewsInfo(row.id)
      } else {
        // this.$refs.newInfoDialog.setData(row)
        // this.isShowNewDialog = true
        if (row.is_read == 0) {
          this.setNewsRead(row.id)
        }
      }
    },
    // 新闻已读
    setNewsRead(id) {
      let params = { context: {} }
      params.context.id = id
      let userInfo = JSON.parse(getUser())
      params.context.user_id = Number(userInfo.user_id)
      let readHttp = {
        'new': 'AddNewReadErpNewManage',
        'dynamic': 'AddNewReadErpGrassrootsDynamics'
      }
      this.$client[readHttp[this.pageName]](params).then(res => {
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
    // 查看全部
    lookRouter() {
      let str = this.pageName === 'new' ? 'news-management' : 'base-dynamic'
      this.$router.push({
        path: '/news-information-management/' + str
      })
    },
    openNewsInfo(id) {
      let params = { context: {} }
      params.context.id = id
      let detailHttp = {
        'new': 'GetErpNewManage',
        'dynamic': 'GetErpGrassrootsDynamics'
      }
      this.$client[detailHttp[this.pageName]](params)
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context.list[0]
              this.$refs.newInfoDialog.setData(info)
              this.isShowNewDialog = true
              if (info.is_read == 0) {
                this.setNewsRead(info.id)
              }
            }
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.news-box {
  height: calc(100% - 10px);
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
    height: calc(100% - 50.67px);
    padding: 12px 20px * $NumWidth;
  }
  /deep/ .el-carousel__button {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .news-content {
    height: 100%;
    width: 100%;
    display: flex;
    // flex-direction: row;
    .carousel-box {
      margin-right: 20px * $NumWidth;
      width: 50%;
      height: 100%;
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
      
      .content-item {
        display: flex;
        align-items: center;
        padding: 11px 10px;
        border-bottom: 1px solid #ddd;
        &:hover {
          cursor: pointer;
          background: #f2f6fc;
          border-radius: 3px;
        }
        .icon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f56c6c;
          margin-right: 10px;
        }
        .is_read {
          display: none;
        }
        .item-right {
          flex: 0 0 90px;
          flex-shrink: 0;
          text-align: right;
          font-size: 14px;
          color: #666666;
        }
        .item-left {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          word-spacing: 0.725px;
          font-family: PingFang SC-Regular, PingFang SC;
          white-space: nowrap; /* 规定文本是否折行 */
          overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
          text-overflow: ellipsis;
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
