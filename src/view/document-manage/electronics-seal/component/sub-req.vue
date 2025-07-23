<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">刷新</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('add')">
          <el-button type="primary" @click="onBtn('add')">添加</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('set')">
          <el-button type="primary" @click="onBtn('set')">编辑</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('del')">
          <el-button type="danger" @click="onBtn('del')">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      this.$emit("on-ok", {});
    },
    //
    onBtn(type = 'add') {
      this.$emit(`on-${type}`)
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
