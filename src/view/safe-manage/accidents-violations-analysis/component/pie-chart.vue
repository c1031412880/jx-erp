<template>
  <div class="play-chart" v-loading="loading">
    <div ref="platChart" style="width: 100%;height: 100%;"></div>
    <div class="main">
      <p class="title">占比最大原因</p>
      <p class="reason">{{ reason }}</p>
    </div>
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
        reason: ''
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
        if (data) {
          data.sort((a,b) => {
            return b.value - a.value
          })
          this.reason = data[0].name
        }

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
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            data: label || ['暂无数据'],
            right: 0,
            top: 'center',
            bottom: 20,
            orient: 'vertical',
            formatter: function(name) {
              let rate = ''
              let value = ''
              if (data) {
                data.forEach(item => {
                  if (item.name == name) {
                    rate = item.rate
                    value = item.value
                  }
                });
              }
              return `${name}  ${rate}  ${value}`
            },
          },
          series: [{
            name: this.label || '',
            type: 'pie',
            avoidLabelOverlap: false,
            radius: ['50%', '70%'],
            center: ['50%', '55%'],
            label: {
                show: false,
                position: 'center'
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
              align:'right'
            },
            labelLine: {
              smooth: false
            },
            data:data || [
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
    .main {
      position:absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -55%);
      text-align: center;
      .title {
        color: #999;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .reason { 
        color: #333;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
</style>
