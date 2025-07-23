<template>
  <div class="employee-promotion-statistics">
    <el-tabs v-model="activeName">
      <el-tab-pane label="员工分数汇总" name="first" lazy>
        <cor-box :height="carHeight">
          <score-summary></score-summary>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="员工分数明细" name="second" lazy>
        <cor-box :height="carHeight">
          <score-details></score-details>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="部门宣传汇总" name="third" lazy v-if="$isPowerShow('dept')">
        <cor-box :height="carHeight">
          <dept-summary></dept-summary>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import scoreSummary from './component/score-summary/index'
import scoreDetails from './component/score-details/index'
import deptSummary from './component/dept-summary/index'
export default {
  name: "employee-promotion-statistics",
  components: {
    corBox,
    scoreSummary,
    scoreDetails,
    deptSummary
  },
  data() {
    return {
      activeName:"first",
      carHeight: 500,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    // 计算表格高度 和初始化表头
    setHead() {
      this.carHeight = this.$el.offsetHeight - 55
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.employee-promotion-statistics {
  width: 100%;
  height: 100%;
}
</style>
