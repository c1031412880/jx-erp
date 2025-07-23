<template>
  <el-dialog
    width="500px"
    title="生日祝福"
    :visible="dialogBool"
    :before-close="dialogClose">
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini">
        <el-form-item label="系统生日祝福:" prop="name">
          <el-switch
            v-model="ruleForm.value"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="false"
            :inactive-value="true">
          </el-switch>
          <p>员工生日当天向员工发送生日祝福</p>
        </el-form-item>
        <el-form-item label="设置祝福内容:">
          <p>{{ ruleForm.name }}</p>
           <el-input 
            v-model="ruleForm.remark" 
            type="textarea" 
            placeholder="请输入祝福内容"
            :autosize="{minRows: 4, maxRows: 4}"
          ></el-input>
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
  },
  data() {
    return {
      ruleForm: {
        id: "",
        value: false,
        name:'',
        remark:'',
      },
      rules: {
        // type: [
        //   { required: true, message: "请选择类型", trigger: "change" },
        // ],
        // code: [
        //   { required: true, message: "请填写编号", trigger: "change" },
        // ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
      } else {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
</style>


