<template>
  <div class="inspection-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="openAddPage"
      @on-import="openImportPage"
      @on-export="exportFile"
    ></sub-req>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :loading="loading"
    >
      <template slot-scope="scope" slot="order_state_name">
        <p :style="{ color: outColor(scope.data.order_state) }">
          {{ scope.data.order_state_name }}
        </p>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'copy')">
          复制工单
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
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'edit', true)"
          v-if="[6, 8].includes(scope.data.order_state) && $isPowerShow('completed')"
        >
          办结
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'detail')"
          v-if="!scope.data.flow_code"
        >
          查看
        </el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="![1, 2].includes(scope.data.order_state) && $isPowerShow('del')"
        >
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px">
            删除
          </el-button>
        </el-popconfirm>
        <el-button
          type="text"
          size="mini"
          @click="checkDetail(scope.data)"
          v-if="scope.data.flow_code"
        >
          查看
        </el-button>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelectedType="curSelectedType"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :typeMessage="'相同记录'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>

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
import subReq from './component/sub-req'
import informationDialog from './component/information-dialog'
import fileDialog from './component/file-dialog'
export default {
  name: 'inspection-management',
  components: {
    subReq,
    informationDialog,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: '工单状态',
          prop: 'order_state_name',
          width: '130',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '工单所属',
          prop: 'order_affiliation_name',
          width: '130',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '车牌号(自编号)',
          prop: 'vehicle_name',
          width: '130',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '所属组织',
          prop: 'dept_name',
          width: '120',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '所属线路',
          prop: 'line_name',
          width: '120',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '当班驾驶员',
          prop: 'driver_name',
          width: '120',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '设备状态',
          prop: 'device_name',
          width: '120',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '监控开始时间',
          prop: 'start_time',
          width: '180',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '监控结束时间',
          prop: 'end_time',
          width: '180',
          align: 'center',
          signIndex: 8
        },
        {
          id: 10,
          label: '监控通道',
          prop: 'device_thorough_name',
          width: '180',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '稽查方式',
          prop: 'check_type_name',
          width: '180',
          align: 'center',
          signIndex: 10
        },
        {
          id: 12,
          label: '检查站点',
          prop: 'check_station',
          width: '180',
          align: 'center',
          signIndex: 11
        },
        {
          id: 13,
          label: '检查时间',
          prop: 'check_time',
          width: '180',
          align: 'center',
          signIndex: 12
        },
        {
          id: 14,
          label: '检查主要内容',
          prop: 'check_content',
          width: '180',
          align: 'center',
          signIndex: 13
        },
        {
          id: 15,
          label: '备注',
          prop: 'remark',
          width: '180',
          align: 'center',
          signIndex: 14
        },
        {
          id: 16,
          label: '检验员',
          prop: 'check_user_name',
          width: '180',
          align: 'center',
          signIndex: 15
        },
        {
          id: 17,
          label: '奖罚依据',
          prop: 'violation_according',
          width: '180',
          align: 'center',
          signIndex: 16
        },
        {
          id: 18,
          label: '违规类型',
          prop: 'violation_type',
          width: '180',
          align: 'center',
          signIndex: 17
        },
        {
          id: 19,
          label: '加/减分',
          prop: 'score',
          width: '180',
          align: 'center',
          signIndex: 18
        },
        {
          id: 20,
          label: '驾驶员处理情况',
          prop: 'handle_result',
          width: '180',
          align: 'center',
          signIndex: 19
        },
        {
          id: 21,
          label: '修复情况',
          prop: 'repair_state',
          width: '180',
          align: 'center',
          signIndex: 20
        },
        {
          id: 22,
          label: '处理时间',
          prop: 'finish_time',
          width: '180',
          align: 'center',
          signIndex: 21
        },
        {
          id: 23,
          label: '处理人',
          prop: 'finish_user',
          width: '180',
          align: 'center',
          signIndex: 22
        },
        {
          id: 24,
          label: '审批单状态',
          prop: 'state_name',
          width: '180',
          align: 'center',
          signIndex: 23
        },
        {
          id: 25,
          label: '审批单号',
          prop: 'flow_code',
          width: '180',
          align: 'center',
          signIndex: 24
        },
        {
          id: 26,
          label: '操作',
          prop: 'operation',
          width: '300',
          align: 'center',
          signIndex: 25
        }
      ],
      informationDialogShow: false,
      curSelectedType: 'add',
      filedialogVisible: false,
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      menu_code: ''
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
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
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null
      this.customSettingShowList = null
      this.customSettingShowList = newestTableHeaderList
      this.canRendererTableHeader = newestTableHeaderList
        .filter(item => item.isSelected)
        .map((sing, index) => {
          let obj = {
            id: index + 1,
            label: sing.label,
            prop: sing.prop,
            width: sing.width,
            align: sing.align,
            signIndex: index,
            sortable: sing.sortable
          }
          return obj
        })
      this.$forceUpdate()
    },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      params.menu_code = this.menu_code
      this.$client.ListInspectManage({ context: params }).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context.list
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
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
    // 新增
    openAddPage(type) {
      this.curSelectedType = 'add'
      this.informationDialogShow = true
    },
    editRowInfo(row, type, bool) {
      this.curSelectedType = type
      if (type == 'copy') {
        this.curSelectedType = 'add'
      }
      this.informationDialogShow = true
      this.$nextTick(() => {
        this.$refs.informationDialog.setData(row, type, bool)
      })
    },
    // 编辑、添加
    saveAddEdit(info) {
      if (this.curSelectedType == 'add') {
        this.$client
          .AddInspectManageService({ context: info })
          .then(res => {
            if (res.head.result == '200') {
              this.informationDialogShow = false
              this.loadData()
              this.$message({ showClose: true, message: successMessage, type: 'success' })
            } else {
              this.$message({ showClose: true, message: res.head.describle, type: 'error' })
            }
          })
          .catch(err => {})
      } else {
        this.$client
          .EditInspectManageService({ context: info })
          .then(res => {
            if (res.head.result == '200') {
              this.informationDialogShow = false
              this.loadData()
              this.$message({ showClose: true, message: successMessage, type: 'success' })
            } else {
              this.$message({ showClose: true, message: res.head.describle, type: 'error' })
            }
          })
          .catch(err => {})
      }
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: info.id
      }
      this.$client
        .DeleteInspectManageService(params)
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
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    checkDetail(row) {
      let detail_id = 5280,
        title = '待办消息:稽查管理'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true
    },
    // 打开导入弹窗
    openImportPage() {
      this.filedialogVisible = true
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData()
      formData.append('order_affiliation', exportInfo.order_affiliation)
      formData.append('file', exportInfo.file)
      formData.append('type', exportInfo.radio)

      let params = formData
      this.$client.ImportInspectManage(params).then(res => {
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
    // 导出
    exportFile() {
      let params = Object.assign({}, this.form)
      this.$client.ExportInspectManage({ context: params }).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
          this.$refs.trTable.toggleSelection([])
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    outColor(state) {
      switch (state) {
        case 1:
          return '#0000BF'
        case 2:
          return '#95F204'
        case 3:
          return '#95F204'
        case 4:
          return '#999'
        case 5:
          return '#000'
        case 6:
          return '#F59A23'
        case 7:
          return '#95F204'
        case 8:
          return '#D9001B'
      }
    },
    // 计算表格高度
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
        this.customSettingShowList = this.customSettingList
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH - 5
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.inspection-management {
  height: 100%;
  width: 100%;
}
</style>
