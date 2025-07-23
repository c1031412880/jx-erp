<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <!-- <el-form-item label="车辆:">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
        </el-form-item> -->
        <!-- <el-form-item label="结束日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="el-icon-upload2" @click="exportExcel()" type="primary" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item> -->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-upload2" @click="exportExcel()" type="primary" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <!-- <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {getVehicleSelectTree},
  data() {
    return {
      date:[],
      form: {
        start: "",
        end: "",
      },
    };
  },
  mounted() {
  },
  methods: {
    selectedTime() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
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
      this.date = [];
      this.form.start= "";
      this.form.end = "";
      this.onSubmit();
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
    },
    //导出 
    exportExcel() {
      this.$emit('export-excel')
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.resetForm();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 100);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
