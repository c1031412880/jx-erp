<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="借车人:">
          <el-input v-model="form.user_name" placeholder="请输入借车人" clearable></el-input>
        </el-form-item>
        <el-form-item label="借车时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn()" type="primary"  icon="el-icon-download">导出</el-button>
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
        user_name: "",
        start: '',
        end: ''
      },
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime() {
      let timeObj = getDate("thisMonth")
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
    },
    // 查询
    onSubmit() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.start = this.date[0] + ' 00:00:00'
        this.form.end = this.date[1]

        let start = new Date(this.form.start).getTime()
        let end = new Date(this.form.end).getTime()
        let day = (end - start) / (24 * 60 * 60 * 1000)
        if (day > 365) {
          this.$message({ message: `借车时间范围不可超过一年`, type: "warning" });
          return false
        }
      }else{
        this.date = []
        this.form.start = ''
        this.form.end = ''
      }
      
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.state === 0) {
        info.state = 0
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      Object.assign(this.$data, this.$options.data());
      this.onSetTime()
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    onBtn() {
      this.$emit("on-export");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
