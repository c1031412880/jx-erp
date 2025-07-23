<template>
  <div class="annual-vehicle-review">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-add="addannual"
      :disabled_show="disabled_show"
    ></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" v-if="!disabled_show" @click="showRowInfo(scope.data,1)">编辑</el-button>
        <el-button type="text" size="mini" @click="showRowInfo(scope.data,2)">查看</el-button>
        <!-- <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left:10px;color:red">删除</el-button>
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
    ></el-pagination>

    <annual-info-dialog
      ref="annualInfoDialog"
      :dialogBool.sync="annualDialog"
      :title="annualDialogTitle"
      :disabled="disabled"
      :curSelecedType="curSelecedType"
      @on-ok="submit"
      :bus_info="bus_info"
    ></annual-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import annualInfoDialog from "./component/annual-info-dialog";
export default {
  name: "annual-vehicle-review",
  props: ["bus_info","disabled_show"],
  components: {
    subReq,
    annualInfoDialog
  },
  data() {
    return {
      annualDialog: false,
      annualDialogTitle: '添加',
      curSelecedType: 'add',
      disabled: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      data: [],
      loading: false,
      TableHeight: 200,
      customSettingList: [
        {
          id: 1,
          label: "车牌号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "购车日期",
          prop: "buy_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车龄",
          prop: "bus_age",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "年检周期",
          prop: "interval_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "本次年检日期",
          prop: "check_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "年审金额",
          prop: "check_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "年审负责人",
          prop: "check_user_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ],
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 新增编辑
    submit(form,type) {
      form.bus_id = JSON.parse(this.bus_info).id
      if (type == "add") {
        this.$client.CreateBusYear({context:form}).then(res =>{
          if (res.head.result == "200") {
            this.annualDialog = false
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
      } else {
        this.$client.UpdateBusYear({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.annualDialog = false
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
      }
    },
    // 新增
    add() {
      this.curSelecedType = "add"
      this.annualDialogTitle = '添加'
      this.annualDialog = true
      this.disabled = false
    },
    // 编辑 查看
    showRowInfo(row,type) {
      if (type == 1) {
        this.curSelecedType = "edit"
        this.annualDialogTitle = '编辑'
        this.disabled = false
      } else {
        this.curSelecedType = "show"
        this.annualDialogTitle = '查看'
        this.disabled = true
      }
      this.annualDialog = true
      setTimeout(() => {
        this.$refs['annualInfoDialog'].setData(row)
      }, 100);
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 添加 保险信息
    addannual() {
      this.annualDialog = true
      this.curSelecedType = "add"
      this.annualDialogTitle = '添加'
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.bus_id = JSON.parse(this.bus_info).id
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetListBusYear(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            })
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          })
        })
    },
    // 导出
    onExport() {
      let params = Object.assign({}, this.form)
      params.bus_id = JSON.parse(this.bus_info).id
      this.$client.ExportBusYear(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context
            this.$message({ type: "success", message: "导出成功" })
          } else {
            this.$message({ type: "error", message: "导出失败" })
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" })
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
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH - 5
      }, 60)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.annual-vehicle-review {
  width: 100%;
  height: 510px;
}
</style>
