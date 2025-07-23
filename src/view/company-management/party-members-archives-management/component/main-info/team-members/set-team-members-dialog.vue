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
          <el-form-item label="两代表一委员类别:" prop="name">
            <el-input
              placeholder="请输入两代表一委员类别"
              v-model="formData.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="届次:" prop="period">
            <el-input
              placeholder="请输入届次"
              v-model="formData.period"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="该届起始时间:" prop="start_date">
            <el-date-picker
              v-model="formData.start_date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="该届届满时间:" prop="end_date">
            <el-date-picker
              v-model="formData.end_date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="是否在职:" prop="job">
            <el-radio-group v-model="formData.job" style="width: 180px;">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">否</span> </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="代表资格终止原因:" prop="reason">
            <el-input
              placeholder="请输入代表资格终止原因"
              v-model="formData.reason"
            ></el-input>
          </el-form-item>
          <el-form-item label="代表资格终止时间:" prop="out_time">
            <el-date-picker
              v-model="formData.out_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
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
        name: '',
        period: '',
        start_date: '',
        end_date: '',
        job: '',
        reason: '',
        out_time: ''
      },
      rules: {
        name: [
          { required: true, message: "请输入两代表一委员类别", trigger: "blur" },
        ],
        period: [
          { required: true, message: "请输入届次", trigger: "change" },
        ],
        start_date: [
          { required: true, message: "请选择该该届起始时间", trigger: "change" },
        ],
        end_date: [
          { required: true, message: "请选择该届届满时间", trigger: "change" },
        ],
        job: [
          { required: true, message: "请选择是否在职", trigger: "change" },
        ],
      },
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
    // 编辑设置新增两代表一委员
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
          this.$emit("sure-submit-team-members", this.formData);
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
