<template>
  <div class="sub-req-box">
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-form-item label="月份">
        <el-date-picker
          v-model="form.month"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item prop="begin">
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
      </el-form-item> -->
      <el-form-item prop="vehicle_ids" v-show="activeName === 'second'">
        <get-vehicle-select-tree
          ref="vehicleTree"
          :placeholder="'选择车辆'"
          :isShowCheckbox="true"
          v-model="form.vehicle_ids">
        </get-vehicle-select-tree>
      </el-form-item>
      <el-form-item prop="line_ids" v-show="activeName === 'first'">
        <get-line-select-tree
          ref="lineTree"
          :placeholder="'选择线路'"
          :isShowCheckbox="true"
          v-model="form.line_ids">
        </get-line-select-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button  @click="Reset('form')" icon="el-icon-refresh-left">重置</el-button>
        <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')">导出</el-button>
        <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import') && activeName === 'first'">导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate, formatTime} from '@/utils/index'
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {
    getLineSelectTree,
    getVehicleSelectTree
  },
  props: {
    activeName:{
      type: String,
      default:'first'
    }
  },
  data() {
    return {
      form: {
        month: '',
        vehicle_ids: [],
        line_ids: [],
      }
    }
  },
  mounted() {
    this.setInitDate()
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    setInitDate() {
      this.form.month = formatTime(new Date()).slice(0, 7)
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        let date = this.$addTime([this.date[0], this.date[1]])
        this.form.start = date[0];
        this.form.end = date[1];
      }else{
        this.form.start = ''
        this.form.end = ''
      }
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(!!info.vehicle_ids && this.activeName === 'first') {
        delete info.vehicle_ids
      }else if(!!info.line_ids && this.activeName === 'second') {
        delete info.line_ids
      }
      this.$emit("on-ok", info);
    },
    Reset() {
      this.setInitDate()
      if(this.activeName === 'first') {
        this.form.vehicle_ids = []
        this.$refs.vehicleTree.onClear()
      }else if(this.activeName === 'second') {
        this.form.lineTree = []
        this.$refs.lineTree.onClear()
      }
      this.onSubmit()
    },
    onBtn(com) {
      let info = this.$outFormData(this.form)
      if(!!info.vehicle_ids && this.activeName === 'first') {
        delete info.vehicle_ids
      }else if(!!info.line_ids && this.activeName === 'second') {
        delete info.line_ids
      }
      this.$emit("on-" + com, info);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>