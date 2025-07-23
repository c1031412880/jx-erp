<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="项目名称:">
         <el-input v-model="form.content" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="form.is_all">是否显示禁用库</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn()" icon="el-icon-plus">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      form: {
        content:'',
        is_all: false
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn() {
      this.$emit("on-add");
    },
    resetForm() {
      this.form.content = ''
      this.form.is_all = false
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
