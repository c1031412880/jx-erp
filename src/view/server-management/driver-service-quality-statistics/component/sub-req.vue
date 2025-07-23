<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="月份：">
          <el-date-picker
            v-model="form.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="selectedMonth"
            :clearable="false"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="取消本季度星级考核:" prop="is_cancle">
          <el-radio-group v-model="form.is_cancle">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="show_dimission">
          <el-checkbox v-model="emp_state">仅显示在职驾驶员</el-checkbox>
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
          <el-button @click="onExport()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getDriverSelectTree
  },
  data() {
    return {
      emp_state: true,
      form: {
        month:"",
        driver_ids:[],
        emp_state: 1,
        is_cancle: false,
      },
    };
  },
  mounted() {
    this.setDate();
    this.onSubmit();
  },
  methods: {
    selectedMonth(val) {
      this.form.month = val;
    },
    // 设置默认日期为当月
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      // **********上一个月****************
      // let M = date.getMonth()
      // if(M == 0) {
      //   Y = Y - 1 
      //   M = 12
      // }
      // M = M < 10?'0' + M : M 
      // **********上一个月****************
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.month = Y + '-' + M
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }

      info.emp_state = this.emp_state?1:0

      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.emp_state = true;
      this.form.emp_state = true;
      this.form.month = "";
      this.form.driver_ids = [];
      // 清空驾驶员选中
      this.$refs.driverTree.onClear();
      this.onSubmit();
      // this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    onExport() {
      this.$emit("on-export");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
