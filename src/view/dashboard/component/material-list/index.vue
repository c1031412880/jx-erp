<template>
  <div class="material-list">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="材料费" name="first" lazy>
        <materialCost ref="materialCost"></materialCost>
      </el-tab-pane>
      <el-tab-pane label="材料使用排名" name="second" lazy>
        <materialUsageRanking ref="materialUsageRanking"></materialUsageRanking>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import materialCost from './component/material-cost';
import materialUsageRanking from './component/material-usage-ranking';
export default {
  name: 'material-list',
  components: {
    materialCost,
    materialUsageRanking,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    handleClick(tab, event) {},
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.material-list {
  position: relative;
  width: 100%;
  height: 100%;
  /deep/ .el-tabs {
    height: 100%;
    .el-tabs__content {
      overflow: unset;
    }
    .el-tabs__item {
      font-size: 14px * $NumWidth;
      line-height: 14px * $NumWidth;
      padding: 16px * $NumWidth;
      height: auto;
    }
    .el-tabs__item:nth-child(2) {
      padding-left: 16px * $NumWidth;
    }
    .el-tabs__item:last-child {
      padding-right: 16px * $NumWidth;
    }
    .el-tabs__item.is-active {
      color: red;
      border-top: 2px solid red;
    }
    .el-tab-pane {
      height: 240px * $NumWidth;
    }
  }
}
</style>