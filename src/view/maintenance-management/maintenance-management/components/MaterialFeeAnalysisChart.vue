<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>维修材料费分析</h3>
      <div class="chart-controls">
        <el-radio-group v-model="materialClickIndex" size="mini" @change="changeMaterialType" style="margin-right: 10px;">
          <el-radio-button :label="1">材料费</el-radio-button>
          <el-radio-button :label="2">材料使用排名</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="materialFeeType" size="mini" @change="changeMaterialTimeType">
          <el-radio-button :label="1">月</el-radio-button>
          <el-radio-button :label="2">年</el-radio-button>
        </el-radio-group>
   
      </div>
    </div>
    <div class="chart-content">
      <div class="chart-wrapper">
        <div v-if="materialClickIndex == 1" ref="materialFeeChart" class="chart-inner"></div>
        <div v-if="materialClickIndex == 2" ref="materialRankingChart" class="chart-inner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'MaterialFeeAnalysisChart',
  props: {
    deptId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      materialFeeType: 2, // 默认按年统计
      materialClickIndex: 1, // 默认显示材料费
      materialFeeChart: null,
      materialRankingChart: null
    }
  },
  watch: {
    deptId() {
      this.loadMaterialFeeData()
    }
  },
  mounted() {
    this.loadMaterialFeeData()
  },
  methods: {
    // 材料费时间类型切换
    changeMaterialTimeType(type) {
      this.materialFeeType = type
      this.loadMaterialFeeData()
    },

    // 材料费分析类型切换
    changeMaterialType(index) {
      this.materialClickIndex = index
      this.loadMaterialFeeData()
    },

    // 加载材料费数据
    async loadMaterialFeeData() {
      try {
        const params = {
          type: this.materialFeeType,
          server_id: '60.191.59.11'
        }
        
        if (this.deptId) {
          params.dept_id = this.deptId
        }
        
        if (this.materialFeeType === 1) {
          const now_date = new Date()
          params.month = now_date.getFullYear() + '-' + String(now_date.getMonth() + 1).padStart(2, '0')
        }
        
        let res = null
        if(this.materialClickIndex === 1){
          res = await this.$client.GetMaterialFee(params)
        }else{
          res = await this.$client.GetMateriarStatistic(params)
        }
        
        if (res.head.result === '200') {
          if (this.materialClickIndex === 1) {
            this.renderMaterialFeeChart(res.context || {})
          } else {
            this.renderMaterialRankingChart(res.context || {})
          }
        }
      } catch (error) {
        console.error('加载材料费数据失败:', error)
        // 使用模拟数据
        if (this.materialClickIndex === 1) {
          const mockData = {
            fee_total: [
              { month: '2024-01', fee: 120000 },
              { month: '2024-02', fee: 135000 },
              { month: '2024-03', fee: 128000 },
              { month: '2024-04', fee: 142000 },
              { month: '2024-05', fee: 155000 },
              { month: '2024-06', fee: 148000 }
            ]
          }
          this.renderMaterialFeeChart(mockData)
        } else {
          const mockRankingData = {
            material_ranking: [
              { name: '刹车片', usage: 450, cost: 85000 },
              { name: '机油', usage: 320, cost: 65000 },
              { name: '轮胎', usage: 280, cost: 120000 },
              { name: '空滤', usage: 220, cost: 35000 },
              { name: '电瓶', usage: 180, cost: 95000 }
            ]
          }
          this.renderMaterialRankingChart(mockRankingData)
        }
      }
    },

    // 渲染材料费图表
    renderMaterialFeeChart(data) {
      this.$nextTick(() => {
        const chartDom = this.$refs.materialFeeChart
        if (chartDom) {
          if (this.materialFeeChart) {
            this.materialFeeChart.dispose()
          }
          this.materialFeeChart = echarts.init(chartDom)
          
          const fee_total = data.fee_total || []
          const xData = fee_total.map(x => x.month)
          const yData = fee_total.map(x => x.fee)

          const option = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333'
              }
            },
            grid: {
              top: '10%',
              left: '8%',
              right: '5%',
              bottom: '15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: xData,
              axisLabel: {
                color: '#333'
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                color: '#333',
                formatter: value => {
                  if (value >= 10000) {
                    return (value / 10000).toFixed(1) + '万'
                  }
                  return value
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f5f7fa'
                }
              }
            },
            series: [{
              name: '材料费',
              type: 'line',
              data: yData,
              symbol: 'circle',
              symbolSize: 6,
              smooth: true,
              lineStyle: {
                color: '#409EFF',
                width: 3
              },
              itemStyle: {
                color: '#409EFF'
              },
              areaStyle: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(64, 158, 255, 0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(64, 158, 255, 0.05)'
                    }
                  ]
                }
              }
            }]
          }
          this.materialFeeChart.setOption(option)
        }
      })
    },

    // 渲染材料使用排名图表
    renderMaterialRankingChart(data) {
      this.$nextTick(() => {
        const chartDom = this.$refs.materialRankingChart
        if (chartDom) {
          if (this.materialRankingChart) {
            this.materialRankingChart.dispose()
          }
          this.materialRankingChart = echarts.init(chartDom)
          
          const material_ranking = data.material_ranking || []
          const names = material_ranking.map(x => x.name)
          const usageData = material_ranking.map(x => x.usage)
          const costData = material_ranking.map(x => x.cost)

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333'
              }
            },
            legend: {
              data: ['使用次数', '总成本'],
              top: '5%',
              textStyle: {
                color: '#333'
              }
            },
            grid: {
              top: '15%',
              left: '8%',
              right: '8%',
              bottom: '15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: names,
              axisLabel: {
                color: '#333',
                rotate: 30
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              }
            },
            yAxis: [
              {
                type: 'value',
                name: '使用次数',
                position: 'left',
                axisLabel: {
                  color: '#333'
                },
                axisLine: {
                  lineStyle: {
                    color: '#e4e7ed'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#f5f7fa'
                  }
                }
              },
              {
                type: 'value',
                name: '总成本(元)',
                position: 'right',
                axisLabel: {
                  color: '#333',
                  formatter: value => {
                    if (value >= 10000) {
                      return (value / 10000).toFixed(1) + '万'
                    }
                    return value
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#e4e7ed'
                  }
                }
              }
            ],
            series: [
              {
                name: '使用次数',
                type: 'bar',
                yAxisIndex: 0,
                data: usageData,
                itemStyle: {
                  color: '#409EFF'
                },
                barWidth: 30
              },
              {
                name: '总成本',
                type: 'line',
                yAxisIndex: 1,
                data: costData,
                lineStyle: {
                  color: '#67C23A',
                  width: 3
                },
                itemStyle: {
                  color: '#67C23A'
                },
                symbol: 'circle',
                symbolSize: 6
              }
            ]
          }
          this.materialRankingChart.setOption(option)
        }
      })
    }
  },
  beforeDestroy() {
    if (this.materialFeeChart) {
      this.materialFeeChart.dispose()
    }
    if (this.materialRankingChart) {
      this.materialRankingChart.dispose()
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 420px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-shrink: 0;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #303133;
  }
  
  .chart-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.chart-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .chart-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .chart-inner {
      width: 100%;
      height: 100%;
    }
  }
}

// 统一radio-button样式
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
</style>