<template>
  <div class="receipt-manage">
    <sub-req ref="head"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot="operation" slot-scope="scope">
        <el-button type="text" v-if="scope.data.state === 1" @click="onStateSet(scope.data)">{{scope.data.step_name}}</el-button>
        <el-button type="text" v-else @click="onStateSet(scope.data)">查看</el-button>
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
          label: "滞留时间",
          prop: "wait_time",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "状态",
          prop: "state_name",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "当前流程",
          prop: "step_name",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "公文流程类型",
          prop: "line_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "公文标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "来文类型",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "来文部门",
          prop: "reg_date",
          width: "160",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "创建人",
          prop: "created_name",
          width: "120",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "发起时间",
          prop: "accept_date",
          width: "150",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "处理时间",
          prop: "created_date",
          width: "120",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex:10,
          sortable:false
        }
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
    // 审核编辑初始化
    onStateSet(item) {
      setTimeout(() => {
        this.$refs.registerDialog.setData(item)
      }, 100)
      this.registerDialogShow = true
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
    },
    registerDialogOk(form) {
      this.registerDialogShow = false
      this.$client.UpdateStateDocumentAccept({context: form}).then(req => {
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
