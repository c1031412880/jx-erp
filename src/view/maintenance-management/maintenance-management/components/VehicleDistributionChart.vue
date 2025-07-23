<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>车辆各年各类型数量分布</h3>
       <dept-select v-if="showDeptSelector" :company-id="company" @on-change="handleCompanyChange" />
    </div>
    <div class="type" ref="type">
      <div v-for="(item, index) in dataList" :key="index">
        <div class="text">
          <countTo
            :startVal="0"
            :endVal="item.value"
            :duration="3000"
            :decimals="0"
            class="flop"
          ></countTo>
          <span class="company-unit">{{ item.unit }}</span>
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
    <div ref="echart" style="width: 100%; height: 80%"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import countTo from 'vue-count-to'
import DeptSelect from '@/components/component/dept-select'
export default {
  name: 'VehicleDistributionChart',
  components: { countTo, DeptSelect },
  props: {
    company: {
      type: String,
      default: ''
    },
    showDeptSelector: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      echart: null,
      dataList: [],
      data: {},
      chartData: {
        data_x: [],
        data_y: []
      }
    }
  },
  watch: {
    company() {
      this.loadData()
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    handleCompanyChange(value) {
      // 只有在显示部门选择器时才触发事件
      if (this.showDeptSelector) {
        this.$emit('company-change', value)
      }
    },
    async loadData() {
      this.chartData = this.$options.data().chartData
      let params = {
        single_id: window.newHttpConfig.TenantId || '1'
      }
      if (this.company) params.dept_id = this.company

      try {
        const res = await this.$reportApi.getvehiclemodeldistributiondtoasync(params)
        if (res.errcode == '200') {
          this.data = res.data
          this.dataList = this.data.total_fuel_num.map(item => ({
            name: item.fuels,
            value: item.nums,
            unit: '台'
          }))
          this.chartData.data_x = []
          this.chartData.data_y = []
          let obj = {}
          try {
            let year_fuel_num = this.data.year_fuel_num.sort((a, b) => {
              return a.year - b.year
            })
            this.chartData.data_x = year_fuel_num.map(item => item.year)
            this.dataList.forEach(item => {
              obj[item.name] = new Array(year_fuel_num.length).fill(0)
            })
            year_fuel_num.forEach((item, index) => {
              item.fuel_num.forEach(x => {
                obj[x.fuels][index] = x.nums
              })
            })
            this.chartData.data_y = Object.entries(obj)
          } catch (err) {
            console.log(err)
          }
          this.initChart()
        }
      } catch (error) {
        console.error('加载车辆分布数据失败:', error)
      }
    },
    initChart() {
      const colorList = [
          { colorStart: '#409EFF', colorEnd: '#79bbff' },
          { colorStart: '#67C23A', colorEnd: '#95d475' },
          { colorStart: '#E6A23C', colorEnd: '#eebe77' },
          { colorStart: '#F56C6C', colorEnd: '#f89898' },
          { colorStart: '#909399', colorEnd: '#b1b3b8' }
      ]
      
      if (this.echart) {
        this.echart.dispose()
      }

      this.echart = echarts.init(this.$refs.echart)
      let option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#e4e7ed',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          bottom: '5%',
          itemWidth: 14,
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          top: '6%',
          bottom: '20%',
          left: '10%',
          right: '5%',
          containLabel: false
        },
        xAxis: {
          type: 'category',
          data: this.chartData.data_x,
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
            color: '#333'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        },
        series: this.chartData.data_y.map((item, index) => ({
          name: item[0],
          type: 'bar',
          stack: 'Ad',
          data: item[1],
          itemStyle: {
            color: {
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colorList[index % colorList.length].colorStart
                },
                {
                  offset: 1,
                  color: colorList[index % colorList.length].colorEnd
                }
              ]
            }
          }
        }))
      }
      this.echart.setOption(option)
      window.addEventListener('resize', () => {
        if (this.echart) {
          this.echart.resize()
        }
      })
    }
  },
  beforeDestroy() {
    if (this.echart) {
      this.echart.dispose()
    }
  }
}
</script>
<style lang="stylus" scoped>
.chart-container
  background: white
  border-radius: 12px
  padding: 20px
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08)
  height: 420px
  border: 1px solid rgba(0, 0, 0, 0.05)
  display: flex
  flex-direction: column
.chart-header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 10px
  h3
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #303133;

.type
  display: flex
  align-items: center
  justify-content: space-around
  margin-bottom: 15px
  .text
    text-align: center
    .flop
      font-size: 24px
      font-family: DIN
      color: #409EFF
    .company-unit
      font-size: 10px
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif
      font-weight: 400
      color: #909399
  .name
    font-size: 12px
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif
    font-weight: 400
    color: #606266
    width: 80px
    text-align: center
</style>
