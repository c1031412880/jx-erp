<template>
  <div class="audit-log">
    <sub-req ref="head" @on-add="infoDialogShow = true" @on-ok="onSubmit"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="0"
      :backFixedNum="0">
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
    <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow" @on-ok="InfoDialogOk"></info-dialog>
  </div>
</template>

<script>
import subReq from "./component/sub-req";
import infoDialog from "./component/info-dialog";
export default {
  name: "audit-log",
  components: {subReq, infoDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "用户姓名",
          prop: "user_name",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "服务 (类/接口) 名",
          prop: "service_name",
          width: "160",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "执行方法名称",
          prop: "method_name",
          width: "150",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "调用参数",
          prop: "parameters",
          width: "150",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "返回值",
          prop: "return_value",
          width: "150",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "方法执行的开始时间",
          prop: "execution_time",
          width: "160",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "方法调用的总持续时间（毫秒）",
          prop: "execution_duration",
          width: "180",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "客户端的IP地址",
          prop: "client_ip_address",
          width: "150",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "客户端的名称（通常是计算机名）",
          prop: "client_name",
          width: "180",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "浏览器信息",
          prop: "browser_info",
          width: "150",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "方法执行期间发生异常",
          prop: "exception",
          width: "180",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "自定义数据",
          prop: "custom_data",
          width: "150",
          align: "center",
          signIndex:11,
          sortable:false
        },
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      infoDialogShow: false,
      form: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetAuditLogDataBase(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
      })
    },
    // 上传文件
    InfoDialogOk(form) {
      this.$client.AddDocumentHis({context: form}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
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
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) - 42
      }, 60)
    }
  }
}
</script>

<style style rel="stylesheet/scss" lang="scss" scoped>
.audit-log{
  width: 100%;
  height: 100%;
}
</style>
