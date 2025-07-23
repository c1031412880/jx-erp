<template>
  <div class="star-rating">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="onAddRowData"
      @on-rebuild="onRebuildRecord"
      @on-export="onExportExcel"
    ></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :indexShow="true"
      :backFixedNum="1"
      :frontFixedNum="0"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :tableHeaderList="customSettingList"
      @on-select-change-row="selectedChangeRowData"
    >
      <template slot-scope="scope" slot="state_name">
        <span :style="{ color: getStateColor(scope.data.state) }">{{ scope.data.state_name }}</span>
      </template>
      <template slot-scope="scope" slot="is_month_rating">
        <span>{{ scope.data.is_month_rating ? '是' : '否' }}</span>
      </template>
      <template slot-scope="scope" slot="special">
        <span>
          {{
            scope.data.special == 1 ? '特殊线路驾驶员' : scope.data.special == 2 ? '特殊驾驶员' : ''
          }}
        </span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          @click="openApplyDetail(scope.data)"
          v-if="scope.data.state"
          type="text"
          size="mini"
        >
          查看
        </el-button>
        <el-button
          @click="changeDriverStar(scope.data)"
          type="text"
          size="mini"
          v-if="$isPowerShow('edit') && !scope.data.state"
        >
          更改星级
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
    <set-info-dialog
      ref="setInfoDialog"
      @save-add="saveAddRowData"
      :dialogBool.sync="isShowSetInfoDialog"
    ></set-info-dialog>

    <change-star-dialog
      ref="changeStarDialog"
      @save-change="saveChangeDriverStar"
      :dialogBool.sync="isShowChangeStarDialog"
    ></change-star-dialog>
  </div>
</template>

<script>
import subReq from './component/sub-req'
import setInfoDialog from './component/set-info-dialog'
import changeStarDialog from './component/change-star-dialog'
export default {
  name: 'star-rating',
  components: {
    subReq,
    setInfoDialog,
    changeStarDialog
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
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
      selectRowsData: [],
      isShowSetInfoDialog: false,
      isShowChangeStarDialog: false,
      customSettingList: [
        {
          id: 1,
          label: '考核月份',
          prop: 'judge_cycle',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '驾驶员',
          prop: 'driver_name',
          width: '120',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '所属组织',
          prop: 'dept_name',
          width: '130',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '上次星级',
          prop: 'last_star_name',
          width: '120',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '持续月份',
          prop: 'quarter_count',
          width: '120',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '本次评定星级',
          prop: 'now_star_name',
          width: '120',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '变化情况',
          prop: 'change',
          width: '120',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '是否参加当月星级评定',
          prop: 'is_month_rating',
          width: '180',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '考评总分',
          prop: 'check_socre',
          width: '120',
          align: 'center',
          signIndex: 8
        },
        {
          id: 10,
          label: '上线天数',
          prop: 'online_days',
          width: '120',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '实际出勤天数',
          prop: 'attendence_days',
          width: '130',
          align: 'center',
          signIndex: 10
        },
        {
          id: 12,
          label: '奖励金额发放星级',
          prop: 'reward_star_rating',
          width: '140',
          align: 'center',
          signIndex: 11
        },
        {
          id: 13,
          label: '星级奖励标准（元）',
          prop: 'reward_star_standard',
          width: '150',
          align: 'center',
          signIndex: 12
        },
        {
          id: 14,
          label: '星级实际奖励（元）',
          prop: 'reward_star_money',
          width: '150',
          align: 'center',
          signIndex: 13
        },
        {
          id: 15,
          label: '备注',
          prop: 'remark',
          width: '160',
          align: 'center',
          signIndex: 14
        },
        {
          id: 16,
          label: '是否取消本期星级评定',
          prop: 'is_cancle_name',
          width: '180',
          align: 'center',
          signIndex: 15
        },
        {
          id: 17,
          label: '特殊情况',
          prop: 'special',
          width: '130',
          align: 'center',
          signIndex: 16
        },
        {
          id: 18,
          label: '法定假/病假/事假',
          prop: 'ask_leave',
          width: '130',
          align: 'center',
          signIndex: 17
        },
        {
          id: 19,
          label: '流程状态',
          prop: 'state_name',
          width: '130',
          align: 'center',
          signIndex: 18
        },
        {
          id: 20,
          label: '发起人',
          prop: 'flow_create_name',
          width: '130',
          align: 'center',
          signIndex: 19
        },
        {
          id: 21,
          label: '流程发起时间',
          prop: 'flow_created_date',
          width: '180',
          align: 'center',
          signIndex: 20
        },
        {
          id: 22,
          label: '流程完成时间',
          prop: 'flow_finished_date',
          width: '180',
          align: 'center',
          signIndex: 21
        },
        {
          id: 23,
          label: '操作',
          prop: 'operation',
          width: '180',
          align: 'center',
          signIndex: 22
        }
      ]
    }
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = 10
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetByPageDriverStar({ context: params }).then(res => {
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
    // 多选选择
    selectedChangeRowData(rows) {
      this.selectRowsData = !!rows ? rows.filter(item => !item.state) : []
    },
    // 批量生成
    onAddRowData() {
      if (!this.selectRowsData.length) {
        this.$message({
          showClose: true,
          message: '请选择未发起审批数据生成',
          type: 'warning'
        })
        return false
      }
      this.isShowSetInfoDialog = true
      this.$refs.setInfoDialog.setDate(this.selectRowsData)
    },
    // 提交批量生成
    saveAddRowData(node) {
      let params = { context: {} }
      params.context.ids = this.selectRowsData.map(item => item.id)
      params.context.step_data = node
      this.$client
        .SetRecordDriverStar(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.isShowSetInfoDialog = false
            this.$message({
              showClose: true,
              message: res.head.describle,
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
        .catch(err => {})
    },
    // 变更星级
    changeDriverStar(row) {
      this.isShowChangeStarDialog = true
      this.$refs.changeStarDialog.form.id = row.id
      this.$refs.changeStarDialog.form.driver_name = row.driver_name
      this.$refs.changeStarDialog.form.star = row.now_star
    },
    // 保存星级变更
    saveChangeDriverStar(info) {
      let params = { context: {} }
      params.context = Object.assign({}, info)
      this.$client
        .UpdateDriverStarJudge(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.isShowChangeStarDialog = false
            this.$message({
              showClose: true,
              message: res.head.describle,
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
        .catch(err => {})
    },
    // 重新生成
    onRebuildRecord() {
      let params = { context: {} }
      params.context.year = this.form.year
      params.context.quarter = this.form.quarter
      this.$client
        .CountDriverStar(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
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
        .catch(err => {})
    },
    // 导出Excel 文件
    onExportExcel() {
      let params = { context: {} }
      params.context = Object.assign({}, this.form)
      this.$client.ExportDriverStar(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    // 查看详情
    openApplyDetail(row) {
      let title = '驾驶员星级考核审批'
      let object_id = 5270
      this.$router.push({
        path: `/news-details/${row.flow_id}/${title}/${object_id}`
      })
    },
    getStateColor(state) {
      switch (state) {
        case 1: //审批中
          return '#E6A23C'
        case 2: //审批完成
          return '#67C23A'
        case 3: //审批拒绝
          return '#d9001b'
        case 4: //审批撤回
          return '#909399'
        default:
          return '#909399'
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
    // 计算表格高度
    setHead() {
      let maxh = this.$el.offsetHeight
      let th = this.$refs.head.$el.offsetHeight
      let paginationH = this.$refs.paginationH.$el.offsetHeight
      this.TableHeight = maxh - th - paginationH
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.star-rating {
  height: 100%;
  width: 100%;
}
</style>
