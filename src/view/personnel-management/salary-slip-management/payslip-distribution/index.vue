<template>
  <div class="payslip-distribution">
    <sub-req
      ref="head"
      @on-add="openAdd"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="state_name">
        <p :style="{'color': outColor(scope.data.state)}">{{ scope.data.state_name }}</p>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.state == 1" @click="showDetail(scope.data)">详情</el-button>
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('edit') && scope.data.state == 2" @click="editRowInfo(scope.data,'edit')">重新发放</el-button>
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('edit') && (scope.data.state == 0 || scope.data.state == 3)" @click="editRowInfo(scope.data,'edit')">编辑</el-button>
        <el-popconfirm
          @confirm="revoke(scope.data)"
          title="确定撤回此条记录吗？"
          v-if="$isPowerShow('withdraw') && scope.data.state == 1">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px" >撤回</el-button>
        </el-popconfirm>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del') && ([0,2,3].includes(scope.data.state))">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red" >删除</el-button>
        </el-popconfirm>
      </template>
    </tr-table>
    <el-pagination
      ref="paginationH"
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>
    <div class="organization-project-dialog">
      <add-classify-dialog
        ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>

      <detail-dialog
        ref="detailDialog"
        :dialogBool.sync="isShowDetailDialog"
      >
      </detail-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import addClassifyDialog from "./dialog/add-classify-dialog"
import detailDialog from "./dialog/detail-dialog"
export default {
  name: "payslip-distribution",
  components: {
    subReq,
    addClassifyDialog,
    detailDialog
  },
  data() {
    return {
      pageInfo: { 
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "工资条名称",
          prop: "slip_name",
          width: "200",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "发放月份",
          prop: "month",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "发放类别",
          prop: "type_name",
          width: "100",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "工资条模版名称",
          prop: "template_name",
          width: "150",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "发放人数",
          prop: "count",
          width: "80",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "经办人",
          prop: "create_name",
          width: "100",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "发布时间",
          prop: "send_time",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 8,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据

      isShowAddClassifyDialog: false,
      curType: 'add', //添加分类
      isShowDetailDialog:false
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.loadData();
    },
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPaySlipHistories({context:params})
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.total = res.context.total
          // 总分类下需要分页
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
          this.loading = false;
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
    openAdd() {
      this.isShowAddClassifyDialog = true
      this.curType = 'add'
    },
    editRowInfo(row,type) {
      this.curType = type
      this.isShowAddClassifyDialog = true
      this.$nextTick(() => {
        this.$refs.addClassifyDialog.setData(row)
      })
    },
    // 保存和编辑 工资条发放  
    saveAddEditOrgClassifyInfo(form) {
      this.$client.SendOutPaySlip({context:form})
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.isShowAddClassifyDialog = false
          this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#999'
        case 1:
          return '#0CB780'
        case 2:
          return '#F2260E'
        case 3:
          return '#F58A40'
      }
    },
    showDetail(row) {
      this.isShowDetailDialog = true
      this.$nextTick(() => {
        this.$refs.detailDialog.getData(row)
      })
    },
    // 撤回 
    revoke(row) {
      this.$client.RevokePaySlip({context:row.id})
      .then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '撤回成功',
            type: "success",
          });
          this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 删除 
    deleteRowInfo(row) {
      this.$client.DeletePaySlip({context:row.id})
      .then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: "success",
          });
          this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        let ph = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - ph - th
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.payslip-distribution{
  width: 100%;
  height: 100%;
}
</style>
