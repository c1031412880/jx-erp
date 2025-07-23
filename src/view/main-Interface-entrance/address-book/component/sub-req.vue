<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="搜索人员">
      <el-input v-model="form.name" placeholder="请输入人员名字"></el-input>
    </el-form-item>
    <el-form-item label="搜索公司" v-show="!type">
      <el-input v-model="form.company" placeholder="请输入公司名字"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit" type="primary" icon="el-icon-search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button v-if="$isPowerShow('export')" @click="onBtn('export')" type="" icon="el-icon-download">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button v-if="$isPowerShow('new')" @click="onBtn('add')" :disabled="type" type="primary" icon="el-icon-plus">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        company: '',
      },
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      let info = {...this.form}
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.form.name = ''
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>