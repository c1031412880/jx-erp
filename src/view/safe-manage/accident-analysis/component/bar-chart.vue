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
  mounted() {
    this.$nextTick(() => {
      eventOn.$on('view-resize' + this.$route.fullPath, () => {
        if (this.chart) {
          setTimeout(() => {
            this.chart.resize()
          }, 500)
        }
      })
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
    setOptions({ label,data } = {}) {
      this.chart.setOption({
        xAxis: {
          max: 'dataMax',
        },
        grid: {
          left: '2%',
          right: '4%',
          top: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: {
          type: 'category',
          data: label || ['A', 'B', 'C', 'D', 'E'],
          inverse: true,
          animationDuration: 100,
          animationDurationUpdate: 100,
        },
        series: [{
          realtimeSort: true,
          name: '次数',
          type: 'bar',
          data: data || [0,0,0,0,0],
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }],
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      })
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
