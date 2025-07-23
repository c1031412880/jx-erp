<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
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

        <el-form-item label="故障项目名称:" prop="c_name" label-width="140px" >
          <el-input v-model="ruleForm.c_name" placeholder="请输入维修项目名称"></el-input>
        </el-form-item>
        <el-form-item label="所属类别:" prop="i_group_id" label-width="140px" >
          <el-select v-model="ruleForm.i_group_id" placeholder="请选择所属类别">
            <el-option
              v-for="item in classifyOptions"
              :key="item.i_id"
              :label="item.c_name"
              :value="item.i_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码:" prop="c_code" label-width="140px" >
          <el-input v-model="ruleForm.c_code" placeholder="请输入维修项目编码"></el-input>
        </el-form-item>
        <el-form-item label="备注:" label-width="140px" prop="c_remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="ruleForm.c_remark">
          </el-input>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    classifyOptions:[Array],//所属类别
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        i_id: "",
        c_name: "",
        i_group_id: "",
        c_code: "",
        i_hours: "",
        n_price: "",
        c_remark: "",
      },
      rules: {
        c_name: [
          { required: true, message: "请填写维修项目名称", trigger: "change" },
        ],
        i_group_id: [
          { required: true, message: "请输选择所属类别", trigger: "change" },
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
      if (this.curSelecedType == "add") {
        this.showTitle = "故障项目详情";
      } else{
        this.showTitle = "编辑故障项目";
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
          this.$emit("save-add-edit",info);
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
.el-dialog-div {
  height: 300px;
}

.el-dialog-div /deep/ .el-input {
  width:320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width:320px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}
.el-cascader {
  width: 100% !important;
}
</style>


