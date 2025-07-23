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
      setOptions({ label,data } = {}) {
        this.chart.setOption({
          color: ['#409EFF'],
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data: label || ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                textStyle: {
                  color: '#666'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#999999'
                }
              }
            }
          ],
          yAxis : {
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          series: [
            {
              name: '事故次数',
              smooth: false,
              type: 'line',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 3
                  }
                }
              },
              data: data || [645,645,645,645,645,645,645,645,645,645],
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            }
          ]
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
  .online-chart
    width: 100%
    height: 100%
</style>
