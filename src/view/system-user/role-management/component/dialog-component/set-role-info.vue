<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="540px"
    
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色组名称:" prop="c_name" label-width="120px" v-if="curType == 'group'">
          <el-input v-model="ruleForm.c_name"></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="c_name" label-width="120px" v-else>
          <el-input v-model="ruleForm.c_name"></el-input>
        </el-form-item>
        <el-form-item label="分组到:" prop="i_group_id" label-width="120px" v-if="curType == 'role'">
          <el-select v-model="ruleForm.i_group_id" clearable placeholder="请选择">
            <el-option
              v-for="item in roleGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="c_remark" label-width="120px">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            v-model="ruleForm.c_remark"
            placeholder="请输入备注"
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
    roleGroupOptions:[Array]
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        i_id: "",
        c_name: "",
        c_remark: "",
        i_group_id:"",
      },
      rules: {
        c_name: [
          { required: true, message: "请填写名称", trigger: "change" },
        ],
        i_group_id: [
          { required: true, message: "请输选择分组", trigger: "change" },
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
      if (this.curType == "group") {
        this.showTitle = "添加角色组";
      }else {
        this.showTitle = "添加角色";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
         console.log(this.ruleForm)
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
          this.$emit("save-add-edit-role",info);
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.el-dialog-div {
  height: 280px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 300px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 300px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}



.el-cascader {
  width: 100% !important;
}
</style>


