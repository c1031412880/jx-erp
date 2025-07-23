<template>
  <div class="receipt-manage">
    <sub-req ref="head" @on-receipt="registerDialogShow = true"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
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
    <register-dialog ref="registerDialog" :dialogBool.sync="registerDialogShow" @on-ok="registerDialogOk"></register-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import registerDialog from './component/register-dialog'
export default {
  name: "receipt-manage",
  components: {subReq, registerDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "收文编号",
          prop: "code",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "文件标题",
          prop: "title",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "状态",
          prop: "state_name",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "创建人姓名",
          prop: "created_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "保密密级",
          prop: "secret_name",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "来文机关",
          prop: "organ",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "来文日期",
          prop: "accept_date",
          width: "160",
          align: "center",
          signIndex:6,
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
      registerDialogShow: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      this.loadData()
    })
  },
  methods: {
    // 提交
    registerDialogOk(form) {
      this.registerDialogShow = false
      this.$client.AddDocumentAccept({context: form}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
          // this.formData.id = req.context.id
          // this.subForm.document_id = req.context.id
          // this.state = 0
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    loadData() {
      this.loading = true
      this.$client.GetByPageDocumentAccept({}).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
        } else {
          this.data = []
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
        this.TableHeight = maxh - (th) - 30
        console.log(this.TableHeight)
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.receipt-manage{
  width 100%
  height 100%
}
</style>
