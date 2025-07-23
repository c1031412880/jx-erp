<template>
  <div class="violation-type-analysis">
    <div style="display: flex; justify-content: flex-end; margin: 5px 0;">
      <el-radio-group v-model="dateType" size="mini" @change="loadData">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart-container" id="violation-type-chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce, getDate } from '@/utils/index'

export default {
  name: 'violation-type-analysis',
  props: {
    dept_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dateType: 1, // 1:月 2:年
      chartData: [],
      violationChart: null // 图表实例
    }
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        debounce(this.resizeChart(), 1000)
      })
    })
  },
  updated() {
    // 组件更新后重新渲染图表
    if (this.chartData.length > 0) {
      this.$nextTick(() => {
        this.initChart()
      })
    }
  },
  methods: {
    /**
     * 调整图表大小
     */
    resizeChart() {
      this.violationChart && this.violationChart.resize()
    },
    
    /**
     * 加载数据
     */
    loadData() {
      // 使用全局方法获取时间范围
      let timeRange
      if (this.dateType === 1) {
        // 月：获取本月时间范围
        timeRange = getDate('thisMonth')
      } else {
        // 年：获取本年时间范围
        timeRange = getDate('thisYear')
      }

      let params = {
        dept_id: this.dept_id,
        begin: timeRange.startTime + ' 00:00:00',
        end: timeRange.endTime + ' 23:59:59',
        date_type: this.dateType
      }

      this.$client.GetViolationTypeAnalysisInfo(params).then(res => {
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
        console.error('获取违章类型分析数据失败:', err)
        this.chartData = []
        this.initChart()
      })
    },

    /**
     * 初始化图表
     */
    initChart() {
      this.$nextTick(() => {
        const chartBox = document.getElementById('violation-type-chart')
        if (!chartBox) {
          console.warn('图表容器不存在')
          return
        }
        
        // 如果图表已存在，先销毁
        if (this.violationChart) {
          this.violationChart.dispose()
        }
        
        this.violationChart = echarts.init(chartBox)
        
        // 计算总数
        let total = this.chartData.reduce((sum, item) => {
          return sum + item.count
        }, 0)

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
              let item = this.chartData.find(item => item.name === name)
              if (item) {
                return name + ': ' + item.count + '次 ' + (item.rate * 100).toFixed(1) + '%'
              }
              return name
            },
          },
          series: [
            {
              name: '违章类型分析',
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
              data: this.chartData.length ? this.chartData.map(item => {
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
        
        this.violationChart.setOption(option)
        
        // 强制重新渲染
        setTimeout(() => {
          this.violationChart && this.violationChart.resize()
        }, 100)
      })
    }
  },
  beforeDestroy() {
    this.violationChart && this.violationChart.dispose()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.violation-type-analysis {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 单选按钮容器样式
  .el-radio-group {
    margin-bottom: 8px * $NumWidth;
  }
  
  .chart-container {
    width: 100%;
    height: 180px * $NumWidth;
    flex: 1;
  }
}

// 单选按钮样式优化
/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #FFF1F2;
  border: 1px solid #C61D29;
  color: #C61D29;
  -webkit-box-shadow: -1px 0 0 0 #C61D29;
  box-shadow: -1px 0 0 0 #C61D29;
}

/deep/ .el-radio-button__inner:hover {
  color: #ee6069;
}

/deep/ .el-radio-button__inner {
  font-size: 12px * $NumWidth;
  padding: 6px * $NumWidth 10px * $NumWidth;
  border-radius: 3px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 3px * $NumWidth 0 0 3px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 3px * $NumWidth 3px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style> 