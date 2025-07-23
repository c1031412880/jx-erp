<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>包车分析</h3>
      <div class="chart-controls">
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:100%"
            size="mini"
            @change="handleDateChange"
            >
          </el-date-picker>
      </div>
    </div>
    <div class="chart-content">
      <div class="charter-analysis">
        <div class="charter-chart-left">
          <!-- <div class="charter-stats">
            <div class="stat-item">
              <div class="stat-label">总包车次数</div>
              <div class="stat-value">{{ chartData.total_chariot_count || 0 }}次</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总包车费用</div>
              <div class="stat-value">{{ formatMoney(chartData.total_chariot_fee || 0) }}</div>
            </div>
          </div> -->
          <div class="chart-title">包车趋势分析</div>
          <div ref="charterCountChart" :style="chartStyle"></div>
        </div>
        <div class="charter-table-right">
          <CharterTable ref="charterTable" :height="300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import responsiveMixin from '@/mixins/responsive'
import CharterTable from '@/view/operational-analysis/car-charter-filling/indexComponent.vue'
import {getDate} from '@/utils/index'
export default {
  name: 'CharterAnalysis',
  mixins: [responsiveMixin],
  components: {
    CharterTable
  },
  props: {
    charterData: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Object,
      default: () => ({
        total_chariot_count: 0,
        total_chariot_fee: 0,
        monthly_count: [],
        monthly_fee: []
      })
    }
  },
  data() {
    return {
      dateRange: null,
      charterChart: null,
      charts: []
    }
  },
  computed: {
    totalPassengers() {
      return this.charterData.reduce((sum, item) => sum + item.passengers, 0)
    },
    chartStyle() {
      return {
        width: '100%',
        height: this.responsiveChartHeight,
        minHeight: '200px'
      }
    },
    datePickerStyle() {
      return {
        width: this.isMobile ? '200px' : '250px'
      }
    },
    // 处理图表数据
    processedChartData() {
      if (!this.chartData.monthly_count || !this.chartData.monthly_fee) {
        return {
          xAxis: [],
          countData: [],
          revenueData: []
        }
      }
      
      return {
        xAxis: this.chartData.monthly_count.map(item => item.month),
        countData: this.chartData.monthly_count.map(item => item.value),
        revenueData: this.chartData.monthly_fee.map(item => item.value)
      }
    }
  },
  mounted() {
    this.setDefaultDateRange()
    this.$refs.charterTable.onSubmit()
    this.$nextTick(() => {
      this.initChart()
    })
    // 添加窗口大小变化监听
    this.handleResize = this.debounce(this.resizeCharts, 100)
    window.addEventListener('resize', this.handleResize)
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
    setDefaultDateRange( type = 'thisYear') {
      // 初始化 一年
      let timeObj = getDate(type)
      this.dateRange = [timeObj.startTime, timeObj.endTime]
      // let timeObj = getDate(type)
      // let issuance_time_start = timeObj.startTime
      // let issuance_time_end = timeObj.endTime

      // this.dateRange = [issuance_time_start, issuance_time_end]
    },

    handleDateChange(value) {
      this.dateRange = value
      let params = {}
      if(this.dateRange && this.dateRange.length>0) {
        params.issuance_time_start = this.dateRange[0]
        params.issuance_time_end = this.dateRange[1] + ' 23:59:59'  
      } else {
        params.issuance_time_start = ''
        params.issuance_time_end = ''
      }
      this.$refs.charterTable.onSubmit()
      this.$emit('data-change', params)
    },

    initChart() {
      const chartDom = this.$refs.charterCountChart
      if (chartDom) {
        this.charterChart = echarts.init(chartDom)
        this.updateChart()
        this.charts.push(this.charterChart)
      }
    },

    updateChart() {
      if (!this.charterChart) return

      const chartData = this.processedChartData

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: (params) => {
            let result = `${params[0].name}<br/>`
            params.forEach(param => {
              const unit = param.seriesName === '包车营收' ? '元' : '次'
              result += `${param.seriesName}: ${param.value}${unit}<br/>`
            })
            return result
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e4e7ed',
          borderWidth: 1,
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          data: ['包车次数', '包车营收'],
          textStyle: {
            fontSize: this.echartsFontSize ? this.echartsFontSize.legend : 12,
            color: '#666'
          },
          itemGap: 20
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '8%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.xAxis,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            fontSize: this.echartsFontSize ? this.echartsFontSize.axis : 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: { color: '#e6e6e6' }
          },
          axisTick: { show: false }
        },
        yAxis: [
          {
            type: 'value',
            name: '包车次数',
            position: 'left',
            axisLabel: {
              fontSize: this.echartsFontSize ? this.echartsFontSize.axis : 12,
              color: '#666'
            },
            axisLine: { show: false },
            splitLine: {
              lineStyle: { color: '#f0f0f0' }
            },
            nameTextStyle: {
              color: '#666',
              fontSize: 11
            }
          },
          {
            type: 'value',
            name: '包车营收',
            position: 'right',
            axisLabel: {
              formatter: '{value}',
              fontSize: this.echartsFontSize ? this.echartsFontSize.axis : 12,
              color: '#666'
            },
            axisLine: { show: false },
            splitLine: { show: false },
            nameTextStyle: {
              color: '#666',
              fontSize: 11
            }
          }
        ],
        series: [
          {
            name: '包车次数',
            type: 'bar',
            data: chartData.countData,
            itemStyle: { 
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#5470c6' },
                  { offset: 1, color: '#7B9CFF' }
                ]
              },
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#7B9CFF' },
                    { offset: 1, color: '#5470c6' }
                  ]
                }
              }
            }
          },
          {
            name: '包车营收',
            type: 'line',
            yAxisIndex: 1,
            data: chartData.revenueData,
            lineStyle: { 
              color: '#91cc75', 
              width: 3 
            },
            itemStyle: { 
              color: '#91cc75',
              borderWidth: 2,
              borderColor: '#fff'
            },
            symbol: 'circle',
            symbolSize: 6,
            smooth: true,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: '#91cc75'
              }
            }
          }
        ]
      }

      this.charterChart.setOption(option)
    },

    resizeCharts() {
      this.charts.forEach(chart => {
        chart.resize()
      })
    },

    debounce(func, wait) {
      let timeout
      return function(...args) {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    },

    formatMoney(value) {
      if (!value) return '¥0'
      return '¥' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },

  beforeDestroy() {
    this.charts.forEach(chart => chart.dispose())
    window.removeEventListener('resize', this.handleResize)
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

.charter-analysis
  display flex
  gap 20px
  flex 1

  .charter-chart-left
    flex 0 0 40%
    display flex
    flex-direction column
    min-width 0

    .charter-stats
      display flex
      justify-content space-around
      margin-bottom 10px
      padding 10px 0
      border-bottom 1px solid #e0e0e0

      .stat-item
        text-align center

        .stat-label
          font-size 12px
          color #666
          margin-bottom 5px

        .stat-value
          font-size 16px
          font-weight bold
          color #333

    .chart-title
      font-size 14px
      color #333
      margin-bottom 10px
      text-align center
      white-space nowrap
      overflow hidden
      text-overflow ellipsis

  .charter-table-right
    flex 1
    display flex
    flex-direction column
    min-width 0
    overflow hidden

    .charter-table
      height 100%
      display flex
      flex-direction column

      .table-header, .table-footer
        display grid
        grid-template-columns 80px 80px 80px 80px 80px 80px 80px 100px
        gap 8px
        font-size 12px
        color #666
        font-weight bold
        padding 8px 0
        border-bottom 1px solid #e0e0e0

      .table-footer
        border-top 1px solid #e0e0e0
        border-bottom none
        background #f8f9fa

      .table-body
        flex 1
        overflow-y auto

      .table-row
        display grid
        grid-template-columns 80px 80px 80px 80px 80px 80px 80px 100px
        gap 8px
        font-size 11px
        padding 6px 0
        border-bottom 1px solid #f0f0f0
        color #333

        &:hover
          background #f8f9fa

// 响应式设计
@media (max-width: 1200px)
  .charter-analysis
    gap 15px
    
  .charter-chart-left, .charter-table-right
    min-width 0 // 防止flex子元素溢出

@media (max-width: 768px)
  .chart-container
    padding 12px
    height auto
    min-height 400px
    
  .chart-header
    h3
      font-size 16px
      
  .charter-analysis
    gap 10px
    
    .charter-chart-left
      .charter-stats
        .stat-item
          .stat-label
            font-size 11px
            
          .stat-value
            font-size 14px
      
      .chart-title
        font-size 12px
        
    .charter-table-right
      .charter-table
        font-size 10px
        
        .table-header, .table-row
          padding 4px 2px
          
          span
            padding 2px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap

// 移动端表格滚动条样式
.charter-table .table-body
  &::-webkit-scrollbar
    width 4px
    
  &::-webkit-scrollbar-track
    background #f1f1f1
    border-radius 2px
    
  &::-webkit-scrollbar-thumb
    background #c1c1c1
    border-radius 2px
    
    &:hover
      background #a8a8a8

@media (max-width: 480px)
  .chart-container
    padding 8px
    
  .chart-header
    h3
      font-size 14px
      
  .chart-controls
    gap 5px
    
  .charter-analysis
    gap 8px
    
    .charter-chart-left
      flex 0 0 35% // 在极小屏幕下稍微减小图表宽度
      min-width 100px
      
      .charter-stats
        .stat-item
          .stat-label
            font-size 10px
            
          .stat-value
            font-size 12px
      
      .chart-title
        font-size 11px
        
    .charter-table-right
      min-width 0
      
      .charter-table
        font-size 9px
        
        .table-header, .table-row
          padding 2px 1px
          
          span
            padding 1px
            font-size 8px
</style> 