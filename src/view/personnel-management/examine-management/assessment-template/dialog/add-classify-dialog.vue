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
        <el-form-item label="模板名称:" prop="temp_name">
          <el-input v-model="ruleForm.temp_name" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注:">
           <el-input v-model="ruleForm.reamrk" type="textarea" placeholder="请输入备注"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '90%'}"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
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
        temp_name: "",
      },
      rules: {
        temp_name: [
          { required: true, message: "请输入模板名称", trigger: "change" },
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

.el-dialog-div {
  height: 60px;
}

.el-dialog-div /deep/ .el-input {
  width: 320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 320px;
}

</style>


