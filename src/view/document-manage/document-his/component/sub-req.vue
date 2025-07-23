<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="文件类型：">
      <get-select-dictionaries v-model="form.type" :classKey="'上传文件类型'" :placeholder="'请选择上传文件类型'"></get-select-dictionaries>
    </el-form-item>
    <el-form-item label="文件名称：">
      <el-input v-model="form.name" placeholder="请输入文件名称"></el-input>
    </el-form-item>
    <el-form-item label="上传时间:">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="selectedTime"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit('query')">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="formReset">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit('add')" v-if="$isPowerShow('add')">上传文件</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  data() {
    return {
      date: '',
      form: {
        type: "",
        name: "",
      },
    };
  },
  components: { getSelectDictionaries },
  mounted() {
    this.onSetTime()
    this.onSubmit('query')
  },
  methods: {
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
    formReset() {
      Object.assign(this.$data, this.$options.data())
      this.onSubmit('query')
    },
    onSubmit(type) {
      if(type == 'query') {
        let info = {};
        for (let i in this.form) {
          if (this.form[i]) {
            info[i] = this.form[i];
          }
        }
        this.$emit("on-ok", info);
      } else{
        this.$emit(`on-${type}`);
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
