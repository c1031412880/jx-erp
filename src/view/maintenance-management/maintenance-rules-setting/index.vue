<template>
  <div class="maintenance-rules-setting">
    <div class="maintenance-rules-content">
      <el-tabs :tab-position="'left'" style="height: 100%" v-model="activeName">
        <el-tab-pane label="车辆年检" name="first">
          <annual-inspection
            :TableHeight="TableHeight"
          ></annual-inspection>
        </el-tab-pane>
        <el-tab-pane label="车辆保养" name="second" lazy>
          <maintain-com
            :TableHeight="TableHeight"
          ></maintain-com>
        </el-tab-pane>
        <el-tab-pane label="车辆报废" name="third" lazy>
          <vehicle-maintenance
            :TableHeight="TableHeight"
          ></vehicle-maintenance>
        </el-tab-pane>
        <el-tab-pane label="保险到期" name="fourth" lazy>
          <insurance-expiration
            :TableHeight="TableHeight"
          ></insurance-expiration>
        </el-tab-pane>
        <el-tab-pane label="燃气系统检验" name="fifth" lazy>
          <Gas-system-reminder
          :TableHeight="TableHeight"
          ></Gas-system-reminder>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import annualInspection from "./annual-inspection";
import maintainCom from "./maintain-com";
import vehicleMaintenance from "./vehicle-maintenance";
import insuranceExpiration from "./insurance-expiration";
import GasSystemReminder from "./Gas-system-reminder";
export default {
  name: "maintenance-rules-setting",
  components: {
    annualInspection,
    maintainCom,
    vehicleMaintenance,
    insuranceExpiration,
    GasSystemReminder
  },
  data() {
    return {
      TableHeight: 500,
      activeName:"first",
    };
  },
  activated() {
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
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
.maintenance-rules-setting {
  width: 100%;
  height: 100%;
}

.maintenance-rules-setting /deep/ .el-tabs--left .el-tabs__item, .is-left {
  text-align: center !important;
}

.maintenance-rules-setting /deep/ .is-active {
  background: #ECF5FF;
}
</style>
