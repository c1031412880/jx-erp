<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
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
        <el-form-item label="所属维修单元:" prop="maintain_unit" label-width="140px" v-if="!ruleForm.propety" key="1">
          <get-department-select
            ref="baseTree"
            :isContainEmp="isContainEmp"
            :isShowCheckbox="false"
            :funcType="funcType"
            :placeholder="'选择维修单元'"
            v-model="maintain_unit"
            :isExportMultiple="false"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="所属维修车间:" label-width="140px"  prop="maintain_unit" v-if="ruleForm.propety" key="2">
          <el-select v-model="workshopId" @change="selectedWorkshopId" clearable placeholder="请选择所属维修车间" v-loading="departLoading">
            <el-option
              v-for="item in workshopDataOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织名称:" prop="name" label-width="140px" >
          <el-input v-model="ruleForm.name" placeholder="请输入维修组织名称"></el-input>
        </el-form-item>
        <el-form-item label="组织属性:" prop="propety" label-width="140px">
          <el-radio-group v-model="ruleForm.propety" @change="radioGroupChange">
            <el-radio :label="0">维修车间</el-radio>
            <el-radio :label="1">维修班组</el-radio>
          </el-radio-group>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    workshopDataOptions:[Array],
    departLoading:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTitle: "",
      isContainEmp: false,
      funcType: 2, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      ruleForm: {
        maintain_unit:[],
        name: "",
        propety:0,
      },
      maintain_unit:'',
      rules: {
        name: [
          { required: true, message: "请填写组织名称", trigger: "change" },
        ],
        maintain_unit: [
          { required: true, message: "请输选择组织类型", trigger: "change" },
        ],
        propety:[
          { required: true, message: "请输选择组织类型", trigger: "change" },
        ],
      },
      workshopId:""
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
        this.configTitle();
      }
    },
  },
  methods: {
    dialogClose() {
      if(!this.ruleForm.propety) {
        this.resetData();
      }
      this.$emit("update:dialogBool", false);
    },
    // 重置组织树
    resetData() {
      this.$refs.baseTree.onClear()
    },
    configTitle() {
      this.showTitle = "添加维修组织";
    },
    // 分公司选择
    onSelectChange(vehs, nodes) {
     this.ruleForm.maintain_unit = [];
      if (nodes && nodes.length > 0) {
        nodes.forEach((item, index) => {
          delete item.children;
        });
        this.ruleForm.maintain_unit = nodes
      } else {
        this.ruleForm.maintain_unit = [];
      }
    },
    // 重置输入框
    radioGroupChange() {
      this.ruleForm.name = '';
      this.ruleForm.maintain_unit = '';
      this.workshopId = '';
    },
    selectedWorkshopId(val) {
      this.ruleForm.maintain_unit = [];
      if(this.ruleForm.maintain_unit.length == 0) {
        let obj = {
          i_id: Number(val)
        }
        this.ruleForm.maintain_unit.push(obj)
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          // return
          this.$emit("save-add-edit-organization",this.ruleForm);
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
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}

.el-dialog-div {
  height: 160px;
}

.el-dialog-div /deep/ .el-input {
  width: 200px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 200px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}



.el-cascader {
  width: 100% !important;
}
</style>


