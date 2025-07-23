<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="公文排序:">
        <el-select v-model="form.order_type">
          <el-option label="按字号排序" :value="1"></el-option>
          <el-option label="按时间排序" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收文文标题/编号:">
        <el-input placeholder="请输入公文标题/编号" v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="收文字号:">
        <el-input placeholder="请输入收文字号" v-model="form.font_number"></el-input>
      </el-form-item>
      <el-form-item label="收文登记人:">
        <get-dept-emp-select-tree placeholder="选择收文登记人" :func_type="0" :is_contain_emp="true" v-model="form.register_id"></get-dept-emp-select-tree>
      </el-form-item>
      <el-form-item label="来文机关:">
        <el-input placeholder="请输入来文机关" v-model="form.organ"></el-input>
      </el-form-item>
      <el-form-item label="来文日期:">
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
      <el-form-item label="收文类型:">
        <el-select v-model="form.accept_type" placeholder="请选择收类型" clearable>
          <el-option
            v-for="(item,i) in acceptTypeArr"
            :key="i"
            v-bind="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成时间:">
        <el-date-picker
          v-model="create_date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="createSelectedTime"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="form.state" clearable>
          <el-option label="已归档" :value="4"></el-option>
          <el-option label="已作废" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
      </el-form-item>

      <div style="float: right; height: 47px; display: flex">
        <i
          class="el-icon-s-tools"
          style="cursor: pointer"
          @click="openSettingPage()"
        ></i>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
export default {
  components: { getDeptEmpSelectTree},
  data() {
    return {
      date: '',
      create_date: '',
      draft_option: [
        {label: '已处理', value: 1},
        {label: '待处理', value: 2},
        {label: '已驳回', value: 3},
      ],
      acceptTypeArr: [
        {label: '命令', value: 1},
        {label: '决定', value: 2},
        {label: '议案', value: 3},
        {label: '指示', value: 4},
        {label: '公告', value: 5},
        {label: '布告', value: 6},
        {label: '通告', value: 7},
        {label: '通知', value: 8},
        {label: '通报', value: 9},
        {label: '报告', value: 10},
        {label: '请示', value: 11},
        {label: '批复', value: 12},
        {label: '意见', value: 13},
        {label: '决议', value: 14},
        {label: '公报', value: 15},
        {label: '函', value: 16},
        {label: '会议纪要', value: 17},
      ],
      form: {
        keyword: '',
        title: '',
        state: '',
        organ: '',
        end_time: '',
        start_time: '',
        create_end_time: '',
        create_start_time: '',
        order_type: 0,
        is_state: 4,
        register_id: ''
      },
      chartChange: true
    };
  },
  mounted() {
    this.onSetTime()
    this.createSelectedTime()
    this.onSubmit()
  },
  methods: {
    setReceipt() {
      this.$emit('on-receipt')
    },
    onSetTime(type = 'thisYear') {
      let timeObj = getDate(type)
      this.form.start_time = timeObj.startTime
      this.form.end_time = timeObj.endTime
      this.date = [this.form.start_time, this.form.end_time]
      this.form.end_time = this.form.end_time + ' 23:59:59'

      this.form.create_start_time = timeObj.startTime
      this.form.create_end_time = timeObj.endTime
      this.create_date = [this.form.create_start_time, this.form.create_end_time]
      this.form.create_end_time = this.form.create_end_time + ' 23:59:59'
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
    // 生成时间
    createSelectedTime() {
      if(this.create_date && this.create_date.length>0) {
        this.form.create_start_time = this.create_date[0]
        this.form.create_end_time = this.create_date[1] + ' 23:59:59'
      } else {
        this.form.create_start_time = ''
        this.form.create_end_time = ''
      }
    },
    chartSet() {
      this.chartChange = !this.chartChange
      this.$emit('on-chart-show', this.chartChange)
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] || this.form[i] === 0) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 导出
    exportForm() {

    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      // this.$refs.vehicleTree.onClear();
      setTimeout(() => {
        this.onSubmit()
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 刷新列表
    refreshTableList() {
      // alert("刷新成功")
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
