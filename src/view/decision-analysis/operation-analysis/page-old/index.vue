<template>
  <div class="operation-analysis">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按线路汇总" name="lineSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <line-summary></line-summary>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按车辆汇总" name="vehicleSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <vehicle-summary></vehicle-summary>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import lineSummary from "./component/line-summary";
import vehicleSummary from "./component/vehicle-summary";
export default {
  name: "operation-analysis",
  components: {lineSummary,vehicleSummary},
  data() {
    //这里存放数据",
    return {
      activeName: 'lineSummary',
      boxHeight: 400,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  //方法集合",
  methods: {
    handleClick(tab) {

    },
    setHeight() {
      console.log(this.$el)
      this.boxHeight = this.$el.offsetHeight - 55
    }
  },
}
</script>

<style lang="scss" scoped>
.operation-analysis{
  width: 100%;
  height: 100%;
}
</style>
