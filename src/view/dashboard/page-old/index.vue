<template>
  <div class="dashboard-container">
    <!-- 快速通道 -->
    <el-row :gutter="10">
      <el-col :span="24">
        <app-list></app-list>
      </el-col>
    </el-row>
    <el-row style="height: calc(40% - 20px);" :gutter="10">
      <el-col :span="12">
        <!-- 常用功能 -->
        <!--        <menu-box></menu-box>-->
        <!-- 新闻管理 -->
        <news-box :pageName="'new'"></news-box>
      </el-col>
      <el-col :span="6">
        <!-- 基层动态 -->
        <news-box :pageName="'dynamic'"></news-box>
      </el-col>
      <el-col :span="6">
        <!-- 通知通告 -->
        <notice-box></notice-box>
      </el-col>
    </el-row>
    <el-row style="height: calc(60% - 30px);" :gutter="10">
      <el-col :span="12">
        <!-- 待审批事项 -->
        <pending-approval></pending-approval>
      </el-col>
      <el-col :span="12">
        <!-- 工作事项 -->
        <to-do-reminder></to-do-reminder>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10">
      <el-col :span="8">
        包车通知
        <charter-notice></charter-notice>
      </el-col>
      <el-col :span="8">
        通讯录
        <address-book></address-book>
      </el-col>
      <el-col :span="8">
        共享文件
        <shared-documents></shared-documents>
      </el-col>
    </el-row> -->
    <!-- <el-row :gutter="10">
      <el-col :span="14">
        工作提醒
        <schedule-message></schedule-message>
      </el-col>
      <el-col :span="10">
        待审批公文
        <pending-approval-document></pending-approval-document>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import appList from './component/app-list'
import menuBox from './component/menu-box'
import pendingApproval from './component/pending-approval'
import pendingApprovalDocument from './component/pending-approval-document'
import scheduleMessage from './component/schedule-message'
import noticeBox from './component/notice-box'
import newsBox from './component/news-box'
import sharedDocuments from './component/shared-documents'
import addressBook from './component/address-book'
import toDoReminder from './component/to-do-reminder'
import charterNotice from './component/charter-notice/index'

export default {
  name: 'dashboard',
  components: {
    appList,
    menuBox,
    pendingApproval,
    pendingApprovalDocument,
    scheduleMessage,
    noticeBox,
    newsBox,
    sharedDocuments,
    addressBook,
    toDoReminder,
    charterNotice
  },
  data() {
    return {}
  },

  mounted() {},

  methods: {},
  watch: {}
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  // background-color: #d6e4f0;
  color: #303133;
  /deep/ .el-col {
    height: 100%;
  }
}
</style>
