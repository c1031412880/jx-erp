<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期范围:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :width="'200'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="保养类型:">
          <el-select v-model="form.upkeep_type" placeholder="请选择保养类型">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="一保" :value="1"></el-option>
            <el-option label="二保" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态:">
          <el-select v-model="form.state" placeholder="请选择执行状态">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="未执行" :value="2"></el-option>
            <el-option label="已执行" :value="1"></el-option>
          </el-select>
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
          <el-button @click="exportInfo()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>

    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import {getDate} from '@/utils/index'
export default {
  components: {getVehicleSelectTree},
  data() {
    return {
      date:[],
      form: {
        start:"",
        end:"",
        vehicle_ids:[],
        upkeep_type:0,
        state:0,
      },
    };
  },
  mounted() {
    this.onSetTime();
    this.onSubmit()
  },
  methods: {
     selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = [timeObj.startTime, timeObj.endTime]
      this.form.start = this.date[0]
      this.form.end = this.date[1] + ' 00:00:00'
      // console.log(this.date)
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
      Object.assign(this.$data, this.$options.data());
      this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    exportInfo() {
      this.$emit("on-export");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
