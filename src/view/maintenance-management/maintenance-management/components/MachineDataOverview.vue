<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>机务数据总览</h3>
      <div class="overview-controls">
        <el-select 
          :value="overviewPeriod" 
          size="mini" 
          style="width: 80px;" 
          @change="handlePeriodChange"
        >
          <el-option label="本年" value="2"></el-option>
          <el-option label="本月" value="1"></el-option>
        </el-select>
        <el-date-picker
          v-model="overviewMonth"
          :disabled="overviewPeriod === '2'"
          type="month"
          placeholder="选择月份"
          size="mini"
          style="width: 120px; margin-left: 8px;"
          format="yyyy-MM"
          value-format="yyyy-MM"
          @change="handleMonthChange">
        </el-date-picker>
        <dept-select
          v-if="showDeptSelector"
          :value="overviewDeptId"
          @on-change="handleDeptChange"
          :size="'mini'"
          style="width: 120px; margin-left: 8px;">
        </dept-select>
      </div>
    </div>
    <div class="overview-data-new">
      <!-- 两列布局 -->
      <div class="overview-columns">
        <div class="overview-column">
          <div 
            class="overview-item" 
            v-for="item in leftColumnData" 
            :key="item.label"
          >
            <span class="overview-label">{{ item.label }}</span>
            <div class="overview-value-wrapper">
              <span class="overview-value">{{ item.value }}</span>
              <span class="overview-unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <div class="overview-column">
          <div 
            class="overview-item" 
            v-for="item in rightColumnData" 
            :key="item.label"
          >
            <span class="overview-label">{{ item.label }}</span>
            <div class="overview-value-wrapper">
              <span class="overview-value">{{ item.value }}</span>
              <span class="overview-unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import deptSelect from "@/components/component/dept-select"

export default {
  name: 'MachineDataOverview',
  components: {
    deptSelect
  },
  props: {
    overviewPeriod: {
      type: String,
      default: '2'
    },
    overviewMonth: {
      type: String,
      default: null
    },
    overviewDeptId: {
      type: String,
      default: ''
    },
    overviewData: {
      type: Array,
      default: () => []
    },
    showDeptSelector: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    leftColumnData() {
      const halfIndex = Math.ceil(this.overviewData.length / 2)
      return this.overviewData.slice(0, halfIndex)
    },
    rightColumnData() {
      const halfIndex = Math.ceil(this.overviewData.length / 2)
      return this.overviewData.slice(halfIndex)
    }
  },
  methods: {
    handlePeriodChange(value) {
      this.$emit('period-change', value)
    },
    handleMonthChange(value) {
      this.$emit('month-change', value)
    },
    handleDeptChange(value) {
      // 只有在显示部门选择器时才触发事件
      if (this.showDeptSelector) {
        this.$emit('dept-change', value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container
  background: white
  border-radius: 12px
  padding: 20px
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08)
  height: 420px
  border: 1px solid rgba(0, 0, 0, 0.05)
  display: flex
  flex-direction: column
  
  .chart-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 15px
    flex-wrap: wrap
    gap: 10px
    flex-shrink: 0
    
    h3
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: #303133;

// 机务数据总览控制区域
.overview-controls
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: 8px

// 新的机务数据总览布局
.overview-data-new
  display: flex
  flex-direction: column
  height: 100%
  flex: 1
  
  .overview-columns
    display: flex
    height: 100%
    gap: 20px
    
    .overview-column
      flex: 1
      display: flex
      flex-direction: column
      
      .overview-item
        flex: 1
        display: flex
        justify-content: space-between
        align-items: center
        padding: 8px 0
        border-bottom: 1px solid #f0f0f0
        min-height: 32px
        
        &:last-child
          border-bottom: none
          
        .overview-label
          color: #666
          font-size: 13px
          flex: 1
          
        .overview-value-wrapper
          display: flex
          align-items: baseline
          flex-shrink: 0
          
          .overview-value
            font-weight: bold
            color: #333
            font-size: 14px
            margin-right: 2px
            
          .overview-unit
            color: #999
            font-size: 11px
</style> 