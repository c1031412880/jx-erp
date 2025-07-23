<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>百公里能耗TOP 10</h3>
      <div class="controls">
        <el-select v-model="energyType" size="mini" style="width: 100px;" @change="fetchData">
          <!-- 燃料类型：1-柴油，2-天然气，3-电气，4-氢气 -->
          <!-- <el-option label="柴油" value="1"></el-option> -->
          <el-option label="天然气" value="2"></el-option>
          <el-option label="电气" value="3"></el-option>
          <el-option label="氢气" value="4"></el-option>
        </el-select>
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="选择月份"
          size="mini"
          style="width: 120px;"
          format="yyyy-MM"
          value-format="yyyy-MM"
          @change="fetchData"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="chart-content">
      <ranking-list 
        :red-ranking-data="redRankingData"
        :black-ranking-data="blackRankingData"
        :headers="tableHeaders"
        :data-fields="dataFields"
        :column-widths="columnWidths"
        @ranking-change="handleRankingChange"
      />
    </div>
  </div>
</template>

<script>
import RankingList from './RankingList'

export default {
  name: 'EnergyConsumptionTop10',
  components: {
    RankingList
  },
  props: {
    deptId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      type: '1', // 榜单类型：1-红榜(能耗低)，2-黑榜(能耗高)
      energyType: '2', 
      selectedMonth: new Date().toISOString().slice(0, 7),
      rankingData: {
        vehicles: []
      },
      redRankingData: [],
      blackRankingData: [],
      // 表格配置
      tableHeaders: ['排名', '车牌号', '公司', '台数', '百公里排行'],
      dataFields: ['license_plate', 'company', 'mileage', 'consumption_per_100km'],
      columnWidths: ['50px', '1fr', '1fr', '60px', '100px']
    };
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
    async fetchData() {
      try {
        const params = {
          month: this.selectedMonth,
          fuel_type: this.energyType,
          type: this.type,
        };
        if (this.deptId) {
          params.dept_id = this.deptId;
        }
        const res = await this.$client.GetFuelConsumptionTop10(params);
        if (res.head.result == '200') {
          this.rankingData = res.context;
          this.updateRankingData();
        } else {
          this.renderMockData();
        }
        // 暂时使用模拟数据
      } catch (error) {
        console.error('获取能耗TOP10数据失败:', error);
        this.renderMockData();
      }
    },
    
    updateRankingData() {
      // 转换数据格式为RankingList组件需要的格式
      if (this.rankingData.vehicles && this.rankingData.vehicles.length > 0) {
        // 动态调整表格配置
        this.adjustTableConfig();
        
        // 红榜：能耗低的排在前面（升序）
        const sortedForRed = [...this.rankingData.vehicles].sort((a, b) => 
          parseFloat(a.consumption_per_100km) - parseFloat(b.consumption_per_100km)
        );
        this.redRankingData = sortedForRed.map(item => ({
          license_plate: item.license_plate,
          company: item.company,
          mileage: item.mileage,
          consumption_per_100km: item.consumption_per_100km + ' ' + this.getUnit()
        }));
        
        // 黑榜：能耗高的排在前面（降序）
        const sortedForBlack = [...this.rankingData.vehicles].sort((a, b) => 
          parseFloat(b.consumption_per_100km) - parseFloat(a.consumption_per_100km)
        );
        this.blackRankingData = sortedForBlack.map(item => ({
          license_plate: item.license_plate,
          company: item.company,
          mileage: item.mileage,
          consumption_per_100km: item.consumption_per_100km + ' ' + this.getUnit()
        }));
      } else {
        this.redRankingData = [];
        this.blackRankingData = [];
      }
    },
    
    adjustTableConfig() {
      // 根据数据结构动态调整表格配置
      const sampleData = this.rankingData.vehicles[0];
      if (!sampleData) return;
      
      const headers = ['排名'];
      const fields = [];
      const widths = ['50px'];
      
      // 检查数据字段并动态添加列
      if (sampleData.license_plate !== undefined) {
        headers.push('车牌号');
        fields.push('license_plate');
        widths.push('1fr');
      }
      
      if (sampleData.company !== undefined) {
        headers.push('公司');
        fields.push('company');
        widths.push('1fr');
      }
      
      if (sampleData.mileage !== undefined) {
        headers.push('台数');
        fields.push('mileage');
        widths.push('60px');
      }
      
      if (sampleData.consumption_per_100km !== undefined) {
        headers.push('百公里排行');
        fields.push('consumption_per_100km');
        widths.push('100px');
      }
      
      // 更新配置
      this.tableHeaders = headers;
      this.dataFields = fields;
      this.columnWidths = widths;
    },
    
    handleRankingChange(type) {
      this.type = type.toString();
      this.fetchData();
      // 可以在这里添加其他逻辑
    },
    renderMockData() {
      this.rankingData.vehicles = Array.from({ length: 10 }, (_, i) => {
        return {
          license_plate: `浙A${Math.floor(Math.random() * 900) + 100}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
          company: `第${i + 1}公司`,
          mileage: Math.floor(Math.random() * 10) + 1,
          consumption_per_100km: (Math.random() * 20 + 15).toFixed(2)
        };
      });
      this.updateRankingData();
    },
    getRankClass(index) {
        if (index < 3) {
            return this.listType === 'red' ? 'rank-top-red' : 'rank-top-black';
        }
        return '';
    },
    getUnit() {
      const unitMap = {
        1: 'L/100km', // 柴油
        2: 'm³/100km', // 天然气
        3: 'kWh/100km', // 电气
        4: 'kg/100'   // 氢气
      };
      return unitMap[this.energyType] || 'L/100km';
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
  
  .controls {
    display: flex;
    align-items: center;
    gap: 10px;

    .list-type-toggle {
      // 自定义红黑榜切换按钮样式
      >>> .el-radio-button__inner {
        border-radius: 4px !important;
        border: 1px solid #DCDFE6;
      }
      >>> .el-radio-button:first-child .el-radio-button__inner {
        border-right: 1px solid #DCDFE6;
      }
      >>> .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #409EFF;
        border-color: #409EFF;
      }
    }
  }
}

.chart-content {
  flex: 1;
  overflow: hidden;
}

.ranking-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ranking-header, .ranking-item {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 80px 100px;
  text-align: center;
  font-size: 13px;
  color: #606266;
  padding: 8px 0;
  border-bottom: 1px solid #F2F6FC;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.ranking-header {
  font-weight: 600;
  color: #303133;
  background-color: #FAFAFA;
}

.ranking-body {
  flex: 1;
  overflow-y: auto;
}

.ranking-item {
  color: #303133;
  
  .rank-num {
    font-weight: bold;
    font-style: italic;
  }

  .rank-top-red {
    color: #67C23A; // 红榜前三
  }
  .rank-top-black {
    color: #F56C6C; // 黑榜前三
  }
  
  .ranking-value {
    font-weight: 500;
  }
}
</style> 