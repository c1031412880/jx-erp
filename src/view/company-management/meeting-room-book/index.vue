<template>
  <div class="meeting-room-book">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="预订会议室" name="first">
         <sub-req
          ref="head"
          @on-ok="onSubmit"
        ></sub-req>
        <div v-loading="loading">
          <div v-show="data && data.length > 0">
            <book-meeting-table ref="bookMeetingTable" @open-select-book-meetting="openSelectBookMeetting" :bookMeetingData="data" :searchDate="form.date" :TableHeight="TableHeight"></book-meeting-table>
          </div>
          <!-- <div>
            <el-empty description="暂无会议室信息"></el-empty>
          </div> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的预订" name="second">
        <div style="overflow-y: scroll" :style="`height: ${TableHeightSecond}px`">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已预订</span>
            </div>
            <div v-if="mineBookMeettingData.reserved && mineBookMeettingData.reserved.length > 0">
              <mine-book-table :mineBookMeettingData="mineBookMeettingData.reserved" :status="'reserved'" @refsh-list-on-mine="reqMineBookMeettingInfo"></mine-book-table>
            </div>
            <div v-else>
              <el-empty description="暂无预定信息"></el-empty>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已结束</span>
            </div>
            <div v-if="mineBookMeettingData.finished && mineBookMeettingData.finished.length > 0">
              <mine-book-table :mineBookMeettingData="mineBookMeettingData.finished" :status="'finished'" ></mine-book-table>
            </div>
            <div v-else>
              <el-empty description="暂无已结束信息"></el-empty>
            </div>
          </el-card>
        </div>


      </el-tab-pane>
    </el-tabs>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :selectedTimeList="selectedTime"
      :searchDate="form.date"
      :booksInfo="booksInfo"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import bookMeetingTable from "./component/book-meeting-table";
import mineBookTable from "./component/mine-book-table";
import informationDialog from "./component/information-dialog";
import {getUser} from '@/utils/auth'
export default {
  name: "meeting-room-book",
  components: {
    subReq,
    bookMeetingTable,
    mineBookTable,
    informationDialog,
  },
  data() {
    return {
      activeName: "first",
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      TableHeightSecond:500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      jobIds:[],
      mineBookMeettingData:[],
      booksInfo:[],
      selectedTime:[], //选中的时间段
      applyId:'', //申请人ID
    };
  },
  activated() {
    this.loadData()
    this.reqMineBookMeettingInfo();
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      // // 审批后更新表格
      // eventOn.$on('update-upcoming-meeting-room', () => {
      //   this.loadData()
      //   this.reqMineBookMeettingInfo();
      // })
      let userInfo = JSON.parse(getUser());
      this.applyId = Number(userInfo.user_id)
    });
    this.reqMineBookMeettingInfo();
  },
  methods: {

     handleClick(tab, event) {
      if(tab.name == "second") {
        this.reqMineBookMeettingInfo();
      }else{
        this.loadData();
      }
    },

    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.data = [];
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.listBookRecordsMeetingRoom(params)
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
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 获取我的预定信息
    reqMineBookMeettingInfo() {

      this.$client.listMyBookRecordsMeetingRoom()
        .then(res => {
          if (res.head.result == "200") {
            this.mineBookMeettingData = res.context;
            console.log(this.mineBookMeettingData)
          } else {
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
    // 打开会议室预定信息填写
    openSelectBookMeetting(date,info){
      this.selectedTime = JSON.parse(JSON.stringify(date));
      console.log(date, info);
      // 需审批的需要填写预定内容
      if(!info.need_check) {
        this.$refs.informationDialog.form.meeting_id = info.meeting_id;
        this.$refs.informationDialog.meeting_name = info.name;
        this.$refs.informationDialog.form.begin_time = date[0];
        this.$refs.informationDialog.form.end_time = date[1];
        this.$refs.informationDialog.check_person = info.check_person;
        this.$refs.informationDialog.need_check = info.need_check;
        this.booksInfo = info.books;

        this.informationDialogTitle = "会议室预约";
        this.informationDialogShow = true;
      }else{
        let signIndex = date[1].indexOf(':');
        let timeNum = date[1].slice(0,signIndex)
        let endStartTime = timeNum == 24? '23:59': date[1];

        let params = {
          meeting_id: info.meeting_id,
          begin_time: `${this.form.date} ${date[0]}:00`,
          end_time:  `${this.form.date} ${endStartTime}:00`,
          apply_id: this.applyId,
          state: 1
        }
        // console.log(params)
        // return
        this.saveAddEdit(params)
      }

    },
    // 保存预定
    saveAddEdit(form) {
      console.log(form)
      let parmas = {
        context: form
      };
      this.$client
        .bookMeetingRoomMeetingRoom(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.reqMineBookMeettingInfo();
            this.informationDialogShow = false;
            // this.$refs.bookMeetingTable.this.$refs.timeScale.visible = false;
            // alert(this.$refs.bookMeetingTable.this.$refs.timeScale.visible)
            // this.$refs.bookMeetingTable.this.$refs.timeScale.resetSelected();
            this.$message({
              showClose: true,
              message: '提交预约成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 80;
        this.TableHeightSecond = maxh - 80;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.meeting-room-book {
  width: 100%;
  height: 100%;
}

.meeting-room-book /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.meeting-room-book /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}
</style>
