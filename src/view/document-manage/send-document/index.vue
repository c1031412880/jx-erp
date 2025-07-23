<template>
  <div class="send-document">
    <sub-req ref="head" @on-ok="onSubmit" @on-draft="draftDialogShow = true"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot="step_name" slot-scope="scope">
        <el-button type="text" v-if="scope.data.state === 0" @click="onStateSet(scope.data)">编辑</el-button>
        <el-button type="text" v-else-if="scope.data.state === 1" @click="onStateSet(scope.data)">{{scope.data.step_name}}</el-button>
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
    <draft-dialog ref="draftDialog" :dialogBool.sync="draftDialogShow" @on-ok="draftDialogOk"></draft-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import draftDialog from './component/draft-dialog'
export default {
  name: "send-document",
  components: {subReq, draftDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "文件编号",
          prop: "code",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "发文标题",
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
          label: "拟稿人",
          prop: "post_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "发文类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "缓急程度",
          prop: "degree_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "保密密级",
          prop: "secret_name",
          width: "160",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "发文日期",
          prop: "posy_time",
          width: "120",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "主送部门",
          prop: "department_name",
          width: "150",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "操作",
          prop: "step_name",
          width: "150",
          align: "center",
          signIndex:9,
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
      draftDialogShow: false,
      form: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    // 提交审核
    draftDialogOk(form) {
      this.draftDialogShow = false
      this.$client.UpdateStateDocumentMain({context: form}).then(req => {
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
    // 审核编辑初始化
    onStateSet(item) {
      setTimeout(() => {
        this.$refs.draftDialog.setData(item)
      }, 100)
      this.draftDialogShow = true
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetByPageDocumentMain(this.form).then(req => {
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
.send-document{
  width 100%
  height 100%
}
</style>
