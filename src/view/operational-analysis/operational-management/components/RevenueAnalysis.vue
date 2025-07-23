<template>
    <div class="chart-container">
      <div class="chart-header">
        <h3>营收分析</h3>
        <div class="chart-controls">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            @change="handleDateChange"
          ></el-date-picker>
          <get-line-select-tree ref="getLineSelectTree" :size="'mini'" :isShowCheckbox="true" v-model="lines" placeholder="选择线路"></get-line-select-tree>
        </div>
      </div>
      <div class="revenue-stats">
        <div class="revenue-item">
          <div class="revenue-label">总营收</div>
          <div class="revenue-value">¥{{ revenueData.curr_month_revenue_driver }}</div>
          <div class="revenue-trend">较上月 {{ revenueData.rate_month_driver_chain_ratio }}</div>
        </div>
        <div class="revenue-item">
          <div class="revenue-label">单车营收</div>
          <div class="revenue-value">¥{{ revenueData.curr_month_revenue_veh }}</div>
          <div class="revenue-trend">较上月 {{ revenueData.rate_month_veh_chain_ratio }}</div>
        </div>
        <div class="revenue-item">
          <div class="revenue-label">百公里营收</div>
          <div class="revenue-value">¥{{ revenueData.curr_month_revenue_odo }}</div>
          <div class="revenue-trend">较上月 {{ revenueData.rate_month_odo_chain_ratio }}</div>
        </div>
      </div>
      <div class="chart-content">
        <div class="revenue-analysis">
          <!-- 左侧：日营收变化趋势 -->
          <div class="revenue-left-section">
            <div class="revenue-trend-title">日营收变化趋势</div>
            <div ref="revenueLineChart" class="revenue-line-chart"></div>
          </div>
          
          <!-- 右侧：营收类型占比和总营收 -->
          <div class="revenue-right-section">
            <div class="revenue-pie-section">
              <div class="revenue-pie-title">营收类型占比</div>
              <div ref="revenuePieChart" class="revenue-pie-content"></div>
            </div>
            <!-- 图例 -->
            <div class="revenue-pie-legend">
              <div class="legend-item" v-for="(item, index) in getTopPayTypes()" :key="index">
                <span class="legend-color" :style="{ background: getLegendColor(index) }"></span>
                <span class="legend-text">{{ item.name }}</span>
                <span class="legend-percentage">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import echarts from 'echarts'
  import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
  
  export default {
    name: 'RevenueAnalysis',
    components: {
      getLineSelectTree
    },
    props: {
      revenueData: {
        type: Object,
        default: () => ({
          totalRevenue: '330630.5',
          totalTrend: '+1.3%',
          perVehicleRevenue: '5,389',
          perVehicleTrend: '+3.2%',
          taxRevenue: '2,920',
          taxTrend: '+2.5%',
        })
      },
      lineChartData: {
        type: Object,
        default: () => ({
          date_chart_name_data: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'],
          date_chart_data: [80000, 85000, 82000, 88000, 90000, 87000, 92000]
        })
      },
      pieChartData: {
        type: Object,
        default: () => ({
          pay_number: 100,
          payway_chart_data:[100,120,130],
          payway_chart_name_data:['支付宝','现金','微信']
        })
      }
    },
    data() {
      return {
        dateRange: null,
        revenueType: 'all',
        lineChart: null,
        pieChart: null,
        lines: ''
      }
    },
    computed: {
      pieLegendData() {
        return this.pieChartData
      }
    },
    mounted() {
      console.log('RevenueAnalysis组件已挂载')
      this.setDefaultDateRange()
      // 延迟初始化，确保DOM完全渲染
      this.$nextTick(() => {
        setTimeout(() => {
          this.initCharts()
        }, 100)
      })
    },
    watch: {
      lines: {
        handler() {
          this.handleDateChange()
        },
        deep: true
      },
      lineChartData: {
        handler() {
          this.updateLineChart()
        },
        deep: true
      },
      pieChartData: {
        handler() {
          this.updatePieChart()
        },
        deep: true
      }
    },
    methods: {
      // 设置默认日期范围：昨天起的前一个月
      setDefaultDateRange() {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        const oneMonthAgo = new Date(yesterday)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        
        this.dateRange = [oneMonthAgo, yesterday]
      },
      
      initCharts() {
        this.initLineChart()
        this.initPieChart()
      },
      
      initLineChart() {
        const chartDom = this.$refs.revenueLineChart
        if (chartDom) {
          this.lineChart = echarts.init(chartDom)
          this.updateLineChart()
        }
      },
      
      updateLineChart() {
        if (!this.lineChart) return
        
        const option = {
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              return params[0].name + '<br/>' + '营收: ¥' + params[0].value.toLocaleString()
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.lineChartData.date_chart_name_data,
            axisLine: {
              lineStyle: { color: '#e6e6e6' }
            },
            axisTick: { show: false },
            axisLabel: {
              color: '#999',
              fontSize: 11
            }
          },
          yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              lineStyle: { color: '#f0f0f0' }
            },
            axisLabel: {
              color: '#999',
              fontSize: 11,
              formatter: function(value) {
                return (value / 10000) + '万'
              }
            }
          },
          series: [{
            type: 'line',
            data: this.lineChartData.date_chart_data,
            smooth: true,
            lineStyle: {
              color: '#409EFF',
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                  { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
                ]
              }
            },
            symbol: 'circle',
            symbolSize: 4,
            showSymbol: false
          }]
        }
        
        this.lineChart.setOption(option)
      },
      
      initPieChart() {
        console.log('开始初始化饼图')
        const chartDom = this.$refs.revenuePieChart
        console.log('饼图DOM元素:', chartDom)
        
        if (chartDom) {
          // 如果已存在实例，先销毁
          if (this.pieChart) {
            this.pieChart.dispose()
          }
          
          this.pieChart = echarts.init(chartDom)
          console.log('饼图实例创建成功:', this.pieChart)
          
          // 立即更新图表
          this.updatePieChart()
          
          // 监听窗口大小变化
          window.addEventListener('resize', () => {
            if (this.pieChart) {
              this.pieChart.resize()
            }
          })
        } else {
          console.error('找不到饼图DOM元素')
        }
      },
      
      updatePieChart() {
        console.log('开始更新饼图')
        if (!this.pieChart) {
          console.log('饼图实例不存在，跳过更新')
          return
        }
        
        // 根据接口返回的数据结构处理数据
        const payTypes = this.pieChartData.payway_chart_name_data || []
        const payData = this.pieChartData.payway_chart_data || []
        const totalAmount = this.pieChartData.pay_number || 0
        
        console.log('饼图数据:', { payTypes, payData, totalAmount })
        
        if (payTypes.length === 0 || payData.length === 0) {
          console.log('数据为空，使用默认数据')
          // 使用默认数据进行测试
          const testData = [
            { value: 335, name: '直达', percentage: '33.5' },
            { value: 310, name: '邮件营销', percentage: '31.0' },
            { value: 234, name: '联盟广告', percentage: '23.4' },
            { value: 135, name: '视频广告', percentage: '13.5' },
            { value: 86, name: '搜索引擎', percentage: '8.6' }
          ]
          
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)'
            },
            series: [{
              type: 'pie',
              radius: ['35%', '55%'],
              center: ['50%', '40%'],
              data: testData.map((item, index) => ({
                value: item.value,
                name: item.name,
                itemStyle: {
                  color: ['#25c8d5', '#ff9f43', '#ffd93d', '#67C23A', '#409EFF'][index % 5]
                }
              })),
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }],
            graphic: {
              type: 'text',
              left: 'center',
              top: '35%',
              z: 10,
              style: {
                text: '1000\n测试数据',
                textAlign: 'center',
                fill: '#333',
                fontSize: 16,
                fontWeight: 'bold',
                lineHeight: 18
              }
            }
          }
          
          this.pieChart.setOption(option)
          console.log('使用测试数据渲染饼图')
          return
        }
        
        // 定义颜色配置 - 扩展更多颜色
        const colorList = [
          '#25c8d5', '#ff9f43', '#ffd93d', '#67C23A', '#409EFF', 
          '#909399', '#E6A23C', '#F56C6C', '#9C27B0', '#FF5722',
          '#607D8B', '#795548', '#FF9800', '#4CAF50', '#2196F3',
          '#9E9E9E', '#673AB7', '#3F51B5', '#00BCD4', '#009688'
        ]
        
        // 处理图表数据 - 显示所有数据，不合并
        const chartData = payTypes.map((name, index) => {
          const value = payData[index] || 0
          const percentage = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0
          return {
            value: value,
            name: name,
            percentage: percentage,
            itemStyle: {
              color: colorList[index % colorList.length]
            }
          }
        })
        
        console.log('处理后的图表数据:', chartData)
        
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              return `${params.name}<br/>数量: ${params.value.toLocaleString()}<br/>占比: ${params.data.percentage}%`
            }
          },
          series: [{
            type: 'pie',
            radius: ['35%', '55%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: true,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: chartData
          }],
          graphic: {
            type: 'text',
            left: 'center',
            top: '35%',
            z: 10,
            style: {
              text: `${totalAmount.toLocaleString()}\n总营收`,
              textAlign: 'center',
              fill: '#333',
              fontSize: 16,
              fontWeight: 'bold',
              lineHeight: 18
            }
          }
        }
        
        this.pieChart.setOption(option, true)
        console.log('饼图配置已设置')
      },
      
      handleDateChange(value) {
        this.dateRange = value
        console.log('日期变化:', value)
        console.log('线路变化:', this.lines)
        let params = {
          date: this.dateRange,
          line_ids: this.lines
        }
        this.$emit('data-change', params)
      },
      
      handleTypeChange(value) {
        this.revenueType = value
        this.$emit('type-change', value)
      },

      getLegendColor(index) {
        const colorList = [
          '#25c8d5', '#ff9f43', '#ffd93d', '#67C23A', '#409EFF', 
          '#909399', '#E6A23C', '#F56C6C', '#9C27B0', '#FF5722',
          '#607D8B', '#795548', '#FF9800', '#4CAF50', '#2196F3',
          '#9E9E9E', '#673AB7', '#3F51B5', '#00BCD4', '#009688'
        ]
        return colorList[index % colorList.length]
      },

      getLegendPercentage(index) {
        const payData = this.pieChartData.payway_chart_data || []
        const totalAmount = this.pieChartData.pay_number || 0
        const value = payData[index] || 0
        return totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(2) : 0
      },

      formatNumber(num) {
        if (num === null || num === undefined) {
          return '0';
        }
        return num.toLocaleString();
      },

      getTopPayTypes() {
        const payTypes = this.pieChartData.payway_chart_name_data || [];
        const payData = this.pieChartData.payway_chart_data || [];
        const totalAmount = this.pieChartData.pay_number || 0;

        // 返回所有数据，不合并
        const allPayTypes = [];
        
        for (let i = 0; i < payTypes.length; i++) {
          const name = payTypes[i];
          const value = payData[i] || 0;
          const percentage = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0;
          allPayTypes.push({ name, percentage, value });
        }
        
        return allPayTypes;
      }
    },
    
    beforeDestroy() {
      if (this.lineChart) {
        this.lineChart.dispose()
      }
      if (this.pieChart) {
        this.pieChart.dispose()
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

  .revenue-stats
    display: grid
    grid-template-columns: repeat(3, 1fr)
    gap: 12px
    margin-bottom: 2px
    padding: 8px 0
    flex-shrink: 0
    
    .revenue-item
      text-align: center
      padding: 8px
      background: #f8f9fa
      border-radius: 6px
      
      .revenue-label
        font-size: 11px
        color: #666
        margin-bottom: 3px
        
      .revenue-value
        font-size: 14px
        font-weight: bold
        color: #333
        margin-bottom: 2px
        
      .revenue-trend
        font-size: 10px
        color: #67C23A
      
  .chart-content
    position: relative
    flex: 1
    display: flex
    flex-direction: column
    min-height: 100px

.revenue-analysis
  height: 100%
  display: flex
  gap: 20px
  
  // 左侧：日营收变化趋势
  .revenue-left-section
    flex: 2
    display: flex
    flex-direction: column
    
    .revenue-trend-title
      font-size: 14px
      font-weight: 500
      color: #333
      margin-bottom: 8px
      text-align: center
      
    .revenue-line-chart
      flex: 1
      min-height: 0

  // 右侧：饼图和总营收
  .revenue-right-section
    flex: 1
    display: flex
    flex-direction: column
    
    .revenue-pie-section
      flex: 1
      position: relative
      
      .revenue-pie-title
        font-size: 14px
        font-weight: 500
        color: #333
        margin-bottom: 8px
        text-align: center
        
      .revenue-pie-content
        width: 100%
        height: 200px
            
    .revenue-pie-legend
      margin-top: -35px
      display: flex
      flex-direction: column
      flex-shrink: 0
      height: 100px
      overflow-y: auto
      overflow-x: hidden
      
      &::-webkit-scrollbar
        width: 4px
        
      &::-webkit-scrollbar-track
        background: #f1f1f1
        border-radius: 2px
        
      &::-webkit-scrollbar-thumb
        background: #c1c1c1
        border-radius: 2px
        
        &:hover
          background: #a8a8a8
      
      .legend-item
        display: flex
        align-items: center
        justify-content: space-between
        font-size: 11px
        line-height: 20px
        padding: 2px 0
        flex-shrink: 0
        
        .legend-color
          width: 10px
          height: 10px
          border-radius: 2px
          margin-right: 6px
          flex-shrink: 0
          
        .legend-text
          flex: 1
          color: #333
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          
        .legend-percentage
          color: #666
          font-weight: 500
          margin-left: 4px
          flex-shrink: 0
  </style>