<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="800px"
    center
    
  >
    <div class="el-dialog-div">
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
            ></el-input>
          </el-form-item>
          <el-form-item label="驾照类型:" prop="c_permit_vehilce">
            <el-select v-model="formData.c_permit_vehilce" placeholder="请选择驾照类型" :disabled="curSelecedType == 'detail'">
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
              style="width: 167px"
            >
            </el-date-picker>
            <el-checkbox v-model="isLongValidity">长期</el-checkbox>
          </el-form-item>
          <el-form-item label="发证机构:" prop="c_certificate">
            <el-input
              placeholder="请输入发证机构"
              v-model="formData.c_certificate"
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
        <div class="show-flex-box-r" style="margin-bottom: 15px">
          <span style="width:80px;font-size: 14px;color: #606266;margin: 0px 10px;font-weight: 700;text-align: right;">体检单:</span>
          <div style="height:150px;width: 250px; margin-right: 15px">
            <img-box ref="firstLaborInfo" :imgData='first_tjd_data' :imageHeight="160" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="'first'" :picturePathList="formData.tjd_data" :isShowRemark="false" :disabled="curSelecedType == 'detail'" :maxUpLoadNum="10" @on-add-img ='addVehLicenseImg(arguments)' @on-del ='deleteImg(arguments)'  @on-del-all ='deleteAllImg'></img-box>

          </div>

          <span style="width:80px;font-size: 14px;color: #606266;margin: 0px 10px;font-weight: 700;text-align: right;">核酸检测:</span>
          <div style="height:150px;width: 250px;">
            <img-box ref="secondLaborInfo" :imgData='second_hsbg_data' :imageHeight="160" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="'second'" :picturePathList="formData.hsbg_data" :isShowRemark="false" :disabled="curSelecedType == 'detail'" :maxUpLoadNum="10" @on-add-img ='addVehLicenseImg(arguments)' @on-del ='deleteImg(arguments)'  @on-del-all ='deleteAllImg'></img-box>
          </div>
        </div>

        <div class="show-flex-box-r" style="margin-bottom: 15px">
          <span style="width:80px;font-size: 14px;color: #606266;margin: 0px 10px;font-weight: 700;text-align: right;">派出所证明:</span>
          <div style="height:150px;width: 250px; margin-right: 15px">
            <img-box ref="thirdLaborInfo" :imgData='third_pcszm_data' :imageHeight="160" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="'third'" :picturePathList="formData.pcszm_data" :isShowRemark="false" :disabled="curSelecedType == 'detail'" :maxUpLoadNum="10" @on-add-img ='addVehLicenseImg(arguments)' @on-del ='deleteImg(arguments)'  @on-del-all ='deleteAllImg'></img-box>
          </div>

          <span style="width:80px;font-size: 14px;color: #606266;margin: 0px 10px;font-weight: 700;text-align: right;">毛发检测:</span>
          <div style="height:150px;width: 250px;">
            <img-box ref="fourthLaborInfo" :imgData='fourth_mfjc_data' :imageHeight="160" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="'fourth'" :picturePathList="formData.mfjc_data" :isShowRemark="false" :disabled="curSelecedType == 'detail'" :maxUpLoadNum="10" @on-add-img ='addVehLicenseImg(arguments)' @on-del ='deleteImg(arguments)'  @on-del-all ='deleteAllImg'></img-box>
          </div>
        </div>
        <div style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(51, 51, 51, 0.52156862745098);padding-left: 20px; margin-bottom: 20px;">*说明：请上传体检 ，核酸检测，派出所证明，毛发检测等相关图片，每个种类最多可上传10张图片</div>

        <div v-if="curSelecedType != 'detail'" class="show-flex-box-r">
          <el-form-item label="选择审核流程:" prop="">
            <el-select v-model="flow_id" @change="selectedFlowId" placeholder="请选择流程">
              <el-option
                v-for="item in flowListOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <span style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(51, 51, 51, 0.52156862745098);padding-left: 10px; line-height: 28px">备注：添加或者撤销后再次编辑流程默认选择第一个,若更改请选择</span>
        </div>
        <div class="show-flex-box-c" v-if="!!flow_id || (!!formData.i_flow_id && curSelecedType == 'detail')">
          <p
            style="
              margin-left: 15px;
              margin-bottom: 15px;
              color: #409eff;
              font-size: 16px;
              font-weight: bold;
            "
          >
            流程:
          </p>
          <div class="show-flex-box-r" v-if="!!formData.i_flow_id && curSelecedType == 'detail'" style="margin: 15px 0 0 30px;">
          <approve-schedule style="margin-left: 10px;" :isFlow="false" :flow_id="formData.i_flow_id"></approve-schedule>
          </div>
          <div class="show-flex-box-r"  v-if="!!flow_id && curSelecedType != 'detail'" style="margin: 15px 0 0 30px;">
            <approve-step :flow_id="flow_id" :isFlow="true" @on-users="saveOnUsers"></approve-step>
          </div>
        </div>
        <!-- <div class="show-flex-box-r">
          <el-form-item label="当前状态:" prop="i_emp_state">
            <el-radio-group v-model="formData.i_emp_state">
              <el-radio :label="1"><span style="color:#606266">在职</span></el-radio>
              <el-radio :label="0"><span style="color:#606266">离职</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="i_black">
            <el-checkbox v-model="formData.i_black">加入黑名单</el-checkbox>
          </el-form-item>
        </div> -->
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer show-flex-box-r" style="justify-content: flex-end;">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('formData')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {byIdCardGettingInfo, checkCard} from '@/utils/verificationIDcard'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import ImgBox from "@/components/imageListUpload";
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
import approveStep from '@/components/approve-echo/approve-step.vue'
export default {
  components: {
    getDepartmentSelect,
    ImgBox,
    approveSchedule,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
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
        c_permit_vehilce: '',
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
        
        // i_emp_state: 1,
        // i_black: false,
        c_certificate:'', //发证机构
        c_employee_type: '',//用工形式
        c_home_address: '', //家庭住址

        tjd_data :[], //体检单
        hsbg_data :[], //核酸报告
        pcszm_data :[], //派出所证明
        mfjc_data :[], //毛发检测

        i_flow_id: "", //流程id
        c_flow_code:"", //流程编号

      },
      first_tjd_data:[],//体检单
      second_hsbg_data :[], //核酸报告
      third_pcszm_data :[], //派出所证明
      fourth_mfjc_data :[], //毛发检测
      imageDataListTypemap: {
        'first': 'tjd_data',
        'second': 'hsbg_data',
        'third': 'pcszm_data',
        'fourth': 'mfjc_data',
      },
      imageDataTypemap: {
        'first': 'first_tjd_data',
        'second': 'second_hsbg_data',
        'third': 'third_pcszm_data',
        'fourth': 'fourth_mfjc_data',
      },
      rules: {
        c_name: [
          { required: true, message: '请输入驾驶员姓名', trigger: 'change' },
        ],
        i_department_base: [
          { required: true, message: '请选择所属组织', trigger: 'change' },
        ],
        d_join_company: [
          { required: true, message: '请选择进单位时间', trigger: 'change' },
        ],
        c_idcord: [
          { required: true, message: '请输入身份证号码', trigger: 'change' },
        ],
        d_birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' },
        ],
        c_phone: [
          { required: true, message: '请输入联系方式', trigger: 'change' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },

      flowListOptions:[],
      flow_id: '',
      approveStepList:[], //流程列表
      isLongValidity: false, // 驾驶证是否为长期
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.baseTree.onClear();
        Object.assign(this.$data, this.$options.data());
      }else{
        if(this.curSelecedType != 'detail') {
          this.reqGetListFlowManage();
        }
        this.$nextTick(() =>{
          this.$refs.formData.clearValidate();
        })
      }
    },
    isLongValidity() {
      if(this.isLongValidity) {
        this.formData.d_latest_get_licence = ''
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
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
    // 删除图片
    deleteImg(msg){
    //  console.log(msg[0],msg[1])
      let item = msg[0]
      let flag = msg[1]
      this[this.imageDataTypemap[flag]].forEach((element,index) => {
        if(element.id == item.id){
          this[this.imageDataTypemap[flag]].splice(index,1)
          this.formData[this.imageDataListTypemap[flag]].splice(index,1)
        }
      });
    },
    // 删除所有图片
    deleteAllImg(val){
      this[this.imageDataTypemap[val]] = []
      this.formData[this.imageDataListTypemap[val]] = []
    },
    // 添加图片（体检单、核酸报告、派出所证明、派出所证明）
    addVehLicenseImg(msg){
      console.log('addVehLicenseImg',JSON.stringify(msg) ,msg)
      // return
      let lastChildId = 0;
      if(this[this.imageDataTypemap[msg[1]]].length > 0) {
        lastChildId = this[this.imageDataTypemap[msg[1]]][this[this.imageDataTypemap[msg[1]]].length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        id: imgSort,
        image_path: msg[0],
        isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
      }
      this[this.imageDataTypemap[msg[1]]].push(Obj)
      this.formData[this.imageDataListTypemap[msg[1]]].push(msg[0])
    },

    // 图片回显示
    bulidImageEcho(picList){
      let imageReturnList = [];
      // alert(picList)
      if(!!picList && picList.length > 0) {
        picList.forEach((item,index) => {
          let Obj = {
            id: index + 1,
            image_path: item,
            isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
          };
          imageReturnList.push(Obj)
        })
      }
      return imageReturnList
    },

    // 选择流程
    selectedFlowId(val) {
      if(!val) {
        this.approveStepList = []
      }
    },
    // 获取流程列表
    reqGetListFlowManage() {
      let params = {
        object_id: 100,
        type: 2
      }
      this.$client.GetListFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.flowListOptions = res.context.list;
          if(!!this.flowListOptions && this.flowListOptions.length && !this.flow_id) {
            this.flow_id = this.flowListOptions[0].id
          }
        }else{
          this.flowListOptions = [];
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 根据流程设计发起流程folw_code
    saveOnUsers(list) {
      this.approveStepList = list;
      // this.submitApplyMembershipForm();
    },

    // 编辑回显示
    setData(val) {
      this.flow_id = 0
      let form = JSON.parse(JSON.stringify(val))
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(form, key)) {
          this.formData[key] = form[key];
          if(key == 'tjd_data') {
            if(!!form.tjd_data) {
              this.first_tjd_data = this.bulidImageEcho(form.tjd_data)
            }else{
               this.formData.tjd_data = []
            }
          }
          if(key == 'hsbg_data') {
            this.second_hsbg_data = this.bulidImageEcho(form.hsbg_data)
          }
          if(key == 'pcszm_data') {
            this.third_pcszm_data = this.bulidImageEcho(form.pcszm_data)
          }
          if(key == 'mfjc_data') {
            this.fourth_mfjc_data = this.bulidImageEcho(form.mfjc_data)
          }

          if(key == 'd_latest_get_licence' && !form[key]) {
            this.isLongValidity = true
          }

          // if(key == 'i_flow_id') {
          //   this.flow_id = form.i_flow_id
          // }
        }
      }
    },


    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.formData};
          if(checkCard(info.c_idcord)){
            this.$emit("save-add-edit", info, this.approveStepList);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 450px;
  overflow-y: scroll; 
}
.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 222px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 222px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 222px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 580px;
}
</style>

