<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="申请人">
      <user-role-tree :is_contain_emp="true" v-model="form.user_id" :placeholder="'请选择申请人'"></user-role-tree>
    </el-form-item>
    <el-form-item label="采购类型">
      <el-select v-model="form.type" clearable placeholder="请选择采购类型">
        <el-option
          v-for="item in purOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申请时间">
      <el-date-picker
        v-model="date"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="审批单状态">
      <el-select v-model="form.state" clearable placeholder="请选择状态">
        <el-option
          v-for="item in appOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否生成入库单">
      <el-select v-model="form.is_ruku" clearable placeholder="请选择">
        <el-option
          v-for="item in putOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" v-if="$isPowerShow('search')" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" v-if="$isPowerShow('reset')" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-s-tools" v-if="$isPowerShow('export')" @click="onBtn('export')">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import UserRoleTree from "@/components/base/formModel/tree/user-role-tree";
export default {
  components: { UserRoleTree },
  data() {
    return {
      date:[], //日期
      form: {
        user_id: '',
        type: '',
        start_date: '',
        end_date: '',
        state: '',
        is_ruku: '',
      },
      putOptions: [
        {value: 1, label: '是'},
        {value: 0, label: '否'},
      ],
      purOptions: [
        {value: 2, label: '固定资产'},
        {value: 1, label: '物品'},
      ],
      appOptions: [
        {value: 1, label: '审批中'},
        {value: 2, label: '审批通过'},
        {value: 3, label: '审批拒绝'},
        {value: 4, label: '审批撤销'},
      ],
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
      // this.onSubmit()
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] || this.form[i] == '0') {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
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