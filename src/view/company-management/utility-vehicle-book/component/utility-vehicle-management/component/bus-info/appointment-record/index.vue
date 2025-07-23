<template>
  <div class="appointment-record">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
    ></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="checkDetail(scope.data)">预约详情</el-button>
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
    ></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "appointment-record",
  props: ["bus_id"],
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      data: [],
      loading: false,
      TableHeight: 200,
      customSettingList: [
        {
          id: 1,
          label: "申请人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所在部门",
          prop: "user_dept",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "预约借车时间",
          prop: "req_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "预约还车时间",
          prop: "back_time",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "出发地",
          prop: "from_address",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "目的地",
          prop: "to_address",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "申请事由",
          prop: "purpose",
          width: "100",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        }
      ],
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    onSubmit(form) {
      this.form = form
      console.log(this.form)
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 查看明细
    checkDetail(row) {
      // 关闭弹出框
      this.$parent.$parent.$parent.$parent.dialogClose()
      setTimeout(() => {
        this.$router.push({
          path: `/news-details/${row.id}/${'待办事项:' + '公车预约申请单'}/${1340}`
        })
      }, 100);
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.bus_id = this.bus_id
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetBusRequestQueueStatic({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            })
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          })
        })
    },
    // 导出
    onExport() {
      let params = Object.assign({}, this.form)
      params.bus_id = this.bus_id
      this.$client.ExportBusRequestQueueStatic({context:params}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context
            this.$message({ type: "success", message: "导出成功" })
          } else {
            this.$message({ type: "error", message: "导出失败" })
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" })
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
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH - 10
      }, 60)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.appointment-record {
  width: 100%;
  height: 510px;
}
</style>
