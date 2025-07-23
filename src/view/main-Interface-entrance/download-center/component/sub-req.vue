<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="文件名:">
          <el-input v-model="form.name" placeholder="搜索文件名" clearable></el-input>
        </el-form-item>
        <el-form-item label="上传日期:">
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
        <el-form-item v-if="$isPowerShow('add')">
          <el-button @click="add()" type="primary"
            >上传文件</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      date:[],
      form: {
        name: "",
        created_date_start: "",
        created_date_end: ""
      },
    };
  },
  mounted() {
    // this.onSetTime();
    this.onSubmit();
  },
  methods: {
    onSetTime(type = 'lastOneYear') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.created_date_start = this.date[0]
      this.form.created_date_end = this.date[1]
      // console.log(this.date)
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.created_date_start = this.date[0];
        this.form.created_date_end = this.date[1];
      }else{
        this.form.created_date_start = '';
        this.form.created_date_end = '';
      }
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
    // 添加编辑
    add() {
      this.$emit("on-add", 'add');
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
