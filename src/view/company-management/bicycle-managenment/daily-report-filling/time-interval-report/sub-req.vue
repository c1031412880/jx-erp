<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  components: {
  },
  data() {
    return {
      date: [],
      form: {
        start_date: '',
        end_date: '',
      },
    };
  },
  mounted() {
    this.setDate()
    this.onSubmit()
  },
  methods: {
    setDate() {
      let timeObj = getDate('thisMonth');
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    // 查询
    onSubmit() {
      this.$emit("on-ok", this.form);
    },
    // 重置
    resetForm() {
      this.setDate()
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
