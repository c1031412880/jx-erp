<template>
  <div class="energy-list">
    <div class="el-select-box">
      <div class="first-select-box" v-show="activeName === 'first'">
        <el-radio-group @change="changeSelectType" v-model="eleType" size="mini">
          <el-radio-button :label="1">月</el-radio-button>
          <el-radio-button :label="2">年</el-radio-button>
        </el-radio-group>
        <!-- <el-date-picker
          v-model="eleYear"
          type="year"
          format="yyyy"
          value-format="yyyy"
          style="width: 90px;"
          size="mini"
          v-show="eleType === '年'"
          placeholder="选择年">
        </el-date-picker>
        <el-date-picker
          v-model="eleMonth"
          type="month"
          style="width: 110px;"
          size="mini"
          format="yyyy-MM"
          value-format="yyyy-MM"
          v-show="eleType === '月'"
          placeholder="选择月">
        </el-date-picker> -->
      </div>
      <div class="second-select-box" v-show="activeName === 'second'">
        <el-radio-group @change="changeSelectType" v-model="gasType" size="mini">
          <el-radio-button :label="1">月</el-radio-button>
          <el-radio-button :label="2">年</el-radio-button>
        </el-radio-group>
        <!-- <el-date-picker
          v-model="gasYear"
          type="year"
          style="width: 90px;"
          size="mini"
          format="yyyy"
          value-format="yyyy"
          v-show="gasType === '年'"
          placeholder="选择年">
        </el-date-picker>
        <el-date-picker
          v-model="gasMonth"
          type="month"
          style="width: 110px;"
          size="mini"
          format="yyyy-MM"
          value-format="yyyy-MM"
          v-show="gasType === '月'"
          placeholder="选择月">
        </el-date-picker> -->
      </div>
      <div class="third-select-box" v-show="activeName === 'third'">
        <el-radio-group @change="changeSelectType" v-model="hyType" size="mini">
          <el-radio-button :label="1">月</el-radio-button>
          <el-radio-button :label="2">年</el-radio-button>
        </el-radio-group>
        <!-- <el-date-picker
          v-model="hyYear"
          type="year"
          format="yyyy"
          value-format="yyyy"
          style="width: 90px;"
          size="mini"
          v-show="hyType === '年'"
          placeholder="选择年">
        </el-date-picker>
        <el-date-picker
          v-model="hyMonth"
          type="month"
          style="width: 110px;"
          size="mini"
          format="yyyy-MM"
          value-format="yyyy-MM"
          v-show="hyType === '月'"
          placeholder="选择月">
        </el-date-picker> -->
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="电耗" name="first" lazy>
        <base-info ref="eleBaseInfo" :pageName="'eleBaseInfo'" :eleType="eleType"></base-info>
      </el-tab-pane>
      <el-tab-pane label="气耗" name="second" lazy>
        <base-info ref="gasBaseInfo" :pageName="'gasBaseInfo'" :gasType="gasType"></base-info>
      </el-tab-pane>
      <el-tab-pane label="氢气" name="third" lazy>
        <base-info ref="hyBaseInfo" :pageName="'hyBaseInfo'" :hyType="hyType"></base-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './base-info'
import { formatTime } from '@/utils/index';
export default {
  name: 'energy-list',
  components: {
    baseInfo
  },
  data() {
    const year = formatTime(new Date(),'yyyy').slice(0,4);
    const month = formatTime(new Date(),'yyyy-MM').slice(0,7);
    return {
      activeName: 'first',
      eleType: 2,
      eleYear: year,
      eleMonth: month,
      gasType: 2,
      gasYear: year,
      gasMonth: month,
      hyType: 2,
      hyYear: year,
      hyMonth: month,
    }
  },
  methods: {
    handleClick(tab, event) {},
    changeSelectType() {
      switch(this.activeName) {
        case 'first':
          this.$refs.eleBaseInfo.loadData()
          break;
        case 'second':
          this.$refs.gasBaseInfo.loadData()
          break;
        case 'third':
          this.$refs.hyBaseInfo.loadData()
          break;
        default:
          break;
      }
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.energy-list {
  position: relative;
  width: 100%;
  height: 100%;
  .el-select-box {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #FFF1F2;
      border: 1px solid #C61D29;
      color: #C61D29;
      -webkit-box-shadow: -1px 0 0 0 #C61D29;
      box-shadow: -1px 0 0 0 #C61D29;
    }
    /deep/ .el-radio-button__inner:hover {
        color: #ee6069;
    }
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