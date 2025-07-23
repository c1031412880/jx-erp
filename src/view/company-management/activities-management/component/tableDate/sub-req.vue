<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="开始日期范围">
      <el-date-picker
        v-model="date"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="活动标题">
      <el-input placeholder="请输入活动标题" v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="活动审批状态" v-if="currentType != 'first'">
      <el-select v-model="form.state" placeholder="请选择活动审批状态">
        <el-option
          v-for="item in purOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动发布状态" v-if="currentType != 'first'">
      <el-select v-model="form.is_public" placeholder="请选择状态">
        <el-option
          v-for="item in appOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动状态">
      <el-select v-model="form.sct_state" placeholder="请选择状态">
        <el-option
          v-for="item in actOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动参与人" v-if="currentType == 'third'">
      <el-input placeholder="请输入活动参与人" v-model="form.user_name"></el-input>
    </el-form-item>
    <el-form-item label="活动负责人" v-if="currentType == 'third'">
      <el-input placeholder="请输入活动负责人" v-model="form.duty_name"></el-input>
    </el-form-item>
    <el-form-item label="组织部门" v-if="currentType != 'second'">
      <get-department-select
        ref="orgTree"
        v-model="form.dept_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :isExportMultiple="true"
        :isCheckStrictly="false"
      ></get-department-select>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-plus" v-if="currentType == 'second'" @click="onBtn('add')">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import { getUser } from '@/utils/auth';
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  props: {
    currentType: {
      type: String,
      default: 'second'
    }
  },
  data() {
    return {
      date: [],
      form: {
        start_time: '',
        end_time: '',
        title: '',
        state: '',
        is_public: '',
        sct_state: '',
        user_name: '',
        dept_ids: [],
        created_id: ''
      },
      purOptions: [
        {value: 1, label: '审批中'},
        {value: 2, label: '审批通过'},
        {value: 3, label: '审批拒绝'},
        {value: 4, label: '已撤销'},
      ],
      appOptions: [
        {value: 0, label: '全部'},
        {value: 1, label: '未发布'},
        {value: 2, label: '已发布'},
      ],
      actOptions: [
        {value: 1, label: '未开始'},
        {value: 2, label: '进行中'},
        {value: 3, label: '已结束'},
      ],
    }
  },
  watch: {
    currentType(type) {
      let userInfo = JSON.parse(getUser());
      // console.log(userInfo)
      this.form.user_name = type === 'first' ? userInfo.user_name : ''
      this.form.created_id = type == 'second' ? userInfo.user_id : ''
    }
  },
  mounted() {
    this.onSetTime()
    let userInfo = JSON.parse(getUser());
    this.form.user_name = this.currentType === 'first' ? userInfo.user_name : ''
    this.form.created_id = this.currentType == 'second' ? userInfo.user_id : ''
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_time = this.date[0]
      this.form.start_time = this.date[1]
      // this.onSubmit()
    },
    onSubmit() {
      if(this.date && this.date.length) {
        this.date = this.$addTime(this.date)
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(type) {
      this.$emit('on-' + type)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>