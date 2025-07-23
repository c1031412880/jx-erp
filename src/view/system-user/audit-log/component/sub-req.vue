<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="方法执行时间:">
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
    <el-form-item label="大于调用时间（秒）：">
      <el-input-number :controls="false" v-model="form.duration" placeholder="请输入文件名称"></el-input-number>
    </el-form-item>
    <el-form-item label="状态：">
      <el-select v-model="form.state" placeholder="选择状态" :clearable="true">
        <el-option label="正常" :value="1"></el-option>
        <el-option label="异常" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排序方式：">
      <el-select v-model="form.order_type" placeholder="排序方式" :clearable="true">
        <el-option label="执行时间" :value="0"></el-option>
        <el-option label="持续时间" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit('query')">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button  @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      date: '',
      form: {
        start_time: '',
        end_time: '',
        duration: '',
        state: '',
        order_type: 0
      },
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit('query')
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.start_time = timeObj.startTime
      this.form.end_time = timeObj.endTime
      this.date = [this.form.start_time, this.form.end_time]
      this.form.end_time = this.form.end_time + ' 23:59:59'
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.start_time = this.date[0]
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
    },
    onSubmit(type) {
      if(type == 'query') {
        let info = {};
        for (let i in this.form) {
          if (this.form[i]) {
            info[i] = this.form[i];
          }
        }
        this.$emit("on-ok", info);
      } else{
        this.$emit(`on-${type}`);
      }
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSubmit('query');
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
