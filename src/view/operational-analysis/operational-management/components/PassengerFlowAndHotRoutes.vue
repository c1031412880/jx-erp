<template>
  <el-row :gutter="10" class="chart-row">
    <!-- 客流趋势 -->
    <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
      <PassengerFlowChart 
        :chartData="passengerFlowData"
        @type-change="handlePassengerFlowTypeChange"
      />
    </el-col>

    <!-- 热门线路 -->
    <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
      <HotRoutesRanking 
        :routesData="hotRoutes"
        @switch-type="handleHotRoutesSwitch"
      />
    </el-col>
  </el-row>
</template>

<script>
import PassengerFlowChart from './PassengerFlowChart.vue'
import HotRoutesRanking from './HotRoutesRanking.vue'

export default {
  name: 'PassengerFlowAndHotRoutes',
  components: {
    PassengerFlowChart,
    HotRoutesRanking
  },
  props: {
    passengerFlowData: {
      type: Object,
      default: () => ({
        daily: {
          xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: [5200, 5800, 5400, 6200, 5900, 5500, 5100]
        },
        hourly: {
          xAxis: ['00:00-01:00', '03:00-04:00', '06:00-07:00', '09:00-10:00', '12:00-13:00', '15:00-16:00', '18:00-19:00', '21:00-22:00'],
          data: [0, 2000, 4000, 12000, 6000, 8000, 9000, 2000]
        },
        per100km: {
          xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: [120, 135, 128, 145, 138, 125, 118]
        }
      })
    },
    hotRoutes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handlePassengerFlowTypeChange(type) {
      this.$emit('passenger-flow-type-change', type)
    },

    handleHotRoutesSwitch(type) {
      this.$emit('hot-routes-switch', type)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-row
  margin-bottom 10px

  &:last-child
    margin-bottom 0

// 响应式设计
@media (max-width: 768px)
  .chart-row
    /deep/ .el-col
      margin-bottom 10px
      
      &:last-child
        margin-bottom 0
</style> 