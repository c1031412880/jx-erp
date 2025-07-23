<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="月份">
      <el-date-picker
        v-model="form.check_month"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="部门">
      <get-department-select
        ref="departmentlTree"
        v-model="form.group_ids"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :isShowCheckbox="true"
        :isExportMultiple="true"
        :isCheckStrictly="false"
        :funcType="1"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="驾驶员">
      <get-driver-select-tree
        ref="driverTree"
        v-model="form.driver_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择所驾驶员'"
        :isExportMultiple="true"
      ></get-driver-select-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
      <el-button type="primary" @click="onBtn('export')">导出</el-button>
      <!-- <el-button type="primary" @click="onBtn('import')">导入IC卡数据</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {formatTime} from "@/utils/index"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";

export default {
  components: { getDepartmentSelect, getDriverSelectTree },
  data() {
    return {
      form: {
        check_month: '',
        group_ids: [],
        driver_ids:[]
      },
    }
  },
  mounted() {
    this.setDate()
    this.onSubmit()
  },
  methods: {
    setDate() {
      this.form.check_month = formatTime(new Date()).slice(0, 7)
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSubmit();
    },
    onBtn(type) {
      this.$emit('on-' + type, this.info)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>