<template>
  <div class="launch-affair">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发起审批" name="发起审批">
        <cor-box :height="carHeight">
          <new-approve></new-approve>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="全部" name="全部" v-if="isShow || $isPowerShow('all')" lazy>
        <cor-box :height="carHeight">
          <table-data :isState="true" loadKey="getListFlowRecord"></table-data>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="待处理" name="待处理" key="daichuli" lazy>
        <cor-box :height="carHeight">
          <table-data loadKey="getWaitFlowRecord"></table-data>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="已处理" key="yichuli" lazy>
        <cor-box :height="carHeight">
          <table-data  :isState="true" loadKey="getFinishFlowRecord"></table-data>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="已发起" name="已发起" key="yifaqi" lazy>
        <cor-box :height="carHeight">
          <table-data :isState="true" loadKey="getSubmitFlowRecord"></table-data>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="抄送我的" name="抄送我的" key="chaosongwode" lazy>
        <cor-box :height="carHeight">
          <table-data loadKey="GetCopyFlowRecord"></table-data>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我的草稿" name="我的草稿" key="wode草稿" lazy>
        <cor-box :height="carHeight">
          <base-demo loadKey="GetMyMarkFlowRecord"></base-demo>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我的标记" name="我的标记" key="wodebiaoji" lazy>
        <cor-box :height="carHeight">
          <table-data loadKey="GetMyMarkFlowRecord"></table-data>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="审批单统计" name="审批单统计" key="shenpidantongji" v-if="isShowStatistics || $isPowerShow('statistics')" lazy>
        <cor-box :height="carHeight">
          <table-statistics></table-statistics>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import corBox from './component/cor-box'
  import baseDemo from './component/base-demo'
  import newApprove from './component/all-box/new-approve'
  import tableData from './component/tableData'
  import tableStatistics from './component/table-statistics'
  export default {
    name: "launch-affair",
    components: {corBox, baseDemo, tableData, newApprove, tableStatistics},
    data() {
      return {
        activeName: '发起审批',
        carHeight: 400,
        pending: 0,
        unread: 0,

        isShow: false,
        isShowStatistics: false,
      }
    },
    created() {
    },
    activated() {
      let activeName = this.$route.params.activeName
      if (activeName) {
        this.activeName = activeName
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.setBoxHeight()
      })
      let activeName = this.$route.params.activeName
      if (activeName) {
        this.activeName = activeName
      }
      window.eventOn.$on('update-todo', () => {
        this.activeName = '待处理'
      })
    },
    methods: {
      // 通过切换页签的时候  将页面权限存下来
      handleClick() {
        this.isShow = this.$isPowerShow('all')
        this.isShowStatistics = this.$isPowerShow('statistics')
      },
      setBoxHeight() {
        this.carHeight = this.$el.offsetHeight - 55
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.launch-affair{
  width 100%
  height 100%
}
</style>
