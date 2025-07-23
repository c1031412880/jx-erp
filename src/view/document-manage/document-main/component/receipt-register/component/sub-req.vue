<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="收文标题/编号:">
          <el-input placeholder="收文标题/编号" v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item label="来文字号:">
          <el-input placeholder="来文字号" v-model="form.font_number"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="form.state" clearable>
            <el-option label="待处理" value="1"></el-option>
            <el-option label="已处理" value="2"></el-option>
            <el-option label="已驳回" value="3"></el-option>
            <el-option label="已归档" value="4"></el-option>
            <el-option label="已作废" value="5"></el-option>
          </el-select>
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
        <el-form-item label="收文编号:">
          <el-input placeholder="请输入收文编号" v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setReceipt">收文登记</el-button>
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
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
      draft_option: [
        {label: '已处理', value: 1},
        {label: '待处理', value: 2},
        {label: '已驳回', value: 3},
      ],
      form: {
        keyword: '',
        title: '',
        organ: '',
        state: '',
        end_time: '',
        start_time: '',
        font_number: '',
        register_id: '',
        code:'',
      },
      chartChange: true
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    setReceipt() {
      this.$emit('on-receipt')
    },
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
    chartSet() {
      this.chartChange = !this.chartChange
      this.$emit('on-chart-show', this.chartChange)
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      console.log(info, this.form)
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
