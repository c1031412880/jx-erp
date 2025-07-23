<template>
  <div class="top-statistics-panel">
    <!-- 数据统计总览 -->
    <div class="statistics-header">
      <h3 class="section-title">
        <el-form :inline="true" size="mini">
          <el-row>
            <el-form-item label="部门:">
              <dept-select
                ref="departmentlTree"
                @on-change="deptChange"
                :size="'mini'"
              ></dept-select>
            </el-form-item>
            <el-form-item label="日期:">
              <el-date-picker
                v-model="selectedDate"
                type="date"
                placeholder="选择日期"
                size="mini"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="onDateChange"
                :style="datePickerStyle"
              ></el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>
      </h3>
    </div>

    <!-- 数据卡片区域 -->
    <div class="data-cards-grid">
      <div class="data-card" v-for="(card, index) in dataCards" :key="index">
        <div class="card-header">
          <div class="card-title-wrapper">
            <span class="card-title">{{ card.title }} </span>
            <!-- <span class="card-subtitle" v-if="card.subtitle">({{ card.subtitle }})</span> -->
          </div>
        </div>
        <div class="card-content">
          <div class="card-value">{{ card.value }} {{ card.subValue ? `(${card.subValue}%)` : '' }}</div>
          <div class="card-unit">{{ card.unit }}</div>
        </div>
        <div class="card-trend">
          <span class="trend-text">环比昨日</span>
          <span :class="['trend-value', card.trend > 0 ? 'trend-up' : 'trend-down']">
            <i :class="card.trend > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
            {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}%
          </span>
        </div>
        <!-- <div class="mini-chart" :ref="'miniChart' + index"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import deptSelect from "@/components/component/dept-select"
import responsiveMixin from '@/mixins/responsive'

export default {
  name: 'TopStatisticsPanel',
  mixins: [responsiveMixin],
  components: {
    deptSelect
  },
  props: {
    dataCards: {
      type: Array,
      default: () => []
    },
    selectedDeptId: {
      type: String,
      default: ''
    },
    selectedDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    }
  },
  data() {
    return {
      charts: []
    }
  },
  computed: {
    datePickerStyle() {
      return {
        width: this.isMobile ? '120px' : '140px'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMiniCharts()
    })
  },
  watch: {
    dataCards: {
      handler() {
        this.$nextTick(() => {
          this.initMiniCharts()
        })
      },
      deep: true
    }
  },
  methods: {
    // 部门选择变化事件
    deptChange(value) {
      this.$emit('dept-change', value || '')
    },

    // 日期选择变化事件
    onDateChange(value) {
      this.$emit('date-change', value)
    },

    // 初始化迷你图表
    initMiniCharts() {
      // 清理之前的图表实例
      this.charts.forEach(chart => chart.dispose())
      this.charts = []

      this.dataCards.forEach((card, index) => {
        const chartDom = this.$refs['miniChart' + index] ? this.$refs['miniChart' + index][0] : null
        if (chartDom) {
          const chart = echarts.init(chartDom)

          // 生成模拟数据
          const mockData = this.generateMockTrendData(card.dataKey)

          const option = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333',
                fontSize: 12
              },
              formatter: (params) => {
                if (params && params.length > 0) {
                  const param = params[0]
                  const date = param.name || '无数据'
                  const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value || '0'
                  return `${date}<br/>${card.title}: ${value} ${card.unit}`
                }
                return '无数据'
              }
            },
            grid: { top: 5, bottom: 5, left: 5, right: 5 },
            xAxis: { type: 'category', show: false, data: mockData.xAxis },
            yAxis: { type: 'value', show: false },
            series: [{
              type: 'line',
              data: mockData.values,
              smooth: true,
              lineStyle: { color: '#409EFF', width: 2 },
              areaStyle: { color: 'rgba(64, 158, 255, 0.2)' },
              showSymbol: false
            }]
          }

          chart.setOption(option)
          this.charts.push(chart)
        }
      })
    },

    // 生成模拟趋势数据
    generateMockTrendData(dataKey) {
      const today = new Date()
      const xAxis = []
      const values = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        xAxis.push(`${date.getMonth() + 1}/${date.getDate()}`)

        // 根据数据类型生成不同的模拟数据
        switch (dataKey) {
          case 'passenger_flow':
            values.push(5000 + Math.random() * 2000)
            break
          case 'completion_rate':
            values.push(95 + Math.random() * 5)
            break
          case 'mileage_utilization':
            values.push(90 + Math.random() * 10)
            break
          case 'total_revenue':
            values.push(4000 + Math.random() * 3000)
            break
          case 'punctuality_rate':
          case 'first_last_punctuality':
            values.push(95 + Math.random() * 5)
            break
          default:
            values.push(Math.random() * 100)
        }
      }

      return { xAxis, values }
    }
  },

  beforeDestroy() {
    // 销毁图表实例
    if (this.charts) {
      this.charts.forEach(chart => chart.dispose())
    }
  }
}
</script>

<style lang="stylus" scoped>
.top-statistics-panel
  background white
  border-radius 8px
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
  padding 12px
  margin-bottom 10px

  .statistics-header
    display flex
    align-items center
    margin-bottom 8px

    .section-title
      margin 0
      font-size 16px
      font-weight 600
      color #333
      display flex
      align-items center

  .data-cards-grid
    display grid
    grid-template-columns repeat(auto-fit, minmax(180px, 1fr))
    gap 8px

.data-card
  background white
  border-radius 6px
  padding 12px
  position relative
  display flex
  flex-direction column
  box-shadow 0 1px 4px rgba(0, 0, 0, 0.08)
  min-height 120px

  .card-header
    display flex
    justify-content space-between
    align-items center
    margin-bottom 8px

    .card-title-wrapper
      display flex
      align-items center
      flex-grow 1
      flex-direction column

    .card-title
      font-size 12px
      color #666
      font-weight 500
      line-height 1.2
      text-align center

    .card-subtitle
      font-size 10px
      color #999
      margin-top 2px

  .card-content
    display flex
    align-items baseline
    justify-content center
    margin-bottom 8px
    flex-shrink 0

    .card-value
      font-size 18px
      font-weight 700
      color #333
      margin-right 4px
      line-height 1.1
      text-align center

    .card-unit
      font-size 10px
      color #999
      font-weight 500

  .card-trend
    display flex
    align-items center
    justify-content center
    font-size 10px
    margin-bottom 8px
    flex-shrink 0

    .trend-text
      color #666
      margin-right 4px
      font-weight 500

    .trend-value
      display flex
      align-items center
      font-weight 600

      &.trend-up
        color #67C23A

      &.trend-down
        color #F56C6C

      i
        margin-right 2px

  .mini-chart
    height 25px
    width 100%
    flex 1
    margin-top auto

// 响应式设计
@media (max-width: 1400px)
  .data-cards-grid
    grid-template-columns repeat(3, 1fr)
    gap 10px
    
  .data-card
    min-height 140px

@media (max-width: 1200px)
  .data-cards-grid
    grid-template-columns repeat(2, 1fr)
    gap 10px

@media (max-width: 768px)
  .data-cards-grid
    grid-template-columns 1fr
    gap 8px
    
  .data-card
    min-height 100px
    padding 8px
    
    .card-title
      font-size 11px
      
    .card-value
      font-size 16px
</style> 