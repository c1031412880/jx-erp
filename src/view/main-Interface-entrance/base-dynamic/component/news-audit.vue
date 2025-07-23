<template>
  <div class="news-audit">
    <table-req
      ref="head"
      :isShow="true"
      @on-ok="onSubmit">

    </table-req>
    <tr-table
      ref="table"
      :data="data"
      :selectionShow="true"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="created_date">
        <span>{{scope.data.created_date ? scope.data.created_date.replace('T', ' ') : ''}}</span>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button @click="openRowNewInfo(scope.data)" type="text">查看</el-button>
        <el-button v-show="scope.data.state == -1 && $isPowerShow('edit')" @click="editRowNewInfo(scope.data)" type="text">编辑</el-button>
        <!-- <el-button v-show="scope.data.state == 1 && $isPowerShow('audit')" @click="auditRowNewInfo(scope.data)" type="text">审核</el-button> -->
        <!-- <el-popconfirm
          title="确定删除当前记录吗？"
          @confirm="deleteItem(scope.data)">
          <el-button type="text" slot="reference">删除</el-button>
        </el-popconfirm> -->
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

    <new-dialog ref="newInfoDialog" @save-add-edit="updateNewState" :isAudit="isAudit" :dialogBool.sync="isShowNewDialog"></new-dialog>
    <add-news ref="addInfoNews" @save-add-edit="saveAddInfo" :dialogBool.sync="isShowAddNews" :curSelectedType="'edit'"></add-news>
  </div>
</template>

<script type="text/ecmascript-6">
import tableReq from "./table-req";
import newDialog from "./new-dialog";
import addNews from "./add-news";
import { getSession } from '@/utils/auth'
export default {
  name: 'news-audit',
  components: {
    tableReq,
    newDialog,
    addNews,
  },
  data() {
    return {
      token: getSession(),
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 400,
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      isShowNewDialog: false,
      isAudit: false,
      isShowAddNews: false,
      customSettingList:[
        {
          id: 1,
          label: "动态标题",
          prop: "grassroots_title",
          width: "180",
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
          label: "发起时间",
          prop: "created_date",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "动态类型",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "发起人",
          prop: "user_name",
          width: "120",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
      ],
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
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 数据请求
    loadData() {
      this.loading = true;
      let params = {context: {}} 
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetErpGrassrootsDynamics(params)
        .then(res => {
          this.loading = false;
          if (res.head.result == "200") {
            this.data = res.context.list ? res.context.list : []
            this.pageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 查看
    openRowNewInfo(row) {
      if(row.flow_id) {
        let title = `基层动态审批单`
        this.$router.push({
          path: `/news-details/${row.id}/${title}/${8300}`
        })
      }else {
        let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=dynamic`
        window.open(url, '_blank')
      }
    },
    // 编辑
    editRowNewInfo(row) {
      this.$refs.addInfoNews.setData(row)
      this.isShowAddNews = true
    },
    // 保存动态
    saveAddInfo(form) {
      let params = {context: {}}
      params.context = form
      this.$client.AddErpNewManage(params)
        .then((res) => {
          this.isShowAddNews = false;
          if (res.head.result == "200") {
            this.$emit('on-update', 'wdList')
            this.loadData();
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            }
          })
    },
    // 审核
    auditRowNewInfo(row) {
      this.isAudit = true
      this.$refs.newInfoDialog.setData(row)
      this.isShowNewDialog = true
    },
    // 审核动态
    updateNewState(info) {
      let params = {context: {}}
      params.context = info
      this.$client.UpdateStateErpNewManage(params)
        .then((res) => {
          this.isShowNewDialog = false;
          if (res.head.result == "200") {
            if(info.state == 2) {
              this.$emit('on-update', 'homeList')
            }else {
              this.$emit('on-update', 'wdList')
            }
            this.loadData();
            this.$message({
              showClose: true,
              message: '删除成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
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
      this.canRendererTableHeader = this.customSettingList
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let head = this.$refs.head.$el.offsetHeight
        let th = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - head - 5
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.news-audit {
  height: 100%
  width: 100%
}
</style>