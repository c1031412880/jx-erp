<template>
  <div class="safe-list">
    <div class="el-select-box">
      <el-select v-model="accType" @change="getAccLoadData" v-show="activeName === 'first'" style="width: 110px;" size="mini" placeholder="请选择">
        <el-option label="按分公司" :value="1"></el-option>
        <el-option label="按月" :value="2"></el-option>
      </el-select>
      <el-select v-model="vioType" @change="getVioLoadData" v-show="activeName === 'second'" style="width: 110px;" size="mini" placeholder="请选择">
        <el-option label="按分公司" :value="1"></el-option>
        <el-option label="按月" :value="2"></el-option>
      </el-select>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="事故" name="first" lazy>
        <base-info ref="accBaseInfo" :pageName="'accBaseInfo'" :accType="accType"></base-info>
      </el-tab-pane>
      <el-tab-pane label="违章" name="second" lazy>
        <base-info ref="vioBaseInfo" :pageName="'vioBaseInfo'" :vioType="vioType"></base-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './base-info'
export default {
  name: 'safe-list',
  components: {
    baseInfo
  },
  data() {
    return {
      activeName: 'first',
      accType: 1,
      vioType: 1,
    };
  },
  methods: {
    handleClick(tab, event) {},
    getAccLoadData(val) {
      this.$refs.accBaseInfo.getChartData(val)
    },
    getVioLoadData(val) {
        this.$refs.vioBaseInfo.getChartData(val)
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.safe-list {
  position: relative;
  width: 100%;
  height: 100%;
  .el-select-box {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
  }
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