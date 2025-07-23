<template>
  <el-card class="pending-approval">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-2.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          待审批事项
        </span>
      </div>
      <div class="header-right">
        <el-button type="text" style="padding: 5px 0" @click="lookRouter">
          查看全部
          <i class="el-icon-arrow-right"></i>
          <i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="filter-item">
        <el-select
          @change="loadData(activeName)"
          size="mini"
          v-model="form.state"
          clearable
          style="width: 100px;"
          v-if="activeName === 'getFinishFlowRecord'"
        >
          <el-option v-for="item in stateList" v-bind="item" :key="item.label + 'zt'"></el-option>
        </el-select>
        <el-input
          @change="loadData(activeName)"
          size="mini"
          v-model="form.content"
          placeholder="请输入关键字"
          style="width: 100px;"
          v-if="activeName !== 'ListMessageCenter'"
        ></el-input>

        <div v-else>
          <el-popconfirm title="确定标记所有记录为已读吗？" @confirm="read()">
            <el-button size="mini" type="text" slot="reference">一键已读</el-button>
          </el-popconfirm>
          <el-select @change="loadData(activeName)" style="width: 80px;" size="mini" v-model="infoForm.state" clearable>
            <el-option v-for="item in readList" v-bind="item" :key="item.label + 'zt'"></el-option>
          </el-select>
          <el-select @change="loadData(activeName)" style="width: 100px;" size="mini" v-model="infoForm.type" clearable>
            <el-option v-for="item in typeList" v-bind="item" :key="item.label + 'zt'"></el-option>
          </el-select>
        </div>
      </div>
      <el-tabs v-model="activeName" class="tab-box" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in listData"
          :key="i"
          :name="item.ref"
          :label="item.label"
          lazy
        >
          <span slot="label">
            <el-badge
              :value="item.ref === 'getWaitFlowRecord' ? todoCount : item.value"
              :hidden="item.ref === 'getWaitFlowRecord' ? !todoCount : !item.value"
              :max="99"
              class="item"
            >
              <span>{{ item.label }}</span>
            </el-badge>
          </span>
          <div class="content-tab">
            <el-skeleton v-if="dataObj[item.loadKey].loading" />
            <list-box
              v-else
              @on-click="detailsPush"
              @open-pending-approval-page="openPendingApprovalPage"
              :data="dataObj[item.loadKey].data"
              :loadKey="item.loadKey"
            ></list-box>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <!-- 系统公告弹窗 -->
      <system-announcement
        ref="systemAnnouncement"
        :dialogBool.sync="systemAnnouncementShow"
      ></system-announcement>
      <!-- 工作通知 -->
      <work-notice ref="workNotice" :dialogBool.sync="workNoticeShow"></work-notice>
      <!-- 公司公告 -->
      <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow"></info-dialog>
      <!-- 新闻信息 -->
      <new-dialog
        ref="newInfoDialog"
        :isAudit="false"
        :dialogBool.sync="isShowNewDialog"
      ></new-dialog>
    </div>
  </el-card>
</template>

<script>
import listBox from './component/list-box'
import modelObj from '@/view/main-Interface-entrance/news-core/modelObj.js'
import systemAnnouncement from '@/view/system-user/system-announcement-managemnet/component/system-announcement/system-announcement-popup'
import workNotice from '@/view/system-user/system-announcement-managemnet/component/work-notice/system-announcement-popup'
import infoDialog from '@/view/system-user/system-announcement-managemnet/component/company-announcement/info-dialog'
import newDialog from '@/view/main-Interface-entrance/news-management/component/new-dialog'
import routerModelMap from '../routerModelMap'
import { mapGetters } from 'vuex'
export default {
  name: 'pending-approval',
  components: {
    listBox,
    systemAnnouncement,
    workNotice,
    infoDialog,
    newDialog
  },
  data() {
    return {
      modelObj: modelObj,
      form: {
        content: '',
        state: '',
        type: ''
      },
      infoForm: {
        state: 1,
        type: ''
      },
      stateList: [
        { label: '全部', value: 0 },
        { label: '审批中', value: 1 },
        { label: '审批通过', value: 2 },
        { label: '审批拒绝', value: 3 },
        { label: '已撤销', value: 4 }
      ],
      typeList: [
        { label: '待办消息', value: 1 },
        { label: '到期消息', value: 2 },
        { label: '系统消息', value: 3 }
      ],
      readList: [
        { label: '未读', value: 1 },
        { label: '已读', value: 2 }
      ],
      activeName: 'getWaitFlowRecord',
      listData: [
        {
          label: '待办事项',
          ref: 'getWaitFlowRecord',
          loadKey: 'getWaitFlowRecord',
          value: ''
        },
        {
          label: '已处理',
          ref: 'getFinishFlowRecord',
          loadKey: 'getFinishFlowRecord',
          value: ''
        },
        {
          label: '已发起',
          ref: 'getSubmitFlowRecord',
          loadKey: 'getSubmitFlowRecord',
          value: ''
        },
        {
          label: '我的标记',
          ref: 'GetMyMarkFlowRecord',
          loadKey: 'GetMyMarkFlowRecord',
          value: ''
        },
        {
          label: '消息通知',
          ref: 'ListMessageCenter',
          loadKey: 'ListMessageCenter',
          value: ''
        }
      ],
      dataObj: {
        getWaitFlowRecord: {
          loading: false,
          data: []
        },
        getFinishFlowRecord: {
          loading: false,
          data: []
        },
        getSubmitFlowRecord: {
          loading: false,
          data: []
        },
        GetMyMarkFlowRecord: {
          loading: false,
          data: []
        },
        ListMessageCenter: {
          loading: false,
          data: []
        }
      },
      typeObj: {
        1: '待办消息',
        2: '到期消息',
        3: '系统消息'
      },
      routerModelMap,
      systemAnnouncementShow: false,
      workNoticeShow: false,
      infoDialogShow: false,
      isShowNewDialog: false
    }
  },
  computed: {
    ...mapGetters(['todoCount'])
  },
  mounted() {
    this.$nextTick(() => {
      this.listData.forEach(item => {
        this.loadData(item.loadKey)
      })
      // eventOn.$on('update-upcoming-matter', () => {
      //   this.listData.forEach(item => {
      //     this.loadData(item.loadKey)
      //   })
      // })
      setTimeout(() => {
        window.SignalDom.on('IsUnReadMessage', req => {
          this.listData[4].value = req.msg
          if (this.activeName == 'ListMessageCenter') this.handleClick()
        })
      }, 100)
    })
  },
  methods: {
    loadData(loadKey) {
      this.dataObj[loadKey].loading = true
      let params = {
        page_index: 1,
        page_size: 15
      }
      if (loadKey == 'ListMessageCenter') {
        params = Object.assign(params, this.infoForm)
      } else {
        for (let item in this.form) {
          if (this.form[item]) {
            params[item] = this.form[item]
          }
        }
      }
      // if (loadKey === 'getWaitFlowRecord') {
      //   params.form_id = [10, 20, 21, 50, 60, 70, 80, 90, 100, 110, 120]
      // }
      this.$client[loadKey](params).then(res => {
        this.dataObj[loadKey].loading = false
        if (res.head.result === '200') {
          this.dataObj[loadKey].data = res.context.list
          switch (loadKey) {
            case 'getWaitFlowRecord': //待办事项
              this.listData[0].value = res.context.total
              // this.$store.dispatch('SetTodoCount', res.context.total)
              break
            case 'ListMessageCenter': //消息通知
              this.listData[4].value = Number(res.file_id) ? res.file_id : ''
              break
            default:
              break
          }
        } else {
          this.dataObj[loadKey].data = []
        }
      })
    },
    // 详情跳转
    detailsPush(item) {
      // console.log(item);
      let object_id = this.activeName === 'ListMessageCenter' ? item.model : item.object_id
      let title = `${this.typeObj[item.type]}:${modelObj[object_id]}`
      if (!this.modelObj[object_id]) {
        this.$message.warning('未能处理该事项')
        return false
      }
      if (this.activeName === 'ListMessageCenter') {
        this.$client.ReadMessageMessageCenter({ context: [item.id] }).then(() => {})
      }
      // 如果有其他跳转就走配置路径
      if (this.routerModelMap[item.model]) {
        // 跳转路由
        if (!this.routerModelMap[item.model].isPopup) {
          let params = {}
          params[this.routerModelMap[item.model].model] = item.object_id
          this.$router.push({
            name: this.routerModelMap[item.model].router,
            params: params
          })
        } else {
          // 打开弹窗类型消息
          switch (item.model) {
            case 10000: //系统公告
            case 10001: //系统公告
            case 10002: //系统公告
              this.reqLatestSysVersion(item.object_id)
              break
            case 10005: //工作通知
              this.GetByIdWorkMessage(item.object_id)
              break
            case 10006: //公司公告
              this.GetByIdCompanyMessage(item.object_id)
              break
            case 10009: //新闻信息
              this.GetByIdNewsInfo(item.object_id)
              break
            default:
              break
          }
        }
      } else {
        // 多条记录对应一个流程  和  一条记录对应一流程
        let detail_id = ''
        switch (item.object_id) {
          case 110:
            detail_id =
              this.activeName === 'ListMessageCenter'
                ? item.object_id + '^&'
                : item.detail_ids + '^&'
            break
          default:
            detail_id = this.activeName === 'ListMessageCenter' ? item.object_id : item.detail_id
            break
        }
        this.$router.push({
          path: `/news-details/${detail_id}/${title}/${object_id}`
        })
      }
    },
    // 查询公告详情
    reqLatestSysVersion(id) {
      this.$client
        .GetDetailSysVersion({ id: id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              this.markedRead(info)
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
          this.$refs.systemAnnouncement.setData(info)
          this.systemAnnouncementShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查询工作通知详情
    GetByIdWorkMessage(id) {
      this.$client
        .GetByIdWorkMessage({ context: id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              this.AddSignWorkMessage(info)
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
    // 工作通知为已读
    AddSignWorkMessage(info) {
      let params = {
        context: info.id
      }
      this.$client.AddSignWorkMessage(params).then(res => {
        if (res.head.result == '200') {
          this.$refs.workNotice.setData(info)
          this.workNoticeShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查询公司公告详情
    GetByIdCompanyMessage(id) {
      this.$client
        .GetByIdCompanyMessage({ id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              this.AddSignCompanyMessage(info)
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
    // 公司公告为已读
    AddSignCompanyMessage(info) {
      let params = {
        context: [info.id]
      }
      this.$client.AddSignCompanyMessage(params).then(res => {
        if (res.head.result == '200') {
          this.$refs.infoDialog.setData(info)
          this.infoDialogShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查询新闻信息详情
    GetByIdNewsInfo(id) {
      let params = { context: {} }
      params.context.id = id
      this.$client
        .GetErpNewManage(params)
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context.list[0]
              this.loadData(this.activeName)
              this.$refs.newInfoDialog.setData(info)
              this.isShowNewDialog = true
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
    // // 新闻信息已读
    // AddSignNewsInfo(info) {
    //   let params = {
    //     context: [info.id]
    //   }
    //   this.$client.AddNewReadErpNewManage(params).then(res => {
    //     if (res.head.result == "200") {
    //       this.$refs.newInfoDialog.setData(info)
    //       this.isShowNewDialog = true;
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         message: res.head.describle,
    //         type: "error",
    //       });
    //     }
    //   })
    // },
    // 切换tab页清空查询条件
    handleClick() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.loadData(this.activeName)
    },
    // 查看全部
    lookRouter() {
      switch (this.activeName) {
        case 'getWaitFlowRecord':
          this.$router.push({
            name: 'launch-affair',
            params: {
              activeName: '待处理'
            }
          })
          break
        case 'getFinishFlowRecord':
          this.$router.push({
            name: 'launch-affair',
            params: {
              activeName: '已处理'
            }
          })
          break
        case 'getSubmitFlowRecord':
          this.$router.push({
            name: 'launch-affair',
            params: {
              activeName: '已发起'
            }
          })
          break
        case 'GetMyMarkFlowRecord':
          this.$router.push({
            name: 'launch-affair',
            params: {
              activeName: '我的标记'
            }
          })
          break
        case 'ListMessageCenter':
          this.$router.push({
            name: 'news-core'
          })
          break
        default:
          break
      }
    },
    // 打开发起审批事项
    openPendingApprovalPage() {
      this.$router.push({ path: '/launch-affair' })
    },
    // 已读
    read() {
      this.$client.ReadAllMessageMessageCenter({}).then(req => {
        this.loadData(this.activeName)
        if (req.head.result === '200') {
          this.listData[4].value = 0
          this.$message({
            message: req.head.describle,
            type: 'success'
          })
        } else {
          this.$message.error(req.head.describle)
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.pending-approval {
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
    padding: 6px 20px * $NumWidth 12px;
  }
  /deep/ .el-empty {
    padding: 20px 0;
  }
  .content-box {
    height: 100%;
    position: relative;
    .filter-item {
      position: absolute;
      right: 0;
      top: 6px;
      z-index: 999;
      display: flex;
      .el-button {
        margin-right: 5px * $NumWidth;
      }
      .el-input,
      .el-select {
        width: 160px * $NumWidth;
        margin-right: 5px * $NumWidth;
      }
    }
    /deep/ .el-tabs {
      height: 100%;
    }
    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
      padding: 0;
    }
    /deep/ .el-tab-pane {
      height: 100%;
      .content-tab {
        height: 100%;
        width: 100%;
      }
    }
    /deep/ .el-badge__content {
      top: 10px;
      right: 0;
      // padding: 0 2px;
    }
  }
}
</style>
