<template>
  <div class="main-content">
    <sub-req ref="head" @on-ok="onSubmit" @on-draft="draftDialogShow = true"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot="operation" slot-scope="scope">
        <el-button type="text" @click="onStateDel(scope.data)">删除</el-button>
        <el-button type="text" @click="openApply(scope.data)">查看</el-button>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>
    <draft-dialog ref="draftDialog" :dialogBool.sync="draftDialogShow"></draft-dialog>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import draftDialog from './component/draft-dialog'
export default {
  name: "main-content",
  components: {subReq, draftDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "公文标题",
          prop: "title",
          width: "200",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "公文字号",
          prop: "font_number",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "文件编号",
          prop: "code",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "公文流程类型",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "公文类型",
          prop: "doc_name",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "状态",
          prop: "state_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "拟稿人/创建人",
          prop: "post_name",
          width: "160",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "拟稿部门",
          prop: "department_name",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "公文日期",
          prop: "document_date",
          width: "160",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "主送部门",
          prop: "main_department_name",
          width: "160",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "抄送部门",
          prop: "copy_department_names",
          width: "160",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex:11,
          sortable:false
        },
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      draftDialogShow: false,
      form: {},
      customSettingVialogVisible: false,
      titlesId:'', //当前表头的id
      menu_code:'',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.menu_code = this.$route.meta.code + '-4';
      this.reqTitleTable()
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 删除
    onStateDel(item) {
      this.$confirm('此操作将永久删除该查看记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.DeleteDocumentFlow({context: {page_type: 2,document_type: item.doc_type,ids:[item.document_id]}}).then(req => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 审核编辑初始化
    onStateSet(item) {
      setTimeout(() => {
        this.$refs.draftDialog.setData(item)
      }, 100)
      this.draftDialogShow = true
    },
    // 审批查看
    openApply(val) {
      let detail_id = val.doc_type == 1 ? 30 : 40, title = val.doc_type == 1 ? '发文审批' : '收文审批'
      this.$router.push({
        path: `/news-details/${val.document_id}/${title}/${detail_id}`
      })
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
      this.$client.GetReadDocumentFlow(this.form).then(req => {
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
    // 获取表头
    reqTitleTable() {
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
      }).catch(err => {})
    },
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
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
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) - 42
        console.log(this.TableHeight)
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.main-content{
  width 100%
  height 100%
}
</style>
