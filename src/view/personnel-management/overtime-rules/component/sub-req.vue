<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>

        <el-form-item>
          <el-button @click="addButton()" icon="el-icon-plus" type="primary" v-if="$isPowerShow('add')"
            >新增加班规则</el-button
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
        c_name:"",
      },
    };
  },
  mounted() {
  },
  methods: {

    // 添加编辑
    addButton() {
      this.$emit("on-add", 'add');
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
