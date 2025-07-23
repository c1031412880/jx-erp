<template>
  <div class="assessment-statistics">
    <el-tabs v-model="activeName">
      <el-tab-pane label="月度汇总表" name="first">
        <cor-box :height="carHeight">
          <monthly-summary></monthly-summary>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="月度总分汇总表" name="second" lazy>
        <cor-box :height="carHeight">
          <monthly-total-summary ref="appealBox"></monthly-total-summary>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="季度汇总表" name="third" lazy>
        <cor-box :height="carHeight">
          <quarterly-summary ref="appealBox"></quarterly-summary>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="季度总分汇总表" name="fourth" lazy>
        <cor-box :height="carHeight">
          <quarterly-total-summary ref="appealBox"></quarterly-total-summary>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="年度汇总表" name="fifth" lazy>
        <cor-box :height="carHeight">
          <annual-summary ref="appealBox"></annual-summary>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import monthlySummary from './monthly-summary/index'
import monthlyTotalSummary from './monthly-total-summary/index'
import quarterlySummary from './quarterly-summary/index'
import quarterlyTotalSummary from './quarterly-total-summary/index'
import annualSummary from './annual-summary/index'
export default {
  name: "assessment-statistics",
  components: {
    corBox,
    monthlySummary,
    monthlyTotalSummary,
    quarterlySummary,
    quarterlyTotalSummary,
    annualSummary
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
.assessment-statistics {
  width: 100%;
  height: 100%;
}
</style>
