<template>
  <div class="server-management">
    <sub-req
      ref="head"
      :isCanDelete="isCanDelete"
      @on-add="openAddPage"
      @on-detail="onDetail"
      @on-ok="onSubmit"
      @on-delete="deleteSelect"
      @on-export="exportFile"
      @on-import="openImportPage"
      @on-export-punish-form="onExportPunishForm"
      @on-setting="onSetting"
      @on-settingDuty="onSettingDuty"
    ></sub-req>
    <tr-table
      ref="trTable"
      class="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading || titleTableLoading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
      @sort-table-change="sortTableChange"
    >
      <template slot-scope="scope" slot="order_state_name">
        <span :style="{ color: setStateColor(scope.data.order_state) }">
          {{ scope.data.order_state_name }}
        </span>
      </template>
      <template slot-scope="scope" slot="state_name">
        <span :style="{ color: outColor(scope.data.state) }">{{ scope.data.state_name }}</span>
      </template>
      <template slot-scope="scope" slot="over_due">
        <span :style="{ color: scope.data.over_due == '已逾期' ? '#f20404' : '#148918' }">
          {{ scope.data.over_due }}
        </span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'copy')"
          v-if="$isPowerShow('copy')"
        >
          复制工单
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit') && !scope.data.is_start_flow"
        >
          编辑
        </el-button>
        <div v-if="scope.data.person_ids" style="display: inline-block">
          <el-button
            type="text"
            size="mini"
            @click="editRowInfo(scope.data, 'handle')"
            v-if="
              scope.data.order_state == 2 &&
              scope.data.person_ids.includes(user_id) &&
              !scope.data.is_start_flow
            "
            style="margin-left: 5px"
          >
            处理
          </el-button>
        </div>
        <div v-if="scope.data.person_ids" style="display: inline-block">
          <el-button
            type="text"
            size="mini"
            @click="editRowInfo(scope.data, 'handle')"
            v-if="
              scope.data.order_state == 3 &&
              scope.data.person_ids.includes(user_id) &&
              !scope.data.is_start_flow
            "
            style="margin-right: 5px"
          >
            办结
          </el-button>
        </div>
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'detail')"
          v-if="!scope.data.is_start_flow"
        >
          查看
        </el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del') && !scope.data.is_start_flow"
        >
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px">
            删除
          </el-button>
        </el-popconfirm>
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'flow_edit')"
          v-if="
            $isPowerShow('edit') && [3, 4].includes(scope.data.state) && scope.data.is_start_flow
          "
        >
          编辑
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="checkDetail(scope.data)"
          v-if="scope.data.is_start_flow"
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
      v-if="informationDialogShow"
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :dialogLoading.sync="dialogLoading"
      :curSelectedType="curSelectedType"
      :curSelectedState="curSelectedState"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <setting-type ref="settingDialog" :dialogBool.sync="settingShow"></setting-type>

    <setting-duty-type
      ref="settingDutyDialog"
      :dialogBool.sync="settingDutyShow"
    ></setting-duty-type>

    <custom-setting
      :dialogBool.sync="customSettingDialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'乘客服务数据导入'"
      @on-submit-excel="onSubmitExcel"
      :isShowImportState="false"
    ></file-dialog>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/index'
import subReq from './component/sub-req'
import informationDialog from './component/information-dialog'
import fileDialog from '@/components/fileDialog/file-dialog'
import settingType from './component/setting-type'
import settingDutyType from './component/setting-duty-type'
import { getUser } from '@/utils/auth'
export default {
  name: 'passenger-server-management',
  components: {
    subReq,
    informationDialog,
    fileDialog,
    settingType,
    settingDutyType
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      data: [],
      loading: false,
      titleTableLoading: false,
      dialogLoading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingDialogVisible: false,
      curSelectedType: 'add',
      curSelectedState: 0,
      informationDialogTitle: '添加工单信息',
      drawerDialogVisible: false,
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
          label: '工单编号',
          prop: 'order_code',
          width: '130',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '工单所属',
          prop: 'order_affiliation_name',
          width: '130',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '信息来源',
          prop: 'message_sources_name',
          width: '130',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '工单类型',
          prop: 'order_type_name',
          width: '130',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '事发时间',
          prop: 'call_time',
          width: '180',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '责任部门',
          prop: 'duty_department_name',
          width: '130',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '反映人姓名',
          prop: 'call_name',
          width: '130',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '反映人电话',
          prop: 'call_number',
          width: '130',
          align: 'center',
          signIndex: 8
        },
        // {
        //   id: 9,
        //   label: "身份证号",
        //   prop: "id_card",
        //   width: "130",
        //   align: "center",
        //   signIndex: 8,
        // },
        {
          id: 10,
          label: '性别',
          prop: 'sex_name',
          width: '130',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '卡号',
          prop: 'card_no',
          width: '130',
          align: 'center',
          signIndex: 10
        },
        {
          id: 12,
          label: '自行车号',
          prop: 'bicycle_number',
          width: '130',
          align: 'center',
          signIndex: 11
        },
        {
          id: 13,
          label: '车牌号',
          prop: 'lincense_plate_number',
          width: '130',
          align: 'center',
          signIndex: 12
        },
        {
          id: 14,
          label: '线路',
          prop: 'line_name',
          width: '130',
          align: 'center',
          signIndex: 13
        },
        {
          id: 15,
          label: '驾驶员',
          prop: 'driver_name',
          width: '130',
          align: 'center',
          signIndex: 14
        },
        {
          id: 16,
          label: '信访编号',
          prop: 'letter_code',
          width: '130',
          align: 'center',
          signIndex: 15
        },
        {
          id: 17,
          label: '初重件',
          prop: 'weight_degree_name',
          width: '130',
          align: 'center',
          signIndex: 16
        },
        {
          id: 18,
          label: '关联工单',
          prop: 'associ_order',
          width: '130',
          align: 'center',
          signIndex: 17
        },
        {
          id: 19,
          label: '事件简述',
          prop: 'order_content',
          width: '180',
          align: 'center',
          signIndex: 18
        },
        {
          id: 20,
          label: '事发地点',
          prop: 'address',
          width: '130',
          align: 'center',
          signIndex: 19
        },
        {
          id: 21,
          label: '受理人',
          prop: 'acceptance_name',
          width: '130',
          align: 'center',
          signIndex: 20
        },
        {
          id: 22,
          label: '受理时间',
          prop: 'acceptance_time',
          width: '150',
          align: 'center',
          signIndex: 21
        },
        {
          id: 23,
          label: '是否需要回复',
          prop: 'is_reply_name',
          width: '130',
          align: 'center',
          signIndex: 22
        },
        {
          id: 24,
          label: '超时级别',
          prop: 'time_out_time',
          width: '130',
          align: 'center',
          signIndex: 23
        },
        {
          id: 25,
          label: '规定逾期回复时间',
          prop: 'overdue_time',
          width: '160',
          align: 'center',
          signIndex: 24
        },
        {
          id: 26,
          label: '是否有责',
          prop: 'is_duty_name',
          width: '130',
          align: 'center',
          signIndex: 25
        },
        {
          id: 27,
          label: '奖罚依据',
          prop: 'violation_according',
          width: '180',
          align: 'center',
          signIndex: 26
        },
        {
          id: 28,
          label: '违规类型',
          prop: 'violation_type',
          width: '180',
          align: 'center',
          signIndex: 27
        },
        {
          id: 29,
          label: '加/减分',
          prop: 'score',
          width: '180',
          align: 'center',
          signIndex: 28
        },
        {
          id: 30,
          label: '处理日期',
          prop: 'handle_time',
          width: '130',
          align: 'center',
          signIndex: 29
        },
        {
          id: 31,
          label: '处理人员',
          prop: 'handle_emp_name',
          width: '130',
          align: 'center',
          signIndex: 30
        },
        {
          id: 32,
          label: '调查及处理结果',
          prop: 'handle_result',
          width: '130',
          align: 'center',
          signIndex: 31
        },
        {
          id: 33,
          label: '备注',
          prop: 'remark',
          width: '130',
          align: 'center',
          signIndex: 32
        },
        {
          id: 34,
          label: '工单回复(办理结果)',
          prop: 'order_reply',
          width: '130',
          align: 'center',
          signIndex: 33
        },
        {
          id: 35,
          label: '回复人',
          prop: 'apply_person_name',
          width: '130',
          align: 'center',
          signIndex: 34
        },
        {
          id: 36,
          label: '实际回复时间',
          prop: 'actual_time',
          width: '130',
          align: 'center',
          signIndex: 35
        },
        // {
        //   id: 30,
        //   label: "实际回复时间",
        //   prop: "actual_time",
        //   width: "180",
        //   align: "center",
        //   signIndex: 29,
        // },
        // {
        //   id: 31,
        //   label: "经办人",
        //   prop: "apply_person_name",
        //   width: "180",
        //   align: "center",
        //   signIndex: 30,
        // },
        {
          id: 37,
          label: '审批单状态',
          prop: 'state_name',
          width: '130',
          align: 'center',
          signIndex: 36
        },
        {
          id: 38,
          label: '审批单号',
          prop: 'flow_code',
          width: '150',
          align: 'center',
          signIndex: 37
        },
        {
          id: 39,
          label: '超时状态',
          prop: 'over_due',
          width: '150',
          align: 'center',
          signIndex: 38
        },
        {
          id: 40,
          label: '剩余处理天数',
          prop: 'over_day',
          width: '150',
          align: 'center',
          signIndex: 39,
          sortable: 'custom'
        },
        {
          id: 41,
          label: '操作',
          prop: 'operation',
          width: '220',
          align: 'center',
          signIndex: 40
        }
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 3, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      selectedIds: [], //勾选可删除的id
      isCanDelete: true,
      titlesId: '', //当前表头的id
      menu_code: '',
      formApi: {
        add: 'AddPassengerService',
        edit: 'EditPassengerService',
        commit: 'DraftPassengerService'
      },
      filedialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/嘉兴乘客服务数据导入.xlsx`
      },
      settingShow: false,
      user_id: Number(JSON.parse(getUser()).user_id),
      settingDutyShow: false
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      eventOn.$on('update-upcoming-matter', () => {
        this.loadData()
      })
    })
  },

  methods: {
    openSettingPageEvent() {
      this.customSettingDialogVisible = true
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
      this.titleTableLoading = true
      this.$httpTableHeader
        .reqTableHeader(this.menu_code, this.customSettingList)
        .then(res => {
          this.titlesId = res.titlesId
          this.canRendererTableHeader = res.canRendererTableHeader
          this.customSettingList = res.customSettingList
          this.customSettingShowList = res.customSettingShowList
          this.$forceUpdate()
          setTimeout(() => {
            this.titleTableLoading = false
          }, 600)
        })
        .catch(err => {
          setTimeout(() => {
            this.titleTableLoading = false
          }, 600)
        })
    },
    // 表头排序
    sortTableChange(sortFrom) {
      console.log(sortFrom)
      if (!!sortFrom) {
        if (sortFrom.sort == 'over_day') {
          this.form.over_sort = true
          this.form = Object.assign(this.form, {
            ase: sortFrom.ase
          })
        }
      } else {
        this.form.over_sort = false
        delete this.form.ase
      }
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
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
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client
        .PassengerServiceNewList(params)
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
    onDetail(form) {
      let params = Object.assign({}, form)
      params.page_index = 1
      params.page_size = 1
      this.$client
        .PassengerServiceNewList(params)
        .then(res => {
          if (res.head.result == '200') {
            let data = res.context.list
            // 当 数据为一条  且要显示详情弹窗时
            if (data.length == 1) {
              if (data[0].order_state == 2 || data[0].order_state == 3) {
                this.editRowInfo(data[0], 'handle')

                // this.$nextTick(() => {
                //   this.$refs.informationDialog.positioning('handle')
                // })
              } else {
                this.editRowInfo(data[0], 'detail')
              }
            }
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
    // 新增
    openAddPage(type) {
      this.curSelectedType = 'add'
      this.informationDialogTitle = '添加工单信息'
      this.informationDialogShow = true
      this.curSelectedState = 0

      this.$nextTick(() => {
        this.$refs.informationDialog.form.order_affiliation = type
      })
    },
    // 编辑、查看
    editRowInfo(data, type) {
      this.curSelectedState = data.order_state
      this.curSelectedType = type
      switch (type) {
        case 'handle':
          this.informationDialogTitle = `处理工单信息(${data.order_code})`
          break
        case 'detail':
          this.informationDialogTitle = `工单信息详情(${data.order_code})`
          break
        // 普通编辑
        case 'edit':
          this.informationDialogTitle = `编辑工单信息(${data.order_code})`
          this.curSelectedType = 'edit'
          break
        // 发起过流程  被拒绝和撤销的 编辑
        case 'flow_edit':
          this.informationDialogTitle = `编辑工单信息(${data.order_code})`
          this.curSelectedState = 0
          this.curSelectedType = 'edit'
          break
        // 复制
        case 'copy':
          this.informationDialogTitle = '添加工单信息'
          this.curSelectedState = 0
          this.curSelectedType = 'add'
          break
        default:
          break
      }
      // this.informationDialogTitle = (type == 'edit') ? this.informationDialogTitle = "编辑工单信息" : this.informationDialogTitle = "工单信息详情";
      this.informationDialogShow = true
      this.$nextTick(() => {
        this.$refs.informationDialog.setData(data, type)
      })
    },
    // 编辑、添加
    saveAddEdit(info, type) {
      let successMessage = ''
      if (this.curSelectedType == 'add') {
        successMessage = '添加成功'
      }
      if (this.curSelectedType == 'edit' && type == 2) {
        successMessage = '保存成功'
      }

      let apiType = ''
      // 6 为草稿
      if (type == 6) {
        successMessage = '保存成功'
        apiType = 'edit'
      } else {
        successMessage = '提交成功'
        // 编辑 且没有 id  为复制   走新增接口
        if (this.curSelectedType == 'add') {
          apiType = 'add'
        } else {
          apiType = 'edit'
        }
      }

      let api = this.formApi[apiType]
      let params = deepCopy(info)
      // console.log(api, params,'============================');
      // return
      this.$client[api]({ context: params })
        .then(res => {
          this.dialogLoading = false
          if (res.head.result == '200') {
            this.informationDialogShow = false
            this.loadData()
            this.$message({ showClose: true, message: successMessage, type: 'success' })
          } else {
            this.$message({ showClose: true, message: res.head.describle, type: 'error' })
          }
        })
        .catch(err => {
          this.dialogLoading = false
        })
    },
    // 列表勾选
    selectedUpkeepPlanList(list) {
      this.selectedIds = []
      this.isCanDelete = true
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedIds.push(item.id)
          this.isCanDelete = false
        })
      }
    },
    // 导出
    exportFile() {
      let params = Object.assign({}, this.form)
      this.$client.PassengerServiceNewExport(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    // 批量删除
    deleteSelect() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: 'warning'
        })
        return
      }
      this.deleteRowInfo(null)
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: []
      }
      if (!!info) {
        params.context[0] = info.id
      } else {
        params.context = this.selectedIds
      }
      this.$client
        .PassengerServiceNewBatchDelete(params)
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
    // 导出处罚审批表
    onExportPunishForm() {
      let params = Object.assign({}, this.form)
      this.$client.PassengerServiceNewExport(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
          this.$refs.trTable.toggleSelection([])
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH
      }, 60)
    },
    // 状态名称
    setStateName(type) {
      let str = ''
      if (type == -1) {
        str = '草稿'
      }
      return str
    },
    // 状态颜色
    setStateColor(type) {
      let color = ''
      if (type == 1) {
        color = '#999'
      } else if (type == 2) {
        color = '#f59123'
      } else if (type == 3) {
        color = '#0000bf'
      } else if (type == 4) {
        color = '#148918'
      } else if (type == 5) {
        color = '#d9001b'
      } else if (type == 6) {
        // color = '#95f204'
        color = '#13a1a9'
      } else if (type == 7) {
        color = '#e6a23c'
      }
      return color
    },
    // 打开导入弹窗
    openImportPage() {
      this.filedialogVisible = true
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData()
      formData.append('file', val.file)
      let params = formData
      this.$client.PassengerServiceNewImport(params).then(res => {
        if (res.head.result == '200') {
          this.form = {}
          this.pageInfo.pageIndex = 1
          this.pageInfo.pageCount = 0
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
    // 设置超时级别
    onSetting() {
      this.settingShow = true
    },
    // 设置责任部门经办人
    onSettingDuty() {
      this.settingDutyShow = true
    },
    checkDetail(row) {
      let detail_id = 1490,
        title = '待办消息:乘客服务工单'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    },
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
        case 1:
          return '#e6a23c'
        case 2:
          return '#0CB712'
        case 3:
          return '#F2260E'
        case 4:
          return '#999999'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.server-management {
  width: 100%;
  height: 100%;
  // .table {
  //   /deep/ .el-table__body tr.current-row>td.el-table__cell, .el-table__body tr.selection-row>td.el-table__cell {
  //     background-color: #9999998c;
  //   }
  // }
}
</style>
