<template>
  <div class="score-summary">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
    ></sub-req>

    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList">
      <template slot-scope="scope" slot="operation">
        <el-button type="text" @click="detailsPush(scope.data)">明细</el-button>
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



    <el-dialog
      title="得分明细"
      :visible.sync="dialogVisible"
      :modal="false"
      width="80%"
      top="20px">
      <details-box ref="detailsBox"></details-box>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import detailsBox from "./component/details-box";

export default {
  name: 'score-summary',
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
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "所属部门",
          prop: "dept_name",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "作者（文）得分",
          prop: "article_score",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "作者（摄）得分",
          prop: "photo_score",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "总得分",
          prop: "total_score",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "稿费（元）",
          prop: "total_fee",
          width: "120",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "文章总篇数",
          prop: "total_count",
          width: "150",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 7,
        },
      ],
      dialogVisible: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    });
  },
  methods: {
    detailsPush(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.detailsBox.onSubmit(row,this.form)
      })
    },
    // 查询
    onSubmit(form) {
      this.form = form
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
      this.$client.GetUserAdvertScoreTotal({context:params})
        .then(res => {
          // console.log(JSON.stringify(res));
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 14;
      }, 60);
    },
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportUserAdvertScoreTotal({context:params}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.score-summary
  height: 100%
  width: 100%
</style>