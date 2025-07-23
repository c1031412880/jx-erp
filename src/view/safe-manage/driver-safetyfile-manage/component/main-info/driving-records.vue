<template>
  <div class="base-info" style="height:450px;overflow-x:hidden">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="135px"
    >
      <div class="el-form-row">
        <el-form-item label="姓名:" prop="c_name">
          <el-input
            placeholder="请输入人员姓名"
            v-model="formData.c_name"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="工号:" prop="c_worker_id">
          <el-input
            placeholder="请输入员工工号"
            v-model="formData.c_worker_id"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="所属组织:" prop="i_department_base">
           <get-department-select
            ref="baseTree"
            :isContainEmp="false"
            :funcType="1"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            v-model="formData.i_department_base"
            :disabled="curSelecedType == 'detail'"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="性别:" prop="c_gender">
          <!-- <el-select v-model="formData.c_gender" placeholder="请选择性别">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :disabled="curSelecedType == 'detail'"
            >
            </el-option>
          </el-select> -->
          <el-radio-group v-model="formData.c_gender" :disabled="curSelecedType == 'detail'">
            <el-radio :label="'男'"><span style="color:#606266">男</span></el-radio>
            <el-radio :label="'女'"><span style="color:#606266">女</span></el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="el-form-row">
        <el-form-item label="联系方式:" prop="c_phone">
          <el-input
            placeholder="请输入联系方式"
            v-model="formData.c_phone"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.c_phone = $event.target.value"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="c_idcord">
          <el-input
            placeholder="请输入身份证号"
            v-model="formData.c_idcord"
            @input="setDrivingLicence"
            @change="checkIdCardIsUses"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>

      <div class="el-form-row">
        <el-form-item label="出生日期:" prop="d_birthday">
           <el-date-picker
            v-model="formData.d_birthday"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            :disabled="curSelecedType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="进单位时间:" prop="d_join_company">
          <el-date-picker
            v-model="formData.d_join_company"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curSelecedType == 'detail'">
          </el-date-picker>
        </el-form-item>
      </div>

      <div class="el-form-row">
        <!-- 需求变更可以修改 -->
        <el-form-item label="档案编号:" prop="c_da_code">
          <el-input
            placeholder="请输入档案编号"
            v-model="formData.c_da_code"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="驾照类型:" prop="c_licence_grade">
          <el-select v-model="formData.c_licence_grade" placeholder="请选择驾照类型" :disabled="curSelecedType == 'detail'">
            <el-option
              v-for="item in licenceGradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="el-form-row">
        <el-form-item label="驾驶证号:" prop="c_driving_licence">
          <el-input
            placeholder="请输入驾驶证号"
            v-model="formData.c_driving_licence"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="驾驶证日期:" prop="d_first_get_licence">
          <el-date-picker
            v-model="formData.d_first_get_licence"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            :disabled="curSelecedType == 'detail'"
            >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="驾驶证到期日期:" prop="d_latest_get_licence">
          <el-date-picker
            v-model="formData.d_latest_get_licence"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curSelecedType == 'detail'"
            style="width: 232px"
          >
          </el-date-picker>
          <el-checkbox v-model="isLongValidity">长期</el-checkbox>
        </el-form-item>
        <el-form-item label="发证机构:" prop="c_certificate">
          <el-input
            placeholder="请输入发证机构"
            v-model="formData.c_certificate"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>

      </div>
      <div class="el-form-row">
        <el-form-item label="用工形式:" prop="c_employee_type">
          <el-select v-model="formData.c_employee_type" placeholder="请选择用工形式" :disabled="curSelecedType == 'detail'">
            <el-option
              v-for="item in employmentFormOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="从业资格证号:" prop="c_qualification_code">
          <el-input
            placeholder="请输入从业资格证号"
            v-model="formData.c_qualification_code"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="从业资格证日期:" prop="d_qualification">
          <el-date-picker
            v-model="formData.d_qualification"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curSelecedType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="从业资格证到期日:" prop="d_qualification_end">
          <el-date-picker
            v-model="formData.d_qualification_end"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curSelecedType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="劳动合同开始时间:" prop="d_labor_contract_begin">
          <el-date-picker
            v-model="formData.d_labor_contract_begin"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curSelecedType == 'detail'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="劳动合同到期时间:" prop="d_labor_contract">
          <el-date-picker
            v-model="formData.d_labor_contract"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curSelecedType == 'detail'">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="安全责任书日期:" prop="d_safe_duty_start">
          <el-date-picker
            v-model="formData.d_safe_duty_start"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curSelecedType == 'detail'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安全责任书到期日:" prop="d_safe_duty_end">
          <el-date-picker
            v-model="formData.d_safe_duty_end"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curSelecedType == 'detail'">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="住址:" prop="c_home_address">
          <el-input
            type="textarea"
            :disabled="curSelecedType == 'detail'"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入住址"
            v-model="formData.c_home_address"
          ></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="当前状态:" prop="i_emp_state">
          <el-radio-group v-model="formData.i_emp_state" :disabled="curSelecedType == 'detail'">
            <el-radio :label="1"><span style="color:#606266">在职</span></el-radio>
            <el-radio :label="0"><span style="color:#606266">离职</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="i_black">
          <el-checkbox v-model="formData.i_black" :disabled="curSelecedType == 'detail'">加入黑名单</el-checkbox>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="当前星级:" prop="i_star" style="width:423px;">
          <el-rate v-model="formData.i_star" :max="3" :disabled="curSelecedType == 'detail'" @change="changeRate" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </el-form-item>
        <el-form-item label="持续季度：" prop="i_keep">
          <el-input-number v-model="formData.i_keep"  :min="0" :max="9999" label="持续季度" style="width:290px"></el-input-number>
        </el-form-item>
      </div>
    </el-form>
    <div>
      <span style="font-size: 12px; color:#3333336f;">说明：驾驶员安全档案只能查看和编辑部分档案信息，若需要添加编辑查看完整的人员信息请前往人事管理-人员管理</span>
    </div>
  </div>
</template>
<script>
import {byIdCardGettingInfo, checkCard} from '@/utils/verificationIDcard'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    curSelecedType:{
      type: String,
      default: 'edit' //add添加  edit编辑  detail详情
    }
  },
  data() {
    return {
      sexOptions:[ //工种属性
        { value: "男", name: "男" },
        { value: "女", name: "女" },
      ],
      licenceGradeOptions:[
        {
          value: "A1",
          label: "A1",
        },
        {
          value: "A2",
          label: "A2",
        },
        {
          value: "A3",
          label: "A3",
        },
        {
          value: "B1",
          label: "B1",
        },
        {
          value: "B2",
          label: "B2",
        },
        {
          value: "C1",
          label: "C1",
        },
        {
          value: "C2",
          label: "C2",
        },
        {
          value: "C3",
          label: "C3",
        },
      ],
      employmentFormOptions: [ //用工形式
        { value: "全日制", name: "全日制" },
        { value: "全日制外地就业", name: "全日制外地就业" },
        { value: "方正派遣工", name: "方正派遣工" },
        { value: "汇才派遣工", name: "汇才派遣工" },
        { value: "返聘", name: "返聘" },
      ],
      formData: {
        i_id:'',
        c_name: '',
        c_worker_id: '',
        i_department_base: '',
        c_gender: '', 
        c_phone: '',
        c_idcord: '',
        d_birthday: '',
        d_join_company: '',
        c_da_code: '',
        c_licence_grade: '',
        c_driving_licence: '',
        d_first_get_licence: '',
        d_latest_get_licence: '',
        c_qualification_code: '',
        d_qualification: '',
        d_qualification_end: '',
        d_labor_contract_begin: '',
        d_labor_contract: '',
        d_safe_duty_start: '',
        d_safe_duty_end: '',
        
        i_emp_state: 1,
        i_black: false,
        c_certificate:'', //发证机构
        c_employee_type: '',//用工形式
        c_home_address: '', //家庭住址
        i_star:0,
        i_keep:0

      },
      rules: {
        c_name: [
          { required: true, message: '请输入驾驶员姓名', trigger: 'change' },
        ],
        i_department_base: [
          { required: true, message: '请选择所属组织', trigger: 'change' },
        ],
        c_idcord: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      isLongValidity: false, // 驾驶证是否为长期
      isStar0: true
    }
  },
  computed: {},
  watch: {
    isLongValidity() {
      if(this.isLongValidity) {
        this.formData.d_latest_get_licence = ''
      }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['formData'].resetFields()
      this.isLongValidity = false
      this.$refs.baseTree.onClear();
    },
    // 设置驾驶证号
    setDrivingLicence(val) {
      this.formData.c_driving_licence = val
    },
    // 输入驾驶证校验
    checkIdCardIsUses(val) {
      if(checkCard(val)){
        this.formData.d_birthday = byIdCardGettingInfo(val,'birthday')
      }
    },
    // 取消当前星级 为0星
    changeRate(value) {
      // console.log(value,this.isStar0);
      if(this.isStar0 && value == 1) {
        this.formData.i_star = 0
        this.isStar0 = false
      }
      if(value > 1) {
        this.isStar0 = false
      }
      if(value == 1 ) {
        this.isStar0 = true
      }
      if(this.isStar0 && this.formData.i_star == 0) {
        this.isStar0 = false
      }
      
    },
    // 数据回显
    setData(val){
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key];
          if(key == 'i_black') {
            this.formData[key] = !!val[key]
          }
          if(key == 'd_latest_get_licence' && !val[key]) {
            console.log(val[key])
            this.isLongValidity = true
          }
          if(key === 'c_employee_type') {
            this.formData.c_employee_type = Number(val.c_employee_type)
          }
          if(key == 'i_star'){
            if(this.formData[key] == 1) {
              this.isStar0 = true
            }else{
              this.isStar0 = false
            }
          }
        }
      }
      this.$nextTick(() =>{
        this.$refs.formData.clearValidate();
      })
    },
    // 给父级页面提供得获取本页数据
    getData() {
      let info = {...this.formData}
      info.i_black = this.formData.i_black? 1: 0
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
          if(!checkCard(info.c_idcord)) {
            return
          }
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败'
            })
            return
          }
          resolve({ 
            formData: info,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.base-info /deep/ .el-date-editor {
  width: 290px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 290px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 290px;
}

.base-info /deep/ .el-textarea {
  width: 715px;
}
</style>

