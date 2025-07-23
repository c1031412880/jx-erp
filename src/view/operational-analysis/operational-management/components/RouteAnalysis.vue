<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>里程分析</h3>
      <div class="chart-controls">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          @change="handleDateChange"
          :style="datePickerStyle"
        ></el-date-picker>
        <get-line-select-tree 
          ref="getLineSelectTree" 
          :size="'mini'" 
          :isShowCheckbox="true" 
          v-model="selectedLines" 
          placeholder="选择线路"
          @change="handleLineChange"
        ></get-line-select-tree>
      </div>
    </div>
    <div class="chart-content">
      <div class="route-analysis">
        <div class="route-stats">
          <div class="stat-card" v-for="(stat, index) in routeStats" :key="index">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </div>
        <div class="route-charts">
          <div class="route-chart-left">
            <div class="chart-title">线路里程排名 TOP10</div>
            <div ref="routeMileageChart" :style="chartStyle"></div>
          </div>
          <div class="route-chart-right">
            <div class="chart-title">日均里程对比</div>
            <div ref="dailyMileageChart" :style="chartStyle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree"
import responsiveMixin from '@/mixins/responsive'

export default {
  name: 'RouteAnalysis',
  mixins: [responsiveMixin],
  components: {
    getLineSelectTree
  },
  props: {
    routeStatsData: {
      type: Object,
      default: () => ({
        gps_mileage: '256.8',
        operation_mileage: '219.3',
        average_mileage: '37.5',
        utilization_rate: '85.4'
      })
    },
    mileageRankingData: {
      type: Array,
      default: () => []
    },
    dailyMileageData: {
      type: Object,
      default: () => ({
        xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        gpsData: [250, 240, 260, 280, 270, 230, 220],
        operationData: [200, 190, 210, 240, 230, 180, 170],
        averageData: [50, 40, 60, 50, 40, 30, 40]
      })
    }
  },
  data() {
    return {
      dateRange: null,
      selectedLines: '',
      routeMileageChart: null,
      dailyMileageChart: null,
      charts: []
    }
  },
  computed: {
    routeStats() {
      return [
        { title: 'GPS里程', value: `${this.routeStatsData.all_mileage} km` },
        { title: '运营里程', value: `${this.routeStatsData.dispatch_odmeter} km` },
        { title: '平均里程', value: `${this.routeStatsData.average_mileage} km` },
        { title: '里程利用率', value: `${this.routeStatsData.dispatch_odmeter_rate}%` }
      ]
    },
    datePickerStyle() {
      return {
        width: this.isMobile ? '200px' : '250px'
      }
    },
    chartStyle() {
      return {
        width: '100%',
        height: this.responsiveChartHeight,
        minHeight: '180px'
      }
    },
    fontSize() {
      return this.echartsFontSize.axis
    }
  },
  mounted() {
    this.setDefaultDateRange()
    this.$nextTick(() => {
      this.initCharts()
    })
    // 添加窗口大小变化监听
    this.handleResize = this.debounce(this.resizeCharts, 100)
    window.addEventListener('resize', this.handleResize)
  },
  watch: {
    mileageRankingData: {
      handler() {
        this.updateMileageChart()
      },
      deep: true
    },
    dailyMileageData: {
      handler() {
        this.updateDailyChart()
      },
      deep: true
    }
  },
  methods: {
    setDefaultDateRange() {
      const today = new Date()
      const oneWeekAgo = new Date(today)
      oneWeekAgo.setDate(today.getDate() - 7)
      this.dateRange = [oneWeekAgo, today]
    },

    handleDateChange(value) {
      this.dateRange = value
      this.emitDataChange()
    },

    handleLineChange(value) {
      this.selectedLines = value
      this.emitDataChange()
    },

    emitDataChange() {
      const params = {
        dateRange: this.dateRange,
        lines: this.selectedLines
      }
      this.$emit('data-change', params)
    },

    initCharts() {
      this.initMileageChart()
      this.initDailyChart()
    },

    initMileageChart() {
      const chartDom = this.$refs.routeMileageChart
      if (chartDom) {
        this.routeMileageChart = echarts.init(chartDom)
        this.updateMileageChart()
        this.charts.push(this.routeMileageChart)
      }
    },

    updateMileageChart() {
      if (!this.routeMileageChart) return
      console.log('里程分析数据变化:', this.mileageRankingData)
      
      // 使用传入的数据或默认数据
      const data = this.mileageRankingData.length > 0 
        ? this.mileageRankingData 
        : [
            { name: '523路', value: 1400 },
            { name: '418路', value: 1200 },
            { name: '325路', value: 1000 },
            { name: '216路', value: 800 },
            { name: '108路', value: 600 },
            { name: '82路', value: 400 },
            { name: 'K1号', value: 500 },
            { name: '312路', value: 700 },
            { name: '205路', value: 900 },
            { name: '101路', value: 1100 }
          ]

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            return `${params[0].name}<br/>里程: ${params[0].value} km`
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e4e7ed',
          borderWidth: 1,
          textStyle: {
            color: '#333',
            fontSize: this.fontSize
          }
        },
        grid: {
          left: '8%',
          right: '5%',
          bottom: '8%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: this.fontSize,
            color: '#666'
          },
          axisLine: {
            lineStyle: { color: '#e6e6e6' }
          },
          splitLine: {
            lineStyle: { color: '#f0f0f0' }
          }
        },
        yAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: {
            fontSize: this.fontSize,
            color: '#666'
          },
          axisLine: {
            lineStyle: { color: '#e6e6e6' }
          },
          axisTick: { show: false }
        },
        series: [{
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#409EFF' },
                { offset: 1, color: '#66B3FF' }
              ]
            },
            borderRadius: [0, 4, 4, 0]
          },
          barWidth: this.$store.state.app.screenSize === 'mobile' ? '60%' : '50%',
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: '#66B3FF' },
                  { offset: 1, color: '#409EFF' }
                ]
              }
            }
          }
        }]
      }

      this.routeMileageChart.setOption(option)
    },

    initDailyChart() {
      const chartDom = this.$refs.dailyMileageChart
      if (chartDom) {
        this.dailyMileageChart = echarts.init(chartDom)
        this.updateDailyChart()
        this.charts.push(this.dailyMileageChart)
      }
    },

    updateDailyChart() {
      if (!this.dailyMileageChart) return

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = `${params[0].name}<br/>`
            params.forEach(param => {
              result += `${param.seriesName}: ${param.value} km<br/>`
            })
            return result
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e4e7ed',
          borderWidth: 1
        },
        legend: {
          data: ['GPS里程', '运营里程', '平均里程'],
          textStyle: {
            fontSize: this.fontSize,
            color: '#666'
          },
          itemGap: 20
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '8%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.dailyMileageData.xAxis,
          axisLabel: {
            fontSize: this.fontSize,
            color: '#666'
          },
          axisLine: {
            lineStyle: { color: '#e6e6e6' }
          },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: this.fontSize,
            color: '#666'
          },
          axisLine: { show: false },
          splitLine: {
            lineStyle: { color: '#f0f0f0' }
          }
        },
        series: [
          {
            name: 'GPS里程',
            type: 'bar',
            data: this.dailyMileageData.gpsData,
            itemStyle: { 
              color: '#5470c6',
              borderRadius: [2, 2, 0, 0]
            },
            emphasis: {
              itemStyle: { color: '#7B9CFF' }
            }
          },
          {
            name: '运营里程',
            type: 'bar',
            data: this.dailyMileageData.operationData,
            itemStyle: { 
              color: '#91cc75',
              borderRadius: [2, 2, 0, 0]
            },
            emphasis: {
              itemStyle: { color: '#A8D98A' }
            }
          },
          {
            name: '平均里程',
            type: 'bar',
            data: this.dailyMileageData.averageData,
            itemStyle: { 
              color: '#fac858',
              borderRadius: [2, 2, 0, 0]
            },
            emphasis: {
              itemStyle: { color: '#FFD666' }
            }
          }
        ]
      }

      this.dailyMileageChart.setOption(option)
    },

    resizeCharts() {
      this.charts.forEach(chart => {
        chart.resize()
      })
    },

    debounce(func, delay) {
      let timeoutId
      return function(...args) {
        const context = this
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(context, args)
        }, delay)
      }
    }
  },

  beforeDestroy() {
    this.charts.forEach(chart => chart.dispose())
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container
  background white
  border-radius 8px
  padding 16px
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
  height 420px
  display flex
  flex-direction column

  .chart-header
    display flex
    justify-content space-between
    align-items center
    margin-bottom 15px
    flex-wrap wrap
    gap 10px
    flex-shrink 0

    h3
      font-size 18px
      font-weight 600
      margin 0
      color #303133

    .chart-controls
      display flex
      align-items center
      gap 10px
      flex-wrap wrap

  .chart-content
    position relative
    flex 1
    display flex
    flex-direction column

.route-analysis
  height 100%
  display flex
  flex-direction column

  .route-stats
    display grid
    grid-template-columns repeat(auto-fit, minmax(120px, 1fr))
    gap 15px
    margin-bottom 20px
    flex-shrink 0

    .stat-card
      text-align center
      padding 10px
      background #f8f9fa
      border-radius 6px

      .stat-title
        font-size 12px
        color #666
        margin-bottom 5px

      .stat-value
        font-size 16px
        font-weight bold
        color #333

  .route-charts
    display flex
    gap 20px
    flex 1

    .route-chart-left, .route-chart-right
      flex 1
      display flex
      flex-direction column
      min-width 0
      flex-shrink 1

      .chart-title
        font-size 14px
        color #333
        margin-bottom 10px
        text-align center
        white-space nowrap
        overflow hidden
        text-overflow ellipsis

// 响应式设计
@media (max-width: 1200px)
  .route-charts
    gap 15px
    
  .route-chart-left, .route-chart-right
    min-width 0 // 防止flex子元素溢出

@media (max-width: 768px)
  .chart-container
    padding 12px
    height auto
    min-height 350px
    
  .chart-header
    h3
      font-size 16px
      
  .route-stats
    grid-template-columns repeat(2, 1fr)
    gap 10px
    margin-bottom 15px
    
    .stat-card
      padding 8px
      
      .stat-title
        font-size 11px
        
      .stat-value
        font-size 14px
        
  .route-charts
    gap 10px
    
    .chart-title
      font-size 12px

@media (max-width: 480px)
  .chart-container
    padding 8px
    
  .chart-header
    h3
      font-size 14px
      
  .chart-controls
    gap 5px
    
  .route-stats
    grid-template-columns 1fr 1fr
    gap 5px
    
    .stat-card
      padding 6px
      
      .stat-title
        font-size 10px
        
      .stat-value
        font-size 12px
        
  .route-charts
    gap 8px
    
    .chart-title
      font-size 11px
      
    .route-chart-left, .route-chart-right
      min-width 120px // 确保最小宽度，防止过度压缩
</style> 