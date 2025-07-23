<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <el-select :loading="loading" @change="handleChange" v-model="currentValue" :placeholder="'请选择部门'" size="mini" clearable>
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <demo-box title="本年度数据总览"  :showAllBtn="false" :contextClass="'content-third'">
        <year-overview ref="yearOverview" :dept_id="currentValue"></year-overview>
      </demo-box>
    </el-col>
    <el-col :span="8">
      <demo-box title="安全总览"  :showAllBtn="false" :contextClass="'content-third'">
        <safety-overview ref="safetyOverview" :dept_id="currentValue"></safety-overview>
      </demo-box>
    </el-col>
    <el-col :span="8">
      <demo-box title="事故总览"  :showAllBtn="false" :contextClass="'content-third'">
        <accident-overview ref="accidentOverview" :dept_id="currentValue"></accident-overview>
      </demo-box>
    </el-col>
    <el-col :span="8">
      <demo-box title="违章分析"  :showAllBtn="false" :contextClass="'content-third'">
        <violation-analysis ref="violationAnalysis" :dept_id="currentValue"></violation-analysis>
      </demo-box>
    </el-col>
    
    <el-col :span="8">
      <demo-box title="违章类型分析"  :showAllBtn="false" :contextClass="'content-third'">
        <violation-type-analysis ref="violationTypeAnalysis" :dept_id="currentValue"></violation-type-analysis>
      </demo-box>
    </el-col>
    <el-col :span="8">
      <demo-box title="事故性质分析"  :showAllBtn="false" :contextClass="'content-third'">
        <accident-analysis ref="accidentAnalysis" :dept_id="currentValue"></accident-analysis>
      </demo-box>
    </el-col>
    <el-col :span="12">
      <demo-box title="分公司安全排名"  :showAllBtn="false" :contextClass="'content-third'">
        <safe-dept-rank ref="safeDeptRank" :dept_id="currentValue"></safe-dept-rank>
      </demo-box>
    </el-col>
    <el-col :span="12">
      <demo-box title="隐患整改"  :showAllBtn="false" :contextClass="'content-third'">
        <safe-issue-fix ref="safeIssueFix" :dept_id="currentValue"></safe-issue-fix>
      </demo-box>
    </el-col>
  </el-row>
</template>

<script>
import demoBox from '@/view/dashboard/component/demo-box'
import safetyOverview from './component/safety-overview'
import accidentOverview from './component/accident-overview'
import violationAnalysis from './component/violation-analysis'
import safeDeptRank from './component/safe-dept-rank'
import safeIssueFix from './component/safe-issue-fix'
import violationTypeAnalysis from './component/violation-type-analysis'
import accidentAnalysis from './component/accident-analysis'
import yearOverview from './component/year-overview'
export default {
  name: 'safe-data-center',
  components: {
    demoBox,
    safetyOverview,
    accidentOverview,
    violationAnalysis,
    safeDeptRank,
    safeIssueFix,
    violationTypeAnalysis,
    accidentAnalysis,
    yearOverview,
  },
  data() {
    return {
      loading: false,
      currentValue: 0,
      options: []
    }
  },
  created() {
    this.getDeptOptions()
  },
  methods: {
    // 获取部门
    getDeptOptions() {
      this.loading = true
			this.options = []
			this.$client
				.GetSimpleDeptList({})
				.then(res => {
					if (res.head.result == '200') {
						this.options = res.context
					}
				})
				.finally(() => {
					this.loading = false
					this.currentValue = 0
				})
    },
    // 选择部门
    handleChange() {
      this.$refs.safetyOverview.loadData()
      this.$refs.accidentOverview.loadData()
      this.$refs.violationAnalysis.loadData()
      this.$refs.safeDeptRank.loadData()
      this.$refs.safeIssueFix.loadData()
      this.$refs.violationTypeAnalysis.loadData()
      this.$refs.yearOverview.loadData()
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.safe-data-center {
	background: #E0E1E5;
}

// 全局单选按钮样式优化
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

/deep/ .el-radio-button__inner {
  font-size: 12px * $NumWidth;
  padding: 8px * $NumWidth 12px * $NumWidth;
  border-radius: 4px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px * $NumWidth 0 0 4px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 4px * $NumWidth 4px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style>