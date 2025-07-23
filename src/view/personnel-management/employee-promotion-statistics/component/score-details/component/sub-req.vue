<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="录用时间">
      <el-select v-model="type" @change="changeType" style="width: 80px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
    <el-form-item label="姓名">
      <el-input v-model="form.name" clearable></el-input>
    </el-form-item>
    <el-form-item label="宣传类型:" prop="advert_type">
      <get-select-dictionaries
        style="width: 100%"
        v-model="form.advert_type"
        :classKey="'宣传类型'"
        :placeholder="'请选择宣传类型'"
      ></get-select-dictionaries>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onExport()" icon="el-icon-download">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { getSelectDictionaries },
  data() {
    return {
      form: {
        name: '',
        start_time: '',
        end_time: '',
        advert_type: ''
      },
      date: [],
      type: 'thisYear',
      options: [
        {
          label: '年',
          value: 'thisYear'
        },
        {
          label: '季',
          value: 'thisQuarter'
        },
        {
          label: '月',
          value: 'thisMonth'
        },
      ]
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    changeType() {
      this.onSetTime(this.type)
    },
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
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        info[i] = this.form[i]
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.form.name = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.advert_type = ''
      this.type = 'thisYear'
      this.onSetTime(this.type)
      this.onSubmit()
    },
    onExport() {
      this.$emit("on-export");
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>