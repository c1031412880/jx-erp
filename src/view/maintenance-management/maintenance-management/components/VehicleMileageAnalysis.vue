<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>车辆里程分析</h3>
      <!-- <el-date-picker
        v-model="selectedYear"
        type="year"
        placeholder="选择年份"
        size="mini"
        style="width: 120px;"
        format="yyyy"
        value-format="yyyy"
        @change="handleYearChange"
      >
      </el-date-picker> -->
    </div>
    <div class="chart-content">
      <!-- 滚动数据展示 -->
      <scroll-data-display 
        :data="scrollData"
        suffix="(万公里)"
        :items-per-page="4"
      />
      
      <!-- 月度对比图表 -->
      <div class="mileage-chart">
        <div class="chart-legend">
          <div class="legend-left">
            <div class="legend-text">本年</div>
            <div class="legend-icon this-year"></div>
          </div>
          <div class="legend-center">月份</div>
          <div class="legend-right">
            <div class="legend-icon last-year"></div>
            <div class="legend-text">去年</div>
          </div>
        </div>
        <div class="chart-scroll">
          <div v-for="(item, index) in mileageMonthData" :key="index" class="chart-row">
            <div class="row-left">
              <div class="row-text">{{ item.thisYearValue }}</div>
              <div class="progress-bar this-year" :style="{width: item.thisYearRise + '%'}"></div>
            </div>
            <div class="row-center">{{ item.name }}</div>
            <div class="row-right">
              <div class="progress-bar last-year" :style="{width: item.lastYearRise + '%'}"></div>
              <div class="row-text">{{ item.lastYearValue }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollDataDisplay from './ScrollDataDisplay'

export default {
  name: 'VehicleMileageAnalysis',
  components: {
    ScrollDataDisplay
  },
  props: {
    deptId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedYear: new Date().getFullYear().toString(),
      mileageCardList: [
        { name: "本年积累公里数", value: 0, company: "万", toFixed: 1 },
        { name: "去年同期累计", value: 0, company: "万", toFixed: 1 },
        { name: "同比", value: 0, company: "%", rise: true, toFixed: 1 },
        { name: "本年计划总公里", value: 0, company: "万", toFixed: 0 }
      ],
      mileageMonthData: []
    }
  },
  computed: {
    scrollData() {
      return [
        {title: '本年积累公里数', value: this.mileageCardList[0].value},
        {title: '去年同期累计', value: this.mileageCardList[1].value},
        {title: '同比', rate: this.mileageCardList[2].value},
        {title: '本年计划总公里', value: this.mileageCardList[3].value}
      ]
    }
  },
  watch: {
    deptId() {
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    handleYearChange() {
      this.fetchData();
    },
    async fetchData() {
      try {
        const params = {
          year: this.selectedYear,
          dept_id: this.deptId
        };
        // 使用 $dispatch 调用大屏接口
        const res = await this.$dispatch.GetVehicleMileage(params);
        if (res.head.result === '200') {
          const info = res.content;
          this.updateData(info);
        } else {
          this.renderMockData();
        }
      } catch (error) {
        console.error('获取车辆里程数据失败:', error);
        this.renderMockData(); // 接口失败时使用模拟数据
      }
    },
    updateData(info) {
      this.mileageCardList[0].value = (info.this_year_odometer || 0).toFixed(1);
      this.mileageCardList[1].value = (info.last_year_odometer || 0).toFixed(1);
      this.mileageCardList[2].value = (info.rate || 0).toFixed(1);
      this.mileageCardList[3].value = Math.round(info.this_year_plan || 0);
      
      // 更新滚动数据
      // this.firstLoopData[0].value = (info.this_year_odometer || 0).toFixed(1);
      // this.firstLoopData[1].value = (info.last_year_odometer || 0).toFixed(1);
      // this.firstLoopData[2].rate = (info.rate || 0).toFixed(1);
      // this.firstLoopData[3].value = Math.round(info.this_year_plan || 0);
      // this.secondLoopData  = []
      // this.secondLoopData[0].value = Math.round(info.this_year_plan || 0);
      // this.secondLoopData[1].value = Math.round(((info.this_year_odometer || 0) / (info.this_year_plan || 1)) * 100);
      // this.secondLoopData[2].rate = (info.rate || 0).toFixed(1);

      this.mileageMonthData = [];
      if (info.last_year && info.this_year) {
        info.last_year.forEach((item, index) => {
          const thisYearItem = info.this_year[index] || {};
          const obj = {
            name: item.month || `${index + 1}月`,
            thisYearValue: thisYearItem.odometer || 0,
            thisYearRise: thisYearItem.rate || 0,
            lastYearValue: item.odometer || 0,
            lastYearRise: item.rate || 0
          };
          this.mileageMonthData.push(obj);
        });
      }
    },
    renderMockData() {
      this.mileageCardList[0].value = 2029.6;
      this.mileageCardList[1].value = 2225.6;
      this.mileageCardList[2].value = -8.8;
      this.mileageCardList[3].value = 3085;

      this.mileageMonthData = Array.from({ length: 12 }, (_, i) => ({
        name: `${i + 1}月`,
        thisYearValue: (Math.random() * 50 + 150).toFixed(0),
        thisYearRise: Math.random() * 40 + 60,
        lastYearValue: (Math.random() * 50 + 150).toFixed(0),
        lastYearRise: Math.random() * 40 + 60
      }));
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 样式与原 index.vue 中保持一致 */
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #EBEEF5;
  height: 380px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #303133;
  }
}

.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 里程卡片样式 */
.mileage-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px; /* 进一步减小卡片间距 */
  margin-bottom: 10px; /* 进一步减小下方间距 */
}

.mileage-card {
  background-color: #F9FAFB;
  border-radius: 6px;
  padding: 8px; /* 进一步减小内边距 */
  text-align: center;
  
  .card-value {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-bottom: 5px; /* 减小内部间距 */
    
    .value-number {
      font-size: 20px; /* 再次缩小字体 */
      font-weight: bold;
    }
    .value-unit {
      font-size: 12px;
      margin-left: 3px;
    }
    .trend-icon {
      margin-left: 3px;
      font-size: 14px;
    }
  }
  
  .card-name {
    font-size: 12px; /* 再次缩小字体 */
    color: #606266;
  }
}

/* 月度对比图表样式 */
.mileage-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 220px;

  .chart-legend {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #909399;
    margin-bottom: 10px;

    .legend-left, .legend-right {
      display: flex;
      align-items: center;
    }
    .legend-icon {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      &.this-year {
        background-color: #409EFF;
        margin-left: 5px;
      }
      &.last-year {
        background-color: #A3D0FD;
        margin-right: 5px;
      }
    }
  }

  .chart-scroll {
    overflow-y: auto;
    flex: 1;
    /* height: 150px; // 移除固定高度，让 flex:1 生效 */
    
    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }
    
    .chart-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .row-left, .row-right {
        flex: 1;
        display: flex;
        align-items: center;
      }
      .row-center {
        width: 50px;
        text-align: center;
        font-size: 12px;
        color: #606266;
      }
      .row-text {
        width: 50px;
        text-align: right;
        font-size: 12px;
        color: #303133;
        padding: 0 5px;
      }
      .row-right .row-text {
        text-align: left;
      }

      .progress-bar {
        height: 8px;
        border-radius: 4px;
        &.this-year {
          background-color: #409EFF;
        }
        &.last-year {
          background-color: #A3D0FD;
        }
      }
    }
  }
}
</style> 