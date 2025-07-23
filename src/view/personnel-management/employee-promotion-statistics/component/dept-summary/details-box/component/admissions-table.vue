<template>
  <div class="admissions-table">
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="[7,8,9,10]"
      >
      <template slot-scope="scope" slot="flow_code">
        <el-button type="text" @click="showDetails(scope.data.advert_id)">{{scope.data.flow_code}}</el-button>
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
export default {
  name: 'admissions-table',
  components: {
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
      backFixedNum: 0, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "录用文章",
          prop: "article_name",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "录用平台",
          prop: "article_platform",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "文章分数",
          prop: "score",
          width: "100",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "录用时间",
          prop: "hire_time",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "关联审批单",
          prop: "flow_code",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "信息标题",
          prop: "advert_title",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "作者（文）得分",
          prop: "article_score",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "作者（摄）得分",
          prop: "photo_score",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "总得分",
          prop: "total_score",
          width: "120",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "稿费（元）",
          prop: "total_fee",
          width: "120",
          align: "center",
          signIndex:9,
        },
      ],
      sumTotal: {
        7: '',
        8: '',
        9: '',
        10: '',
      }
    }
  },
  mounted() {
  },
  methods: {
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
      this.$client.GetDeptAdvertEnter({context:params})
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              7: res.context.summary.article_score,
              8: res.context.summary.photo_score,
              9: res.context.summary.total_score,
              10: res.context.summary.total_fee,
            }
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
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportDeptAdvertEnter({context:params}).then((res) => {
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
    // 查看
    showDetails(id) {
      this.$router.push({
        path: `/news-details/${id}/待办事项:宣传信息审批单/5050`,
      })
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.admissions-table
  height: 100%
  width: 100%
</style>