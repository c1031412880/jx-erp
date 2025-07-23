<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="入库日期：">
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
    <el-form-item label="入库方式：">
      <el-select v-model="form.type" clearable placeholder="请选择入库方式">
        <el-option
          v-for="item in purOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审核状态：">
      <el-select v-model="form.state" clearable placeholder="请选择">
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
    <el-form-item>
      <el-button type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')" @click="onBtn('add')">添加入库</el-button>
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
      date: [],
      form: {
        ruku_start_date: '',
        ruku_end_date: '',
        type: '',
        state: '',
        code: ''
      },
      purOptions: [
        {value: 1, label: '管理员入库'},
        {value: 2, label: '采购单入库'},
      ],
      putOptions: [
        {value: 0, label: '未审核'},
        {value: 1, label: '已审核'},
        // {value: 2, label: '审批拒绝'},
        // {value: 3, label: '审批撤销'},
      ],
    }
  },
  activated() {
    let code = this.$route.params.code
    // console.log(code);
    if(!!code) {
      this.form.ruku_start_date = ''
      this.form.ruku_end_date = ''
      this.form.code = code
      // this.onSetTime()
      this.onSubmit()
    }
  },
  mounted() {
    let code = this.$route.params.code
    // console.log(code);
    if(!!code) {
      this.form.ruku_start_date = ''
      this.form.ruku_end_date = ''
      this.form.code = code
      // this.onSetTime()
      this.onSubmit()
    }else {
      this.onSetTime()
      this.onSubmit()
    }
  },
  methods: {
    // 初始化时间
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.ruku_start_date = this.date[0]
      this.form.ruku_end_date = this.date[1]
      // this.onSubmit()
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.ruku_start_date = this.date[0];
        this.form.ruku_end_date = this.date[1];
      }else{
        this.form.ruku_start_date = '';
        this.form.ruku_end_date = '';
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
      this.$emit('on-' + type, type)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>