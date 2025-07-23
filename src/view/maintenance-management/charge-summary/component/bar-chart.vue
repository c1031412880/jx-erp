<template>
  <div class="line-chart"></div>
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
      let params = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          top: '8%',
          containLabel: true
        },
        legend: {
          data: ['车辆数', '充电总费用', '充电用量', '充电时长']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: label
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [],
      }
      let series = {
        series: []
      }
      Object.keys(data).forEach(key => {
        let series_item = {
          realtimeSort: true,
          name: key,
          type: 'bar',
          data: data[key],
          barGap: 0,
          label: key,
          emphasis: {
            focus: 'series'
          },
        }
        series.series.push(series_item)
      })
      Object.assign(params, series)
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
.line-chart
  width: 100%
  height: 100%
</style>
