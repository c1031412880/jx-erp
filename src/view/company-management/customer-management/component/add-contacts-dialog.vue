<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="500px"
    append-to-body
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-form"
        :label-position="'right'"
        size="mini"
      >
        <el-form-item label="联系人姓名:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入联系人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入联系人电话"
            oninput="value=value.replace(/[^\d.-]/g,'')"
             @blur="form.phone = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门:" prop="department">
          <el-input
            v-model="form.department"
            placeholder="请输入联系人部门"
          ></el-input>
        </el-form-item>

        <el-form-item label="职务:" prop="job">
          <el-input
            v-model="form.job"
            placeholder="请输入联系人职务"
          ></el-input>
        </el-form-item>
        <el-form-item label="QQ/微信:" prop="social">
          <el-input
            v-model="form.social"
            placeholder="请输入联系人QQ/微信"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    curType: [String],
  },
  data() {
    return {
      showTitle: '',
      form: {
        id: '',
        name:'',
        phone:'',
        sex: '',
        department: '',
        job: '',
        social:'',
        type: 2,
      },
      rules: {
        name: [{ required: true, message: "请填写联系人名称", trigger: "change" }],
        phone: [
          { required: true, message: "请填写联系人电话", trigger: "change" },
        ],
        // sex: [{ required: true, message: "请选择联系人性别", trigger: "change" }],
        // department: [
        //   { required: true, message: "请填写联系人部门", trigger: "change" },
        // ],
        // job: [{ required: true, message: "请填写联系人职务", trigger: "change" }],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          this.$refs.form.clearValidate();
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
        this.showTitle = "添加联系人";
      } else {
        this.showTitle = "编辑联系人";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form)
          let info = { ...this.form };
          this.$emit("save-add-edit-contacts", info);
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
  height: 250px;
}

.el-dialog-div /deep/ .el-input {
  width: 320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 320px;
}

.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width: 10%;
}

.el-cascader {
  width: 100% !important;
}
</style>


