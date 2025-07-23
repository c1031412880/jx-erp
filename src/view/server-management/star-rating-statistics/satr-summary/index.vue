<template>
  <div class="my-rating">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
    >
    </sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100, 200, 300]"
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
  name: 'my-rating',
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 300,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      selectedIds:[],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "所在部门",
          prop: "driver_dept",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "当前星级",
          prop: "now_star",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "季度平均分",
          prop: "quarter_score",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "季度平均分(80%)",
          prop: "quarter_score_eight",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "民主评选平均分",
          prop: "denicratuc_score",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "民主评选平均(20%)",
          prop: "denicratuc_score_eight",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "总分",
          prop: "total_score",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
      ],
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
      let params = Object.assign({},params,this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDriverStarByPage({context:params})
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false;
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
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportTotalDriverStar({context:params}).then((res) => {
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
.my-rating
  height: 100%
  width: 100%
</style>