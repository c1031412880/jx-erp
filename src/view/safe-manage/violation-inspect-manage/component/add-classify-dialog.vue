<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="500px"
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
        <el-form-item label="类别名称:" prop="c_name" label-width="140px" >
          <el-input v-model="ruleForm.c_name" placeholder="请输入类别名称"></el-input>
        </el-form-item>
        <el-form-item label="类别场景:" prop="i_type" label-width="140px" >
          <el-select v-model="ruleForm.i_type" placeholder="请选择类别场景" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
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
export default {
  components: {},
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
        c_name: "",
        i_type: null,
        i_order: 0,
      },
      options: [
        {value: 1, label: '违规违纪'},
        {value: 2, label: '事故管理'},
        {value: 3, label: '服务工单',disabled: true},
      ],
      rules: {
        c_name: [
          { required: true, message: "请填写类别名称", trigger: "change" },
        ],
        i_type: [
          { required: true, message: "请选择类别场景", trigger: "change" },
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
        this.showTitle = "稽查项目类别";
      } else{
        this.showTitle = "编辑稽查项目类别";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
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
.el-dialog__wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}

// .el-dialog-div {
//   height: 80px;
// }

.el-dialog-div /deep/ .el-input {
  width: 200px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 200px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}



.el-cascader {
  width: 100% !important;
}
</style>


