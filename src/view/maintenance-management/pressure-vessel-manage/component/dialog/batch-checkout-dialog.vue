<template>
  <el-dialog :visible="dialogBool" :title="showTitle" width="550px"  :before-close="dialogClose">
    <div class="scrap-dialog">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-formData"
      > 
        <el-form-item label="检验日期:" prop="d_birthday">
          <el-date-picker
            v-model="formData.d_birthday"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检验机构:" prop="c_name">
          <el-input
            placeholder="请输入检验机构"
            v-model="formData.c_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="c_da_remark">
            <span slot="label" style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">说明:</span>
            <span style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">检验记录将保存进档案中，请务必按实际情况真实填写。</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取 消</el-button>
      <el-button type="primary" @click="submitForm('formData')">提 交</el-button>
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
      showTitle: "批量检验（当前选中个数：36）",
      formData: {
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
          // alert("submit!");
          this.$confirm('确认提交批量检验, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            let info ={};
            for (let i in this.formData) {
              if (this.formData[i]) {
                info[i] = this.formData[i];
              }
            }
            this.$emit("sure-submit-batch-check", info)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消批量检验'
            });
          });
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

  .scrap-dialog /deep/ .el-input{
    width: 400px;
  }

  .scrap-dialog /deep/ .el-input--mini{
    width: 400px;
  }

  .scrap-dialog /deep/ .el-date-editor {
    width: 410px;
  }
</style>
