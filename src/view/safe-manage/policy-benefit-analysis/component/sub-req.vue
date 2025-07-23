<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期范围:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :width="'200'"
            :isShowCheckbox="true"
            v-model="form.ids"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.ids"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="赔付金额:">
          <div class="show-flex-box-r">
            <el-input
              placeholder="请输入"
              v-model="form.min"
              clearable
              style="width: 100px"
              oninput="value=value.replace(/[^\d.]/g,'')" @blur="form.min = $event.target.value" 
              >
            </el-input>
            <span>&nbsp;至&nbsp;</span>
            <el-input
              placeholder="请输入"
              v-model="form.max"
              clearable
              style="width: 100px"
              oninput="value=value.replace(/[^\d.]/g,'')" @blur="form.max = $event.target.value" 
              >
            </el-input>
          </div>
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
          <el-button @click="exportInfo()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>

    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
  components: {getVehicleSelectTree,getVehicleSelectDialog},
  data() {
    return {
      date:[],
      form: {
        start:"",
        end:"",
        ids:[],
        min:"",
        max:"",
      },
    };
  },
  mounted() {
    this.onSetTime();
    this.onSubmit()
  },
  methods: {
     selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    onSetTime(type = 'thisYear') {
      let timeObj = getDate(type)
      this.date = [timeObj.startTime, timeObj.endTime]
      this.form.start = this.date[0]
      this.form.end = this.date[1] + ' 00:00:00'
      // console.log(this.date)
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
      this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    exportInfo() {
      this.$emit("on-export");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
