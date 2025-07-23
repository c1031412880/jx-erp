<template>
  <el-card class="notice-box">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-3.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          公司公告
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
    <div class="notice-content" style="height: 100%;">
      <!-- <el-tabs v-model="activeName">
        <el-tab-pane name="1" label="未读" lazy>
          <div class="item-content" style="width: 100%; height: 310px; overflow: auto">
            <el-skeleton v-if="loading1" />
            <template v-else>
              <el-empty
                v-if="!unReadData.length"
                :image="placeholderImage"
                :image-size="100"
              ></el-empty>
              <table-box
                v-else
                :data="unReadData"
                :agency="true"
                @show-preview="checkRowInfo"
              ></table-box>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2" label="已读" lazy>
          <div class="item-content" style="width: 100%; height: 310px; overflow: auto">
            <el-skeleton v-if="loading2" />
            <template v-else>
              <el-empty
                v-if="!unReadData.length"
                :image="placeholderImage"
                :image-size="100"
              ></el-empty>
              <table-box
                v-else
                :data="readData"
                :agency="true"
                @show-preview="checkRowInfo"
              ></table-box>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs> -->
      <div class="item-content" style="width: 100%; height: 100%; overflow: auto">
        <el-skeleton v-if="loading2" />
        <template v-else>
          <el-empty
            v-if="!unReadData.length"
            :image="placeholderImage"
            :image-size="160"
          ></el-empty>
          <table-box
            v-else
            :data="readData"
            :agency="true"
            @show-preview="checkRowInfo"
          ></table-box>
        </template>
      </div>
    </div>
    <div>
      <!-- 系统公告 -->
      <system-announcement-popup
        ref="systemAnnouncementPopup"
        :dialogBool.sync="systemAnnouncementPopupShow"
      ></system-announcement-popup>
      <!-- 公司公告 -->
      <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow"></info-dialog>
    </div>
  </el-card>
</template>

<script>
import { getUser, getSession } from '@/utils/auth'
import tableBox from '@/view/system-user/system-announcement-managemnet/component/company-announcement/table'
import infoDialog from '@/view/system-user/system-announcement-managemnet/component/company-announcement/info-dialog'
import systemAnnouncementPopup from '@/view/system-user/system-announcement-managemnet/component/system-announcement-popup'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
export default {
  name: 'notice-box',
  components: {
    tableBox,
    infoDialog,
    systemAnnouncementPopup
  },
  data() {
    return {
      token: getSession(),
      placeholderImage: placeholderImage,
      activeName: '1',
      loading1: false,
      loading2: false,
      dataMap: {
        1: [],
        2: []
      },
      systemAnnouncementPopupShow: false,

      readData: [],
      unReadData: [],
      infoDialogShow: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 查看全部
    lookRouter() {
      this.$router.push({
        name: 'system-announcement-managemnet',
        params: {
          activeName: 'third'
        }
      })
      console.log('查看全部',this.$router);
    },
    // 获取公司公告
    loadData() {
      this.loading1 = true
      this.loading2 = true
      let params = {
        is_read: 3,
        page_index: 1,
        page_size: 9999,
        user_id: JSON.parse(getUser()).user_id
      }
      this.readData = []
      this.unReadData = []
      this.$client.GetRecordCompanyMessage(params).then(res => {
        if (res.head.result == '200') {
          // this.data = res.context
          if (res.context && res.context.length) {
            this.readData = [...res.context]
            this.unReadData = [...res.context]
            // res.context.forEach(item => {
            //   if (item.is_read == 1) {
            //     this.readData.push(item)
            //   } else {
            //     this.unReadData.push(item)
            //   }
            // })
          } else {
            this.readData = []
            this.unReadData = []
          }
          this.loading1 = false
          this.loading2 = false
        } else {
          this.readData = []
          this.unReadData = []
          this.loading1 = false
          this.loading2 = false
        }
      })
    }, 
    // 查看
    checkRowInfo(row) {
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
        this.$client
          .AddSignCompanyMessage(params)
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
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: 'error'
            })
          })
    },
    // 获取通知通告
    reqNoticeMessage(state) {
      if (state === 1) {
        this.loading1 = true
      } else {
        this.loading2 = true
      }
      let params = {
        page_index: 1,
        page_size: 15,
        state: state,
        type: 3,
        model_ids: [10000]
      }
      this.$client.ListMessageCenter(params).then(req => {
        if (req.head.result === '200') {
          // this.data = req.context.list
          this.dataMap[String(state)] = req.context.list
          if (state === 1) {
            this.loading1 = false
          } else {
            this.loading2 = false
          }
        } else {
          this.dataMap[String(state)] = []
        }
      })
    },
    // 点击消息弹窗公告弹窗
    onclick(item) {
      // console.log(item)
      this.$client.ReadMessageMessageCenter({ context: [item.id] }).then(() => {
        if (!!item.object_id) {
          this.reqLatestSysVersion(item.object_id)
        }
        // 刷新未读消息
        if (item.state === 1) {
          this.reqNoticeMessage(1)
          this.reqNoticeMessage(2)
        }
      })
    },
    // 查询公告详情
    reqLatestSysVersion(id) {
      this.$client
        .GetDetailSysVersion({ id: id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              this.markedRead(res.context)
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
    },
    // 公告标记为已读
    markedRead(info) {
      let params = {
        context: [info.id]
      }
      this.$client.AddSignSysVersion(params).then(res => {
        if (res.head.result == '200') {
          this.$refs.systemAnnouncementPopup.setData(info)
          this.systemAnnouncementPopupShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.notice-box {
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
  /deep/ .el-empty {
    height: 100%;
  }
  /deep/ .el-card__body {
    height: calc(100% - 50.67px);
    padding: 12px 20px * $NumWidth;
  }
  /deep/ .table .table-div .table-box .table-content .table-title .tabel-agency {
    font-size: 14px;
  }
  /deep/ .table .table-div .table-box .agency-cover .table-title {
    line-height: 18px;
  }
  /deep/ .table .table-div .table-box .table-content .table-text p {
    font-size: 13px;
    color: #666;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .table .table-div .table-box .agency-cover .table-img {
    height: 100%;
    width: 100%;
  }
  /deep/ .table .table-div .table-box .table-content .table-subscript {
    font-size: 14px;
    color: #666;

    & span:first-child {
      display: none;
    }
  }
  /deep/ .table .table-div .table-box .table-content .table-text,
  /deep/ .table .table-div .table-box .table-cover {
    display: none;
  }
  /deep/ .table .table-div .table-box .table-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  /deep/ .table .table-div .table-box .table-content .table-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /deep/ .table .table-div {
    border: none;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0;
    padding: 0;
  }
  /deep/ .table .table-div .table-box .table-content .table-subscript {
    margin-left: 10px;
  }
  /deep/ .table .table-div .table-box .table-content {
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #f56c6c;
      margin-right: 10px;
      position: relative;
      top: 2px;
    }
    &.is_read {
      &::before {
        display: none;
      }
    }
  }
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>
