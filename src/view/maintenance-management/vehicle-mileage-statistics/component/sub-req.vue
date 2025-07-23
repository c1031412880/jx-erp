<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="form.start_time"
            type="date"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedTime">
          </el-date-picker>   
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆：">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            :codeAndName="true"
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
        <el-form-item>
          <el-button
            type="primary" 
            @click="onBtn('export1')" 
            icon="el-icon-download" 
            >导出表1</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary" 
            @click="onBtn('export2')" 
            icon="el-icon-download" 
            >导出表2</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary" 
            @click="recalculate()" 
            >重新计算</el-button>
        </el-form-item>
        <el-form-item v-show="isEdit">
          <el-button
            type="primary" 
            @click="onAll('edit')" 
            >批量编辑</el-button>
        </el-form-item>
        <el-form-item v-show="!isEdit">
          <el-button
            type="primary" 
            @click="onAll('save')" 
            >批量保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import {endGreaterStart} from "@/utils"
export default {
  components: { 
    getVehicleSelectTree,
  },

  data() {
    return {
      vehTypeData: [],
      form: {
        start_time: '',
        end_time: '',
        vehicle_ids: [],
      },
      isEdit: true
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    //判断开始结束时间
    selectedTime() {
      if(!this.form.start_time || !this.form.end_time){
        return
      }
      //endGreaterStart 开始小于结束返回true
      if( !endGreaterStart(this.form.start_time,this.form.end_time)){
        this.$message({ message: "结束时间不能早于开始时间，请重新选择!", type: "warning" });
        this.onSetTime()
      }
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.start_time = timeObj.startTime
      this.form.end_time = timeObj.endTime
    },
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(this.form.vehicle_ids.length === 0) {
        delete info.vehicle_ids
      }
      info.start_time = this.form.start_time + ' 00:00:00'
      info.end_time = this.form.end_time + ' 23:59:59'
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.vehicleTree.onClear()
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    onAll(type) {
      this.$emit(`on-all-${type}`);
    },
    recalculate() {
      this.$emit(`on-recalculate`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>