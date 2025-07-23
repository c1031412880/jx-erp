<template>
  <el-dialog
    :visible="dialogBool"
    :title="showCasualtiesTitle"
    width="700px"
    append-to-body
    :before-close="dialogClose"
  >
    <div class="base-info" style="height: 290px; overflow-x: hidden">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="140px"
        class="demo-formData"
        size="mini"
      >
        <div class="show-flex-box-r">
          <el-form-item label="任职党组织名称:" prop="organ_name">
            <el-input
              style="width: 500px;"
              placeholder="请输入任职党组织名称"
              v-model="formData.organ_name"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="党内职务名称:" prop="position_name">
            <el-input
              placeholder="请输入党内职务名称"
              v-model="formData.position_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="该职务级别:" prop="leave">
            <el-input
              placeholder="请输入该职务级别"
              v-model="formData.leave"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="党内职务名称:" prop="content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入党内职务名称"
              v-model="formData.content"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="任职日期:" prop="entry_date">
            <el-date-picker
              v-model="formData.entry_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="离职日期:" prop="leave_date">
            <el-date-picker
              v-model="formData.leave_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取 消</el-button>
      <el-button type="primary" @click="submitForm('formData')"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getSelectDictionaries,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
    showCasualtiesTitle: [String],
    curType:{
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      formData: {
        id: '',
        // party_user: '',
        organ_name: '',
        position_name: '',
        leave: '',
        content: '',
        entry_date: '',
        leave_date: '',
      },
      rules: {
        organ_name: [
          { required: true, message: "请选择任职党组织名称", trigger: "blur" },
        ]
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configCircuitfInfo();
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

    // 初始化信息
    configCircuitfInfo() {},
    setData(val) {
      console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        if(this.curType == 'add') {
          delete this.formData.id
        }
          this.$emit("sure-submit-change-period", this.formData);
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
.base-info /deep/ .el-date-editor {
  width: 180px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 180px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.base-info /deep/ .el-textarea {
  width: 500px;
}
</style>
