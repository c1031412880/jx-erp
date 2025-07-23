<template>
  <div class="accident-duty">
    <!-- 上部分：走马灯数据 -->
    <div class="duty-marquee">
      <div class="marquee-item">
        <div class="marquee-value">{{ dutyData.accident_duty_count || 0 }}</div>
        <div class="marquee-label">有责事故</div>
      </div>
      <div class="marquee-item">
        <div class="marquee-value">{{ dutyData.accident_duty_count_last || 0 }}</div>
        <div class="marquee-label">同期</div>
      </div>
      <div class="marquee-item">
        <div class="marquee-value">{{ dutyData.accident_duty_count_yoy || 0 }}%</div>
        <div class="marquee-label">同比</div>
      </div>
      <div class="marquee-item">
        <div class="marquee-value">{{ dutyData.accident_duty_rate || 0 }}%</div>
        <div class="marquee-label">责任事故率</div>
      </div>
    </div>
    
    <!-- 下部分：雷达图 -->
    <div class="radar-container" id="accident-duty-radar-chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

export default {
  name: 'accident-duty',
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
      dutyData: {},
      radarChart: null
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
      this.radarChart && this.radarChart.resize()
    },
    /**
     * 加载数据
     */
    loadData() {
      let params = {
        dept_id: this.dept_id,
        date_type: this.dateType
      }
      this.$client.GetAccidentDutyInfo(params).then(res => {
        if (res.head.result == '200') {
          this.dutyData = res.context || {}
          this.initRadarChart()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
          this.dutyData = {}
          this.initRadarChart()
        }
      }).catch(err => {
        console.error('获取事故责任数据失败:', err)
        this.dutyData = {}
        this.initRadarChart()
      })
    },

    /**
     * 初始化雷达图
     */
    initRadarChart() {
      this.$nextTick(() => {
        const chartBox = document.getElementById('accident-duty-radar-chart')
        if (!chartBox) {
          console.warn('事故责任雷达图容器不存在')
          return
        }
        
        // 如果图表已存在，先销毁
        if (this.radarChart) {
          this.radarChart.dispose()
        }
        
        this.radarChart = echarts.init(chartBox)
        
        const option = {
          color: [
            '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',
            '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
          ],
          tooltip: {
            trigger: 'item',
            backgroundColor: '#222222',
            textStyle: {
              color: '#FFFFFF'
            }
          },
          legend: {
            data: ['今年', '去年'],
            right: 10,
            top: 'center',
            orient: 'vertical',
            textStyle: {
              color: '#666666',
              fontSize: 12
            }
          },
          radar: {
            indicator: this.dutyData.names ? this.dutyData.names.map(name => ({
              name: name,
              max: Math.max(...(this.dutyData.counts || []), ...(this.dutyData.counts_last || [])) * 1.2 || 100
            })) : [],
            center: ['40%', '50%'],
            radius: '60%',
            name: {
              textStyle: {
                color: '#666666',
                fontSize: 12
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
              }
            }
          },
          series: [
            {
              name: '事故责任分析',
              type: 'radar',
              data: [
                {
                  value: this.dutyData.counts || [],
                  name: '今年',
                  itemStyle: {
                    color: '#A0BEFF'
                  },
                  lineStyle: {
                    color: '#A0BEFF'
                  },
                  areaStyle: {
                    color: 'rgba(160, 190, 255, 0.3)'
                  }
                },
                {
                  value: this.dutyData.counts_last || [],
                  name: '去年',
                  itemStyle: {
                    color: '#CFA0FF'
                  },
                  lineStyle: {
                    color: '#CFA0FF'
                  },
                  areaStyle: {
                    color: 'rgba(207, 160, 255, 0.3)'
                  }
                }
              ]
            }
          ]
        }
        
        this.radarChart.setOption(option)
        
        // 强制重新渲染
        setTimeout(() => {
          this.radarChart && this.radarChart.resize()
        }, 100)
      })
    }
  },
  beforeDestroy() {
    this.radarChart && this.radarChart.dispose()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.accident-duty {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .duty-marquee {
    display: flex;
    justify-content: space-around;
    padding: 10px * $NumWidth 0;
    background: #f5f7fa;
    border-radius: 4px;
    
    .marquee-item {
      text-align: center;
      
      .marquee-value {
        font-size: 24px * $NumWidth;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px * $NumWidth;
      }
      
      .marquee-label {
        font-size: 12px * $NumWidth;
        color: #666;
      }
    }
  }
  
  .radar-container {
    width: 100%;
    height: 140px * $NumWidth;
    flex: 1;
  }
}
</style> 