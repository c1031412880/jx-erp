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
        @delete-select="deleteSelect(2)"
        @delete-select1="deleteSelect(1)"
        @on-print-statement="onPrintStatement"
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
        <template slot-scope="scope" slot="state">
          <div v-if="!scope.data.repair_fee" style="color: #f47920">
            <div
              class="mark"
              style="background-color: #f47920; border-radius: 1px solid #f47920"
            ></div>
            <span>未结算</span>
          </div>
          <div v-else-if="scope.data.repair_fee.state == 1" style="color: #f47920">
            <div
              class="mark"
              style="background-color: #f47920; border-radius: 1px solid #f47920"
            ></div>
            <span>{{ scope.data.repair_fee.state_name }}</span>
          </div>
          <div v-else style="color: #18be6b">
            <div
              class="mark"
              style="background-color: #18be6b; border-radius: 1px solid #18be6b"
            ></div>
            <span>{{ scope.data.repair_fee.state_name }}</span>
          </div>

          <!-- <p v-if="!scope.data.repair_fee" style="color: #f47920">未结算</p> -->
          <!-- <p
            style="color: #f47920"
            v-else-if="scope.data.repair_fee.state == 1"
          >
            {{ scope.data.repair_fee.state_name }}
          </p> -->
          <!-- <p style="color: #225a1f" v-else>
            {{ scope.data.repair_fee.state_name }}
          </p> -->
        </template>

        <template slot-scope="scope" slot="vehicle_number">
          <span v-if="scope.data.vehicle_info == null"></span>
          <span v-else>
            {{ scope.data.vehicle_info.vehicle_number }}
          </span>
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
        <template slot-scope="scope" slot="hour">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.hour }}</span>
        </template>
        <template slot-scope="scope" slot="material">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.material }}</span>
        </template>
        <template slot-scope="scope" slot="ingredients">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.ingredients }}</span>
        </template>
        <template slot-scope="scope" slot="management">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.management }}</span>
        </template>
        <template slot-scope="scope" slot="maint_dept_name">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.maint_dept_name }}</span>
        </template>
        <template slot-scope="scope" slot="overtime">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.overtime }}</span>
        </template>
        <template slot-scope="scope" slot="sale">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.sale }}</span>
        </template>
        <template slot-scope="scope" slot="total">
          <span v-if="scope.data.repair_fee == null"></span>
          <span v-else>{{ scope.data.repair_fee.total }}</span>
        </template>
        <template slot="wgd">
          <el-link>打印完工单</el-link>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            @click="staffRowInfo(scope.data)"
            v-if="$isPowerShow('details')"
          >
            工单详情
          </el-button>
          <!-- repair_fee.state 1是未结算  2是已结算 -->
          <el-button
            type="primary"
            size="mini"
            @click="editStaffInfo(scope.data)"
            v-if="$isPowerShow('edit')"
            :disabled="!!scope.data.repair_fee && scope.data.repair_fee.state == 2"
          >
            结算编辑
          </el-button>
        </template>
      </tr-table>
      <el-dialog title="完工检验" :visible.sync="completeDialog" width="50%">
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
          <div class="show-flex-box-r">
            <el-col :span="10">
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
            <el-col :span="10">
              <el-form-item label="出厂时间:" prop="c_marry">
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
              <el-form-item label="接车人意见:" prop="i_height">
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
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getUserSelectTree from "components/base/formModel/tree/get-user-select-tree";
import drawerDialog from "./component/dialog/drawer-dialog";
import staffOverviewInfo from "./component/staff-overview-info";
import subReqFirst from "./component/sub-req-first";
import subReqSecond from "./component/sub-req-second";
import fileDialog from "@/components/fileDialog/file-dialog";
import AddStaffDialog from "./component/dialog/add-staff-dialog";
import circuitAllocationDialog from "./component/dialog/circuit-allocation-dialog";
import leaveStaffDialog from "./component/dialog/leave-staff-dialog";
import { formatDateTime } from "@/utils/index";
export default {
  name: "settlement-management",
  components: {
    subReqFirst,
    subReqSecond,
    fileDialog,
    drawerDialog,
    getUserSelectTree,
    getDriverSelectTree,
    staffOverviewInfo,
    AddStaffDialog,
    circuitAllocationDialog,
    leaveStaffDialog,
  },
  data() {
    return {
      finish_id: "",
      finish_time: "",
      finish_content: "",
      completeDialog: false,
      showCollapse: "first", // first普通员工 second驾驶员
      curChangeType: "add", //add添加  edit编辑  detail详情
      typeMessage: "人员",
      pageInfoFirst: {
        //普通员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      pageInfoSecond: {
        //驾驶员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      filedialogVisible: false,
      FileData: {
        url:
          window.newHttpConfig.URL_EASYMOCK +
          "/Files/TempFiles/人员记录模板.xlsx",
      },
      state: "",
      order_id: "",
      form: {},
      firstQueryform: {},
      secondQueryform: {},
      generalStaffData: [], //普通员工列表
      driverData: [], //驾驶员列表
      loading: false,
      loadingSecond: false,
      TableHeight: 500,
      informationDialogShow: false,
      addStaffDialogShow: false, //添加员工信息
      circuitAllocationDialogShow: false, //添加车辆 线路
      leaveStaffDialogShow: false, //离职人员
      isShowDrawerDialog: false,
      customSettingVialogVisible: false,
      selectedWorkLists:[], //选中的工单列表
      tyreFailIds: [], //维修id
      selectedListIds: [], //选中的行的工单id
      customSettingFirstList: [
        {
          id: 1,
          label: "工单号码",
          prop: "work_code",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工单状态",
          prop: "state_detail_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "结算状态",
          prop: "state",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "自编号",
          prop: "vehicle_number",
          width: "110",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "车牌号",
          prop: "vehicle_name",
          width: "110",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "所属组织",
          prop: "department_name",
          width: "110",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "车辆型号",
          prop: "vehicle_kind_name",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "工单类别",
          prop: "type_child_name",
          width: "120",
          align: "center",
          signIndex:7,
          sortable: false,
        },
        {
          id: 9,
          label: "报修时间",
          prop: "repair_time",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "120",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "优先级",
          prop: "priority_name",
          width: "100",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "检验时间",
          prop: "check_time",
          width: "135",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "检验备注",
          prop: "check_describe",
          width: "140",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "总工时",
          prop: "total_hours",
          width: "90",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "工时费",
          prop: "total_hours_fees",
          width: "90",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "材料费",
          prop: "total_materials",
          width: "90",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
          {
          id: 17,
          label: "辅料费",
          prop: "ingredients",
          width: "90",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
          {
          id: 18,
          label: "管理费",
          prop: "management",
          width: "90",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "加班费",
          prop: "overtime",
          width: "90",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "施救费",
          prop: "rescue_cost",
          width: "90",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "优惠费用",
          prop: "sale",
          width: "90",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "实际费用",
          prop: "total_fees",
          width: "90",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "接修时间",
          prop: "receive_time",
          width: "150",
          align: "center",
          signIndex: 22,
          sortable: true,
        },
        {
          id: 24,
          label: "完工时间",
          prop: "finish_time",
          width: "150",
          align: "center",
          signIndex: 23,
          sortable: true,
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
          id: 25,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      canRendererTableHeaderSecond: null,
      customSettingShowList: null,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.head.onSubmit();
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
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
      onPrintStatement() {
        if(!!this.selectedListIds && this.selectedListIds.length> 1) {
           this.$message({
            showClose: true,
            message: '每次只能打印一张结算单',
            type: "warning",
          });
          return
        }
        let params = {}
        if (this.selectedListIds.length) {
          params.id = this.selectedListIds[0]
        }
        this.$client.ExportTableMaintRepairOrder(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context

            this.$message({type: 'success', message: '打印成功'})
          }else{
            this.$message({type: 'error', message: '打印失败'})
          }
        })
      },
    // 导出Excel普通员工和驾驶员信息
    exportFile() {
      let params = Object.assign(
        {},
        this.showCollapse == "first"
          ? this.firstQueryform
          : this.secondQueryform
      );
        params.is_state = 4
        let ids = [ ...this.selectedListIds ]
        if (ids.length) {
          params.ids = ids
        }
      this.$client.exporMaintRepairOrder(params).then((res) => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 添加员工信息
    addStaffInfo() {
      this.addStaffDialogShow = true;
      this.curChangeType = "add";
      this.$refs["addStaffDialog"].resetData();
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 表格选中一行 sub-req 上点击编辑时
    editSatff() {
      // let val = this.$refs['table'].curSelectedRowInfo
      // if(val){
      //   this.addStaffDialogShow = true
      //   this.$refs['addStaffDialog'].setData(val)
      // }else{
      //   this.$message({type: 'warning', message: '请先选择一条数据'})
      // }
    },
    // 批量结算
    deleteSelect(state) {
      if (this.selectedWorkLists.length == 0) {
        this.$message({
          showClose: true,
          message: `请勾选需${state==1?'退回的':'结算的'}工单`,
          type: "warning",
        });
        return;
      }
      if (this.selectedWorkLists.length > 1 && state == 2) {
        this.$message({
          showClose: true,
          message: `${state==1?'退回的':'结算的'}工单只能为单条`,
          type: "warning",
        });
        return;
      }

      let ids = [];
      if(this.selectedWorkLists.length > 0) {
        let isCanUpDate = true
        let isHavedEditSettle = true
        this.selectedWorkLists.forEach((item, index) => {
          if (item.repair_fee) { //结算后存在
            if(state == 1 && item.repair_fee.state == 1) {
              isCanUpDate = false
            }

            if(state == 2 && item.repair_fee.state == 2) {
              isCanUpDate = false
            }

            ids.push(item.repair_fee.id);
          }else{
            if(state == 1) {
              isCanUpDate = false
            }
            if(state == 2) {
              isHavedEditSettle = false
            }
          }
        });

        if(!isCanUpDate) {
            this.$message({
            showClose: true,
            message: `${state ==2?"已结算的不能再次结算":"未结算的不能结算退回"}`,
            type: "warning",
          });
          return
        }

        if(!isHavedEditSettle) {
          this.$message({
            showClose: true,
            message: '请先编辑填写结算信息',
            type: "warning",
          });
          return
        }
      }
      // 1未结算2已结算
      if(state == 2) {
        this.reqRepairRecords(this.selectedWorkLists[0], state, ids)
      }else{
        // 结算退回
        this.submitWorkOrderSettlement(state,ids,false)
      }


    },
    // 查询报修记录
    reqRepairRecords(selectedWork,state,ids) {
      let params ={
        id: selectedWork.repair_id
      }
      this.$client.getByPageMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          if(!!res.context.list && res.context.list.length) {
            let repairRecordsInfo = res.context.list[0];
            // 1普通报修2事故报修3外修
            if(repairRecordsInfo.type == 2) {
              const h = this.$createElement;
                this.$confirm("", "确认同步", {
                  showClose: false,
                  message: h("div", null, [
                    h("i", {
                      class: "el-icon-question",
                      style: "color:#f90;font-size:30px;",
                    }),
                    h(
                      "span",
                      {
                        style:
                          "margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;",
                      },
                      "是否需要同步维修费用到该事故费用中？"
                    ),
                  ]),
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                }).then(() => {
                  let total_fee = Number(selectedWork.repair_fee.management) + Number(selectedWork.repair_fee.ingredients) + Number(selectedWork.repair_fee.overtime)
        -Number(selectedWork.repair_fee.sale) + Number(selectedWork.total_materials) + Number(selectedWork.total_hours_fees)
                  let params = {
                    accident_id: repairRecordsInfo.accident_id,
                    total_fee: total_fee
                  }
                  // console.log(params)
                  // return
                  this.$client
                    .ToAccientMaintRepairOrder(params)
                    .then((res) => {
                      if (res.head.result == "200") {

                        this.submitWorkOrderSettlement(state,ids, true)
                        // this.$message({
                        //   type: "success",
                        //   message: res.head.describle,
                        // });
                      } else {
                        this.$message({
                          showClose: true,
                          message: res.head.describle,
                          type: "error",
                        });
                      }
                    });
                }).catch(() => {
                  this.submitWorkOrderSettlement(state,ids,false)
                });
            }else{
              this.submitWorkOrderSettlement(state,ids,false)
            }
          }

        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    // 提交工单结算 、结算退回
    submitWorkOrderSettlement(state,ids,isToAccientFee) {
      let context = { state: state, ids: ids };
      this.$client.updateStateMaintRepairFee({ context }).then((res) => {
        if (res.head.result == "200") {
          // this.loadDataGeneralStaff();
          this.$refs["head"].onSubmit()
          this.$message({
            showClose: true,
            message: `${isToAccientFee?'结算并同步到事故费用成功':state ==1?'退回结算成功':'确认结算成功'}`,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    //作废
    deleteRowInfo(info) {
      let params = {
        context: [],
      };
      if (!!info) {
        params.context[0] = info.id;
      } else {
        params.context = this.tyreFailIds;
      }
      this.$client
        .deleteTyreFailModel(params)
        .then((res) => {
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
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 表格上点击编辑时
    editStaffInfo(val) {
      this.addStaffDialogShow = true;
      this.curChangeType = "edit";
      this.$refs["addStaffDialog"].setData(val);
    },
    editrepair(val) {
      const h = this.$createElement;
      this.$confirm("", "确认接修", {
        message: h("div", null, [
          h("i", {
            class: "el-icon-question",
            style: "color:#f90;font-size:30px;",
          }),
          h(
            "span",
            {
              style:
                "margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;",
            },
            "是否确认接修？"
          ),
          h(
            "p",
            { style: "margin:10px 0 0 40px;" },
            '接修后，工单状态将变为"维修中",并开始计算维修时长。'
          ),
        ]),
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$client
            .updateOrderState({ context: { order_id: val.id, state: 2 } })
            .then((res) => {
              if (res.head.result == "200") {
                this.$message({
                  type: "success",
                  message: res.head.describle,
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    showComplete(val) {
      setTimeout(() => {
        let userInfo = JSON.parse(getUser());
        this.finish_id = Number(userInfo.user_id);
    　　this.finish_time = formatDateTime(new Date())
        this.completeDialog = true;
      });
      this.state = val.state;
      this.completeDialog = true;
      this.order_id = val.id;
      console.log(val);
    },
    doComplete() {
      this.$client
        .updateOrderState({
          context: {
            order_id: this.order_id,
            state: 4,
            finish_check_id: this.finish_id,
            finish_check_time: this.finish_time,
            finish_check_content: this.finish_content,
          },
        })
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              type: "success",
              message: res.head.describle,
            });
            this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.loading = false;
        });
      this.completeDialog = false;
      this.$refs.driverTree1.onClear();
      this.finish_time = "";
      this.finish_content = "";
    },
    pickupComplete() {
      this.$client
        .updateOrderState({
          context: {
            order_id: this.order_id,
            state: 6,
            out_id: this.finish_id,
            out_time: this.finish_time,
            out_content: this.finish_content,
          },
        })
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              type: "success",
              message: res.head.describle,
            });
             this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.loading = false;
        });
      this.completeDialog = false;
      this.$refs.driverTree1.onClear();
      this.finish_time = "";
      this.finish_content = "";
    },
    noComplete() {
      this.$client
        .updateOrderState({
          context: {
            order_id: this.order_id,
            state: 5,
            finish_check_id: this.finish_id,
            finish_check_time: this.finish_time,
            finish_check_content: this.finish_content,
          },
        })
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              type: "success",
              message: res.head.describle,
            });
            this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.loading = false;
        });
      this.completeDialog = false;
      this.$refs.driverTree1.onClear();
      this.finish_time = "";
      this.finish_content = "";
    },
    //
    staffRowInfo(val) {
      this.addStaffDialogShow = true;
      this.curChangeType = "detail";
      this.$refs["addStaffDialog"].setData(val);
    },
    //路线分配
    openRouteAllocationPop(staffInfo) {
      this.circuitAllocationDialogShow = true;
      this.$refs.circuitAllocationDialog.ruleForm.c_name = staffInfo.c_name;
      this.$refs.circuitAllocationDialog.ruleForm.department =
        staffInfo.department;
      this.$refs.circuitAllocationDialog.department_name =
        staffInfo.department_name;
    },
    // 打开导入文件弹窗
    openfiledialog() {
      this.filedialogVisible = true;
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      if (this.showCollapse == "first") {
        this.pageInfoFirst.pageIndex = idx;
        this.loadDataGeneralStaff();
      } else {
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
      if (this.showCollapse == "first") {
        this.pageInfoFirst.pageIndex = 1;
        this.pageInfoFirst.pageSize = sizes;
        this.pageInfoFirst.pageCount = 0;
        this.loadDataGeneralStaff();
      } else {
        this.pageInfoSecond.pageIndex = 1;
        this.pageInfoSecond.pageSize = sizes;
        this.pageInfoSecond.pageCount = 0;
      }
    },
    // 查询
    onSubmit(form) {
      this.firstQueryform = {};
      this.secondQueryform = {};
      if (this.showCollapse == "first") {
        this.firstQueryform = form;
        this.pageInfoFirst.pageIndex = 1;
        this.pageInfoFirst.pageCount = 0;
        this.loadDataGeneralStaff();
      } else {
        this.secondQueryform = form;
        this.pageInfoSecond.pageIndex = 1;
        this.pageInfoSecond.pageCount = 0;
      }
    },
    // 加载工单列表
    loadDataGeneralStaff() {
      this.loading = true;
      let params = {};
      if (this.showCollapse == "first") {
        params = Object.assign({}, this.firstQueryform);
      }
      params.page_index = this.pageInfoFirst.pageIndex;
      params.page_size = this.pageInfoFirst.pageSize;
      params.is_state = 4;
      this.$client.getrOrderList(params).then((res) => {
        if (res.head.result == "200") {
          this.generalStaffData = res.context.list;
          this.pageInfoFirst.pageCount = res.context.total;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
        this.loading = false;
      });
    },

    // 编辑、保存 员工、驾驶员信息
    sureSaveStaffInfo(context) {
      console.log(context, "6421");
      let params = {
        context: context,
      };
      if (context.id > 0) {
        this.$client.updatedMaintRepairFee(params).then((res) => {
          if (res.head.result == "200") {
            this.addStaffDialogShow = false;
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功",
            });
           this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle,
            });
          }
        });
      } else {
        this.$client.addMaintRepairFee(params).then((res) => {
          if (res.head.result == "200") {
            this.addStaffDialogShow = false;
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功",
            });
            this.$refs.head.onSubmit();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle,
            });
          }
        });
      }
    },
    addOrderItem(context) {
      console.log;
      let params = {
        context: context,
      };
      this.$client.addOrderItem(params).then((res) => {
        if (res.head.result == "200") {
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功",
          });
          this.onSubmit();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle,
          });
        }
      });
    },
    addRepairInfo(context) {
      console.log(context, 777);
      let params = {
        context: context,
      };
      this.$client.AddOrderFile(params).then((res) => {
        if (res.head.result == "200") {
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功",
          });
          this.onSubmit();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle,
          });
        }
      });
    },
    // 打开已离职人员列表
    openLeaveOfficeUser() {
      this.leaveStaffDialogShow = true;
    },
    // 选中的员工ID
    selectedList(tyreFailList) {
      this.selectedWorkLists = tyreFailList;
      this.tyreFailIds = [];
      this.selectedListIds = [];
      tyreFailList.forEach((item, index) => {
        if (item.repair_fee) {
          this.tyreFailIds.push(item.repair_fee.id);
        }
        this.selectedListIds.push(item.id)
      });
      console.log(this.tyreFailIds, tyreFailList)
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingFirstList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 40 - 0;
        console.log(this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.staff-manage {
  width: 100%;
  height: 100%;

   .mark {
        width: 5px;
        height: 5px;
        border-radius:20px;
        display: inline-block;
        margin-bottom: 2px

    }
}
</style>
