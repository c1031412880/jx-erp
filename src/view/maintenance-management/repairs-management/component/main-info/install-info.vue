<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form ref="elForm" :model="formData" size="mini" label-width="129px"  :rules="rules">
      <div >
      <div class="show-flex-box-r">
        <el-form-item label="工单号码：" >
        <p style="width:250px" v-if="formData.work_code">{{formData.work_code}}</p> 
        <p style="width:250px" v-else>未检验</p> 
        </el-form-item>
        <el-form-item label="检验状态:">
          <p v-if="formData.check_state_name">{{formData.check_state_name}}</p>
          <p style="width:250px" v-else>未检验</p> 
        </el-form-item>
      </div>
       <div class="show-flex-box-r">
        <el-form-item label="检验时间:"  prop="check_time" >
         <el-date-picker
            v-model="formData.check_time"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)">
          </el-date-picker>        
        </el-form-item>
        <el-form-item label="优先级:" prop="priority" >
          <el-select v-model="formData.priority" placeholder="请选择" :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
       <div class="show-flex-box-r">
        <el-form-item label="检验人:" prop="check_id"  >
             <!-- <get-driver-select-tree
              ref="driverTree1"
              v-model="formData.check_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择检验人'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-driver-select-tree> -->
            <get-user-select   ref="driverTree1"
              v-model="formData.check_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择检验人'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)">
              </get-user-select>
        </el-form-item>
        <el-form-item label="维修车间:" prop="maint_dept">
          <getmaintaindep 
            ref="getmaintaindep" 
            v-model="formData.maint_dept" 
            :init="false" 
            placeholder="选择维修车间" 
            :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)" 
          ></getmaintaindep>   
          </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="预估金额:" prop="estimate_amount">
          <el-input
            v-model="formData.estimate_amount"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.estimate_amount = $event.target.value"
            :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)"
            @change="changeAmountHandle"
          ></el-input>
        </el-form-item>
        <el-form-item label="大额维修申请:" v-show="limit_repair_flow_code">
          <!-- <span>{{limit_repair_flow_code}}</span> -->
          <el-button type="text" @click="openDispatchHandle(limit_repair_order_id )">{{limit_repair_flow_code}}</el-button>
        </el-form-item>
        <!-- <el-form-item label="大额维修申请:">
          <el-button 
            type="primary"
            :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)"
            @click="initiateApprovalHandel"
          >大额维修申请</el-button>
          <span>{{formData.limit_repair_flow_code}}</span>
        </el-form-item> -->
      </div> 
      <div class="show-flex-box-r" v-show="state_name">
        <el-form-item label="审批状态:">
          <span>{{state_name}}</span>
        </el-form-item>
      </div> 
      <div class="show-flex-box-r">
        <el-form-item label="检验描述:" prop="c_describe">
          <el-input
            type="textarea"
            :disabled="curChangeType=='detail' || (curChangeType == 'addtrue' && isAccidentDetail)"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入详细检验描述"
            v-model="formData.check_describe"
          ></el-input>
        </el-form-item>
      </div> 
      </div>
    </el-form>
    <div
      class="use-table-record show-flex-box-c"
      style="margin:0 20px;"
      v-if="curChangeType != 'add'">
      <span style="font-size: 14px;color: #606266;font-weight: 700; margin-bottom:20px;">故障分类: 
        <el-button type="primary" size="mini" :disabled="curChangeType =='detail' || (curChangeType == 'addtrue' && isAccidentDetail)" @click="showDiaLog()">添加</el-button>
      </span>
      <div class="table">
        <tr-table
          :selectionShow="true"
          :data="selectList"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedList"
          :isFixedEmptyPlaceholder="false">
          <template slot-scope="scope" slot="operation" >
            <el-button type="primary" size="mini" :disabled="curChangeType == 'detail'  || (curChangeType == 'addtrue' && isAccidentDetail)" @click="deleteRow(scope.data,selectList)">移除</el-button>
          </template>
        </tr-table>
      </div>
    </div>
    <el-dialog
      width="80%"
      :visible.sync="innerVisible"
      append-to-body>
      <faultdlg ref="faultdlg" @func="addData" :parentmessage.sync="selectList"></faultdlg>
      <span>
        <p style="font-size: 12px; color: #999; padding-bottom: 10px;">请勾选表格中数据</p>
        <el-button type="primary" size="mini" @click="addDatalist">添加</el-button>
        <el-button type="primary" size="mini"  @click="innerVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <major-maintenance-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      @on-close="closeAddDialog"
    ></major-maintenance-dialog>
  </div>
</template>
<script>
import {getSession, getUser} from '@/utils/auth'
import { formatDateTime } from "@/utils/index";
import majorMaintenanceDialog from "../dialog/major-maintenance-dialog"
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import faultdlg from "@/view/maintenance-management/repairs-management/fault-diagnosis-manage";
import getDepartmentSelect from "@/components/base/formModel/tree/get-dept-emp-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getUserSelect from 'components/base/formModel/tree/get-user-select'
export default {
  components: {majorMaintenanceDialog,getmaintaindep,getVehicleSelectTree,getSelectDictionaries,getDriverSelectTree,getDepartmentSelect,faultdlg,getUserSelect },
  props: {
    curChangeType: {
      type: String,
      default: "add"
    },
    // containerVehicleRecode: [Array] //历史车辆使用记录
    containerVehicleRecode:{
      type:Object 
    },
    isAccidentDetail:{
      type: Boolean,
      default: false
    },
    isCheckout:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      // position1:'',
      innerVisible:false,
      informationDialogShow:false,
      state_name: '',
      limit_repair_flow_code: '',
      limit_repair_order_id : '',
      formData: {
        check_state_name:'',
        check_describe:'',
        maint_dept:'',
        check_id:'',
        check_time:'',
        priority:'',
        repair_id:'',
        work_code:'',
        estimate_amount:'',
        // limit_repair_flow_code:'',
        // container_id: "", //记录ID
        // install_vehicle_id: '',
        // install_date: "",
        // position: "",
        // position1:"",
        // dismantle_date: "",
        // dismantle_reason:"",
        // remark: ""
      },

      rules: {
        check_time: [
          {
            required: true,
            message: "请选择检验时间",
            trigger: "change",
          },
        ],
        maint_dept: [
          {
            required: true,
            message: "请选择维修车间",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "请选择优先级",
            trigger: "change",
          },
        ],
        check_id: [
          {
            required: true,
            message: "请选择检验人",
            trigger: "change",
          },
        ],
        // estimate_amount: [
        //   {
        //     required: true,
        //     message: "请输入预估金额",
        //     trigger: "blur",
        //   },
        // ],
      },
      priorityOptions: [
        //状态
        { value: '1', label: "一般" },
        { value: '2', label: "紧急" },
        { value: '3', label: "非常紧急" },
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "故障分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "故障项目编号",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
         {
          id: 3,
          label: "故障项目",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
          {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        }
      ],
      selectList:[],
      data: [], //历史车辆使用记录
      TableHeight: 350,
      loading: false,
      vehicleName: "",
      status: "container_2", //发动机状态 1使用中 2闲置 3已报废 4 修理中
      curInfo: {},
    };
  },
  computed: {},

  methods: {
    showDiaLog() {
      this.innerVisible=true
      if(!this.selectList && this.selectList.length) {
        setTimeout(() => {
          this.$refs.faultdlg.setSelectTabel(this.selectList)
        }, 100)
      }
    },
    deleteRow(value, rows) {//删除改行
    // console.log(value , rows,'890')
      var i = this.selectList.findIndex(item=>{return item.i_id == value.i_id})
      rows.splice(i, 1);
    },
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item)
      });
      // console.log(this.selectedProjectIds,'11111');
      // this.$emit('func',this.selectedProjectIds)
    },
    addData(data){
      this.selectList = data
      this.formData.fault_ids = this.selectList.map(fault_ids =>fault_ids.i_id)
      // console.log(data,'111')
    },
    addDatalist(){
      this.$refs.faultdlg.sing()
      this.innerVisible=false
    },
    // 修改预估金额
    changeAmountHandle(val) {
      // console.log(val);
    },
    // 发起大额审批单
    initiateApprovalHandel(val) {
      this.informationDialogShow = true
      let info = {...this.curInfo, ...this.formData, ...val}
      info.selectList = JSON.parse(JSON.stringify(this.selectList))
      setTimeout(() => {
        this.$refs.informationDialog.setData(info, this.formData)
      }, 60);
    },
    // 关闭检验弹窗并请求数据
    closeAddDialog() {
      this.$emit('on-close')
    },
    // 打开大额维修审批单
    openDispatchHandle(id) {
      this.closeAddDialog()
      let detail_id = 1660, title = '大额维修审批单'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
    },
    // 初始化数据
    resetData() {
        this.selectList =[]
        this.formData.check_describe=''
        this.formData.maint_dept=''
        this.$refs.driverTree1.onClear();
        this.formData.check_time=''
        this.formData.priority=''
        this.formData.repair_id=''
        this.state_name =''
        this.limit_repair_order_id  =''
        this.limit_repair_flow_code =''
        this.formData.estimate_amount =''
        this.formData.state =''
        if(this.formData.repair_check != null){
          this.formData.check_describe=''
          this.formData.maint_dept=''
          this.formData.check_id=''
          this.formData.check_time=''
          this.formData.priority= ''
          this.formData.work_code= ''
        }
    },
    // 数据回显
    setData(val) {
      this.curInfo = val;
      if(val.check_state != 0){
        this.formData.check_time=val.repair_check.check_time
      }else if(this.curChangeType=="checkout" || (this.curChangeType == 'addtrue' && this.isCheckout)){
        setTimeout(() => {
          let userInfo = JSON.parse(getUser());
          this.formData.check_id = Number(userInfo.user_id)
          this.formData.check_time= formatDateTime(new Date())
          if(val.type_child == '959685' || val.type_child == '959686') {
            this.$refs.getmaintaindep.setAttributeNode(val.vehicle_info.department_name)
          }else {
            this.formData.maint_dept =  val.repair_address_id
          }
        }, 60);
        this.formData.priority = '1'
      }
      this.formData.work_code =val.work_code
      this.formData.check_state_name =val.check_state_name
      this.formData.repair_id = val.id
      
      if(val.repair_check != null){
        this.formData.check_describe = val.repair_check.check_describe
        this.formData.check_id = val.repair_check.check_id
        this.formData.priority = val.repair_check.priority.toString()
        this.state_name = val.repair_check.authorization_state
        this.limit_repair_order_id  = val.repair_check.limit_repair_order_id 
        this.limit_repair_flow_code = val.repair_check.limit_repair_flow_code
        this.formData.estimate_amount = val.repair_check.estimate_amount
        this.formData.maint_dept =  val.repair_check.maint_dept
        if(val.repair_check.repair_faults){
          this.selectList = val.repair_check.repair_faults
          this.selectList = JSON.parse(JSON.stringify(this.selectList).replace(/fault_id/g,"c_code").replace(/fault_name/g,"c_name"))
        }
      }
    },
    // 选择类型给表单赋值
    changeRadio(type) {
      switch (type) {
        case 1:
          this.formData.install_date = "";
          this.$refs.vehicleTree.onClear();
          break;
        case 2:
          this.formData.dismantle_date = "";
          this.formData.dismantle_reason = "";
          this.formData.install_vehicle_id = "";
          this.formData.install_date = "";
          break;
        case 3:
          this.formData.position = "";
          this.formData.install_date = "";
          this.formData.dismantle_date = "";
          this.formData.dismantle_reason = "";
          this.$refs.newVehicleTree.onClear();
          break;
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      if (
        !this.formData.check_time ||
        !this.formData.priority ||
        !this.formData.check_id||
        !this.formData.maint_dept
      ) {
        this.$message({ type: "warning", message: "带星号的为必填项，请填写完整" });
        return;
      }

      if(this.formData.type == 2 && !!this.formData.install_vehicle_id && !this.formData.dismantle_date) {
        this.$message({type: 'warning', message: '请选择拆卸日期'})
        return
      }
      if (this.formData.type == 3) {
        // this.formData.dismantle_date = this.formData.install_date;
        // console.log(this.formData,'ccccc')
      }
      return new Promise((resolve, reject) => {
        this.$refs["elForm"].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项"
            });
            return;
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: "获取成功"
          });
        });
      });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.install-info /deep/ .el-input {
  width: 420px;
}

.install-info /deep/ .el-input--mini {
  width: 420px;
}

.install-info/deep/ .el-date-editor {
  width: 420px;
}
</style>

