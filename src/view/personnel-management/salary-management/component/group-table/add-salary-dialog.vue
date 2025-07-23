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
            <el-tooltip class="item" effect="dark" content="以下日工资都以每月30天计算" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="user_id">
              <get-department-select
                ref="personalTree"
                v-model="form.user_id"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择人员'"
                :isExportMultiple="false"
                :isCheckStrictly="false"
                :isContainEmp="true"
                @on-change="changeUser"
                :disabled="salaryType == 'edit'"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门:" prop="dept_name">
              <el-input disabled v-model="form.dept_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职级:" prop="rank_level">
              <el-input disabled v-model="form.rank_level"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基本年薪(元):" prop="basic_annual_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.basic_annual_salary"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月基本年薪(元):" prop="monthly_basic_annual_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.monthly_basic_annual_salary"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月绩效年薪(元):" prop="monthly_annual_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.monthly_annual_salary"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月工资应发(元):" prop="monthly_total_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.monthly_total_salary"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日工资应发(元):" prop="day_total_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.day_total_salary"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日病假应发(元):" prop="day_sick_salary">
              <el-input-number  disabled :controls="false" style="width:100%" v-model="form.day_sick_salary"></el-input-number>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree"
export default {
  components: {
    getDepartmentSelect
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
        rank_level: '',
        basic_annual_salary: '',
        monthly_basic_annual_salary: '',
        monthly_annual_salary: '',
        monthly_total_salary: '',
        day_total_salary: '',
        day_sick_salary: '',
        medical_insurance_base: '',
        pension_insurance_base: '',
        unemployment_insurance_base: '',
        accumulation_fund: '',
        union_fee: '',
        i_id: null
      },
      salarydata: [],
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
        rank_level: [{
          required: true,
          message: '请输入职级',
          trigger: 'change'
        }],
        basic_annual_salary: [{
          required: true,
          message: '请输入基本年薪',
          trigger: 'change'
        }],
        monthly_basic_annual_salary: [{
          required: true,
          message: '请输入月基本年薪',
          trigger: 'change'
        }],
        monthly_annual_salary: [{
          required: true,
          message: '请输入月绩效年薪',
          trigger: 'change'
        }],
        monthly_total_salary: [{
          required: true,
          message: '请输入月工资应发',
          trigger: 'change'
        }],
        day_total_salary: [{
          required: true,
          message: '请输入日工资应发',
          trigger: 'change'
        }],
        day_sick_salary: [{
          required: true,
          message: '请输入日病假应发',
          trigger: 'change'
        }],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.personalTree.onClear()
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
      this.$client.GetSalarySetting({type: 1}).then(res => {
        if (res.head.result == "200") {
          console.log('res...',res);
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
          console.log('-------',res);
          let info = res.context

          this.form.rank_level = info.rank_name
          this.form.dept_name = info.department_main_name


          this.salarydata.forEach(item => {
            if (item.rank_id === info.rank) {
              this.form.basic_annual_salary = item.basic_year_salary
            }
          });

          this.form.monthly_basic_annual_salary = (Number(this.form.basic_annual_salary) / 12).toFixed(2)
          this.form.monthly_annual_salary = (Number(this.form.monthly_basic_annual_salary) * 0.7).toFixed(2)
          this.form.monthly_total_salary = (Number(this.form.monthly_basic_annual_salary) + Number(this.form.monthly_annual_salary)).toFixed(2)
          this.form.day_total_salary = (Number(this.form.monthly_total_salary) / 30).toFixed(2)
          this.form.day_sick_salary = (Number(this.form.monthly_basic_annual_salary) / 30).toFixed(2)

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
