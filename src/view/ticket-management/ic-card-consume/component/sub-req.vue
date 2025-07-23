<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <get-vehicle-select-tree 
          ref="vehicleTree" 
          placeholder="请选择车辆" 
          :isShowCheckbox="true" 
          v-model="form.vehicle_id">
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item>
          <get-line-select-tree
            ref="vehicleTree"
            :placeholder="'请选择线路'"
            :isShowCheckbox="true"
            v-model="form.line_id"
            :isExportMultiple="true"
          ></get-line-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="exportForm()" icon="el-icon-download" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="chartSet" type="text">{{chartChange ? '收回图表' : '展开图表'}}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "components/base/formModel/tree/get-vehicle-select-tree";
import { getDate } from "@/utils/index";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
export default {
  components: { getVehicleSelectTree, getLineSelectTree },
  data() {
    return {
      date: [],
      form: {
        line_id: "",
        vehicle_id: "",
        begin: "",
        end: ""
      },
      chartChange: true
    };
  },
  mounted() {
      this.onSetTime()
    this.onSubmit();
  },
  methods: {
    //导出
      exportForm() {
      let content = Object.assign({}, this.form);
      this.$client.CreditCartConsumptionSummary(content).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      } else {
        this.form.begin = "";
        this.form.end = "";
      }
    },
    onSetTime(type = 'lastOneDay') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.startTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[0] 
      console.log(this.form.end )
    },
    chartSet() {
      this.chartChange = !this.chartChange;
      this.$emit("on-chart-show", this.chartChange);
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
      this.onSetTime()
      this.$refs.vehicleTree.onClear();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 刷新列表
    refreshTableList() {
      // alert("刷新成功")
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
