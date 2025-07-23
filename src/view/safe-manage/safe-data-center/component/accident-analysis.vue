<template>
  <div class="accident-analysis">
    <!-- 第一组单选按钮：分析类型 -->
    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
      <el-radio-group v-model="analysisType" size="mini">
        <el-radio-button label="nature">事故性质</el-radio-button>
        <el-radio-button label="duty">事故责任</el-radio-button>
        <el-radio-button label="reason">事故原因</el-radio-button>
      </el-radio-group>
      <!-- 第二组单选按钮：时间范围 -->
      <el-radio-group v-model="dateType" size="mini">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 事故性质组件 -->
    <accident-nature v-if="analysisType === 'nature'" :dept_id="dept_id" :dateType="dateType" />
    <!-- 事故责任组件 -->
    <accident-duty v-if="analysisType === 'duty'" :dept_id="dept_id" :dateType="dateType" />
    <!-- 事故原因组件 -->
    <accident-reason v-if="analysisType === 'reason'" :dept_id="dept_id" :dateType="dateType" />
  </div>
</template>

<script>
import accidentNature from './accident-nature'
import accidentDuty from './accident-duty'
import accidentReason from './accident-reason'

export default {
  name: 'accident-analysis',
  components: {
    accidentNature,
    accidentDuty,
    accidentReason
  },
  props: {
    dept_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      analysisType: 'nature', // nature: 事故性质, duty: 事故责任, reason: 事故原因
      dateType: 1 // 1:月 2:年
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.accident-analysis {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 单选按钮容器样式
  .el-radio-group {
    margin-bottom: 8px * $NumWidth;
    
    &:first-child {
      margin-right: 15px * $NumWidth;
    }
  }
}

// 单选按钮样式优化
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
  padding: 6px * $NumWidth 10px * $NumWidth;
  border-radius: 3px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 3px * $NumWidth 0 0 3px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 3px * $NumWidth 3px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style> 