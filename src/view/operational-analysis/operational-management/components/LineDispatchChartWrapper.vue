<template>
  <el-row :gutter="10" class="chart-row">
    <el-col :span="24">
      <LineDispatchChart 
        :chartData="lineDispatchData"
        @export-data="exportData"
        @type-change="handleLineDispatchTypeChange"
        @data-change="handleLineDispatchDataChange"
      />
    </el-col>
  </el-row>
</template>

<script>
import LineDispatchChart from './LineDispatchChart.vue'

export default {
  name: 'LineDispatchChartWrapper',
  components: {
    LineDispatchChart
  },
  props: {
    lineDispatchData: {
      type: Object,
      default: () => ({
        lineData: [],
        countData: [],
        trueData: [],
        onTimeData: []
      })
    }
  },
  methods: {
    exportData() {
      this.$emit('export-data')
    },

    handleLineDispatchTypeChange(type) {
      this.$emit('line-dispatch-type-change', type)
    },

    handleLineDispatchDataChange(data) {
      this.$emit('line-dispatch-data-change', data)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-row
  margin-bottom 10px

  &:last-child
    margin-bottom 0
</style> 