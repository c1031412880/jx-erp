<template>
  <el-card class="salary-sheet">
    <div slot="header" class="clearfix">
      <span>工资条</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="() => this.activeName = '发放记录'">发放记录</el-button>
    </div>
    <div :style="{height: contentHeight + 'px'}" class="content">
      <importWages
        v-if="activeName === '工资条'"></importWages>
      <payrollDetail
        v-else-if="activeName === '发放记录'"
        @on-back="() => this.activeName = '工资条'"
        @on-detail="onPayrollDetail"></payrollDetail>
      <payrollRecord
        :main_id="this.main_id"
        v-else-if="activeName === '发放详情'"
        @on-back="() => this.activeName = '发放记录'"></payrollRecord>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import importWages from './import-wages/index'
import payrollDetail from './payroll-detail/index'
import payrollRecord from './payroll-record/index'
export default {
  name: "salary-sheet",
  components: {
    importWages,
    payrollDetail,
    payrollRecord
  },
  mounted() {
    this.setHead();
    window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
      this.setHead()
    })
  },
  data() {
    return {
      activeName: '工资条',
      contentHeight: 500,
      main_id: ''
    }
  },
  methods: {
    // 查看发放详情
    onPayrollDetail(id) {
      this.main_id = id
      this.activeName='发放详情'
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.contentHeight = maxh - 99;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.salary-sheet {
  height: 100%;
  width: 100%;
  padding: 0
}

.content {
  width: 100%
}

/deep/ .el-card__body {
  width: 100%;
}
</style>
