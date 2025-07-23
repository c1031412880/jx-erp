<template>
  <div class="car-insurance-manage">
    <div class="car-insurance-manage-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="车辆保险记录" name="first">
          <sub-req
            ref="head"
            @on-ok="onSubmit"
            @on-remind="openRemindPage"
            @on-add="openSetInfoPage"
            @on-import="openBatchExportPop"
            @on-export="exportExcel"
            @on-delete="batchesDelete"
            @open-setting-Page="openSettingPageEvent"
          ></sub-req>
          <div>
            <tr-table
              :selectionShow="true"
              :data="insuranceData"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="firstTableHeight"
              :loading="loading || headerLoading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
              @on-select-change-row="selectedList"
            >
              <template slot-scope="scope" slot="compulsory_date">
                <span
                  v-show="
                    scope.data.compulsory_insurance_start && scope.data.compulsory_insurance_end
                  "
                >
                  {{
                    scope.data.compulsory_insurance_start +
                    '~' +
                    scope.data.compulsory_insurance_end
                  }}
                </span>
              </template>
              <template slot-scope="scope" slot="commercial_date">
                <span
                  v-show="
                    scope.data.commercial_insurance_start && scope.data.commercial_insurance_end
                  "
                >
                  {{
                    scope.data.commercial_insurance_start +
                    '~' +
                    scope.data.commercial_insurance_end
                  }}
                </span>
              </template>
              <template slot-scope="scope" slot="carrier_date">
                <span
                  v-show="scope.data.carrier_liability_start && scope.data.carrier_liability_end"
                >
                  {{ scope.data.carrier_liability_start + '~' + scope.data.carrier_liability_end }}
                </span>
              </template>
              <template slot-scope="scope" slot="operation">
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  @click="editRowInfo(scope.data, 'edit')"
                  v-if="$isPowerShow('edit')"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  @click="editRowInfo(scope.data, 'detail')"
                >
                  查看
                </el-button>
                <el-popconfirm
                  v-if="$isPowerShow('del')"
                  @confirm="deleteCurRowInfo(scope.data)"
                  title="是否确删除此条记录？"
                >
                  <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </tr-table>
          </div>
          <el-pagination
            style="margin: 5px 0; display: flex; justify-content: flex-end"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="pageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="pageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageInfo.pageCount"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`即将到期车辆(${secondPageInfo.pageCount})`" name="second">
          <div>
            <tr-table
              :selectionShow="false"
              :data="expireVehicleData"
              :tableHeaderList="secondcanRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="secondTableHeight"
              :loading="secondLoading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
            >
              <!-- <template slot-scope="scope" slot="state_name">
                <span v-if="scope.data.state_name" :style="`color:${scope.data.state >= 0? '#F59A23':'#D9001B'}`">{{scope.data.state_name}}</span>
              </template> -->
              <template slot-scope="scope" slot="compulsory_date">
                <span
                  v-show="
                    scope.data.compulsory_insurance_start && scope.data.compulsory_insurance_end
                  "
                >
                  {{
                    scope.data.compulsory_insurance_start +
                    '~' +
                    scope.data.compulsory_insurance_end
                  }}
                </span>
              </template>
              <template slot-scope="scope" slot="commercial_date">
                <span
                  v-show="
                    scope.data.commercial_insurance_start && scope.data.commercial_insurance_end
                  "
                >
                  {{
                    scope.data.commercial_insurance_start +
                    '~' +
                    scope.data.commercial_insurance_end
                  }}
                </span>
              </template>
              <template slot-scope="scope" slot="carrier_date">
                <span
                  v-show="scope.data.carrier_liability_start && scope.data.carrier_liability_end"
                >
                  {{ scope.data.carrier_liability_start + '~' + scope.data.carrier_liability_end }}
                </span>
              </template>
              <template slot-scope="scope" slot="operation">
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  @click="addRenewalInsuranceInfo(scope.data, 'renewal')"
                  v-if="$isPowerShow('edit')"
                >
                  续保
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  @click="checkHistoryInsuranceInfo(scope.data, 'history')"
                >
                  查看历史保单
                </el-button>
              </template>
            </tr-table>
          </div>
          <el-pagination
            style="margin: 5px 0; display: flex; justify-content: flex-end"
            @current-change="secondHandleCurrentChange"
            @size-change="secondHandleSizeChange"
            ref="paginationH"
            :current-page="secondPageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="secondPageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="secondPageInfo.pageCount"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="vehicle-mileage-dialog">
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'相同车牌号'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
      <set-info-dialog
        ref="setInfoDialog"
        :dialogBool.sync="isShowSetInfoDialog"
        :curChangeType="curChangeType"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";

export default {
  name: "car-insurance-manage",
  components: {
    subReq,
    setInfoDialog,
    fileDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//保险记录
      secondPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//即将到期车辆
      firstTableHeight: 500,
      secondTableHeight: 500,
      form:{},
      activeName: "first",
      insuranceData: [], //保险记录
      expireVehicleDataTotal:[], //全部的到期车辆
      expireVehicleData: [], //到期车辆
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingListOld: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "投保日期",
          prop: "insurance_start",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "到期日期",
          prop: "insurance_end",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "保险种类",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "投保金额",
          prop: "insure_fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "实付金额",
          prop: "actual_fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "保险公司",
          prop: "company_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "保险单号",
          prop: "insurance_code",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
      ],
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车型",
          prop: "vehicle_model",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "保险公司",
          prop: "commercial_insurance_company_name",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "交强险(元)",
          prop: "compulsory_insurance",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "三者险(元)",
          prop: "third_party_insurance",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "车损险(元)",
          prop: "collision_insurance",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "承运人责任险(元)",
          prop: "carrier_liability_insurance",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "车船税(元)",
          prop: "vehicle_vessel_tax",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "承保人数(人)",
          prop: "policy_holder_count",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "交强险期限",
          prop: "compulsory_date",
          width: "260",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "交强险保单号",
          prop: "compulsory_code",
          width: "260",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "商业险期限",
          prop: "commercial_date",
          width: "260",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "商业险保单号",
          prop: "commercial_code",
          width: "260",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "承运险期限",
          prop: "carrier_date",
          width: "260",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "承运险保单号",
          prop: "carrier_code",
          width: "260",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "合计保费",
          prop: "total_premium",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "打款日期",
          prop: "fee_date",
          width: "260",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
      ],
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible:false,
      loading: false,
      secondLoading: false,
      secondcanRendererTableHeaderOld:[
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "保险种类",
          prop: "type_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "最近保险日期",
          prop: "insurance_start",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "到期日期",
          prop: "insurance_end",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      secondcanRendererTableHeader:[
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "交强险期限",
          prop: "compulsory_date",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "交强险状态",
          prop: "compulsory_insurance_state",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "商业险期限",
          prop: "compulsory_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "商业险状态",
          prop: "commercial_insurance_state",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        // {
        //   id: 8,
        //   label: "车损险期限",
        //   prop: "state_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        // {
        //   id: 9,
        //   label: "车损险状态",
        //   prop: "state_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 8,
        //   sortable: false,
        // },
        {
          id: 8,
          label: "承运人险期限",
          prop: "carrier_date",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "承运人险状态",
          prop: "carrier_liability_state",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ],
      selectedRecodeId:[],
      filedialogVisible: false, //打开导入弹窗
      isShowSetInfoDialog: false, //是否显示设置弹窗
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/车辆保险记录模板.xlsx`,
      },
      curChangeType: "add", //编辑还是添加
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
    this.loadData();
    this.loadInsuranceEndData();
    this.$nextTick(() => {
      this.setHead()
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
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
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
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 车辆保险数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageVehicleInsurance(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.insuranceData = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
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
    // 即将到期车辆数据加载 //前端自己分页
    loadInsuranceEndData() {
      this.secondLoading = true;
      this.$client.getInsuranceEndVehicle()
        .then(res => {
          if (res.head.result == "200") {
            this.expireVehicleDataTotal = res.context;
            this.expireVehicleData = this.expireVehicleDataTotal.slice(this.secondPageInfo.pageIndex-1,this.secondPageInfo.pageSize);
            this.secondPageInfo.pageCount = this.expireVehicleDataTotal.length;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.secondLoading = false
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 打开到期提醒设置规则
    openRemindPage() {
      this.$router.push({
        name:'maintenance-rules-setting',
        params:{
          ruleType:'first'
        }
      })
    },
    // 添加
    openSetInfoPage() {
      this.curChangeType = "add";
      this.isShowSetInfoDialog = true;
    },
    // 保存、编辑车辆保险信息
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curChangeType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else if(this.curChangeType == "edit") {
        successrMessage = "编辑成功";
      }else if(this.curChangeType == "renewal") {
        successrMessage = "续保成功";
      }
      // console.log(parmas)
      // return
      this.$client
        .addVehicleInsurance(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            if(this.curChangeType == "renewal") {
              // 更新车辆到期提醒
              this.loadInsuranceEndData();
            }
            this.isShowSetInfoDialog = false;
            this.$message({
              showClose: true,
              message: successrMessage,
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
        .catch((err) => {});
    },
    // 勾选中的ID
    selectedList(mileDetailList) {
      this.selectedRecodeId = [];
      mileDetailList.forEach((item,index) => {
        this.selectedRecodeId.push(item.id)
      });
    },
    // 编辑查看
    editRowInfo(row,type) {
      this.curChangeType = type;
      this.isShowSetInfoDialog = true
      this.$refs.setInfoDialog.setData(row)
    },
    // 添加续保
    addRenewalInsuranceInfo(row,type) {
      this.curChangeType = type;
      this.isShowSetInfoDialog = true
      this.$refs.setInfoDialog.setData(row)
    },
    // 查看车辆保险历史记录
    checkHistoryInsuranceInfo(row,type) {
      this.curChangeType = type;
      this.isShowSetInfoDialog = true
      this.$refs.setInfoDialog.checkHistoryInsuranceList(row)
    },
    // 批量删除
    batchesDelete() {
      if(this.selectedRecodeId.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要删除的',
          type: "warning",
        });
        return
      }
      if(this.selectedRecodeId.length > 0) {
        this.deleteCurRowInfo(null);
      }
    },
    // 数据删除
    deleteCurRowInfo(form) {
      let parmas = {
        context:[]
      };
      if(!!form) {
        parmas.context.push(form.id)
      }else{
        parmas.context = this.selectedRecodeId;
      }
      // alert(JSON.stringify(parmas))
      // return
      this.$client
      .deleteVehicleInsurance(parmas)
      .then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: successrMessage,
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
      .catch((err) => {});

    },
    // 刷新列表
    refreshTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 10;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 打开自定义表头的弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 打开导入文件弹窗
    openBatchExportPop() {
      this.filedialogVisible = true;
    },
    // 明细分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 明细分页切换事件
    secondHandleCurrentChange(idx) {
      this.secondPageInfo.pageIndex = idx;
      this.expireVehicleData = this.expireVehicleDataTotal.slice((idx-1)*this.secondPageInfo.pageSize,idx*this.secondPageInfo.pageSize)
      // this.loadInsuranceEndData();
    },
    // 切换每页条数
    secondHandleSizeChange(sizes) {
      this.secondPageInfo.pageIndex = 1;
      this.secondPageInfo.pageSize = sizes;
      this.loadInsuranceEndData();
    },
    // 导入excel
    onSubmitExcel(val) {
      // console.log(JSON.stringify(exportInfo))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.importVehicleInsurance(params)
      .then(res => {
        console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.refreshTableList();
          this.$message({ message: "导入成功", type: "success" });
          this.filedialogVisible = false;
        } else if(res.head.result == "205") {
          this.filedialogVisible = false;
          if(!!res.context && res.context.length > 0) {
            let errorData = [];
            let list = res.context
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `导入错误提示(共${list.length}条)`,
              message: h('div',{ style: `height: 300px;${list.length > 12?'overflow-y: scroll':''}`}, errorData),
              confirmButtonText: '确定',
            })
          }
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
          // this.$message({ message: "导入失败", type: "error" });
        }
      }).catch(err => {
        this.$message({ message: "导入失败", type: "error" });
      })
    },
    // 导出
    exportExcel() {
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedRecodeId ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportVehicleInsurance(params)
      .then(res => {
         if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ message: "导出成功", type: "success" });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.$message({ message: "导出失败", type: "error" });
      })
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.firstTableHeight = maxh - th - 90;
        // // console.log(this.detailTableHeight);
        this.secondTableHeight = maxh - 90;
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.car-insurance-manage {
  width: 100%;
  height: 100%;
}

.car-insurance-manage-content /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.car-insurance-manage-content /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

.car-insurance-manage /deep/ .el-pagination {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}

.button-total{
  justify-content space-between
}
.button-total-right{
  align-items center
}
</style>
