<template>
  <div class="release-box">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-export="onExport"
      ></sub-req>
      <div>
        <tr-table
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
        </tr-table>
      </div>
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
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "release-box",
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
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [],
      tableHeaderList1: [
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
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
      ],
      tableHeaderList2: [
        {
          id: 3,
          label: "合计",
          prop: "total_score",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "平均分",
          prop: "avg_score",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "管理员平均分",
          prop: "admin_avg_score",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
      ],
      loading: false,
      TableHeight:500,
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPageListDemocraticScoreReport(params)
      .then(res => {
        if (res.head.result == "200") {
          let data = res.context.list;
          this.getHeaderAndData(data)
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
    // 组装表头 和数据
    getHeaderAndData(list) {
      let L = 0
        list.forEach(item => {
          L = item.details.length
          item.details.forEach((child,index) => {
            let key = `name${index}`
            item[key] = child.score || ''
          })
        })
        let header = []
        for (let index = 0; index < L; index++) {
          let obj = {
              id: index + 3  ,
              label: (index + 1).toString(),
              prop: `name${index}`,
              width: "130",
              align: "center",
              signIndex: index + 2,
              sortable: true,
          }         
          header.push(obj) 
        }
        this.canRendererTableHeader = [...this.tableHeaderList1,...header,...this.tableHeaderList2]
        this.data = list
    },
    // 组装数据 
    getData(list) {},
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
      this.$client.ExportDemocraticScoreReport(params).then((res) => {
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
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 35 -th;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.release-box{
  width: 100%;
  height: 100%;
}
</style>
