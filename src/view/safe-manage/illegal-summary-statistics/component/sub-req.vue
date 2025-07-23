<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="违法日期:">
          <el-date-picker
            v-model="form.violation_date"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆组织:" v-show="activeName == '1'">
          <get-department-select
            ref="departmentlTree"
            v-model="form.department_ids"
            :placeholder="'请选择车辆组织'"
            :isContainEmp="false"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            :funcType="1"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="线路:" v-show="activeName == '2'">
          <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="form.line_ids"
              :isExportMultiple="true"
            >
            </get-line-select-tree>
        </el-form-item>
        <el-form-item label="车辆:" v-show="activeName == '3'">
          <!-- <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="true"
              v-model="form.vehicle_ids"
              :isExportMultiple="true"
            >
            </get-vehicle-select-tree> -->
            <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="驾驶员:" v-show="activeName == '4'">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择所事故驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
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
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
   components: {
    getDepartmentSelect,
    getVehicleSelectTree,
    getVehicleSelectDialog,
    getLineSelectTree,
    getDriverSelectTree,
  },
  props:{
    activeName: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      form: {
        violation_date: []
      },
    };
  },
  mounted() {
    this.configOnSubmit();
  },
  methods: {
    selectedTime(val) {
      this.form.violation_date = val
    },
    configOnSubmit() {
      let timeObj = getDate('thisMonth')
      this.form.violation_date = [timeObj.startTime + " 00:00:00", timeObj.endTime + " 23:59:59"]
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
      switch (this.activeName) {
        case '1':
          this.$refs.departmentlTree.onClear();
          break;
        case '2':
          this.$refs.lineTree.onClear();
          break;
        case '3':
          // this.$refs.vehicleTree.onClear();
          this.form.vehicle_ids = [];
          break
        case '4':
          this.$refs.driverTree.onClear();
          break;
      }
      this.configOnSubmit();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出 
    onExport() {
      this.$emit("on-export");
    },
    deleteJob() {
      this.$emit("delete-Job");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.type = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
