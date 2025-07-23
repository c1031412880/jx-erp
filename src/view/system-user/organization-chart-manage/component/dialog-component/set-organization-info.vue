<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="540px"
    
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="组织名称:" prop="dept_name" label-width="140px">
          <el-input v-model.trim="ruleForm.dept_name"></el-input>
        </el-form-item>
        <el-form-item label="上级组织:" prop="" label-width="140px">
          <!-- <el-input v-model="superiorDeptName" :disabled="true"></el-input> -->
          <get-department-select
            :key="key"
            ref="departmentTree"
            v-model="ruleForm.parent_id"
            :ownId="ruleForm.dept_id"
            :isParentOrganization="curType=='edit' ? true : false "
            :isContainEmp="false"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            :placeholder="'请选择组织'"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="设置主管:" prop="manager_id" label-width="140px" v-if="curType =='edit'">
          <el-select v-model="ruleForm.manager_id" clearable placeholder="请选择">
            <el-option
              v-for="item in competentUserOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分管领导:" prop="director_id" label-width="140px" v-if="curType =='edit'">
          <get-user-select
            ref="userTree"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            v-model="ruleForm.director_id"
            placeholder="请选择">
          </get-user-select>
        </el-form-item>
        <el-form-item label="组织类型:" prop="admin_type" label-width="140px">
          <el-select v-model="ruleForm.admin_type" clearable placeholder="请选择" :disabled="isFirstOrganization">
            <el-option
              v-for="item in organizationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织类别:" multiple prop="func_type" label-width="140px" v-if="!isFirstOrganization">
         <el-select v-model="ruleForm.func_type" multiple clearable placeholder="请选择">
            <el-option
              v-for="item in clssifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织描述:" prop="describe" label-width="140px">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            v-model="ruleForm.describe"
            placeholder="请输入组织描述"
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
import getUserSelect from '@/components/base/formModel/tree/get-user-select'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getUserSelect, getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    superiorDeptName:{
      type: String,
      default: '无'
    },
    curType: [String],
    isFirstOrganization:[Boolean],
    competentUserOptions:[Array],
  },
  data() {
    return {
      showTitle: "",
      key: null,
      organizationOptions: [{
          value: '1',
          label: '总公司'
        }, {
          value: '2',
          label: '分公司'
        }, {
          value: '3',
          label: '车队'
        }, {
          value: '4',
          label: '部门'
        },{
          value: '5',
          label: '其他'
        },],
      clssifyOptions: [{
          value: '1',
          label: '运营单元'
        }, {
          value: '2',
          label: '维修单元'
        }, {
          value: '3',
          label: '仓储单元'
        },],
      ruleForm: {
        dept_id: "",
        dept_name: "",
        parent_id: "",
        admin_type: "", //组织类型
        func_type:[], //组织类别
        describe: "",
        manager_id: "",
        director_id: ""
      },
      rules: {
        dept_name: [
          { required: true, message: "请填写组织名称", trigger: "change" },
        ],
        admin_type: [
          { required: true, message: "请输选择组织类型", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$nextTick(()=> {
          this.$refs.userTree.onClear()
          this.$refs.departmentTree.onClear()
        })
      } else {
        this.key = new Date().getTime()
        this.configTitle();
      }
    },
    isFirstOrganization() {
      if(this.isFirstOrganization) {
        this.ruleForm.admin_type = "1";
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType == "add" && this.isFirstOrganization) {
        this.showTitle = "添加总组织";
      } else if (this.curType == "add" && !this.isFirstOrganization) {
        this.showTitle = "添加子组织";
      } else if (this.curType == "edit") {
        this.showTitle = "修改组织信息";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
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
.el-dialog__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.el-dialog-div {
  height: 380px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 300px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 300px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}



.el-cascader {
  width: 100% !important;
}
</style>


