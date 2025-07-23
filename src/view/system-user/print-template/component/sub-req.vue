<template>
  <el-form :inline="true" size="mini">
    <el-form-item >
      <el-input v-model="form.name" placeholder="请输入关键字" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit()">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onAdd()" v-if="$isPowerShow('add')">添加模板</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      form: {
        name: ""
      },
    };
  },
  mounted() {
    this.onSubmit('query')
  },
  methods: {
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onAdd() {
      this.$emit("on-add");
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
