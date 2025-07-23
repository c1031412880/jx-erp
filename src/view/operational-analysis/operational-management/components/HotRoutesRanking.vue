<template>
    <div class="chart-container">
      <div class="chart-header">
        <h3>热门线路</h3>
        <!-- <div class="chart-controls">
          <el-button size="mini" @click="switchToRoutes">线路</el-button>
          <el-button size="mini" type="primary" @click="switchToStations">站点</el-button>
        </div> -->
        <div class="chart-controls">
        <el-radio-group v-model="currentType" size="mini" @change="handleTypeChange">
         <el-radio-button label="routes">线路</el-radio-button>
         <el-radio-button label="stations">站点</el-radio-button>
        </el-radio-group>
      </div>
      </div>
      <div class="chart-content">
        <div class="hot-routes-content">
          <div class="routes-ranking">
            <div class="ranking-header">
              <span>排名</span>
              <span>线路</span>
              <span>客流量</span>
            </div>
            <div class="ranking-list">
              <div class="ranking-item" v-for="(route, index) in routesData" :key="index">
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="route-name">{{ route.name }}</div>
                <div class="route-flow">
                  <div class="flow-bar">
                    <div class="flow-progress" :style="{ width: Math.max(route.i_come_number/2000*100,10) + '%' }"></div>
                  </div>
                  <span class="flow-value">{{ route.i_come_number }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HotRoutesRanking',
    props: {
      routesData: {
        type: Array,
        default: () => [
          { name: 'BRT1', i_come_number: 5147, percentage: 100 },
          { name: '37', i_come_number: 3225, percentage: 63 },
          { name: 'B支809', i_come_number: 3110, percentage: 60 },
          { name: '333', i_come_number: 2967, percentage: 58 },
          { name: 'B支101', i_come_number: 2509, percentage: 49 },
          { name: '361', i_come_number: 2502, percentage: 49 },
          { name: '810', i_come_number: 2390, percentage: 46 }
        ]
      }
    },
    data() {
        return {
            currentType: 'routes'
        }
    },
    methods: {
      handleTypeChange(value) {
        this.currentType = value
        this.$emit('switch-type', value)
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
        
     .chart-controls
        display: flex
        align-items: center
        gap: 10px
        flex-wrap: wrap
        
    .chart-content
      position: relative
      flex: 1
      display: flex
      flex-direction: column
  
  .hot-routes-content
    height: 365px
    
    .routes-ranking
      height: 100%
      display: flex
      flex-direction: column
      
      .ranking-header
        display: grid
        grid-template-columns: 60px 80px 1fr
        gap: 10px
        font-size: 13px
        color: #666
        font-weight: bold
        padding: 10px 0
        border-bottom: 2px solid #e0e0e0
        padding-left: 10px
        flex-shrink: 0
        
      .ranking-list
        flex: 1
        overflow-y: auto
        max-height: calc(100% - 50px) // 减去header高度
        padding-right: 5px // 为滚动条留出空间
        
        // 自定义滚动条样式
        &::-webkit-scrollbar
          width: 6px
          
        &::-webkit-scrollbar-track
          background: #f1f1f1
          border-radius: 3px
          
        &::-webkit-scrollbar-thumb
          background: #c1c1c1
          border-radius: 3px
          
          &:hover
            background: #a8a8a8
        
      .ranking-item
        display: grid
        grid-template-columns: 60px 80px 1fr
        gap: 10px
        padding: 12px 0
        border-bottom: 1px solid #f0f0f0
        align-items: center
        
        .rank-number
          text-align: center
          font-weight: bold
          color: #333
          
        .route-name
          font-weight: 500
          color: #333
          
        .route-flow
          display: flex
          align-items: center
          gap: 8px
          
          .flow-bar
            flex: 1
            height: 8px
            background: #f0f0f0
            border-radius: 4px
            overflow: hidden
            
            .flow-progress
              height: 100%
              background: #409EFF
              transition: width 0.3s ease
              
          .flow-value
            font-weight: bold
            color: #333
            min-width: 50px
            text-align: right
  </style>