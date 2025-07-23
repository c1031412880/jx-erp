<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="司机姓名:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_id"
            :width="'160'"
            :isShowCheckbox="true"
            :placeholder="'请选择司机姓名'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="月份：">
          <el-date-picker
            v-model="form.date"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="selectedMonth"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import {getDate} from '@/utils/index'
export default {
  components: { getDriverSelectTree },
  data() {
    return {
      form: {
        driver_id: [],
        date:"",
      },
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.date = timeObj.startTime.slice(0,7)
    },
    selectedMonth(val) {
      this.form.date = val;
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
    resetForm(type) {
      if(type == 'reset') {
        Object.assign(this.$data.form, this.$options.data().form)
        this.onSetTime()
        this.$refs.driverTree.onClear()
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 100);
      }

      if(!!this.form.date) {
        this.onSubmit()
      }
      
    },
    // 导出
    onBtn(com) {
      this.$emit(`on-${com}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      // alert("刷新成功")
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
