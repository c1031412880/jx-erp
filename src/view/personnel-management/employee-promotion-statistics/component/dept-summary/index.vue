<template>
  <div class="dept-promotion-statistics">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportInfo">

    </sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="getDetails(scope.data)">明细</el-button>
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
    <!-- 明细弹窗 -->
    <el-dialog
      title="明细"
      :modal="false"
      width="80%"
      :visible.sync="detailVisible"
      top="20px">
      <details-box
        ref="detailsBox"
      >
      </details-box>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import detailsBox from "./details-box";
export default {
  name: 'dept-promotion-statistics',
  components: {
    subReq,
    detailsBox
  },
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
      backFixedNum: 1, //后几行固定

      customSettingList: [
        {
          id: 1,
          label: "部门名称",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "宣传分数",
          prop: "score1",
          width: "130",
          align: "center",
          signIndex: 1,
          nestedTablesHeader:[
            {
              id: 101,
              label: "宣传任务分数",
              prop: "score1",
              width: "180",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "两办信息分数",
              prop: "score2",
              width: "180",
              align: "center",
              signIndex: 101,
            },
          ]
        },
        {
          id: 3,
          label: "宣传总分数",
          prop: "total_score",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "录取篇数",
          prop: "enter_count",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "上报篇数",
          prop: "report_count",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 5,
        },
      ],

      detailVisible: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDeptAdvertTotal({context:params})
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            let info = JSON.parse(JSON.stringify(res.context.list))
            this.data = info;
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
    // 导出
    exportInfo() {
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ExportDeptAdvertTotal({context:params}).then(res => {
        if(res.head.result == "200") {
          window.location.href = res.context;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
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
    // 获取详情
    getDetails(row) {
      let params = {
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        dept_id: row.dept_id,
        dept_name: row.dept_name
      }
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detailsBox.onSubmit(params)
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dept-promotion-statistics
  height: 100%
  width: 100%
</style>