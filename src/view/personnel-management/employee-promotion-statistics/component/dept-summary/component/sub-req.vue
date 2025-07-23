<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="日期">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="选择开始日期"
        end-placeholder="选择结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
      <el-button type="primary" @click="onBtn('export')">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from "@/utils/index"
export default {
  components: {},
  data() {
    return {
      date: [],
      form: {
        start_date: '',
        end_date: '',
      },
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = "thisYear") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
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