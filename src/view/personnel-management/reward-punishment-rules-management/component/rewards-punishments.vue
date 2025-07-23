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
          <el-select v-model="ruleForm.type" placeholder="请选择所属种类" @change="selectedType" :disabled="curType == 'edit'">
            <el-option label="奖励" :value="1"></el-option>
            <el-option label="惩罚" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖惩情形:" prop="title" label-width="140px">
          <el-input
            placeholder="请输入奖惩情形"
            v-model="ruleForm.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联奖惩种类:" prop="kind_ids" label-width="140px">
          <el-select v-model="ruleForm.kind_ids" multiple collapse-tags clearable placeholder="请选择">
            <el-option
              v-for="item in rewardsPunishmentsOptions"
              :key="item.id"
              :label="item.type_child_name"
              :value="item.id">
            </el-option>
          </el-select>
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
      rewardsPunishmentsOptions:[

      ],
      ruleForm: {
        id: "",
        type: 1,
        title: "",
        pact: "",
        kind_ids:[]
      },
      rules: {
        type: [
          { required: true, message: "请选择所属种类", trigger: "change" },
        ],
        title: [
          { required: true, message: "请输入奖惩情形", trigger: "change" },
        ],
        kind_ids: [
          { required: true, message: "请选择奖惩条款", trigger: "change" },
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
      if (this.curType == "add") {
        this.showTitle = "奖惩情形添加";
        this.selectedType(this.ruleForm.type)
      } else {
        this.showTitle = "奖惩情形编辑";
      }
    },
    selectedType(val) {
      this.ruleForm.kind_ids = []
      let params = {
        type : val
      }
      this.$client.GetKindByTypeReward(params)
        .then(res => {
          if (res.head.result == "200") {
            this.rewardsPunishmentsOptions = res.context
          } else {
            this.rewardsPunishmentsOptions = []
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
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


