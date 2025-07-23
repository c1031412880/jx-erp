<template>
  <div class="send-document">
    <sub-req ref="head" @on-ok="loadData()" @on-add="infoDialogShow = true"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" v-if="$isPowerShow('set')" size="mini" @click="setShow(scope.data)">编辑</el-button>
        <el-popconfirm
          v-if="$isPowerShow('del')"
          title="确定删除当前红头模板吗？"
          @confirm="deleteTable(scope.data)"
        >
          <el-button type="danger" slot="reference" size="mini">删除</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>
    <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow" @on-ok="infoDialogOk"></info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import infoDialog from './component/info-dialog'
export default {
  name: "overprint-model",
  components: {subReq, infoDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "套红模板名称",
          prop: "title",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "套红模板说明",
          prop: "describe",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "创建人",
          prop: "created_name",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "创建日期",
          prop: "created_date",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex:4,
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
      infoDialogShow: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      // if (this.$isPowerShow('set') || this.$isPowerShow('del')) {
      //   this.customSettingList.push({
      //     id: 5,
      //     label: "操作",
      //     prop: "operation",
      //     width: "130",
      //     align: "center",
      //     signIndex:4,
      //     sortable:false
      //   })
      // }
      this.setHead()
      this.loadData()
    })
  },
  methods: {
    loadData() {
      this.pageInfo.pageIndex = 1
      this.loading = true
      this.$client.GetAllDocumentHead({}).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.dataTable = req.context
          this.data =  this.dataTable.slice(
            (this.pageInfo.pageIndex - 1) * this.pageInfo.pageSize,
            this.pageInfo.pageSize * this.pageInfo.pageIndex
          );
          this.pageInfo.pageCount = req.context.length
        } else {
          this.data = []
        }
      })
    },
    // 修改初始化
    setShow(data) {
      this.$refs.infoDialog.setData(data)
      this.infoDialogShow = true
    },
    deleteTable(item) {
      this.$client.DeleteDocumentHead({context: [item.id]}).then(req => {
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
    // 提交
    infoDialogOk(form) {
      this.infoDialogShow = false
      if (form.id) {
        this.$client.UpdateDocumentHead({context: form}).then(req => {
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
      } else {
        this.$client.AddDocumentHead({context: form}).then(req => {
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
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.enabled = true;
      this.pageInfo.pageIndex = idx;
      // this.loadData();
      this.data = this.dataTable.slice(
        (idx - 1) * this.pageInfo.pageSize,
        idx * this.pageInfo.pageSize
      );
    },

    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.data = this.dataTable.slice(0,this.pageInfo.pageSize);
    },
    // // 分页切换事件
    // handleCurrentChange(idx) {
    //   this.pageInfo.pageIndex = idx
    //   this.loadData()
    // },
    // // 切换每页条数
    // handleSizeChange(sizes) {
    //   this.pageInfo.pageIndex = 1;
    //   this.pageInfo.pageSize = sizes;
    //   this.pageInfo.pageCount = 0;
    //   this.loadData();
    // },
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
