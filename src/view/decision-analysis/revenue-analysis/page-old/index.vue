<template>
  <div class="revenue-analysis">
    <sub-req ref="head" @on-ok="onSubmit" @on-dow="tableDow"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
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
      :total="pageInfo.pageCount">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./components/sub-req";
export default {
  name: "revenue-analysis",
  components: {subReq},
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      customSettingList:[
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:true
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:true
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "车辆型号",
          prop: "vehicle_kind",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:true
        },
        {
          id: 6,
          label: "GPS里程(KM)",
          prop: "gps_mile",
          width: "145",
          align: "center",
          signIndex: 5,
          sortable:true
        },
        {
          id: 7,
          label: "营运里程",
          prop: "revenue_mile",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "收入",
          prop: "accident_reason",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "普票",
              prop: "common_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "IC卡(移动支付)",
              prop: "ic_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "包车",
              prop: "chartered",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "收入总和",
              prop: "income",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 9,
          label: "支出",
          prop: "c_accident_address",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "工资性支出",
              prop: "wage_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "附加费用",
              prop: "append_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "燃料金额(油电)",
              prop: "fuel_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "维修材料",
              prop: "repair_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆折旧",
              prop: "vehicle_depreciation",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆保险费用",
              prop: "vehicle_safe",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "事故损失费用",
              prop: "accident_loss",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "支出总和",
              prop: "expenditure",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 10,
          label: "毛利",
          prop: "gross_profit",
          width: "120",
          align: "center",
          signIndex: 9,
          sortable:false
        },
      ],
      frontFixedNum:1, //前几行固定
      backFixedNum:1, //后几行固定
      loading: false,
      TableHeight: 500,
      data: [],
      allData: []
    }
  },
  //方法集合",
  methods: {
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.data = this.allData.length ? this.allData[this.pageInfo.pageIndex - 1] : []
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 导出
    tableDow() {
      this.$client.ExportRevenueAnalysis(this.form).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
        }
      })
    },
    loadData() {
      this.loading = true
      this.$client.GetRecentRevenueAnalysis(this.form).then(req => {
        this.loading = false
        console.log(req)
        if (req.head.result === '200') {
          this.allData = this.$chunk(req.context, this.pageInfo.pageSize)
          this.pageInfo.pageCount = req.context.length
          this.data = this.allData.length ? this.allData[this.pageInfo.pageIndex - 1] : []
        } else {
          this.allData = []
          this.data = []
        }
      })
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 10;
        console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.revenue-analysis{
  width: 100%;
  height: 100%;
}
</style>
