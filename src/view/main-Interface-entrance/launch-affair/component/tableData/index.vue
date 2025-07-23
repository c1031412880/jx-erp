<template>
  <div class="tableData">
    <sub-req
      ref="head"
      :isMark="loadKey === 'GetMyMarkFlowRecord'"
      :isGroupBtn="loadKey === 'GetCopyFlowRecord'"
      :isUser="loadKey !== 'getStartCollectFormManager'"
      :isState="isState"
      :isShow="loadKey === 'getSubmitFlowRecord'"
      @on-check="checkHandle"
      @on-read="readAllCopyHandle"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="
        loadKey == 'GetCopyFlowRecord'
          ? customSettingListCopy
          : loadKey == 'GetMyMarkFlowRecord'
          ? customSettingListMark
          : customSettingList
      "
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="operation">
        <!--        <el-button v-if="loadKey === 'getWaitFlowRecord'" type="primary" plain size="mini" @click="examineDialogShow(scope.data)">审核</el-button>-->
        <!--        <el-button v-else type="primary" plain size="mini" @click="detailsDialogShow(scope.data)">查看</el-button>-->
        <el-button type="text" @click="detailsPush(scope.data)">查看</el-button>
        <el-button
          type="text"
          v-if="loadKey == 'GetMyMarkFlowRecord'"
          @click="editMarkStateForm(scope.data)"
        >
          编辑
        </el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data.id, 'remove')"
          title="确定移除此条记录吗？"
          v-if="
            (loadKey != 'GetMyMarkFlowRecord' &&
              loadKey != 'getListFlowRecord' &&
              scope.data.state != 1) ||
            loadKey == 'GetCopyFlowRecord'
          "
        >
          <el-button slot="reference" type="text" style="margin-left: 10px">移除</el-button>
        </el-popconfirm>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data.id, 'delete')"
          title="是否确定删除此审批单相关数据,且不可恢复？"
          v-if="loadKey == 'getSubmitFlowRecord' && scope.data.state == 4 && scope.data.state == 3"
        >
          <el-button slot="reference" type="text" style="margin-left: 10px">删除</el-button>
        </el-popconfirm>
      </template>
      <template slot-scope="scope" slot="title">
        <span>{{ scope.data.title }}</span>
        <span style="color: red">{{ scope.data.replace_name ? scope.data.replace_name : '' }}</span>
      </template>
      <template slot-scope="scope" slot="plan_state">
        <span>
          {{
            scope.data.plan_state == 0
              ? '未提交审核'
              : scope.data.plan_state == 1
              ? '待审核'
              : scope.data.plan_state == 2
              ? '审批中'
              : scope.data.plan_state == 3
              ? '审批通过'
              : '退回'
          }}
        </span>
      </template>
      <template slot-scope="scope" slot="state_child_name">
        <span :style="scope.data.state | outStateColor">
          {{ scope.data.state === 1 ? scope.data.state_child_name : scope.data.state_name }}
        </span>
      </template>
      <template slot-scope="scope" slot="content">
        <span>{{ scope.data.content }}</span>
      </template>
      <template slot-scope="scope" slot="flow_state">
        <span :style="scope.data.flow_code | outCodeColor">
          {{ scope.data.flow_state }}
        </span>
      </template>
      <template slot-scope="scope" slot="mark_state">
        <span :style="scope.data.mark_state | outMarkColor">
          {{
            scope.data.mark_state == 1 ? '未处理' : scope.data.mark_state == 2 ? '进行中' : '已完成'
          }}
        </span>
      </template>
      <template slot-scope="scope" slot="read">
        <div :style="{ color: scope.data.read == 0 ? '#E6A23C' : '#67C23A' }">
          <i class="el-icon-message"></i>
          <span>
            {{ scope.data.read == 0 ? '未读' : '已读' }}
          </span>
        </div>
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
    <examine-dialog
      :dialogBool.sync="examineDialog"
      :isMy="loadKey === 'getStartCollectFormManager'"
      :formSubObj="formSubObj"
      :isShow="isShow"
      ref="examineDialog"
      @on-return="examineDialogReturn"
      @on-ok="examineDialogOk"
    ></examine-dialog>
    <edit-mark
      :markForm="markInfo"
      :markState="markState"
      :markTitle="markTitle"
      :dialogBool.sync="isShowMarkDialog"
      @on-edit="saveMarkForm"
      @on-del="delMarkForm"
      @on-save="saveMarkForm"
    ></edit-mark>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './sub-req'
import examineDialog from './examine-dialog'
import divBox from './div-box'
import editMark from './edit-mark'
import { getUser } from '@/utils/auth'
import modelObj from "@/view/main-Interface-entrance/news-core/modelObj";
export default {
  name: "tableData",
  components: {subReq, examineDialog, divBox, editMark},
  props: {
    loadKey: {
      type: String,
      default: 'getPendCollectFormManager'
    },
    isState: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    outCodeColor(code) {
      let color = '#909399'
      if (code === '1') {
        color = '#E6A23C'
      }
      if (code === '2') {
        color = '#E6A23C'
      }
      if (code === '3') {
        color = '#67C23A'
      }
      if (code === '4') {
        color = '#F56C6C'
      }
      if (code === '7') {
        color = '#909399'
      }
      return `color: ${color}`
    },
    outMarkColor(code) {
      let color = '#909399'
      if (code === 1) {
        color = '#F2260E'
      }
      if (code === 2) {
        color = '#ff9900'
      }
      if (code === 3) {
        color = '#0CB780'
      }
      return `color: ${color}`
    },
    outStateColor(code) {
      let color
      switch (code) {
        case 1:
          color = '#E6A23C'
          break;
        case 2:
          color = '#67C23A'
          break;
        case 3:
          color = '#F56C6C'
          break;
        case 4:
          color = '#909399'
          break;
        default:
          color = '#909399'
          break;
      }
      return `color: ${color}`
    },
  },
  data() {
    return {
      markTitle: '添加标记',
      markInfo: {},
      markState: 0,
      isShowMarkDialog: false,
      flow_id: 0,

      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      customSettingList: [
        {
          id: 1,
          label: "标题",
          prop: "title",
          width: "350",
          align: "left",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "内容摘要",
          prop: "content",
          width: "360",
          align: "left",
          signIndex: 1,
          sortable: false,
          notTooltip: false
        },
        {
          id: 3,
          label: "发起人",
          prop: "created_name",
          width: "100",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "发起时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "完成时间",
          prop: "finish_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "流程状态",
          prop: "state_child_name",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "100",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
      customSettingListCopy: [
        {
          id: 1,
          label: "标题",
          prop: "title",
          width: "350",
          align: "left",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "内容摘要",
          prop: "content",
          width: "360",
          align: "left",
          signIndex: 1,
          sortable: false,
          notTooltip: true
        },
        {
          id: 3,
          label: "已读状态",
          prop: "read",
          width: "100",
          align: "center",
          signIndex: 2,
          sortable: false,
          notTooltip: true
        },
        {
          id: 4,
          label: "发起人",
          prop: "created_name",
          width: "100",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "发起时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "完成时间",
          prop: "finish_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        // {
        //   id: 7,
        //   label: "流程状态",
        //   prop: "state_child_name",
        //   width: "160",
        //   align: "center",
        //   signIndex: 6,
        //   sortable: false,
        // },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
      customSettingListMark: [
        {
          id: 1,
          label: "标记状态",
          prop: "mark_state",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "标记备注",
          prop: "mark_remark",
          width: "220",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "标记时间",
          prop: "mark_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "标题",
          prop: "title",
          width: "350",
          align: "left",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "内容摘要",
          prop: "content",
          width: "360",
          align: "left",
          signIndex: 4,
          sortable: false,
          notTooltip: true
        },
        {
          id: 6,
          label: "发起人",
          prop: "created_name",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "发起时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "完成时间",
          prop: "finish_date",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "流程状态",
          prop: "state_child_name",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      data: [],
      allData: [], //总抄送
      unreadData: [], //未读抄送
      loading: false,
      TableHeight: 500,
      examineDialog: false,
      formSubObj: {},
      isShow: false,
      // modelObj: {
      //   10: '会议室预定',
      //   20: '公车借记',
      //   21: '还车申请',
      //   30: '发文流程',
      //   40: '收文流程',
      //   50: '会员流程',
      //   60: '事故流程',
      //   70: '投诉处理流程',
      //   80: '稽查处理',
      //   90: '党组织活动',
      //   100: '驾驶员入职申请',
      //   110: '车辆报废申请',
      //   1000: '请假单',
      //   1010: '加班单',
      //   1020: '采购单',
      //   1030: '领用单',
      //   1040: '采购订单',
      //   1060: '出差单',
      //   1070: '工作处理单',
      //   1080: '用印申请单',
      //   1090: '项目业务审批单',
      //   1100: '报销单',
      //   1110: '工会议案',
      //   1120: '议案审批单',
      //   1130: '业务招待申请',
      //   1140: '合同审批',
      //   1150: '档案借阅',
      //   1160: '新闻信息',
      //   1170: '企业证照借用',
      //   1180: '人事档案借阅',
      //   1190: '公事外出单',
      //   1200: '工会工作处理单',
      //   1210: '费用支出',
      //   1220: '公车加油申请',
      //   1230: '公车维修申请',
      //   1240: '预支款申请',
      //   1250: '预算内资金事前申请',
      //   1260: '公车保养申请',
      //   1270: '资产报修单',
      //   1280: '资产采购申请',
      //   1290: '资产报废单',
      //   1300: '资产领用单',
      //   1310: '资产归还单',
      //   1320: '转正申请',
      //   1330: '续聘申请单',
      //   1340: '公车预约',
      //   1350: '离职退休申请',
      //   1360: '工会报销单',
      //   1370: '工会合同审批',
      //   1380: '工会会议纪要',
      //   1390: '工会领款单',
      //   1400: '工会困难职工申请单',
      //   1410: '公司档案材料移交清单',
      //   1420: '合同审批（履约信息版）',
      //   1430: '实操培训反馈表',
      //   1440: '公章注销或制作审批单',
      //   1450: '物资入库单',
      //   1460: '物资出库单',
      //   1470: '驾驶员离职退休申请',
      //   1480: '差旅报销单',
      //   1490: '乘客服务工单',
      //   1500:'包车审批单',
      // },
      // 删除或清楚撤回的接口
      delApi: {
        'remove': 'FlowRemoveFlowRecord',
        'delete': 'FlowDeleteFlowRecord',
      }
    }
  },
  mounted() {
    this.setHead()
    this.loadData()
    eventOn.$on('update-upcoming-matter', () => {
      this.loadData()
    })
  },
  methods: {
    // 详情跳转
    detailsPush(item) {
      // return
      let title = `待办事项:${modelObj[item.object_id]}`
      if (!modelObj[item.object_id]) {
        this.$message.warning('未能处理该事项');
        return false
      }
      if(this.loadKey=="GetCopyFlowRecord" && item.read == 0) {
        this.changeMessageReadState(item.message_id)
      }
      // this.$router.push({
      //   path: `/news-details/${item.detail_id}/${title}/${item.object_id}`
      // })
      let detail_id = ''
      switch (item.object_id) {
        case 110:
          detail_id = item.detail_ids + '^&'
          break;

        default:
          detail_id = item.detail_id
          break;
      }
      this.$router.push({
        path: `/news-details/${detail_id}/${title}/${item.object_id}`
      })
    },
    // 提交查询
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 审核初始化
    examineDialogShow(info) {
      this.formSubObj = info
      this.examineDialog = true
      this.isShow = true
    },
    // 信息初始化
    detailsDialogShow(info) {
      this.formSubObj = info
      this.examineDialog = true
      this.isShow = false
    },
    // 提交审核
    examineDialogOk(form) {
      this.examineDialog = false
      this.$client.checkFlowRecord({context: form}).then(req => {
        this.loadData()
        if (req.head.result == "200") {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      })
      .catch((err) => {
        this.$message({showClose: true, message: err.body.message, type: "error",
        });
      });
    },
    // 回退操作
    examineDialogReturn(form) {
      this.examineDialog = false
      this.$client.transferRecord(form).then(req => {
        this.loadData()
        if (req.head.result == "200") {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      })
        .catch((err) => {
          this.$message({showClose: true, message: err.body.message, type: "error",
          });
        });
    },
    // 获取事务列表
    loadData() {
      this.loading = true
      // this.form.page_index = this.pageInfo.pageIndex
      this.form.page_index = this.loadKey == "GetCopyFlowRecord" ? 1 : this.pageInfo.pageIndex
      this.form.page_size = this.loadKey == "GetCopyFlowRecord" ? 10000 : this.pageInfo.pageSize
      console.log("this.form",this.form)
      this.$client[this.loadKey](this.form).then((res) => {
        console.log("res",res)
        this.loading = false;
        if (res.head.result == "200") {
          this.data = JSON.parse(JSON.stringify(res.context.list));
          console.log("data在这里!!!",this.data)
          this.pageInfo.pageCount = res.context.total
          // if(this.loadKey == "getWaitFlowRecord") {
          //   this.$emit('out-num', res.context.total)
          // }else
          if(this.loadKey == "GetCopyFlowRecord") {
            let unread = this.data.filter(item => item.read == 0)
            // this.$emit('out-unread', unread.length)
            this.allData = JSON.parse(JSON.stringify(res.context.list));
            let info = this.allData.filter(item => {
              return item['read'] == 0
            })
            this.unreadData =  JSON.parse(JSON.stringify(info))
            if(this.$refs.head.checked) {
              this.data =  JSON.parse(JSON.stringify(this.unreadData)).slice(0, this.pageInfo.pageSize)
            }else {
              this.data = JSON.parse(JSON.stringify(res.context.list)).slice(0, this.pageInfo.pageSize)
            }
          }
        } else {
          this.pageInfo.pageCount = 0
          this.data = []
          this.$message({showClose: true, message: res.head.describle, type: "error",});
        }
      }).catch((err) => {
        this.data = []
        this.pageInfo.pageCount = 0
        this.loading = false;
        this.$message({showClose: true, message: err.body.message, type: "error",});
      });
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      if(this.loadKey == "GetCopyFlowRecord") {
        let info = this.pageInfo.pageCount == this.allData.length ? this.allData.slice((idx - 1) * this.pageInfo.pageSize, idx * this.pageInfo.pageSize) : this.unreadData.slice((idx - 1) * this.pageInfo.pageSize, idx * this.pageInfo.pageSize)
        this.data = info
      }else {
        this.loadData();
      }
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      if(this.loadKey == "GetCopyFlowRecord") {
        let info = this.pageInfo.pageCount == this.allData.length ? this.allData.slice(0, sizes) : this.unreadData.slice(0, sizes)
        this.data = info
      }else {
        this.pageInfo.pageCount = 0;
        this.loadData();
      }
    },
    // 显示未读已读
    checkHandle(num) {
      this.pageInfo.pageIndex = 1
      this.data = num == 1 ? this.allData.slice(0, this.pageInfo.pageSize) : this.unreadData.slice(0, this.pageInfo.pageSize)
      this.pageInfo.pageCount = num == 1 ? this.allData.length : this.unreadData.length
    },
    // 抄送已读
    changeMessageReadState(id) {
      let params = {
        context: id
      }
      this.$client.ReadCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.loadData()
        }
      })
    },
    // 编辑标记
    editMarkStateForm(val) {
      this.flow_id = val.id
      this.markState = val.mark_state
      this.markInfo = {
        remark: val.mark_remark,
        state: val.mark_state
      }
      this.markTitle = '编辑标记'
      this.isShowMarkDialog = true
    },
    // 抄送全部已读
    readAllCopyHandle() {
      this.$client.ReadAllCopyFlowRecord({}).then(req => {
        this.loadData()
        if (req.head.result == "200") {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
          this.loadData()
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      }).catch((err) => {
          this.$message({showClose: true, message: err.body.message, type: "error",});
        });
    },
    // 保存标记
    saveMarkForm(val) {
      if(!val.state || !val.remark) {
        this.$message.warning('请填写标记状态及备注')
        return
      }
      let params = {
        context: {
          flow_id: this.flow_id,
          user_id:  Number(JSON.parse(getUser()).user_id)
        }
      }
      params.context = Object.assign({}, params.context, val)
      this.$client.AddFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 取消标记
    delMarkForm() {
      let params = {
        context: this.flow_id,
      }
      this.$client.DelFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 移除、删除
    deleteRowInfo(id, type) {
      this.$client[this.delApi[type]]({context: id}).then(res => {
        if(res.head.result == "200") {
          this.loadData()
          this.$message.success(type === 'remove' ? '移除成功' : '删除成功')
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 5;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tableData{
  width 100%
  height 100%
}
</style>
