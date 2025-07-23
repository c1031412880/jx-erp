<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    :close-on-click-modal="false"
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
        <el-form-item label="项目名称:" prop="c_name" label-width="140px">
          <el-input v-model="ruleForm.c_name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="所属类别:" prop="i_main_id" label-width="140px">
          <el-select v-model="ruleForm.i_main_id" placeholder="请选择所属类别">
            <el-option
              v-for="item in classifyOptions"
              :key="item.i_id"
              :label="item.c_name"
              :value="item.i_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖罚标识:" prop="model" label-width="140px">
          <get-select-dictionaries
              v-model="ruleForm.model"
              :classKey="'奖罚标识'"
              :placeholder="'请选择奖罚标识'"         
            ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="违规类型:" prop="type" label-width="140px">
          <get-select-dictionaries
              v-model="ruleForm.type"
              :classKey="'违规类型'"
              :placeholder="'请选择违规类型'"         
            ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="安全等级:" prop="i_leavel" label-width="140px">
          <el-input v-model="ruleForm.i_leavel" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.i_leavel = $event.target.value" placeholder="输入分值，负数代表扣分值，正数代表加分值"></el-input>
        </el-form-item>
        <el-form-item label="奖罚金额(元):" prop="c_fee" label-width="140px">
          <el-input v-model="ruleForm.c_fee" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.c_fee = $event.target.value" placeholder="输入奖罚金额"></el-input>
        </el-form-item>
        <el-form-item label="加减分数:" prop="n_score" label-width="140px">
          <el-input v-model="ruleForm.n_score" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.n_score = $event.target.value" placeholder="输入分数，负数代表扣分，正数代表加分"></el-input>
        </el-form-item>

        <el-form-item label="考核资格:" prop="cancel_star" label-width="140px">
          <el-checkbox v-model="ruleForm.cancel_star">取消本季度星级考核</el-checkbox>
        </el-form-item>

        <el-form-item label="备注:" label-width="140px" prop="c_remark">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="ruleForm.c_remark"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="i_enable	" label-width="140px">
          <el-switch v-model="ruleForm.i_enable	"></el-switch>
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
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries';
export default {
  components: {
    getSelectDictionaries,
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    classifyOptions: [Array] //所属类别
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        i_main_id:"",
        i_id: "",
        c_name: "",
        model: "",
        type: '',
        i_leavel: "",
        c_fee: "",
        n_score: "",
        cancel_star: false,
        c_remark: "",
        i_enable: true,
      },
      rules: {
        c_name: [
          { required: true, message: "请输入项目名称", trigger: "change" }
        ],
        i_main_id: [
          { required: true, message: "请选择所属类别", trigger: "change" }
        ],
        model: [
          { required: true, message: "请选择奖罚标识", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "稽查项目";
      } else {
        this.showTitle = "编辑稽查项目";
      }
    },

    updatePlaybill(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.ruleForm)
          this.ruleForm.i_enable = this.ruleForm.i_enable? '1' : '0';
          this.ruleForm.cancel_star = this.ruleForm.cancel_star ? 1 : 0;
          this.$emit("save-add-edit", this.ruleForm);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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


