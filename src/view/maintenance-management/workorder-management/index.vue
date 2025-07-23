<template>
  <div class="workorder-management">
    <staff-overview-info
      ref="staffOverviewInfo"
      @open-leave-office-user="openLeaveOfficeUser"
      @on-ok="onSubmit"
    ></staff-overview-info>
    <div class="" v-show="showCollapse == 'first'">
      <sub-req-first
        ref="head"
        @on-add="addStaffInfo"
        @on-ok="onSubmit"
        @on-edit="editSatff"
        @on-import="openfiledialog"
        @on-export="exportFile"
        @on-screen="onScreen"
        @on-invalid="batchInvalid"
        @on-delete="batchDelete"
        @on-print-statement="onPrintStatement"
        @on-complete="openBatchCompletePop"
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
        :isFixedEmptyPlaceholder="false"
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
          <el-button
            v-else
            type="text"
            size="mini"
            @click="jumpVehInfoPage(scope.data.vehicle_info.vehicle_number)"
          >
            {{ scope.data.vehicle_info.vehicle_number }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="vehicle_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="jumpVehInfoPage(scope.data.vehicle_info.vehicle_name)"
          >
            {{ scope.data.vehicle_info.vehicle_name }}
          </el-button>
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
        <!-- <template  slot="wgd">
        <el-link>打印完工单</el-link>
      </template> -->
        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            v-if="$isPowerShow('detail')"
            @click="staffRowInfo(scope.data)"
          >
            详情
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="editStaffInfo(scope.data)"
            v-if="$isPowerShow('edit')"
            :disabled="scope.data.state == 7"
          >
            编辑
          </el-button>
          <el-button
            slot="reference"
            type="danger"
            v-if="$isPowerShow('repair')"
            @click="editrepair(scope.data)"
            size="mini"
            style="margin-left: 10px"
            :disabled="scope.data.state != 1"
          >
            接修
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="$isPowerShow('complete')"
            @click="showComplete(scope.data)"
            :disabled="setCompletionAuth(scope.data)"
          >
            完工
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="printRowInfo(scope.data)"
            v-if="$isPowerShow('print')"
          >
            打印
          </el-button>
        </template>
      </tr-table>
      <tr-dialog :title="'完工确认'" :visible="completeDialog" @before-close="completeDialog = false">
        <el-form size="mini" label-width="115px">
          <div class="show-flex-box-r">
            <el-col :span="10">
              <el-form-item label="完工负责人:" prop="i_height">
                <get-user-select
                  ref="tree"
                  v-model="finish_id"
                  :width="'390'"
                  :isShowCheckbox="false"
                  :placeholder="'请选择完工负责人'"
                  :isExportMultiple="false"
                ></get-user-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="完工时间:" prop="c_marry">
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
              <el-form-item label="完工意见:" prop="i_height">
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
          <generate-return-sheet v-show="this.return_materials == 1" ref="generateReturnSheet"></generate-return-sheet>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="completeDialog = false">取 消</el-button>
          <el-button :loading="btnLoading" type="primary" @click="doComplete">确 定</el-button>
        </span>
      </tr-dialog>
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
        :returnMaterials="return_materials"
        @sure-save-Materiel="sureSaveMateriel"
        @sure-save-staff-info="sureSaveStaffInfo"
        @sure-save-repair-info="addRepairInfo"
        @add-order-Item="addOrderItem"
        @sure-save-complete-info="showComplete"
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
      <!-- 批量完工弹窗 -->
      <batch-completion-pop
        ref="batchCompletionPop"
        :dialogBool.sync="batchCompletionDialogShow"
        @save-add-edit="savebatchCompletionInfo"
      ></batch-completion-pop>
      <!-- 维修工完工 -->
      <repair-completion-dialog
        ref="repairCompletionDialog"
        :dialogBool.sync="repairCompletionDialogShow"
        @save-repair-item="repairItemCompletion"
      ></repair-completion-dialog>
      <!-- 打印 -->
      <el-dialog width="360px" title="选泽打印模板" :visible.sync="printShow">
        <el-form
          ref="printForm"
          size="mini"
          :model="printForm"
          :rules="printRules"
          label-suffix=":"
        >
          <el-form-item label="打印模板" prop="print_name">
            <el-select v-model="printForm.print_name" placeholder="请选择打印模板">
              <el-option
                v-for="item in printList"
                :key="item.file_name"
                :label="item.temp_name"
                :value="item.file_name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="selectPrintForm">确 定</el-button>
        </span>
      </el-dialog>
      
    </div>
  </div>
</template>
<!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js"></script> -->
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
import generateReturnSheet from './component/generate-return-sheet'
import { formatDateTime } from "@/utils/index";
import batchCompletionPop from './component/batch-completion-pop'
import repairCompletionDialog from './component/dialog/repair-completion-dialog'
export default {
  name: "workorder-management",
  components: {
    subReqFirst,subReqSecond,fileDialog,drawerDialog,getUserSelectTree,getDriverSelectTree,getUserSelect,
    staffOverviewInfo,AddStaffDialog,circuitAllocationDialog,leaveStaffDialog,generateReturnSheet,batchCompletionPop,
    repairCompletionDialog
  },
  data() {
    return {
      finish_id:'',
      finish_time:'',
      finish_content:'',
      completion_authority: 1, //维修全局设置里的完工权限 班组长1 维修人员2
      return_materials: 1, //维修全局设置里的领退料设置 开启1 关闭2
      repairCompletionDialogShow: false,
      userInfo: null,
      completeDialog:false,
      showCollapse: 'first', // first普通员工 second驾驶员
      curChangeType: 'add', //add添加  edit编辑  detail详情
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
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/工单记录模板.xlsx",
      },
      order_id:'',
      form: {},
      firstQueryform: {},
      secondQueryform: {},
      generalStaffData: [], //普通员工列表
      loading: false,
      btnLoading: false,
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
          width: "140",
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
          sortable:true
        },
        {
          id: 4,
          label: "车牌号",
          prop: "vehicle_name",
          width: "110",
          align: "center",
          signIndex:3,
          sortable:true
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
          sortable:true
        },
        {
          id: 7,
          label: "工单类别",
          prop: "type_child_name",
          width: "130",
          align: "center",
          signIndex:6,
          sortable:true
        },
        {
          id: 8,
          label: "报修时间",
          prop: "repair_time_all",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:true
        },
        {
          id: 9,
          label: "报修描述",
          prop: "repair_describe",
          width: "120",
          align: "center",
          signIndex:8,
          sortable:true
        },
        {
          id: 10,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "120",
          align: "center",
          signIndex:9,
          sortable:true
        },
        // {
        //   id: 11,
        //   label: "优先级",
        //   prop: "priority_name",
        //   width: "100",
        //   align: "center",
        //   signIndex:10,
        //   sortable:true
        // },
        {
          id: 11,
          label: "检验时间",
          prop: "check_time",
          width: "135",
          align: "center",
          signIndex:10,
          sortable:true
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
          width: "110",
          align: "center",
          signIndex:12,
          sortable:true
        },
        {
          id: 14,
          label: "工时费",
          prop: "total_hours_fees",
          width: "110",
          align: "center",
          signIndex:13,
          sortable:true
        },
        {
          id: 15,
          label: "材料费",
          prop: "total_materials",
          width: "110",
          align: "center",
          signIndex:14,
          sortable:true
        },
        // {
        //   id: 16,
        //   label: "施救费",
        //   prop: "rescue_cost",
        //   width: "110",
        //   align: "center",
        //   signIndex:15,
        //   sortable:true
        // },
        {
          id: 16,
          label: "总费用",
          prop: "total_fees",
          width: "110",
          align: "center",
          signIndex:15,
          sortable:true
        },
        {
          id: 17,
          label: "接修时间",
          prop: "receive_time",
          width: "150",
          align: "center",
          signIndex:16,
          sortable:true
        },
        {
          id: 18,
          label: "维修班组",
          prop: "shop_names",
          width: "150",
          align: "center",
          signIndex:17,
          sortable:true
        },
        {
          id: 19,
          label: "维修人员",
          prop: "person_names",
          width: "150",
          align: "center",
          signIndex: 18,
          sortable:true
        },
        {
          id: 20,
          label: "维修项目",
          prop: "repair_item_names",
          width: "150",
          align: "center",
          signIndex: 19,
          sortable:true
        },
        {
          id: 21,
          label: "完工时间",
          prop: "finish_time",
          width: "150",
          align: "center",
          signIndex: 20,
          sortable:true
        },
        {
          id: 22,
          label: "完工单",
          prop: "wgd",
          width: "120",
          align: "center",
          signIndex:21,
          sortable:true
        },
        {
          id: 23,
          label: "操作",
          prop: "operation",
          width: "360",
          align: "center",
          signIndex:22,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      canRendererTableHeaderSecond: null,
      customSettingShowList: null,
      selectedWorkOrderList:[],
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false,
      batchCompletionDialogShow: false,
      // 打印
      print_id: 0,
      printList: [],
      printShow: false,
      printForm: {
        print_name: '',
      },
      printRules: {
        print_name: [
          {
            required: true,
            message: "请选择打印模板",
            trigger: "change",
          },
        ],
      },
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.userInfo = JSON.parse(getUser());
    this.$nextTick(() => {
      // 获取全局设置项
      this.getGlobalSetting()
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  watch: {
    completeDialog(bool) {
      if (bool === false) {
        this.resetData();
        // Object.assign(this.$data, this.$options.data());
      }
    },
    $route () {
      // 获取全局设置项
      this.getGlobalSetting()
    }
  },
  methods: {
    jumpVehInfoPage(lp_num){
      this.$router.push({
        name:'vehinfo-manage',
        params:{
          name: lp_num
        }
      })
    },
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
    // 高级筛选
    onScreen() {
      this.isShowDrawerDialog = true;
    },
    // 打印结算单
    onPrintStatement(type = "export") {
      if(!!this.tyreFailIds && this.tyreFailIds.length> 1) {
         this.$message({
          showClose: true,
          message: `每次只能${type == 'export'?'导出':'打印'}一张结算单`,
          type: "warning",
        });
        return
      }
      let params = {}
      if (this.tyreFailIds.length) {
        params.id = this.tyreFailIds[0]
      }
      this.$client.ExportTableMaintRepairOrder(params)
      .then(res => {
        if(res.head.result == '200') {
          if(type == 'export'){
            window.location.href = res.context
            this.$message({type: 'success', message: res.head.describle})
          }else{
            let url = res.context //要预览文件的访问地址
            window.open('http://124.221.93.130:11053/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(url)))
          }
        }else{
          if(type == 'export') {
            this.$message({type: 'error', message: '导出失败'})
          }else{
            this.$message({type: 'error', message: '打印失败'})
          }
        }
      })
    },

    // 导出Excel普通员工和驾驶员信息
    exportFile(){
      let params = Object.assign({}, this.showCollapse == 'first'? this.firstQueryform : this.secondQueryform);
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
   resetData(){
        this.$refs.tree.onClear();
        this.finish_time = ''
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
    batchInvalid() {
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要作废的选项',
          type: "warning",
        });
        return
      }
      this.invalidRowInfo(null);
    },
    // 批量删除
    batchDelete() {
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: "warning",
        });
        return
      }
      let isCanDel = true
      if(this.selectedWorkOrderList.length>0) {
        this.selectedWorkOrderList.forEach(item => {
          if(item.state != 7) {
            isCanDel = false
          }
        })
      }
      if(!isCanDel) {
        this.$message({
          showClose: true,
          message: '请勾选状态为已作废的工单',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
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
          this.$refs.head.onSubmit();
          this.loading = false;
        })
      }).catch(() => {
      });
    },
    //作废
    invalidRowInfo(info) {
      const h = this.$createElement
        this.$confirm('', '确认作废', {
        message:h('div',null, [
          h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
          h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认接修？'),
          h('p',{ style:'margin:10px 0 0 40px;' },'作废后，工单状态将变为"作废"')
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',

      }).then(() => {

      let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.updateOrderScrap(params)
      .then(res => {
        if (res.head.result == "200") {
          this.$refs.head.onSubmit();
          this.$message({
            showClose: true,
            message: "作废成功",
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
      })
    },
    //删除
    deleteRowInfo(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.DeleteManyMaintRepairOrder(params)
      .then(res => {
        if (res.head.result == "200") {
          this.$refs.head.onSubmit();
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
      this.order_id =val.id
      this.addStaffDialogShow = true
      this.curChangeType = 'edit'
      let isTrue = this.setCompletionAuth(val)
      this.$refs['addStaffDialog'].setData(val,isTrue)
    },
    showComplete(val){
      this.order_id =val.id
      if(this.completion_authority == 2) {
        this.repairCompletionDialogShow = true
        this.$refs.repairCompletionDialog.loadData(val.id)
        return 
      }
      setTimeout(() => {
        this.finish_id = Number(this.userInfo.user_id)
        this.finish_time = formatDateTime(new Date())
        this.completeDialog = true
        if(this.return_materials == 1) {
          this.$nextTick(() => {
            this.$refs['generateReturnSheet'].setData(val.id, val.work_code)
          })
        }
      })
    },
    doComplete(){
      if(!this.finish_id){
         this.$message({ type: "warning", message: "填写完工负责人" });
        return
      }
        if(!this.finish_time){
         this.$message({ type: "warning", message: "填写完工时间" });
        return
      }
      if (!this.$refs.generateReturnSheet.isPreview) {
        return this.$message({
          showClose: true,
          type: 'warning',
          message: '请先生成退料单预览再提交'
        })
      }
      this.btnLoading = true
      if (this.$refs.generateReturnSheet.leaveData.length) {
        this.$refs.generateReturnSheet.setRecord().then(res => {
          this.btnLoading = false
          if (res.head.result == "200") {
            this.submitFinally()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            })
          }
        }).catch(err => {
          this.btnLoading = false
        })
      } else {
        this.submitFinally()
      }
    },
    submitFinally() {
      this.$client.updateOrderState({context:{order_id:this.order_id,state:3,finish_id:this.finish_id,finish_time:this.finish_time,finish_content:this.finish_content}}).then(res => {
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
          })
        }
        this.loading = false
        this.btnLoading = false
      })
      this.completeDialog = false
      this.finish_time=''
      this.finish_content=''
    },
    // 员工详情
    staffRowInfo(val) {
      this.addStaffDialogShow = true
      this.curChangeType = 'detail'
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
     //保存物料清单
   sureSaveMateriel(context){
      let params = {
        context: context
      };
     this.$client.addMaterialMaintRepairOrder(params)
       .then(res => {
        if(res.head.result == '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
          if(context.activeName){
          }else{
          this.addStaffDialogShow = false;
          }
          this.$refs.head.onSubmit();
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
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
          this.$refs.head.onSubmit();
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
      let params = {
        context: context
      };
      console.log('派工', params);
      this.$client.addOrderItem(params)
      .then(res => {
        if(res.head.result == '200') {
          // this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
           this.$refs.head.onSubmit();
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
           this.$refs.head.onSubmit();
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
      this.selectedWorkOrderList = [...tyreFailList]
      this.tyreFailIds = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
      });
    },
    // 打开批量完工弹窗
    openBatchCompletePop() {
      let vehicle_names = []
      let type_child_names = []
      let maintDeptIds = []
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要完工的工单',
          type: "warning",
        });
        return
      }
      let isCanDel = false
      let isHaveMaintDept = true
      if(this.selectedWorkOrderList.length>0) {
        this.selectedWorkOrderList.forEach((item,index) => {
          if(item.state == 1 || item.state == 2 || item.state == 3) {
            if(!!item.vehicle_info) {
              vehicle_names.push(item.vehicle_info.vehicle_name)
            }
            if(!!item.type_child_name) {
              type_child_names.push(item.type_child_name)
            }
            if(!!item.maint_dept) {
              maintDeptIds.push(item.maint_dept)
            }else{
              isHaveMaintDept = false
            }
          }else {
            isCanDel = true
          }
        })
        type_child_names = [...new Set(type_child_names)].join('、')
        vehicle_names = [...new Set(vehicle_names)]
        if(vehicle_names.length > 2) {
          vehicle_names = vehicle_names.slice(0,2).join('、')+'等'+ vehicle_names.length + '辆车'
        }else{
          vehicle_names = vehicle_names.join('、')
        }

      }
      if(isCanDel) {
        this.$message({
          showClose: true,
          message: '请勾选维修中的工单',
          type: "warning",
        });
        return
      }
      // if(!isHaveMaintDept) {
      //   this.$message({
      //     showClose: true,
      //     message: '请勾选有维修车间的工单',
      //     type: "warning",
      //   });
      //   return
      // }
      maintDeptIds = [...new Set(maintDeptIds)]
      if(maintDeptIds.length > 1) {
         this.$message({
          showClose: true,
          message: '请勾选相同的维修车间的工单进行批量完工',
          type: "warning",
        })
        return
      }

      this.$refs.batchCompletionPop.formData.vehicle_ids = vehicle_names
      this.$refs.batchCompletionPop.formData.type_child_names = type_child_names
      this.$refs.batchCompletionPop.formData.order_ids = this.selectedWorkOrderList.map(item => item.id)
      this.$refs.batchCompletionPop.reqAllMaintDeptGetPerson(this.selectedWorkOrderList[0].maint_dept,this.selectedWorkOrderList[0].maint_dept_name)
      this.batchCompletionDialogShow = true
    },
    // 保存批量完工
    savebatchCompletionInfo(form) {
      let params = {
        context: form
      };
      this.$client.CompleteManyOrderMaintRepairOrder(params)
      .then(res => {
        if(res.head.result == '200') {
          this.batchCompletionDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
           this.$refs.head.onSubmit();
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    // 打印出库单
    printRowInfo(row) {
      this.print_id = row.id
      let params = {
        context: {
          object_id: 1780,
          enable: 1
        }
      }
      this.$client.GetByPage(params).then((req) => {
        let data = req.context.list
        if(!data.length) {
          this.$message({
            showClose: true,
            message: '暂无该表单打印模板,请到打印模板管理确认.',
            type: "error",
          });
          return false
        }
        if(data.length > 1) {
          this.printList = JSON.parse(JSON.stringify(data))
          this.printShow = true
        }else {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + data[0].file_name + '&flow_id=' + row.id
          window.open(url, '_blank')
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: '服务出错,请联系开发人员.',
          type: "error",
        });
      })
    },
    selectPrintForm() {
      this.$refs.printForm.validate((valid) => {
        if (valid) {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + this.printForm.print_name + '&flow_id=' + this.print_id
          window.open(url, '_blank')
        } else {
          return false;
        }
      });
    },
    // 获取维修全局设置
    getGlobalSetting() {
      this.$client.GetListMaintMainRule()
        .then(res => {
          if (res.head.result == "200") {
            if(res.context && res.context.list) {
              this.completion_authority = res.context.list[0].complete_confirm
              this.return_materials = res.context.list[0].receive_confirm
            }
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
    // 维修工完工权限设置
    setCompletionAuth(val) {
      let users = []
      let isPassed = true
      val.repair_items.forEach(item => {
        if(item.person_list && item.person_list.length) {
          users = users.concat(item.person_list)
        }
      })
      if((val.state == 2 && this.completion_authority == 1) || (val.state == 2 && this.completion_authority == 2 && users.includes(this.userInfo.user_id))) {
        isPassed = false
      }
      return isPassed
    },
    // 获取维修人员列表（完工用）
    getRepairPersonList(id) {
        // 获取维修人员完工列表
        this.$client.GetListCompletedSignDetail({main_id: id})
        .then(res => {
          if (res.head.result == "200") {
            this.approverUsers = res.context.list
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 维修人员确认完工
    repairItemCompletion(val) {
      this.$client.CompleteStateCompletedSignDetail(val)
        .then(res => {
          if (res.head.result == "200") {
            this.repairCompletionDialogShow = false
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
            this.$refs.head.onSubmit();
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
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingFirstList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let hh = this.$refs.staffOverviewInfo.$el.offsetHeight
        this.TableHeight = maxh - (th) - hh - 40
      }, 60)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.workorder-management
  width 100%
  height 100%
  .mark {
      width: 5px;
      height: 5px;
      border-radius:20px;
      display: inline-block;
      margin-bottom: 2px

  }
</style>
