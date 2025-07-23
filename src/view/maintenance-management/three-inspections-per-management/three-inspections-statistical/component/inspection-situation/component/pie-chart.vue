<template>
  <div class="pie-chart"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  name: "pie-chart",
  data() {
    return {
      chart: null,
      num: 0
    }
  },
  props:{
    title: [String]
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
    setOptions(data) {
      let params = {
        color: ['#F2637B','#3AA0FF','#36CBCB','#4ECB73','#FAD337'],
        title: {
          text: this.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          data: data || ['暂无数据'],
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: this.title,
            type: 'pie',
            radius: '55%',
            center: ['48%', '65%'],
            data: data || [
              {value:"0", name:'暂无数据'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }
           
        ],
      }
      this.chart.setOption(params)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.pie-chart
  width: 100%
  height: 100%
</style>
