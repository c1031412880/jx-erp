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
          <el-form-item label="姓名:" prop="party_user_id">
            <!-- <el-input
              placeholder="请输入姓名"
              v-model="formData.party_user_id"
            ></el-input> -->
            <el-select v-model="formData.party_user_id" placeholder="请选择党内职务" :loading="teamPersonalLoading" @change="selectedTeamPersonal">
              <el-option
                v-for="item in teamPersonList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="身份证号:" prop="ex_idcode">
            <el-input
              placeholder="请输入身份证号"
              v-model="formData.ex_idcode"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="性别:" prop="c_describe">
            <el-radio-group v-model="formData.ex_sex" style="width: 180px;" disabled>
              <el-radio :label="'男'"><span style="color:#606266">男</span></el-radio>
              <el-radio :label="'女'"><span style="color:#606266">女</span> </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="学历:" prop="ex_top_education ">
            <el-input
              placeholder="请输入学历"
              v-model="formData.ex_top_education"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="出生日期:" prop="ex_birthday">
            <el-date-picker
              v-model="formData.ex_birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              disabled
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="班子届次:" prop="ex_class_name">
            <el-input
              placeholder="请输入班子届次"
              v-model="formData.ex_class_name"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="党内职务:" prop="post_id">
            <el-select v-model="formData.post_id" placeholder="请选择党内职务">
              <el-option
                v-for="item in partyPositionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
             </el-select>
            <!-- <tr-select-dictionaries v-model="formData.i_accident_nature" :classKey="'党内职务'" :placeholder="'党内职务'" :disabled="curType=='detail'"></tr-select-dictionaries> -->

          </el-form-item>
          <el-form-item label="职务名称:" prop="post">
            <el-input
              placeholder="请输入职务名称"
              v-model="formData.post"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="任职党组织名称:" prop="organ_id">
            <get-party-org-select-tree
              ref="getPartyOrgSelectTree"
              :placeholder="'选择上级党组织'"
              :isShowCheckbox="false"
              v-model="formData.organ_id"
              :isExportMultiple="false"
              :width="'380'"
              :disabled="true"
            >
            </get-party-org-select-tree>
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
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
export default {
  components: {
    getSelectDictionaries,
    getDriverSelectTree,
    getPartyOrgSelectTree
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
      partyPositionOptions:[
        {
          value: 1,
          label: '党支部书记'
        }, {
          value: 2,
          label: '党支部副书记'
        }, {
          value: 3,
          label: '党支部委员'
        },
      ],
      teamPersonList:[],
      formData: {
        id: '',
        organ_id: '',
        class_id: '',
        party_user_id: '',
        post_id: '',
        post: '',
        entry_date: '',
        leave_date: '',

        ex_name: '',
        ex_idcode: '',
        ex_sex: '',
        ex_top_education: '',
        ex_birthday: '',
        ex_class_name:'', //班子界次
      },
      rules: {
        ex_name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        ex_sex: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        ex_top_education: [
          { required: true, message: "请输入学历", trigger: "change" },
        ],
        ex_birthday: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        ex_class_name: [
          { required: true, message: "请输入班子届次", trigger: "change" },
        ],
        post_id: [
          { required: true, message: "请选择党内职务", trigger: "change" },
        ],
        post: [
          { required: true, message: "请输入职务名称", trigger: "change" },
        ],
        entry_date: [
          { required: true, message: "请选择任职日期", trigger: "change" },
        ],
      },
      teamPersonalLoading: false
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

    // 获取党组织下的党员
    configCircuitfInfo(organ_id) {
      this.teamPersonalLoading = true;
      let params = {
        organ_id: organ_id
      }
      this.$client.ListPartyRecord(params).then(res => {
        if(res.head.result == '200') {
          this.teamPersonList = res.context.list;
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
        this.teamPersonalLoading = false
      })
    },
    // 选择党组织成员带出党员信息
    selectedTeamPersonal(val) {
      console.log(val)
      this.teamPersonList.forEach(element => {
        if(val === element.id) {
          this.formData.ex_name = element.name;
          this.formData.ex_idcode = element.idcode;
          this.formData.ex_sex = element.sex;
          this.formData.ex_top_education = element.top_education;
          this.formData.ex_birthday = element.birthday;
        }
      });
    },
    
    setData(val) {
      console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        let info = {...this.formData}
        delete info.ex_name
        delete info.ex_idcode
        delete info.ex_sex
        delete info.ex_top_education
        delete info.ex_birthday
        delete info.ex_class_name
        if(this.curType == 'add') {
          delete info.id
        }
      
        this.$emit("sure-submit-info", info);
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
