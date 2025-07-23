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
        chart: null
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
        this.setOptions()
      },
      setOptions({ label, data, title } = {}) {
        this.chart.setOption({
          color: ['#409EFF'],
          title: {
            text: title || '',
            textStyle: {
              color: '#333',
              fontWeight: 600
            }
          },
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
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
            name:'报警数',
            type:'bar',
            barWidth: '60%',
            data: data || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          }]
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .bar-chart
    width: 100%
    height: 100%
</style>
