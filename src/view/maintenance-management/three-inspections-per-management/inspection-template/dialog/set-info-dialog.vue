<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="720px"
    
  >
    <div class="base-info">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="'right'"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="检查项目名称:" prop="check_name">
              <el-input 
              v-model="ruleForm.check_name" 
              clearable 
              maxlength="15" 
              show-word-limit 
              style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目内容:" prop="check_content">
              <el-input 
              v-model="ruleForm.check_content" 
              clearable 
              maxlength="40"
              show-word-limit
              style="width:100%"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="技术要求:" prop="technical_require">
              <el-input 
              v-model="ruleForm.technical_require" 
              clearable maxlength="15" 
              show-word-limit 
              style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="风险等级:" prop="risk_level">
              <el-select v-model="ruleForm.risk_level" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
              <el-form-item label-width="0">
                <el-form-item label="启用状态:" >
                  <el-switch
                    v-model="ruleForm.state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    >
                  </el-switch>
                </el-form-item>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
  },
  data() {
    return {
      ruleForm: {
        check_name:'',
        check_content: '',
        technical_require: '',
        risk_level:3,
        state: 1
      },
      options: [{
          value: 1,
          label: '高'
        }, {
          value: 2,
          label: '中'
        }, {
          value: 3,
          label: '低'
       
        }],
      rules: {
        check_name: [
          { required: true, message: "请输入检查项目名称", trigger: "change" },
        ],
        check_content: [
          { required: true, message: "请输入项目内容", trigger: "change" },
        ],
        risk_level: [
          { required: true, message: "请选择风险等级", trigger: "change" },
        ],
      },
      showTitle: '添加检查内容',

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
  mounted() {
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加检查内容";
      } else {
        this.showTitle = "编辑检查内容";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.ruleForm))
          this.$emit("save-add-edit", info);
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


