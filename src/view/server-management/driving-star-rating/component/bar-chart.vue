<template>
  <div class="bar-chart"></div>
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
    sourceData:[Object]
  },
  mounted() {
    this.$nextTick(() => {
      // eventOn.$on('resize', () => {
      //   if (this.chart) {
      //     setTimeout(() => {
      //       this.chart.resize()
      //     }, 500)
      //   }
      // })
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
    setOptions() {
      let params = {
        title: {
          text: '',
          // subtext: 'Fake Data',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          // data: this.seriesData.data || ['暂无数据'],
          orient: 'vertical',
          left: 'right'
        },
        dataset: {
          source: this.sourceData.source
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: this.sourceData.series
      }
      console.log(params)
      this.chart.setOption(params)
      this.chart.on(
          "click", (param) => {
            this.num++
            if (this.num === 2) {
              this.num = 0
              this.$emit("item-click" , param)
            }
          }
        )
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bar-chart
  width: 100%
  height: 100%
</style>
