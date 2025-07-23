<template>
  <div class="material-collection-list">
    <sub-req
      ref="head"
      :pageType="'first'"
      @on-del="deleteSelect"
      @on-export="exportExcel"
      @on-query="queryData"
      @open-settingpage-event="openSettingPageEvent"
    ></sub-req>
    <tr-table
      :data="data"
      :TableHeight="TableHeight"
      :selectionShow="true"
      @on-select-change-row="getSelected"
      :loading="loading || headerLoading"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergeKeys"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader"
    >
      <template slot-scope="scope" slot="out_code">
        <span v-if="scope.data.out_code">{{ scope.data.out_code }}</span>
        <span v-else style="color: red">未关联</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          type="primary"
          size="mini"
          @click="showOrderDialog(scope.data.code, scope.index)"
          :disabled="!!scope.data.out_code"
        >
          生成出库单
        </el-button>
        <el-button type="primary" size="mini" @click="showListDetail(scope.data.code, scope.index)">
          查看
        </el-button>
        <!-- <el-popconfirm
          @confirm="deleteSelect(scope.data.l_id)"
          title="确定删除？">
          <el-button slot="reference" type="primary" size="mini">删除</el-button>
        </el-popconfirm> -->
      </template>
    </tr-table>
    <el-pagination
      style="margin-top: 15px; text-align: end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>
    <collection-list-dialog
      ref="collectionListDialog"
      :tableData="currentRowData"
      :dialogBool.sync="showDetail"
    ></collection-list-dialog>
    <generate-outgoing-order-dialog
      @refresh="loadData"
      ref="generateOutgoingOrderDialog"
      :defaultTableData="currentRowData"
      :dialogBool.sync="showOrder"
    ></generate-outgoing-order-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>
<script>
import subReq from './sub-req.vue'
import dataConfig from './dataConfig'
import collectionListDialog from './collection-list-dialog.vue'
import generateOutgoingOrderDialog from './generate-outgoing-order-dialog.vue'
import { formatDateTime } from '@/utils/index'
export default {
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0
      },
      queryFrom: {},
      data: [],
      customSettingVialogVisible: false,
      customSettingList: dataConfig.collectionTableHeaderData,
      canRendererTableHeader: null,
      customSettingShowList: null,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      mergeKeys: dataConfig.mergeKeys,
      rowspanObj: {},
      TableHeight: 0,
      loading: false,
      showDetail: false,
      showOrder: false,
      currentRowData: [],
      selectedList: [],
      titlesId: '', //当前表头的id
      menu_code: '',
      headerLoading: false
    }
  },
  components: {
    subReq,
    collectionListDialog,
    generateOutgoingOrderDialog
  },
  activated() {
    // this.loadData()
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {},
  methods: {
    openSettingPageEvent() {
      this.customSettingVialogVisible = true
    },
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader
        .saveTableHeader(this.titlesId, this.menu_code, newestTableHeaderList)
        .then(res => {
          this.reqTitleTable()
        })
        .catch(err => {})
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true
      this.$httpTableHeader
        .reqTableHeader(this.menu_code, this.customSettingList)
        .then(res => {
          this.titlesId = res.titlesId
          this.canRendererTableHeader = res.canRendererTableHeader
          this.customSettingList = res.customSettingList
          this.customSettingShowList = res.customSettingShowList
          this.$forceUpdate()
          setTimeout(() => {
            this.headerLoading = false
          }, 600)
        })
        .catch(err => {
          setTimeout(() => {
            this.headerLoading = false
          }, 600)
        })
    },

    exportExcel(info) {
      this.queryFrom = { ...info }
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
      let ids = [...this.selectedList]
      if (ids.length) {
        param.ids = ids.toString()
      }
      this.$client.exportMaintRepairPick(param).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    queryData(info) {
      this.queryFrom = { ...info }
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
    // 查看领料单
    showListDetail(code, index) {
      this.currentRowData = this.data.filter(item => item.code === code)
      this.$refs.collectionListDialog.form.code = this.data[index].code
      this.$refs.collectionListDialog.form.work_code = this.data[index].work_code
      this.$refs.collectionListDialog.form.remark = this.data[index].remark
      this.$refs.collectionListDialog.form.pick_date = this.data[index].pick_date
      this.$refs.collectionListDialog.form.lp_num = this.data[index].lp_num
      this.$refs.collectionListDialog.form.out_code = this.data[index].out_code
      this.$refs.collectionListDialog.form.warenhouse_name = this.data[index].warenhouse_name
      this.$refs.collectionListDialog.form.pick_user_name = this.data[index].pick_user_name
      this.$refs.collectionListDialog.form.lp_self_number = this.data[index].lp_self_number
      this.showDetail = true
    },
    // 生成出库单
    showOrderDialog(code, index) {
      this.$refs.generateOutgoingOrderDialog.materialForm.code = this.data[index].code
      this.$refs.generateOutgoingOrderDialog.materialForm.house_id = this.data[index].warenhouse_id
      this.$refs.generateOutgoingOrderDialog.materialForm.pick_id = this.data[index].pick_user
      this.$refs.generateOutgoingOrderDialog.materialForm.relate_num = this.data[index].work_code
      this.$refs.generateOutgoingOrderDialog.materialForm.id = this.data[index].l_id
      this.$refs.generateOutgoingOrderDialog.materialForm.pick_date = this.data[index].pick_date
      this.$refs.generateOutgoingOrderDialog.materialForm.leave_date = formatDateTime(new Date())
      this.showOrder = true
      setTimeout(() => {
        this.$refs.generateOutgoingOrderDialog.materialForm.lp_num = this.data[index].lp_num
        this.currentRowData = this.data.filter(item => item.code === code)
      }, 300)
    },
    // 删除
    deleteSelect(id) {
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
          })
            .then(() => {
              this.deleteSubmit(delId)
            })
            .catch(() => {})
        } else {
          this.$message({
            showClose: true,
            message: '请勾选要删除的选项',
            type: 'warning'
          })
        }
      }
    },
    // 发起删除请求
    deleteSubmit(delId) {
      this.$client.delMaintRepairPick({ context: delId }).then(res => {
        if (res.head.result == '200') {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'success'
          })
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    getSelected(val) {
      if (val && val.length) {
        this.selectedList = Array.from(new Set(val.map(item => item.l_id)))
      } else {
        this.selectedList = []
      }
    },
    loadData() {
      let param = {
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize,
        // sort: 'code',
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
      this.$client.getMaintRepairPick(param).then(res => {
        this.loading = false
        if (res.head.result === '200') {
          this.pageInfo.pageCount = res.context.total
          this.data = res.context.list
            .map((item, index) => {
              let obj = { ...item }
              obj.l_id = item.id
              obj.id = index
              obj.pick_date = item.pick_date
              let groupgo = ''
              if (item.specification == null) {
                groupgo = item.material_name + '(' + item.material_code + ')'
              } else {
                groupgo = item.material_name + item.specification + '(' + item.material_code + ')'
              }
              obj.groupgo = groupgo
              return obj
            })
            .sort((a, b) => b.code.substr(2) - a.code.substr(2))
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
.material-collection-list {
  width: 100%;
  height: 100%;
}
</style>
