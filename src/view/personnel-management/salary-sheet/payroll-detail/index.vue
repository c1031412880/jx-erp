<template>
  <div ref="payrollDetail" class="payroll-detail">
    <div class="top">
      <el-button size="mini" @click="backImportWages">返回</el-button>
      <p>发放记录</p>
    </div>
    <sub-req ref="detailHead" @on-ok="onSubmit"></sub-req>
    <p style="margin-bottom: 17px; color: #02A7F0; ">已发放 {{ count || 0 }} 条工资条，总实发金额 {{ money.toFixed(2) || 0 }} 元</p>
    <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :backFixedNum="1"
      :loading="loading">
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="viewDetail(scope.data)">查看详情</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "payrollDetail",
  components: {
    subReq
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      count: 0,
      money: 0,
      queryform: {},
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "年份",
          prop: "year",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "月份",
          prop: "month",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "发放类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "发放总金额",
          prop: "money",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "发放人数",
          prop: "people_count",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        }
      ],
      canRendererTableHeader: null
    }
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 20;
      // console.log(form);
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetSendRecordOaWage(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list
            this.pageInfo.pageCount = req.context.total
            this.count = req.context.summary.count
            this.money = req.context.summary.money
          } else {
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
      })
    },
    // 查看详情
    viewDetail(val) {
      // console.log(val);
      this.$emit('on-detail', val.main_id)
    },
    // 返回工资条
    backImportWages() {
      this.$emit('on-back')
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
      this.loadData()
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$refs.payrollDetail.offsetHeight;
        let th = this.$refs.detailHead.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 70;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.payroll-detail {
  height: 100%;
  width: 100%;

  .top {
    display: flex;
    height: 30px;

    p {
      width: calc(100% - 56px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

  }
}
</style>
