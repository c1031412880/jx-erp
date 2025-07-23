<template>
  <el-dialog 
    :visible="dialogBool" 
    title="集团员工薪资设置" 
    :before-close="dialogClose" 
    width="900px"  
  >
    <div>
      <el-form 
        size="mini"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px">
        <div class="show-flex-box-r">
          <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
          <p style="margin-left: 15px;margin-bottom: 15px;color: #409eff;font-size: 16px;font-weight: bold;">用户基本信息
          </p>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="驾驶员:" prop="user_id">
              <get-driver-select-tree
                ref="driverTree"
                v-model="form.user_id"
                :isShowCheckbox="false"
                :placeholder="'请选择驾驶员'"
                :isExportMultiple="false"
                @on-change="changeUser"
                :disabled="salaryType =='edit'"
              ></get-driver-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门:" prop="dept_name">
              <el-input disabled v-model="form.dept_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾照等级:" prop="driver_license_category">
              <el-input disabled v-model="form.driver_license_category"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月基本工资(元):" prop="basic_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.basic_salary"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度考核奖(元):" prop="monthly_performance_bonus">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.monthly_performance_bonus"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="show-flex-box-r">
              <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
              <p style="margin-left: 15px;margin-bottom: 15px;color: #409eff;font-size: 16px;font-weight: bold;">用户基本信息</p>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医疗保险基数(元):" prop="">
              <el-input-number :controls="false" style="width:100%" v-model="form.medical_insurance_base"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="养老保险基数(元):" prop="">
              <el-input-number :controls="false" style="width:100%" v-model="form.pension_insurance_base"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失业保险基数（元）:" prop="">
              <el-input-number :controls="false" style="width:100%" v-model="form.unemployment_insurance_base"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公积金(元):" prop="">
              <el-input-number :controls="false" style="width:100%" v-model="form.accumulation_fund"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工会费(元):" prop="">
              <el-input-number :controls="false" style="width:100%" v-model="form.union_fee"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
    salaryType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      form: {
        user_id: '',
        dept_name: '',
        driver_license_category: '',
        basic_salary: '',
        monthly_performance_bonus: '',
        medical_insurance_base: '',
        pension_insurance_base: '',
        unemployment_insurance_base: '',
        accumulation_fund: '',
        union_fee: '',
        i_id: null
      },
      rules:{
        user_id: [{
          required: true,
          message: '请选择人员姓名',
          trigger: 'change'
        }],
        dept_name: [{
          required: true,
          message: '请输入部门',
          trigger: 'change'
        }],
        driver_license_category: [{
          required: true,
          message: '请输入驾照等级',
          trigger: 'change'
        }],
        basic_salary: [{
          required: true,
          message: '请输入月基本工资',
          trigger: 'change'
        }],
        monthly_performance_bonus: [{
          required: true,
          message: '请输入月度考核奖',
          trigger: 'change'
        }],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.driverTree.onClear()
      }else{
        this.GetSalarySetting()
      }
    },
  },
  methods: {
    // 初始化数据
    setData(info) {
      for (const key in info) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          this.form[key] = info[key];
        }
      }
    },
    // 获取职级对应工资
    GetSalarySetting() {
      this.$client.GetSalarySetting({type: 2}).then(res => {
        if (res.head.result == "200") {
          this.salarydata = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    changeUser() {
      if (!this.form.user_id) {
        return
      }
      let params = {
        id : this.form.user_id
      }
      this.$client.getEmployeeManageDetail(params).then((res) => {
        if (res.head.result == "200") {
          let info = res.context

          this.form.driver_license_category = info.c_licence_grade
          this.form.dept_name = info.department_main_name

          this.salarydata.forEach(item => {
            if (item.licence_id === this.form.driver_license_category) {
              this.form.basic_salary = item.month_basic_salary
              this.form.monthly_performance_bonus = item.monthly_performance_bonus
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submit(){
      this.$emit('on-save',this.form)
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
