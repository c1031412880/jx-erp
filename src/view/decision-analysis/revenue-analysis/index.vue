<template>
  <div class="revenue-analysis">
    <el-tabs v-model="activeName">
      <el-tab-pane label="按线路汇总" name="vehicleSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <data-table :whichPage="1"></data-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按车辆汇总" name="lineSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <data-table :whichPage="2"></data-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按组织汇总" name="deptSummary" lazy>
        <div :style="{height: `${boxHeight}px`}">
          <data-table :whichPage="3"></data-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import dataTable from "./components/data-table";
export default {
  name: "revenue-analysis",
  components: {dataTable},
  mounted() {
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  data() {
    //这里存放数据",
    return {
      activeName: 'vehicleSummary',
      boxHeight: 400,
    }
  },
  //方法集合",
  methods: {
    setHeight() {
      this.boxHeight = this.$el.offsetHeight - 55
    }
  },
}
</script>

<style lang="scss" scoped>
.revenue-analysis{
  width: 100%;
  height: 100%;
}
</style>
