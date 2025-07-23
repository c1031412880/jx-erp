<template>
  <div class="play-chart" v-loading="loading">
    <p style="text-align: left;font-size: 16px;line-height: 25px">{{label}}</p>
    <div :class="label ? 'chart-head' : 'chart'" ref="platChart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  export default {
    name: "play-chart",
    data() {
      return {
        chart: null,
        loading: false,
        num: 0
      }
    },
    props: {
      label: {
        type: String,
        default: ''
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
        this.chart = echarts.init(this.$refs.platChart, 'macarons')
        this.setOptions({})
      },
      setOptions({ label, data, num, title } = {}) {
        let option = {
          // title: {
          //   text: this.label || '',
          //   textStyle: {
          //     color: '#333',
          //     fontWeight: 500
          //   },
          //   left: ''
          // },
          grid: {
            top: '1%',
            left: '3%',
            right: '3%',
            bottom: '1%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            data: label || ['暂无数据'],
            type: 'scroll',
            top: '1%',
            orient: 'horizontal'
          },
          series: [{
            name: this.label || '',
            type: 'pie',
            avoidLabelOverlap: false,
            radius: ['45%', '60%'],
            center: ['50%', '55%'],
            label: {
              formatter: '{b}: {d}%',
              position:'outer',
              alignTo:'edge',
              margin:10
            },
            labelLine: {
              smooth: true
            },
            data:data || [
              {value:1, name:'暂无数据'},
            ]
          }]
        }
        let graphic = {
          graphic: {
            type: 'group',
            left: 'center',
            top: '50%',
            children: [
              {
                type: 'text',
                left: 'center',
                top: '8%',
                style: {
                  text: title || '',
                  textAlign: 'center',
                  fill: '#333',
                  fontSize: 13,
                  fontWeight: 500
                }
              },
              {
                type: 'text',
                left: 'center',
                top: '25',
                style: {
                  text: num || '0',
                  textAlign: 'center',
                  fill: '#333',
                  fontSize: 16,
                  fontWeight: 600
                }
              }
            ]
          }
        }
        if (title) {
          Object.assign(option, graphic)
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
  .play-chart
    width: 100%
    height: 100%
    .chart-head{
      height: calc(100% - 25px);
      width: 100%;
    }
    .chart{
      height:100%;
      width: 100%;
    }
</style>
