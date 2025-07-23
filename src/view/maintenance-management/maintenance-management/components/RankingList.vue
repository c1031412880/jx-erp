<template>
  <div class="ranking-list">
    <div class="ranking-tabs">
      <el-radio-group v-model="rankingType" size="mini" @change="handleRankingChange">
        <el-radio-button :label="1">红榜</el-radio-button>
        <el-radio-button :label="2">黑榜</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="ranking-content">
      <div class="ranking-header" :style="headerGridStyle">
        <span v-for="(header, index) in headers" :key="index">{{ header }}</span>
      </div>
      <div class="ranking-body">
        <div 
          v-for="(item, index) in currentRankingData" 
          :key="index"
          class="ranking-item"
          :style="itemGridStyle"
        >
          <span class="rank-num" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
          <span v-for="(field, fieldIndex) in dataFields" :key="fieldIndex" :class="getFieldClass(field)">
            {{ getFieldValue(item, field) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingList',
  props: {
    redRankingData: {
      type: Array,
      default: () => []
    },
    blackRankingData: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => ['排名', '车牌号', '公司', '台数', '百公里排行']
    },
    dataFields: {
      type: Array,
      default: () => ['license_plate', 'company', 'mileage', 'consumption_per_100km']
    },
    columnWidths: {
      type: Array,
      default: () => ['50px', '1fr', '1fr', '60px', '100px']
    }
  },
  data() {
    return {
      rankingType: 1 // 1: 红榜, 2: 黑榜
    }
  },
  computed: {
    currentRankingData() {
      return this.rankingType === 1 ? this.redRankingData : this.blackRankingData
    },
    headerGridStyle() {
      return {
        gridTemplateColumns: this.columnWidths.join(' ')
      }
    },
    itemGridStyle() {
      return {
        gridTemplateColumns: this.columnWidths.join(' ')
      }
    }
  },
  methods: {
    handleRankingChange() {
      this.$emit('ranking-change', this.rankingType)
    },
    getRankClass(rank) {
      if (rank === 1) return 'rank-1'
      if (rank === 2) return 'rank-2'
      if (rank === 3) return 'rank-3'
      return 'rank-other'
    },
    getFieldValue(item, field) {
      return item[field] || ''
    },
    getFieldClass(field) {
      // 为特定字段添加特殊样式类
      if (field === 'consumption_per_100km' || field.includes('value') || field.includes('ranking')) {
        return 'ranking-value'
      }
      return ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.ranking-list
  height 100%
  display flex
  flex-direction column
  
  .ranking-tabs
    display flex
    justify-content center
    margin-bottom 15px
    
    /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner
      background-color #FFF1F2
      border 1px solid #C61D29
      color #C61D29
      -webkit-box-shadow -1px 0 0 0 #C61D29
      box-shadow -1px 0 0 0 #C61D29
      
    /deep/ .el-radio-button__inner:hover
      color #ee6069
      
  .ranking-content
    flex 1
    display flex
    flex-direction column
    overflow hidden
    
    .ranking-header
      display grid
      gap 8px
      font-size 13px
      color #666
      font-weight bold
      padding 12px 8px
      border-bottom 2px solid #e0e0e0
      background-color #f8f9fa
      flex-shrink 0
      text-align center
      
      span
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        display flex
        align-items center
        justify-content center
      
    .ranking-body
      flex 1
      overflow-y auto
      
      &::-webkit-scrollbar
        width 4px
        
      &::-webkit-scrollbar-track
        background #f1f1f1
        border-radius 2px
        
      &::-webkit-scrollbar-thumb
        background #ccc
        border-radius 2px
        
        &:hover
          background #999   
          
      .ranking-item
        display grid
        gap 8px
        font-size 12px
        padding 10px 8px
        border-bottom 1px solid #f0f0f0
        color #333
        transition background-color 0.2s ease
        text-align center
        
        &:hover
          background-color #f8f9fa
          
        span
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          display flex
          align-items center
          justify-content center
          
        .rank-num
          width 24px
          height 24px
          border-radius 50%
          color white
          text-align center
          line-height 24px
          font-size 11px
          font-weight bold
          margin 0 auto
          
          &.rank-1
            background-color #FFD700
            
          &.rank-2
            background-color #C0C0C0
            
          &.rank-3
            background-color #CD7F32
            
          &.rank-other
            background-color #999
            
        .ranking-value
          font-weight 600
          color #409EFF
</style> 