<template>
  <div>
    <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :stripe="false" 
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
export default {
  components: {},
  props: {
    type_id: {
      type: Number,
      default: 0
    },
    year_month: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      data: [],
      canRendererTableHeader:[
        {
          id: 1,
          label: "盘点日期",
          prop: "check_date",
          width: "140",
          align: "center",
          signIndex:0
        },
        {
          id: 2,
          label: "盘点类型",
          prop: "model",
          width: "140",
          align: "center",
          signIndex:1
        },
         {
          id: 3,
          label: "轮胎名称及类别",
          prop: "name_type",
          width: "140",
          align: "center",
          signIndex:2
        },
         {
          id: 4,
          label: "库存数量",
          prop: "bank_count",
          width: "140",
          align: "center",
          signIndex:3
        },
         {
          id: 5,
          label: "实存数量",
          prop: "actual_count",
          width: "140",
          align: "center",
          signIndex:4
        },
         {
          id: 6,
          label: "盘点差异",
          prop: "check_difference",
          width: "140",
          align: "center",
          signIndex:5
        },
         {
          id: 7,
          label: "单价",
          prop: "price",
          width: "140",
          align: "center",
          signIndex:6
        },
         {
          id: 8,
          label: "总费用",
          prop: "total_fee",
          width: "140",
          align: "center",
          signIndex:7
        },
         {
          id: 9,
          label: "盘点日期",
          prop: "check_date",
          width: "140",
          align: "center",
          signIndex:8
        },
      ],
      TableHeight: 500,
      loading: false,
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {
        type_id : this.type_id || '',
        year_month : this.year_month,
        page_index : this.pageInfo.pageIndex,
        page_size : this.pageInfo.pageSize
      }
      this.$client.GetInventoryByPage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
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
    // 导出
    exportTable() {
      let params = {
        type_id : this.type_id  || '',
        year_month : this.year_month,
      }
      this.$client.InventoryExportTireMonthStatistic(params).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


