<template>
  <el-form :inline="true" size="mini">
    <el-form-item>
      <el-input
        v-model="form.content"
        clearable placeholder="请输入搜索关键词,包括审批标题,编号,正文内容"
        prefix-icon="el-icon-search" style="width: 350px;"></el-input>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="submit_time_list"
        type="datetimerange"
        range-separator="至"
        start-placeholder="发起审批开始日期"
        end-placeholder="发起审批结束日期"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="complete_time_list"
        type="datetimerange"
        range-separator="至"
        start-placeholder="完成审批开始日期"
        end-placeholder="完成审批结束日期"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      form: {
        content: '',
        submit_time_start: '',
        submit_time_end: '',
        complete_time_start: '',
        complete_time_end: '',
      },
      submit_time_list: [],
      complete_time_list: [],
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.submit_time_list = this.$addTime([timeObj.startTime + ' 00:00:00', timeObj.endTime])
      this.form.submit_time_start = timeObj.startTime
      this.form.submit_time_end = timeObj.endTime
    },
    onSubmit() {
      if (this.submit_time_list) {
        this.form.submit_time_start = this.submit_time_list[0]
        this.form.submit_time_end = this.submit_time_list[1]
      } else {
        this.form.submit_time_start = ''
        this.form.submit_time_end = ''
      }
      if (this.complete_time_list) {
        this.form.complete_time_start = this.complete_time_list[0]
        this.form.complete_time_end = this.complete_time_list[1]
      } else {
        this.form.complete_time_start = ''
        this.form.complete_time_end = ''
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i] && this.form[i].length > 0) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>