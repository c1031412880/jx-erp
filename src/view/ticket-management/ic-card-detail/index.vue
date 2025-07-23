<template>
  <div class="ic-card-detail">
    <sub-req ref="head" 
    @on-ok="onSubmit" 
    @on-chart-show="chartShow" 
    @on-btn-export="exportForm" 
    ></sub-req>

    <el-card v-show="chartChange" style="margin-bottom: 10px" v-loading="chartLoading">
      <div slot="header" class="clearfix">
        <span>
          {{form.start_time}} 至 {{form.end_time ? form.end_time.slice(0, 10) : ''}}
          刷卡总人次：{{summary.MonthTimes}}人
          总金额:{{summary.TotalMoney}}元 
        </span>
      </div>
      <div class="card-box-item">
        <bar-chart ref="barChart" ></bar-chart>
      </div>
    </el-card>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
      :isFixedEmptyPlaceholder="false">
      <!-- <template slot-scope="scope" slot="operation">
        <el-button slot="reference" type="text" size="mini" @click="onCheck(scope.data)">查看明细</el-button>
      </template> -->
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>
    <div class="dialog-box">
      <!-- 查看明细 -->
      <!-- <check ref="check" :formData.sync="formData" :dialogBool.sync="isShowCheckout"></check> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import barChart from "./component/bar-chart";
import check from "./component/passenger";
export default {
  name: "ic-card-detail",
  components: { subReq, barChart, check },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0
      },
      data: [],
      form: {},
      formData: {},
      loading: false,
      TableHeight: 500,
      chartLoading: false,
      frontFixedNum: 1,
      backFixedNum: 0,
      chartChange: true,
      isShowCheckout: false, //查看明细
      summary: {
        MonthTimes: 0,
        TotalMoney: 0
      },
      sumTotal:{ //约定某一列汇总合计自定义数据
        9: '',
        10: '',
      },
      sumColumnIndex:[9,10], //要定义的列的索引
      canRendererTableHeader: [
        {
          id: 1,
          label: "日期",
          prop: "Sdtate",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true
        },
        {
          id: 2,
          label: "自编号",
          prop: "BusNo",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true
        },
        {
          id: 4,
          label: "所属组织",
          prop: "DeptNo",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: "驾驶员",
          prop: "EName",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: "驾驶员工号",
          prop: "EmployeeName",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true
        },
        {
          id: 8,
          label: "支付类型",
          prop: "CardType",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true
        },
        {
          id: 9,
          label: "人次",
          prop: "MonthTimes",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true
        },
        {
          id: 10,
          label: "金额(元)",
          prop: "TotalMoney",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true
        },
        {
          id: 11,
          label: "生成时间",
          prop: "DCreatedDate",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true
        },
        {
          id: 12,
          label: "更新时间",
          prop: "InsTime",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true
        },
      ],
    };
  },
  
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    })
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.getChartData();
      this.loadData();
    },
    getChartData() {
      let params = {context: {}}
      params.context = this.form;
      this.chartLoading = true;
      this.$client.GetDayConHistogramsDayConsumptionDetail(params).then(req => {
        this.chartLoading = false;
        if (req.head.result === "200") {
          let label = [];
          let data = {
            车辆数: [],
            总金额: [],
            刷卡次数: [],
          };
          req.context.forEach(item => {
            label.push(item.date);
            data.车辆数.push(item.vehicle_count);
            data.总金额.push(item.total_moneys);
            data.刷卡次数.push(item.total_times_count);
          });
          this.$refs.barChart.setOptions({ label: label, data: data });
        } else {
          this.$refs.barChart.setOptions();
        }
      }).catch(err => {
        this.chartLoading = false;
      })
    },
    loadData() {
      this.loading = true;
      let params = {context: {}}
      params.context = this.form;
      params.context.page_index = this.pageInfo.pageIndex
      params.context.page_size = this.pageInfo.pageSize
      this.$client.ListDayConsumptionDetail(params).then(req => {
        // console.log(req);
        this.loading = false;
        if (req.head.result === "200") {
          this.data = req.context.list ? req.context.list : [];
          this.pageInfo.pageCount = req.context.total
          this.summary = Object.assign({}, req.context.summary)
          this.sumTotal = {
            9: req.context.summary.MonthTimes,
            10: req.context.summary.TotalMoney,
          }
        } else {
          this.data = [];
          this.pageInfo.pageCount = 0
        }
      }).catch(err => {
        this.loading = false;
        this.data = [];
        this.pageInfo.pageCount = 0
      })
    },
    chartShow(bool) {
      this.chartChange = bool;
      this.setHead();
    },
    // 查看明细
    onCheck(val) {
      console.log(val)
      this.formData = val
      this.isShowCheckout = true;
      this.$nextTick(() => {
        this.$refs.check.loadData({val:val});
      })
    },
    //导出
    exportForm() {
      if(this.data.length == 0) {
        this.$message({ message: "暂无数据", type: "warning" });
        return false
      }
      let params = {context: {}}
      params.context = this.form;
      params.context.page_index = this.pageInfo.pageIndex
      params.context.page_size = this.pageInfo.pageSize
      this.$client.ExportDayConsumptionDetail(content).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 分页切换事件
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = this.chartChange ? 500 : maxh - th - paginationH - 5
        // console.log(maxh,th,paginationH,this.TableHeight);
        
      }, 60);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.ic-card-detail {
  width: 100%;
  height: 100%;
}
.card-box-item{
    height: 300px 
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;

  .card-box-item{
    height: 300px * $NumWidth;
  }

</style>