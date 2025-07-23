<template>
  <div class="asset-retirement-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="addAssetsScrap">

    </sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="flow_code">
        <el-button type="text" size="mini" @click="checkApplyDetail(scope.data)">{{scope.data.flow_code}}</el-button>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="checkDetail(scope.data)">查看</el-button>
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

    <fixed-form-body :formType="formType" :dialogBool.sync="fixedFormBodyShow" @on-refresh="loadData"></fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fixedFormBody from "../../main-Interface-entrance/launch-affair/component/all-box/fixed-form-body";
export default {
  name: 'asset-retirement-management',
  components: {
    subReq,
    fixedFormBody
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      backFixedNum: 1,
      formType: '',
      fixedFormBodyShow: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "审批单编号",
          prop: "flow_code",
          width: "160",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "审批状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "申请人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "所在部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "报废日期",
          prop: "scrap_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "报废原因",
          prop: "scrap_reason",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "报废物品名称",
          prop: "scrap_name",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "报废资产数量",
          prop: "assets_count",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "报废总金额(元)",
          prop: "total_fee",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ]
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
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageAssetsScrap(params)
      .then(res => {
        this.loading = false;
        if (res.head.result === "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };  
      })
    },
    // 添加资产报废
    addAssetsScrap() {
      this.formType = 'assetRetirement'
      this.fixedFormBodyShow = true
    },
    // 查看
    checkDetail(row) {
      let detail_id = 1290, title = '资产报废单'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    },
    checkApplyDetail(row) {
      let detail_id = 1290, title = '资产报废单'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
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
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.asset-retirement-management
  height: 100%
  width: 100%
</style>