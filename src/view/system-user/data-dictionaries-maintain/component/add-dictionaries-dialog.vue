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
      <el-form-item :label="`${dialogType === 1 ? '分类名称' : '字典名称'}:`">
        <el-input v-model="ruleForm.c_name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="所属组:">
        <class-select-tree v-if="dialogBool" v-model="ruleForm.i_p_id"></class-select-tree>
      </el-form-item>
      <el-form-item label="字典key:" v-if="dialogType === 2">
        <el-input v-model="ruleForm.c_key" placeholder="请输入字典key"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import classSelectTree from './class-select-tree'
export default {
  components: {classSelectTree},
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
    dialogType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        i_id: "",
        c_name: "",
        i_p_id: '',
        c_key: '',
        i_type: 2 //1分类 2字典
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
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType === "add") {
        this.showTitle = `添加${this.dialogType === 1 ? '分类' : '字典'}组织`;
      } else{
        this.showTitle = `编辑${this.dialogType === 1 ? '分类' : '字典'}组织`;
      }
    },
    updatePlaybill() {
      if (!this.ruleForm.c_name) {
        this.$message({showClose: true, message: '请填写名称', type: "error",});
        return false
      }
      if (this.ruleForm.i_p_id === '') {
        this.$message({showClose: true, message: '请选择组织', type: "error",});
        return false
      }
      this.ruleForm.i_type = this.dialogType
      this.$emit('on-ok', this.ruleForm)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


