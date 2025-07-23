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
        <el-form-item label="类型:" prop="type">
          <el-radio-group  v-model="ruleForm.type">
            <el-radio :label="1" disabled><span style="color:#606266">地址</span></el-radio>
            <el-radio :label="2" disabled><span style="color:#606266">水表</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属单元:" prop="parents_id" v-if="ruleForm.type == 2">
          <el-select v-model="ruleForm.parents_id" placeholder="请选择所属单元">
            <el-option
              v-for="item in classifyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="ruleForm.type === 2? '水表名称':'地址名称'" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
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
      grandfather_id: '',  //爷爷节点类型
      ruleForm: {
        id: "",
        type: 1,
        parents_id: "",
        name: "",
      },
      rules: {
        type: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        parents_id: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        name: [
          { required: true, message: "请填写名称", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          this.$refs.ruleForm.clearValidate();
        })
        this.configTitle();
      }
    },
    // grandfather_id() {
    //   if(this.grandfather_id) {
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
        this.showTitle = "添加地址或水表";
      } else{
        this.showTitle = "编辑地址或水表";
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



.el-cascader {
  width: 100% !important;
}
</style>


