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
        <el-form-item label="所属分类:" prop="parents" v-if="type == 2">
          <el-select v-model="ruleForm.parents" placeholder="请选择所属分类">
            <el-option
              v-for="item in classifyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组名称:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="编号:" prop="code">
          <el-input v-model="ruleForm.code" placeholder="请输入编号"></el-input>
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
    classifyOptions:[Array],//所属类别
  },
  data() {
    return {
      showTitle: "",
      parents_type:'', // 父级类型
      grandfathers: '',  //爷爷节点类型
      type: 1,
      ruleForm: {
        id: "",
        parents: "",
        name: "",
        remark:'',
        code:'',
        type: 1
      },
      rules: {
        type: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        parents: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        name: [
          { required: true, message: "请填写名称", trigger: "change" },
        ],
        code: [
          { required: true, message: "请填写编号", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.ruleForm.resetFields();
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
      } else {
        this.configTitle();
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          this.$refs.ruleForm.clearValidate();
        });
      }
    },
    // grandfathers() {
    //   if(this.grandfathers) {
    //     this.ruleForm.type = 2
    //   }
    // }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType == "add") {
        this.showTitle = "添加资产分组";
      } else{
        this.showTitle = "编辑资产分组";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
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
.el-dialog__wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}

.el-dialog-div {
  height: 220px;
}

.el-dialog-div /deep/ .el-input {
  width: 320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 320px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}

/deep/ .el-dialog .el-dialog__header {
  background-color: #F5F5F5;
  padding: 12px 20px;

  .el-dialog__title {
    font-size: 16px;
  }
}

.el-cascader {
  width: 100% !important;
}
</style>


