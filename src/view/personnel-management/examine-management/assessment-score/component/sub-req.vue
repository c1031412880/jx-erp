<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="考核模板名称:">
      <el-input v-model="form.exam_name" style="width:120px" clearable></el-input>
    </el-form-item>
    <el-form-item label="考核类型" prop="exam_type">
      <!-- <get-select-dictionaries 
        style="width:130px"
        v-model="form.exam_type" 
        :classKey="'考核类型'" 
        :placeholder="'请选择考核类型'" 
      ></get-select-dictionaries> -->
      <el-select
        v-model="form.exam_type"
        style="width: 100%"
        placeholder="请选择考核类型"
        clearable
      >
        <el-option
          v-for="item in examList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间">
      <el-date-picker
        v-model="date"
        type="daterange"
        start-placeholder="选择开始日期"
        end-placeholder="选择结束日期"
        range-separator="至"
        value-format="yyyy-MM-dd"
        @change="selectedTime"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="考核状态">
      <el-select v-model="form.exam_state" style="width:130px" placeholder="请选择" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="审核人" v-if="$isPowerShow('all')">
      <get-department-select
        ref="tree"
        v-model="form.exam_check_id"
        :isExportMultiple="false"
        :isCheckStrictly="false"
        :isContainEmp="true"
        :isShowCheckbox="false"
      ></get-department-select>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getDate} from "@/utils/index"
import { getUser } from '@/utils/auth';
export default {
  components: {
    getSelectDictionaries,
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        start_time: '',
        end_time: '',
        exam_state: '',
        check_or_user_id: JSON.parse(getUser()).user_id
      },
      examList: [
        {
          label: "日考核",
          value: 1,
        },
        {
          label: "月考核",
          value: 2,
        },
        {
          label: "季度考核",
          value: 3,
        },
        {
          label: "年度考核",
          value: 4,
        },
      ],
      options: [
        {
          label: '未开始',
          value: 0
        },
        {
          label: '考核中',
          value: 1
        },
        {
          label: '待审核',
          value: 2
        },
        {
          label: '待确认',
          value: 3
        },
        {
          label: '申诉中',
          value: 4
        },
        {
          label: '已确认',
          value: 5
        },
        {
          label: '已结束',
          value: 6
        },
      ]
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = "thisYear") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_time = this.date[0];
      this.form.end_time = this.date[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = "";
        this.form.end_time = "";
      }
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.date = []
      this.form.exam_name = ''
      this.form.exam_type = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.exam_state = ''
      this.onSubmit()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>