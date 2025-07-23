<template>
  <div class="scroll-data-display">
    <el-carousel 
      v-if="hasMultiplePages"
      indicator-position="none" 
      :interval="5000" 
      height="50px"
    >
      <el-carousel-item v-for="(pageData, pageIndex) in paginatedData" :key="pageIndex">
        <div class="data-row">
          <div class="data-item" v-for="item in pageData" :key="item.title">
            <div class="data-item-top" v-if="item.title === '同比' || item.rate !== undefined">
              <div class="data-item-num" :style="{'color': item.rate && item.rate.toString().includes('-') ? '#0F8CFF' : '#C61D29'}">
                {{ item.rate || 0 }}%
              </div>
              <el-image 
                v-if="item.rate && item.rate.toString().includes('-')" 
                :src="require('@/assets/home-image/down.png')"
                style="width: 11px; height: 15px; margin-left: 5px;">
              </el-image>
              <el-image 
                v-else 
                :src="require('@/assets/home-image/up.png')"
                style="width: 11px; height: 15px; margin-left: 5px;">
              </el-image>
            </div>
            <div class="data-item-top" v-else>
              <count-to class="data-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="data-item-bottom">{{ item.title }}{{ getSuffix(item) }}</div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    
    <!-- 单页显示 -->
    <div v-else class="single-page-display">
      <div class="data-row">
        <div class="data-item" v-for="item in allData" :key="item.title">
          <div class="data-item-top" v-if="item.title === '同比' || item.rate !== undefined">
            <div class="data-item-num" :style="{'color': item.rate && item.rate.toString().includes('-') ? '#0F8CFF' : '#C61D29'}">
              {{ item.rate || 0 }}%
            </div>
            <el-image 
              v-if="item.rate && item.rate.toString().includes('-')" 
              :src="require('@/assets/home-image/down.png')"
              style="width: 11px; height: 15px; margin-left: 5px;">
            </el-image>
            <el-image 
              v-else 
              :src="require('@/assets/home-image/up.png')"
              style="width: 11px; height: 15px; margin-left: 5px;">
            </el-image>
          </div>
          <div class="data-item-top" v-else>
            <count-to class="data-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
          </div>
          <div class="data-item-bottom">{{ item.title }}{{ getSuffix(item) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'ScrollDataDisplay',
  components: { countTo },
  props: {
    // 兼容旧版本的props
    firstLoopData: {
      type: Array,
      default: () => []
    },
    secondLoopData: {
      type: Array,
      default: () => []
    },
    // 新版本的props - 直接传入所有数据
    data: {
      type: Array,
      default: () => []
    },
    suffix: {
      type: String,
      default: ''
    },
    // 每页显示的数据项数量
    itemsPerPage: {
      type: Number,
      default: 3
    },
    // 是否强制分页（即使数据少于itemsPerPage也分页）
    forcePagination: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 合并所有数据
    allData() {
      if (this.data && this.data.length > 0) {
        return this.data
      }
      // 兼容旧版本
      return [...this.firstLoopData, ...this.secondLoopData].filter(item => item && item.title)
    },
    
    // 分页数据
    paginatedData() {
      if (this.allData.length === 0) return []
      
      const pages = []
      for (let i = 0; i < this.allData.length; i += this.itemsPerPage) {
        pages.push(this.allData.slice(i, i + this.itemsPerPage))
      }
      return pages
    },
    
    // 是否需要多页显示
    hasMultiplePages() {
      if (this.forcePagination) {
        return this.paginatedData.length > 1
      }
      
      // 如果使用旧版本props且两个数组都有数据，则分页
      if (this.firstLoopData.length > 0 && this.secondLoopData.length > 0) {
        return true
      }
      
      // 如果使用新版本props且数据超过每页限制，则分页
      return this.allData.length > this.itemsPerPage
    }
  },
  methods: {
    getSuffix(item) {
      // 如果item有自定义suffix，使用item的；否则使用组件的suffix
      if (item.suffix !== undefined) {
        return item.suffix
      }
      // 同比数据不需要suffix
      if (item.title === '同比' || item.rate !== undefined) {
        return ''
      }
      return this.suffix
    }
  }
}
</script>

<style lang="stylus" scoped>
.scroll-data-display
  height 50px
  
  .single-page-display
    height 50px
    display flex
    align-items center
    
  .data-row
    display flex
    justify-content space-around
    align-items center
    width 100%
    height 100%
    
  .data-item
    display flex
    flex-direction column
    align-items center
    flex 1
    
    .data-item-top
      display flex
      align-items center
      
      .data-item-num
        font-family DIN, DIN
        font-weight bold
        font-size 22px
        color #333333
        
    .data-item-bottom
      font-family Source Han Sans CN, Source Han Sans CN
      font-weight 400
      font-size 12px
      color #333333
      margin-top 10px
      white-space nowrap
      
  /deep/ .el-carousel__container
    height 50px
    
    .el-carousel__item
      display flex
      justify-content center
      align-items center
      
    .el-carousel__arrow
      min-width 20px
      min-height 20px
</style> 