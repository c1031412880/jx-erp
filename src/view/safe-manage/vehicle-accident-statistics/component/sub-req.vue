<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="事故日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆：">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.i_vehicle_id"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.i_vehicle_id"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="事故责任:" prop="i_accident_duty">
          <tr-select-dictionaries v-model="form.i_accident_duty" :classKey="'事故责任'" :placeholder="'请选择事故责任类型'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="openExport()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components:{
    getVehicleSelectTree,
    getVehicleSelectDialog
  },
  data() {
    return {
      date: [],
      form: {
        begin: "",
        end: "",
        i_vehicle_id:[],
        i_accident_duty:""
      },
    };
  },
  mounted() {
    this.configSubmit();
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
    configSubmit() {
      let timeObj = getDate('thisMonth')
      this.date = [timeObj.startTime + " 00:00:00", timeObj.endTime + " 23:59:59"];
      this.form.begin = this.date[0];
      this.form.end = this.date[1];
      this.onSubmit();
    },
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
      this.date = [];
      this.form.begin = '';
      this.form.end = '';
      this.form.i_accident_duty = '';
      this.form.i_vehicle_id = [];
      this.configSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    openExport() {
      this.$emit("on-export");
    },
    // 刷新列表
    refreshTableList() {
      this.date = [];
      this.form.begin = '';
      this.form.end = '';
      this.form.i_accident_duty = '';
      this.configSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
