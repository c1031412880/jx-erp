<template>
  <el-dialog :visible="dialogBool" :title="showTitle" width="450px"  :before-close="dialogClose">
    <div class="circuit-allocation-dialog">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="驾驶员姓名:" prop="c_name">
          <el-input v-model="ruleForm.c_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门:" prop="department">
          <el-input v-model="ruleForm.department_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路:" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择线路">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆:" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择车辆">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "添加线路、车辆",
      ruleForm: {
        c_name: "",
        department: "",
      },
      rules: {
        c_name: [
          { required: true, message: "请填写驾驶员姓名", trigger: "blur" }
        ],
        department: [
          { required: true, message: "选择部门", trigger: "change" },
        ]
      },
      department_name:""
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configCircuitfInfo();
      }
    },
    title(newVal) {
      this.title = newVal;
    },
  },
  methods: {
     dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 初始化信息
    configCircuitfInfo() {},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .circuit-allocation-dialog /deep/ .el-input{
    width: 300px;
  }
</style>
