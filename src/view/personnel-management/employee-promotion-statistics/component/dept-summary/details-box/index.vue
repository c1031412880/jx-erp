<template>
  <div class="details-box">
    <div style="display: flex;align-items:center;margin-bottom:10px">
      <div>
        <span>当前部门:</span>
        <span style="margin:0 15px;color:red">{{dept_name}}</span>
      </div>
      <div>
        <span>日期范围:</span>
        <span style="margin:0 15px;color:red">{{start_date + '至' + end_date}}</span>
      </div>

      <el-button type="primary" @click="onExport()" size="small" icon="el-icon-download">导出</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="录取篇数" name="first" lazy>
        <cor-box :height="carHeight">
          <admissions-table ref="admissions-table"></admissions-table>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="上报篇数" name="second" lazy>
        <cor-box :height="carHeight">
          <escalation-table ref="escalation-table"></escalation-table>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import admissionsTable from './component/admissions-table'
import escalationTable from './component/escalation-table'
import {formatDate} from "@/utils/index"
export default {
  name: "details-box",
  components: {
    corBox,
    admissionsTable,
    escalationTable,
  },
  data() {
    return {
      activeName:"first",
      carHeight: 500,
      form: {},
      dept_name: '',
      start_date: '',
      end_date: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(params) {
      this.dept_name = params.dept_name
      this.start_date = params.start_date
      this.end_date = formatDate(params.end_date,'yyyy-MM-dd')

      this.activeName = 'first'
      this.form = params
      this.$refs['admissions-table'].onSubmit(this.form)
    },
    handleClick() {
      if (this.activeName == 'first') {
        this.$nextTick(() => {
          this.$refs['admissions-table'].onSubmit(this.form)
        })
      } else {
        this.$nextTick(() => {
          this.$refs['escalation-table'].onSubmit(this.form)
        })
      }
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.carHeight = this.$el.offsetHeight - 55
    },
    onExport() {
      if (this.activeName == 'first') {
        this.$refs['admissions-table'].onExport()
      } else {
        this.$refs['escalation-table'].onExport()
      }
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.details-box {
  width: 100%;
  height: 100%;
}
</style>
