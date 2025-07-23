<!--  -->
<template>
  <div>
    <el-drawer
      title="高级筛选"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="dialogClose"
      size="650px"
    >
    <div class="advanced-filter">
      <el-form ref="form" :model="form"  label-width="120px">
        <el-row :gutter="50">
          <el-col :span="13">
            <el-form-item label="车辆组织:" prop="made">
          <get-department-select
            ref="baseTree"
            :isContainEmp="isContainEmp"
            :isShowCheckbox="true"
            :funcType="funcType"
            :placeholder="'分公司'"
            :isExportMultiple="true"
            v-model="form.group_id"
          ></get-department-select>
              </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="报修人:">
            <get-user-select   ref="driverTree1"
              v-model="form.code"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择报修人'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'||curChangeType=='checkout'">
              </get-user-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="17">
            <el-form-item label="报修描述:">
              <el-input type="textarea"
               :rows="2"
               v-model="form.code" 
               placeholder="报修描述" 
               clearable>
              </el-input>
            </el-form-item>
          </el-col>
      </el-form>

      <div class="demo-drawer__footer show-flex-box-r show-flex-center">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
import getUserSelect from 'components/base/formModel/tree/get-user-select'
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-dept-emp-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  data() {
    return {
      input_names: '',
      direction: 'rtl',
      isContainEmp:false,
      funcType: 1,
      form:{
        made:'',
        made_date:'',
        check_date:''
      },
    };
  },
  components:{
    getUserSelect,
    getDepartmentSelect,
    getSelectDictionaries
  },
  props: {
    drawer: Boolean,
    curChangeType: {
      type: String,
      default: 'add'
    }
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },

  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.$parent.informationDialogOk();
      // setTimeout(() => {
      //   this.$message({ message: "重置成功", type: "success" });
      // }, 50);
    }
  },
};
</script>
<style lang='scss' scoped>
.advanced-filter{
  padding: 0 40px;
}
.demo-drawer__footer{
  margin-top: 250px;
}
.advanced-filter /deep/ .el-date-editor{
  width: 140px;
}
</style>