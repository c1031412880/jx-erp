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
        <em style="line-height: 50px;" v-if="!!date && date.length > 0">{{date[0]}} ~ {{date[1].slice(0,10)}}</em>
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
      canRendererTableHeader: [
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
          label: "申请日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "时长（小时）",
          prop: "hour",
          width: "130",
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
      // 请假
      if(this.form.type == 1) {
        switch (this.form.type_child) {
          case 0:
            this.showTitle = '请假次数汇总'
            break;
          case 1:
            this.showTitle = '办事汇总'
            break;
          case 2:
            this.showTitle = '开会汇总'
            break;
          case 3:
            this.showTitle = '事假汇总'
            break;
          case 4:
            this.showTitle = '病假汇总'
            break;
          case 5:
            this.showTitle = '年假汇总'
            break;
        }
      }
      // 加班
      if(this.form.type == 2) {
        switch (this.form.type_child) {
          case 0:
            this.showTitle = '加班次数汇总'
            break;
          case 6:
            this.showTitle = '节假日加班汇总'
            break;
          case 7:
            this.showTitle = '双休日加班汇总'
            break;
          case 8:
            this.showTitle = '延时加班汇总'
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
    }
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

