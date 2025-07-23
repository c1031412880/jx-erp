<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="月份:">
          <el-date-picker
            v-model="form.month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号(自编号)">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'请选择自编号'"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.vehicle_ids"
            clearable
          ></get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="当班驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择当班驾驶员'"
            :isExportMultiple="true"
            clearable
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="稽查状态:">
          <el-select v-model="form.is_check" placeholder="请选择稽查状态" clearable>
            <el-option label="未检查" :value="1"></el-option>
            <el-option label="已检查" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import { formatDate } from "@/utils/index";
export default {
  components: {
    getVehicleSelectTree,
    getDriverSelectTree
  },

  data() {
    return {
      date: [],
      form: {
        month: formatDate(new Date(),'yyyy-MM'),
        vehicle_ids: [],
        driver_ids: [],
        is_check: '',
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
      this.$emit("on-ok", info);
    },
    // 重置
    Reset() {
      this.$refs.vehicleTree.onClear()
      this.$refs.driverTree.onClear()
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    // 导出Excel
    onBtn(type) {
      this.$emit(`on-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped></style>
