<template>
  <div class="play-chart" v-loading="loading">
    <div ref="platChart" style="width: 100%;height: 100%;"></div>
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
        num: 0,
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
        this.chart.setOption({
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
            formatter: "{b}<br/>{c} ({d}%)"
          },
          legend: {
            data: label || ['暂无数据'],
            right: 10,
            top: 'center',
            bottom: 20,
            orient: 'vertical',
            formatter: function (name) {
              if (name.length > 6) {
                name = name.slice(0,6) + '..'
              }
              return name
            }
          },
          series: [{
            name: this.label || '',
            type: 'pie',
            avoidLabelOverlap: false,
            radius: '50%',
            center: ['40%', '50%'],
            minAngle: 25,
            label: {
              formatter: function (params) {
                let name = params.name
                if (name.length > 6) {
                  name = name.slice(0,6) + '..'
                }
                return name
              },
              alignTo:'edge',
              margin:10
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
              align:'right'
            },
            labelLine: {
              smooth: true
            },
            data:
            data || 
            [
              {value:1, name:'暂无数据'},
            ]
          }]
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .play-chart{
    width: 100%;
    height: 100%;
    position:relative;
  }
</style>
