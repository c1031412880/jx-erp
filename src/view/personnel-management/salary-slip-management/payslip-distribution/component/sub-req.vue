<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="工资条名称:">
         <el-input v-model="form.slip_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="发布时间:">
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
        <el-form-item label="状态:">
          <el-select v-model="form.state" clearable multiple placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn()" icon="el-icon-plus">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  props:{
  },
  components: {},
  data() {
    return {
      form: {
        slip_name:'',
        start_date: '',
        end_date: '',
        state: [],
        is_query_my: 1
      },
      date:[],
      statusOptions: [
        {
          value: 0,
          label: '待发放'
        }, 
        {
          value: 1,
          label: '已发放'
        }, 
        {
          value: 2,
          label: '已撤回'
        }, 
        {
          value: 3,
          label: '定时发放'
        }, 
      ],
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
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
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn() {
      this.$emit("on-add");
    },
    resetForm() {
      this.form.slip_name = ''
      this.form.state = []
      this.onSetTime()
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
