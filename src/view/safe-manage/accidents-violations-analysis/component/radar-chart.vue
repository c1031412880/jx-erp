<template>
  <div class="radar-chart"></div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  export default {
    name: "radar-chart",
    props: {
      title: '',
    },
    data() {
      return {
        chart: null,
        size: ''
      }
    },
    mounted() {
      let w = document.documentElement.clientWidth
      this.size = w / 1920 * 90
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
      setOptions({ names,data1,data2,titles = ['','']} = {}) {
        this.chart.setOption({
          title: {
            text: this.title,
            left:"center"
          },
          color: ['#409EFF'],
          grid: {
            top: "3%",
            left: '3%',
            right: '4%',
            bottom: '80',
            containLabel: true
          },
          tooltip: {},
          legend: {
            data: titles,
            bottom: 0,
            // top: 'center',
            orient: 'vertical',
          },
          radar: [
            {
              indicator: names || [{text:''}],
              center: ['50%', '50%'],
              radius: this.size,
              startAngle: 90,
              splitNumber: 4,
              shape: 'circle',
              name: {
                  formatter: '【{value}】',
                  textStyle: {
                      color: '#72ACD1'
                  }
              },
              splitArea: {
                  areaStyle: {
                      color: [
                          'rgba(255, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)',
                          ],
                      shadowColor: 'rgba(150,195,239,0.8)',
                      shadowBlur: 10
                  }
              },
              axisLine: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255, 0.5)'
                  }
              },
              splitLine: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255,1)'
                  }
              }
            },
          ],
          series: [
            {
              name: '雷达图',
              type: 'radar',
              emphasis: {
                lineStyle: {
                    width: 1
                }
              },
              data: [ 
                  {
                    value: data1 || [0],
                    name: titles[0],
                    symbol: 'none',
                    lineStyle: {
                        color: "rgba(131, 97, 235, 0.8)"
                    },
                    areaStyle: {
                      color: "rgba(131, 97, 235, 0.8)"
                    }
                  },
                  {
                    value: data2 || [0],
                    name: titles[1],
                    symbol: 'none',
                    lineStyle: {
                        color: 'rgba(73, 218, 194, 0.8)'
                    },
                    areaStyle: {
                      color: 'rgba(73, 218, 194, 0.8)'
                    },
                  }
              ]
            },
          ]
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .radar-chart
    width: 100%
    height: 100%
</style>
