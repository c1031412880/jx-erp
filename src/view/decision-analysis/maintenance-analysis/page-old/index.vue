<template>
  <div class="maintenance-analysis">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按车辆汇总" name="vehicleSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <vehicle-summary></vehicle-summary>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按线路汇总" name="lineSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <line-summary></line-summary>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按驾驶员汇总" name="driverSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <driver-summary></driver-summary>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import driverSummary from "./component/driver-summary";
import lineSummary from "./component/line-summary";
import vehicleSummary from "./component/vehicle-summary";
export default {
  name: "maintenance-analysis",
  components: {driverSummary,lineSummary,vehicleSummary},
  data() {
    //这里存放数据",
    return {
      activeName: 'vehicleSummary',
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
.maintenance-analysis{
  width: 100%;
  height: 100%;
}
</style>
