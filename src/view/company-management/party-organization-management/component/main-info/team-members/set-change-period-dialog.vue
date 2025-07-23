<template>
  <el-dialog
    :visible="dialogBool"
    :title="showCasualtiesTitle"
    width="700px"
    append-to-body
    :before-close="dialogClose"
  >
    <div class="base-info" style="height: 350px; overflow-x: hidden">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="140px"
        class="demo-formData"
        size="mini"
      >
        <div class="show-flex-box-r">
          <el-form-item label="班子届次（届）:" prop="name">
            <el-input
              placeholder="请输入班子届次（届）"
              v-model="formData.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="选举应到人数:" prop="count">
            <el-input
              placeholder="请输入选举应到人数"
              v-model="formData.count"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.count = $event.target.value"
            ></el-input>
          </el-form-item>
        </div>

        <div class="show-flex-box-r">
          <el-form-item label="班子当选日期:" prop="elect_start">
            <el-date-picker
              v-model="formData.elect_start"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="班子届满日期:" prop="elect_end">
            <el-date-picker
              v-model="formData.elect_end"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="班子产生方式:" prop="type">
            <tr-select-dictionaries v-model="formData.type" :classKey="'班子产生方式'" :placeholder="'班子产生方式'" :disabled="curType=='detail'"></tr-select-dictionaries>
          </el-form-item>
          <el-form-item label="是否届次标识:" prop="now">
            <el-radio-group v-model="formData.now" style="width: 180px;">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">否</span> </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="换届材料:" prop="ex_files">
            <div style="width: 460px;">
              <multiple-files-upload :filesList="formData.ex_files" @upload-update-success="uploadUpdateSuccess" :disabled="curType == 'detail'"></multiple-files-upload>
            </div>
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
import multipleFilesUpload from "@/components/multiple-files-upload";
export default {
  components: {
    multipleFilesUpload,
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
        // id: '',
        // organ_id: '', //党组织ID
        name: '',
        count: '',
        type: '',
        elect_start: '',
        elect_end: '',
        now: '',
        ex_files: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入班子届次", trigger: "blur" },
        ],
        elect_start: [
          { required: true, message: "请选择班子当选日期", trigger: "change" },
        ],
        elect_end: [
          { required: true, message: "请选择班子届满日期", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择班子产生方式", trigger: "change" },
        ],
        now: [
          { required: true, message: "请选择是否届次标识", trigger: "change" },
        ],
      },
      isFirstLoad: true
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

    uploadUpdateSuccess(filesList) {
      this.formData.ex_files = filesList;
    },

    setData(val) {
      console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      if(!this.formData.ex_files) {
        this.formData.ex_files = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        // if(this.curType == 'add') {
        //   delete this.formData.id
        // }
          this.$emit("sure-submit-casualties", this.formData);
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

// .base-info /deep/ .el-textarea {
//   width: 605px;
// }
</style>
