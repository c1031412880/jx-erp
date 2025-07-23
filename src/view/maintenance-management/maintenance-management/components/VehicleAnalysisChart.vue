<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>车辆分析</h3>
      <div class="chart-controls">
        <dept-select
          v-if="showDeptSelector"
          :value="filters.deptId"
          @on-change="handleDeptChange"
          :size="'mini'"
          style="width: 140px; margin-right: 10px;"
          clearable>
        </dept-select>
        <el-date-picker
          v-model="filters.selectedMonth"
          type="month"
          placeholder="选择月份"
          size="mini"
          style="width: 140px;"
          format="yyyy-MM"
          value-format="yyyy-MM"
          @change="handleMonthChange">
        </el-date-picker>
      </div>
    </div>
    <div class="chart-content vehicle-analysis-layout">
      <div class="vehicle-switch">
        <el-radio-group v-model="analysisType" size="mini" @change="handleTypeChange">
          <el-radio-button :label="1">能源</el-radio-button>
          <el-radio-button :label="2">品牌</el-radio-button>
          <el-radio-button :label="3">标台系数</el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart-wrapper">
        <div ref="vehicleAnalysisChart" class="chart-inner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import DeptSelect from '@/components/component/dept-select.vue'
import { debounce } from 'lodash'

export default {
  name: 'VehicleAnalysisChart',
  components: {
    DeptSelect
  },
  props: {
    analysisType: {
      type: Number,
      default: 1
    },
    filters: {
      type: Object,
      default: () => ({
        deptId: null,
        selectedMonth: null
      })
    },
    departmentOptions: {
      type: Array,
      default: () => []
    },
    showDeptSelector: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      chartData: [], // 用于存储图表数据
      resizeHandler: null,
    }
  },
  mounted() {
    this.loadVehicleAnalysisData()
    this.resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    handleTypeChange(type) {
      this.$emit('type-change', type)
      this.$nextTick(() => {
        this.loadVehicleAnalysisData()
      })
    },
    
    handleDeptChange(value) {
      // 只有在显示部门选择器时才触发事件
      if (this.showDeptSelector) {
        this.$emit('filter-change', { 
          ...this.filters, 
          deptId: value 
        })
        this.$nextTick(() => {
          this.loadVehicleAnalysisData()
        })
      }
    },
    
    handleMonthChange(value) {
      this.$emit('filter-change', { 
        ...this.filters, 
        selectedMonth: value 
      })
      this.$nextTick(() => {
        this.loadVehicleAnalysisData()
      })
    },

    // 加载车辆分析数据
    async loadVehicleAnalysisData() {
      const apiMap = {
        1: { key: 'getalarmmonitoroperateratedtoasync', dataField: 'vehicle_operate_info', nameField: 'operate_name', valueField: 'vehicle_num', rateField: 'operate_rate' },
        2: { key: 'getdigitalvehiclebranddtolistasync', dataField: null, nameField: 'brand_name', valueField: 'vehicle_num', rateField: 'brand_rate' },
        3: { key: 'getdigitalplatformcoefficientdtolistasync', dataField: null, nameField: 'coefficient', valueField: 'vehicle_num', rateField: 'coefficient_rate' }
      }

      const targetApi = apiMap[this.analysisType]
      if (!targetApi) return

      try {
        let params = {
          single_id: window.newHttpConfig.TenantId || '1'
        };
        if (this.filters.deptId) {
          params.dept_id = this.filters.deptId
        }
        if (this.filters.selectedMonth) {
          params.month = this.filters.selectedMonth
        }

        const res = await this.$reportApi[targetApi.key](params)
        
        let info = targetApi.dataField ? res.data[targetApi.dataField] : res.data;
        if (info && Array.isArray(info)) {
          this.chartData = info.map(x => ({
            name: x[targetApi.nameField],
            value: x[targetApi.valueField],
            rate: x[targetApi.rateField]
          }))
          this.renderVehicleAnalysisChart()
        } else {
          this.chartData = []
          this.renderVehicleAnalysisChart() // 渲染空图表
        }
      } catch (error) {
        console.error(`加载车辆分析数据失败 (type: ${this.analysisType}):`, error)
        this.chartData = []
        this.renderVehicleAnalysisChart() // 出错时也渲染空图表
      }
    },

    // 渲染车辆分析图表
    renderVehicleAnalysisChart() {
      if (!this.$refs.vehicleAnalysisChart) return
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.vehicleAnalysisChart)
      }
      
      const colorList = [
        { colorStart: '#16B0A9', colorEnd: '#16B0A9' },
        { colorStart: '#FFF100', colorEnd: '#FAA53F' },
        { colorStart: '#4DD8FF', colorEnd: '#0078FA' },
        { colorStart: '#B792F1', colorEnd: '#801ED6' },
        { colorStart: '#FFD33B', colorEnd: '#F06B1D' },
        { colorStart: '#EB7375', colorEnd: '#F3EED9' },
        { colorStart: '#B7F98F', colorEnd: '#F9F871' }
      ]

      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'plain',
          orient: 'horizontal',
          bottom: '10%',
          left: '5%', 
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 12,
          textStyle: {
            color: '#333',
            fontSize: 14,
            width: 110, // 限制图例文字宽度
            overflow: 'truncate', // 超出宽度时显示省略号
          },
          tooltip: {
            show: true, // 鼠标悬浮时显示完整图例名称
          },
          formatter: name => {
            const item = this.chartData.find(item => item.name === name)
            if (item) {
              const rate = item.rate ? `(${(item.rate * 100).toFixed(2)}%)` : ''
              return `${item.name} (${item.value}) ${rate}`
            }
            return name
          }
        },
        series: [{
          type: 'pie',
          radius: ['35%', '55%'],
          center: ['55%', '40%'],
          avoidLabelOverlap: true,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            normal: {
              color: (params) => {
                let fullColorList = [...colorList]
                // 自动扩展颜色列表以避免echarts因颜色不足而报错
                if (fullColorList.length < this.chartData.length) {
                    const times = Math.ceil(this.chartData.length / fullColorList.length)
                    const baseColors = [...fullColorList]
                    for (let i = 1; i < times; i++) {
                        fullColorList.push(...baseColors)
                    }
                }
                const index = params.dataIndex % fullColorList.length;
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: fullColorList[index]['colorStart'] },
                  { offset: 1, color: fullColorList[index]['colorEnd'] }
                ])
              }
            }
          },
          data: this.chartData
        }]
      }
      this.chart.setOption(option, true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container
  background: white
  border-radius: 8px
  padding: 20px
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)
  border: 1px solid #EBEEF5
  height: 420px // 调整以适应内容
  display: flex
  flex-direction: column
  
  .chart-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 20px
    flex-shrink: 0
    
    h3
      font-size: 18px
      font-weight: 600
      margin: 0
      color: #303133
      
    .chart-controls
      display: flex
      align-items: center

.vehicle-analysis-layout
  display: flex
  flex-direction: column
  width: 100%
  flex: 1
  min-height: 0

.vehicle-switch
  display: flex
  justify-content: center
  margin-bottom: 15px
  
  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner
    background-color: #FFF1F2
    border: 1px solid #C61D29
    color: #C61D29
    -webkit-box-shadow: -1px 0 0 0 #C61D29
    box-shadow: -1px 0 0 0 #C61D29
    
  /deep/ .el-radio-button__inner:hover
    color: #ee6069

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
</style> 