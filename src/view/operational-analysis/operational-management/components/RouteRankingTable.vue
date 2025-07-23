<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>线路营收排名</h3>
    </div>
    <div class="ranking-table-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>线路</th>
            <th>日均人次</th>
            <th>日均营收</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in redRankingData" :key="index">
            <td>
              <span class="rank-num" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
            </td>
            <td>{{ item.line_name }}</td>
            <td class="ranking-value">{{ item.passenger_count }}</td>
            <td class="ranking-value">{{ item.revenue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RouteRankingTable',
  props: {
    redRankingData: {
      type: [Array, Object],
      default: () => []
    }
  },
  computed: {
    // formattedRankingData() {
    //   // 支持两种格式：数组或对象
    //   if (Array.isArray(this.redRankingData)) {
    //     return this.redRankingData
    //   }
    //   if (this.redRankingData && this.redRankingData.line_chart_data) {
    //     return this.redRankingData.line_chart_name_data.map((name, idx) => ({
    //       line: name,
    //       revenue: this.redRankingData.line_chart_data[idx]
    //     }))
    //   }
    //   return []
    // }
  },
  methods: {
    getRankClass(rank) {
      if (rank === 1) return 'rank-1'
      if (rank === 2) return 'rank-2'
      if (rank === 3) return 'rank-3'
      return 'rank-other'
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container
  background: white
  border-radius: 8px
  padding: 16px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  height: 420px
  display: flex
  flex-direction: column

  .chart-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 15px
    flex-wrap: wrap
    gap: 10px
    flex-shrink: 0
    h3
      font-size: 18px
      font-weight: 600
      margin: 0
      color: #303133

.ranking-table-wrapper
  flex: 1
  overflow-y: auto
  overflow-x: auto

.ranking-table
  width: 100%
  border-collapse: collapse
  text-align: center
  font-size: 13px
  background: #fff
  th, td
    padding: 10px 8px
    border-bottom: 1px solid #f0f0f0
    white-space: nowrap
  thead th
    background: #f8f9fa
    color: #666
    font-weight: bold
    border-bottom: 2px solid #e0e0e0
  tbody tr:hover
    background: #f8f9fa
  .rank-num
    width: 24px
    height: 24px
    border-radius: 50%
    color: white
    text-align: center
    line-height: 24px
    font-size: 11px
    font-weight: bold
    margin: 0 auto
    display: inline-block
    &.rank-1
      background-color: #FFD700
    &.rank-2
      background-color: #C0C0C0
    &.rank-3
      background-color: #CD7F32
    &.rank-other
      background-color: #999
  .ranking-value
    font-weight: 600
    color: #409EFF
</style>