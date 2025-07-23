<template>
  <div class="vehicle-repair">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-add="addrepair"
      :disabled_show="disabled_show"
    ></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
    >
      <template slot-scope="scope" slot="flow_title">
        <el-button type="text" size="mini" @click="checkDetail(scope.data)">{{scope.data.flow_title}}</el-button>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" v-if="!disabled_show" @click="showRowInfo(scope.data,1)">编辑</el-button>
        <el-button type="text" size="mini" @click="showRowInfo(scope.data,2)">查看</el-button>
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

    <repair-info-dialog
      ref="repairInfoDialog"
      :dialogBool.sync="repairDialog"
      :title="repairDialogTitle"
      :disabled="disabled"
      :curSelecedType="curSelecedType"
      @on-ok="submit"
      :bus_code="bus_code"
      :bus_id="bus_id"
    ></repair-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import repairInfoDialog from "./component/repair-info-dialog";
export default {
  name: "vehicle-repair",
  props: ["bus_id","bus_code","disabled_show"],
  components: {
    subReq,
    repairInfoDialog
  },
  data() {
    return {
      repairDialog: false,
      repairDialogTitle: '添加',
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
          label: "关联加班单",
          prop: "flow_title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "维修日期",
          prop: "repair_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "bus_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "维修金额",
          prop: "repair_fee",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "维修负责人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 查看明细
    checkDetail(row, type) {
      // 关闭弹出框
      this.$parent.$parent.$parent.$parent.dialogClose()
      setTimeout(() => {
        let id = !!type ? row.id : row.form_id
        this.$router.push({
          path: `/news-details/${id}/${'待办事项:' + '公车维修申请'}/${1230}`
        })
      }, 100);
    },
    // 新增编辑
    submit(form,type) {
      form.bus_id = this.bus_id
      if (type == "add") {
        this.$client.AddRepair({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.repairDialog = false
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
        this.$client.EditBusRepair({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.repairDialog = false
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
    addrepair() {
      this.curSelecedType = "add"
      this.repairDialogTitle = '添加'
      this.repairDialog = true
      this.disabled = false
    },
    // 编辑 查看
    showRowInfo(row,type) {
      if (type == 1) {
        this.curSelecedType = "edit"
        this.repairDialogTitle = '编辑'
        this.disabled = false
      } else {
        this.curSelecedType = "show"
        this.repairDialogTitle = '查看'
        this.disabled = true
      }
      this.repairDialog = true
      setTimeout(() => {
        this.$refs['repairInfoDialog'].setData(row)
      }, 100);
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.bus_id = this.bus_id
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.BusRepairStatistics({context:params})
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
      this.$client.ExportRepairStatistics({context:params}).then((res) => {
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
.vehicle-repair {
  width: 100%;
  height: 510px;
}
</style>
