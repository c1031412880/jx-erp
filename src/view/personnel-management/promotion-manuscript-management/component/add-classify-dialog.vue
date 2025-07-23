<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="500px"
    top="80px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini"
      >
        <el-form-item label="录用平台:" prop="platform">
          <el-input v-model="ruleForm.platform" placeholder="请输入录用平台"></el-input>
        </el-form-item>
        <el-form-item prop="level" label="级别:"> 
          <get-select-dictionaries
            v-model="ruleForm.level"
            :classKey="'宣传级别'"
            :placeholder="'宣传级别选择'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="文字分数:" prop="score">
          <el-input v-model="ruleForm.score" placeholder="请输入分数"></el-input>
        </el-form-item>
        <el-form-item label="摄影分数:" prop="img_score">
          <el-input v-model="ruleForm.img_score" placeholder="请输入分数"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
           <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '90%'}"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries';
export default {
  components: {
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    curType: [String],
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        id: "",
        score: "",
        img_score: "",
        remark:'',
        platform:'',
        level: ''
      },
      rules: {
        platform: [
          { required: true, message: "请输入录用平台", trigger: "change" },
        ],
        level: [
          { required: true, message: "请选择级别", trigger: "change" },
        ],
        score: [
          { required: true, message: "请输入分数", trigger: "change" },
        ],
        img_score: [
          { required: true, message: "请输入分数", trigger: "change" },
        ],
      },
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
      if (this.curType == "add") {
        this.showTitle = "添加";
      } else{
        this.showTitle = "编辑";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.ruleForm};
          this.$emit("save-add-edit-organization",info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-dialog-div /deep/ .el-input {
  width: 320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 320px;
}

</style>


