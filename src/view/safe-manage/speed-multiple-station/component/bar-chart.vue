<template>
  <div class="bar-chart"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  name: "bar-chart",
  props: {
  },
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
          console.log('111');
          setTimeout(() => {
            this.chart.resize()
            console.log('gaibianle+bar');
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
      this.setOptions([], [])
    },
    setOptions(label, data) {
      window.onresize =  this.chart.resize()
      let option = {
        // legend:{
        //   bottom: 'bottom',  // 图列相对容器的位置 top\bottom\left\right
        //   data: title || ['暂无数据'],    //图列内容
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: label,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            show: true,
            rotate: 30,
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#666'
            }
          }
        },
        series: [
          {
            name: '超速次数',
            type: 'bar',
            barWidth: '60%',
            data: data,
          }
        ]
      }
      this.chart.setOption(option)
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
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
