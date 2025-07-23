<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>车辆维修总览</h3>
      <div class="chart-controls">
        <el-radio-group v-model="currentTab" size="mini" @change="handleTabChange">
          <el-radio-button label="repair">报修</el-radio-button>
          <el-radio-button label="leave">出库</el-radio-button>
        </el-radio-group>
        <el-date-picker 
          v-model="maintenanceDate" 
          type="daterange" 
          size="mini"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          @change="handleDateChange">
        </el-date-picker>
        <get-vehicle-select-dialog
          ref="vehicleTree"
          :placeholder="'选择车辆'"
          :isShowCheckbox="true"
          v-model="vehicleIds"
          @change="handleVehicleChange"
          style="width: 140px;">
        </get-vehicle-select-dialog>
      </div>
    </div>
    <div class="table-content">
      <!-- 报修表格 -->
      <el-table 
        v-show="currentTab === 'repair'"
        :data="repairTableData" 
        stripe 
        :height="320"
        v-loading="loading">
        <el-table-column prop="work_code" label="工单号码" width="150"></el-table-column>
        <el-table-column prop="state_name" label="工单状态" width="100"></el-table-column>
        <el-table-column prop="vehicleNo" label="自编号" width="80">
          <template slot-scope="scope">
            {{ scope.row.vehicle_info ? scope.row.vehicle_info.vehicle_number : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="vehicleType" label="车牌号" width="100">
          <template slot-scope="scope">
            {{ scope.row.vehicle_info ? scope.row.vehicle_info.vehicle_name : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="faultCalc" label="所属组织" width="100">
          <template slot-scope="scope">
            {{ scope.row.vehicle_info ? scope.row.vehicle_info.department_name : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="vehicleType2" label="车型" width="80">
          <template slot-scope="scope">
            {{ scope.row.vehicle_info ? scope.row.vehicle_info.vehicle_kind_name : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="repair_address" label="报修地点" width="100"></el-table-column>
        <el-table-column prop="type_name" label="报修类别" width="80"></el-table-column>
        <el-table-column prop="repair_describe" label="报修描述" width="120"></el-table-column>
        <el-table-column prop="driver_name" label="驾驶员" width="100">
          <template slot-scope="scope">
            {{ scope.row.driver_name ? scope.row.driver_name : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="repair_tel" label="报修人(电话)" width="100">
          <template slot-scope="scope"> 
            {{ scope.row.repair_user_name ? scope.row.repair_user_name : '' }}({{ scope.row.repair_tel ? scope.row.repair_tel : '' }})
          </template>
        </el-table-column>
        <el-table-column prop="repair_check" label="维修车间" width="100">
          <template slot-scope="scope">
            {{ scope.row.repair_check ? scope.row.repair_check.maint_dept_name : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 出库表格 -->
      <el-table 
        v-show="currentTab === 'leave'"
        :data="leaveTableData" 
        stripe 
        :height="320"
        v-loading="loading">
        <el-table-column prop="leave_num" label="出库单号" width="150"></el-table-column>
        <el-table-column prop="state_name" label="审批状态" width="100">
          <template slot-scope="scope">
            <span :style="{'color': getStateColor(scope.row.state)}">{{ scope.row.state_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leave_date" label="出库日期" width="100">
          <template slot-scope="scope">
            {{ scope.row.leave_date ? scope.row.leave_date : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="house_name" label="出库仓库" width="130"></el-table-column>
        <el-table-column prop="relate_num" label="关联工单" width="130"></el-table-column>
        <el-table-column prop="v_num" label="自编号" width="130"></el-table-column>
        <el-table-column prop="lp_num" label="车牌号" width="130"></el-table-column>
        <el-table-column prop="material_code" label="物料编号" width="130"></el-table-column>
        <el-table-column prop="material_name" label="物料名称" width="130"></el-table-column>
        <el-table-column prop="specification" label="规格型号" width="130"></el-table-column>
        <el-table-column prop="count" label="数量" width="130"></el-table-column>
        <el-table-column prop="price" label="单价" width="130"></el-table-column>
        <el-table-column prop="total_price" label="金额" width="130"></el-table-column>
        <el-table-column prop="provider_names" label="供应商" width="130"></el-table-column>
        <el-table-column prop="pick_type_name" label="领料类型" width="130"></el-table-column>
        <el-table-column prop="measure_unit_name" label="单位" width="130"></el-table-column>
        <el-table-column prop="leave_type" label="出库方式" width="130">
          <template slot-scope="scope">
            <span>{{ getLeaveTypeText(scope.row.leave_type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batch_no" label="批次" width="130"></el-table-column>
        <el-table-column prop="pick_depatment_name" label="用料组织" width="130"></el-table-column>
        <el-table-column prop="pick_name" label="制单人" width="130"></el-table-column>
        <el-table-column prop="receiver_name" label="工具领用人" width="130"></el-table-column>
        <el-table-column prop="use_way_name" label="领料用途" width="130"></el-table-column>
        <el-table-column prop="review_name" label="审核人" width="130"></el-table-column>
        <el-table-column prop="review_date" label="审核时间" width="130"></el-table-column>
        <el-table-column prop="position" label="出库仓位" width="130"></el-table-column>
        <el-table-column prop="brand" label="商品规格" width="130"></el-table-column>
        <el-table-column prop="vehicle_mode" label="车型" width="130"></el-table-column>
        <el-table-column prop="operation" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleViewWarehouse(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";

export default {
  name: 'VehicleMaintenanceOverview',
  components: {
    getVehicleSelectDialog
  },
  data() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);
    
    return {
      currentTab: 'repair',
      maintenanceDate: [start, today],
      vehicleIds: [],
      repairTableData: [],
      leaveTableData: [],
      loading: false
    }
  },
  watch: {
    vehicleIds() {
      this.loadTableData();
    }
  },
  mounted() {
    this.loadTableData();
  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab;
      this.loadTableData();
    },
    
    handleDateChange() {
      this.loadTableData();
    },
    
    handleVehicleChange() {
      this.loadTableData();
    },
    
    handleView(row) {
      this.$emit('view-detail', row);
    },
    handleViewWarehouse(row) {
      this.$emit('view-detail-warehouse', row);
    },
    
    getStateColor(state) {
      switch (state) {
        case 1:
          return 'rgb(255, 153, 0)';
        case 2:
          return '#0CB780';
        case 3:
          return '#999999';
        default:
          return '#999999';
      }
    },
    
    getLeaveTypeText(leaveType) {
      const typeMap = {
        'YBCK': '一般出库',
        'WXCK': '维修出库',
        'DBCK': '调拨出库',
        'PKCK': '盘亏出库',
        'HCCK': '红冲出库'
      };
      return typeMap[leaveType] || '';
    },
    
    formatDateTime(date, type) {
      if (!date) return '';
      const d = new Date(date);
      if (type === 'start') {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      } else {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 23:59:59`;
      }
    },
    
    getTableParams() {
      let start_date = '';
      let end_date = '';
      if (this.maintenanceDate && this.maintenanceDate.length === 2) {
        start_date = this.formatDateTime(this.maintenanceDate[0], 'start');
        end_date = this.formatDateTime(this.maintenanceDate[1], 'end');
      }
      return {
        start_date,
        end_date,
        vehicle_ids: this.vehicleIds,
        page_index: 1,
        page_size: 20
      };
    },
    
    async loadTableData() {
      try {
        this.loading = true;
        const params = this.getTableParams();
        let res;
        
        if (this.currentTab === 'repair') {
          res = await this.$client.getByPageMaintRepairRecord(params);
          if (res && res.head && res.head.result === '200') {
            this.repairTableData = res.context.list || [];
          }
        } else {
          res = await this.$client.getByPageLeaveHouse(params);
          if (res && res.head && res.head.result === '200') {
            this.leaveTableData = res.context.list || [];
          }
        }
      } catch (error) {
        console.error('加载表格数据失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 420px;
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
  
  .chart-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.table-content {
  flex: 1;
  overflow: hidden;
}

// 统一radio-button样式
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
</style> 