<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
  >
    <div slot="title">
      <div class="show-flex-box-r" style="height: 50px; background: #f5f5f5f5; padding-left: 15px;">
        <span style="line-height: 50px;">{{userName}}&nbsp;&nbsp;</span>
        <em style="line-height: 50px;" v-if="dialogBool && !!date && date.length > 0">{{date[0]}} ~ {{date[1].slice(0,10)}}</em>
        <span style="line-height: 50px;">&nbsp;&nbsp;{{showTitle}}</span>
      </div>
    </div>
    <div class="el-dialog-div">
      <tr-table
        :selectionShow="false"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="0"
      >
      </tr-table>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "详情",
    },
    date:[Object,Array],
    userName:[String],
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      data: [],
      canRendererTableHeader: [],
      // 打卡
      canRendererTableHeaderFrist: [
        {
          id: 1,
          label: "考勤时间",
          prop: "kqsj",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "打卡时间",
          prop: "dksj",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "考勤结果",
          prop: "kq_result",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "考勤班次",
          prop: "kqbc",
          width: "240",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      // 出差
      canRendererTableHeaderSecond: [
        {
          id: 1,
          label: "审批单",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "时长(天)",
          prop: "str_duration",
          width: "150",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "起止时间",
          prop: "start_and_end",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        }
      ],
      // 请假
      canRendererTableHeaderThird: [
        {
          id: 1,
          label: "审批单",
          prop: "spd",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "时长",
          prop: "hour",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "起止时间",
          prop: "start_end",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        }
      ],
      // 加班
      canRendererTableHeaderFouth: [
        {
          id: 1,
          label: "加班类型",
          prop: "spd",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "时长",
          prop: "hour",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "加班费（元）",
          prop: "fee",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "起止时间",
          prop: "start_end",
          width: "240",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      TableHeight: 380,
      loading: false,
      form:{
        type:'',
        type_child:'',
        userId: 0,

        state:'', //考勤打卡状态
      },
      showTitle:'',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          // this.reqBusRequest()
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setDataInfo() {
      // 请假  1公出 2事假 3丧假 4病假 5年假 6婚假 7产假 8哺乳假 9工伤假
      if(this.form.type == 1) {
        this.canRendererTableHeader = this.canRendererTableHeaderThird
        switch (this.form.type_child) {
          case 0:
            this.showTitle = '请假次数汇总'
            break;
          case 1:
            this.showTitle = '公出汇总'
            break;
          case 2:
            this.showTitle = '事假汇总'
            break;
          case 3:
            this.showTitle = '丧假汇总'
            break;
          case 4:
            this.showTitle = '病假汇总'
            break;
          case 5:
            this.showTitle = '年假汇总'
            break;
          case 6:
            this.showTitle = '婚假汇总'
            break;
          case 7:
            this.showTitle = '产假汇总'
            break;
          case 8:
            this.showTitle = '哺乳假汇总'
            break;
          case 9:
            this.showTitle = '工伤假汇总'
            break;
        }
      }
      // 加班 1节假日加班，2休息日加班，3工作日加班
      if(this.form.type == 2) {
        this.canRendererTableHeader = this.canRendererTableHeaderFouth
        switch (this.form.type_child) {
          case 0:
            this.showTitle = '加班总时长'
            break;
          case 1:
            this.showTitle = '节假日（转加班费）'
            break;
          case 2:
            this.showTitle = '休息日（转加班费）'
            break;
          case 3:
            this.showTitle = '工作日（转加班费）'
            break;
        }
      }
      // 获取详情
      this.reqBusRequest()
      
    },
    // 获取考勤统计汇总请假/加班详情
    reqBusRequest() {
      this.loading = true
      let params = {
        user_id: this.form.userId,
        date: this.date,
        type: this.form.type,
        type_child: this.form.type_child
      }
      if(this.form.type_child == 0) {
        delete params.type_child
      }
      this.$client.DetailAttendanceStatistics(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loading = false;
          this.data = res.context;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },

    // 设置考勤打卡   0未打卡1正常2迟到3早退4异常打卡5缺卡6外勤7旷工8上班缺卡9下班缺卡
    setDataFirstInfo() {
      this.canRendererTableHeader = this.canRendererTableHeaderFrist
      switch (this.form.state) {
        case 2:
          this.showTitle = '迟到次数汇总'
          break;
        case 3:
          this.showTitle = '早退次数汇总'
          break;
        case 8:
          this.showTitle = '上班缺卡次数汇总'
          break;
        case 9:
          this.showTitle = '下班缺卡次数汇总'
          break;
        case 7:
          this.showTitle = '旷工天数汇总'
          break;
      }
      this.reqPunchClockData()
    },
    // 获取打卡数据
    reqPunchClockData() {
      this.loading = true
      let params = {
        user_id: this.form.userId,
        start_date: this.date[0],
        end_date: this.date[1],
        state: this.form.state
      }
      this.$client.GetOaClockKqRecord(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loading = false;
          this.data = res.context;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 设置出差
    setDataSecondInfo() {
      this.canRendererTableHeader = this.canRendererTableHeaderSecond
      this.showTitle = '出差时长汇总'
      this.reqBusinessTravelData()
    },
    // 获取出差数据
    reqBusinessTravelData() {
      this.loading = true
      let params = {
        user_id: this.form.userId,
        start: this.date[0],
        end: this.date[1],
      }
      this.$client.GetSummaryByUserTripRecord(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loading = false;
          this.data = res.context.record_list;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper /deep/ .el-dialog__header{
  padding: 0 !important;
}
.el-dialog-div{
  height: 400px;
}
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

