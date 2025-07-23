<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="事发日期:">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="选择开始日期"
        end-placeholder="选择结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :clearable="false"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input v-model="form.remark" clearable placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
      <el-form-item v-show="isEdit">
        <el-button
          type="primary" 
          @click="onBtn('edit')" 
          >批量编辑</el-button>
      </el-form-item>
      <el-form-item v-show="!isEdit">
        <el-button
          type="primary" 
          @click="onBtn('save')" 
          >批量保存</el-button>
      </el-form-item>
      <el-button type="primary" @click="onBtn('export')">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate, formatDate} from "@/utils/index"
export default {
  components: {},
  data() {
    return {
      date: [],
      form: {
        call_time_start: '',
        call_time_end: '',
        remark: ''
      },
      isEdit: true
    }
  },
  mounted() {
    this.onSetTime()
  },
  methods: {
    // 初始化时间
    onSetTime(type = "thisMonth") {
      // let timeObj = getDate(type);
      // this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.call_time_end = formatDate(new Date(),'yyyy-MM-dd') + ' 23:59:59'
      this.form.call_time_start = formatDate(new Date(this.form.call_time_end),'yyyy-MM') + '-01'  + ' 00:00:00 '

      this.date = [this.form.call_time_start,this.form.call_time_end]
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.call_time_start = this.date[0];
        this.form.call_time_end = this.date[1] + ' 23:59:59'
      } else {
        this.form.call_time_start = "";
        this.form.call_time_end = "";
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
    resetForm() {
      this.date = []
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(type) {
      this.$emit('on-' + type, this.info)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>