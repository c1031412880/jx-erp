<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
  >
    <div slot="title">
      <div class="show-flex-box-r" style="height: 50px; background: #f5f5f5f5; padding-left: 15px;">
        <!-- <span style="line-height: 50px;">{{userName}}&nbsp;&nbsp;</span> -->
        <em style="line-height: 50px;" v-if="!!form.date && form.date.length > 0">{{form.date[0]}} &nbsp;&nbsp;{{week}}</em>
        <!-- <span style="line-height: 50px;">&nbsp;&nbsp;{{showTitle}}</span> -->
      </div>
    </div>
    <div class="el-dialog-div">
      <div class="show-flex-box-c show-flex-center" style="margin-bottom: 10px; font-size: 17px;font-weight: 700;">
        <span style="margin-bottom: 10px;color: #409EFF;">{{userName}}</span>
        <span v-if="deptName">部门:&nbsp;{{deptName}}</span>
      </div>
       <div class="show-flex-box-c" style="margin-bottom: 10px;">
        <div class="show-flex-box-r" style="justify-content: space-between; padding:10px 20px;">
          <span>今日打卡次数：暂无数据</span>
          <span>工时共计：暂无数据</span>
        </div>
        <ul class="show-flex-box-c">
          <li class="show-flex-box-r" style="margin-bottom: 8px;padding:0px 20px;align-items: center;" v-for="(item,index) in data" :key="index">
            <span style="font-weight: 800">{{item.spd}}:&nbsp;&nbsp;</span>
            <span>{{item.start_end}}&nbsp;&nbsp;</span>
            <em>(共{{item.hour}}小时)</em>
          </li>
        </ul>
      </div>
      <tr-table
        :selectionShow="false"
        :data="tableData"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="0"
        :isFixedEmptyPlaceholder="false"
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
    userName:[String],
    deptName:[String],
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      data: [],
      tableData:[],
      canRendererTableHeader: [
        {
          id: 1,
          label: "考勤时间",
          prop: "spd",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "打卡时间",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "打卡结果",
          prop: "hour",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "打卡地址",
          prop: "start_end",
          width: "240",
          align: "center",
          signIndex: 3,
          sortable: false,
        },{
          id: 5,
          label: "打卡备注",
          prop: "start_end",
          width: "240",
          align: "center",
          signIndex: 4,
          sortable: false,
        },{
          id: 6,
          label: "照片打卡",
          prop: "start_end",
          width: "240",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
      ],
      TableHeight: 380,
      loading: false,
      form:{
        date:[],
        userId: 0,
      },
      showTitle:'',
      week:'',
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
    getweekday(date){
      // date例如:'2022-03-05'
      const weekArray = new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
      const week  = weekArray[new Date(date).getDay()]
      return week
    },
    setDataInfo() {
      if(this.form.date&& this.form.date.length) {
        this.week =  this.getweekday(this.form.date[0])
      }
      // 获取详情
      this.reqBusRequest()
      
    },
    // 获取考勤统计汇总请假/加班详情
    reqBusRequest() {
      this.loading = true
      let params = {
        user_id: this.form.userId,
        date: this.form.date,
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
.el-dialog__wrapper /deep/ .el-dialog__body{
  padding: 10px 20px !important;
}
.el-dialog-div{
  height: 450px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

