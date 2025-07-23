<template>
  <div class="staff-manage">
    <!-- <staff-overview-info
      ref="staffOverviewInfo"
      @open-leave-office-user="openLeaveOfficeUser"
    ></staff-overview-info> -->
    <!-- <el-radio-group ref="elRadioGroup" v-model="showCollapse" style="margin-bottom: 20px;" size="mini">
      <el-radio-button :label="'first'">普通员工</el-radio-button>
      <el-radio-button :label="'second'">驾驶员</el-radio-button>
    </el-radio-group> -->
    <div class="" v-show="showCollapse == 'first'">
      <sub-req-first
        ref="head"
        @on-add="addStaffInfo"
        @on-ok="onSubmit"
        @on-edit="editSatff"
        @on-import="openfiledialog"
        @on-export="exportFile"
        @on-screen="onScreen"
        @delete-select="deleteSelect"
      ></sub-req-first>
      <!-- //高级筛选 -->
      <drawer-dialog
        ref="drawerDialog"
        :drawer.sync="isShowDrawerDialog"
        @on-ok="onSubmit"
      ></drawer-dialog>
      <tr-table
        ref="table"
        :selectionShow="true"
        :data="generalStaffData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading || headerLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
        style="margin-top: 10px"
      >
        <template slot-scope="scope" slot="state_detail_name">
          <div v-if="scope.data.state == 1">
            <div style="color: #d71345">
              <p class="mark" style="background-color: #d71345"></p>
              <span>{{ scope.data.state_detail_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 2">
            <div style="color: #18be6b">
              <p class="mark" style="background-color: #18be6b"></p>
              <span>{{ scope.data.state_detail_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 3">
            <div style="color: #c88400">
              <p class="mark" style="background-color: #c88400"></p>
              <span>{{ scope.data.state_detail_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 4">
            <div style="color: #ffc20e">
              <p class="mark" style="background-color: #ffc20e"></p>
              <span>{{ scope.data.state_detail_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 5">
            <div style="color: #409eff">
              <p class="mark" style="background-color: #409eff"></p>
              <span>{{ scope.data.state_detail_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 7">
            <div style="color: #77787b">
              <p class="mark" style="background-color: #77787b"></p>
              <span>{{ scope.data.state_detail_name }}</span>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="vehicle_number">
          <span v-if="scope.data.vehicle_info == null"></span>
          <el-button v-else type="text" size="mini" @click="jumpVehInfoPage(scope.data)">
            {{ scope.data.vehicle_info.vehicle_number }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="vehicle_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <span v-else>{{ scope.data.vehicle_info.vehicle_name }}</span>
        </template>
        <template slot-scope="scope" slot="department_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <span v-else>{{ scope.data.vehicle_info.department_name }}</span>
        </template>
        <template slot-scope="scope" slot="vehicle_kind_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <span v-else>{{ scope.data.vehicle_info.vehicle_kind_name }}</span>
        </template>
        <template slot-scope="scope" slot="check_time">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.check_time }}</span>
        </template>
        <template slot-scope="scope" slot="check_describe">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.check_describe }}</span>
        </template>
        <template slot-scope="scope" slot="state_child">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.state_child }}</span>
        </template>
        <template slot-scope="scope" slot="total_hours">
          <span v-if="scope.data.repair_items == null"></span>
          <span v-else>{{ scope.data.total_hours }}</span>
        </template>
        <template slot-scope="scope" slot="material_fee">
          <span v-if="scope.data.repair_items == null"></span>
          <span v-else>{{ scope.data.material_fee }}</span>
        </template>
        <template slot="wgd">
          <el-link>打印完工单</el-link>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            v-if="$isPowerShow('detail')"
            @click="staffRowInfo(scope.data, 'detail')"
          >
            详情
          </el-button>
          <!-- <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button> -->
          <!-- <el-button slot="reference" type="danger"  @click="editrepair(scope.data)"  size="mini" style="margin-left: 10px;" :disabled="$isPowerShow('repair')&&scope.data.state!=1">接修</el-button> -->
          <el-button
            type="primary"
            size="mini"
            v-if="$isPowerShow('checkout')"
            @click="showComplete(scope.data, '完工检验')"
            :disabled="scope.data.state != 3"
          >
            检验
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="$isPowerShow('pickup')"
            @click="staffRowInfo(scope.data, 'getCar')"
            :disabled="scope.data.state != 4"
          >
            接车
          </el-button>
        </template>
      </tr-table>
      <el-dialog :title="title" append-to-body :visible.sync="completeDialog" width="50%">
        <el-form size="mini" label-width="115px " v-if="this.state == 3">
          <div class="show-flex-box-r">
            <el-col :span="10">
              <el-form-item label="质检员:" prop="i_height">
                <!-- <get-user-select-tree v-model="form.submit_id" placeholder="选择发起人"></get-user-select-tree> -->
                <get-user-select
                  ref="tree"
                  v-model="finish_id"
                  :width="'390'"
                  :isShowCheckbox="false"
                  :placeholder="'请选择质检员'"
                  :isExportMultiple="false"
                  :disabled="curChangeType == 'detail'"
                ></get-user-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="检验时间:" prop="c_marry">
                <el-date-picker
                  v-model="finish_time"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </div>
          <div class="show-flex-box-r">
            <el-col :span="20">
              <el-form-item label="检验描述:" prop="i_height">
                <el-input
                  v-model="finish_content"
                  type="textarea"
                  placeholder="备注"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
        <el-form size="mini" label-width="115px " v-if="this.state == 4">
          <el-row>
            <el-col :span="24" v-show="this.title === '接车'">
              <el-form-item label=" 接车驾驶员:" prop="i_height">
                <!-- <get-user-select-tree v-model="form.submit_id" placeholder="选择发起人"></get-user-select-tree> -->
                <get-user-select
                  ref="tree"
                  v-model="finish_id"
                  :width="'390'"
                  :isShowCheckbox="false"
                  :placeholder="'请选择接车驾驶员'"
                  :isExportMultiple="false"
                  :disabled="curChangeType == 'detail'"
                ></get-user-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="this.title === '接车'">
              <el-form-item label="出厂时间:" prop="c_marry">
                <el-date-picker
                  v-model="finish_time"
                  type="datetime"
                  placeholder="选择日期"
                  style="width: 100%;"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label=" 分公司验收人:" prop="i_height">
                <get-user-select
                  ref="tree"
                  v-model="check_person_id"
                  :width="'390'"
                  :isShowCheckbox="false"
                  :placeholder="'请选择分公司验收人'"
                  :isExportMultiple="false"
                  :disabled="curChangeType == 'detail'"
                ></get-user-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="意见:" prop="i_height">
                <el-input
                  v-model="finish_content"
                  type="textarea"
                  placeholder="意见"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="this.state == 4" @click="completeDialog = false">取 消</el-button>
          <el-button type="primary" v-if="this.state == 4" @click="pickupComplete">确 定</el-button>
          <el-button type="primary" v-if="this.state == 3" @click="doComplete">检验通过</el-button>
          <el-button type="info" v-if="this.state == 3" @click="noComplete">检验未通过</el-button>
        </span>
      </el-dialog>
      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfoFirst.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfoFirst.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfoFirst.pageCount"
      ></el-pagination>
    </div>

    <div class="dialog-box">
      <!-- 添加普通员工、驾驶员信息 -->
      <add-staff-dialog
        ref="addStaffDialog"
        :dialogBool.sync="addStaffDialogShow"
        :showCollapse="showCollapse"
        :curChangeType="curChangeType"
        :curSelectType="curSelectType"
        @sure-save-staff-info="sureSaveStaffInfo"
        @sure-save-repair-info="addRepairInfo"
        @add-order-Item="addOrderItem"
        @sure-save-complete-info="showComplete"
        @get-car-submit="showComplete"
      ></add-staff-dialog>
      <!-- 添加线路车辆弹窗 -->
      <circuit-allocation-dialog
        ref="circuitAllocationDialog"
        :dialogBool.sync="circuitAllocationDialogShow"
      ></circuit-allocation-dialog>
      <!-- 上传文件 导出文件弹窗组件 -->
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="typeMessage"
      ></file-dialog>
      <!-- 表格自定义组件 -->
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="
          showCollapse == 'first' ? customSettingFirstList : customSettingSecondList
        "
        :canRendererTableHeader="
          showCollapse == 'first' ? canRendererTableHeader : canRendererTableHeaderSecond
        "
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
      <!-- 离职人员弹窗 -->
      <leave-staff-dialog :dialogBool.sync="leaveStaffDialogShow"></leave-staff-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import getUserSelect from 'components/base/formModel/tree/get-user-select'
import {getSession, getUser} from '@/utils/auth'
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
import drawerDialog from "./component/dialog/drawer-dialog";
import staffOverviewInfo from './component/staff-overview-info'
import subReqFirst from './component/sub-req-first'
import subReqSecond from './component/sub-req-second'
import fileDialog from '@/components/fileDialog/file-dialog'
import AddStaffDialog from './component/dialog/add-staff-dialog'
import circuitAllocationDialog from './component/dialog/circuit-allocation-dialog'
import leaveStaffDialog from './component/dialog/leave-staff-dialog'
import { formatDateTime } from "@/utils/index";
export default {
  name: "completion-management",
  components: {
    subReqFirst,subReqSecond,fileDialog,drawerDialog,getUserSelectTree,getDriverSelectTree,getUserSelect,
    staffOverviewInfo,AddStaffDialog,circuitAllocationDialog,leaveStaffDialog
  },
  data() {
    return {
      finish_id:'',
      check_person_id:'',
      finish_time:'',
      finish_content:'',
      completeDialog:false,
      showCollapse: 'first', // first普通员工 second驾驶员
      curChangeType: 'add', //add添加  edit编辑  detail详情
      curSelectType: 'detail', // detail详情  getCar 接车
      typeMessage: '人员',
      pageInfoFirst: { //普通员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      pageInfoSecond: { //驾驶员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      filedialogVisible: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/人员记录模板.xlsx",
      },
      state:'',
      order_id:'',
      form: {},
      firstQueryform: {},
      secondQueryform: {},
      generalStaffData: [], //普通员工列表
      driverData:[], //驾驶员列表
      loading: false,
      loadingSecond: false,
      TableHeight: 500,
      informationDialogShow: false,
      addStaffDialogShow: false, //添加员工信息
      circuitAllocationDialogShow: false, //添加车辆 线路
      leaveStaffDialogShow: false, //离职人员
      isShowDrawerDialog:false,
      customSettingVialogVisible: false,
      tyreFailIds:[],
      customSettingFirstList:[
        {
          id: 1,
          label: "工单号码",
          prop: "work_code",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:true
        },
        {
          id: 2,
          label: "工单状态",
          prop: "state_detail_name",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:true
        },
        {
          id: 3,
          label: "自编号",
          prop: "vehicle_number",
          width: "110",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "车牌号",
          prop: "vehicle_name",
          width: "110",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:true
        },
        {
          id: 6,
          label: "车辆型号",
          prop: "vehicle_kind_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "工单类别",
          prop: "type_child_name",
          width: "120",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "报修时间",
          prop: "repair_time",
          width: "100",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "120",
          align: "center",
          signIndex:8,
          sortable:true
        },
        {
          id: 10,
          label: "优先级",
          prop: "priority_name",
          width: "100",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "检验时间",
          prop: "check_time",
          width: "135",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "检验备注",
          prop: "check_describe",
          width: "140",
          align: "center",
          signIndex:11,
          sortable:true
        },
        {
          id: 13,
          label: "总工时",
          prop: "total_hours",
          width: "150",
          align: "center",
          signIndex:12,
          sortable:false
        },
            {
          id: 14,
          label: "工时费",
          prop: "total_hours_fees",
          width: "90",
          align: "center",
          signIndex:13,
          sortable:false
        },
        {
          id: 15,
          label: "材料费",
          prop: "total_materials",
          width: "90",
          align: "center",
          signIndex:14,
          sortable:false
        },
        {
          id: 16,
          label: "施救费",
          prop: "rescue_cost",
          width: "90",
          align: "center",
          signIndex:15,
          sortable:false
        },
        {
          id: 17,
          label: "实际费用",
          prop: "total_fees",
          width: "90",
          align: "center",
          signIndex:16,
          sortable:false
        },
        {
          id: 18,
          label: "接修时间",
          prop: "receive_time",
          width: "150",
          align: "center",
          signIndex:17,
          sortable:true
        },
        {
          id: 19,
          label: "完工时间",
          prop: "finish_time",
          width: "150",
          align: "center",
          signIndex:18,
          sortable:true
        },
        // {
        //   id: 19,
        //   label: "完工单",
        //   prop: "wgd",
        //   width: "120",
        //   align: "center",
        //   signIndex:18,
        //   sortable:false
        // },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "230",
          align: "center",
          signIndex:19,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      canRendererTableHeaderSecond: null,
      customSettingShowList: null,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false,
      title: '完工检验'
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 更新表头
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingFirstList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingFirstList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    jumpVehInfoPage(info){
      console.log(info)
      this.$router.push({
        name:'vehinfo-manage',
        params:{
          numberId: info.vehicle_info.vehicle_number
        }
      })
    },
    // 高级筛选
    onScreen() {
      this.isShowDrawerDialog = true;
    },

    // 导入员工信息Excel

    // 导出Excel普通员工和驾驶员信息
    exportFile(){
      let params = Object.assign({}, this.showCollapse == 'first'? this.firstQueryform : this.secondQueryform);
      params.is_state = 3
      let ids = [ ...this.tyreFailIds ]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.exporMaintRepairOrder(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
    // 添加员工信息
    addStaffInfo(){
      this.addStaffDialogShow = true
      this.curChangeType = 'add'
      this.$refs['addStaffDialog'].resetData()
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 表格选中一行 sub-req 上点击编辑时
    editSatff(){
      // let val = this.$refs['table'].curSelectedRowInfo
      // if(val){
      //   this.addStaffDialogShow = true
      //   this.$refs['addStaffDialog'].setData(val)
      // }else{
      //   this.$message({type: 'warning', message: '请先选择一条数据'})
      // }
    },
  // 批量作废
  deleteSelect() {
    if(this.tyreFailIds.length == 0) {
      this.$message({
        showClose: true,
        message: '请勾选要删除的选项',
        type: "warning",
      });
      return
    }
    this.deleteRowInfo(null);
  },
  //选择
  selectedUpkeepPlanList(tyreFailList) {
    this.tyreFailIds = [];
    tyreFailList.forEach((item,index) => {
      this.tyreFailIds.push(item.id)
    });
    console.log(JSON.stringify(this.tyreFailIds))
  },
  //作废
  deleteRowInfo(info) {
     let params = {
      context: []
    };
    if(!!info) {
      params.context[0] = info.id
    }else{
      params.context = this.tyreFailIds
    }
    this.$client.deleteTyreFailModel(params)
    .then(res => {
      if (res.head.result == "200") {
        this.loadData();
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
        });
      } else {
        this.$message({
          showClose: true,
          message: res.head.describle,
          type: "error",
        });
      }
    }).catch(err => {
      this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
    })
  },
    // 表格上点击编辑时
    editStaffInfo(val){
      this.addStaffDialogShow = true
      this.curChangeType = 'edit'
      this.$refs['addStaffDialog'].setData(val)
    },
    editrepair(val){
      const h = this.$createElement
        this.$confirm('', '确认接修', {
        message:h('div',null, [
          h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
          h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认接修？'),
          h('p',{ style:'margin:10px 0 0 40px;' },'接修后，工单状态将变为"维修中",并开始计算维修时长。')
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',

      }).then(() => {
        this.$client.updateOrderState({context:{order_id:val.id,state:2}})
        .then(res => {
          if (res.head.result == "200") {
              this.$message({
              type: 'success',
              message: res.head.describle
              });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
      }).catch(() => {
      });
    },
  showComplete(val, text){
    this.title = text
    setTimeout(() => {
      let userInfo = JSON.parse(getUser());
      this.finish_id = Number(userInfo.user_id)
      this.check_person_id = Number(userInfo.user_id)
      this.finish_time = formatDateTime(new Date())
    })
    this.state = val.state
    this.completeDialog = true
    this.order_id =val.id
  },
    doComplete(){
        if(!this.finish_id){
         this.$message({ type: "warning", message: "请选择质检员" });
        return
      }
        if(!this.finish_time){
         this.$message({ type: "warning", message: "请选择检验时间" });
        return
      }
       this.$client.updateOrderState({context:{order_id:this.order_id,state:4,finish_check_id	:this.finish_id,finish_check_time:this.finish_time,finish_check_content:this.finish_content}})
        .then(res => {
          if (res.head.result == "200") {
              this.$message({
              type: 'success',
              message: res.head.describle
              });
                this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
        this.completeDialog = false
        this.finish_time=''
        this.finish_content=''
        this.$refs.driverTree1.onClear()
    },
    pickupComplete(){
      if(this.title === '接车' && !this.finish_id){
         this.$message({ type: "warning", message: "请选择接车驾驶员" });
        return
      }
      if(this.title === '接车' && !this.finish_time){
         this.$message({ type: "warning", message: "请选择出厂时间" });
        return
      }
      if(this.title === '退回' && !this.check_person_id) {
        this.$message({ type: "warning", message: "请选择质检员" });
        return
      }
      if(this.title === '退回' && !this.finish_content) {
        this.$message({ type: "warning", message: "请填写退回意见" });
        return
      }
      let state = this.title === '接车' ? 6 : 8
       this.$client.updateOrderState({context:{order_id:this.order_id,state:state,out_id:this.finish_id,check_person_id: this.check_person_id,out_time:this.finish_time,out_content:this.finish_content}})
        .then(res => {
          if (res.head.result == "200") {
              this.$message({
              type: 'success',
              message: res.head.describle
              });
               this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
         this.completeDialog = false
         this.finish_time=''
          this.finish_content=''
           this.$refs.driverTree1.onClear();
    },
     noComplete(){
       if(!this.finish_id){
         this.$message({ type: "warning", message: "请选择质检员" });
        return
      }
        if(!this.finish_time){
         this.$message({ type: "warning", message: "请选择检验时间" });
        return
      }
       this.$client.updateOrderState({context:{order_id:this.order_id,state:5,finish_check_id	:this.finish_id,finish_check_time:this.finish_time,finish_check_content:this.finish_content,state_child:1383683}})
        .then(res => {
          if (res.head.result == "200") {
              this.$message({
              type: 'success',
              message: res.head.describle
              });
               this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
        this.completeDialog = false
        this.finish_time=''
          this.finish_content=''
this.$refs.driverTree1.onClear();
    },
    // 员工详情
    staffRowInfo(val, type) {
      this.addStaffDialogShow = true
      this.curChangeType = 'detail'
      this.curSelectType = type
      this.$refs['addStaffDialog'].setData(val)
    },
    //路线分配
    openRouteAllocationPop(staffInfo) {
      this.circuitAllocationDialogShow = true;
      this.$refs.circuitAllocationDialog.ruleForm.c_name = staffInfo.c_name;
      this.$refs.circuitAllocationDialog.ruleForm.department = staffInfo.department;
      this.$refs.circuitAllocationDialog.department_name = staffInfo.department_name;
    },
    // 打开导入文件弹窗
    openfiledialog(){
      this.filedialogVisible = true
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      if(this.showCollapse == 'first') {
        this.pageInfoFirst.pageIndex = idx
        this.loadDataGeneralStaff()
      }else{
        this.pageInfoSecond.pageIndex = idx;
      }
    },
  //     onSelectChange(vehs,nodes) {
  //   // alert(JSON.stringify(nodes))
  //   if(nodes && nodes.length > 0) {

  //     nodes.forEach((item,index) => {
  //       delete item.children
  //     });
  //     this.ruleForm.reminders = nodes
  //   }else{
  //     this.ruleForm.reminders = []
  //   }
  // },
    // 切换每页条数
    handleSizeChange(sizes) {
      if(this.showCollapse == 'first') {
        this.pageInfoFirst.pageIndex = 1;
        this.pageInfoFirst.pageSize = sizes;
        this.pageInfoFirst.pageCount = 0;
        this.loadDataGeneralStaff()
      }else{
        this.pageInfoSecond.pageIndex = 1;
        this.pageInfoSecond.pageSize = sizes;
        this.pageInfoSecond.pageCount = 0;
      }
    },
    // 查询
    onSubmit(form) {
      this.firstQueryform = {};
      this.secondQueryform = {}
      if(this.showCollapse == 'first') {
        this.firstQueryform = form;
        this.pageInfoFirst.pageIndex = 1;
        this.pageInfoFirst.pageCount = 0;
        this.loadDataGeneralStaff();
      }else{
        this.secondQueryform = form;
        this.pageInfoSecond.pageIndex = 1;
        this.pageInfoSecond.pageCount = 0;
      }
    },
    // 加载工单列表
    loadDataGeneralStaff() {
      this.loading = true
      let params = {};
      if(this.showCollapse == 'first') {
        params = Object.assign({},this.firstQueryform);
      }

      params.page_index = this.pageInfoFirst.pageIndex;
      params.page_size = this.pageInfoFirst.pageSize;
      params.is_state = 3
      this.$client.getrOrderList(params)
        .then(res => {
          if (res.head.result == "200") {
            this.generalStaffData = res.context.list;
            this.pageInfoFirst.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },


    // 编辑、保存 员工、驾驶员信息
    sureSaveStaffInfo(context){
      let params = {
        context: context
      };
      this.$client.updateOrderList(params)
      .then(res => {
        if(res.head.result == '200') {
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
           this.onSubmit()
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    addOrderItem(context){
      console.log
      let params = {
        context: context
      };
      this.$client.addOrderItem(params)
      .then(res => {
        if(res.head.result == '200') {
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
           this.onSubmit()
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    addRepairInfo(context){
      console.log(context,777)
      let params = {
        context: context
      };
      this.$client.AddOrderFile(params)
      .then(res => {
        if(res.head.result == '200') {
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
           this.onSubmit()
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    // 打开已离职人员列表
    openLeaveOfficeUser() {
      this.leaveStaffDialogShow = true;
    },
    // 选中的员工ID
    selectedList(tyreFailList) {
    this.tyreFailIds = [];
    tyreFailList.forEach((item,index) => {
      this.tyreFailIds.push(item.id)
    });
    console.log(this.tyreFailIds)
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingFirstList;
      }
       setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) - 40 - 0
        console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mark {
      width: 5px;
      height: 5px;
      border-radius:20px;
      display: inline-block;
      margin-bottom: 2px

  }
.staff-manage
  width 100%
  height 100%
</style>
