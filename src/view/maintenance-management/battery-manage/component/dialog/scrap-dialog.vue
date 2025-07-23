<template>
  <el-dialog :visible="dialogBool" :title="showScrapTitle" width="550px"  :before-close="dialogClose">
    <div class="scrap-dialog">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-formData"
      > 
        <el-form-item label="报废日期:" prop="d_scrap">
          <el-date-picker
            v-model="formData.d_scrap"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报废原因:" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入报废原因"
            v-model="formData.reason"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="c_da_remark">
            <span slot="label" style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">说明:</span>
            <span style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">只有闲置状态下的电瓶才允许报废。报废操作不可逆，请谨慎提交。</span>
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
    showScrapTitle:[String]
  },
  data() {
    return {
      formData: {
        d_scrap: "",
        reason: "",
      },
      rules: {
        d_scrap: [
          { required: true, message: "请选择报废时间", trigger: "blur" }
        ],
      },
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
          this.$confirm('确认提交报废, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            // let info = this.$outFormData(this.formData)
            this.$emit("sure-submit-scrap", this.formData)
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
