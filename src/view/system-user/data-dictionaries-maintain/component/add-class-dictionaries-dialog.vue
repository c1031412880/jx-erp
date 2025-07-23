<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="400px"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="90px"
      size="mini"
    >
      <el-form-item label="字典:">
        <el-input v-model="ruleForm.c_name" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="是否默认:">
        <el-radio-group v-model="ruleForm.i_is_default">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="ruleForm.c_remark" placeholder="请输入分类名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    superiorDeptName:{
      type: String,
      default: '无'
    },
    curType: [String],
    competentUserOptions:[Array],
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        i_id: "",
        i_main_id: '',
        c_name: "",
        i_is_default: 0,
        c_remark: '',
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType === "add") {
        this.showTitle = "添加字典选项";
      } else{
        this.showTitle = "编辑字典选项";
      }
    },
    updatePlaybill() {
      if (!this.ruleForm.c_name) {

      }

      this.$emit('on-ok', this.ruleForm)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


