<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
            <el-button type="primary" @click="addImage" icon="el-icon-plus"
              >添加</el-button
            >
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refeshForm" icon="el-icon-refresh-right"
            >刷新</el-button
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
    };
  },
  mounted() {
    this.refeshForm()
  },
  methods: {
    //新增
    addImage(){
      this.$emit("on-add")
    },
    // 刷新
    refeshForm(){
      this.$emit("on-ok");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
