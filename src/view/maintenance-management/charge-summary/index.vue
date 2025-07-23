<template>
  <div class="charge-summary">
    <sub-req ref="head" @on-chart-show="chartShow" @on-ok="onSubmit" @export-file="exportFile"></sub-req>
    <el-card v-show="chartChange" style="margin-bottom: 10px" v-loading="chartLoading">
      <div slot="header" class="clearfix">
        <span>{{form.begin}} 至 {{form.end}}
          充电合计费用：{{summary.charge_fee_total}}元
          充电电量:{{summary.electric_quantity_total}}度
          充电总时长：{{summary.charge_time_total}}分钟</span>
      </div>
      <div class="card-box-item">
        <bar-chart ref="barChart"></bar-chart>
      </div>
    </el-card>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      @on-select-change-row="selectedList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isFixedEmptyPlaceholder="false">
      <template slot-scope="scope" slot="operation">
        <el-button slot="reference" type="text" size="mini" @click="backDetailed(scope.data)">查看明细</el-button>
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
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import barChart from './component/bar-chart'
export default {
  name: "charge-summary",
  components: {subReq, barChart},
  data() {
    return {
      data: [],
      canRendererTableHeader: [
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
          prop: "lincense_plate_number",
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
          label: "充电电费(元)",
          prop: "price_fee",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "充电服务费(元)",
          prop: "service_fee",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "充电费用(元)",
          prop: "charge_fee",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "充电电量(度)",
          prop: "electric_quantity",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "充电时长(分钟)",
          prop: "charge_time",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
      ],
      TableHeight: 500,
      loading: false,
      chartLoading: false,
      selectedIds:[], //勾选的ID
      frontFixedNum: 1,
      backFixedNum: 1,
      chartChange: true,
      form: {
        begin: '',
        end: ''
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      summary: {
        charge_fee_total: 0,
        electric_quantity_total: 0,
        charge_time_total: 0
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      this.loadData();
    });
  },
  methods: {
    // 跳转明细
    backDetailed(item) {
      let query = {
        vehicle_id: [item.vehicle_id],
        date: [this.form.begin, this.form.end]
      }
      this.$router.push({
        name:'charge-detailed',
        params: query
      })
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportVehicleChargeSummary(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.chartLoading = true;
      let content = {};
      Object.assign(content, this.form)
      this.$client.ChargeSummaryVehicleChargeSummary(content).then(req => {
        this.chartLoading = false;
        if (req.head.result === "200") {
          this.setChart(req.context.chart)
          Object.assign(this.summary, req.context.summary)
        } else {
          this.data = [];
        }
      }).catch(err => {
        this.chartLoading = false;
      })

      this.loading = true;
      content.page_index = this.pageInfo.pageIndex
      content.page_size = this.pageInfo.pageSize
      this.$client.ChargeListSummaryVehicleChargeSummary(content).then(req => {
        if (req.head.result === "200") {
          this.data = req.context.list;
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.data = [];
          this.pageInfo.pageCount = 0;
        }
        this.loading = false
      })
    },
    chartShow(bool) {
      this.chartChange = bool
      this.setHead()
    },
    // 设置图表
    setChart(chert_list) {
      if (this.chartChange) {
        let label = []
        let data = {
          '车辆数': [],
          '充电总费用': [],
          '充电用量': [],
          '充电时长': []
        }
        chert_list.forEach(item => {
          label.push(item.month_day)
          data.车辆数.push(item.vehicle_number)
          data.充电总费用.push(item.charge_fee)
          data.充电用量.push(item.electric_quantity)
          data.充电时长.push(item.charge_time)
        })
        this.$refs.barChart.setOptions({label: label, data: data})
      }
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
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - (this.chartChange ? 200 : 0);
      }, 60);
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
$NumWidth: 100vw / 1920px;

  .card-box-item{
    height: 300px * $NumWidth;
  }

.charge-summary{
  width: 100%;
  height: 100%
}
</style>
