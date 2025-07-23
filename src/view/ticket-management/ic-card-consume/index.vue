<template>
  <div class="charge-summary">
    <sub-req ref="head" 
    @on-chart-show="chartShow" 
    @on-ok="onSubmit" 
    ></sub-req>

    <el-card v-show="chartChange" style="margin-bottom: 10px" v-loading="chartLoading">
      <div slot="header" class="clearfix">
        <span>
          {{form.begin}} 至 {{form.end}}
          刷卡总人次：{{summary.total_swip}}人
          总金额:{{summary.total_money}}元
        </span>
      </div>
      <div class="card-box-item">
        <bar-chart ref="barChart" ></bar-chart>
      </div>
    </el-card>
    <!-- <tr-table
      :selectionShow="true"
      :data="data.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    > -->
     <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isFixedEmptyPlaceholder="false"
    >
      <template slot-scope="scope" slot="operation">
        <el-button slot="reference" type="text" size="mini" @click="onCheck(scope.data)">查看明细</el-button>
      </template>
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

    <!-- <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      ref="paginationH"
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :current-page="currentPage" 
      :page-sizes="pageSizes" 
      :page-size="PageSize" 
      layout="total, sizes, prev, pager, next, jumper" 
      :total="totalCount">
    </el-pagination> -->
    <div class="dialog-box">
      <!-- 查看明细 -->
      <check ref="check" :formData.sync="formData" :dialogBool.sync="isShowCheckout"></check>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import barChart from "./component/bar-chart";
import check from "./component/passenger";
import { getDate } from "@/utils/index";

export default {
  name: "ic-card-consume",
  components: { subReq, barChart, check },
  data() {
    return {
      // 总数据
      tableData:[],
      // 默认显示第几页
      currentPage:1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount:1,
      // 个数选择器（可修改）
      pageSizes:[10,20,30,40,100],
      // 默认每页显示的条数（可修改）
      PageSize:100,
      cz:'',
      data: [],
      formData:{
      },
      isShowCheckout: false, //查看明细
      canRendererTableHeader: [
        {
          id: 1,
          label: "日期",
          prop: "txndate",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true
        },
        {
          id: 3,
          label: "车牌号",
          prop: "busid",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true
        },
        {
          id: 4,
          label: "刷卡人次",
          prop: "swip_cout",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: "刷卡金额",
          prop: "swip_money",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false
        }
      ],
      TableHeight: 500,
      loading: false,
      chartLoading: false,
      frontFixedNum: 1,
      backFixedNum: 1,
      chartChange: true,
      form: {
        begin: "",
        end: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0
      },
      summary: {
        total_swip: 0,
        total_money: 0
      }
    };
  },
  mounted(type = 'today') {
    this.$nextTick(() => {
    let timeObj = getDate(type)
    this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
    this.form.begin = this.date[0]
    this.form.end = this.date[1]
      this.setHead();
      this.loadData();
    });
    
  },
  methods: {
      //
       // 分页
        // 每页显示的条数
      //  handleSizeChange(val) {
      //      // 改变每页显示的条数 
      //      this.PageSize=val
      //      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      //      this.currentPage=1
      //  },
      //    // 显示第几页
      //  handleCurrentChange(val) {
      //      // 改变默认的页数
      //      this.currentPage=val
      //  },
    // 导出Excel
    // exportFile() {
    //   debugger
    //   let content = Object.assign({}, this.queryform);
    //   this.$client.CreditCartConsumptionSummary(params).then(res => {
    //     if (res.head.result == "200") {
    //       window.location.href = res.context;
    //       this.$message({ type: "success", message: "导出成功" });
    //     } else {
    //       this.$message({ type: "error", message: "导出失败" });
    //     }
    //   });
    // },
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
      // loadData() {
      //   this.chartLoading = true;
      //   let content = {};
      //   Object.assign(content, this.form)
      //   this.$client.ChargeSummaryVehicleChargeSummary(content).then(req => {
      //     console.log(req);
      //     this.chartLoading = false;
      //     if (req.head.result === "200") {
      //       this.setChart(req.context.chart)
      //       Object.assign(this.summary, req.context.summary)
      //     } else {
      //       this.data = [];
      //     }
      //   }).catch(err => {
      //     this.chartLoading = false;
      //   })

      //   content.page_index = this.pageInfo.pageIndex
      //   content.page_size = this.pageInfo.pageSize
      //   this.$client.ChargeListSummaryVehicleChargeSummary(content).then(req => {
      //     console.log(req)
      //     this.loading = false
      //     if (req.head.result === "200") {
      //       this.data = req.context.list;
      //       this.pageInfo.pageCount = req.context.total;
      //     } else {
      //       this.data = [];
      //       this.pageInfo.pageCount = 0;
      //     }
      //   })
      // },

    loadData() {
      this.chartLoading = true;
      this.loading = true;
      let content = {};
      Object.assign(content, this.form)
      
       content.page_index = this.pageInfo.pageIndex
       content.page_size = this.pageInfo.pageSize
      this.$client.GetCreditCardConsumptionSummary(content).then(req => {
        console.log(req);
        this.chartLoading = false;
        this.loading = false;
        if (req.head.result === "200") {
          let info = req.context;
          this.setChart(req.context.complaint_types)
          Object.assign(this.summary, info.chart_title)
          for (const key in info) {
            if (Object.hasOwnProperty.call(info, key)) {
              if(key == 'complaint_types') {
                 let obj = {};
                switch (key) {
                  case 'complaint_types':
                    obj.title = '图表';
                    break;
                }
                obj.data = info[key]
              }
            }
          }
          this.pageInfo.pageCount = info.summary_table.total
          // this.totalCount=info.summary_table.list.length
          this.data = info.summary_table.list;
          console.log(this.pieDataList)

        } else {
          this.data = [];
        }
      }).catch(err => {
        this.chartLoading = false;
      })

    },
    chartShow(bool) {
      this.chartChange = bool;
      this.setHead();
    },
    // 设置图表
    setChart(chert_list) {
      if (this.chartChange) {
        let label = [];
        let data = {
          车辆数: [],
          总金额: [],
          刷卡次数: [],
        };
        chert_list.forEach(item => {
          label.push(item.month_day);
          data.车辆数.push(item.day_vehicle_cout);
          data.总金额.push(item.day_swip_money);
          data.刷卡次数.push(item.day_swip_cout);
        });
        this.$refs.barChart.setOptions({ label: label, data: data });
      }
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
        this.TableHeight =
          maxh - th - paginationH - (this.chartChange ? 200 : 0);
      }, 60);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.charge-summary {
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