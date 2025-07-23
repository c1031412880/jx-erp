<template>
  <el-dialog
    :title="'新闻审核'"
    append-to-body
    :visible="dialogBool"
    :before-close="dialogClose"
    style="width: 660px">
    <el-form :model="ruleForm" :rules="basicRules" ref="ruleForm" size="mini">
      <el-form-item label="审核评论:" prop="remark">
        <el-input
          v-model="ruleForm.remark" 
          type="textarea"
          maxlength="200"
          :rows="4"
          show-word-limit
          placeholder="请输入审核评论"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini">编 辑</el-button>
      <el-button type="success" size="mini">通 过</el-button>
      <el-button type="danger" size="mini">驳 回</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        remark: '',
        state: ''
      },
      basicRules: {
        // remark: [
        //   { required: true, message: "请输入审核评论", trigger: "change" },
        // ],
      },
    }
  },
  mounted() {

  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>