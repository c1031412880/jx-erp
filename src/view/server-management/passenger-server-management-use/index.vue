<template>
  <div class="passenger-server-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-detail="onDetail"
      @on-export="exportFile"
      @on-delete="deleteSelectedRow"
      @on-add="openInformationDialog"
      @on-setting-timeout="openSettingDialog"
      @on-setting-duty="openSettingDialog"
      @on-setting-reminder="openSettingDialog"
      @on-setting-reply-template="openSettingDialog"
      @on-admin-edit="openAdminEditDialog"
    ></sub-req>
    <tr-table
      ref="trTable"
      :data="data"
      :loading="loading"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader"
      @row-click="onRowClick"
      @sort-table-change="sortTableChange"
      @on-select-change-row="selectedRowList">
      <!-- 工单状态：1-草稿 2-已下发 3-已受理 4-已办结 5-已退回 6-审批中 7-审批完成 
      8-部门待受理 9-部门待受理_车队退回 10-车队待受理 11-车队核实中 12-车队核实中_部门退回 13-部门核实中
      14-部门核实中_部门领导退回 15-待部门领导审核 16-待部门领导审核_分管领导退回 17-待分管领导审核 -->
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
          v-if="$isPowerShow('copy')"
          @click.stop="editRowInfo(scope.data, 'copy')">
          复制工单
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="$isPowerShow('edit') && (scope.data.order_affiliation == 2 || [1,5].includes(scope.data.order_state)) && !scope.data.is_start_flow"
          @click.stop="editRowInfo(scope.data, 'edit')">
          编辑
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="[8,9,10].includes(scope.data.order_state) && scope.data.person_ids && scope.data.person_ids.includes(user_id)"
          @click.stop="editRowInfo(scope.data, 'handle')">
          处理
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="[11,12,13,14].includes(scope.data.order_state) && scope.data.person_ids && scope.data.person_ids.includes(user_id)"
          @click.stop="editRowInfo(scope.data, 'check')">
          核实
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="([15,16].includes(scope.data.order_state) && scope.data.manager_person_ids && scope.data.manager_person_ids.includes(user_id)) ||
          ([17].includes(scope.data.order_state) && scope.data.supervisor_person_ids && scope.data.supervisor_person_ids.includes(user_id))"
          @click.stop="editRowInfo(scope.data, 'audit')">
          审核
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="$isPowerShow('reply') && scope.data.order_affiliation == 1 && scope.data.is_show_reply"
          @click.stop="editRowInfo(scope.data, 'reply')">
          回复单
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
    <div class="dialog-box">
      <!-- 自定义设置对话框 - 用于配置表格显示列和排序 -->
      <custom-setting
        :dialogBool.sync="customSettingDialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
      <!-- 设置超时级别 -->
      <setting-timeout 
        ref="settingTimeoutDialog" 
        :dialogBool.sync="settingTimeoutShow"
      ></setting-timeout>
      <!-- 设置责任部门经办人 -->
      <setting-duty 
        ref="settingDutyDialog" 
        :dialogBool.sync="settingDutyShow"
      ></setting-duty>
      <!-- 提醒设置 -->
      <setting-reminder 
        ref="settingReminderDialog" 
        :dialogBool.sync="settingReminderShow"
      ></setting-reminder>
      <!-- 回复模板设置 -->
      <setting-reply-template 
        ref="settingReplyTemplateDialog" 
        :dialogVisible.sync="settingReplyTemplateShow"
      ></setting-reply-template>
      <!-- 回复表单 -->
      <reply-form 
        ref="replyFormDialog" 
        :replyFormData="replyFormData"
        :dialogVisible.sync="replyFormShow"
      ></reply-form>
      <!-- 工单信息 -->
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
        :curSelectedType="curSelectedType"
        :btnLoading.sync="btnLoading"
        :title="informationDialogTitle"
        @save-info="saveRowInfo"
      ></information-dialog>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'
import subReq from './component/sub-req'
import replyForm from './component/reply-form'
import settingDuty from './component/setting-duty'
import settingTimeout from './component/setting-timeout'
import settingReminder from './component/setting-reminder'  
import settingReplyTemplate from './component/setting-reply-template'
import informationDialog from './component/information-dialog'
export default {
  name: 'passenger-server-management',
  components: {
    subReq,
    settingTimeout,
    settingDuty,
    settingReminder,
    settingReplyTemplate,
    replyForm,
    informationDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      titlesId: '', //当前表头的id
      menu_code: '',

      form: {},
      data: [],
      loading: false,
      frontFixedNum: 0,
      backFixedNum: 2,
      TableHeight: 0,
      selectedIds: [],
      canRendererTableHeader: [],
      customSettingShowList: [],
      customSettingDialogVisible: false,
      settingTimeoutShow: false,
      settingDutyShow: false,
      settingReminderShow: false,
      settingReplyTemplateShow: false,
      replyFormShow: false,
      replyFormData: {},  
      informationDialogShow: false,
      curSelectedType: 'add',
      btnLoading: false,
      informationDialogTitle: '添加工单信息',
      user_id: Number(JSON.parse(getUser()).user_id),
      adminEditId: '',
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
          width: '100',
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
          width: '160',
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
          label: '车队',
          prop: 'duty_team_name',
          width: '130',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '类别',
          prop: 'category_name',
          width: '130',
          align: 'center',
          signIndex: 8
        },
        {
          id: 10,
          label: '类型',
          prop: 'subtype_name',
          width: '130',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '反映人电话',
          prop: 'call_number',
          width: '130',
          align: 'center',
          signIndex: 10
        },
        {
          id: 12,
          label: '反映人姓名',
          prop: 'call_name',
          width: '130',
          align: 'center',
          signIndex: 11
        },
        {
          id: 13,
          label: '事件简述',
          prop: 'order_content',
          width: '180',
          align: 'center',
          signIndex: 12
        },
        {
          id: 14,
          label: '自行车号',
          prop: 'bicycle_number',
          width: '130',
          align: 'center',
          signIndex: 13
        },
        {
          id: 15,
          label: '车牌号',
          prop: 'lincense_plate_number',
          width: '130',
          align: 'center',
          signIndex: 14
        },
        {
          id: 16,
          label: '线路',
          prop: 'line_name',
          width: '130',
          align: 'center',
          signIndex: 15
        },
        {
          id: 17,
          label: '驾驶员',
          prop: 'driver_name',
          width: '130',
          align: 'center',
          signIndex: 16
        },
        {
          id: 18,
          label: '事发地点',
          prop: 'address',
          width: '130',
          align: 'center',
          signIndex: 17
        },
        {
          id: 19,
          label: '身份证号',
          prop: 'id_card',
          width: '130',
          align: 'center',
          signIndex: 18
        },
        {
          id: 20,
          label: '性别',
          prop: 'sex_name',
          width: '100',
          align: 'center',
          signIndex: 19
        },
        {
          id: 21,
          label: '卡号',
          prop: 'card_no',
          width: '130',
          align: 'center',
          signIndex: 20
        },
        {
          id: 22,
          label: '信访编号',
          prop: 'letter_code',
          width: '130',
          align: 'center',
          signIndex: 21
        },
        {
          id: 23,
          label: '初重件',
          prop: 'weight_degree_name',
          width: '100',
          align: 'center',
          signIndex: 22
        },
        {
          id: 24,
          label: '关联工单',
          prop: 'associ_order',
          width: '130',
          align: 'center',
          signIndex: 23
        },
        {
          id: 25,
          label: '受理人',
          prop: 'acceptance_name',
          width: '100',
          align: 'center',
          signIndex: 24
        },
        {
          id: 26,
          label: '受理时间',
          prop: 'acceptance_time',
          width: '150',
          align: 'center',
          signIndex: 25
        },
        {
          id: 27,
          label: '是否需要回复',
          prop: 'is_reply_name',
          width: '100',
          align: 'center',
          signIndex: 26
        },
        {
          id: 28,
          label: '超时级别',
          prop: 'time_out_time',
          width: '100',
          align: 'center',
          signIndex: 27
        },
        {
          id: 29,
          label: '规定逾期回复时间',
          prop: 'overdue_time',
          width: '160',
          align: 'center',
          signIndex: 28
        },
        {
          id: 30,
          label: '核实情况',
          prop: 'verify_result',
          width: '160',
          align: 'center',
          signIndex: 29
        },
        {
          id: 31,
          label: '核实经办人',
          prop: 'verify_user_name',
          width: '100',
          align: 'center',
          signIndex: 30
        },
        {
          id: 32,
          label: '核实登记时间',
          prop: 'verify_time',
          width: '160',
          align: 'center',
          signIndex: 31
        },
        {
          id: 33,
          label: '是否有责',
          prop: 'is_duty_name',
          width: '100',
          align: 'center',
          signIndex: 32
        },
        {
          id: 34,
          label: '奖罚依据',
          prop: 'violation_according',
          width: '160',
          align: 'center',
          signIndex: 33
        },
        {
          id: 35,
          label: '违规类型',
          prop: 'violation_type',
          width: '100',
          align: 'center',
          signIndex: 34
        },
        {
          id: 36,
          label: '加/减分',
          prop: 'score',
          width: '100',
          align: 'center',
          signIndex: 35
        },
        {
          id: 37,
          label: '是否取消当月考评',
          prop: 'is_disqualified',
          width: '100',
          align: 'center',
          signIndex: 36
        },
        {
          id: 38,
          label: '调查及处理结果',
          prop: 'handle_result',
          width: '130',
          align: 'center',
          signIndex: 37
        },
        {
          id: 39,
          label: '满意度',
          prop: 'satisfaction_degree_name',
          width: '100',
          align: 'center',
          signIndex: 38
        },
        {
          id: 40,
          label: '是否与来电人沟通',
          prop: 'is_contact',
          width: '100',
          align: 'center',
          signIndex: 39
        },
        {
          id: 41,
          label: '处理经办人',
          prop: 'handle_emp_name',
          width: '100',
          align: 'center',
          signIndex: 40
        },
        {
          id: 42,
          label: '处理时间',
          prop: 'handle_time',
          width: '160',
          align: 'center',
          signIndex: 41
        },
        {
          id: 43,
          label: '备注',
          prop: 'remark',
          width: '130',
          align: 'center',
          signIndex: 42
        },
        {
          id: 44,
          label: '部门/分公司负责人审核意见',
          prop: 'manager_opinion',
          width: '160',
          align: 'center',
          signIndex: 43
        },
        {
          id: 45,
          label: '部门/分公司分管领导审核意见',
          prop: 'supervisor_opinion',
          width: '160',
          align: 'center',
          signIndex: 44
        },
        {
          id: 46,
          label: '审批单状态',
          prop: 'state_name',
          width: '130',
          align: 'center',
          signIndex: 45
        },
        {
          id: 47,
          label: '审批单号',
          prop: 'flow_code',
          width: '150',
          align: 'center',
          signIndex: 46
        },
        {
          id: 48,
          label: '超时状态',
          prop: 'over_due',
          width: '100',
          align: 'center',
          signIndex: 47
        },
        {
          id: 49,
          label: '剩余处理天数',
          prop: 'over_day',
          width: '150',
          align: 'center',
          signIndex: 48,
          sortable: 'custom'
        },
        {
          id: 50,
          label: '操作',
          prop: 'operation',
          width: '220',
          align: 'center',
          signIndex: 49
        }
      ],
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
    // 打开设置页面
    openSettingPageEvent() {
      this.customSettingDialogVisible = true
    },
    // 更新表头
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
      this.$httpTableHeader
        .reqTableHeader(this.menu_code, this.customSettingList)
        .then(res => {
          this.titlesId = res.titlesId
          this.canRendererTableHeader = res.canRendererTableHeader
          this.customSettingList = res.customSettingList
          this.customSettingShowList = res.customSettingShowList
          this.$forceUpdate()
        })
    },
    // 表头排序
    sortTableChange(sortFrom) {
      if (sortFrom) {
        if (sortFrom.sort === 'over_day') {
          this.form.over_sort = true
          this.form.ase = sortFrom.ase
        }
      } else {
        this.form.over_sort = false
        delete this.form.ase
      }
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 列表勾选
    selectedRowList(list) {
      this.selectedIds = []
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          if(!item.is_start_flow) {
            this.selectedIds.push(item.id)  
          }
        })
        if(list.length == 1 && !list[0].is_start_flow && list[0].order_affiliation == 1) {
          this.adminEditId = list[0].id
        }else {
          this.adminEditId = ''
        }
      }
    },
    // 提交
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
      this.$client.GetPassengerServiceList(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loading = false
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
            if(this.form.order_state == 2) {
              this.$refs.head.num = res.context.total
            }
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
          console.log('err:',err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 导出
    exportFile() {
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
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
    deleteSelectedRow() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项(自动过滤已发起流程的工单)',
          type: 'warning'
        })
        return
      }
      this.$confirm('确认删除吗(已自动过滤已发起流程的工单), 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
          this.deleteRowInfo(null)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
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
      this.$client.PassengerServiceNewBatchDelete(params)
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
    // 打开设置弹窗
    openSettingDialog(type) {
      switch(type) {
        case 'setting-timeout':
          this.settingTimeoutShow = true
          break
        case 'setting-duty':
          this.settingDutyShow = true
          break
        case 'setting-reminder':
          this.settingReminderShow = true
          break
        case 'setting-reply-template':
          this.settingReplyTemplateShow = true
          break
      }
    },
    openAdminEditDialog() {
      if(this.adminEditId) {
        let data = this.data.find(item => item.id == this.adminEditId)
        this.editRowInfo(data, 'adminEdit')
      }else {
        this.$message({
          showClose: true,
          message: '请勾选单个要编辑的工单(仅支持编辑未发起流程的公交车工单)',
          type: 'warning'
        })
      }
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
        let max = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = max - th - paginationH
      }, 60)
    },
    // 工单状态颜色
    setStateColor(type) {
      // 工单状态：1-草稿 2-已下发 3-已受理 4-已办结 5-已退回 6-审批中 7-审批完成 
      // 8-部门待受理 9-部门待受理_车队退回 10-车队待受理 11-车队核实中 12-车队核实中_部门退回 13-部门核实中
      // 14-部门核实中_部门领导退回 15-待部门领导审核 16-待部门领导审核_分管领导退回 17-待分管领导审核
      let obj = {
        '1': '#999',
        '2': '#f59123',
        '3': '#0000bf',
        '4': '#148918',
        '5': '#d9001b',
        '6': '#13a1a9',
        '7': '#95f204',
        '8': '#f59123',
        '9': '#f59123',
        '10': '#f59123',
        '11': '#0000bf',
        '12': '#0000bf',
        '13': '#0000bf',
        '14': '#0000bf',
        '15': '#13a1a9',
        '16': '#13a1a9',
        '17': '#13a1a9',
      }
      return obj[type]
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
    },
    // 打开添加弹窗
    openInformationDialog(type, num) {
      this.curSelectedType = type
      this.informationDialogTitle = '添加工单信息'
      this.informationDialogShow = true
      this.$nextTick(() => {
        this.$refs.informationDialog.form.order_affiliation = num
      })
    },
    // 行点击事件
    onRowClick(row) {
      if(row.is_start_flow) {
        this.$router.push({
          path: `/news-details/${row.id}/待办消息:乘客服务工单/1490`
        })
      }else {
        this.editRowInfo(row, 'detail')
      }
    },
    // 编辑
    editRowInfo(data, type) {
      this.curSelectedType = type
      switch(type) {
        case 'handle':
          this.informationDialogTitle = `处理工单信息(${data.order_code})`
          break
        case 'detail':
          this.informationDialogTitle = `工单信息详情(${data.order_code})`
          break
        case 'edit' || 'admin-edit':
          this.informationDialogTitle = `编辑工单信息(${data.order_code})`
          break
        case 'copy':
          this.informationDialogTitle = '添加工单信息'
          break
        case 'check':
          this.informationDialogTitle = `核实工单信息(${data.order_code})`
          break
        case 'audit':
          this.informationDialogTitle = `审核工单信息(${data.order_code})`
          break
      }
      if(type === 'reply') {
        this.replyFormData = Object.assign({}, data)
        this.replyFormShow = true
      }else {
        this.informationDialogShow = true
        this.$nextTick(() => {
          this.$refs.informationDialog.setData(data, type)
        })
      }
    },
    // 保存
    saveRowInfo(params, type) {
      let httpType = ['add', 'copy'].includes(this.curSelectedType) ? 'AddPassengerService' : 'EditProcessPassengerServiceFlow'
      console.log('保存参数', params, type);
      this.$client[httpType]({ context: params })
        .then(res => {
          this.btnLoading = false
          if (res.head.result == '200') {
            this.informationDialogShow = false
            this.loadData()
            this.$message({ showClose: true, message: res.head.describle, type: 'success' })
          } else {
            this.$message({ showClose: true, message: res.head.describle, type: 'error' })
          }
        }).catch(err => { this.btnLoading = false})
    },
    onDetail(form) {
      let params = Object.assign({}, form)
      params.page_index = 1
      params.page_size = 1
      this.$client
        .GetPassengerServiceList(params)
        .then(res => {
          if (res.head.result == '200') {
            let data = res.context.list
            // 当 数据为一条  且要显示详情弹窗时
            if (data.length == 1) {
              if([8,9,10].includes(data[0].order_state) && data[0].person_ids && data[0].person_ids.includes(this.user_id)) {
                this.editRowInfo(data[0], 'handle')
              }else if([11,12,13,14].includes(data[0].order_state) && data[0].manager_person_ids && data[0].manager_person_ids.includes(this.user_id) && data[0].team_departments.length) {
                this.editRowInfo(data[0], 'check')
              }else if([15,16,17].includes(data[0].order_state) && data[0].supervisor_person_ids && data[0].supervisor_person_ids.includes(this.user_id) && data[0].team_departments.length) {
                this.editRowInfo(data[0], 'audit')
              }else {
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.passenger-server-management {
  width: 100%;
  height: 100%;
}
</style>