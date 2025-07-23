<template>
  <div class="accident-reason">
    <div class="chart-container" id="accident-reason-chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

export default {
  name: 'accident-reason',
  props: {
    dept_id: {
      type: Number,
      default: 0
    },
    dateType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      chartData: [],
      accidentChart: null
    }
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        debounce(this.resizeChart(), 1000)
      });
    })
  },
  watch: {
    dept_id() {
      this.loadData()
    },
    dateType() {
      this.loadData()
    }
  },
  methods: {
    resizeChart() {
      this.accidentChart && this.accidentChart.resize()
    },
    /**
     * 加载数据
     */
    loadData() {
      let params = {
        dept_id: this.dept_id,
        date_type: this.dateType
      }
      this.$client.GetAccidentReasonAnalysis(params).then(res => {
        if (res.head.result == '200') {
          this.chartData = res.context || []
          this.initChart()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
          this.chartData = []
          this.initChart()
        }
      }).catch(err => {
        console.error('获取事故原因数据失败:', err)
        this.chartData = []
        this.initChart()
      })
    },

    /**
     * 初始化图表
     */
    initChart() {
      this.$nextTick(() => {
        const chartBox = document.getElementById('accident-reason-chart')
        if (!chartBox) {
          console.warn('事故原因图表容器不存在')
          return
        }
        
        // 如果图表已存在，先销毁
        if (this.accidentChart) {
          this.accidentChart.dispose()
        }
        
        this.accidentChart = echarts.init(chartBox)
        
        // 过滤掉name为null的数据
        const validData = this.chartData.filter(item => item.name)
        
        const option = {
          color: [
            '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',
            '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
          ],
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            backgroundColor: '#222222',
            textStyle: {
              color: '#FFFFFF'
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: '0',
            top: 'center',
            padding: [20, 0, 0, 0],
            icon: 'circle',
            itemGap: 5,
            itemWidth: 8,
            itemHeight: 8,
            pageIconSize: [10, 10],
            textStyle: {
              color: '#666666',
              fontSize: 12,
              fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN-Regular',
            },
            formatter: (name) => {
              let item = validData.find(item => item.name === name)
              if (item) {
                return name + ': ' + item.count + '次 ' + (item.rate * 100).toFixed(1) + '%'
              }
              return name
            },
          },
          series: [
            {
              name: '事故原因分析',
              type: 'pie',
              radius: ['40%', '60%'],
              center: ['25%', '50%'],
              avoidLabelOverlap: false,
              padAngle: 5,
              itemStyle: {
                borderRadius: 10
              },
              label: {
                show: false,
                position: 'center'
              },
              data: validData.length ? validData.map(item => {
                return {
                  value: item.count,
                  name: item.name,
                  rate: item.rate
                }
              }) : [
                {value: 0, name: '暂无数据'},
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        }
        
        this.accidentChart.setOption(option)
        
        // 强制重新渲染
        setTimeout(() => {
          this.accidentChart && this.accidentChart.resize()
        }, 100)
      })
    }
  },
  beforeDestroy() {
    this.accidentChart && this.accidentChart.dispose()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.accident-reason {
  height: 100%;
  
  .chart-container {
    width: 100%;
    height: 280px * $NumWidth;
  }
}
</style> 