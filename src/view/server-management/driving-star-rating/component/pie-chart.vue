<template>
  <div class="pie-chart"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  name: "pie-chart",
  data() {
    return {
      chart: null,
      num: 0
    }
  },
  props:{
    seriesData:[Object]
  },
  mounted() {
    this.$nextTick(() => {
      // eventOn.$on('resize', () => {
      //   if (this.chart) {
      //     setTimeout(() => {
      //       this.chart.resize()
      //     }, 500)
      //   }
      // })
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
      if(!!this.seriesData) {
        this.setOptions()
      }
      
    },
    setOptions() {
      let params = {
        title: {
          text: this.seriesData.title,
          // subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          data: this.seriesData.data || ['暂无数据'],
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: this.seriesData.title,
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['48%', '65%'],
            data: this.seriesData.data.length >0? this.seriesData.data : [
              {value:"0", name:'暂无数据'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
           
        ],
      }
      console.log(params)
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
.pie-chart
  width: 100%
  height: 100%
</style>
