<template>
  <div class="line-chart"></div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  export default {
    name: "line-chart",
    data() {
      return {
        chart: null
      }
    },
    props: {
      color: {
        type: String,
        default: '#409EFF'
      },
      smooth: {
        type: Boolean,
        default: true
      }
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
        this.setOptions(this.chartData)
      },
      setOptions({ label, data } = {}) {
        this.chart.setOption({
          // xAxis: {
          //   type: 'category',
          //   boundaryGap: false,
          //   data: label || ['6-1','6-2','6-3','6-4','6-5','6-6','6-7','6-8','6-9','6-10'],
          //   show: false
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data: label || ['1','2','3','4','5','6','7','8','9','10'],
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
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
          series: [{
            areaStyle: {},
            smooth: this.smooth,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: this.color,
                lineStyle: {
                  color: this.color,
                  width: 2
                }
              }
            },
            type: 'line',
            data: data || [1,1,1,1,1,1,1,1,1,1],
          }]
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .line-chart
    width: 100%
    height: 100%
</style>
