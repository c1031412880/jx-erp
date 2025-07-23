<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>服务质量指标分析</h3>
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
      <div class="service-quality">
        <div class="quality-indicators" v-if="qualityData && qualityData.intervals && qualityData.speeds">
          <div class="indicator-group" v-for="(group, index) in qualityIndicators" :key="index">
            <div class="indicator-title">{{ group.title }}</div>
            <div class="indicator-values">
              <div class="indicator-item" v-for="(item, idx) in group.items" :key="idx">
                <div class="indicator-label">{{ item.label }}</div>
                <div class="indicator-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="loading-placeholder">
          数据加载中或不可用...
        </div>
        <div class="quality-charts">
          <div class="quality-chart-left">
            <div class="chart-title">发车间隔分析</div>
            <div ref="intervalAnalysisChart" :style="chartStyle"></div>
          </div>
          <div class="quality-chart-right">
            <div class="chart-title">营运速度分析</div>
            <div ref="speedAnalysisChart" :style="chartStyle"></div>
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
  name: 'ServiceQualityAnalysis',
  mixins: [responsiveMixin],
  components: {
    getLineSelectTree
  },
  props: {
    qualityData: {
      type: Object,
      default: () => ({
        intervals: {
          all_minute_true: '10.5',
          zao_minute_true: '7.2',
          wan_minute_true: '8.5',
          ping_minute_true: '12.8'
        },
        speeds: {
          all_speed_true: '22.5',
          zao_speed_true: '18.3',
          wan_speed_true: '19.7',
          ping_speed_true: '26.4'
        }
      })
    },
    intervalChartData: {
      type: Object,
      default: () => ({
        data: [
          {
            name: "计划间隔",
            type: "line",
            data: [0, 16.9, 16.35, 24.2, 21.6]
          },
          {
            name: "实际间隔",
            type: "line",
            data: [0, 16.67, 14.15, 15.96, 14]
          },
          {
            name: "偏差率",
            type: "line",
            data: [0, 0.01, 0.13, 0.34, 0.35]
          }
        ],
        legend: ["计划间隔", "实际间隔", "偏差率"],
        title: null,
        xAxis: ["00", "05", "06", "07", "08"]
      })
    },
    speedChartData: {
      type: Object,
      default: () => ({
        data: [
          {
            name: "今日平均速度",
            type: "line",
            data: [20.28, 19.78, 17.82, 18.28, 22]
          },
          {
            name: "对比日平均速度",
            type: "line",
            data: [20.38, 19.11, 17.36, 18.57, 19.67]
          }
        ],
        legend: ["今日平均速度", "对比日平均速度"],
        title: null,
        xAxis: ["05", "06", "07", "08", "09"]
      })
    }
  },
  data() {
    return {
      dateRange: null,
      selectedLines: '',
      intervalChart: null,
      speedChart: null,
      charts: []
    }
  },
  computed: {
    qualityIndicators() {
      // 安全检查，确保qualityData及其子属性存在
      if (!this.qualityData || !this.qualityData.intervals || !this.qualityData.speeds) {
        console.warn('qualityData is incomplete or undefined');
        return [];
      }
      
      return [
        {
          title: '平均发车间隔',
          items: [
            { label: '平均', value: `${this.qualityData.intervals.all_minute_true || 'N/A'} 分钟` },
            { label: '早高峰', value: `${this.qualityData.intervals.zao_minute_true || 'N/A'} 分钟` },
            { label: '晚高峰', value: `${this.qualityData.intervals.wan_minute_true || 'N/A'} 分钟` },
            { label: '平峰', value: `${this.qualityData.intervals.ping_minute_true || 'N/A'} 分钟` }
          ]
        },
        {
          title: '平均速度',
          items: [
            { label: '平均速度', value: `${this.qualityData.speeds.all_speed_true || 'N/A'} km/h` },    
            { label: '早高峰', value: `${this.qualityData.speeds.zao_speed_true || 'N/A'} km/h` },
            { label: '晚高峰', value: `${this.qualityData.speeds.wan_speed_true || 'N/A'} km/h` },
            { label: '平峰', value: `${this.qualityData.speeds.ping_speed_true || 'N/A'} km/h` }
          ]
        }
      ];
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
        minHeight: '150px'
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
    intervalChartData: {
      handler() {
        this.updateIntervalChart()
      },
      deep: true
    },
    speedChartData: {
      handler() {
        this.updateSpeedChart()
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
      console.log(this.dateRange)
      this.emitDataChange()
    },

    handleLineChange(value) {
      this.selectedLines = value
      console.log(this.selectedLines)
      this.emitDataChange()
    },

    emitDataChange() {
      const params = {
        dateRange: this.dateRange,
        lines: this.selectedLines
      }
      console.log(params)
      this.$emit('data-change', params)
    },

    initCharts() {
      this.initIntervalChart()
      this.initSpeedChart()
    },

    initIntervalChart() {
      const chartDom = this.$refs.intervalAnalysisChart
      if (chartDom) {
        this.intervalChart = echarts.init(chartDom)
        this.updateIntervalChart()
        this.charts.push(this.intervalChart)
      }
    },

    updateIntervalChart() {
      if (!this.intervalChart) return
      
      // 确保数据存在
      if (!this.intervalChartData || !this.intervalChartData.data || !this.intervalChartData.xAxis) {
        console.warn('intervalChartData is incomplete');
        return;
      }
      
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = `${params[0].name}<br/>`
            params.forEach(param => {
              const unit = param.seriesName === '偏差率' ? '%' : ' 分钟'
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
          data: this.intervalChartData.data.map(item => item.name),
          textStyle: {
            fontSize: this.isMobile ? 10 : 12,
            color: '#666'
          },
          itemGap: 15
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
          data: this.intervalChartData.xAxis,
          axisLabel: {
            fontSize: this.isMobile ? 10 : 12,
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
            name: '时间(分钟)',
            position: 'left',
            axisLabel: {
              fontSize: this.isMobile ? 10 : 12,
              formatter: '{value} 分',
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
            name: '偏差率(%)',
            position: 'right',
            axisLabel: {
              fontSize: this.isMobile ? 10 : 12,
              formatter: '{value} %',
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
        series: this.intervalChartData.data.map((item, index) => {
          const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
          return {
            name: item.name,
            type: 'line',
            yAxisIndex: item.name === '偏差率' ? 1 : 0,
            data: item.data,
            smooth: true,
            lineStyle: {
              width: 3,
              color: colors[index % colors.length]
            },
            itemStyle: {
              color: colors[index % colors.length],
              borderWidth: 2,
              borderColor: '#fff'
            },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: colors[index % colors.length]
              }
            }
          }
        })
      }
      
      this.intervalChart.setOption(option)
    },

    initSpeedChart() {
      const chartDom = this.$refs.speedAnalysisChart
      if (chartDom) {
        this.speedChart = echarts.init(chartDom)
        this.updateSpeedChart()
        this.charts.push(this.speedChart)
      }
    },

    updateSpeedChart() {
      if (!this.speedChart) return

      // 确保数据存在
      if (!this.speedChartData || !this.speedChartData.data || !this.speedChartData.xAxis) {
        console.warn('speedChartData is incomplete');
        return;
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = `${params[0].name}<br/>`
            params.forEach(param => {
              result += `${param.seriesName}: ${param.value} km/h<br/>`
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
          data: this.speedChartData.data.map(item => item.name),
          textStyle: {
            fontSize: this.isMobile ? 10 : 12,
            color: '#666'
          },
          itemGap: 15
        },
        grid: {
          left: '8%',
          right: '5%',
          bottom: '8%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.speedChartData.xAxis,
          axisLabel: {
            fontSize: this.isMobile ? 10 : 12,
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
            fontSize: this.isMobile ? 10 : 12,
            formatter: '{value} km/h',
            color: '#666'
          },
          axisLine: { show: false },
          splitLine: {
            lineStyle: { color: '#f0f0f0' }
          }
        },
        series: this.speedChartData.data.map((item, index) => {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
          return {
            name: item.name,
            type: 'line',
            data: item.data,
            smooth: true,
            lineStyle: {
              width: 3,
              color: colors[index % colors.length]
            },
            itemStyle: {
              color: colors[index % colors.length],
              borderWidth: 2,
              borderColor: '#fff'
            },
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: colors[index % colors.length] + '40' },
                  { offset: 1, color: colors[index % colors.length] + '10' }
                ]
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: colors[index % colors.length]
              }
            }
          }
        })
      }

      this.speedChart.setOption(option)
    },

    resizeCharts() {
      this.charts.forEach(chart => {
        chart.resize()
      })
    },

    debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(context, args);
        }, delay);
      };
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
  height 450px
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

.service-quality
  height 100%
  display flex
  flex-direction column

  .quality-indicators
    display grid
    grid-template-columns repeat(auto-fit, minmax(300px, 1fr))
    gap 20px
    margin-bottom 20px
    flex-shrink 0

    .indicator-group
      .indicator-title
        font-size 14px
        color #333
        margin-bottom 10px
        text-align center
        font-weight 500

      .indicator-values
        display grid
        grid-template-columns repeat(auto-fit, minmax(70px, 1fr))
        gap 8px

        .indicator-item
          text-align center
          padding 8px
          background #f8f9fa
          border-radius 4px

          .indicator-label
            font-size 11px
            color #666
            margin-bottom 3px

          .indicator-value
            font-size 13px
            font-weight bold
            color #333

  .quality-charts
    display flex
    gap 20px
    flex 1

    .quality-chart-left, .quality-chart-right
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
  .quality-charts
    gap 15px
    
  .quality-chart-left, .quality-chart-right
    min-width 0 // 防止flex子元素溢出

@media (max-width: 768px)
  .chart-container
    padding 12px
    height auto
    min-height 400px
    
  .chart-header
    h3
      font-size 16px
      
  .quality-indicators
    grid-template-columns repeat(2, 1fr)
    gap 10px
    margin-bottom 15px
    
    .indicator-group
      padding 8px
      
      .indicator-title
        font-size 12px
        
      .indicator-values
        .indicator-item
          .indicator-label
            font-size 10px
            
          .indicator-value
            font-size 12px
            
  .quality-charts
    gap 10px
    
    .chart-title
      font-size 12px

// 加载占位符样式
.loading-placeholder
  display flex
  align-items center
  justify-content center
  height 100px
  color #999
  font-size 14px
  background #f8f9fa
  border-radius 4px
  margin-bottom 20px

@media (max-width: 480px)
  .chart-container
    padding 8px
    
  .chart-header
    h3
      font-size 14px
      
  .chart-controls
    gap 5px
    
  .quality-indicators
    grid-template-columns 1fr 1fr
    gap 8px
    
    .indicator-group
      padding 6px
      
      .indicator-title
        font-size 11px
        
      .indicator-values
        .indicator-item
          .indicator-label
            font-size 9px
            
          .indicator-value
            font-size 11px
            
  .quality-charts
    gap 8px
    
    .chart-title
      font-size 11px
      
    .quality-chart-left, .quality-chart-right
      min-width 120px // 确保最小宽度，防止过度压缩
</style> 