<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="充电开始时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree width="200" ref="vehicleTree" placeholder="选择车辆" :isShowCheckbox="true" v-model="form.vehicle_id"></get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id"
          >
          </get-vehicle-select-dialog>
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
          <el-button @click="chartSet" type="text">
            {{chartChange ? '收回图表' : '展开图表'}}
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from 'components/base/formModel/tree/get-vehicle-select-tree'
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
  components: { getVehicleSelectTree, getVehicleSelectDialog},
  data() {
    return {
      date: '',
      form: {
        vehicle_id: [],
        begin: '',
        end: ''
      },
      chartChange: true
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      } else {
        this.form.begin = ''
        this.form.end = ''
      }
    },
    chartSet() {
      this.chartChange = !this.chartChange
      this.$emit('on-chart-show', this.chartChange)
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
    // 导出
    exportForm() {
      this.$emit("export-file");
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      // this.$refs.vehicleTree.onClear();
      this.onSetTime()
      this.onSubmit()
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
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
