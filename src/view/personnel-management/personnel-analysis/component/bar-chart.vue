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
      this.setOptions()
    },
    setOptions({ label, data1, data2, title } = {}) {
      let option = {
        legend:{
          bottom: 'bottom',  // 图列相对容器的位置 top\bottom\left\right
          data: title || ['暂无数据'],    //图列内容
        },
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
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: label || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisTick: {
            alignWithLabel: true
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
            data: data1,
            // name: title[0] || '暂无数据',
            type: 'bar',
            barWidth: '28%',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDuration: 2000, //初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果//初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果
            animationDelay: function () {
                return Math.random() * 200;
            }
          },
          {
            data: data2,
            // name: title[1] || '暂无数据',
            type: 'bar',
            barWidth: '28%',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDuration: 3000, //初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果//初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果
            animationDelay: function () {
                return Math.random() * 200;
            }
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
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
