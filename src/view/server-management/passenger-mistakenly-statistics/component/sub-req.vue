<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="制表人" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择制表人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="乘客姓名" prop="passenger_name">
          <el-input
            v-model="form.passenger_name"
            placeholder="请输入乘客姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.date"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆：">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            :oilType="2"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="onSubmit"
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="" 
            @click="resetForm"
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { 
    getVehicleSelectTree,getDepartmentSelect
  },

  data() {
    return {
      vehTypeData: [],
      form: {
        user_ids: [],
        vehicle_ids: [],
        passenger_name: '',
        date: formatDate(new Date(),'yyyy-MM-dd')
      },
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
   
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(this.form.vehicle_ids.length === 0) {
        delete info.vehicle_ids
      }
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.vehicleTree.onClear()
      // this.getVehType()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  // watch: {
  //   value(val) {
  //     this.form.tyreCountState = val
  //   }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>