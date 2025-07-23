<template>
  <div class="stock-lunar-knot-manage">
    <staff-overview-info
      ref="staffOverviewInfo"
      @open-leave-office-user="openLeaveOfficeUser"
    ></staff-overview-info>
    <!-- <el-radio-group ref="elRadioGroup" v-model="showCollapse" style="margin-bottom: 20px;" size="mini">
        <el-radio-button :label="'first'">普通员工</el-radio-button>
        <el-radio-button :label="'second'">驾驶员</el-radio-button>
      </el-radio-group> -->
    <sub-req-first
      ref="head"
      @on-add="addStaffInfo"
      @on-ok="onSubmit"
      @on-edit="editSatff"
      @on-import="openfiledialog"
      @on-export="exportFile"
      @func="getMsgFormSon"
    ></sub-req-first>
    <div class="" v-show="showCollapse == 'first'">
      <c-table
        ref="table"
        :selectionShow="true"
        :data="generalStaffData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="count">
          <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">
            {{ scope.data.count }}
          </el-button>
        </template>
      </c-table>
      <div
        style="
          background-color: #f5f5f5;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
        "
      >
        <p style="color: #aaaaaa; font-weight: bold">
          本页合计：总数量 {{ current_count }} 销售金额
          {{ current_money }} &#12288;&#12288;&#12288;&#12288; 全部合计：总数量
          {{ total_count }} 销售金额 {{ total_money }}
        </p>
      </div>
      <el-pagination
        style="margin: 15px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfoFirst.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageInfoFirst.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfoFirst.pageCount"
      ></el-pagination>
    </div>

    <div class="" v-show="showCollapse == 'second'">
      <!-- <sub-req-second
          ref="headSecond"
          @on-add="addStaffInfo"
          @on-ok="onSubmit"
          @on-edit="editSatff"
          @on-import="openfiledialog"
          @on-export="exportFile"
        ></sub-req-second> -->
      <c-table
        ref="table"
        :selectionShow="true"
        :data="driverData"
        :tableHeaderList="canRendererTableHeaderSecond"
        :TableHeight="TableHeight"
        :loading="loadingSecond"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="count">
          <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">
            {{ scope.data.count }}
          </el-button>
        </template>
      </c-table>
      <div
        style="
          background-color: #f5f5f5;
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
        "
      >
        <p style="color: #aaaaaa; font-weight: bold">
          本页合计：总数量 {{ current_count1 }} 销售金额
          {{ current_money1 }} &#12288;&#12288;&#12288;&#12288; 全部合计：总数量
          {{ total_count1 }} 销售金额 {{ total_money1 }}
        </p>
      </div>
      <el-pagination
        ref="paginationH"
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="pageInfoSecond.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfoSecond.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfoSecond.pageCount"
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
        @on-submit-excel="importStaffInfoExcel"
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
import cTable from "./component/c-table";
import staffOverviewInfo from "./component/staff-overview-info";
import subReqFirst from "./component/sub-req-first";
import subReqSecond from "./component/sub-req-second";
import fileDialog from "@/components/fileDialog/file-dialog";
import jurisdiction from "@/view/401";
import AddStaffDialog from "./component/dialog/add-staff-dialog";
import circuitAllocationDialog from "./component/dialog/circuit-allocation-dialog";
import leaveStaffDialog from "./component/dialog/leave-staff-dialog";

export default {
  name: "stock-lunar-knot-manage",
  components: {
    subReqFirst,
    subReqSecond,
    fileDialog,
    staffOverviewInfo,
    AddStaffDialog,
    circuitAllocationDialog,
    leaveStaffDialog,
    cTable,
    jurisdiction
  },
  data() {
    return {
      current_count: "",
      current_money: "",
      total_count: "",
      total_money: "",
      current_count1: "",
      current_money1: "",
      total_count1: "",
      total_money1: "",
      showCollapse: "first", // first普通员工 second驾驶员
      curChangeType: "add", //add添加  edit编辑  detail详情
      typeMessage: "人员",
      pageInfoFirst: {
        //普通员工列表分页
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      pageInfoSecond: {
        //驾驶员工列表分页
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      filedialogVisible: false,
      FileData: {
        url:
          window.newHttpConfig.URL_EASYMOCK +
          "/Files/TempFiles/人员记录模板.xlsx",
      },
      showprice:'3',
      form: {},
      selectedIds:[], //勾选的ID
      firstQueryform: {},
      secondQueryform: {},
      generalStaffData: [], //普通员工列表
      driverData: [], //驾驶员列表
      loading: false,
      loadingSecond: false,
      TableHeight: 300,
      informationDialogShow: false,
      addStaffDialogShow: false, //添加员工信息
      circuitAllocationDialogShow: false, //添加车辆 线路
      leaveStaffDialogShow: false, //离职人员

      customSettingVialogVisible: false,
      customSettingFirstList: [
        {
          id: 1,
          label: "月份",
          prop: "backup_date",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "仓库",
          prop: "house_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "规格型号",
          prop: "specification",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "销售均价(元)",
          prop: "price",
          width: "140",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "库存数量",
          prop: "count",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "销售金额(元)",
          prop: "total_price",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
         {
          id: 10,
          label: "成本单价(元)",
          prop: "cost_price",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
         {
          id: 11,
          label: "成本金额(元)",
          prop: "cost_total_price",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "供应商名称",
          prop: "provider_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
         {
          id: 13,
          label: "物料分类",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "适用车型",
          prop: "vehicle_kind_names",
          width: "120",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "仓位",
          prop: "position",
          width: "135",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "库存量状态",
          prop: "state_name",
          width: "140",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
      ],
      customSettingSecondList: [
        {
          id: 1,
          label: "月份",
          prop: "backup_date",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "仓库",
          prop: "house_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "批次号",
          prop: "batch_no",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "物料编码",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "单价(元)",
          prop: "price",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "库存数量",
          prop: "count",
          width: "120",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "库存金额(元)",
          prop: "total_price",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
         {
          id: 11,
          label: "成本单价(元)",
          prop: "cost_price",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
         {
          id: 12,
          label: "成本金额(元)",
          prop: "cost_total_price",
          width: "140",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "供应商",
          prop: "provider_name",
          width: "100",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "物料分类",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "仓位",
          prop: "position",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "库存量状态",
          prop: "state_name",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      canRendererTableHeaderSecond: null,
      customSettingShowList: null,
    };
  },
  mounted() {
    this.showprice = JSON.parse(localStorage.getItem('showprice'));
    this.$nextTick(() => {
      this.setHead("initialize");
      // this.loadDataGeneralStaff();
      this.loadDataDriver();
      window.eventOn.$on("view-resize" + this.$route.fullPath, () => {
        this.setHead();
      });
    });
  },
  methods: {
    getMsgFormSon(data) {
      this.showCollapse = data;
      // console.log(this.msgFormSon)
    },
    // 导入员工信息Excel
    importStaffInfoExcel(val) {
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      formData.append("i_is_driver", this.showCollapse == "first" ? 0 : 1);
      let params = formData;
      // console.log(params)
      this.$client.importStaffInfo(params).then((res) => {
        if (res.head.result == "200") {
          // this.form = {};
          if (this.showCollapse == "first") {
            this.firstQueryform = {};
            this.pageInfoFirst.pageIndex = 1;
            this.pageInfoFirst.pageCount = 0;
            this.loadDataGeneralStaff();
          } else {
            this.secondQueryform = {};
            this.pageInfoSecond.pageIndex = 1;
            this.pageInfoSecond.pageCount = 0;
            this.loadDataDriver();
          }
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });

          // this.$message({ message: res.head.describle, type: "error" });
        }
      });
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    // 导出
    exportFile() {
      let params = Object.assign({}, this.firstQueryform);
      // params.i_is_driver = this.showCollapse == 'first'? 0 : 1;
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      console.log(this.showCollapse);
      if (this.showCollapse == "first") {
        this.$client.Export1TimerBackup(params).then((res) => {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        });
      } else {
        this.$client.ExportTimerBackup(params).then((res) => {
          if (res.head.result == "200") {
            console.log(this.showCollapse);
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        });
      }
    },
    // 添加员工信息
    addStaffInfo() {
      this.addStaffDialogShow = true;
      this.curChangeType = "add";
      this.$refs["addStaffDialog"].resetData();
    },
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {
      if (this.showCollapse == "first") {

        this.customSettingShowList = newestTableHeaderList;
        this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
          let obj = {
            id: index +1,
            label: sing.label,
            prop: sing.prop,
            width: sing.width,
            align: sing.align,
            signIndex: index,
            sortable: sing.sortable,
          }
          return obj
        });
      } else {
        this.canRendererTableHeaderSecond = null;
        this.canRendererTableHeaderSecond = newestTableHeaderList;
      }
      this.$forceUpdate();
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
    // 表格上点击编辑时
    editStaffInfo(val) {
      this.addStaffDialogShow = true;
      this.curChangeType = "edit";
      this.$refs["addStaffDialog"].setData(val);
    },
    // 员工详情
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
        this.loadDataDriver();
      }
    },
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
        this.loadDataDriver();
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
        this.loadDataDriver();
      }
    },
    // 加载按批次号
    loadDataGeneralStaff() {
      this.$refs.staffOverviewInfo.reqStaffTypeCount(this.firstQueryform.backup_date? this.firstQueryform.backup_date:'')
      this.loading = true;
      let params = {};
      if (this.showCollapse == "first") {
        params = Object.assign({}, this.firstQueryform);
      }
      params.page_index = this.pageInfoFirst.pageIndex;
      params.page_size = this.pageInfoFirst.pageSize;
      this.$client.GetByPage1TimerBackup(params).then((res) => {
        if (res.head.result == "200") {
          this.generalStaffData = res.context.list;
           this.generalStaffData.forEach(element => {
             if(element.price){
               element.price=element.price.toFixed(2)
               element.total_price=element.total_price.toFixed(2)
                if(element.cost_price){
                  element.cost_price=element.cost_price.toFixed(2)
                  if(element.cost_total_price){
                    element.cost_total_price=element.cost_total_price.toFixed(2)
                  }
                }
              }
            });
          this.pageInfoFirst.pageCount = res.context.total;
          this.current_count = res.context.current_count;
          this.current_money = res.context.current_money;
          this.total_count = res.context.total_count;
          this.total_money = res.context.total_money;
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
    // 加载批次号分组
    loadDataDriver() {
      this.loadingSecond = true;
      let params = {};
      if (this.showCollapse == "second") {
        params = Object.assign({}, this.secondQueryform);
      }
      params.page_index = this.pageInfoSecond.pageIndex;
      params.page_size = this.pageInfoSecond.pageSize;
      this.$client.GetByPageTimerBackup(params).then((res) => {
        if (res.head.result == "200") {
          this.loadingSecond = false;
          this.driverData = res.context.list;
          this.pageInfoSecond.pageCount = res.context.total;
          this.current_count1 = res.context.current_count;
          this.current_money1 = res.context.current_money;
          this.total_count1 = res.context.total_count;
          this.total_money1 = res.context.total_money;
           this.driverData.forEach(element => {
             if(element.price){
               element.price=element.price.toFixed(2)
               element.total_price=element.total_price.toFixed(2)
                if(element.cost_price){
                  element.cost_price=element.cost_price.toFixed(2)
                  if(element.cost_total_price){
                    element.cost_total_price=element.cost_total_price.toFixed(2)
                  }
                }
              }
            });
        } else {
          this.loadingSecond = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 确定离职
    tableDel(id) {
      let parmas = {
        context: [id],
      };
      this.$client.sureMployeeDimission(parmas).then((res) => {
        if (res.head.result == "200") {
          if (this.showCollapse == "first") {
            this.loadDataGeneralStaff();
          } else {
            this.loadDataDriver();
          }
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }
      });
    },
    // 编辑、保存
    sureSaveStaffInfo(context) {
      context.i_is_driver = this.showCollapse == "first" ? 0 : 1;
      let params = {
        context: context,
      };
      this.$client.addMployeeInfo(params).then((res) => {
        if (res.head.result == "200") {
          // this.form = {};
          if (this.showCollapse == "first") {
            if (this.curChangeType == "add") {
              this.firstQueryform = {};
              this.pageInfoFirst.pageCount = 0;
              this.pageInfoFirst.pageIndex = 1;
            }
            this.loadDataGeneralStaff();
          } else {
            if (this.curChangeType == "add") {
              this.secondQueryform = {};
              this.pageInfoSecond.pageCount = 0;
              this.pageInfoSecond.pageIndex = 1;
            }
            this.loadDataDriver();
          }
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功",
          });
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
    // 计算表格高度
    setHead(type) {
      if (type == "initialize") {
        this.canRendererTableHeader = this.customSettingFirstList;
        this.customSettingShowList = this.customSettingFirstList;
        this.canRendererTableHeaderSecond = this.customSettingSecondList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let staffOverviewInfo= this.$refs.staffOverviewInfo.$el.offsetHeight
        // let staffOverviewInfo = this.$refs.staffOverviewInfo.$el.offsetHeight;
        // let elRadioGroup = this.$refs.elRadioGroup.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        // this.TableHeight =
        //   maxh - th - paginationH - staffOverviewInfo - elRadioGroup - 100;
        this.TableHeight = maxh - (th + staffOverviewInfo + paginationH + 30 + 50)
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.stock-lunar-knot-manage {
  width: 100%;
  height: 100%;
}
</style>
