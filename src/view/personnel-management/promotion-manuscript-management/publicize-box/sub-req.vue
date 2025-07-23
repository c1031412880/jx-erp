<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="关键字:">
          <el-input v-model="form.content" clearable></el-input>
        </el-form-item>
        <el-form-item label="经办人">
          <get-department-select
            ref="tree"
            v-model="form.user_ids"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            :isContainEmp="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="时间:">
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
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onBtn('save')">确认</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('close')">关闭</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import { getDate } from "@/utils/index";
export default {
  props:{
  },
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        content: '',
        start_date: '',
        end_date: '',
        user_ids: []
      },
    };
  },
  mounted() {
    this.onSetTime()
  },
  methods: {
    // 初始化时间
    onSetTime(type = "lastOneMonth") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`;
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    resetForm() {
      this.onSetTime()
      this.form.content = ''
      this.form.start_date = ''
      this.form.end_date = ''
      this.form.user_ids = []
      this.$refs.tree.onClear()
      this.onSubmit()
    },
    // 调整排序
    adjustSortSet() {
      this.$emit("adjust-sort-set", this.isSort)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
