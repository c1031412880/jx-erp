<template>
  <div class="bar-chart" :id="id"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  name: "bar-chart",
  data() {
    return {
      chart: null,
      num: 0
    }
  },
  props:{
    title: [String],
    id: [String],
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions()
    },
    setOptions(xData,yData) {
      let params = {
        title: {
          text: this.title,
          // subtext: 'Fake Data',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          // data: this.seriesData.data || ['暂无数据'],
          orient: 'vertical',
          left: 'right'
        },
        xAxis: { 
          type: 'category',
          data: xData || [],
       },
        yAxis: {},
        series: yData || []
      }
      this.chart.setOption(params)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bar-chart
  width: 100%
  height: 100%
</style>
