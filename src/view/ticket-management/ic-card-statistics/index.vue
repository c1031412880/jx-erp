<template>
  <div class="ic-card-statistics">
    <div class="ic-card-statistics-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="按线路汇总" name="first" lazy>
          <sub-req
            ref="lineHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-export="exportExcel"
            @on-import="importExcel">
          </sub-req>

          <tr-vxe-table
            ref="lineTable"
            :selectionShow="false"
            :data="lineData"
            :tableHeaderList="lineCustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="3"
            :footerShow="true"
            :footerMethod="lineFooterMethod">
            <!-- :sumTotal="lineSumTotal"
            :sumColumnIndex="lineSumColumnIndex"
            <template slot-scope="scope" slot="total_fee">
              <el-button type="text" @click="getDetailData(scope.data, 'line_id')">{{ scope.data.total_fee }}</el-button>
            </template> -->
          </tr-vxe-table>

          <!-- <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="linePaginationH"
            :current-page="linePageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="linePageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="linePageInfo.pageCount">
          </el-pagination> -->
        </el-tab-pane>
        <el-tab-pane label="按车辆汇总" name="second" lazy>
          <sub-req
            ref="vehHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-export="exportExcel">
          </sub-req>

          <tr-vxe-table
            ref="vehTable"
            :selectionShow="false"
            :data="vehData"
            :tableHeaderList="vehCustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :backFixedNum="2"
            :footerShow="true"
            :frontFixedNum="frontFixedNum"
            :footerMethod="vehFooterMethod">
            <!-- <template slot-scope="scope" slot="total_fee">
              <el-button type="text" @click="getDetailData(scope.data, 'vehicle_id')">{{ scope.data.total_fee }}</el-button>
            </template> -->
          </tr-vxe-table>

          <!-- <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="vehPaginationH"
            :current-page="vehPageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="vehPageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="vehPageInfo.pageCount">
          </el-pagination> -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <information-dialog
      :dialogBool.sync="informationDialogShow"
      :requestData="requestData">
    </information-dialog>

    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="fileDialogVisible"
      :fileData="FileData"
      :typeMessage="'相同日期线路车辆记录'"
      @on-submit-excel="importICExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate, formatTime} from '@/utils/index'
import subReq from "./component/sub-req";
import fileDialog from "@/components/fileDialog/file-dialog";
import informationDialog from "./component/information-dialog"
export default {
  name: 'ic-card-statistics',
  components: {
    subReq,
    fileDialog,
    informationDialog
  },
  data() {
    return {
      // linePageInfo: {
      //   pageIndex: 1,
      //   pageSize: 20,
      //   pageCount: 0,
      // },
      // vehPageInfo: {
      //   pageIndex: 1,
      //   pageSize: 20,
      //   pageCount: 0,
      // },
      form: {},
      activeName: "first",
      lineData: [],
      vehData: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      informationDialogShow: false,
      requestData: {},
      lineFooterMethod: [],
      vehFooterMethod: [],
      fileDialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/IC卡导入模板.xlsx`,
      },
      httpGetObj: {
        'first': 'GetLineSummaryDayConsumptionDetail',
        'second': 'GetVehicleDayConsumptionDetail'
      },
      httpExportObj: {
        'first': 'ExportTotalLineDayConsumptionDetail',
        'second': 'ExportTotalVehicleDayConsumptionDetail'
      },
      lineSumColumnIndex: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
      // lineSumTotal: {
      //   3: '',4: '',5: '',6: '',7: '',8: '',9: '',10: '',11: '',12: '',13: '',14: '',
      //   15: '',16: '',17: '',18: '',19: '',20: '',21: '',22: '',23: ''
      // },
      vehSumColumnIndex: [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
      // vehSumTotal: {
      //   5: '',6: '',7: '',8: '',9: '',10: '',11: '',12: '',13: '',14: '',15: '',16: '',17: '',
      //   18: '',19: '',20: '',21: '',22: '',23: '', 24: '',25: '',26: ''
      // },
      lineCustomSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "Date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "线路",
          prop: "Line",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "现金",
          prop: "total_day_purchase",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "实体卡人次",
          prop: "PhysicalCardPersonCount",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "实体卡金额",
          prop: "PhysicalCardAmount",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "支付宝人次",
          prop: "AlipayPersonCount",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "支付宝金额",
          prop: "AlipayAmount",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "银联乘车码人次",
          prop: "UnionPayCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "银联乘车码金额",
          prop: "UnionPayCodeAmount",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "银联卡人次",
          prop: "UnionPayCardPersonCount",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "银联卡金额",
          prop: "UnionPayCardAmount",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "银联付款码人次",
          prop: "UnionPayPaymentCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "银联付款码金额",
          prop: "UnionPayPaymentCodeAmount",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "自发码人次",
          prop: "SelfIssuedCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "自发码金额",
          prop: "SelfIssuedCodeAmount",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "微信乘车码人次",
          prop: "WeChatCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "微信乘车码金额",
          prop: "WeChatCodeAmount",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "部标二维码人次",
          prop: "StandardQRCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "部标二维码金额",
          prop: "StandardQRCodeAmount",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "军休码人次",
          prop: "MilitaryRetireeCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "献血荣誉码人次",
          prop: "BloodDonationHonorCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "浙里老兵码人次",
          prop: "ZheliVeteranCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "合计人次",
          prop: "TotalPersonCount",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
        {
          id: 24,
          label: "合计金额",
          prop: "TotalAmount",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: false,
        },
      ],
      vehCustomSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "Date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "自编号",
          prop: "vechile_number",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "分公司",
          prop: "BranchCompany",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "现金",
          prop: "total_day_purchase",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "实体卡人次",
          prop: "PhysicalCardPersonCount",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "实体卡金额",
          prop: "PhysicalCardAmount",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "支付宝人次",
          prop: "AlipayPersonCount",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "支付宝金额",
          prop: "AlipayAmount",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "银联乘车码人次",
          prop: "UnionPayCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "银联乘车码金额",
          prop: "UnionPayCodeAmount",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "银联卡人次",
          prop: "UnionPayCardPersonCount",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "银联卡金额",
          prop: "UnionPayCardAmount",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "银联付款码人次",
          prop: "UnionPayPaymentCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "银联付款码金额",
          prop: "UnionPayPaymentCodeAmount",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "自发码人次",
          prop: "SelfIssuedCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "自发码金额",
          prop: "SelfIssuedCodeAmount",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "微信乘车码人次",
          prop: "WeChatCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "微信乘车码金额",
          prop: "WeChatCodeAmount",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "部标二维码人次",
          prop: "StandardQRCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "部标二维码金额",
          prop: "StandardQRCodeAmount",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "军休码人次",
          prop: "MilitaryRetireeCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "献血荣誉码人次",
          prop: "BloodDonationHonorCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
        {
          id: 24,
          label: "嘉兴人才码人次",
          prop: "StandardQRCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: false,
        },
        {
          id: 25,
          label: "浙里老兵码人次",
          prop: "ZheliVeteranCodePersonCount",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
        {
          id: 26,
          label: "合计人次",
          prop: "TotalPersonCount",
          width: "130",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
        {
          id: 27,
          label: "合计金额",
          prop: "TotalAmount",
          width: "130",
          align: "center",
          signIndex: 26,
          sortable: false,
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(val) {
      this.form = Object.assign({}, val);
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      // params.page_index = this.activeName === 'first' ? this.linePageInfo.pageIndex : this.vehPageInfo.pageIndex;
      // params.page_size = this.activeName === 'first' ?  this.linePageInfo.pageSize : this.vehPageInfo.pageSize;
      this.$client[this.httpGetObj[this.activeName]](params).then(res => {
        if(res.head.result == '200') {
          this.loading = false;
          let pop = res.context.length ? res.context.pop() : {}
          let info = JSON.parse(JSON.stringify(res.context));
          if(this.activeName == 'first') {
            this.lineData = info.length ? info : [];
            this.lineFooterMethod = [pop]
          }else{
            this.vehData = info.length ? info : [];
            this.vehFooterMethod = [pop]
            // console.log(pop);
          }
        }else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 导出
    exportExcel(form) {
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      // params.page_index = this.activeName === 'first' ? this.linePageInfo.pageIndex : this.vehPageInfo.pageIndex;
      // params.page_size = this.activeName === 'first' ?  this.linePageInfo.pageSize : this.vehPageInfo.pageSize;
      this.$client[this.httpExportObj[this.activeName]](params)
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
    // 导入
    importExcel() {
      this.fileDialogVisible = true;
    },
    // 导入信息Excel
    importICExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      console.log(params)
      this.$client.ICImportDayPurse(params).then((res) => {
        if (res.head.result == "200") {
          this.form = {};
          // 重置信息
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.$refs.head.resetForm();
          this.loadData();
          this.fileDialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.fileDialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });
        }
      });
    },
    // 查看明细
    getDetailData(row, type) {
      console.log(row, type);
      this.requestData = {}
      // this.requestData.date_start = row.date.slice(0, 4) + '-' + row.date.slice(4, 6) + '-' + row.date.slice(6, 8) + ' 00:00:00'
      // this.requestData.date_end = row.date.slice(10, 14) + '-' + row.date.slice(14, 16) + '-' + row.date.slice(16, 18) + ' 23:59:59'
      if(type === 'line_id') {
        this.requestData.line_id =  row.line_id
      }else {
        this.requestData.vehicle_ids = [row.vehicle_id]
      }
      if(row.date) {
        let year = row.date.slice(0,4)
        let month = row.date.slice(5,7)
        this.requestData.date_start = formatTime(new Date(year, month - 1, 1)) + ' 00:00:00' 
        this.requestData.date_end = formatTime(new Date(year, month, 0)) + ' 23:59:59'
        this.informationDialogShow = true
        // console.log(year, month);
      }
      // console.log(this.requestData);
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      if(this.activeName == 'first') {
        this.linePageInfo.pageIndex = idx
      }else{
        this.vehPageInfo.pageIndex = idx
      }
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      if(this.activeName == 'first') {
        this.linePageInfo.pageIndex = 1
        this.linePageInfo.pageSize = sizes;
        this.linePageInfo.pageCount = 0;
      }else{
        this.vehPageInfo.pageIndex = 1
        this.vehPageInfo.pageSize = sizes;
        this.vehPageInfo.pageCount = 0;
      }
      this.loadData();
    },
    // 计算表格高度 和初始化表头
    setHead(num) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let fh = num ? num : 0;
        let th = this.activeName === 'first' ? this.$refs.lineHead.$el.offsetHeight : this.$refs.vehHead.$el.offsetHeight;
        // let ph = this.activeName === 'first' ?  this.$refs.linePaginationH.$el.offsetHeight : this.$refs.vehPaginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - 55 - fh;
        // console.log(this, maxh, th, ph);
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.ic-card-statistics
  height: 100%
  width: 100%

</style>