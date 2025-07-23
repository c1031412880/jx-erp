<template>
  <div class="safe-dept-rank">
    <div style="display: flex; justify-content: flex-end; margin: 5px 0;">
      <el-radio-group v-model="dateType" size="mini" :disabled="loading" @change="loadData">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
    </div>
    <ul class="safe-dept-rank-header">
      <li class="safe-dept-rank-header-item" v-for="(item, index) in headerData" :key="index">
        {{ item }}
      </li>
    </ul>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    <div v-else-if="!tableData || tableData.length === 0" class="empty-container">
      <img :src="emptyPlaceholder" alt="" class="empty-image" />
      <div class="empty-text">暂无数据</div>
    </div>
    <ul v-else class="safe-dept-rank-content">
      <li class="safe-dept-rank-content-item" v-for="(item, index) in tableData" :key="index">
        <div class="safe-dept-rank-content-item-box">{{ item.dept_name }}</div>
        <div class="safe-dept-rank-content-item-box">{{ item.traffic_accident_rate }}</div>
        <div class="safe-dept-rank-content-item-box">
          <el-image :src="require('@/assets/home-image/down-1.png')" v-if="item.traffic_accident_rate_yoy < 0"></el-image>
          <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
          <span :style="{'color': item.traffic_accident_rate_yoy < 0 ? '#0F8CFF' : '#C61D29'}">{{ item.traffic_accident_rate_yoy }}%</span>
        </div>
        <div class="safe-dept-rank-content-item-box">{{ item.violations_rate }}</div>
        <div class="safe-dept-rank-content-item-box">
          <el-image :src="require('@/assets/home-image/down-1.png')" v-if="item.violations_rate_yoy < 0"></el-image>
          <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
          <span :style="{'color': item.violations_rate_yoy < 0 ? '#0F8CFF' : '#C61D29'}">{{ item.violations_rate_yoy }}%</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDate } from '@/utils/index'
import placeholderImage from '@/assets/home-image/placeholder-1.png'

export default {
  name: 'safe-dept-rank',
  props: {
    dept_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dateType: 1, // 1:月 2:年
      headerData: ['分公司', '行车事故率', '月环比', '百万公里违章率', '月环比'],
      tableData: [],
      loading: false, // 加载状态
      emptyPlaceholder: placeholderImage // 空占位图片
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      // 显示加载动画
      this.loading = true
      
      // 根据选择类型设置表头
      if (this.dateType === 1) {
        this.headerData = ['分公司', '行车事故率', '月环比', '百万公里违章率', '月环比']
      } else {
        this.headerData = ['分公司', '行车事故率', '年同比', '百万公里违章率', '年同比']
      }

      // 使用全局方法获取时间范围
      let timeRange
      if (this.dateType === 1) {
        // 月：获取本月时间范围
        timeRange = getDate('thisMonth')
      } else {
        // 年：获取本年时间范围
        timeRange = getDate('thisYear')
      }

      let params = {
        dept_id: this.dept_id,
        begin: timeRange.startTime + ' 00:00:00',
        end: timeRange.endTime + ' 23:59:59',
        date_type: this.dateType
      }

      this.$client.GetSafeDeptRankInfo(params).then(res => {
        if (res.head.result == '200') {
          this.tableData = res.context || []
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).finally(() => {
        // 隐藏加载动画
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.safe-dept-rank {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 单选按钮容器样式
  .el-radio-group {
    margin-bottom: 8px * $NumWidth;
  }
  
  .safe-dept-rank-header {
    display: flex;
    background: #EBECF0;
    line-height: 18px * $NumWidth;
    .safe-dept-rank-header-item {
      padding: 8px * $NumWidth 0;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 14px * $NumWidth;
      color: #333333;
      flex-shrink: 0;
      text-align: center;
      border-right: 1px solid #DBDEE2;
    }
    .safe-dept-rank-header-item:nth-child(1) {
      width: 25%;
    }
    .safe-dept-rank-header-item:nth-child(2) {
      width: 20%;
    }
    .safe-dept-rank-header-item:nth-child(3) {
      width: 15%;
    }
    .safe-dept-rank-header-item:nth-child(4) {
      width: 25%;
    }
    .safe-dept-rank-header-item:nth-child(5) {
      width: 15%;
      border-right: none;
    }
  }
  
  .safe-dept-rank-content {
    min-height: 200px * $NumWidth;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    flex: 1;
    .safe-dept-rank-content-item {
      display: flex;
      line-height: 18px * $NumWidth;
      .safe-dept-rank-content-item-box {
        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: 400;
        font-size: 14px * $NumWidth;
        color: #333333;
        flex-shrink: 0;
        text-align: center;
        padding: 8px * $NumWidth 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-image {
          width: 12px * $NumWidth;
          height: 11px * $NumWidth;
          margin-right: 5px * $NumWidth;
        }
      }
      .safe-dept-rank-content-item-box:nth-child(1) {
        width: 25%;
      }
      .safe-dept-rank-content-item-box:nth-child(2) {
        width: 20%;
        font-family: DIN, DIN;
        font-weight: bold;
      }
      .safe-dept-rank-content-item-box:nth-child(3) {
        width: 15%;
        font-family: DIN, DIN;
        font-weight: bold;
      }
      .safe-dept-rank-content-item-box:nth-child(4) {
        width: 25%;
        font-family: DIN, DIN;
        font-weight: bold;
      }
      .safe-dept-rank-content-item-box:nth-child(5) {
        width: 15%;
        font-family: DIN, DIN;
        font-weight: bold;
      }
    }
    /* 斑马线效果 */
    .safe-dept-rank-content-item:nth-child(odd) {
      background-color: #ffffff;
    }
    .safe-dept-rank-content-item:nth-child(even) {
      background-color: #F7F7F9;
    }
  }
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  
  /* 加载动画样式 */
  .loading-container {
    min-height: 200px * $NumWidth;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    flex: 1;
    
    .loading-spinner {
      width: 40px * $NumWidth;
      height: 40px * $NumWidth;
      border: 3px * $NumWidth solid #f3f3f3;
      border-top: 3px * $NumWidth solid #409EFF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      margin-top: 15px * $NumWidth;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-size: 14px * $NumWidth;
      color: #666666;
    }
  }
  
  /* 空状态样式 */
  .empty-container {
    min-height: 200px * $NumWidth;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    flex: 1;
    
    .empty-image {
      width: 60px * $NumWidth;
      height: 60px * $NumWidth;
      margin-bottom: 10px * $NumWidth;
    }
    
    .empty-text {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-size: 14px * $NumWidth;
      color: #999999;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 单选按钮样式优化
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

/deep/ .el-radio-button__inner {
  font-size: 12px * $NumWidth;
  padding: 6px * $NumWidth 10px * $NumWidth;
  border-radius: 3px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 3px * $NumWidth 0 0 3px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 3px * $NumWidth 3px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style> 