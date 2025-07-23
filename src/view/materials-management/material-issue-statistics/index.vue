<template>
  <div class="material-issue-statistics">
    <sub-req
      ref="head"
      @on-ok="subOk"
      @on-export="exportTable">
    </sub-req>
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="TableHeight"
      :loading="loading"
    >
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
import subReq from "./component/sub-req";
export default {
  name: "material-issue-statistics",
  components: {
    subReq
  },
  data(){
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      tableHeaderList: [
        {
          id: 1,
          label: "日期",
          prop: "leave_date_string",
          width: "140",
          align: "center",
          signIndex:0
        },
        {
          id: 2,
          label: "领用车辆",
          prop: "vehicle_name",
          width: "140",
          align: "center",
          signIndex:1
        },
        {
          id: 3,
          label: "分公司",
          prop: "dept_name",
          width: "140",
          align: "center",
          signIndex:2
        },
        {
          id: 4,
          label: "物料编码",
          prop: "material_code",
          width: "180",
          align: "center",
          signIndex:3
        },
        {
          id: 5,
          label: "物料名称",
          prop: "material_name",
          width: "180",
          align: "center",
          signIndex:4
        },
        {
          id: 6,
          label: "规格型号",
          prop: "specification",
          width: "180",
          align: "center",
          signIndex:5
        },
        {
          id: 7,
          label: "数量",
          prop: "count",
          width: "140",
          align: "center",
          signIndex:6
        },
        {
          id: 8,
          label: "单价",
          prop: "price",
          width: "170",
          align: "center",
          signIndex:7
        },
        {
          id: 9,
          label: "金额",
          prop: "total_price",
          width: "140",
          align: "center",
          signIndex:8
        },
        {
          id: 10,
          label: "供应商",
          prop: "provider_name",
          width: "140",
          align: "center",
          signIndex:9
        },
        {
          id: 11,
          label: "物料分类",
          prop: "material_group",
          width: "150",
          align: "center",
          signIndex:10
        },
      ],
      TableHeight: 400,
      loading: false,
      form: {},
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead()
    })
  },
  methods: {
    // 导出
    exportTable(form = {}) {
      this.$client.LeaceDetailStatisticExport(form).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    subOk(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.loadData()
    },
    loadData() {
      this.form.page_size = this.pageInfo.pageSize
      this.form.page_index = this.pageInfo.pageIndex
      this.loading = true
      this.$client.GetLeaceDetailStatistic(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          const { list, summary } = req.context;
          const totalPage = Math.ceil(req.context.total / this.pageInfo.pageSize);
          // 只有在最后一页添加合计行
          let dataToShow = list;
          if (this.pageInfo.pageIndex === totalPage && totalPage > 0) {
            const summaryRow = {
              leave_date_string: '合计:',
              vehicle_name: '',
              dept_name: '',
              material_code: '',
              material_name: '',
              specification: '',
              count: summary.totalCount || 0,
              price: '',
              total_price: summary.totalPrice || 0,
              provider_name: '',
              material_group: ''
            };
            dataToShow = [...list, summaryRow];
          }
          this.data = dataToShow
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
        console.log(req)
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - (th + paginationH)
        console.log(this.TableHeight)
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.material-issue-statistics {
  width: 100%;
  height: 100%;
}
</style>
