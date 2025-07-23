<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="付款合同" name="first" lazy>
      <sub-req 
        ref="paySubReq" 
        :bigBoxName="bigBoxName"
        :activeName="activeName"
        @on-ok="onSubmit"
        @on-set="settingDialogVisible = true"
        @on-import="importFile"
        @on-export="exportExcel"
      ></sub-req>
      <tr-table
        :selectionShow="true"
        :data="payData"
        :loading="loading"
        :isShowSummary="true"
        :TableHeight="TableHeight"
        :isShowBottomOptions="false"
        :frontFixedNum="frontFixedNum"
        :tableHeaderList="payCanRendererTableHeader"
        :backFixedNum="backFixedNum">
        <template slot-scope="scope" slot="HandleDeptName">
          <span v-if="!!scope.data.updateDept">{{ scope.data.HandleDeptName }}</span>
          <get-department-select-tree
            ref="personalTree1"
            v-else
            v-model="scope.data.HandleDeptId"
            :isShowCheckbox="false"
            :placeholder="'请选择导入部门'"
            :isContainEmp="false"
            :show_all="false"
            :isExportMultiple="false"
            :isCheckStrictly="false"
          ></get-department-select-tree>
        </template>
        <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="updateRowInfo(scope.data, scope.index)">
              {{ !!scope.data.updateDept ? '修改提醒部门' : '保存提醒部门'}}
            </el-button>
            <!-- <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'detail')" v-if="$isPowerShow('search')">查看</el-button>
            <el-popconfirm
              @confirm="deleteRowInfo(scope.data)"
              title="确定删除此条记录吗？"
              v-if="$isPowerShow('del')">
              <el-button slot="reference" type="danger" size="mini" :disabled="!!scope.data.house_name || !!scope.data.vehicle_name" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm> -->
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="payHandleCurrentChange"
        @size-change="payHandleSizeChange"
        ref="payPaginationH"
        :current-page="payPageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="payPageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="payPageInfo.pageCount"
      ></el-pagination>
    </el-tab-pane>
    <el-tab-pane label="收款合同" name="second" lazy>
      <sub-req 
        ref="colSubReq" 
        :bigBoxName="bigBoxName"
        :activeName="activeName"
        @on-ok="onSubmit"
        @on-import="filedialogVisible = true"
        @on-export="exportExcel"
      ></sub-req>
      <tr-table
        :selectionShow="false"
        :data="colData"
        :loading="loading"
        :isShowSummary="true"
        :TableHeight="TableHeight"
        :isShowBottomOptions="false"
        :frontFixedNum="frontFixedNum"
        :tableHeaderList="colCanRendererTableHeader"
        :backFixedNum="backFixedNum">
        <template slot-scope="scope" slot="HandleDeptName">
          <span v-if="!!scope.data.updateDept">{{ scope.data.HandleDeptName }}</span>
          <get-department-select-tree
            ref="personalTree2"
            v-else
            v-model="scope.data.HandleDeptId"
            :isShowCheckbox="false"
            :placeholder="'请选择导入部门'"
            :isContainEmp="false"
            :show_all="false"
            :isExportMultiple="false"
            :isCheckStrictly="false"
          ></get-department-select-tree>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="updateRowInfo(scope.data, scope.index)">
              {{ !!scope.data.updateDept ? '修改提醒部门' : '保存提醒部门'}}
            </el-button>
            <!-- <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'detail')" v-if="$isPowerShow('search')">查看</el-button>
            <el-popconfirm
              @confirm="deleteRowInfo(scope.data)"
              title="确定删除此条记录吗？"
              v-if="$isPowerShow('del')">
              <el-button slot="reference" type="danger" size="mini" :disabled="!!scope.data.house_name || !!scope.data.vehicle_name" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm> -->
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="colHandleCurrentChange"
        @size-change="colHandleSizeChange"
        ref="colPaginationH"
        :current-page="colPageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="colPageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="colPageInfo.pageCount"
      ></el-pagination>
    </el-tab-pane>

    <reminder-setting-dialog
      :dialogBool.sync="settingDialogVisible"
    ></reminder-setting-dialog>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData= "activeName === 'first' ? FileData1 : FileData2"
      :typeMessage= "'合同编号'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </el-tabs>
</template>

<script>
import subReq from './sub-req';
import reminderSettingDialog from './reminder-setting-dialog';
import fileDialog from "@/components/fileDialog/file-dialog";
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {  
  components: {
    subReq,
    fileDialog,
    reminderSettingDialog,
    getDepartmentSelectTree
  },
  props: {
    bigBoxName: {
      type: String,
      default: "second",
    },
  },
  data() {
    return {
      payPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      colPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      importType: 1,
      activeName: 'first',
      form: {},
      payData: [],
      colData: [],
      loading: false,
      TableHeight: 400,
      frontFixedNum: 2, //前几行固定
      backFixedNum: 2, //后几行固定
      payCanRendererTableHeader: null,
      colCanRendererTableHeader: null,
      settingDialogVisible: false,
      filedialogVisible: false,
      FileData2: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/收款合同导入模版.xlsx",
      },
      FileData1: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/付款合同导入模版.xlsx",
      },
      payCustomSettingList: [
        {
          id: 1,
          label: "合同状态",
          prop: "ContractState",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "合同编号",
          prop: "ContractNumber",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "收款单位",
          prop: "PaymentUnit",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "第三方单位名称",
          prop: "ThirdPartyName",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "合同备案号",
          prop: "ContractRecordNumber",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "名称",
          prop: "Name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "合同名称",
          prop: "ContractName",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "合同类型",
          prop: "ContractType",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "合同金额",
          prop: "ContractAmount",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "关联收款合同编号",
          prop: "RelatedPaymentContractNumber",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "结算及付款情况",
          prop: "collection_status",
          width: "100",
          align: "center",
          signIndex: 10,
          nestedTablesHeader: [
            {
              id: 1,
              label: "结算金额",
              prop: "SettlementAmount",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 2,
              label: "进项发票金额",
              prop: "InvoiceAmount",
              width: "160",
              align: "center",
              signIndex: 1,
            },
            {
              id: 3,
              label: "实付申请金额",
              prop: "AppliedPaymentAmount",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 4,
              label: "实付金额",
              prop: "ActualPaymentAmount",
              width: "160",
              align: "center",
              signIndex: 3,
            },
            {
              id: 5,
              label: "按合同付款率%",
              prop: "PaymentRateByContract",
              width: "100",
              align: "center",
              signIndex: 4,
            },
            {
              id: 6,
              label: "按结算付款率%",
              prop: "PaymentRateBySettlement",
              width: "100",
              align: "center",
              signIndex: 5,
            },
          ]
        },
        {
          id: 12,
          label: "欠款情况",
          prop: "arrears",
          width: "100",
          align: "center",
          signIndex: 11,
          nestedTablesHeader: [
            {
              id: 1,
              label: "按结算未付",
              prop: "UnpaidBySettlement",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 2,
              label: "按发票未付",
              prop: "UnpaidByInvoice",
              width: "160",
              align: "center",
              signIndex: 1,
            },
            {
              id: 3,
              label: "按合同约定未付",
              prop: "UnpaidByContract",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 4,
              label: "按应付未付",
              prop: "UnpaidByDue",
              width: "160",
              align: "center",
              signIndex: 3,
            }
          ]
        },
        {
          id: 13,
          label: "变更情况",
          prop: "ChangeStatus",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "签订日期",
          prop: "SignDate",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "合同预计完结日期",
          prop: "EstimatedCompletionDate",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "经办日期",
          prop: "HandleDate",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "招标项目",
          prop: "BiddingProject",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "经办人",
          prop: "Handler",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "经办部门",
          prop: "Department",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "集团单位",
          prop: "GroupUnit",
          width: "150",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "付款单位",
          prop: "Payer",
          width: "150",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "审批状态",
          prop: "ApprovalStatus",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "归档状态",
          prop: "ArchiveStatus",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
        {
          id: 24,
          label: "编号",
          prop: "Code",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: false,
        },
        {
          id: 25,
          label: "导入人",
          prop: "CreateUser",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
        {
          id: 26,
          label: "导入部门",
          prop: "ImportDepartment",
          width: "130",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
        {
          id: 27,
          label: "导入时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 26,
          sortable: false,
        },
        // {
        //   id: 25,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 24,
        //   sortable: false,
        // },
      ],
      colCustomSettingList: [
        {
          id: 1,
          label: "合同状态",
          prop: "ContractState",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "合同编号",
          prop: "ContractNumber",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "项目名称",
          prop: "ProjectName",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "合同备案号",
          prop: "ContractRecordNumber",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "付款单位",
          prop: "Payer",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "第三方单位名称",
          prop: "ThirdPartyName",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "合同名称",
          prop: "ContractName",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "合同金额",
          prop: "ContractAmount",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "关联收款合同编号",
          prop: "RelatedPaymentContractNumber",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "结算及收款情况",
          prop: "collection_status",
          width: "100",
          align: "center",
          signIndex: 9,
          nestedTablesHeader: [
            {
              id: 1,
              label: "结算金额",
              prop: "SettlementAmount",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 2,
              label: "开票金额",
              prop: "InvoicedAmount",
              width: "160",
              align: "center",
              signIndex: 1,
            },
            {
              id: 3,
              label: "收款金额",
              prop: "ReceivedAmount",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 4,
              label: "按合同收款率%",
              prop: "ReceiptRateByContract",
              width: "100",
              align: "center",
              signIndex: 3,
            },
            {
              id: 5,
              label: "按结算收款率%",
              prop: "ReceiptRateBySettlement",
              width: "100",
              align: "center",
              signIndex: 4,
            },
            {
              id: 6,
              label: "按发票收款率%",
              prop: "ReceiptRateByInvoice",
              width: "100",
              align: "center",
              signIndex: 5,
            },
          ]
        },
        {
          id: 11,
          label: "未收情况",
          prop: "arrears",
          width: "100",
          align: "center",
          signIndex: 10,
          nestedTablesHeader: [
            {
              id: 1,
              label: "按合同未收",
              prop: "UnreceivedByContract",
              width: "160",
              align: "center",
              signIndex: 2,
            },
            {
              id: 2,
              label: "按结算未收",
              prop: "UnreceivedBySettlement",
              width: "160",
              align: "center",
              signIndex: 1,
            },
            {
              id: 3,
              label: "按发票未收",
              prop: "UnreceivedByInvoice",
              width: "160",
              align: "center",
              signIndex: 2,
            }
          ]
        },
        {
          id: 12,
          label: "变更情况",
          prop: "ChangeStatus",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "签订日期",
          prop: "SignDate",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "合同预计完结日期",
          prop: "EstimatedCompletionDate",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "经办日期",
          prop: "HandleDate",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "经办人",
          prop: "Handler",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "经办部门",
          prop: "Department",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "集团单位",
          prop: "GroupUnit",
          width: "150",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "法人单位",
          prop: "LegalPersonUnit",
          width: "150",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "收款单位",
          prop: "PaymentUnit",
          width: "150",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "审批状态",
          prop: "ApprovalStatus",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "归档状态",
          prop: "ArchiveStatus",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "编号",
          prop: "Code",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
        {
          id: 24,
          label: "导入人",
          prop: "CreateUser",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: false,
        },
        {
          id: 25,
          label: "导入部门",
          prop: "ImportDepartment",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
        {
          id: 26,
          label: "导入时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
        // {
        //   id: 24,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 23,
        //   sortable: false,
        // },
      ],
    };
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
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      if(this.activeName === 'first') {
        this.payloadData();
      }else {
        this.colloadData();
      }
    },
    // 获取列表
    payloadData() {
      this.loading = true;
      let params = {context: {}}
      params.context = Object.assign({},this.form)
      params.context.type = 1;
      params.context.page_index = this.payPageInfo.pageIndex;
      params.context.page_size = this.payPageInfo.pageSize;
      params.context.query_type = this.bigBoxName === 'first' ? 1 :
        this.bigBoxName === 'second' ? 2 : 3;
      this.$client.GetRecordErpContractRemind(params)
      .then(res => {
        if (res.head.result == "200") {
          this.payData = res.context.list.map(item => {
            return {
              ...item,
              updateDept: 'true'
            }
          });
          this.payPageInfo.pageCount = res.context.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
      })
    },
    // 获取列表
    colloadData() {
      this.loading = true;
      let params = {context: {}}
      params.context = Object.assign({},this.form)
      params.context.type = 2;
      params.context.page_index = this.colPageInfo.pageIndex;
      params.context.page_size = this.colPageInfo.pageSize;
      params.context.query_type = this.bigBoxName === 'first' ? 1 :
        this.bigBoxName === 'second' ? 2 : 3;
      this.$client.GetRecordErpContractRemind(params)
      .then(res => {
        if (res.head.result == "200") {
          this.colData = res.context.list.map(item => {
            return {
              ...item,
              updateDept: 'true'
            }
          });
          // console.log(this.colData);
          this.colPageInfo.pageCount = res.context.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
      })
    },
    importFile(type) {
      this.importType = type;
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      formData.append("contract_type", this.importType);
      let params = formData;
      let objHttp = {
        'first': 'PayImportErpContractRemind',
        'second': 'ReceivedImportErpContractRemind',
      };
      this.$client[objHttp[this.activeName]](params)
      .then(res => {
        if(res.head.result == "200") {
          if(this.activeName === 'first') {
            this.$refs.paySubReq.resetForm();
          }else {
            this.$refs.colSubReq.resetForm();
          }
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })
        }
      })
    },
    // 导出
    exportExcel() {
      let objHttp = {
        'first': 'PayExportErpContractRemind',
        'second': 'ReceivedExportErpContractRemind',
      };
      let params = Object.assign({}, this.form);
      params.type = this.activeName === 'first' ? 1 : 2;
      params.query_type = this.bigBoxName === 'first' ? 1 :
        this.bigBoxName === 'second' ? 2 : 3;
      this.$client[objHttp[this.activeName]](params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 修改
    updateRowInfo(row, index) {
      let str = this.activeName === 'first' ? 'payData' : 'colData';
      if(!!this[str][index].updateDept) { 
        this.$set(this[str][index], 'updateDept', false)
      }else {
        let params = {context: {}};
        params.context.id = row.id;
        params.context.dept_id = row.HandleDeptId;
        this.$client.UpdateHandleDeptErpContractRemind(params).then(res => {
          if(res.head.result == '200') {
            if(this.activeName === 'first') {
              this.payloadData();
            }else {
              this.colloadData();
            }
            this.$message({type: 'success', message: '修改成功'})
          }else {
            this.$message({type: 'error', message: '修改失败'})
          }
        })
      }
    },
    // 分页切换事件
    payHandleCurrentChange(idx) {
      this.payPageInfo.pageIndex = idx
      this.payloadData()
    },
    // 切换每页条数
    payHandleSizeChange(sizes) {
      this.payPageInfo.pageIndex = 1;
      this.payPageInfo.pageSize = sizes;
      this.payPageInfo.pageCount = 0;
      this.payloadData();
    },
    // 分页切换事件
    colHandleCurrentChange(idx) {
      this.colPageInfo.pageIndex = idx
      this.colloadData()
    },
    // 切换每页条数
    colHandleSizeChange(sizes) {
      this.colPageInfo.pageIndex = 1;
      this.colPageInfo.pageSize = sizes;
      this.colPageInfo.pageCount = 0;
      this.colloadData();
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        if(this.bigBoxName === 'first') {
          this.payCanRendererTableHeader = this.payCustomSettingList;
          this.colCanRendererTableHeader = this.colCustomSettingList;
        }else if(this.bigBoxName === 'second') {
          let lastInfo = [
            {
              id: 28,
              label: "提醒部门名称",
              prop: "HandleDeptName",
              width: "180",
              align: "center",
              signIndex: 27,
              sortable: false,
            },
            {
              id: 29,
              label: "操作",
              prop: "operation",
              width: "160",
              align: "center",
              signIndex: 28,
              sortable: false,
            },
          ]
          this.payCanRendererTableHeader = [...this.payCustomSettingList, ...lastInfo];
          this.colCanRendererTableHeader = [...this.colCustomSettingList, ...lastInfo];
        }else {
          let pushInfo = [
            {
              id: 28,
              label: "剩余天数",
              prop: "LostDay",
              width: "130",
              align: "center",
              signIndex: 27,
              sortable: false,
            }
          ]
          let lastInfo = [
            {
              id: 29,
              label: "提醒部门名称",
              prop: "HandleDeptName",
              width: "180",
              align: "center",
              signIndex: 28,
              sortable: false,
            },
            {
              id: 30,
              label: "操作",
              prop: "operation",
              width: "160",
              align: "center",
              signIndex: 29,
              sortable: false,
            },
          ]
          this.payCanRendererTableHeader = [...pushInfo, ...this.payCustomSettingList, ...lastInfo];
          this.colCanRendererTableHeader = [...pushInfo, ...this.colCustomSettingList, ...lastInfo];
        }
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.activeName === 'first' ?
          this.$refs.paySubReq.$el.offsetHeight :
          this.$refs.colSubReq.$el.offsetHeight
        let ph = this.activeName === 'first' ?
          this.$refs.payPaginationH.$el.offsetHeight :
          this.$refs.colPaginationH.$el.offsetHeight
        this.TableHeight = maxh - th - ph - 70
      }, 60)
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-tabs {
  height: 100%;
}
</style>