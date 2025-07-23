<template>
  <div class="play-chart"></div>
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

    },
    mounted() {
      this.$nextTick(() => {
        eventOn.$on('view-resize' + this.$route.fullPath, () => {
          if (this.chart) {
            setTimeout(() => {
              this.chart.resize()
              console.log('gaibianle+play');
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
            top: '3%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          legend: {
            data: label || ['暂无数据'],
            left: 'right',
            type: 'scroll',
            icon: "circle",
            align:'left',
            top: '5%',
            orient: 'vertical',
            formatter: function(name) {
              let count = ''
              let value = ''
              if (data) {
                data.forEach(item => {
                  if (item.name == name) {
                    count = item.count
                    value = item.rate
                  }
                });
              }

              return `${name}：${count}(${value})`
            },
          },
          series: [{
            type: 'pie',
            avoidLabelOverlap: false,
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            label: {
              show: false,
              formatter: '{b}: {d}%',
              align: 'left'
            },
            labelLine: {
              smooth: false
            },
            data:data || [
              {value:1, name:'暂无数据'},
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDuration: 3000, //初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果//初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果
            animationDelay: function () {
                return Math.random() * 200;
            }
          }]
        }
        let graphic = {
          graphic: {
            type: 'group',
            left: 'center',
            top: 'center',
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
  .play-chart {
    width: 100%;
    height: 100%;
  }
</style>
