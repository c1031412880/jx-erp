<template>
  <div class="base-info" style="height:400px;overflow-x:hidden">
      <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
      <div class="el-form-row-first">
        <div class="el-form-row-first-left">
          <el-form-item label="姓名:" prop="c_name">
            <el-input
              placeholder="请输入人员姓名"
              v-model="formData.c_name"
              @change="changeName"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item>

          <el-form-item label="主部门:" prop="department">
            <get-department-select
              ref="baseTree"
              :isContainEmp="isContainEmp"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              :funcType="showCollapse == 'second'? 1:'' "
              @on-change="onSelectChange"
              :disabled="curChangeType == 'detail'"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="副部门:" v-if="showCollapse == 'first'" prop="sub_orgs">
            <get-department-select
              ref="departmentTree"
              :isContainEmp="isContainEmp"
              v-model="formData.sub_orgs_ids"
              @on-change="onSubOrgsSelectChange"
              :disabled="curChangeType == 'detail'"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="工号:" prop="c_worker_id">
            <el-input
              placeholder="请输入员工工号"
              v-model="formData.c_worker_id"
              @change="changeWorkerId"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="el-form-row-first-right" prop="c_photo">
          <span>员工照片:</span>
          <div
            class="show-flex-box-c avatar-uploader"
            :class="{ 'have-avatar-active': formData.c_photo }"
          >
          <div class="avatar-box-content show-flex-box-c" v-if="formData.c_photo">
            <el-image 
              v-if="formData.c_photo"
              class="avatar"
              :src="formData.c_photo" 
              :preview-src-list="[formData.c_photo]">
            </el-image>
            <i class="delete-icon el-icon-delete" :class="{'no-show-delete-icon':curChangeType == 'detail'}" v-if="formData.c_photo" @click.stop="deleteImage()"></i>
             <el-button icon="el-icon-plus" size="mini" @click="uploadFile" v-if="formData.c_photo" :disabled="curChangeType == 'detail'">更换图片</el-button>
          </div>
           
            <!-- <img v-if="formData.c_photo" :src="formData.c_photo" class="avatar" /> -->
            <i v-if="!formData.c_photo" class="avatar-uploader-icon"
              ><el-button class="el-icon-upload2"  @click="uploadFile" :disabled="curChangeType == 'detail'">上传图片</el-button></i>

            
          </div>
        </div>
      </div>
      <div class="el-form-row">
        <el-form-item label="职位:" prop="position_id">
            <!-- <get-position-list ref="positionList" v-model="formData.position_id" @change="changePosition" :dept_id="dept_id" :multiple="true" :disabled="curChangeType == 'detail'" v-if="showCollapse == 'first'"></get-position-list> -->
            <el-select 
              v-model="formData.position_id" 
              v-if="showCollapse == 'first'" 
              placeholder="请选择职位" 
              multiple
              :disabled="curChangeType == 'detail'">
                <el-option
                  v-for="item in postitionList"
                  :key="item.i_id"
                  :label="item.c_name"
                  :value="item.i_id"
                >
                </el-option>
            </el-select>
            <el-input
              placeholder="请输入职位"
              v-model="positionName"
              disabled
              v-else
            ></el-input>
          </el-form-item>
          <el-form-item label="职务:" prop="i_job_level">
            <el-select v-model="formData.i_job_level" placeholder="请选择职务" :disabled="curChangeType == 'detail'">
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <div v-else>
              <tr-select-dictionaries
                v-model="formData.i_job_level"
                :classKey="'岗位级别'"
                :placeholder="'请选择职务'"
                :isMultiple="false"
                :disabled="curChangeType == 'detail'"
              ></tr-select-dictionaries>
            </div> -->
          </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="职级:" prop="rank">
            <el-select v-model="formData.rank" placeholder="请选择职级" :disabled="curChangeType == 'detail'">
              <el-option
                v-for="item in rankList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <div v-else>
              <tr-select-dictionaries
                v-model="formData.rank"
                :classKey="'职级'"
                :placeholder="'请选择职级'"
                :isMultiple="false"
                :disabled="curChangeType == 'detail'"
              ></tr-select-dictionaries>
            </div> -->
          </el-form-item>
          <el-form-item label="性别:" prop="c_gender">
            <el-select v-model="formData.c_gender" placeholder="请选择性别" :disabled="curChangeType == 'detail'">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
      </div>
      <!-- 驾驶员专有 -->
      <div class="el-form-row" v-if="showCollapse == 'second'">
        <el-form-item label="线路:" prop="i_line_id">
          <el-select v-model="formData.i_line_id" placeholder="请选择线路" :disabled="curChangeType == 'detail'">
            <el-option
              v-for="item in lineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆:" prop="i_vehicle_id">
          <el-select v-model="formData.i_vehicle_id" placeholder="请选择车辆" :disabled="curChangeType == 'detail'">
            <el-option
              v-for="item in vehOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 驾驶员专有 -->
      
      <div class="el-form-row">
        <el-form-item label="联系人手机号:" prop="c_phone">
          <el-input
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.c_phone = $event.target.value"
            placeholder="请输入联系人手机号"
            v-model="formData.c_phone"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="c_idcord">
          <el-input
            placeholder="请输入身份证号"
            v-model="formData.c_idcord"
            @input="setDrivingLicence"
            @change="checkIdCardIsUses"
            clearable
            :disabled="curChangeType == 'detail'"
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
            @change="selectedBirthday"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <el-input
            placeholder="请输入年龄"
            v-model="formData.age"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <!-- <el-form-item label="工种属性:" prop="c_work_kind">
          <el-select v-model="formData.c_work_kind" placeholder="请选择工种属性" :disabled="curChangeType == 'detail'">
            <el-option
              v-for="item in typeWorkProperties"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态:" prop="i_job_state">
           <!-- <el-select v-model="formData.i_job_state" placeholder="请选择状态" :disabled="curChangeType == 'detail'">
            <el-option
              v-for="item in staffStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <tr-select-dictionaries
            v-model="formData.i_job_state"
            :classKey="'员工状态'"
            :placeholder="'请选择员工状态'"
            :isMultiple="false"
            :isShowDefaultValue="true"
            :disabled="curChangeType == 'detail'"
          ></tr-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="劳动合同期限:" prop="labor_contract_time">
          <el-date-picker
            v-model="formData.labor_contract_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="进单位时间:" prop="d_join_company">
          <el-date-picker
            v-model="formData.d_join_company"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="getDivisionAge"
            :disabled="curChangeType == 'detail'">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="用工形式:" prop="c_employee_type">
          <!-- <el-select v-model="formData.c_employee_type" placeholder="请选择用工形式" :disabled="curChangeType == 'detail'">
            <el-option
              v-for="item in employmentFormOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <tr-select-dictionaries
            v-model="formData.c_employee_type"
            :classKey="'用工形式'"
            :placeholder="'请选择用工形式'"
            :isMultiple="false"
            :isShowDefaultValue="false"
            :disabled="curChangeType == 'detail'"
          ></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="司龄:" prop="join_company_age">
          <el-input v-model="formData.join_company_age" disabled ></el-input>
        </el-form-item>
        <!-- <el-form-item label="合同到期时间:" prop="d_contract">
          <el-date-picker
            v-model="formData.d_contract"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'">
          </el-date-picker>
        </el-form-item> -->
      </div>
      <div class="el-form-row">
        <!-- <el-form-item label="本人用工起始:" prop="d_begin_work">
          <el-date-picker
            v-model="formData.d_begin_work"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
      </div>
      <div class="el-form-row">
        <!-- <el-form-item label="进单位时间:" prop="d_join_company">
          <el-date-picker
            v-model="formData.d_join_company"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item label="本单位用工起始:" prop="d_begin_company_word">
          <el-date-picker
            v-model="formData.d_begin_company_word"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
      </div>
    </el-form>
  </div>
</template>
<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
import {byIdCardGettingInfo, checkCard} from '@/utils/verificationIDcard'
import { getVehicleAge } from '@/utils/index'
export default {
  components: {
    getDepartmentSelect,
    getPositionList
  },
  props: {
    showCollapse:{
      type: String,
      default: 'first' // first普通员工 second驾驶员
    },
    curChangeType:{
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      positionOptions:[], //岗位
      departmentList:[], //部门
      lineOptions:[], //路线
      vehOptions: [], //车辆
      sexOptions:[ //工种属性
        { value: "男", name: "男" },
        { value: "女", name: "女" },
      ],
      typeWorkProperties:[ //工种属性
        { value: "管理人员", name: "管理人员" },
        { value: "其他", name: "其他" },
      ],
      staffStatusOptions:[ //状态
        // { value: "正式", name: "正式" },
        // { value: "借用", name: "借用" },
        // { value: "停薪留职", name: "停薪留职" },
        // { value: "长假", name: "长假" },
        // { value: "内退", name: "内退" },

        { value: 1, name: "在编在岗" },
        { value: 2, name: "在编不在岗" },
      ],
      employmentFormOptions: [ //用工形式
        // { value: "全日制", name: "全日制" },
        // { value: "全日制外地就业", name: "全日制外地就业" },
        // { value: "方正派遣工", name: "方正派遣工" },
        // { value: "汇才派遣工", name: "汇才派遣工" },
        // { value: "返聘", name: "返聘" },

        { value: "集团编制", name: "集团编制" },
        { value: "劳务派遣", name: "劳务派遣" },
      ],
      department_id:[],
      date:[], //劳务合同始和终时间
      formData: {
        c_name: '',
        c_worker_id: '',
        i_job_level: '',
        position_id: [],
        c_photo:'',//回显地址
        
        department:[], //主部门
        sub_orgs: [], //副部门
        i_line_id: '', //路线ID
        i_vehicle_id: '', //车辆ID

        d_birthday: '',
        c_gender: '男',
        c_idcord: '',
        c_phone: '',
        c_work_kind: '',

        labor_contract_time: [], //劳务合同时间

        c_employee_type: '',

        d_contract: '', //劳务合同到期时间

        i_job_state: '',
        d_begin_work: '',
        d_join_company: '',
        d_begin_company_word: '',
        age: '',
        i_job_level: '',
        rank: '',
        join_company_age: ''
      },
      positionName:'驾驶员',
      rules: {
        c_name: [{
          required: true,
          message: '请输入员工姓名',
          trigger: 'change'
        }],
        // i_job_level: [{
        //   required: true,
        //   message: '请选择岗位级别',
        //   trigger: 'change'
        // }],
        department: [{
          required: true,
          message: '请选择主部门',
          trigger: 'change'
        }],
        
        c_phone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'change'
        }],
        // d_birthday: [{
        //   required: true,
        //   message: '请选择出生日期',
        //   trigger: 'change'
        // }],
        // d_join_company: [{
        //   required: true,
        //   message: '请选择进单位时间',
        //   trigger: 'change'
        // }],
        // c_employee_type: [{
        //   required: true,
        //   message: '请选择用工形式',
        //   trigger: 'change'
        // }],
        // i_job_state: [{
        //   required: true,
        //   message: '请选择状态',
        //   trigger: 'change'
        // }],
      },
      staffAge:'0', //员工年龄
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      dept_id: '',
      rankList: [],
      levelList: [],
      postitionList: [],
    }
  },
  computed: {},
  watch: {
    showCollapse() {
      // if(this.showCollapse == 'second') {
      //   alert(111)
      //   this.formData.position_id = 999999
      // }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      // let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      // let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      // let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      // this.form.borrow_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
      this.formData.d_birthday =  Y + '-' + M + '-' + D
      this.formData.d_join_company = Y + '-' + M + '-' + D
      this.getDivisionAge(this.formData.d_join_company)
      this.selectedBirthday(this.formData.d_birthday)
    },
    // 初始化数据
    resetData(){ 
      // 清空部门选中
      this.$refs.baseTree.onClear()
      if(this.showCollapse == 'first') {
        this.$refs.departmentTree.onClear()
      }
      this.$refs['formData'].resetFields();
      this.formData.c_photo = '';
    },
    // 主部门选择
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        nodes.forEach((item, index) => {
          delete item.children;
        });
        this.formData.department =  nodes;
        this.dept_id = nodes[0].parent_id === 0 ? "" : nodes[0].i_id.toString()
      } else{
        this.formData.department = []
      }
      // setTimeout(() => {
        // this.$refs.positionList.loadData()
        // this.get_position_post()
        // this.formData.position_id = []
        // this.formData.i_job_level = ''
        // this.formData.rank = ''
      // }, 100);
    },

     // 获取职位_职务_职级
    get_position_post() {
      this.postitionList = []
      let parmas = {
        dept_id: this.dept_id
      };
      this.$client.getSysPositionList(parmas)
        .then(res => {
          if (res.head.result == "200") {
              this.postitionList = res.context.list
              this.changePosition(this.postitionList)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
            this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },

    // 副部门选择
    onSubOrgsSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        nodes.forEach((item, index) => {
          delete item.children;
        });
        this.formData.sub_orgs = nodes;
      }
    },
    // 改变职位
    changePosition(val) {
      this.levelList = []
      this.rankList = []
      if (val.length > 0) {
        val.forEach(item => {
          if (item.rank_name) {
            let rank_name = item.rank_name.split(",")
            let show_rank_name = item.show_rank_name.split(",")
            rank_name.forEach((ele,index) => {
              let obj = {
                value: Number(rank_name[index]),
                label: show_rank_name[index]
              }
              this.rankList.push(obj)
            })
          }
          if (item.postition_name) {
            let postition_name = item.postition_name.split(",")
            let show_postition_name = item.show_postition_name.split(",")
            postition_name.forEach((ele,index) => {
              let obj = {
                value: Number(postition_name[index]),
                label: show_postition_name[index]
              }
              this.levelList.push(obj)
            })
          }
        })
        this.rankList = this.unique(this.rankList)
        this.levelList = this.unique(this.levelList)
      }
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.value, item);
      }
      return [...map.values()];
    },
    // 计算司龄
    getDivisionAge(val){
      this.formData.join_company_age = getVehicleAge(val)
      this.$emit('set-join-time',val)
    },
    // 设置身份证号
    setDrivingLicence(val) {
      // this.formData.c_driving_licence = val
    },
    // 获取出生年月日
    checkIdCardIsUses(val) {
      if(checkCard(val)){
        this.formData.d_birthday = byIdCardGettingInfo(val,'birthday')
        this.selectedBirthday(this.formData.d_birthday)
      }
    },
    // 更改员工姓名
    changeName(vaule) {
      this.$emit('change-personal-name',vaule, 'base')
    },
    // 更改员工工号
    changeWorkerId(vaule) {
      // alert(vaule)
      this.$emit('change-worker-id',vaule, 'base')
    },

    // 选择
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.formData.labor_contract_time = this.date[0];
        this.formData.labor_contract_time = this.date[1];
      }else{
        this.formData.labor_contract_time = '';
        this.formData.labor_contract_time = '';
      }
    },
    //选择出生日期 
    selectedBirthday(val) {
      console.log(val);
      let pamras = {
        birth_day: val
      }
      this.$client.getRelatedAge(pamras)
      .then(res => {
        // console.log(res)
        if(res.head.result == '200') {
          // this.staffAge = res.context;
          this.formData.age = res.context;
          // this.$emit('send-get-staff-age', this.staffAge)
        }else{
          this.$message({type: 'error', message: '获取年龄失败'})
        }
      })
    },
    // 数据回显
    setData(val){
      // this.dept_id = val.department[0].i_id
      // this.get_position_post()

      Object.keys(val).forEach(key => {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
        }
      })
        // this.formData.c_name = val.c_name
        // this.formData.c_worker_id = val.c_worker_id
        // this.formData.position_id = val.position_id
        // this.formData.c_photo = val.c_photo
        // this.formData.department =  val.department //部门回显
        // this.$refs.baseTree.setCurrentKey([this.formData.department]);
        if(this.formData.department && this.formData.department.length > 0) {
          this.$refs.baseTree.departmentCheck(this.formData.department); 
        }
        
        if(this.showCollapse == 'first') {
          this.formData.sub_orgs = val.sub_orgs;
          this.formData.sub_orgs_ids = []
          if(!!this.formData.sub_orgs && this.formData.sub_orgs.length > 0) {
            val.sub_orgs.forEach(item => {
              this.formData.sub_orgs_ids.push(item.i_id)
            })
            // setTimeout(() => {
            //   this.$refs.departmentTree.departmentCheck(this.formData.sub_orgs);
            // }, 60);
          }
          this.$refs.departmentTree.setCheckedKeys(this.formData.sub_orgs);
        }
      // this.formData.i_line_id =  val.i_line_id
      // this.formData.i_vehicle_id = val.i_vehicle_id
      this.formData.i_job_level = val.i_job_level ? val.i_job_level : ''
      // this.formData.d_birthday =  val.d_birthday
      // this.formData.c_gender = val.c_gender
      // this.formData.c_idcord = val.c_idcord
      // this.formData.c_phone = val.c_phone
      // this.formData.c_work_kind = val.c_work_kind
      // this.formData.labor_contract_time= val.labor_contract_time
      // this.formData.c_employee_type = val.c_employee_type
      // this.formData.d_contract = val.d_contract
      // this.formData.i_job_state = val.i_job_state
      // this.formData.d_begin_work = val.d_begin_work
      // this.formData.d_join_company = val.d_join_company
      // this.formData.d_begin_company_word = val.d_begin_company_word
      // this.formData.i_job_level = val.i_job_level
      // this.formData.rank = val.rank

    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '带星号为必填项'
            })
            return
          }
          resolve({ 
            formData: this.formData,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
     // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPicture(params,'/api/ERPWeb/EmployeeManage/UploadPicture')
        .then(res => {
          if(res.head.result == '200') {
            this.formData.c_photo = res.context;
            // this.$emit("on-add-img", full_path);
            this.$message({
              showClose: true, 
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      };
      input.click();

      // 把文件放入 FormData 进行提交
      // this.imageUrl = URL.createObjectURL(file.raw);
      // const param = new FormData()
      // param.append('files', file.file)
      // uploadFile(param).then(response => {
      // // TODO 一些关闭弹框，上传成功提示等
      // })
    },
    deleteImage() {
      if(this.curChangeType == 'detail') {
        return
      }
      this.formData.c_photo = '';
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-form-row-first {
  width: 100%;
  display: flex;
  flex-direction: row;
  // align-items: center;

  .el-form-row-first-left {
    width: 45%;
    height: 145px;
    display: flex;
    flex-direction: column;
    padding-top:15px;
  }

  .el-form-row-first-right {
    width: 250px;
    height: 200px;
    // background red
    margin-left: 16%;
    margin-bottom: 30px;
    display: flex;
    >span{
      white-space: nowrap;
      margin-right: 20px;
      margin-top: 10px;
      font-size: 14px;
      color: #606266;
      font-weight bold
    }

    .avatar-uploader {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      background: url('../../../../../assets/veh_svg/uploader-icon.svg') no-repeat center;
      // border: 2px solid #eee;
      background-size: 100% 100%;
      overflow: hidden;
      object-fit: cover !important;
      
      .avatar-box-content{
        position: relative;
        width: 100%;
        height: 100%;
        .avatar {
          display: block;
          width: 200px;
          height: 160px;
        }
        .delete-icon{
          position: absolute;
          font-size: 22px;
          top: 3px;
          right: 3px;
          color: #409EFF;
          font-weight: 700;
        }
        .delete-icon:hover{
          transform: scale(1.2);
        }
        .no-show-delete-icon{
          display: none;
        }
      }
      

      // .el-upload {
      //   width: 100% !important;
      //   height: 100% !important;
      //   overflow: hidden !important;
      //   object-fit: cover !important;

      // }
    }

    .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-item {
    width: 45%;
    margin-right: 5%;

    .el-form-item__label {
      white-space: nowrap;
    }
  }
}

.base-info /deep/ .el-input{
  width: 220px;
}

.base-info /deep/ .el-date-editor--daterange{
  width: 220px;
}
.base-info /deep/ .el-range-separator {
  width: 10%;
}
</style>

<style scoped>
.el-form-row-first-right /deep/ .have-avatar-active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.div{
  /* background: url("../../../../../src/assets/veh_svg/uploader-icon.svg") no-repeat center;
  object-fit: cover;
  background: url("../../../../../assets/veh_svg/uploader-icon.svg"); */
}
</style>
