<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>车辆能耗分析</h3>
      <div class="chart-controls">
        <el-radio-group v-model="energyAnalysisType" size="mini" @change="changeEnergyPeriod">
          <el-radio-button :label="1">月</el-radio-button>
          <el-radio-button :label="2">年</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="energyType" size="mini" @change="changeEnergyType" style="margin-left: 10px;">
          <el-radio-button :label="1">电耗</el-radio-button>
          <el-radio-button :label="2">气耗</el-radio-button>
          <el-radio-button :label="3">氢耗</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="chart-content">
      <!-- 滚动数据展示 -->
      <scroll-data-display 
        :first-loop-data="firstLoopData"
        :second-loop-data="secondLoopData"
        suffix="kWh"
      />

      <!-- 图表区域 -->
      <div class="energy-chart-wrapper">
        <div ref="energyConsumptionChart" style="width: 100%; height: 100%;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'lodash';
import ScrollDataDisplay from './ScrollDataDisplay'

export default {
  name: 'VehicleEnergyConsumptionAnalysis',
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
      energyAnalysisType: 2, // 1: 月, 2: 年
      energyType: 1, // 1: 电耗, 2: 气耗, 3: 氢气
      energyChart: null,
      cardPage: 1, // 卡片当前页数
      cardInterval: null, // 卡片轮播定时器
      energyCardList: [
        { name: '本年积累电耗', value: 0, company: '度', toFixed: 1 },
        { name: '去年同期', value: 0, company: '度', toFixed: 1 },
        { name: '同比', value: 0, company: '%', rise: true, toFixed: 1 },
        { name: '百公里电耗', value: 0, company: '度', toFixed: 1 },
        { name: '去年同期', value: 0, company: '度', toFixed: 1 },
        { name: '同比', value: 0, company: '%', rise: true, toFixed: 1 }
      ],
      firstLoopData: [
        {title: '本年积累电耗', value: 0},
        {title: '去年同期', value: 0},
        {title: '同比', rate: '0'},
      ],
      secondLoopData: [
        {title: '百公里电耗', value: 0},
        {title: '同期', value: 0},
        {title: '同比', rate: '0'},
      ],
    }
  },
  computed: {
    displayedCards() {
      const start = (this.cardPage - 1) * 3;
      const end = start + 3;
      return this.energyCardList.slice(start, end);
    }
  },
  watch: {
    deptId() {
      this.loadEnergyConsumptionData();
    }
  },
  mounted() {
    this.loadEnergyConsumptionData();
    this.startCardInterval();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    this.stopCardInterval();
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    resizeChart: debounce(function() {
      if (this.energyChart) {
        this.energyChart.resize();
      }
    }, 200),
    startCardInterval() {
      this.stopCardInterval(); // 先清除已有的定时器
      this.cardInterval = setInterval(() => {
        this.cardPage = this.cardPage === 1 ? 2 : 1;
      }, 5000);
    },
    stopCardInterval() {
      if (this.cardInterval) {
        clearInterval(this.cardInterval);
        this.cardInterval = null;
      }
    },
    handleDotClick(page) {
      this.cardPage = page;
      this.startCardInterval(); // 点击后重置定时器
    },
    changeEnergyPeriod(type) {
      this.energyAnalysisType = type;
      this.loadEnergyConsumptionData();
    },
    changeEnergyType(index) {
      this.energyType = index;
      this.loadEnergyConsumptionData();
    },
    resetEnergyCardList() {
      let cardList = [...this.energyCardList];
      const typeMap = {
        2: { name1: '本年累积汽耗', unit: '升', name2: '百公里汽耗' },
        3: { name1: '本年累积氢耗', unit: '升', name2: '百公里氢耗' },
        default: { name1: '本年积累电耗', unit: '度', name2: '百公里电耗' }
      };
      const config = typeMap[this.energyType] || typeMap.default;
      cardList[0].name = config.name1;
      cardList[0].company = config.unit;
      cardList[3].name = config.name2;
      cardList[3].company = config.unit;
      this.energyCardList = cardList;
    },
    replacePercent(str) {
      if (!str) return 0;
      return parseFloat(str.toString().replace('%', ''));
    },
    async loadEnergyConsumptionData() {
      try {
        this.resetEnergyCardList();
        // SugarService 数据无需复杂参数，保留 dept_id / query_type 便于后期扩展
        const params = {
          dept_id: this.deptId || '',
          type: this.energyAnalysisType,
          query_type: this.energyType,
        };
        if (this.energyAnalysisType === 1) {
          params.month = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
        }
        const res = await this.$client.ErpGetVehicleEnergy(params);
        if (res.head.result === '200') {
          const info = res.context;
          this.updateData(info);
        } else {
          this.renderMockData();
        }
      } catch (error) {
        console.error('加载车辆能耗数据失败:', error);
        this.renderMockData();
      }
    },
    // 解析 ERP ErpGetVehicleEnergy 返回结构
    updateData(info) {
      if (!info) return;
      // this.energyCardList[0].value = parseFloat((info.now_val || 0).toFixed(1));
      // this.energyCardList[1].value = parseFloat((info.last_val || 0).toFixed(1));
      // this.energyCardList[2].value = parseFloat(this.replacePercent(info.yoy).toFixed(1));
      // this.energyCardList[3].value = parseFloat((info.kilometer_val || 0).toFixed(1));
      // this.energyCardList[4].value = parseFloat((info.kilometer_last_val || 0).toFixed(1));
      // this.energyCardList[5].value = parseFloat(this.replacePercent(info.kilometer_yoy).toFixed(1)); 

      this.firstLoopData[0].value = parseFloat((info.now_val || 0).toFixed(1));
      this.firstLoopData[1].value = parseFloat((info.last_val || 0).toFixed(1));
      this.firstLoopData[2].rate = parseFloat(this.replacePercent(info.yoy).toFixed(2));
      this.secondLoopData[0].value = parseFloat((info.kilometer_val || 0).toFixed(1));
      this.secondLoopData[1].value = parseFloat((info.kilometer_last_val || 0).toFixed(1));
      this.secondLoopData[2].rate = parseFloat(this.replacePercent(info.kilometer_yoy).toFixed(2));

      const valTotals = info.valTotals || [];
      const xData = valTotals.map(x => x.year_month);
      const yData = valTotals.map(x => x.val);
      this.renderEnergyConsumptionChart(xData, yData);
    },
    renderMockData() {
      this.resetEnergyCardList();
      const mockData = {
        1: { cards: [582.5, 625.3, -6.8, 0.85, 0.92, -7.6], chart: { xData: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05'], yData: [0.85, 0.92, 0.78, 0.88, 0.91] } },
        2: { cards: [1250.8, 1180.6, 5.9, 32.5, 31.2, 4.2], chart: { xData: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05'], yData: [32.5, 31.8, 33.2, 30.9, 32.1] } },
        3: { cards: [385.2, 410.7, -6.2, 0.75, 0.82, -8.5], chart: { xData: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05'], yData: [0.75, 0.82, 0.68, 0.79, 0.85] } }
      };
      const current = mockData[this.energyType] || mockData[1];
      current.cards.forEach((value, index) => {
        this.energyCardList[index].value = value;
      });
      this.renderEnergyConsumptionChart(current.chart.xData, current.chart.yData);
    },
    renderEnergyConsumptionChart(xData, yData) {
      if (!this.$refs.energyConsumptionChart) return;
      if (!this.energyChart) {
        this.energyChart = echarts.init(this.$refs.energyConsumptionChart);
      }
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { top: '15%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: xData, axisLabel: { color: '#333' } },
        yAxis: { type: 'value', axisLabel: { color: '#333' } },
        series: [{
          name: '消耗量',
          type: 'line',
          data: yData,
          smooth: true,
          itemStyle: { color: '#409EFF' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(64, 158, 255, 0.3)' }, { offset: 1, color: 'rgba(64, 158, 255, 0)' }])}
        }]
      };
      this.energyChart.setOption(option, true);
    }
  }
}
</script>

<style lang="stylus" scoped>
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
  margin-bottom: 15px;
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

.energy-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px; /* 调整卡片间距 */
}

.energy-card {
  background-color: #F9FAFB;
  border-radius: 6px;
  padding: 8px; /* 缩小内边距 */
  text-align: center;
  
  .card-value {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-bottom: 4px; /* 缩小内部间距 */
    
    .value-number { font-size: 20px; font-weight: bold; } /* 缩小字体 */
    .value-unit { font-size: 12px; margin-left: 3px; } /* 缩小字体 */
    .trend-icon { margin-left: 4px; font-size: 14px; } /* 缩小图标 */
  }
  
  .card-name { font-size: 12px; color: #606266; } /* 缩小字体 */
}

.card-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #E4E7ED;
    margin: 0 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &.active {
      background-color: #409EFF;
    }
  }
}

.energy-chart-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.energy-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  
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
}

.energy-chart-wrapper {
  flex: 1;
  position: relative;
}
</style> 