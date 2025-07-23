<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="550px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="所属种类:" prop="type" label-width="140px">
          <el-select v-model="ruleForm.type" placeholder="请选择所属种类" @change="selectedType">
            <el-option label="奖励" :value="1"></el-option>
            <el-option label="惩罚" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖惩种类:" prop="type_child" label-width="140px" v-show="ruleForm.type == 1">
          <tr-select-dictionaries v-model="ruleForm.type_child" :classKey="'奖惩规定奖励'" :placeholder="'请选择'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="奖惩种类:" prop="type_child" label-width="140px" v-show="ruleForm.type == 2">
          <tr-select-dictionaries v-model="ruleForm.type_child" :classKey="'奖惩规定惩罚'" :placeholder="'请选择'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="奖惩条款:" prop="content" label-width="140px">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            v-model="ruleForm.content"
            placeholder="请输入奖惩条款"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联条约:" prop="pact" label-width="140px">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            v-model="ruleForm.pact"
            placeholder="请输入关联条约"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curType: [String],
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        id: "",
        type: 1,
        type_child:"",
        content: "",
        pact: "",
      },
      rules: {
        type: [
          { required: true, message: "请选择所属种类", trigger: "change" },
        ],
        type_child: [
          { required: true, message: "请选择奖惩种类", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入奖惩条款", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm();
      } else {
        this.configTitle();
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      // alert(this.curType)
      if (this.curType == "add") {
        this.showTitle = "奖惩种类添加";
      } else {
        this.showTitle = "奖惩种类编辑";
      }
    },
    selectedType(val) {
      this.ruleForm.type_child = ''
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-add-edit-type", this.ruleForm);
        } else {
          return false;
        }
      });

    },

    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog__wrapper {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// }

.el-dialog-div {
  // height: 380px;
  // overflow-y: scroll;
}

// .el-dialog-div /deep/ .el-input {
//   width: 300px;
// }

// .el-dialog-div /deep/ .el-input__inner {
//   width: 300px;
// }
// .el-dialog-div /deep/ .el-date-editor .el-range-separator {
//   width 10%
// }

.el-dialog-div /deep/ .el-date-editor {
  width: 300px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 300px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 300px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 300px;
}



.el-cascader {
  width: 100% !important;
}
</style>


