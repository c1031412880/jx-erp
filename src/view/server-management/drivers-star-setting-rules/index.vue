<template>
  <div class="drivers-star-setting-rules">
    <el-tabs v-model="activeName">
      <el-tab-pane label="升星规则" name="first">
        <cor-box :height="carHeight">
          <rising-star-rule></rising-star-rule>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="降星规则" name="second" lazy>
        <cor-box :height="carHeight">
          <descending-star-rule></descending-star-rule>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="驾驶员星级情况" name="third" lazy>
        <cor-box :height="carHeight">
          <star-rating-situation></star-rating-situation>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="先进驾驶员" name="fourth" lazy>
        <cor-box :height="carHeight">
          <advanced-driver></advanced-driver>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import risingStarRule from './component/rising-star-rule'
import descendingStarRule from './component/descending-star-rule'
import starRatingSituation from './component/star-rating-situation'
import advancedDriver from './component/advanced-driver'
export default {
  name: "drivers-star-setting-rules",
  components: {
    corBox,
    risingStarRule,
    descendingStarRule,
    starRatingSituation,
    advancedDriver
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
.drivers-star-setting-rules {
  width: 100%;
  height: 100%;
}
</style>
