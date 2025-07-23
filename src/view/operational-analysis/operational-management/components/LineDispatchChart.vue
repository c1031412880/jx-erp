<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>营运质量对比</h3>
      <div class="chart-controls">
    
      </div>
    </div>
    <div class="chart-content">
      <div class="chart-row">
        <!-- 左侧：分公司数据 -->
        <div class="chart-left">
          <div class="chart-title">按分公司</div>
          <div ref="companyChart" style="width: 100%; height: 300px;"></div>
        </div>
        
        <!-- 右侧：线路数据 -->
        <div class="chart-right">
          <div class="chart-title">按线路</div>
          <div ref="lineChart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'LineDispatchChart',
  props: {
    chartData: {
      type: Object,
      default: () => ({
        lineData: [],
        countData: [],
        trueData: [],
        onTimeData: []
      })
    }
  },
  data() {
    return {
      companyChart: null,
      lineChart: null,
      activeType: 2,
      key: '',
      // 线路数据 (type=1)
      lineData: {
        lineData: [],
        countData: [],
        trueData: [],
        onTimeData: []
      },
      // 分公司数据 (type=2)
      companyData: {
        lineData: [],
        countData: [],
        trueData: [],
        onTimeData: []
      }
    }
  },
  mounted() {
    this.initCharts()
    this.loadAllData()
  },
  created() {
    this.loadAllData()
  },
  watch: {
    chartData: {
      handler() {
        this.updateCharts()
      },
      deep: true
    }
  },
  methods: {
    initCharts() {
      this.initCompanyChart()
      this.initLineChart()
    },
    
    initCompanyChart() {
      const chartDom = this.$refs.companyChart
      if (chartDom) {
        this.companyChart = echarts.init(chartDom)
        this.updateCompanyChart()
      }
    },
    
    initLineChart() {
      const chartDom = this.$refs.lineChart
      if (chartDom) {
        this.lineChart = echarts.init(chartDom)
        this.updateLineChart()
      }
    },
    
    updateCharts() {
      this.updateCompanyChart()
      this.updateLineChart()
    },
    
    updateCompanyChart() {
      if (!this.companyChart) return
      
      // 分公司数据 - 使用柱状图
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['首末班准点', '完成率', '准点率'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'inside',
            startValue: 0,
            endValue: 7
          }
        ],
        xAxis: {
          type: 'category',
          data: this.companyData.lineData.length > 0 ? this.companyData.lineData : ['嘉兴分公司', '桐乡分公司', '海宁分公司', '平湖分公司', '嘉善分公司']
        },
        yAxis: {
          type: 'value'
        },
                  series: [
            {
              name: '首末班准点',
              type: 'bar',
              data: this.companyData.countData.length > 0 ? this.companyData.countData : [98.5, 97.2, 99.1, 96.8, 98.3],
              itemStyle: { color: '#5470c6' }
            },
            {
              name: '完成率',
              type: 'bar',
              data: this.companyData.trueData.length > 0 ? this.companyData.trueData : [99.2, 98.5, 99.7, 97.9, 99.1],
              itemStyle: { color: '#4DD8FF' }
            },
            {
              name: '准点率',
              type: 'bar',
              data: this.companyData.onTimeData.length > 0 ? this.companyData.onTimeData : [97.8, 96.5, 98.9, 95.7, 97.6],
              itemStyle: { color: '#EB774A' }
            }
          ]
      }
      
      this.companyChart.setOption(option)
    },
    
    updateLineChart() {
      if (!this.lineChart) return
      
      // 线路数据 - 使用柱状图
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['首末班准点', '完成率', '准点率'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'inside',
            startValue: 0,
            endValue: 7
          }
        ],
        xAxis: {
          type: 'category',
          data: this.lineData.lineData.length > 0 ? this.lineData.lineData : ['1路', '2路', '3路', '4路', '5路', '6路', '7路']
        },
        yAxis: {
          type: 'value'
        },
                  series: [
            {
              name: '首末班准点',
              type: 'bar',
              data: this.lineData.countData.length > 0 ? this.lineData.countData : [98.5, 97.8, 99.2, 96.5, 98.9, 97.1, 98.6],
              itemStyle: { color: '#5470c6' }
            },
            {
              name: '完成率',
              type: 'bar',
              data: this.lineData.trueData.length > 0 ? this.lineData.trueData : [99.1, 98.3, 99.5, 97.8, 99.2, 98.7, 99.0],
              itemStyle: { color: '#4DD8FF' }
            },
            {
              name: '准点率',
              type: 'bar',
              data: this.lineData.onTimeData.length > 0 ? this.lineData.onTimeData : [97.6, 96.8, 98.5, 95.9, 98.1, 96.3, 97.9],
              itemStyle: { color: '#EB774A' }
            }
          ]
      }
      
      this.lineChart.setOption(option)
    },
    
    // 加载所有数据
    loadAllData() {
      // 同时请求线路数据和分公司数据
      this.getLineDispatch(1) // 线路数据
      this.getCompanyDispatch(2) // 分公司数据
    },
    
    // 获取线路数据 (type=1)
    getLineDispatch(type) {
      this.$dispatch.getLineDispatch({type}).then((res) => {
        if (res.head.result === "200") {
          console.log('线路数据res-----------',res);
          let info = res.content
          this.lineData.lineData = info.line_disps_names
          this.lineData.countData = info.line_disps_shoumo_ontime
          this.lineData.trueData = info.line_disps_complete_real
          this.lineData.onTimeData = info.line_disps_ontime
          this.key = new Date().getTime()
          
          // 更新右侧线路图表
          this.updateLineChart()
          this.$emit('data-change', type)
        }
      }).catch((error) => {
        console.error('获取线路调度数据失败:', error);
        // 接口失败时使用模拟数据
        this.updateLineChart()
        this.$emit('data-change', type)
      });
    },
    
    // 获取分公司数据 (type=2)
    getCompanyDispatch(type) {
      this.$dispatch.getLineDispatch({type}).then((res) => {
        if (res.head.result === "200") {
          console.log('分公司数据res-----------',res);
          let info = res.content
          this.companyData.lineData = info.line_disps_names
          this.companyData.countData = info.line_disps_shoumo_ontime
          this.companyData.trueData = info.line_disps_complete_real
          this.companyData.onTimeData = info.line_disps_ontime
          this.key = new Date().getTime()
          
          // 更新左侧分公司图表
          this.updateCompanyChart()
          this.$emit('data-change', type)
        }
      }).catch((error) => {
        console.error('获取分公司调度数据失败:', error);
        // 接口失败时使用模拟数据
        this.updateCompanyChart()
        this.$emit('data-change', type)
      });
    },
    
    changeType(type) {
      this.activeType = type
      // 重新加载所有数据
      this.loadAllData()
      this.$emit('type-change', type)
    },
    
    exportData() {
      this.$emit('export-data')
    }
  },
  
  beforeDestroy() {
    if (this.companyChart) {
      this.companyChart.dispose()
    }
    if (this.lineChart) {
      this.lineChart.dispose()
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
      
      .button-group
        display: flex
        gap: 10px

        .active
          cursor: pointer
          width: 70px
          line-height: 100%
          border-radius: 15px
          background-color: #2EA3FF
          color: #fff
          text-align: center
          padding: 5px
          font-size: 14px

        .normal
          cursor: pointer
          width: 70px
          line-height: 100%
          border-radius: 15px
          background-color: #558BD6
          color: #fff
          opacity: 0.6
          text-align: center
          padding: 5px
          font-size: 14px
      
  .chart-content
    position: relative
    flex: 1
    display: flex
    flex-direction: column
    
    .chart-row
      display: flex
      gap: 20px
      height: 100%
      
      .chart-left, .chart-right
        flex: 1
        display: flex
        flex-direction: column
        
        .chart-title
          font-size: 14px
          font-weight: 500
          color: #333
          margin-bottom: 10px
          text-align: center
          padding: 8px
          background: #f5f7fa
          border-radius: 4px
</style> 