<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="考核模板名称:">
      <el-input v-model="form.exam_name" clearable></el-input>
    </el-form-item>
    <el-form-item label="处理状态">
      <el-select v-model="form.appeal_state" placeholder="请选择" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申诉时间">
      <el-date-picker
        v-model="date"
        type="daterange"
        start-placeholder="选择开始日期"
        end-placeholder="选择结束日期"
        range-separator="至"
        value-format="yyyy-MM-dd"
        @change="selectedTime"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import {getDate} from "@/utils/index"
export default {
  components: {
    getSelectDictionaries
  },
  data() {
    return {
      date: [],
      form: {
        start_time: '',
        end_time: '',
        temp_name: '',
        appeal_state: ''
      },
      options: [
        {
          label: '待处理',
          value: 1
        },
        {
          label: '已处理',
          value: 2
        },
        {
          label: '已撤销',
          value: 3
        },
      ]
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = "thisYear") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_time = this.date[0];
      this.form.end_time = this.date[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = "";
        this.form.end_time = "";
      }
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.date = []
      this.form.appeal_state = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.temp_name = ''
      this.onSubmit()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>