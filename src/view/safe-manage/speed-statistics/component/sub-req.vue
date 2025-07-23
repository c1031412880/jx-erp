<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'请选择车辆'"
              :isShowCheckbox="true"
              v-model="form.vehicle_ids"
              :isExportMultiple="true"></get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="超速持续时长:">
          <el-input-number 
            v-model="form.min" 
            :min="0"
            :precision="0"
            :controls="false"></el-input-number>
          <span>秒</span>
        </el-form-item>
        <el-form-item label="超速类型:">
          <el-select
            v-model="form.type"
            style="width: 120px">
            <el-option
              v-for="(item, index) in speedType"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button 
          type="primary" 
          @click="onSubmit"
          icon="el-icon-search" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
          type="primary" 
          @click="resetForm()" 
          icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
          type="primary" 
          @click="onExport()" 
          icon="el-icon-download" >导出</el-button>
          <!-- v-if="$isPowerShow('export')" -->
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  props:{
    activeName: {
      type: String,
      default: "first",
    },
  },
  components: {
    getVehicleSelectTree,
    getDriverSelectTree,
    getVehicleSelectDialog
  },
  data() {
    return {
      speedType: [ //超速类型
        { value: '0', label: '全部' },
        { value: '2', label: '普通超速报警' },
        { value: '512', label: '区域超速报警' },
      ],
      date: [],
      form: {
        vehicle_ids: [],
        driver_ids: [],
        begin_time: '',
        end_time: '',
        min: '30',
        type: '512',
      }
    }
  },
  mounted() {
    this.getTodayTime()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.vehicle_ids = []
      this.form.driver_ids = []
      // this.$refs.vehicleTree.onClear();
      this.$refs.driverTree.onClear();
      this.form.min = '30';
      this.form.type = '512';
      this.getTodayTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    // 导出
    onExport() {
      this.$emit("on-export");
    },
    getTodayTime() {
      let timeObj = getDate('today')
      this.date = [timeObj.startTime + " 00:00:00", timeObj.endTime + " 23:59:59"]
      this.form.begin_time = this.date[0];
      this.form.end_time = this.date[1];
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.begin_time = '';
        this.form.end_time = '';
      }
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>