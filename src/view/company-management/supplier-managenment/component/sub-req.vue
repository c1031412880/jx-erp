<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="供应商编号、名称、简介：">
      <el-input placeholder="请输入" clearable v-model="form.content"></el-input>
    </el-form-item>
    <el-form-item label="供应商类型：">
      <get-select-dictionaries  
        style="width: 100%;" 
        v-model="form.type" 
        :classKey="'供应商类型'" 
        :placeholder="'请选择供应商类型'"
      ></get-select-dictionaries>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-download" @click="onBtn('export')">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-plus" @click="onBtn('add')">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { getSelectDictionaries },
  data() {
    return {
      form: {
        type: '',
        content: ''
      },
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
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