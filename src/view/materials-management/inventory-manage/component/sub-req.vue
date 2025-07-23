<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="盘点日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择盘点开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择盘点结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="盘点标题:">
          <el-input v-model="form.plan_name" placeholder="请输入盘点标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="盘点类型:">
          <el-select v-model="form.type" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value" v-bind="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onExport()" type="primary" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary" v-if="$isPowerShow('add')">盘点录入</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            title="确定删除勾选中的信息吗？"
            @confirm="onBtn('del')"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary">删除</el-button>
          </el-popconfirm>
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
      date: [],
      form: {
        plan_name: '',
        type: '',
        begin: '',
        end: ''
      },
      typeOptions: [
        {label: '日常', value: 1},
        {label: '月度', value: 2},
        {label: '季度', value: 3},
        {label: '年度', value: 4},
        {label: '盘查', value: 5},
      ]
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
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime() {
      // alert(JSON.stringify(this.form.call_time))
      if(!!this.date && this.date.length > 0) {
        this.form.begin = this.$addTime(this.date)[0]
        this.form.end = this.$addTime(this.date)[1]
      }else{
        this.date = []
        this.form.begin = ''
        this.form.end = ''
      }
    },
    onExport(){
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-export", info);
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
