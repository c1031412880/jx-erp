<template>
  <div
    class="base-info"
    :style="`height:${
      curChangeType == 'detail' ? '470' : '400'
    }px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="130px"
    >
      <div class="show-flex-box-r">
        <el-form-item label="车辆自编号:" prop="vehicle_id">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
            v-model="formData.vehicle_id"
            @on-change="(ehs, nodes) => onSelectChange(ehs, nodes, 'edit')"
            :isExportMultiple="false"
            :width="'220'"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || isAccidentCorrelation || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="车牌号:" prop="vehicle_id">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            v-model="formData.vehicle_id"
            @on-change="(ehs, nodes) => onSelectChange(ehs, nodes, 'edit')"
            :isExportMultiple="false"
            :width="'220'"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || isAccidentCorrelation || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          >
          </get-vehicle-select-tree>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="所属组织:">
          <el-input
            ref="tree"
            v-model="form.dept_id"
            :width="'420'"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            :placeholder="'请选择所属组织'"
            :isContainEmp="false"
            clearable
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆型号:">
          <el-input
            v-model="form.cid"
            placeholder="请输入车辆型号"
            clearable
            :width="'420'"
            disabled
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="报修类别:" prop="type_child">
          <get-select-dictionaries
            v-if="curChangeType != 'addtrue' && !!dialogBool"
            v-model="formData.type_child"
            :classKey="'报修类别'"
            :placeholder="'请选择'"
            :isShowDefaultValue="true"
            @change="onChangeSelectType"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || !this.formData.vehicle_id || curChangeType == 'addtrue'"
          ></get-select-dictionaries>
          <el-input
            v-model="formData.type_child_name"
            :width="'420'"
            disabled
            v-else>
          </el-input>
        </el-form-item>
        <el-form-item label="报修人:" prop="repair_user_id">
          <!-- <get-driver-select-tree
              ref="driverTree1"
              v-model="formData.repair_user_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择报修人'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'||curChangeType=='checkout'"
            ></get-driver-select-tree> -->
          <get-user-select
            ref="driverTree1"
            v-if="!!dialogBool"
            v-model="formData.repair_user_id"
            :width="'390'"
            :isShowCheckbox="false"
            :placeholder="'请选择报修人'"
            :isExportMultiple="false"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          >
          </get-user-select>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="报修时间:" prop="repair_time">
          <el-date-picker
            v-model="formData.repair_time"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getDriverByCarId"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报修地点:" prop="repair_address"  v-if="
              formData.type_child == '959685' || formData.type_child == '959686'
            ">
          <el-input
            v-model="formData.repair_address"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
            placeholder="请输入维修车间"
            @change="onChangeAddress"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="报修地点:" prop="repair_address_id" v-else>
          <getmaintaindep
            ref="getmaintaindep"
            v-model="formData.repair_address_id"
            placeholder="请选择维修车间"
            :init="curChangeType == 'addtrue' || curChangeType == 'add'"
            @on-change="selectedMaintaindep"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          ></getmaintaindep>
        </el-form-item>

      </div>
      <div class="show-flex-box-r">
        <el-form-item label="驾驶员:" prop="driver_id">
          <get-driver-select-tree
            ref="driverTree"
            v-model="formData.driver_id"
            :width="'390'"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="是否拖车:">
          <el-checkbox
            :true-label="2"
            :false-label="1"
            v-model="formData.is_trailer"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          ></el-checkbox>
        </el-form-item>
        <!-- <el-form-item label="关联施救车派工单:">
          <el-input v-model="formData.rescue_flow_code" @focus="innerVisible=true" placeholder="请选择施救车派工单" :disabled="curChangeType == 'detail' || curChangeType == 'checkout'"></el-input>
        </el-form-item> -->
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="报修描述:" prop="repair_describe">
          <el-input
            type="textarea"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入详细报修描述"
            v-model="formData.repair_describe"
          ></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="图片上传:">
          <el-upload
            action="#"
            :limit="4"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :file-list="imgs"
            :http-request="handlePreview"
            :on-change="handlePreview"
            list-type="picture-card"
            :on-remove="handleRemove"
            :disabled="curChangeType == 'detail' || curChangeType == 'checkout' || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>说明：可上传维修前车辆照片,最多上传4张</p>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </div>
      <div v-if="formData.type_child == 959687 || formData.type_child == 959688 && curChangeType != 'addtrue'">
        <div class="show-flex-box-r">       
          <el-form-item label="关联保养计划:">
            <el-select 
              v-model="info.id" 
              clearable 
              :disabled="curChangeType == 'detail' || curChangeType == 'checkout'"
              @change="onChangePlan"
              placeholder="请选择关联保养计划">
              <el-option
              v-for="item in planList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保养计划日期:">
            <el-input
              v-model="info.plan_date"
              :width="'420'"
              disabled>
            </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">       
          <el-form-item label="保养类型:">
            <el-input
              v-model="info.upkeep_type_name"
              :width="'420'"
              disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="修理工:">
            <el-input
              v-model="info.repair_person_names"
              :width="'420'"
              disabled>
            </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">       
          <el-form-item label="最近保养日期:">
            <el-input
              v-model="info.last_keep_time"
              :width="'420'"
              disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="保养周期里程:">
            <el-input
              v-model="info.time_mile"
              :width="'420'"
              disabled>
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div v-if="curChangeType == 'addtrue' || formData.type == '2'">
        <div class="show-flex-box-r">
          <el-form-item label="关联事故编号:" prop="accident_id">
            <el-select
              v-model="formData.accident_id"
              placeholder="请选择"
              @change="SelectChange"
              clearable
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout' || isAccidentCorrelation || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
            >
              <el-option
                v-for="item in dataList"
                :key="item.i_id"
                :label="item.vehicle_number+ '(' + item.d_accident_date + ')'"
                :value="item.i_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              size="mini" 
              icon="el-icon-view"
              @click="checkAccidentDetail"
              v-if="formData.accident_id"
            >事故详情</el-button>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="事故责任:" prop="">
            <el-input
              v-model="changeList.accident_duty"
              :width="'420'"
              disabled
            >
            </el-input>
          </el-form-item>
          <el-form-item label="定损金额:">
            <el-input v-model="changeList.n_actual_fee" :width="'420'" :disabled="isAccidentCorrelation || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)">
            </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="车辆受损情况:" prop="">
            <el-input
              type="textarea"
              :disabled="isAccidentCorrelation || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)"
              v-model="changeList.c_describe"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入详细车辆受损情况"
            ></el-input>
            <!-- <p v-if="!isAccidentCorrelation">说明：事故具体情况可前往安全管理-事故管理中查看</p> -->
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="事故日期:">
            <el-input
              v-model="changeList.d_accident_date"
              :width="'420'"
              disabled
            >
            </el-input>
          </el-form-item>
          <el-form-item label="事故经办人:">
            <get-department-select
              ref="personalTree"
              v-model="changeList.i_result_person"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择事故经办人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="true"
            ></get-department-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <tr-dialog
      :visible="innerVisible"
      :width="'80%'"
      @before-close="dialogClose"
      :title="'关联施救车派工单'"
      :appendToBody="true">
      <rescueVeh ref="rescueVeh" :isRelevance="isRelevance"></rescueVeh>
      <span>
        <el-button type="primary" size="mini" @click="selectRescue">添加</el-button>
        <el-button type="primary" size="mini"  @click="innerVisible=false">取消</el-button>
      </span>
    </tr-dialog>

    <add-dialog
      ref="addDialog"
      :dialogBool.sync="addDialogShow"
      :curChangeType="'detail'"
      :appendToBody="true"
    ></add-dialog>
  </div>
</template>
<script>
import { getUser } from "@/utils/auth";
import { formatDateTime, computeDate } from "@/utils/index";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import rescueVeh from "@/view/maintenance-management/rescue-vehicle-dispatch"
import addDialog from "@/view/safe-manage/accident-manage/component/dialog/add-dialog"
export default {
  components: {
    rescueVeh,
    getCarcodeSelectTree,
    getDepartmentSelect,
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
    getSelectDictionaries,
    getUserSelect,
    getmaintaindep,
    addDialog,
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
    isAccidentCorrelation:{
      type: Boolean,
      default: false
    },
    dialogBool:Boolean,
    isAccidentDetail:{
      type: Boolean,
      default: false
    },
    isCheckout:{
      type: Boolean,
      default: false
    },
    isAccidentEdit:{
      type: Boolean,
      default: false
    },
    isRelevance:{
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      repairAddressList: [],
      imgs: [],
      dataList: [],
      info: {
        id: '',
        plan_name: '',
        plan_date: '',
        upkeep_type_name: '',
        repair_person_names: '',
        last_keep_time: '',
        time_mile: '',
      },
      planList: [], // 关联保养计划列表
      planData: [],
      form: {
        cid: "",
        dept_id: "",
      },
      changeList: {
        c_accident_code: "",
        d_accident_date: "",
        accident_duty: "",
        n_actual_fee: "",
        c_describe: "",
        i_result_person: [],
      },
      dialogImageUrl: "",
      dialogVisible: false,
      formData: {
        accident_id: "",
        repair_time: "",
        repair_address: "",
        repair_address_id: "",
        type: 1,  //报修类别(1普通报修2事故报修3外修)
        type_child: "",
        type_child_name:"事故",
        repair_describe: "",
        checked: false,
        vehicle_id: "",
        driver_id: "",
        is_trailer: "1",
        accident_reasons: "",
        imgs: [],
        repair_user_id: "",
        plan_id: '',
        rescue_flow_id: '',
        rescue_flow_code: '',
      },
      veh_typeOptions: [],

      rules: {
        vehicle_id: [
          {
            required: true,
            message: "请填写",
            trigger: "change",
          },
        ],
        // accident_id:[
        //   {
        //     required: true,
        //     message: "请填写",
        //     trigger: "change",
        //   }  
        // ],
        repair_user_id: [
          {
            required: true,
            message: "请选择报修人",
            trigger: "change",
          },
        ],
        repair_time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
        type_child: [
          {
            required: true,
            message: "报修类别",
            trigger: "change",
          },
        ],
        repair_address: [
          {
            required: true,
            message: "请选择报修地点",
            trigger: "change",
          },
        ],
        i_accident_category: [
          {
            required: true,
            message: "请选择事故类别",
            trigger: "change",
          },
        ],
        accident_reasons: [
          {
            required: true,
            message: "请选择事故原因",
            trigger: "change",
          },
        ],
        // driver_id: [
        //   {
        //     required: true,
        //     message: "请选择驾驶员",
        //     trigger: "change",
        //   },
        // ],
        repair_describe: [
          {
            required: true,
            message: "请填写报修描述",
            trigger: "change",
          },
        ],
      },
      innerVisible: false,
      addDialogShow: false,
    };
  },
  watch: {
    dialogBool() {
      // 设置报修人和报修时间
      if( this.dialogBool && (this.curChangeType == 'addtrue' || this.curChangeType == 'add')) {
        this.configData();
        this.reqAccidentRedcord([])
      }

    }
  },
  mounted() {
    this.getVehType();
    // 第一次watch不执行
    if( this.dialogBool && (this.curChangeType == 'addtrue' || this.curChangeType == 'add')) {
      this.configData();
      this.reqAccidentRedcord([])
    }
  },
  methods: {
    // 设置报修人和报修时间
    configData() {
      let userInfo = JSON.parse(getUser());
      this.formData.repair_user_id = Number(userInfo.user_id)
      this.formData.repair_time = formatDateTime(new Date())
    },
    // 获取车辆型号列表
    getVehType() {
      this.$client.GetCarModelVehicleManager({}).then((req) => {
        this.veh_typeOptions = [];
        if (req.head.result === "200") {
          this.veh_typeOptions = req.context.list;
        }
      });
    },
    // 获取事故记录
    reqAccidentRedcord(i_vehicle_id,accident_id) {
      this.$client.getAccidentRecordList({
        page_index: 1,
        page_size: 9999,
        i_vehicle_id: i_vehicle_id
      }).then((res) => {
        if (res.head.result == "200") {
          this.dataList = res.context.list;
          if(i_vehicle_id.length > 0 && this.dataList.length > 0) {
            let info = this.dataList.filter(
              (dataLists) => dataLists.i_id == accident_id
            );
            this.changeList = {...info[0]};
            this.reqDamageRecordList(accident_id)
          }
        }
      }).catch(err => {});
    },
    
    // 关联事故
    SelectChange(data, key) {
      this.changeList = this.dataList.filter(
        (dataLists) => dataLists.i_id == data
      );
      this.changeList = this.changeList[0];

      if(!!data && this.curChangeType == 'addtrue') {
        this.reqDamageRecordList(data)
      }
    },
     // 获取车损记录 然后获取定损金额和车辆受损情况
    reqDamageRecordList(id) {
      this.changeList.n_actual_fee = ''
      this.changeList.c_describe = ''
      let parmas = {
        i_id: id
      }
      this.$client.getDamageRecordList(parmas)
        .then(res => {
          if (res.head.result == "200") {
            let list = res.context.list;
            if(!!list && list.length > 0) {
              list.forEach(element => {
                if(element.i_type == 2) {
                  this.changeList.n_actual_fee = element.n_actual_fee || ''
                  this.changeList.c_describe = element.c_describe || ''
                }
              });
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    // 车辆选择
    onSelectChange(vehs, nodes, type) {
      if(this.curChangeType == "detail") {
        return false;
      }
      this.dataList=[]
      if(this.changeList){
        this.changeList.accident_duty = ''
        this.changeList.n_actual_fee  = ''
        this.changeList.c_describe  = ''
        this.changeList.d_accident_date = ''
        this.changeList.i_result_person = ''
        if(this.curChangeType == 'addtrue') {
          this.$refs.personalTree.onClear();
        }
      }
      if (!!vehs &&  vehs.length > 0) {
        this.onChangeSelectType()
        this.form.dept_id = "";
        this.form.cid = "";
        if(!this.isAccidentCorrelation) {
          this.$client.getAccidentRecordList({
            page_index: 1,
            page_size: 9999,
            i_vehicle_id: vehs,
          }).then((res) => {
            if (res.head.result == "200") {
              this.dataList = res.context.list;
            }
          }).catch(err => {});
        }
      }
      // 编辑和详情需要加一层锁
      if (this.curChangeType != "add") {
        if (type === 'edit' && vehs && vehs.length > 0) {
          this.getDriverByCarId(vehs[0])
          this.setVehicelInfo(vehs[0])
        }
      } else {
        if (vehs && vehs.length > 0) {
          this.getDriverByCarId(vehs[0])
          this.setVehicelInfo(vehs[0])
        }
      }
    },
    // 获取车辆信息
    setVehicelInfo(id) {
      this.$client.getCarinfo({ id: id }).then((res) => {
        if (res.head.result == "200") {
          if (res.context.list) {
            let carInfo = res.context.list[0];
            this.form.dept_id = carInfo.group_name;
            this.form.cid = carInfo.name;
            this.$refs.getmaintaindep.setAttributeNode(carInfo.group_name)
          }
        }
      }).catch(err => {});
    },
    // 获取当前车辆驾驶员
    getDriverByCarId(id) {
      if(!this.formData.vehicle_id || !this.formData.repair_time) {
        return false
      }
      this.formData.driver_id = ''
      this.$refs.driverTree.onClear()
      let params = {
        strsvr: '111.1.29.14',
        veh_id: id,
        bgt: computeDate(this.formData.repair_time, 'minus', 0, 0, 10, 0),
        edt: computeDate(this.formData.repair_time, 'add', 0, 0, 10, 0)
      }
      this.$dispatch
        .GetWorkDriverDriverService(params)
        .then((res) => {
          if (res.status == "200") {
            this.formData.driver_id = res.content ? res.content.union_id : ""
          } else {
            // this.$message({
            //   type: "error",
            //   message: res.describe,
            //   showClose: true,
            // });
          }
        }).catch((err) => {console.log(err)});
    },
    // 报修类别选择
    onChangeSelectType() {
      this.planList = []
      this.planData = []
      Object.assign(this.$data.info, this.$options.data().info)
      if(this.formData.type_child == 959687 || this.formData.type_child == 959688) {
        let upkeep_type = this.formData.type_child == 959687 ? 1 : 2
        let year = this.formData.repair_time.slice(0, 4)
        let month = this.formData.repair_time.slice(5, 7)
        let days = new Date(year, month, 0).getDate()
        let time = this.formData.repair_time.slice(0, 7)
        let vehicle_id = [ this.formData.vehicle_id ]
        let params = {
          start: time + '-01',
          end: time + '-' + days + ' 23:59:59',
          upkeep_type: upkeep_type,
          state: 3,
          vehicle_ids: vehicle_id,
          date_type: 1,
        }
        this.$client.getUpkeepPlan(params).then(res => {
          if(res.head.result === '200') {
            this.planData = res.context.list
            this.planData.forEach(item => {
              this.planList.push({
                id: item.id,
                label: item.lp_num + ' ' + '(' + item.plan_date + ')'
              })
              if(!!item && item.plan_date) {
                let time1 = this.formData.repair_time.slice(0, 10).toString()
                let time2 = item.plan_date.slice(0, 10).toString()
                if(time1 == time2) {
                  if(!!this.formData.plan_id) {
                    this.info.id = item.id
                    this.onChangePlan(item.id)
                  }
                }
              }
            })
          }
        }).catch((err) => {});
      }
    },
    // 关联保养计划
    onChangePlan(id) {
      const filterObj = this.planData.filter((item) => {
        if (item.id == id) {
          return item;
        }
      });
      if(filterObj.length) {
        for(let k in this.info) {
          this.info[k] = filterObj[0][k]      
        }
        this.info.last_keep_time = this.formData.type_child == 959687 ? filterObj[0].last_keep_time : filterObj[0].last_keep_time2
        this.info.plan_name = filterObj[0].lp_num + ' ' + '(' + filterObj[0].plan_date + ')'
      }else {
        Object.assign(this.$data.info, this.$options.data().info)
      }
    },
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.form.dept_id = "";
      this.form.cid = "";
      this.formData.vehicle_id = "";
      this.formData.type_child = "";
      this.formData.type = 1;
      this.formData.driver_id = "";
      this.formData.is_trailer = "1";
      this.formData.imgs = [];
      this.imgs = [];
      this.formData.repair_describe = "";
      this.formData.repair_address = "";
      this.formData.repair_address_id = "";
      this.formData.accident_id = "";
      this.$refs.carcodeTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs.driverTree.onClear();
      if(this.curChangeType == 'addtrue') {
        this.$refs.personalTree.onClear();
      }
      if (this.curChangeType != "add" && this.curChangeType != "addtrue") {
        this.$refs.driverTree1.onClear();
        this.formData.repair_time = "";
      } else {
        setTimeout(() => {
          let userInfo = JSON.parse(getUser());
          this.formData.repair_user_id = Number(userInfo.user_id);
          this.formData.repair_time = formatDateTime(new Date());
        }, 60);
      }
      this.$refs["formData"].resetFields();
      this.changeList.d_accident_date = "";
      this.changeList.accident_duty = "";
      this.changeList.actual_fee = "";
      this.changeList.n_actual_fee ="";
      this.changeList.c_describe = "";
      this.changeList.i_result_person = "";
      this.formData.rescue_flow_id = "";
      this.formData.rescue_flow_code = "";
      this.dataList = [];
    },
    // 数据回显
    setData(info) {
      let val = JSON.parse(JSON.stringify(info))
      this.formData.id = val.id;
      this.formData.vehicle_id = val.vehicle_id;
      this.formData.type_child = val.type_child;
      if (val.type == 2) {
        this.formData.type_child = -1
        this.formData.accident_id = val.accident_id;
      }
      this.formData.repair_user_id = val.repair_user_id;
      this.formData.type = val.type;
      this.formData.driver_id = val.driver_id;
      this.imgs = val.imgs && val.imgs.length?  val.imgs.map((e, i) => {
        return { name: i, url: e };
      }) : [];
      this.formData.imgs = val.imgs;
      this.formData.repair_describe = val.repair_describe;
      this.formData.repair_address = val.repair_address;
      this.formData.repair_address_id = val.repair_address_id;
      this.formData.repair_time = val.repair_time;
      this.formData.is_trailer = val.is_trailer;
      this.formData.plan_id = val.plan_id;
      this.form.dept_id = val.vehicle_info.department_name;
      this.form.cid = val.vehicle_info.vehicle_kind_name;
      if (val.type == 2) {
        this.reqAccidentRedcord([val.vehicle_id], val.accident_id)
      };
      this.changeList.i_result_person = val.i_result_person || ''
      this.changeList.n_actual_fee = val.n_actual_fee || ''
      this.changeList.c_describe = val.c_describe || ''
      this.formData.rescue_flow_id = val.rescue_flow_id || ''
      this.formData.rescue_flow_code = val.rescue_flow_code || ''
      if(val.plan_id) {
        setTimeout(() => {         
          this.info.id = val.plan_id
          this.onChangePlan(val.plan_id)
        }, 1500);
      }
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      })
    },
    // 给父级页面提供得获取本页数据
    getData() {
      if(this.curChangeType == 'add' || !this.isAccidentEdit) {
        delete this.formData.id
      }
      this.formData.plan_id = this.info.id
      if (this.curChangeType == "addtrue") {
        this.formData.type = 2;
        this.formData.type_child = -1;
        // if(this.formData.accident_id ==null||this.formData.accident_id ==''){
        //    this.$message({
        //     showClose: true,
        //     message: "请选择事故编号",
        //     type: "error",
        //   });
        //   return
        // }
      }
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          let info ={...{},...this.formData}
          delete info.type_child_name
          info.n_actual_fee = this.changeList.n_actual_fee
          info.c_describe  = this.changeList.c_describe
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项",
            });
            return;
          }
          resolve({
            formData: info,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    // 打开关联施救车派工单
    dialogClose() {
      this.innerVisible = false
    },
    // 保存关联施救车
    selectRescue() {
      this.formData.rescue_flow_code = this.$refs.rescueVeh.info.flow_code ? this.$refs.rescueVeh.info.flow_code : ''
      this.formData.rescue_flow_id = this.$refs.rescueVeh.info.id ? this.$refs.rescueVeh.info.id : ''
      this.innerVisible = false
    },
    // 查看事故详情
    checkAccidentDetail() {
      let info = this.formData.accident_id ? this.dataList.filter(item => item.i_id == this.formData.accident_id)[0] : ''
      if(!info) {
        this.$message.warning('未获取到事故记录')
        return
      }
      this.addDialogShow = true
      setTimeout(() => {
        this.$refs['addDialog'].setData(info);
        this.$refs['addDialog'].activeName =  'first'
      }, 30);
    },
    // 选择维修车间
    selectedMaintaindep(val) {
      if(!!val) {
        this.formData.repair_address_id = val.id
        this.formData.repair_address = val.name
      }
    },
    // 上传图片相关资料
    handlePreview(file) {
      if (this.beforeUpload(file)) {
        this.uploadAccidentDataFiles(file);
      }
    },
    // 判断文件大小
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 20;
      if (isLt1M) {
        return true;
      }
      return false;
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      this.$client.AddrepairspicUpload(params).then((res) => {
        if (res.head.result == "200") {
          this.formData.imgs.push(res.context);
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    //图片删除
    handleRemove(file, fileList) {
      let c = this.formData.imgs.findIndex(function (d) {
        // 测试条件为true时返回当前位置
        return d == file.url;
      });
      this.formData.imgs.splice(c, 1);
    },
    // 图片上传成功
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片超出
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传4张车辆照片`);
    },
    // 修改输入的保修车间
    onChangeAddress(val) {
      console.log(val, '报修类别改变了');
      
      let objList = this.repairAddressList.filter(item => {
        return item.name === val
      })
      this.formData.repair_address_id = !!objList.length ?  objList.id : ''
    },
    // 抛出事故和保养数据（大额维修审批单用）
    getAllInfo() {
      let info = {...this.info, ...this.changeList, ...this.form}
      delete info.id
      return info
    },
    // 车辆型号修改  获取车辆型号的基础信息
    carTypeChange(val) {
      const filterObj = this.veh_typeOptions.filter((item) => {
        if (item.id == val) {
          return item;
        }
      });
      if (filterObj.length != 0) {
        this.formData.product_factory = filterObj[0].factory;
        this.formData.seat_count = filterObj[0].seats_num;
        this.formData.allow_number = filterObj[0].permit_num;
        this.formData.auto_emissions = filterObj[0].displacement;
        this.formData.emission_standards = filterObj[0].standard_name;
        this.formData.fuel_type = filterObj[0].fuel_name;
        this.formData.car_body_color = filterObj[0].color;
        this.formData.car_length = filterObj[0].length;
        this.formData.car_width = filterObj[0].width;
        this.formData.car_height = filterObj[0].height;
        this.formData.wheel_distance = filterObj[0].wheel_space;
        this.formData.wheelbase = filterObj[0].shaft_space;
        this.formData.vehicle_weight = filterObj[0].permit_quality;
        this.formData.all_weight = filterObj[0].total_quality;
        this.formData.coefficient = filterObj[0].index;
      }
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 250px;
}

.base-info /deep/.el-select, .el-select--mini {
  width: 250px;
}

.base-info /deep/ .el-input, .el-input--mini {
  width: 250px;
}

.base-info /deep/ .el-textarea {
  width: 630px;
}
</style>
