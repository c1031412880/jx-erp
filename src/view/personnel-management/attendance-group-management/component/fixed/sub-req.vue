<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="考勤组名称:">
          <el-input v-model="form.name" placeholder="搜索考勤组名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="addInfo()" type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >新增考勤组</el-button
          >
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
        name:"",
      },
    };
  },
  mounted() {
  },
  methods: {

    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加
    addInfo() {
      this.$emit("on-add", 'fixed');
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
