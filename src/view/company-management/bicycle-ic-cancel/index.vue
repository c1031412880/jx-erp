<template>
  <div class="bicycle-ic-cancel">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportFile"
    ></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :selectionShow="false"
      :tableHeaderList="canRendererTableHeader">
      <!-- <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini">详情</el-button>
      </template> -->
    </tr-table>
    <!-- <el-pagination 
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination> -->
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "bicycle-ic-cancel", 
  components: {subReq,},
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "姓名",
          prop: "Name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "卡号",
          prop: "CardNumber",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "卡类型",
          prop: "CardType",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "操作时间",
          prop: "OperationTime",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "证件号码",
          prop: "IdNumber",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "注销金额（现金）",
          prop: "CancellationAmountCash",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 8,
          label: "退款金额（现金）",
          prop: "RefundAmountCash",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 7,
          label: "注销金额（网银）",
          prop: "CancellationAmountOnline",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "退款金额（网银）",
          prop: "RefundAmountOnline",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作员姓名",
          prop: "OperatorName",
          width: "120",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "备注",
          prop: "Remark",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        // {
        //   id: 11,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 10,
        //   sortable: false,
        // },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      // this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {context: {}};
      params.context = Object.assign({}, this.form);
      // params.context.page_index = this.pageInfo.pageIndex;
      // params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetBicycleCardDetail(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
            this.pageInfo.pageCount = res.context.length;
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
    // 导出Excel
    exportFile(val){
      let params = {context: {}};
      params.context = Object.assign({}, val);
      // params.context.page_index = this.pageInfo.pageIndex;
      // params.context.page_size = this.pageInfo.pageSize;
      this.$client.BicycleCardDetailExport(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        // let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bicycle-ic-cancel 
  height: 100%
  width: 100%
</style>