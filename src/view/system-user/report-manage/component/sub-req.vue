<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-input v-model="form.name" placeholder="请输入线路名称" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" icon="el-icon-refresh-left"
        >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      form: {
        name: "",
        group: [],
        usable: 0
      },
    };
  },
  mounted() {},
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
      this.form.group = [];
      this.form.usable = 0;
      // 清空组织
      // this.$refs.departmentTree.onClear();
      // this.$parent.restTableList();
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
