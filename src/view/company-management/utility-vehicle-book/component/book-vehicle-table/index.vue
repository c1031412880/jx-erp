<!--  -->
<template>
  <div class="book-Vehicle-table-box" :style="`height: ${TableHeight}px`">
    <div class="book-Vehicle-list show-flex-box-c" v-if="bookMeetingData && bookMeetingData.length > 0">
      <div class="book-Vehicle-item show-flex-box-r" v-for="(item,index) in bookMeetingData" :key="index">
        <div class="book-Vehicle-item-content show-flex-box-c">
          <div class="book-Vehicle-item-top show-flex-box-r">
            <el-image
              style="width: 165px; height: 100%; margin-left: 10px;flex-shrink: 0;"
              :src="item.img_url"
              fit="contain"
              :preview-src-list="[item.img_url]"
            ></el-image>
            <h3 class="show-flex-box-c">
              <h4 class="show-flex-box-r">
                <strong >{{item.name}}</strong>
                <!-- <em>需审批</em> -->
                <el-tag type="danger" size="mini" style="margin-right: 10px;" v-if="item.is_audit">需审批</el-tag>
                <el-tag type="primary" size="mini" v-if="item.use_state_name">{{item.use_state_name || '--'}}</el-tag>
                <!-- <el-tag type="info" size="mini" v-else>审批</el-tag> -->

              </h4>
              <p>车牌号：{{item.code}}</p>
              <p>负责人：{{item.duty_name}}</p>
              <span class="show-flex-box-r">
                <i class="el-icon-user"></i>
                <span>{{item.max_count || 0}}</span>
                <span style="color:#409EFF; margin-left: 40px;" v-if="item.expect_back_time">预计还车时间： {{item.expect_back_time.slice(0,16)}}</span>
              </span>
            </h3>
          </div>
          <div>停放位置： {{item.last_position}}</div>
          <!-- <div class="book-Vehicle-item-bottom">
            <time-scale ref="timeScale " @sure-selected-time="sureSelectedTime" :alreadyBooks="item" :searchDate="searchDate"></time-scale>
          </div> -->
        </div>
        <div class="show-flex-box-r book-Vehicle-item-right">

          <!-- <el-button type="text" @click="openReservedVehiclePop(item)">预约车辆</el-button> -->
          <el-button type="text" @click="openBorrowCarPop(item)" v-if="!item.state">借车</el-button>
          <el-button type="text" @click="openBorrowCarDetailPop(item)">车辆详情</el-button>
          <!-- <el-button type="text" @click="openAppointmentRecordPop(item)">预约记录</el-button> -->
        </div>
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无公车信息"></el-empty>
    </div>
    <div>
      <borrow-form-dialog 
        ref="borrowFormDialog"
        :dialogBool.sync="isShowborrowFormDialog"
        @save-add-edit="saveAddEdit"
        @save-add-draft="saveAddDraft"
        :bus_id="bus_id"
        :borrowType="borrowType"
        :isShowBorrowUser="isShowBorrowUser"
      ></borrow-form-dialog>

      <reserved-vehicle-dialog 
        ref="reservedVehicleDialog"
        :dialogBool.sync="isShowReservedVehicleDialog"
        :curChangeType="curChangeType"
        @save-add-reserved="saveReserved"
        @save-add-draft="saveDraftReserved"
        :bus_id="bus_id"
        :isShowSelectUser="isShowSelectUser"
      ></reserved-vehicle-dialog>

      <reserved-record-dialog
        ref="reservedRecordDialog"
        :dialogBool.sync="isShowReservedRecordDialog"
        :busId="busId"
      ></reserved-record-dialog>
    </div>
  </div>
</template>

<script>
import borrowFormDialog from "./component/borrow-form-dialog";
import reservedVehicleDialog from "../reserved-info-comp/reserved-vehicle-dialog.vue";
import reservedRecordDialog from "../reserved-info-comp/reserved-record-dialog.vue";
import {getUser} from '@/utils/auth'
export default {
  components: {
    borrowFormDialog,
    reservedVehicleDialog,
    reservedRecordDialog
  },
  props: {
    bookMeetingData:[Array],
    TableHeight:[Number]
  },
  data() {
    return {
      isShowborrowFormDialog: false,
      isShowReservedVehicleDialog: false,
      curChangeType: 'add',
      isShowReservedRecordDialog: false,
      busId:0 ,
      loginUserId:'',
      bus_id: '',
      borrowType: '',
      isShowSelectUser: true,
      isShowBorrowUser: true,
    };
  },
  created() {},
  mounted() {
    let userInfo = JSON.parse(getUser());
    this.loginUserId = Number(userInfo.user_id)
  },
  computed: {},
  watch: {},
  methods: {
    // 打开借车弹窗
    openBorrowCarPop(form) {
      this.isShowborrowFormDialog = true;
      let params = { form_id : 20}
      this.$client.GetBehalfByIdFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.isShowBorrowUser = !res.context
        }
      })
      this.borrowType = "add"
      let newForm = {...form};
      setTimeout(() => {
        this.$refs.borrowFormDialog.form.bus_id = newForm.id;
        this.$refs.borrowFormDialog.form.borrow_mile = newForm.last_mile;
        this.$refs.borrowFormDialog.form.borrow_position = newForm.last_position;
        this.$refs.borrowFormDialog.form.name = newForm.name;
        this.$refs.borrowFormDialog.form.code = newForm.code;
        this.$refs.borrowFormDialog.form.borrow_driver_id = newForm.driver_id;
        this.$refs.borrowFormDialog.form.from_address = newForm.last_position;
        // this.$refs.borrowFormDialog.form.audit_person_name = newForm.audit_person_name;
        this.$refs.borrowFormDialog.form.is_audit = newForm.is_audit;
      },100)
      this.bus_id = newForm.id
    },
    // 打开公车车详情弹窗
    openBorrowCarDetailPop(info) {
      this.$emit('check-car-detail', info)
    },
    // 打开预约车辆
    openReservedVehiclePop(info) {
      let params = { form_id : 1340}
      this.$client.GetBehalfByIdFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.isShowSelectUser = !res.context
        }
      })
      console.log('info',info);
       setTimeout(() => {
        this.$refs.reservedVehicleDialog.form.bus_id = info.id;
        this.$refs.reservedVehicleDialog.form.code = info.code;
        this.$refs.reservedVehicleDialog.form.name = info.name;
        this.$refs.reservedVehicleDialog.form.is_audit = info.is_audit;
        this.$refs.reservedVehicleDialog.form.from_address = info.last_position;
      },100)
      this.bus_id = info.id
      this.isShowReservedVehicleDialog = true
    },
    // 打开预约记录
    openAppointmentRecordPop(info) {
      this.busId = info.id
      this.isShowReservedRecordDialog = true
    },
    // 保存借车草稿
    saveAddDraft(formData) {
      this.$client
        .SaveBorrowDraft({context: {form_data:formData}})
        .then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.isShowborrowFormDialog = false;
            this.$message({
              showClose: true,
              message: '保存借车草稿成功',
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
    },
    // 确定借车
    saveAddEdit(form,step_data) {
      let parmas = {
        context: {
          form_data: form,
          step_data: step_data,
        }
      };
      this.$client
        .CreateBorrow(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.isShowborrowFormDialog = false;
            this.$message({
              showClose: true,
              message: '提交借车申请成功',
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
    // 提交预约草稿
    saveDraftReserved(formData) {
      this.$client
        .SaveBusRequestDraft({context: {form_data:formData}})
        .then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.isShowReservedVehicleDialog = false;
            this.$message({
              showClose: true,
              message: '保存预约草稿成功',
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
    // 提交预约
    saveReserved(form,step_data) {
      let parmas = {
        context: {
          form_data: form,
          step_data: step_data,
        }
      };
      this.$client
        .CreateBusRequestBusManage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.isShowReservedVehicleDialog = false;
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
    }
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.book-Vehicle-table-box {
  // height: 100%;
  width: 100%;
  overflow-y: scroll

  .book-Vehicle-list {
    height: 100%;
    // width: 100%;
    padding: 0 15px;
    flex-grow: 1;
    // overflow-y: scroll;

    .book-Vehicle-item {
      // width: 100%;
      height: 185px;
      padding: 20px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      margin-bottom: 15px;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, .12)
      justify-content: space-between;
      align-items: center
      .book-Vehicle-item-top{
        width: 100%;
        height: 115px;
        margin-bottom: 15px;
        
        >h3{
          height: 100%
          flex-grow: 1;
          margin-left: 15px;
          >h4{
            width 100%;
            height: 25px;
            margin-bottom: 15px;
            align-items: center;
            >strong{
              margin-right: 15px; 
            }
            >em{

            }
          }
          >p{
            color: #958D9D;
            margin-bottom:15px;
          }
          >span{
            width: 100%;
            align-items: center;
            >i{
              margin-right: 10px;
            }
          }
        }

      }
      .book-Vehicle-item-bottom{
        width: 100%;
        height: 30px;
      }
    }
  }
}
</style>