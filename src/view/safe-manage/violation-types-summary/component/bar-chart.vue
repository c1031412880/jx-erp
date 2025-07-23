<template>
  <div class="online-chart"></div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  export default {
    name: "line-chart",
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
      setOptions({ label,title,data } = {}) {
        this.chart.setOption({
          color: ['#409EFF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            data: title || []
          },
          xAxis : [
            {
              type : 'category',
              data: label || [],
              axisLabel: {
                interval: 0
              },
              // axisTick: {
              //   alignWithLabel: true
              // },
              // axisLabel: {
              //   textStyle: {
              //     color: '#666'
              //   }
              // },
              // axisLine: {
              //   lineStyle: {
              //     color: '#999999'
              //   }
              // }
            }
          ],
          yAxis : [{
            type: 'value'
          }],
          dataZoom:[
            {
              // 滚动条以及缩放
              type: "inside",
              startValue: 0, // 从头开始。
              endValue: 7,  // 最多5
            },
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          series: data || []
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .online-chart
    width: 100%
    height: 100%
</style>
