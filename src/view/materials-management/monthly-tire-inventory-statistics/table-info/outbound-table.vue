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
          label: "日期",
          prop: "check_date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
         {
          id: 2,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "型号",
          prop: "vehicle_type",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "轮胎名称及类别",
          prop: "name_type",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
         {
          id: 6,
          label: "出库数量",
          prop: "out_count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
         {
          id: 7,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
         {
          id: 8,
          label: "总费用",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
         {
          id: 9,
          label: "批次",
          prop: "batch",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
         {
          id: 10,
          label: "物料原始编码",
          prop: "original_code",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "仓位",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
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
        type_id : this.type_id  || '',
        year_month : this.year_month,
        page_index : this.pageInfo.pageIndex,
        page_size : this.pageInfo.pageSize
      }
      this.$client.GetOutByPage(params)
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
    // 导出Excel
    exportFile(){
      let params = {
        type_id : this.type_id  || '',
        year_month : this.year_month,
      }
      this.$client.OutExportTireMonthStatistic(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


