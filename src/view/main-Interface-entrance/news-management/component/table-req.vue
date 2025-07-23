<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="发布时间:">
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
    <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
    <el-form-item label="发起人:">
      <get-department-select
        ref="personalTree"
        v-model="form.user_id"
        :isShowCheckbox="false"
        :placeholder="'请选择发起人'"
        :isContainEmp="true"
        :show_all="true"
        :isExportMultiple="false"
        :clearable="false"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="form.state" clearable>
        <el-option label="草稿" :value="-1"></el-option>
        <el-option label="待审核" :value="1"></el-option>
        <el-option label="审核通过" :value="2"></el-option>
        <el-option label="审核驳回" :value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit" type="primary">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm" type="primary">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  props: {},
  data() {
    return {
      date: '',
      form: {
        start: '',
        end: '',
        title: '',
        state: 1,
        user_id: '',
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.onSetTime()
      this.onSubmit()
    })
  },
  methods: {
    // 默认时间
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.start = timeObj.startTime
      this.form.end = timeObj.endTime
      this.date = [this.form.start, this.form.end]
      this.form.end = this.form.end + ' 23:59:59'
    },
    // 选择时间
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.start = this.date[0]
        this.form.end = this.date[1] + ' 23:59:59'
      } else {
        this.form.start = ''
        this.form.end = ''
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
      info.state = this.form.state
      console.log("info",info)
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.post_id = ''
      Object.assign(this.$data, this.$options.data());
      setTimeout(() => {
        this.onSubmit()
        this.$message({ message: "重置成功", type: "success" });
      }, 300);  
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
