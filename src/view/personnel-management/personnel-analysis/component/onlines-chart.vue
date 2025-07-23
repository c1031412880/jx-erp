<template>
  <div class="onlines-chart"></div>
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
      setOptions({ label, data1, data2,data3, title } = {}) {
        // console.log(label, data1,data2, title );
        let option = {
          title: {
            text: '近六月趋势',
            textStyle: {
              color: '#333',
              fontSize: 12,
            },
            left: 30
          },
          legend: {
            top: 10,
            data: title || ['暂无数据'],
          },
          color: ['#409EFF', '#2FC25B'],
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '10%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data: label || ['1月', '2月', '3月', '4月', '5月', '6月'],
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
                rotate: 0, // 旋转角度
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
              // name: title || '',
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
              data: data1 || [0,0,0,0,0,0],
              animationDuration: 2800,
              animationEasing: 'linear'
            },
            {
              // name: title || '',
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
              data: data2 || [0,0,0,0,0,0],
              animationDuration: 2800,
              animationEasing: 'linear'
            },
            {
              // name: title || '',
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
              data: data3 || [0,0,0,0,0,0],
              animationDuration: 2800,
              animationEasing: 'linear'
            }
          ]
        }
        if(!!title) {
          option.series.forEach((item, index) => {
            item.name = title[index]
          })
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
  .onlines-chart {
    width: 100%;
    height: 100%;

    div {
      width: 100%;
      height: 100%;
    }
  }
</style>
