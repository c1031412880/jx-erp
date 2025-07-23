<template>
  <div class="news">
    <sub-req ref="head" @load-table-data="loadData" @show-add-info="tableAdd"></sub-req>

    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      @on-select-change-row="selectedCurList"
      :frontFixedNum="0"
      :backFixedNum="1"
    >
      <template slot="published" slot-scope="scope">
        <span v-if="scope.data.published" style="color: #42b983">已发布</span>
        <span v-else style="color: #e6a23c">未发布</span>
      </template>
      <template slot="thumbnail" slot-scope="scope">
        <span v-if="!scope.data.thumbnail">暂无封面</span>
        <el-image
          v-else
          style="width: 50px; height: 50px"
          :src="scope.data.thumbnail"
          :preview-src-list="[scope.data.thumbnail]"
        >
        </el-image>
      </template>
      <template slot="publish_from_end" slot-scope="scope">
        <span>{{ scope.data.publish_from + ' ~ ' + scope.data.publish_end}}</span>
      </template>

      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="tableEdit(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-popconfirm
          @confirm="tableDel(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')">
          <el-button slot="reference" type="danger" size="mini">删除</el-button>
        </el-popconfirm>
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
    />

    <add-dialog
      ref="addDialogRef"
      :dialogVisible.sync="dialogVisible"
      @send-add-news="sendAddNews"
      @send-edit-news="sendEditNews"
    ></add-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req.vue'
import addDialog from './component/dialog.vue'
export default {
  name: "news-information-all",
  components: {
    subReq,
    addDialog
  },
  props: {},
  data() {
    return {
      TableHeight: 300,
      data: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "新闻标题",
          prop: "title",
          width: "110",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "类型",
          prop: "content_type",
          width: "100",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "发布状态",
          prop: "published",
          width: "100",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "添加时间",
          prop: "created_date",
          width: "110",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "封面",
          prop: "thumbnail",
          width: "80",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "发布期限",
          prop: "publish_from_end",
          width: "200",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      loading: false,
      dialogVisible: false,
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.loadData({})
    })
  },
  methods: {
    loadData(form) {
      this.loading = true
      form.kind = 0
      form.pageindex = this.pageInfo.pageIndex
      form.pagesize = this.pageInfo.pageSize
      this.$client.GetInfoDocumentsInfoDocument({context: form}).then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.data.sort(function (a, b) {
              return b.id - a.id;
            })
            this.pageInfo.pageCount = res.context.total;
          } else {
            this.loading = false;
            this.$message({showClose: true, message: res.head.describle, type: "error"});
          }
        }).catch(err => {
        this.$message({showClose: true, message: err.body.message, type: "error",});
      })
    },
    tableAdd() {
      this.$refs.addDialogRef.title = '添加';
      this.dialogVisible = true;
    },
    tableEdit(row){
      this.$refs.addDialogRef.title = '编辑';
      this.dialogVisible = true;
      this.$refs.addDialogRef.form = JSON.parse(JSON.stringify(row));
    },
    tableDel(val){
      this.$client.DeleteInfoDocumnetInfoDocument({context:val.id}).then(res => {
        // console.log(res,'res')
        if (res.head.result == "200") {
          this.$refs.head.submit()
          this.$message.success('操作成功')
        } else this.$message.error('操作失败')
      }).catch(err => this.$message.error('操作失败'))
    },
    sendAddNews(form) {
      this.$client.AddInfoDocumentInfoDocument({context: form}).then((req) => {
        if (req.head.result == "200") {
          this.$message.success('操作成功')
          this.$refs.head.submit()
          this.dialogVisible = false
        } else this.$message.error(req.head.describle)
      })
    },
    sendEditNews(form) {
      this.$client.EditInfoDocumnetInfoDocument({context: form}).then((req) => {
        if (req.head.result == "200") {
          this.$message.success('操作成功')
          this.$refs.head.submit()
          this.dialogVisible = false
        } else this.$message.error(req.head.describle)
      })
    },
    // 勾选中当前的车辆信息
    selectedCurList(val) {
      console.log(val)
    },
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.$refs.head.submit()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.$refs.head.submit()
    },
    setHead(maxh) {
      let th = this.$refs.head.$el.offsetHeight;
      let paginationH = this.$refs.paginationH.$el.offsetHeight;
      this.TableHeight = maxh - th - paginationH;
    },
  },
  beforeDestroy() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.news {
  width: 100%;
  height: 100%;
}
</style>
