<template>
  <div class="meeting-room-book">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="公车库" name="first">
        <div v-loading="loading">
          <div style="display: flex;align-items: center;padding:10px 15px;">
            <div style="width: 80px;">车辆名称:</div>
            <el-input v-model="vehicleName" @input="changeName" size="mini" style="width: 220px;" placeholder="请输入车辆名称" clearable></el-input>
          </div>
          <div v-show="data && data.length > 0">
            <book-vehicle-table ref="bookMeetingTable" @check-car-detail="checkCarDetail" @update-load-data="getDataList" :bookMeetingData="data" :TableHeight="TableHeightSecond"></book-vehicle-table>
          </div>
          <div v-if="data && data.length == 0">
            <el-empty description="暂无可借车车辆"></el-empty>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的借车" name="second">
        <!-- <sub-req
          ref="head"
          @on-ok="onSubmit"
        ></sub-req> -->
        <!-- <div style="overflow-y: scroll" :style="`height: ${TableHeight}px`">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>进行中</span>
            </div>
            <div v-if="mineBookMeettingData.reserved && mineBookMeettingData.reserved.length > 0">
              <mine-borrow-table :mineBookMeettingData="mineBookMeettingData.reserved" :status="'reserved'" :loading="mineLoading" @check-car-detail="checkCarDetailForMine" @update-load-data="reqMineBookMeettingInfo"></mine-borrow-table>
            </div>
            <div v-else>
              <el-empty description="暂无借车信息"></el-empty>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已结束</span>
            </div>
            <div v-if="mineBookMeettingData.finished && mineBookMeettingData.finished.length > 0">
              <mine-borrow-table :mineBookMeettingData="mineBookMeettingData.finished" :status="'finished'" :loading="mineLoading" @check-car-detail="checkCarDetailForMine"></mine-borrow-table>
            </div>
            <div v-else>
              <el-empty description="暂无已借车信息"></el-empty>
            </div>
          </el-card>
        </div> -->
        <!-- <div style="overflow-y: scroll" :style="`height: ${TableHeight}px`"> -->
          <el-tabs v-model="activeName2" @tab-click="handleClick2">
            <el-tab-pane label="进行中" name="first">
              <sub-req
                ref="head"
                @on-ok="onReservedSubmit"
              ></sub-req>
              <div v-if="reservedList && reservedList.length > 0" style="overflow-y: scroll" :style="`height: ${TableHeight}px`">
                <mine-borrow-table 
                  :mineBookMeettingData="reservedList" 
                  :status="'reserved'" 
                  :loading="reservedLoading" 
                  @check-car-detail="checkCarDetailForMine" 
                  @update-load-data="getDataList"
                ></mine-borrow-table>
              </div>
              <div v-else>
                <el-empty description="暂无借车信息"></el-empty>
              </div>
              <el-pagination
                style="margin: 5px 0;display:flex; justify-content: flex-end;"
                @current-change="handleReservedCurrentChange"
                @size-change="handleReservedSizeChange"
                ref="paginationH"
                :current-page="reservedPageInfo.pageIndex"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                :page-size="reservedPageInfo.pageSize"
                layout="total,sizes, prev, pager, next, jumper"
                :total="reservedPageInfo.pageCount"
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="已结束" name="second">
              <sub-req
                ref="head"
                @on-ok="onFinishedSubmit"
              ></sub-req>
              <div v-if="finishedList && finishedList.length > 0" style="overflow-y: scroll" :style="`height: ${TableHeight}px`">
                <mine-borrow-table 
                  :mineBookMeettingData="finishedList" 
                  :status="'finished'" 
                  :loading="finishedLoading" 
                  @check-car-detail="checkCarDetailForMine"
                ></mine-borrow-table>
              </div>
              <div v-else>
                <el-empty description="暂无已借车信息"></el-empty>
              </div>
              <el-pagination
                style="margin: 5px 0;display:flex; justify-content: flex-end;"
                @current-change="handleFinishedCurrentChange"
                @size-change="handleFinishedSizeChange"
                ref="paginationH"
                :current-page="finishedPageInfo.pageIndex"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                :page-size="finishedPageInfo.pageSize"
                layout="total,sizes, prev, pager, next, jumper"
                :total="finishedPageInfo.pageCount"
              ></el-pagination>
            </el-tab-pane>
          </el-tabs>
        <!-- </div> -->
      </el-tab-pane>
      <el-tab-pane label="添加公车" name="thrid" lazy v-if="$isPowerShow('management')">
        <utility-vehicle-management ref="utility-vehicle-management">
        </utility-vehicle-management>
      </el-tab-pane>
    </el-tabs>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
import subReq from "./component/sub-req";
import bookVehicleTable from "./component/book-vehicle-table";
import mineBorrowTable from "./component/mine-borrow-table";
import utilityVehicleManagement from "./component/utility-vehicle-management";
import informationDialog from "./component/information-dialog";
import { deepCopy } from '@/utils/index'
export default {
  name: "utility-vehicle-book",
  components: {
    subReq,
    bookVehicleTable,
    mineBorrowTable,
    informationDialog,
    utilityVehicleManagement
  },
  data() {
    return {
      activeName: "first",
      activeName2: "first",
      reservedPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      finishedPageInfo: {
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
      mineBookMeettingData:[],
      booksInfo:[],
      mineLoading: false,
      reservedLoading: false,
      finishedLoading: false,
      reservedList: [],
      finishedList: [],
      reservedForm: {},
      finishedForm: {},

      vehicleName: '',
      oldData: null
    };
  },
  activated(){ 
    this.handleClick({name: this.activeName})
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      // 审批后更新表格
      eventOn.$on('update-upcoming-utility-vehicle', () => {
        this.loadData()
        // this.reqMineBookMeettingInfo();
        this.GetReServedRecordBusManage();
        this.GetFinishRecordBusManage();
      })
    });
    this.loadData();
  },
  methods: {
     handleClick2(tab){
      if(tab.name == "first") {
        this.GetReServedRecordBusManage();
      }else{
        this.GetFinishRecordBusManage();
      }
     },
     handleClick(tab) {
      console.log('tab',tab);
      if(tab.name == "second") {
        this.GetReServedRecordBusManage();
      }else if (tab.name == 'first') {
        this.loadData();
      }else{
        this.$nextTick(() => {
          this.$refs['utility-vehicle-management'].setHead()
        })
      }
    },
    getDataList() {
      console.log(this.activeName, this.activeName2);
      if(this.activeName == "first") {
        this.loadData();
      }else{
        if(this.activeName2 == 'first') {
          this.GetReServedRecordBusManage(); 
        }else {
          this.GetFinishRecordBusManage();
        } 
      }
    },
    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.reqMineBookMeettingInfo();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = 1
      params.page_size = 99
      params.is_borrow = 1;
      this.$client.getByPageBusManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context
            this.oldData = deepCopy(this.data)
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
    // 分页切换事件
    handleFinishedCurrentChange(idx) {
      this.finishedPageInfo.pageIndex = idx
      this.GetFinishRecordBusManage()
    },
    // 切换每页条数
    handleFinishedSizeChange(sizes) {
      this.finishedPageInfo.pageIndex = 1
      this.finishedPageInfo.pageSize = sizes
      this.finishedPageInfo.pageCount = 0
      this.GetFinishRecordBusManage()
    },
    onFinishedSubmit(form) {
      this.form = form
      this.GetFinishRecordBusManage();
    },
    // 获取公车已完成记录
    GetFinishRecordBusManage() {
      this.finishedLoading = true;
      let userInfo = JSON.parse(getUser());
      let user_id = Number(userInfo.user_id)
      let params = {
        user_id :user_id,
        id: this.form.bus_id,
        page_index:this.finishedPageInfo.pageIndex,
        page_size:this.finishedPageInfo.pageSize,
      }
      this.$client.GetFinishRecordBusManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.finishedList = res.context.list
            this.finishedPageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.finishedLoading = false;
        }).catch(err => {
          this.finishedLoading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 分页切换事件
    handleReservedCurrentChange(idx) {
      this.reservedPageInfo.pageIndex = idx
      this.GetReServedRecordBusManage()
    },
    // 切换每页条数
    handleReservedSizeChange(sizes) {
      this.reservedPageInfo.pageIndex = 1
      this.reservedPageInfo.pageSize = sizes
      this.reservedPageInfo.pageCount = 0
      this.GetReServedRecordBusManage()
    },
    onReservedSubmit(form) {
      this.form = form
      this.GetReServedRecordBusManage();
    },
    // 获取公车未完成记录
    GetReServedRecordBusManage() {
      this.reservedLoading = true;
      let userInfo = JSON.parse(getUser());
      let user_id = Number(userInfo.user_id)
      let params = {
        user_id :user_id,
        id: this.form.bus_id,
        page_index:this.reservedPageInfo.pageIndex,
        page_size:this.reservedPageInfo.pageSize,
      }
      this.$client.GetReServedRecordBusManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.reservedList = res.context.list
            this.reservedPageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.reservedLoading = false;
        }).catch(err => {
          this.reservedLoading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 获取我借车记录
    reqMineBookMeettingInfo() {
      this.mineLoading = true;
      let userInfo = JSON.parse(getUser());
      let user_id = Number(userInfo.user_id)
      let params = {
        user_id :user_id,
        bus_id: this.form.bus_id
      }
      this.$client.getUseRecordBusManage(params)
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
          this.mineLoading = false;
        }).catch(err => {
          this.mineLoading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 查看车辆详情
    checkCarDetail(info){
      let newForm = {...info};
      if(!info.use) {
        newForm.ex_person_ids = [];
      }
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(newForm, key)) {
            this.$refs.informationDialog.form[key] = newForm[key]
          }
        }
      },100)

      this.informationDialogTitle = "车辆详情";
      this.curSelecedType = 'detail';
      this.informationDialogShow = true;
    },
    // 我的预定中查看公车信息详情
    checkCarDetailForMine(info) {
      console.log(info);
      let params = {
        id: info.bus_id
      }
      this.$client.getByPageBusManage(params)
        .then(res => {
          if (res.head.result == "200") {
            console.log(res)
            if(res.context.length > 0) {
              this.checkCarDetail(res.context[0])
            }
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

    // 保存预定
    saveAddEdit(form) {
      let successrMessage = "";
      // console.log(form)
      // return
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
    // 根据车牌号进行筛选 
    changeName() {
      this.debounce(this.dataDiltering,1500)()
    },
    // 数据筛选过滤 
    dataDiltering() {
      this.data = this.oldData.filter(item => {
        return item.name.indexOf(this.vehicleName) != -1
      })
    },
    debounce(fn, delay = 500) {
      // timer 是在闭包中的
      let that = this
      return function() {
        if(that.timer) {
            clearTimeout(that.timer);
        }
        that.timer = setTimeout(() => {
            fn.apply(this, arguments);
            // 清空定时器
            that.timer = null;
        }, delay)
      }
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 200;
        this.TableHeightSecond = maxh - 100;
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
  text-align: center;
}

.meeting-room-book /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
.meeting-room-book /deep/ .el-tabs {
  height: calc(100% - 50px);
}
.meeting-room-book /deep/ .el-tabs__content,
.el-tab-pane {
  height: 100%
}
</style>
