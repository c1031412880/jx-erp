<template>
  <div class="vehicle-insurance">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-add="addInsurance"
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
        <el-popconfirm
          v-if="!disabled_show"
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left:10px;color:red">删除</el-button>
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
    ></el-pagination>

    <insurance-info-dialog
      ref="insuranceInfoDialog"
      :dialogBool.sync="insuranceDialog"
      :title="insuranceDialogTitle"
      :disabled="disabled"
      :curSelecedType="curSelecedType"
      @on-ok="submit"
      :bus_code="bus_code"
    ></insurance-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import insuranceInfoDialog from "./component/insurance-info-dialog";
export default {
  name: "vehicle-insurance",
  props: ["bus_id","bus_code","disabled_show"],
  components: {
    subReq,
    insuranceInfoDialog
  },
  data() {
    return {
      insuranceDialog: false,
      insuranceDialogTitle: '添加',
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
          prop: "bus_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "保险单号",
          prop: "insurance_code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "保险种类",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "保险公司",
          prop: "company_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "投保日期",
          prop: "insurance_start",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "保险到期日期",
          prop: "insurance_end",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "投保金额(元)",
          prop: "insure_fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "实付金额(元)",
          prop: "actual_fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ],
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 删除
    deleteRowInfo(row){
      this.$client.DeleteInsurance({context:[row.id]}).then(res =>{
        if(res.head.result == "200") {
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
      })
    },
    // 新增编辑
    submit(form,type) {
      form.bus_id = this.bus_id
      if (type == "add") {
        this.$client.CreateInsurance({context:form}).then(res =>{
          if (res.head.result == "200") {
            this.insuranceDialog = false
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
        this.$client.UpdateInsurance({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.insuranceDialog = false
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
      this.insuranceDialogTitle = '添加'
      this.disabled = false
      this.insuranceDialog = true
    },
    // 编辑 查看
    showRowInfo(row,type) {
      if (type == 1) {
        this.curSelecedType = "edit"
        this.insuranceDialogTitle = '编辑'
        this.disabled = false
      } else {
        this.curSelecedType = "show"
        this.insuranceDialogTitle = '查看'
        this.disabled = true
      }
      this.insuranceDialog = true
      setTimeout(() => {
        this.$refs['insuranceInfoDialog'].setData(row)
      }, 100);
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 添加 保险信息
    addInsurance() {
      this.insuranceDialog = true
      this.curSelecedType = "add"
      this.insuranceDialogTitle = '添加'
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.bus_id = this.bus_id
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetListInsurance(params)
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
      params.bus_id = this.bus_id
      this.$client.ExportInsurance(params).then((res) => {
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
.vehicle-insurance {
  width: 100%;
  height: 510px;
}
</style>
