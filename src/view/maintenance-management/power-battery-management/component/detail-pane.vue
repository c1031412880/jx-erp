<template>
  <div class="detail-pane">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="openAddRowInfo"
      @on-export="exportExcel"
      @on-delete-batch="batchDelete"
      paneType="entry"
    ></sub-req>

    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectChange"
    >
      <template slot-scope="scope" slot="operation">
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'detail')"
          v-if="$isPowerShow('edit')"
        >
          查看
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit')"
        >
          编辑
        </el-button>
        <el-button
          v-if="$isPowerShow('del')"
          type="text"
          style="color: #f56c6c"
          size="mini"
          @click="deleteRowInfo(scope.data.id)"
        >
          删除
        </el-button>
      </template>
    </tr-table>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
  </div>
</template>

<script>
import subReq from './sub-req'
import informationDialog from './information-dialog'
export default {
  name: 'detail-pane',
  components: {
    subReq,
    informationDialog
  },
  data() {
    return {
      form: {},
      data: [],
      currentSelectData: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: '',
      informationDialogTitle: '添加',
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
          width: '200',
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
          prop: 'remark',
          width: '250',
          align: 'center',
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: '操作',
          prop: 'operation',
          width: '180',
          align: 'center',
          signIndex: 13,
          sortable: false
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null
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
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.page_index = 1
      params.page_size = 9999
      this.$client
        .GetListPowerBattery(params)
        .then(res => {
          this.loading = false
          if (res.head.result == '200') {
            this.data = res.context.list
          } else {
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
            message: err.message,
            type: 'error'
          })
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
      this.$client.ExportPowerBattery(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    openAddRowInfo() {
      this.curSelecedType = 'add'
      this.informationDialogTitle = '添加'
      this.informationDialogShow = true
    },
    // 编辑
    editRowInfo(form, type) {
      this.curSelecedType = type
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key]
            if (key == 'vehicle_model_type_id') {
              let value = form[key]
              value && this.$refs.informationDialog.vehModelChange(value)
            }
          }
        }
      }, 100)
      this.informationDialogTitle = type == 'edit' ? '编辑' : '详情'
      this.informationDialogShow = true
    },
    saveAddEdit(form) {
      const key = form.id ? 'SingleUpdatePowerBattery' : 'SingleInsertPowerBattery'
      this.$client[key](form).then(res => {
        if (res.head.result == '200') {
          this.informationDialogShow = false
          this.loadData()
          this.$message({
            showClose: true,
            message: form.id ? '编辑成功' : '添加成功',
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
    deleteRowInfo(id) {
      this.$confirm('确认删除该条数据吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.sendDeleteInfos(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
        .DeletePowerBattery({
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
    selectChange(data) {
      this.currentSelectData = [...data]
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
      }
      this.$nextTick(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.detail-pane {
  width: 100%;
  height: 100%;
}
</style>
