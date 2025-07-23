<template>
  <div class="refueling-statistics">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-add="addrefueling"
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

    <refueling-info-dialog
      ref="refuelingInfoDialog"
      :dialogBool.sync="refuelingDialog"
      :title="refuelingDialogTitle"
      :disabled="disabled"
      :curSelecedType="curSelecedType"
      @on-ok="submit"
      :bus_code="bus_code"
      :last_mile="last_mile"
      :bus_id="bus_id"
    ></refueling-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import refuelingInfoDialog from "./component/refueling-info-dialog";
export default {
  name: "refueling-statistics",
  props: ["bus_id","bus_code","last_mile","disabled_show"],
  components: {
    subReq,
    refuelingInfoDialog
  },
  data() {
    return {
      refuelingDialog: false,
      refuelingDialogTitle: '添加',
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
          label: "关联审批单",
          prop: "flow_title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "加油日期",
          prop: "oil_date",
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
          label: "加油时公里数（公里）",
          prop: "oil_mile",
          width: "200",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "加油类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "加油金额（元）",
          prop: "oil_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "加油负责人",
          prop: "user_name",
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
    console.log('this.$parent',this.$parent);
  },
  methods: {
    // 查看明细
    checkDetail(row, type) {
      // 关闭弹出框
      this.$parent.$parent.$parent.$parent.dialogClose()
      setTimeout(() => {
        let id = !!type ? row.id : row.form_id
        this.$router.push({
          path: `/news-details/${id}/${'待办事项:' + "公车加油申请"}/${1220}`
        })
      }, 100);
    },
    // 新增编辑
    submit(form,type) {
      form.bus_id = this.bus_id
      if (type == "add") {
        this.$client.AddBusOil({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.refuelingDialog = false
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
        this.$client.EditBusOil({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.refuelingDialog = false
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
      this.refuelingDialogTitle = '添加'
      this.refuelingDialog = true
      this.disabled = false
    },
    // 编辑 查看
    showRowInfo(row,type) {
      if (type == 1) {
        this.curSelecedType = "edit"
        this.refuelingDialogTitle = '编辑'
        this.disabled = false
      } else {
        this.curSelecedType = "show"
        this.refuelingDialogTitle = '查看'
        this.disabled = true
      }
      this.refuelingDialog = true
      setTimeout(() => {
        this.$refs['refuelingInfoDialog'].setData(row)
      }, 100);
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 添加 保险信息
    addrefueling() {
      this.refuelingDialog = true
      this.curSelecedType = "add"
      this.refuelingDialogTitle = '添加'
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.bus_id = this.bus_id
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.BusOilStatistics({context:params})
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
      this.$client.ExportOilStatistics({context:params}).then((res) => {
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
.refueling-statistics {
  width: 100%;
  height: 510px;
}
</style>
