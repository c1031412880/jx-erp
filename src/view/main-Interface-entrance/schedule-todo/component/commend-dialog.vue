<template>
  <el-dialog
    :visible="dialogBool"
    :title="'添加评论'"
    append-to-body
    :before-close="dialogClose"
    width="460px">
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        :label-position="'right'"
        size="mini">
        <el-form-item label="内容:" prop="content">
          <el-input
          v-model="ruleForm.content" 
          type="textarea"
          maxlength="200"
          :rows="4"
          show-word-limit
          placeholder="请输入内容"></el-input>
      </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加评论",
    },
    curSelectType: [String],
  },
  mounted() {
  },
  data() {
    return {
      ruleForm: {
        id: '',
        type: 2,
        content: '',
      },
      rules: {
        content: [
          { required: true, message: "请输入内容", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (!bool) {
        this.$refs['ruleForm'].resetFields();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let info = {...this.ruleForm};
          this.$emit("save-add", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__body {
  background-color: #ffffff;
}
</style>

