<template>
  <div class="base-demo">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :tableHeaderList="customSettingList">
      <template slot-scope="scope" slot="type">
        <span>{{ modelObj[scope.data.type] }}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          type="text"
          @click="editDraftRowInfo(scope.data)"
        >编辑</el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data.id, 'delete')"
          title="是否确定删除此草稿相关数据,且不可恢复？">
          <el-button slot="reference" type="text" style="margin-left: 10px">删除</el-button>
        </el-popconfirm>
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

    <fixed-form-body 
      ref="fixedFormBody"
      :dialogBool.sync="fixedFormBodyShow" 
      :appendToBody="true"
      :isWorkOrder="true"
      @on-refresh="deleteRowInfo(rowId)" 
      :formId="formId" 
      :formName="formName"></fixed-form-body>
  </div>
</template>

<script>
import subReq from './sub-req'
import modelObj from "@/view/main-Interface-entrance/news-core/modelObj";
import fixedFormBody from '@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body';
export default {
  name: 'base-demo',
  components: {subReq, fixedFormBody},
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      rowId: 0,
      formId: 0,
      formName: '',
      fixedFormBodyShow: false,
      modelObj: modelObj,
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "审批单名称",
          prop: "type",
          width: "220",
          align: "left",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "创建时间",
          prop: "created_date",
          width: "220",
          align: "left",
          signIndex: 1,
          sortable: false,
          notTooltip: false
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    this.setHead()
    this.loadData()
    eventOn.$on('update-draft', () => {
      this.loadData()
    })
  },
  methods: {
    // 提交查询
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    loadData() {
      this.loading = true;
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetDraftRecordsDraftFlowManage(this.form).then(res => {
        this.loading = false;
        if(res.head.result == "200") {
          this.data = JSON.parse(JSON.stringify(res.context.list));
          // this.data = [{
          //   id: 1232,
          //   content: 'dasfsdgfdgsdf',
          //   type: 5000
          // }]
          this.pageInfo.pageCount = res.context.total
        } else {
          this.pageInfo.pageCount = 0
          this.data = []
          this.$message({showClose: true, message: res.head.describle, type: "error",});
        }
      }).catch((err) => {
        this.data = []
        this.pageInfo.pageCount = 0
        this.loading = false;
        this.$message({showClose: true, message: err.body.message, type: "error",});
      })
    },
    // 编辑
    editDraftRowInfo(row) {
      this.rowId = row.id
      this.formId = row.type
      this.formName = modelObj[row.type]
      this.fixedFormBodyShow = true
      setTimeout(() => {
        this.$refs.fixedFormBody.getDraftRecord(row.draft_content)
      }, 300);
    },
    // 删除
    deleteRowInfo(rowId, type) {
      let params = {id: rowId}
      this.$client.DeleteDraftRecordFlowManage(params).then(res => {
        if(res.head.result == "200") {
          if(type == 'delete') {
            this.$message({showClose: true, message: '删除成功', type: "success",});
          }
          this.loadData()
        } else {
          this.$message({showClose: true, message: res.head.describle, type: "error",});
        }
      })
    },
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 5;
      }, 60);
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-demo{
  width 100%
  height 100%
}
</style>