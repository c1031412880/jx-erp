<template>
  <div class="scrap-pane">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-edit="onEdit"
      @on-delete-batch="batchDelete"
      @on-import="openImportPage"
      @on-export="exportExcel"
      paneType="scrap"
    ></sub-req>

    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectChange"
    ></tr-table>
    <!-- <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination> -->
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'相同车牌号的车'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
    <scrap-dialog :dialogVisible.sync="scrapDialogVisible" @save-edit="saveEdit"></scrap-dialog>
  </div>
</template>
<script>
import { formatTime, getDistanceDays } from '@/utils/index'
import fileDialog from '@/components/fileDialog/file-dialog.vue'
import subReq from './sub-req'
import scrapDialog from './scrap-dialog'
export default {
  name: 'scrap-pane',
  components: {
    subReq,
    fileDialog,
    scrapDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      days: '',
      form: {},
      data: [],
      currentSelectData: [],
      loading: false,
      scrapDialogVisible: false,
      TableHeight: 400,
      customSettingList: [
        {
          id: 1,
          label: '车辆型号',
          prop: 'vehicle_model_type',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '关联车辆',
          prop: 'vehicle_names',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '车辆数',
          prop: 'count',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '登记日期',
          prop: 'regist_date',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: '动力电池品牌/类型',
          prop: 'battery_type_name',
          width: '160',
          align: 'center',
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: '电池型号',
          prop: 'battery_model',
          width: '150',
          align: 'center',
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: '电池容量(千瓦时)',
          prop: 'battery_capacity',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: '动力类别',
          prop: 'power_type_name',
          width: '130',
          align: 'center',
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: '理论续航里程(KM)',
          prop: 'theoretical_range',
          width: '160',
          align: 'center',
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: '电池额定电压(V)',
          prop: 'nominal_voltage',
          width: '130',
          align: 'center',
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: '电池额定容量(Ah)',
          prop: 'rated_capacity',
          width: '160',
          align: 'center',
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: '质保期(年)',
          prop: 'warranty_period',
          width: '130',
          align: 'center',
          signIndex: 11,
          sortable: false
        },
        {
          id: 13,
          label: '备注',
          prop: 'created_name',
          width: '130',
          align: 'center',
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: '电池回收价值(元)',
          prop: 'recovery_value',
          width: '130',
          align: 'center',
          signIndex: 13,
          sortable: false
        },
        {
          id: 15,
          label: '尾气处理器(元)',
          prop: 'exhaust_gas_processor',
          width: '130',
          align: 'center',
          signIndex: 14,
          sortable: false
        },
        {
          id: 16,
          label: '经办人',
          prop: 'agent_person',
          width: '130',
          align: 'center',
          signIndex: 15,
          sortable: false
        },
        {
          id: 17,
          label: '报废日期',
          prop: 'scrap_date',
          width: '130',
          align: 'center',
          signIndex: 16,
          sortable: false
        }
        // {
        //   id: 18,
        //   label: '操作',
        //   prop: 'operation',
        //   width: '220',
        //   align: 'center',
        //   signIndex: 17,
        //   sortable: false
        // }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK + '/Files/TempFiles/车辆气耗明细模板.xlsx'
      },
      filedialogVisible: false,
      dateRange: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
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
      params.page_index = 1
      params.page_size = 99999
      this.$client
        .GetListPowerBatteryScrap(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loading = false
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    onEdit() {
      if (!this.currentSelectData.length) {
        this.$message({ type: 'warning', message: '请勾选要编辑的数据' })
        return
      }
      this.scrapDialogVisible = true
    },
    saveEdit(form) {
      let params = this.currentSelectData.map(x => ({
        ...x,
        ...form
      }))
      this.$client.UpdatePowerBatteryScrap(params).then(res => {
        if (res.head.result == '200') {
          this.scrapDialogVisible = false
          this.loadData()
          this.$message({
            showClose: true,
            message: '编辑成功',
            type: 'error'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    batchDelete() {
      if (!this.currentSelectData.length) {
        this.$message({ type: 'warning', message: '请勾选要删除的数据' })
        return
      }
      this.$confirm('确认删除勾选的数据吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = this.currentSelectData.map(item => item.id)
          this.sendDeleteInfos(ids)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    sendDeleteInfos(id) {
      let targetIds = Array.isArray(id) ? id : [id]
      this.$client
        .DeletePowerBatteryScrap({
          context: targetIds
        })
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
    },
    // 打开导入弹窗
    openImportPage() {
      this.filedialogVisible = true
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData()
      formData.append('file', exportInfo.file)
      formData.append('type', exportInfo.radio)
      let params = formData
      this.$client.ImportVehicleGasDetail(params).then(res => {
        if (res.head.result == '200') {
          this.loadData()
          this.filedialogVisible = false
          this.$message({ message: res.head.describle, type: 'success' })
        } else {
          this.filedialogVisible = false
          let errorData = []
          const h = this.$createElement
          errorData.push(h('p', null, res.head.describle))
          this.$msgbox({
            title: '提示',
            message: h('div', null, errorData),
            confirmButtonText: '确定'
          })
        }
      })
    },
    // 导出Excel 文件
    exportExcel() {
      let params = {
        context: {}
      }
      params.context = Object.assign({}, this.form)
      params.page_index = 1
      params.page_size = 99999
      this.$client.ExportPowerBatteryScrap(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
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
    selectChange(data) {
      this.currentSelectData = [...data]
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.scrap-pane {
  width: 100%;
  height: 100%;
}
</style>
