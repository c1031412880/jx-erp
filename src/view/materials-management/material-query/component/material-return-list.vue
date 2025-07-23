<template>
  <div class="material-return-list">
    <sub-req ref="head" :pageType="'second'" :options="options" @on-export="exportExcel" @on-del="deleteSelect" @on-query="queryData" :showCar="false"></sub-req>
    <tr-table
      :data="data"
      :TableHeight="TableHeight"
      :loading="loading"
      :selectionShow="true"
      @on-select-change-row="getSelected"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergeKeys"
      :frontFixedNum="1"
      :backFixedNum="1"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="in_code">
        <span v-if="scope.data.in_code">{{ scope.data.in_code }}</span>
        <span v-else style="color:red;">未关联</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="showOrderDialog(scope.data.code, scope.index)" :disabled="!!scope.data.in_code || !!scope.data.is_refund">生成入库单</el-button>
        <el-button type="primary" size="mini" @click="showListDetail(scope.data.code, scope.index)">查看</el-button>
        <!-- <el-popconfirm
          @confirm="deleteSelect(scope.data.t_id)"
          title="确定删除？">
          <el-button slot="reference" type="primary" size="mini">删除</el-button>
        </el-popconfirm> -->
      </template>
    </tr-table>
    <el-pagination
      style="margin-top: 15px;text-align: end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>
    <return-list-dialog ref="returnListDialog" :tableData="currentRowData" :dialogBool.sync="showDetail"></return-list-dialog>
    <generate-entry-order-dialog @refresh="loadData" ref="generateEntryOrderDialog" :defaultTableData="currentRowData" :dialogBool.sync="showOrder"></generate-entry-order-dialog>
  </div>
</template>
<script>
import subReq from './sub-req.vue'
import dataConfig from "./dataConfig"
import returnListDialog from './return-list-dialog.vue'
import generateEntryOrderDialog from './generate-entry-order-dialog.vue'
import { formatTime } from "@/utils/index"
export default {
  data () {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      options: [
        { value: '1', label: '关联工单' },
        { value: '2', label: '关联退料入库单' }
      ],
      queryFrom: {},
      data: [],
      canRendererTableHeader: dataConfig.returnTableHeaderData,
      mergeKeys: dataConfig.returnMergeKeys,
      rowspanObj: {},
      TableHeight: 0,
      loading: false,
      showDetail: false,
      showOrder: false,
      currentRowData: [],
      selectedList: []
    }
  },
  components: {
    subReq,
    returnListDialog,
    generateEntryOrderDialog
  },
  activated() {
    // this.loadData()
  },
  mounted() {
  },
  methods: {
    exportExcel(info) {
      this.queryFrom = {...info}
      let param = {
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize,
        material_name: this.queryFrom.material_name,
        material_code: this.queryFrom.material_code,
        specification: this.queryFrom.specification,
        pick_date_start: this.queryFrom.start_date,
        pick_date_end: this.queryFrom.end_date,
        type: this.queryFrom.associated_type,
        vehicle_ids: this.queryFrom.vehicle_ids,
        relate_num: this.queryFrom.relate_id
      }
      let ids = [ ...this.selectedList ]
      if(ids.length) {
        param.ids = ids.toString()
      }
      this.$client.exportMaintRepairRefund(param).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        } else {
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    queryData(info) {
      this.queryFrom = {...info}
      this.loadData()
    },
    // 计算表格高度
    setHead() {
      let t = setTimeout(() => {
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = this.$el.offsetHeight - th - paginationH - 20
        clearTimeout(t)
      }, 60)
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
    // 查看退料单
    showListDetail(code, index) {
      this.currentRowData = this.data.filter(item => item.code === code)
      this.$refs.returnListDialog.form.code = this.data[index].code
      this.$refs.returnListDialog.form.work_code = this.data[index].work_code
      this.$refs.returnListDialog.form.remark = this.data[index].remark
      this.$refs.returnListDialog.form.created_date = this.data[index].created_date
      this.$refs.returnListDialog.form.lp_num = this.data[index].lp_num
      this.$refs.returnListDialog.form.in_code = this.data[index].in_code
      this.$refs.returnListDialog.form.warenhouse_name = this.data[index].warenhouse_name
      this.$refs.returnListDialog.form.created_name = this.data[index].created_name
      this.showDetail = true
    },
    // 生成入库单
    showOrderDialog(code, index) {
      console.log(code, this.data[index]);
      this.currentRowData = this.data.filter(item => item.code === code)
      this.$refs.generateEntryOrderDialog.form.id = this.data[index].t_id
      this.$refs.generateEntryOrderDialog.form.code = this.data[index].code
      this.$refs.generateEntryOrderDialog.form.house_id = this.data[index].warenhouse_id
      this.$refs.generateEntryOrderDialog.form.created_date = this.data[index].created_date
      this.$refs.generateEntryOrderDialog.form.lp_num = this.data[index].lp_num
      this.$refs.generateEntryOrderDialog.form.work_code = this.data[index].work_code
      this.$refs.generateEntryOrderDialog.form.remark = this.data[index].remark
      this.showOrder = true
    },
    // 删除
    deleteSelect (id) {
      let delId = []
      if (id) {
        delId.push(id)
        this.deleteSubmit(delId)
      } else {
        if (this.selectedList && this.selectedList.length) {
          delId = [...delId, ...this.selectedList]
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then( () => {
            this.deleteSubmit(delId)
          }).catch(() => {})
        } else {
          this.$message({
            showClose: true,
            message: '请勾选要删除的选项',
            type: "warning"
          })
        }
      }
    },
    // 发起删除请求
    deleteSubmit(delId) {
      this.$client.delMaintRepairRefund({context: delId}).then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          })
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          })
        }
      })
    },
    getSelected(val) {
      if (val && val.length) {
        this.selectedList = Array.from(new Set(val.map(item => item.t_id)))
      } else {
        this.selectedList = []
      }
    },
    loadData() {
      let param = {
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize,
        material_name: this.queryFrom.material_name,
        material_code: this.queryFrom.material_code,
        specification: this.queryFrom.specification,
        pick_date_start: this.queryFrom.start_date,
        pick_date_end: this.queryFrom.end_date,
        type: this.queryFrom.associated_type,
        vehicle_ids: this.queryFrom.vehicle_ids,
        relate_num: this.queryFrom.relate_id
      }
      this.loading = true
      this.$client.getMaintRepairRefund(param).then(res => {
        this.loading = false
        if (res.head.result === '200') {
          this.pageInfo.pageCount = res.context.total
          this.data = res.context.list.map((item, index) => {
            let obj = {...item}
            obj.t_id = item.id
            obj.id = index
            obj.created_date = formatTime(new Date(item.created_date))
            let groupgo = '' 
            if (item.specification == null) {
              groupgo = item.material_name + "(" + item.material_code + ")"
            } else {
              groupgo = item.material_name + item.specification + "(" + item.material_code + ")"
            }
            obj.groupgo = groupgo
            return obj
          }).sort((a, b) => b.code.substr(2) - a.code.substr(2))
          let rowspanObj = this.$handleTableSpan(this.mergeKeys, this.data)
          let codeKey = rowspanObj['code']
          Object.keys(rowspanObj).forEach(key => {
            rowspanObj[key] = codeKey
          })
          this.rowspanObj = rowspanObj
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.material-return-list {
  width: 100%;
  height: 100%;
}
</style>