<template>
  <el-dialog
    :visible="dialogBool"
    title="历史工单"
    :before-close="dialogClose"
    width="1030px"
    fullscreen
    append-to-body
  >
    <div class="server-management">
      <sub-req ref="head" @on-ok="onSubmit"></sub-req>
      <span style="white-space: nowrap">已选项目：</span>
      <div v-if="selectedProjectList.length" style="display: inline-block">
        <el-tag
          v-for="(item, index) in selectedProjectList"
          :key="index"
          :disable-transitions="false"
          closable
          @click="editRowInfo(item, 'detail')"
          @close="deleteProject(index)"
        >
          {{ item.order_code }}
        </el-tag>
      </div>
      <tr-table
        ref="trTable"
        :selectionShow="false"
        :data="data"
        :tableHeaderList="customSettingList"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-row="selectedUpkeepPlanList"
      >
        <template slot-scope="scope" slot="order_state_name">
          <span :style="{ color: setStateColor(scope.data.order_state) }">
            {{ scope.data.order_state_name }}
          </span>
        </template>
        <template slot-scope="scope" slot="over_due">
          <span :style="{ color: scope.data.over_due == '已逾期' ? '#d9001b' : '#95f204' }">
            {{ scope.data.over_due }}
          </span>
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
        :curSelectedType="curSelectedType"
        :curSelectedState="curSelectedState"
        :title="informationDialogTitle"
        :dialogLoading="detailDialogLoading"
      ></information-dialog>
    </div>
    <span class="show-flex-box-r show-flex-center" style="margin-top: 10px">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import subReq from './sub-req'
import informationDialog from '../detail-dialog'
export default {
  name: 'passenger-server-management',
  components: {
    subReq,
    informationDialog
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    dutyType: [String, Number]
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
      detailDialogLoading: false,
      TableHeight: 500,
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
          label: '反映人姓名',
          prop: 'call_name',
          width: '130',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '反映人电话',
          prop: 'call_number',
          width: '130',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '身份证号',
          prop: 'id_card',
          width: '130',
          align: 'center',
          signIndex: 8
        },
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
          prop: 'order_code',
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
          prop: 'handle_name',
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
          label: '实际回复时间',
          prop: 'actual_time',
          width: '180',
          align: 'center',
          signIndex: 32
        },
        {
          id: 34,
          label: '经办人',
          prop: 'actual_time',
          width: '180',
          align: 'center',
          signIndex: 33
        },
        {
          id: 35,
          label: '回复内容',
          prop: 'order_reply',
          width: '180',
          align: 'center',
          signIndex: 34
        },
        {
          id: 36,
          label: '超时状态',
          prop: 'over_due',
          width: '130',
          align: 'center',
          signIndex: 35
        }
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      selectedProjectList: [],
      informationDialogShow: false,
      curSelectedType: 'add',
      curSelectedState: 0,
      informationDialogTitle: '添加工单信息'
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.$nextTick(() => {
          this.$refs.head.form.call_phone = this.form.call_phone
          this.$refs.head.onSubmit()
          this.setHead()
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:dialogBool', false)
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
    // 列表勾选
    selectedUpkeepPlanList(row, column, event) {
      console.log('====', row)
      if (this.selectedProjectList.some(x => x.id == row.id)) return
      this.selectedProjectList.push(row)
    },
    deleteProject(index) {
      this.selectedProjectList.splice(index, 1)
    },
    // 查看
    editRowInfo(data, type = 'detail') {
      this.curSelectedState = data.order_state
      this.curSelectedType = type
      this.informationDialogTitle = `工单信息详情(${data.order_code})`
      this.informationDialogShow = true
      if (Object.prototype.hasOwnProperty.call(data, 'order_state_name')) {
        this.$nextTick(() => {
          this.$refs.informationDialog.setData(data, type)
        })
      } else {
        this.detailDialogLoading = true
        this.$client
          .PassengerServiceNewList({
            content: data.order_code
          })
          .then(res => {
            this.detailDialogLoading = false
            if (
              res.head.result == '200' &&
              res.context &&
              res.context.list &&
              res.context.list.length
            ) {
              this.$nextTick(() => {
                this.$refs.informationDialog.setData(res.context.list[0], type)
              })
            } else {
              this.$message({
                showClose: true,
                message: '加载工单信息失败',
                type: 'error'
              })
            }
          })
          .catch(err => {
            this.detailDialogLoading = false
            console.log(err)
            this.$message({
              showClose: true,
              message: '加载工单信息失败',
              type: 'error'
            })
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
    // 保存
    updatePlaybill() {
      this.$emit('save-add', this.selectedProjectList)
      this.dialogClose()
    },
    // 状态颜色
    setStateColor(type) {
      let color = ''
      if (type == 1) {
        color = '#999'
      } else if (type == 2) {
        color = '#d9001b'
      } else if (type == 3) {
        color = '#0000bf'
      } else if (type == 4) {
        color = '#95f204'
      }
      return color
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH - 130
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.server-management {
  width: 100%;
  height: 100%;

  .el-tag{
    cursor: pointer;
    margin: 0 0 5px 5px;
  }
}
</style>
