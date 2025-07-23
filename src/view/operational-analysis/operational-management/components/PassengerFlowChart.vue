<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>客流趋势</h3>
      <div class="chart-controls">
        <el-radio-group v-model="currentType" size="mini" @change="handleTypeChange">
          <el-radio-button label="逐日客流">逐日客流</el-radio-button>
          <el-radio-button label="时段客流">时段客流</el-radio-button>
          <el-radio-button label="百公里客流">百公里客流</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="chart-content">
      <div
        class="passenger-flow-content"
        :class="{ 'hourly-mode': currentType === '时段客流' }"
      >
        <div class="flow-period-info" v-if="currentType === '时段客流'">
          <span class="period-label">客流高峰时段 (08:00-09:00)</span>
          <span class="period-time">60分钟</span>
        </div>
        <div ref="passengerFlowChart" style="width: 100%; flex: 1;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'PassengerFlowChart',
  props: {
    chartData: {
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
    }
  },
  data() {
    return {
      currentType: '逐日客流',
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    chartData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.passengerFlowChart
      if (chartDom) {
        this.chart = echarts.init(chartDom)
        this.updateChart()
      }
    },
    
    updateChart() {
      if (!this.chart) return
      
      let option = {}
      
      if (this.currentType === '时段客流') {
        // 时段客流：面积图
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.chartData.hourly.xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            type: 'line',
            data: this.chartData.hourly.data,
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(64, 158, 255, 0.8)'
                }, {
                  offset: 1, color: 'rgba(64, 158, 255, 0.1)'
                }]
              }
            },
            lineStyle: {
              color: '#409EFF',
              width: 2
            }
          }]
        }
      } else {
        // 其他类型：柱状图
        const dataKey = this.currentType === '逐日客流' ? 'daily' : 'per100km'
        option = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.chartData[dataKey].xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            type: 'bar',
            data: this.chartData[dataKey].data,
            itemStyle: {
              color: '#409EFF'
            }
          }]
        }
      }
      
      this.chart.setOption(option)
    },
    
    handleTypeChange(value) {
      this.currentType = value
      this.updateChart()
      this.$emit('type-change', value)
    }
  },
  
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container
  background: white
  border-radius: 8px
  padding: 16px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  height: 420px
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
      font-size: 18px
      font-weight: 600
      margin: 0
      color: #303133
      
    .chart-controls
      display: flex
      align-items: center
      gap: 10px
      flex-wrap: wrap
      
  .chart-content
    position: relative
    flex: 1
    display: flex
    flex-direction: column

.passenger-flow-content
  display: flex
  flex-direction: column
  height: 100%
  
  .flow-period-info
    display: flex
    justify-content: space-between
    align-items: center
    background: #f5f7fa
    border-radius: 4px
    
    .period-label
      color: #e6a23c
      font-weight: 500
      font-size: 14px
      
    .period-time
      color: #666
      font-size: 12px
  &.hourly-mode
    div[ref="passengerFlowChart"]
      max-height: 220px
      min-height: 180px
</style> 