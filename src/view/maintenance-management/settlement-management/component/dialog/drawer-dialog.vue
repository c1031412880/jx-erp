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
          <el-col :span="20">
            <el-form-item label="故障项目:" prop="made">
          <get-department-select
            ref="tree"
            v-model="form.department_ids"
            :placeholder="'请选择所属组织'"
            :isContainEmp="isContainEmp"
          ></get-department-select>
            </el-form-item>
          </el-col>
            <el-col :span="20">
            <el-form-item label="维修项目:" prop="made">
          <get-department-select
            ref="tree"
            v-model="form.department_ids"
            :placeholder="'请选择所属组织'"
            :isContainEmp="isContainEmp"
          ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="车辆组织:" prop="made">
          <get-department-select
            ref="tree"
            v-model="form.department_ids"
            :placeholder="'请选择所属组织'"
            :isContainEmp="isContainEmp"
          ></get-department-select>
              </el-form-item>
          </el-col>
          <el-col :span="20">
        <el-form-item label="车辆型号">
          <el-select v-model="form.veh_type" clearable placeholder="车辆型号">
            <el-option
              v-for="item in vehTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="14">
            <el-form-item label="维修工时:">
            <el-input-number v-model="form.num"  :min="1"  label="描述文字"></el-input-number><=
            </el-form-item>
            
         </el-col>
        <el-col :span="5">
           <el-input-number v-model="form.num"  :min="1"  label="描述文字"></el-input-number>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  data() {
    return {
      vehTypeData: [],
      input_names: '',
      direction: 'rtl',
      isContainEmp:false,
      form:{
        made:'',
        made_date:'',
        check_date:''
      },
    };
  },
  components:{
    getDepartmentSelect,
    getSelectDictionaries
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
  mounted() {
    this.getVehType()
  },
  methods: {
      // 获取车辆型号
    getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
    },
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