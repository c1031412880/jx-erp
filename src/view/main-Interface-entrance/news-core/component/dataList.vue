<template>
  <div class="dataList">
    <sub-req ref="head" @on-ok="onSubmit"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="type">
        {{scope.data.type === 1 ? '待办消息' : scope.data.type === 2 ? '到期消息' : '系统消息'}}
      </template>
      <template slot-scope="scope" slot="title">
        <p v-html="scope.data.title"></p>
      </template>
      <template slot-scope="scope" slot="state">
        <el-tag size="mini" type="danger" v-if="scope.data.state === 1">未读</el-tag>
        <el-tag size="mini" type="success" v-else>已读</el-tag>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button type="text" @click="lookDetails(scope.data)">查看</el-button>
        <el-popconfirm
          title="确定删除当前记录吗？"
          @confirm="deleteItem(scope.data)">
          <el-button type="text" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    >
    </el-pagination>
    <div>
       <!-- 系统公告弹窗 -->
      <system-announcement
        ref="systemAnnouncement"
        :dialogBool.sync="systemAnnouncementShow"
      ></system-announcement>
      <!-- 工作通知 -->
      <work-notice
        ref="workNotice"
        :dialogBool.sync="workNoticeShow"
      ></work-notice>
      <!-- 公司公告 -->
      <info-dialog
        ref="infoDialog"
        :dialogBool.sync="infoDialogShow"
      ></info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import { getUser, getSession } from '@/utils/auth'
import systemAnnouncement from "@/view/system-user/system-announcement-managemnet/component/system-announcement/system-announcement-popup"
import workNotice from "@/view/system-user/system-announcement-managemnet/component/work-notice/system-announcement-popup"
import infoDialog from "@/view/system-user/system-announcement-managemnet/component/company-announcement/info-dialog"
import modelObj from "../modelObj";
export default {
  name: "dataList",
  components: {subReq,systemAnnouncement,workNotice,infoDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "状态",
          prop: "state",
          width: "60",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "消息标题",
          prop: "title",
          width: "580",
          align: "left",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "消息类型",
          prop: "type",
          width: "80",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "接收时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "100",
          align: "center",
          signIndex:4,
          sortable:false
        },
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      typeObj: {
        1: '待办消息',
        2: '到期消息',
        3: '系统消息'
      },
      // modelObj: {
      //   10: '会议室预定',
      //   20: '公车借记',
      //   21: '还车申请',
      //   30: '发文流程',
      //   40: '收文流程',
      //   42: '车辆年检',
      //   50: '会员流程',
      //   60: '事故流程',
      //   70: '投诉处理流程',
      //   80: '稽查处理',
      //   90: '党组织活动',
      //   100: '驾驶员入职申请',
      //   110: '车辆报废申请',
      //   2001: '报修管理',
      //   1000: '请假单',
      //   1010: '加班单',
      //   1020: '采购单',
      //   1030: '领用单',
      //   1040: '采购订单',
      //   1060:'出差单',
      //   1070:'工作处理单',
      //   1080:'用印申请单',
      //   1090:'项目业务审批单',
      //   1100:'报销单',
      //   1110:'工会议案',
      //   1120:'议案审批单',
      //   1130:'业务招待申请',
      //   1140:'合同审批',
      //   1150:'档案借阅',
      //   1160:'新闻信息',
      //   1170:'企业证照借用',
      //   1180:'人事档案借阅',
      //   1190:'公事外出单',
      //   1200:'工会工作处理单',
      //   1210:'费用支出',
      //   1220:'公车加油申请',
      //   1230:'公车维修申请',
      //   1240:'预支款申请',
      //   1250:'预算内资金事前申请',
      //   1260:'公车保养申请',
      //   1270:'资产报修单',
      //   1280:'资产采购申请单',
      //   1290:'资产报废单',
      //   1300:'资产领用单',
      //   1310:'资产归还单',
      //   1320:'转正申请',
      //   1330:'续聘申请单',
      //   1340:'公车预约',
      //   1350:'离职退休申请',
      //   1360:'工会报销单',
      //   1370:'工会合同审批',
      //   1380:'工会会议纪要',
      //   1390:'工会领款单',
      //   1400:'工会困难职工申请单',
      //   1410:'公司档案材料移交清单',
      //   1420:'合同审批（履约信息版）',
      //   1430:'实操培训反馈表',
      //   1440:'公章注销或制作审批单',
      //   1450:'物资入库单',
      //   1460:'物资出库单',
      //   1470:'驾驶员离职退休申请',
      //   1480:'差旅报销单',
      //   1490: '乘客服务工单',
      //   1500:'包车审批单',
      //   2010: '工单管理',
      //   2020: '竣工及审核管理',
      //   2030: '领料单查询',
      //   2040: '退料单查询',
      //   3000: '合同到期提醒',
      //   3001: '合同缴费提醒',
      //   3010: '合同过期提醒',
      //   10000: '系统公告',
      //   10001: '系统公告',
      //   10002: '系统公告',
      //   10003: '应急指挥消息',
      //   10004:'应急预案消息',
      //   10005: '工作通知',
      //   10006: '公司公告',
      //   10100: '导入导出'
      // },
      routerModelMap: {
        42: {
          router: 'vehicle-yearly-inspection',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        43: {
          router: 'passenger-server-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2001: {
          router: 'repairs-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2010: {
          router: 'workorder-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2030: {
          router: 'material-query',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2040: {
          router: 'material-query',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2020: {
          router: 'completion-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3000: {
          router: 'contract-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3001: {
          router: 'contract-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3002: {
          router: 'expiration-reminder',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3010: {
          router: 'contract-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3030: {
          router: 'schedule-todo',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        6040: {
          router: 'passenger-server-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        5221: {
          router: 'assessment-score',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        5222: {
          router: 'assessment-score',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        5223: {
          router: 'my-assessment',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        10000:{
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10001:{
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10002:{
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10005:{
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10006:{
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10009:{
          router: 'news-management',
          model: 'id',
          isPopup: true //是否为弹窗
        },
        10100: {
          router: 'import-export',
          model: 'id',
          isPopup: false //是否为弹窗
        }
      },
      systemAnnouncementShow: false,
      workNoticeShow: false,
      infoDialogShow: false,
      token: getSession(),
    }
  },
  props: {
    state: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    deleteItem(item) {
      this.$client.DeleteMessageMessageCenter({context: [item.id]}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 查看详情
    lookDetails(item) {
      // console.log('------',modelObj);
      // 判断是否有对应的model
      if (!modelObj[item.model]) {
        this.$message.warning('未能处理该消息');
        return false
      }
      // 修改消息状态
      if(item.state == 1) {
        this.$client.ReadMessageMessageCenter({context: [item.id]}).then(() => {
          this.loadData()
          // 获取未读消息数量
          this.getUnReadNewCount()
        })
      }
      // 如果有其他跳转就走配置路径
      if (this.routerModelMap[item.model]) {
        // 跳转路由
        if(!this.routerModelMap[item.model].isPopup) {
          let params = {}
          params[this.routerModelMap[item.model].model] = item.object_id
          this.$router.push({
            name: this.routerModelMap[item.model].router,
            params: params
          })
        }else{
          // 打开弹窗类型消息
          switch (item.model) {
            case 10000: //系统公告
            case 10001: //系统公告
            case 10002: //系统公告
              this.reqLatestSysVersion(item.object_id)
              break;
            case 10005: //工作通知
              this.GetByIdWorkMessage(item.object_id)
              break;
            case 10009: //公司新闻
              let newUrl = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${item.object_id}&type=new`
              window.open(newUrl, '_blank')
              if (row.is_read == 1) {
                this.setNewsRead(item.object_id)
              }
              break;
            case 10006: //公司公告
              // this.GetByIdCompanyMessage(item.object_id)
              let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${item.object_id}&type=company`
              window.open(url, '_blank')
              if (row.is_read == 1) {
                this.GetByIdCompanyMessage(item.object_id)
              }
              break;
            default:
              break;
          }
        }
      } else {
        let object_id = ''
        let title = `${this.typeObj[item.type]}:${modelObj[item.model]}`
        switch (item.model) {
          case 110:
            object_id = item.object_id + '^&'
            break;

          default:
            object_id = item.object_id
            break;
        }
        this.$router.push({
          path: `/news-details/${object_id}/${title}/${item.model}`
        })
      }
    },
    // 数据请求
    loadData() {
      this.loading = true
      this.form.state = this.state
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      let form = {}
      for(let key in this.form) {
        if (this.form[key]) {
          form[key] = this.form[key]
        }
      }
      this.$client.ListMessageCenter(form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
      })
      // 通知更新未读
    },
    getUnReadNewCount() {
      let params = {
        state: 1
      }
      this.$client.ListMessageCenter(params).then(res => {
        if (res.head.result === '200') {
          this.$store.dispatch('SetNewCount',  res.context.total)
        }
      })
    },
    // 查询公告详情
    reqLatestSysVersion(id) {
      this.$client.GetDetailSysVersion({id: id}).then(res => {
        if (res.head.result == "200") {
          if(!!res.context) {
            let info = res.context
            this.markedRead(info);
          }
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 公告标记为已读
    markedRead(info) {
      let params = {
        context:[info.id]
      }
      this.$client.AddSignSysVersion(params).then(res => {
        if (res.head.result == "200") {
          this.$refs.systemAnnouncement.setData(info)
          this.systemAnnouncementShow = true;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 查询工作通知详情
    GetByIdWorkMessage(id) {
      this.$client.GetByIdWorkMessage({context: id}).then(res => {
        if (res.head.result == "200") {
          if(!!res.context) {
            let info = res.context
            this.AddSignWorkMessage(info);
          }
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 工作通知为已读
    AddSignWorkMessage(info) {
      let params = {
        context: info.id
      }
      this.$client.AddSignWorkMessage(params).then(res => {
        if (res.head.result == "200") {
          this.$refs.workNotice.setData(info)
          this.workNoticeShow = true;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },

    // 查询公司公告详情
    GetByIdCompanyMessage(id) {
      this.$client.GetByIdCompanyMessage({id}).then(res => {
        if (res.head.result == "200") {
          if(!!res.context) {
            let info = res.context
            this.AddSignCompanyMessage(info);
          }
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 公司公告为已读
    AddSignCompanyMessage(info) {
      let params = {
        context: [info.id]
      }
      this.$client.AddSignCompanyMessage(params).then(res => {})
    },
    // 新闻已读
    setNewsRead(id) {
      let params = {context: {}}
      params.context.id = id
      let userInfo = JSON.parse(getUser());
      params.context.user_id = Number(userInfo.user_id)
      this.$client.AddNewReadErpNewManage(params).then((res) => {})
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let head = this.$refs.head.$el.offsetHeight
        let th = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - head - 5
      }, 60)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dataList{
  width: 100%;
  height: 100%;
}
</style>
