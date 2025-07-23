<template>
  <el-dialog
    :visible="dialogBool"
    :title="showMemberFamilyTitle"
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
          <el-form-item label="成员姓名:" prop="name">
            <el-input
              placeholder="请输入成员姓名"
              v-model="formData.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="与党员关系:" prop="relation">
            <el-input
              placeholder="请输入与党员关系"
              v-model="formData.relation"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="性别:" prop="sex">
            <el-radio-group v-model="formData.sex" style="width: 180px;">
              <el-radio :label="1"><span style="color:#606266">男</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">女</span> </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idcode">
            <el-input
              placeholder="请输入身份证号"
              v-model="formData.idcode"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="成员民族:" prop="nation">
            <tr-select-dictionaries v-model="formData.nation" :classKey="'56个民族'" :placeholder="'请选择民族'"></tr-select-dictionaries>
          </el-form-item>
          <el-form-item label="政治面貌:" prop="politics_status">
            <el-input
              placeholder="请输入政治面貌"
              v-model="formData.politics_status"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="联系电话:" prop="phone">
            <el-input
              placeholder="请输入联系电话"
              v-model="formData.phone"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.phone = $event.target.value"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位及职务:" prop="position">
            <el-input
              placeholder="请输入单位及职务"
              v-model="formData.position"
            ></el-input>
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
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    showMemberFamilyTitle: [String],
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
        relation: '',
        sex: '',
        idcode: '',
        nation: '',
        politics_status: '',
        phone: '',
        position: ''
      },
      rules: {
        name: [
          { required: true, message: "请填写成员姓名", trigger: "blur" },
        ],
        relation: [
          { required: true, message: "请填写与党员关系", trigger: "change" },
        ],
        sex: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        idcode: [
          { required: true, message: "请输入身份证号", trigger: "change" },
        ],
        nation: [
          { required: true, message: "请选择成员民族", trigger: "change" },
        ],
        politics_status: [
          { required: true, message: "请输入政治面貌", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "change" },
        ],
        position: [
          { required: true, message: "请输入单位及职务", trigger: "change" },
        ]
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
          this.$emit("sure-submit-save", this.formData);
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
