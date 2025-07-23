<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>机务成本分析</h3>
      <el-radio-group v-model="type" size="mini" @change="loadData">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="queryType" size="mini" @change="loadData" style="margin-left: 10px;">
        <el-radio-button :label="1">总体</el-radio-button>
        <el-radio-button :label="2">燃油</el-radio-button>
        <el-radio-button :label="3">车龄</el-radio-button>
        <el-radio-button :label="4">车型</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart-content">
      <div ref="chart" style="flex:1;"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'CostAnalysisChart',
  props: {
    deptId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 2, // 1 月 2 年
      queryType: 1, // 1 总体
      chart: null
    }
  },
  watch: {
    deptId () {
      this.loadData()
    }
  },
  mounted () {
    this.loadData()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) this.chart.dispose()
  },
  methods: {
    resizeChart () {
      if (this.chart) this.chart.resize()
    },
    async loadData () {
      try {
        const params = {
          type: this.type,
          dept_id: this.deptId || '',
          query_type: this.queryType,
          server_id: '60.191.59.11'
        }
        if (this.type === 1) {
          const now = new Date()
          params.month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        }
        const res = await this.$client.GetVehicleCostAnalysis(params)
        if (res.head.result === '200') {
          this.renderChart(res.context || [])
        } else {
          this.renderMock()
        }
      } catch (e) {
        console.error('机务成本分析加载失败', e)
        this.renderMock()
      }
    },
    renderMock () {
      const mock = [
        { type: '2022年', materital_fee: 1200000, val_fee: 800000, hour_fee: 400000, kilometer_fee: 15.5 },
        { type: '2023年', materital_fee: 1350000, val_fee: 850000, hour_fee: 420000, kilometer_fee: 16.2 },
        { type: '2024年', materital_fee: 1500000, val_fee: 900000, hour_fee: 450000, kilometer_fee: 17.1 }
      ]
      this.renderChart(mock)
    },
    renderChart (data) {
      if (!this.$refs.chart) return
      if (!this.chart) this.chart = echarts.init(this.$refs.chart)
      const items = [
        { name: '材料费', key: 'materital_fee', type: 'bar', color: '#409EFF' },
        { name: '能耗费用', key: 'val_fee', type: 'bar', color: '#67C23A' },
        { name: '工时费', key: 'hour_fee', type: 'bar', color: '#E6A23C' },
        { name: '千公里营运成本', key: 'kilometer_fee', type: 'line', yAxisIndex: 1, color: '#409EFF' }
      ]
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#e4e7ed',
          borderWidth: 1,
          textStyle: { color: '#333' }
        },
        legend: {
          bottom: '0%',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { color: '#333', fontSize: 12 }
        },
        grid: { top: '5%', left: '8%', right: '8%', bottom: '15%', containLabel: true },
        xAxis: {
          type: 'category',
          data: data.map(d => d.type),
          axisLabel: { color: '#333' },
          axisLine: { lineStyle: { color: '#e4e7ed' } }
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: { color: '#333' },
            axisLine: { lineStyle: { color: '#e4e7ed' } },
            splitLine: { show: true, lineStyle: { color: '#f5f7fa' } }
          },
          { type: 'value', show: false }
        ],
        series: items.map(it => ({
          name: it.name,
          type: it.type,
          yAxisIndex: it.yAxisIndex || 0,
          data: data.map(d => d[it.key]),
          itemStyle: { color: it.color },
          lineStyle: { color: it.color, width: 3 },
          symbol: it.type === 'line' ? 'circle' : undefined,
          symbolSize: it.type === 'line' ? 6 : undefined
        }))
      }
      this.chart.setOption(option)
    }
  }
}
</script> 
<style lang="stylus" scoped>
  h3
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #303133;
</style>