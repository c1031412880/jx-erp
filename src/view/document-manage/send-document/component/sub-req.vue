<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="公文标题/编号:">
          <el-input placeholder="请输入公文标/编号"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="form.vehicle_id">
            <el-option v-for="(item,i) in draft_option" :key="i" v-bind="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拟稿人:">
          <el-input placeholder="请输入拟稿人"></el-input>
        </el-form-item>
        <el-form-item label="发文类型:">
          <el-input placeholder="请输入拟稿人"></el-input>
        </el-form-item>
        <el-form-item label="缓急程度:">
          <el-input placeholder="请输入拟稿人"></el-input>
        </el-form-item>
        <el-form-item label="保密密级:">
          <el-input placeholder="请输入拟稿人"></el-input>
        </el-form-item>
        <el-form-item label="发文日期:">
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onDraft">拟稿</el-button>
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
      date: '',
      draft_option: [
        {label: '草稿', value: '1'},
        {label: '待校对', value: '2'},
        {label: '初审核', value: '3'},
        {label: '待会签', value: '4'},
        {label: '待审核', value: '5'},
        {label: '待签发', value: '6'},
        {label: '待排版', value: '7'},
        {label: '待套红', value: '8'},
        {label: '待盖章', value: '9'},
        {label: '待打印', value: '10'},
        {label: '待发布', value: '11'},
        {label: '待归档', value: '13'},
        {label: '待修改', value: '14'},
        {label: '已归档', value: '15'},
      ],
      form: {
        vehicle_id: '',
        begin: '',
        end: ''
      },
      chartChange: true
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.begin = timeObj.startTime
      this.form.end = timeObj.endTime
      this.date = [this.form.begin, this.form.end]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      } else {
        this.form.begin = ''
        this.form.end = ''
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
      this.$emit("on-ok", info);
    },
    onDraft() {
      this.$emit('on-draft')
    },
    // 导出
    exportForm() {

    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$refs.vehicleTree.onClear();
      setTimeout(() => {
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
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
