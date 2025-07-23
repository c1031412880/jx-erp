<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="700px"
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
       <div class="show-flex-box-r">
                   <el-form-item
              label="仓库名称:"
              prop="name"
              style="height: 25px"
              
            >
            <el-input v-model="ruleForm.name" :width="'420'" >
            </el-input>
            </el-form-item>
              <el-form-item label="编号:">
                <el-input v-model="ruleForm.code" :width="'420'" >
                </el-input>
              </el-form-item>
            </div>
         <div class="show-flex-box-r">
          <el-form-item label="所属分组:" prop="deptment_id">
             <get-store-select 
                ref="driverTree1"
                v-model="ruleForm.deptment_id"
                :width="'390'"
                :isShowCheckbox="false"
                :placeholder="'请选择分组'"
                :isExportMultiple="false"
              ></get-store-select>
          </el-form-item>
              <el-form-item label="仓库分类:">
                <get-select-dictionaries v-model="ruleForm.type" :classKey="'仓库分类'" :placeholder="'请选择'" ></get-select-dictionaries>
              </el-form-item>
            </div>
            <el-form-item label="备注:">
                <el-input v-model="ruleForm.remark" type="textarea" :rows="3" :width="'420'" >
                </el-input>
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
import getStoreSelect from 'components/base/formModel/tree/get-store-select'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {getDepartmentSelect,getStoreSelect,getSelectDictionaries},
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
          { required: true, message: "请输仓库名称", trigger: "change" },
        ],
        deptment_id: [
          { required: true, message: "请输选择组织类型", trigger: "change" },
        ],
      },
      workshopId:""
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.driverTree1.onClear()
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
      // this.$refs.baseTree.onClear()
    },
    configTitle() {
      this.showTitle = "添加仓库信息";
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


