<template>
  <div class="service-list">
    <div class="el-select-box">
      <el-date-picker
        size="mini"
        style="width: 120px;"
        v-model="year_month"
        type="month"
        format="yyyy-MM"
        value-format="yyyy-MM"
        @change="loadData"
        :disabled="loading"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <ul class="service-list-header">
      <li class="service-list-header-item" v-for="item in headerData" :key="item">
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
    <ul v-else class="service-list-content" >
      <li class="service-list-content-item" v-for="(item, index) in tableData" :key="index">
        <div class="service-list-content-item-box">{{ item.dept_name }}</div>
        <div class="service-list-content-item-box">{{ item.data_count + '/' + item.complaint_count + '/' + item.duty_count }}</div>
        <div class="service-list-content-item-box">{{ item.complaint_rate }}</div>
        <div class="service-list-content-item-box">
          <el-image :src="require('@/assets/home-image/down-1.png')" v-if="item.last_month_rate.includes('-')"></el-image>
          <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
          <span :style="{'color': item.last_month_rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.last_month_rate }}</span>
        </div>
        <div class="service-list-content-item-box">
          <el-image :src="require('@/assets/home-image/down-1.png')"  v-if="item.last_year_rate.includes('-')"></el-image>
          <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
          <span :style="{'color': item.last_year_rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.last_year_rate }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { formatTime } from '@/utils/index';
import placeholderImage from '@/assets/home-image/placeholder-1.png'

export default {
  name: 'service-list',
  data() {
    return {
      year_month: formatTime(new Date(),'yyyy-MM'),
      headerData: ['分公司','接线量/投诉/有责','投诉率','上月环比','去年同比'],
      tableData: [
        // {dept: '',count: '0/0/0',rate: '0%',month: '0%',year: '0%', change: 'up'},
        // {dept: '',count: '0/0/0',rate: '0%',month: '0%',year: '0%', change: 'down'},
      ],
      loading: false, // 加载状态
      emptyPlaceholder: placeholderImage // 空占位图片
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      // 显示加载动画
      this.loading = true
      
      let params = {year_month: this.year_month}
      this.$client.GetServiceData(params).then(res => {
        if (res.head.result == '200') {
          this.tableData = res.context
          // this.tableData = [
          //   {dept_name:'杭州',data_count: 1000,complaint_count: 100,duty_count: 100,complaint_rate: '0%',last_month_rate: '0%',last_year_rate: '0%'},
          //   {dept_name:'杭州',data_count: 1000,complaint_count: 100,duty_count: 100,complaint_rate: '0%',last_month_rate: '-1.05%',last_year_rate: '-0.12%'},
          //   {dept_name:'杭州',data_count: 1000,complaint_count: 100,duty_count: 100,complaint_rate: '0%',last_month_rate: '0%',last_year_rate: '0%'},
          //   {dept_name:'杭州',data_count: 1000,complaint_count: 100,duty_count: 100,complaint_rate: '0%',last_month_rate: '0%',last_year_rate: '-0.45%'},
          //   {dept_name:'杭州',data_count: 1000,complaint_count: 100,duty_count: 100,complaint_rate: '0%',last_month_rate: '-1.25%',last_year_rate: '0%'},
          //   {dept_name:'杭州',data_count: 1000,complaint_count: 100,duty_count: 100,complaint_rate: '0%',last_month_rate: '0%',last_year_rate: '0%'},
          // ]
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
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.service-list {
  height: 100%;
  padding-top: 15px * $NumWidth;
  position: relative;
  display: flex;
  flex-direction: column;
  .el-select-box {
    position: absolute;
    right: 0;
    top: -32px * $NumWidth;
  }
  .service-list-header {
    display: flex;
    background: #EBECF0;
    line-height: 18px * $NumWidth;
    .service-list-header-item {
      padding: 8px * $NumWidth 0;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 14px * $NumWidth;
      color: #333333;
      flex-shrink: 0;
      text-align: center;
      border-right: 1px solid #DBDEE2;
    }
    .service-list-header-item:nth-child(1) {
      width: 20%;
    }
    .service-list-header-item:nth-child(2) {
      width: 25%;
    }
    .service-list-header-item:nth-child(3) {
      width: 15%;
    }
    .service-list-header-item:nth-child(4) {
      width: 20%;
    }
    .service-list-header-item:nth-child(5) {
      width: 20%;
      border-right: none;
    }
  }
  .service-list-content {
    min-height: 200px * $NumWidth;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    flex: 1;
    .service-list-content-item {
      display: flex;
      line-height: 18px * $NumWidth;
      .service-list-content-item-box {
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
      .service-list-content-item-box:nth-child(1) {
        width: 20%;
      }
      .service-list-content-item-box:nth-child(2) {
        width: 25%;
      }
      .service-list-content-item-box:nth-child(3) {
        width: 15%;
      }
      .service-list-content-item-box:nth-child(4) {
        font-family: DIN, DIN;
        font-weight: bold;
        width: 20%;
      }
      .service-list-content-item-box:nth-child(5) {
        font-family: DIN, DIN;
        font-weight: bold;
        width: 20%;
      }
    }
    /* 斑马线效果 */
    .service-list-content-item:nth-child(odd) {
      background-color: #ffffff;
    }
    .service-list-content-item:nth-child(even) {
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
  
  /* 空占位样式 */
  .empty-container {
    min-height: 200px * $NumWidth;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    position: relative;
    flex: 1;
    
    .empty-image {
      width: 180px * $NumWidth;
      height: 180px * $NumWidth;
      height: auto; /* Allow height to adjust based on width */
      margin-bottom: 10px * $NumWidth;
    }
    
    .empty-text {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-size: 14px * $NumWidth;
      color: #999999;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>