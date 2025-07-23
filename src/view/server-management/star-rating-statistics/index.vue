<template>
  <div class="star-rating-statistics">
    <el-tabs v-model="activeName">
      <el-tab-pane label="星级分数统计" name="first">
        <cor-box :height="carHeight">
          <satr-summary></satr-summary>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="民主评分统计" name="second" lazy>
        <cor-box :height="carHeight">
          <democracy-summary></democracy-summary>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div> 
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import satrSummary from './satr-summary/index'
import democracySummary from './democracy-summary/index'
export default {
  name: "star-rating-statistics",
  components: {
    corBox,
    satrSummary,
    democracySummary,
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
.star-rating-statistics {
  width: 100%;
  height: 100%;
}
</style>
