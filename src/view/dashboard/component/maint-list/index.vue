<template>
  <div class="maint-list">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="first">
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
        <div>总览</div>
      </el-tab-pane>
      <el-tab-pane label="员工" name="second">员工</el-tab-pane>
      <el-tab-pane label="车辆" name="third">车辆</el-tab-pane>
      <el-tab-pane label="线路" name="fourth">线路</el-tab-pane>
      <el-tab-pane label="站点" name="fifth">站点</el-tab-pane>
      <el-tab-pane label="自行车" name="sixth">自行车</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'maint-list',
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.maint-list {
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