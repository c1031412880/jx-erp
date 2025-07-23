<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-row>
      <el-form-item label="资产编号：">
        <el-input v-model="form.assets_code" placeholder="请输入资产编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="资产名称：">
        <el-input v-model="form.assets_name" placeholder="请输入资产名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" @click="resetForm()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')">确定</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
export default {
  props:{},
  components: {},
  data() {
    return {
      form: {
        assets_code: '',
        assets_name: '',
      },
    };
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$emit('on-clear')
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 新建导出导入
    onBtn(com) {
      this.$emit("on-add", com);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
