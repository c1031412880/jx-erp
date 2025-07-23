<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    width="825px"
    
    :before-close="dialogClose"
    center
    append-to-body
  >
    <div class="circuit-allocation-dialog">
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="ruleForm"
          :rules="rules"
          size="medium"
          label-width="80px"
        >
          <el-col :span="24">
            <div class="show-flex-box-c show-flex-center" style="margin-bottom: 40px;">
              <span style="margin-bottom: 10px;">
                <el-avatar :size="100" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" :fit="'cover'"></el-avatar>
              </span>
              <strong>杨空余</strong>
            </div>
          </el-col>

          <el-col :span="12">
            <el-form-item label="离职日期:" prop="engine_code">
              <el-date-picker
                v-model="ruleForm.last"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职原因:" prop="monitoring_type">
              <el-select v-model="ruleForm.standard" placeholder="请选择离职原因">
                <el-option
                  v-for="item in effluentStandardOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="tire_remark">
              <el-input v-model="ruleForm.tire_remark" type="textarea" placeholder="请输入备注"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" prop="type">
              <el-checkbox label="该离职员工不计入人事统计" v-model="ruleForm.type"></el-checkbox>
              <i class="el-icon-warning-outline"></i>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >保 存</el-button
      >
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
      showTitle: "修改离职信息",
      circleUrl:'../../../../../../../assets/staff-manage-image/1.png',
      effluentStandardOptions:[],
      ruleForm: {
        name: "",
        region: "",
      },
      rules: {
        name: [
          { required: true, message: "请选择日期", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请填入离职原因", trigger: "change" },
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
.circuit-allocation-dialog /deep/ .el-input {
  width: 300px;
}
</style>
