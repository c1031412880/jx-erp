<template>
  <el-form :inline="true" size="mini">
    <el-form-item>
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
    <el-form-item>
      <get-vehicle-select-tree placeholder="选择车辆" v-model="form.vehicle_id"  :isShowCheckbox="true"></get-vehicle-select-tree>
    </el-form-item>
    <el-form-item>
      <get-line-select-tree  ref="getLineSelectTree" placeholder="选择线路"  :isShowCheckbox="true" v-model="form.line_ids"></get-line-select-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button  @click="dow" icon="el-icon-refresh-left">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "../../../../../components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "../../../../../components/base/formModel/tree/get-line-select-tree";
import {getDate} from '@/utils/index'
export default {
  name: "sub-req",
  components: {getVehicleSelectTree, getLineSelectTree},
  data() {
    //这里存放数据",
    return {
      date: [],
      form: {
        date: [],
        vehicle_ids: [],
        line_ids: []
      }
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  //方法集合",
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.date = this.date
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.date = this.date
      }else{
        this.form.date = []
      }
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
    dow() {
      this.$emit('on-dow')
    },
    // 重置
    Reset(){
      Object.assign(this.$data,this.$options.data())
      this.$refs.getLineSelectTree.onClear()
      this.onSetTime()
      this.onSubmit()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
