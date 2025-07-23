<template>
  <el-dialog :visible="dialogBool" :title="showAuditTitle" width="550px"  :before-close="dialogClose">
    <div class="scrap-dialog">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-formData"
      > 
        <!-- <el-form-item label="审核日期:" prop="d_scrap">
          <el-date-picker
            v-model="formData.d_scrap"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="审核备注:" prop="audit_remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入审核备注"
            v-model="formData.audit_remark"
          ></el-input>
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
    showAuditTitle:[String]
  },
  data() {
    return {
      formData: {
        audit_remark: "",
      },
      rules: {},
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        })
      }
    },
  },
  methods: {
     dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$emit("sure-submit-audit", this.formData)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
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
