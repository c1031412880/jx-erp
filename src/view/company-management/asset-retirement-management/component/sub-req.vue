<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="报废物品">
      <el-input  v-model="form.asset_name" :placeholder="'请输入报废物品'" clearable></el-input>
    </el-form-item>
    <el-form-item label="报废日期">
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
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" v-if="$isPowerShow('search')" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" v-if="$isPowerShow('search')" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-s-tools" v-if="$isPowerShow('add')" @click="onBtn('add')">资产报废</el-button>
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
        asset_name: '',
        start: '',
        end: '',
      },
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
      this.form.start = this.date[0]
      this.form.end = this.date[1]
      // this.onSubmit()
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
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