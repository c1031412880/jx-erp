<template>
  <div class="material-table">
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="tableHeaderList"
      @on-select-change-row="getSelected"
      :TableHeight="TableHeight"
      :loading="loading"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergeKeys"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      border
      stripe
      selectionShow
      highlight-current-row
      :isFixedEmptyPlaceholder="false">
      <template slot-scope="scope" slot="operation">
        <el-button :disabled = "!!scope.data.out_code" @click="editMaterial(scope.data.code)" type="text" size="mini">编辑</el-button>
        <el-popconfirm
          :disabled = "!!scope.data.out_code"
          @confirm="del(scope.data.code)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" :disabled = "!!scope.data.out_code" type="text" size="mini" style="margin-left: 10px;" >移除</el-button>
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
    >
    </el-pagination>
    <add-material-dialog :title="title" @refresh="refresh" ref="addMaterialDialog" :dialogBool.sync="addmaterialdDialog" :curSelectType="curSelectType"></add-material-dialog>
  </div>
</template>
<script>
import addMaterialDialog from "./add-material-dialog"
import { formatTime } from "@/utils/index"
export default {
  components: {
    addMaterialDialog
  },
  data () {
    return {
      TableHeight: 250,
      loading: false,
      data: [],
      originalList: [],
      selectedList: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      mergeKeys: [
        "code",
        "pick_user_name",
        "pick_date",
        "out_code",
        "waiting_time",
        "operation"
      ],
      rowspanObj: {},
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      addmaterialdDialog: false,
      curSelectType: 'add',
      title: '',
      order_id: '',
      tableHeaderList: [{
        id: 1,
        label: "领料单号",
        prop: "code",
        width: "150",
        align: "center",
        signIndex: "",
        sortable: false,
      }, {
        id: 2,
        label: "物料编号",
        prop: "material_code",
        width: "130",
        align: "center",
        signIndex: 1,
        sortable: false,
      }, {
        id: 3,
        label: "物料名称",
        prop: "material_name",
        width: "130",
        align: "center",
        signIndex: 2,
        sortable: false,
      }, {
        id: 4,
        label: "规格型号",
        prop: "specification",
        width: "130",
        align: "center",
        signIndex: 3,
        sortable: false,
      }, {
        id: 5,
        label: "单位",
        prop: "measure_unit_name",
        width: "130",
        align: "center",
        signIndex: 4,
        sortable: false,
      }, {
        id: 5,
        label: "领料类型",
        prop: "pick_type_name",
        width: "130",
        align: "center",
        signIndex: 4,
        sortable: false,
      }, {
        id: 6,
        label: "领取数量",
        prop: "count",
        width: "130",
        align: "center",
        signIndex: 5,
        sortable: false,
      }, {
        id: 7,
        label: "领料人",
        prop: "pick_user_name",
        width: "130",
        align: "center",
        signIndex: 6,
        sortable: false,
      }, {
        id: 8,
        label: "领料日期",
        prop: "pick_date",
        width: "130",
        align: "center",
        signIndex: 7,
        sortable: false,
      }, {
        id: 9,
        label: "出库单编号",
        prop: "out_code",
        width: "130",
        align: "center",
        signIndex: 8,
        sortable: false,
      }, {
        id: 9,
        label: "待料时长(分钟)",
        prop: "waiting_time",
        width: "130",
        align: "center",
        signIndex: 8,
        sortable: false,
      }, {
        id: 10,
        label: "操作",
        prop: "operation",
        width: "130",
        align: "center",
        signIndex: 9,
        sortable: false,
      }]
    }
  },
  mounted () {},
  methods: {
    // 加载数据
    loadData(order_id) {
      this.order_id = order_id
      let param = {
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize,
        order_ids: [this.order_id]
      }
      this.loading = true
      this.$client.getMaintRepairPick(param).then(res => {
        this.data = []
        this.loading = false
        if (res.head.result == "200") {
          this.pageInfo.pageCount = res.context.total
          let list = res.context.list
          this.originalList = list
          this.data = list.map((item, index) => {
            let obj = {...item}
            obj.l_id = item.id
            obj.id = index
            obj.pick_date = formatTime(new Date(item.pick_date))
            let groupgo = '' 
            if (item.specification == null) {
              groupgo = item.material_name + "(" + item.material_code + ")"
            } else {
              groupgo = item.material_name + item.specification + "(" + item.material_code + ")"
            }
            obj.groupgo = groupgo
            return obj
          })
          if(!!this.data && this.data.length) {
            let rowspanObj = this.$handleTableSpan(this.mergeKeys, this.data)
            let codeKey = rowspanObj['code']
            Object.keys(rowspanObj).forEach(key => {
              rowspanObj[key] = codeKey
            })
            this.rowspanObj = rowspanObj
          }
          
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
      })
    },
    // 刷新数据
    refresh() {
      this.loadData(this.order_id)
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData(this.order_id)
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData(this.order_id)
    },
    // 展示添加物料弹框
    showAddmaterialdDialog() {
      this.title = '添加领料单'
      this.curSelectType = 'add'
      this.addmaterialdDialog = true
      this.$nextTick(() => {
        this.$refs.addMaterialDialog.setData({}, true)
      })
    },
    // 编辑当前领料单
    editMaterial(code) {
      this.title = '编辑领料单'
      this.curSelectType = 'edit'
      this.addmaterialdDialog = true
      let data = this.originalList.filter(item => item.code == code)
      this.$nextTick(() => {
        this.$refs.addMaterialDialog.setData(data)
        this.$refs.addMaterialDialog.materialForm.id = data[0].id
      })
    },
    getSelected(val) {
      if (val && val.length) {
        this.selectedList = Array.from(new Set(val.map(item => item.l_id)))
      } else {
        this.selectedList = []
      }
    },
    // 批量删除
    batchDelete() {
      if (this.selectedList.length) {
        // 已关联出库单无法删除
        let flag = this.data.some(item => {
          return this.selectedList.some(child => {
            return item.l_id == child && item.out_code
          })
        })
        console.log(flag)
        if (flag) {
          this.$message({
            showClose: true,
            message: '勾选项中已有关联出库单，无法删除',
            type: "warning"
          })
        } else {
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then( () => {
            this.deleteSubmit(this.selectedList)
          }).catch( () => {})
        }
      } else {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: "warning"
        })
      }
    },
    // 删除当前领料单
    del(code) {
      let id = this.originalList.filter(item => item.code == code)[0].id
      this.deleteSubmit([id])
    },
    deleteSubmit(ids) {
      this.$client.delMaintRepairPick({context: ids}).then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          })
          this.refresh()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          })
        }
      })
    },
    // 关联工单号， 车牌号, 工单ID
    setData(workCode, vehicleName, workId) {
      this.$refs.addMaterialDialog.materialForm.relate_num = workCode
      this.$refs.addMaterialDialog.materialForm.lp_num = vehicleName
      this.$refs.addMaterialDialog.materialForm.order_id = workId
    }
  }
}
</script>
<style scoped>
.material-table {
  margin-top: 10px;
}
</style>
