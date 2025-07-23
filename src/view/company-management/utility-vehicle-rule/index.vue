<template>
  <div class="utility-vehicle-rule">
    <el-tabs tab-position="left" style="height: 100%" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车辆年审" name="first" style="height:100%">
        <vehicle-review :TableHeight="TableHeight"></vehicle-review>
      </el-tab-pane>
      <el-tab-pane label="车辆保养" name="second">
        <vehicle-maintenance :TableHeight="TableHeight"></vehicle-maintenance>
      </el-tab-pane>
      <el-tab-pane label="保险到期" name="third">
        <expiration-insurance :TableHeight="TableHeight"></expiration-insurance>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import vehicleReview from "./component/vehicle-review";
import vehicleMaintenance from "./component/vehicle-maintenance";
import expirationInsurance from "./component/expiration-insurance";
export default {
  name: "utility-vehicle-rule",
  components: {
    vehicleReview,
    vehicleMaintenance,
    expirationInsurance,
  },
  data() {
    return {
      TableHeight: 500,
      activeName: 'first',
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case 'first':
          break;
        case 'second':
          break;
        case 'third':
          break;
      }
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = 90;
        this.TableHeight = maxh - th;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.utility-vehicle-rule {
  width: 100%;
  height: 100%;
  /deep/ .el-tabs__content {
    height: 100%;
  }

}
</style>
