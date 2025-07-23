<template>
  <div class="bus-list">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="first">
        <all-view></all-view>
      </el-tab-pane>
      <!-- <el-tab-pane label="员工" name="second" lazy>
        <employee-info></employee-info>
      </el-tab-pane>
      <el-tab-pane label="车辆" name="third" lazy>
        <vehicle-info></vehicle-info>
      </el-tab-pane>
      <el-tab-pane label="线路" name="fourth" lazy>
        <line-info></line-info>
      </el-tab-pane>
      <el-tab-pane label="站点" name="fifth" lazy>
        <station-info></station-info>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="自行车" name="sixth">
        <bicycle-info></bicycle-info>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import allView from './component/all-view';
import employeeInfo from './component/employee-info';
import vehicleInfo from './component/vehicle-info';
import lineInfo from './component/line-info';
import stationInfo from './component/station-info';
import bicycleInfo from './component/bicycle-info';
export default {
  name: 'bus-list',
  components: {allView, employeeInfo, vehicleInfo, lineInfo, stationInfo, vehicleInfo, bicycleInfo},
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.bus-list {
  width: 100%;
  height: 100%;
  .el-tabs {
    height: 100%;
    /deep/ .el-tabs__item {
      font-size: 14px * $NumWidth;
      line-height: 14px * $NumWidth;
      padding: 16px * $NumWidth;
      height: auto;
    }
    /deep/ .el-tabs__item:nth-child(2) {
      padding-left: 16px * $NumWidth;
    }
    /deep/ .el-tabs__item:last-child {
      padding-right: 16px * $NumWidth;
    }
    /deep/ .el-tabs__item.is-active {
      color: red;
      border-top: 2px solid red;
    }
    /deep/ .el-tab-pane {
      height: 240px * $NumWidth;
    }
  }
}
</style>