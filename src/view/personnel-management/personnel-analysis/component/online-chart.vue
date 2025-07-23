<template>
  <div class="online-chart"></div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  export default {
    name: "line-chart",
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
            setTimeout(() => {
              this.chart.resize()
              // console.log('gaibianle+online');
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
      setOptions({ label, data, title, reg } = {}) {
        this.chart.setOption({
          // title: {
          //   text: this.label || '',
          //   textStyle: {
          //     color: '#333',
          //     fontWeight: 500
          //   },
          //   left: 'left'
          // },
          color: ['#409EFF'],
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '4%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data: label,
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
              },
              axisLabel: {    // 坐标轴标签
                show: true,  // 是否显示
                inside: false, // 是否朝内
                rotate: reg || 0, // 旋转角度
                margin: 10, // 刻度标签与轴线之间的距离
              },
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
              name: title || '',
              smooth: true,
              type: 'line',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 3
                  }
                }
              },
              data: data || [],
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
  .online-chart {
    width: 100%;
    height: 100%;
  }
</style>
