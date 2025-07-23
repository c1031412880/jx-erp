<template>
  <el-row :gutter="10" class="chart-row">
    <!-- 营收分析 -->
    <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
      <RevenueAnalysis 
        :revenueData="revenueData"
        :lineChartData="revenueLineData"
        :pieChartData="revenuePieData"
        @data-change="handleRouteRankingDataChange"
        @type-change="handleRevenueTypeChange"
      />
    </el-col>

    <!-- 线路客流排名 -->
    <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
      <RouteRankingTable 
        :redRankingData="routeRankingData"
      />
    </el-col>
  </el-row>
</template>

<script>
import RevenueAnalysis from './RevenueAnalysis.vue'
import RouteRankingTable from './RouteRankingTable.vue'

export default {
  name: 'RevenueAndRouteRanking',
  components: {
    RevenueAnalysis,
    RouteRankingTable
  },
  props: {
    revenueData: {
      type: Object,
      default: () => ({
        totalRevenue: '2,456,789',
        totalTrend: '+1.3%',
        perVehicleRevenue: '5,389',
        perVehicleTrend: '+3.2%',
        taxRevenue: '2,920',
        taxTrend: '+2.5%'
      })
    },
    revenueLineData: {
      type: Object,
      default: () => ({
        xAxis: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'],
        data: [80000, 85000, 82000, 88000, 90000, 87000, 92000]
      })
    },
    revenuePieData: {
      type: Object,
      default: () => ({})
    },
    routeRankingData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleRouteRankingDataChange(data) {
      this.$emit('route-ranking-data-change', data)
    },

    handleRevenueTypeChange(type) {
      this.$emit('revenue-type-change', type)
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