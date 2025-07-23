<template>
  <div class="purchase-inquiry-manage">
    <sub-req 
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @on-del="deleteSelect"
      @on-export="exportFile"
    ></sub-req>
    <c-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
      >
      <template slot-scope="scope" slot="operation" >
        <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button>
        <el-button type="text" size="mini" @click="editRowInfo(scope.data,'edit')">编辑</el-button>
        <el-popconfirm
          v-if="$isPowerShow('del')"
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
        </el-popconfirm>
      </template>
    </c-table>
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

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import SubReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import cTable from "./component/c-table";
export default {
  name: "purchase-inquiry-manage",
  components: {
    SubReq,
    informationDialog,
    cTable
  },
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "询价单号",
          prop: "ask_order",
          width: "140",
          align: "center",
          signIndex:0
        },
        {
          id: 2,
          label: "询价日期",
          prop: "ask_date",
          width: "140",
          align: "center",
          signIndex:1
        },
        {
          id: 3,
          label: "询价供应商",
          prop: "supplier_name",
          width: "140",
          align: "center",
          signIndex:2
        },
        {
          id: 4,
          label: "物料编号",
          prop: "material_code",
          width: "140",
          align: "center",
          signIndex:3
        },
        {
          id: 5,
          label: "物料名称",
          prop: "material_name",
          width: "140",
          align: "center",
          signIndex:4
        },
        {
          id: 6,
          label: "规格型号",
          prop: "spec",
          width: "140",
          align: "center",
          signIndex:5
        },
        {
          id: 7,
          label: "单位",
          prop: "unit",
          width: "140",
          align: "center",
          signIndex:6
        },
        {
          id: 8,
          label: "预计采购数量",
          prop: "count",
          width: "140",
          align: "center",
          signIndex:7
        },
        {
          id: 9,
          label: "报价单价",
          prop: "price",
          width: "140",
          align: "center",
          signIndex:8
        },
        {
          id: 10,
          label: "报价金额",
          prop: "total_price",
          width: "140",
          align: "center",
          signIndex:9
        },
        {
          id: 11,
          label: "采购员",
          prop: "purchase_person",
          width: "140",
          align: "center",
          signIndex:10
        },
        {
          id: 12,
          label: "备注",
          prop: "remark",
          width: "140",
          align: "center",
          signIndex:11
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex:12
        },
      ],
      TableHeight: 400,
      loading: false,
      frontFixedNum: 1,
      backFixedNum: 1,

      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      tyreFailIds: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead()
    })
  },
  //方法集合",
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据查询
    loadData() {
      let params = Object.assign({}, this.form);
      this.form.page_size = this.pageInfo.pageSize
      this.form.page_index = this.pageInfo.pageIndex
      this.loading = true
      this.$client.GetListPurchaseOrderAsk(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
        console.log(req)
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
    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      this.$client.ExportPurchaseOrderAsk(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    openAddJobPage() {
      this.curSelecedType = 'add';
      this.informationDialogTitle = "采购询价单";
      this.informationDialogShow = true;
    },
    editRowInfo(form,type) {
      this.curSelecedType = type;
      this.$client.GetDetailPurchaseOrderAsk({id:form.id})
      .then(res => {
        if(res.head.result == '200') {
          this.$nextTick(() => {
            this.$refs.informationDialog.setData(res.context)
          })
          if(type == 'edit') {
            this.informationDialogTitle = "编辑采购询价单";
          }else{
            this.informationDialogTitle = "查看采购询价单";
          }

          this.informationDialogShow = true;
        }else{
          this.$message({type: 'error', message: '失败'})
        }
      })
    },
    selectedUpkeepPlanList(tyreFailList) {
      this.tyreFailIds = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
      });
    },
    saveAddEdit(form) {
      if (this.curSelecedType == "add") {
        delete form.id;
        this.$client.InsertPurchaseOrderAsk([form])
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: '添加成功',
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
        .catch((err) => {});
      } else {
        this.$client.UpdatePurchaseOrderAsk([form])
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: '编辑成功',
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
        .catch((err) => {});
      }
    },
    // 批量删除
    deleteSelect() {
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除选项',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.DeletePurchaseOrderAsk(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
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
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - (th + paginationH)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.purchase-inquiry-manage{
  width: 100%;
  height: 100%;
}
</style>
