
<template>
  <div class="book-meeting-table-box" v-loading="loading">
    <div class="book-meeting-list show-flex-box-c" v-if="mineBookMeettingData && mineBookMeettingData.length > 0">
      <div class="book-meeting-item show-flex-box-r" v-for="(item,index) in mineBookMeettingData" :key="index">
        <div class="book-meeting-item-content show-flex-box-c">
          <div class="book-meeting-item-top show-flex-box-r">
            <el-image
              style="width: 165px; height: 100%; margin-left: 10px;flex-shrink: 0;"
              :src="item.img_url"
              fit="contain"
              :preview-src-list="[item.img_url]"
            ></el-image>
            <h3 class="show-flex-box-c">
              <h4 class="show-flex-box-r">
                <strong>{{item.name}}</strong>
                <div class="show-flex-box-r" v-if="item.type == 1">
                  <!-- <em>需审批</em> -->
                  <!--  state_child 1借车审批中2借车通过3借车拒绝4还车审批中5还车通过6还车拒绝7撤销借车 -->
                  <!-- state 状态 1进行中（1,2,4,6） 2已结束（3,5,7） -->
                  <div class="show-flex-box-r" style="margin-right:5px">
                    <el-tag type="danger" size="mini" v-if="!!item.is_audit" style="margin-right:5px">需审批</el-tag>
                    <el-tag type="" size="mini" v-if="item.state == 1">使用中</el-tag>
                    <el-tag type="" size="mini" v-if="item.state == 2">已完成</el-tag>
                  </div>
                  <el-tag v-if="(!!item.state_child && item.state_child != '9') && (!!item.state_child && item.state_child != '8')" :type="showTagText(item.state_child).type" size="mini">{{showTagText(item.state_child).showText}}</el-tag>
                </div>
                <div v-if="item.type == 2">
                  <el-tag type="" size="mini" v-if="item.state_child_name">{{item.state_child_name}}</el-tag>
                  <el-tag :type="item.request_state == 1?'warning':'danger'" size="mini">{{item.request_state_name}}</el-tag>
                </div>

              </h4>
              <p>车牌号：{{item.code}}</p>
              <em class="show-flex-box-r" v-if="item.type == 1">
                <p v-if="!item.back_time">借车时间：{{item.borrow_time.slice(0,16)}}<span v-if="!!item.expect_back_time">~{{item.expect_back_time.slice(0,16)}}</span></p>
                                        <!--  借车时间           还车时间       -->
                <p v-else>借还车时间：{{item.borrow_time.slice(0,16)}}~{{item.back_time.slice(0,16)}}</p>
              </em>
              <em v-if="item.type == 2">
                                                                        <!--  预约时间           预计还车时间       -->
                <p v-if="!!item.req_time && !!item.back_time">预约时间：{{item.req_time.slice(0,16)}}~{{item.back_time.slice(0,16)}}</p>
              </em>
              <span class="show-flex-box-r">
                <i class="el-icon-user"></i>
                <span>{{item.max_count || 0}}</span>
              </span>
            </h3>
          </div>
          <div>停放位置： {{item.last_position}}</div>
          <!-- <div class="book-meeting-item-bottom">
            <time-scale ref="timeScale " @sure-selected-time="sureSelectedTime" :alreadyBooks="item" :searchDate="searchDate"></time-scale>
          </div> -->
        </div>
        <div class="show-flex-box-r book-meeting-item-right" v-if="item.type == 1">
          <el-button type="text" @click="openRepayCarPop(item)" v-if="item.state_child == 2 || item.state_child == 9 || item.state_child == 6">还车</el-button>
          <el-button type="text" @click="openAuditDetail(item,'back')" v-if="!!item.is_audit && (item.state_child == 4 || item.state_child == 5 || item.state_child == 6)"> 还车审批</el-button>
          <el-button type="text" @click="openRepayDetail(item,'back')" v-if="!item.is_audit && (item.state_child == 4 || item.state_child == 5 || item.state_child == 6)"> 还车详情</el-button>
          <el-button type="text" @click="openAuditDetail(item ,'borrow')" v-if="!!item.is_audit">借车审批</el-button>
          <el-button type="text" @click="openRepayDetail(item,'borrow')" v-else> 借车详情</el-button>
          <el-button type="text" @click="openBorrowCarDetailPop(item)">车辆详情</el-button>
        </div>
        <div class="show-flex-box-r book-meeting-item-right" v-if="item.type == 2">
          <el-button type="text" @click="cancleReserved(item)" v-if="item.request_state == 1">取消预约</el-button>
          <el-button type="text" @click="openReservedVehiclePop(item)">预约详情</el-button>
        </div>
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无公车信息"></el-empty>
    </div>
    <div>
      <repay-form-dialog
        ref="repayFormDialog"
        :dialogBool.sync="isShowRepayFormDialog"
        :bus_id="bus_id"
        @save-add-edit="saveAddEdit"
        @save-add-draft="saveAddDraft"
        :repayType="repayType"
        :isShowRepayCarUser="isShowRepayCarUser"
      >
      </repay-form-dialog>

      <borrow-form-dialog 
        ref="borrowFormDialog"
        :dialogBool.sync="isShowborrowFormDialog"
        :borrowType="borrowType"
      ></borrow-form-dialog>

      <audit-detail
        ref="auditDetail"
        :dialogBool.sync="isShowAuditDetail"
      ></audit-detail>

      <reserved-vehicle-dialog 
        ref="reservedVehicleDialog"
        :dialogBool.sync="isShowReservedVehicleDialog"
        :curChangeType="curChangeType"
      ></reserved-vehicle-dialog>

    </div>
  </div>
</template>

<script>
import repayFormDialog from "./component/repay-form-dialog";
import auditDetail from "./component/audit-detail";
import borrowFormDialog from "../book-vehicle-table/component/borrow-form-dialog";
import {getUser} from '@/utils/auth'
import reservedVehicleDialog from "../reserved-info-comp/reserved-vehicle-dialog.vue";
export default {
  components: {
    repayFormDialog,
    auditDetail,
    reservedVehicleDialog,
    borrowFormDialog
  },
  props: {
    mineBookMeettingData:[Array],
    status:{
      type: String,
      default: 'reserved'
    },
    loading:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isShowAuditDetail: false,
      isShowRepayFormDialog: false,
      loginUserId:'',
      curChangeType: 'detail',
      isShowReservedVehicleDialog: false,
      bus_id: '',
      repayType: "",
      borrowType: "",
      isShowborrowFormDialog: false,
      isShowRepayCarUser: true,
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
    // 还车时间 > 借车时间才能 还车
    borrowing(val) {
      return new Date().getTime() > new Date(val.borrow_time).getTime()
    },
    showTagText(state_child) {
      let showInfo = {
        showText: '',
        type: '',
      };
      switch (state_child) {
        case 1:
          showInfo.showText = '借车审批中'
          showInfo.type = ''
          break;
        case 2:
          showInfo.showText = '借车通过'
          showInfo.type = 'success'
          break;
        case 3:
          showInfo.showText = '借车驳回'
          showInfo.type = 'danger'
          break;
        case 4:
          showInfo.showText = '还车审批中'
          showInfo.type = ''
          break;
        case 5:
          showInfo.showText = '还车通过'
          showInfo.type = 'success'
          break;
        case 6:
          showInfo.showText = '还车驳回'
          showInfo.type = 'danger'
          break;
        case 7:
          showInfo.showText = '撤销借车'
          showInfo.type = ''
          break;
        // case 8:
        //   showInfo.showText = '待提交'
        //   showInfo.type = ''
        //   break;
        // case 9:
        //   showInfo.showText = '待提交'
        //   showInfo.type = ''
        //   break;
      }
      return showInfo
    },
    // 借车还车详情
    openRepayDetail(info,type) {
      if (type === "back") {
        this.repayType = "edit"
        setTimeout(() => {
          this.$refs.repayFormDialog.setData(info);
        }, 100);
        this.isShowRepayFormDialog = true;
      } else {
        this.borrowType = "edit"
        setTimeout(() => {
          this.$refs.borrowFormDialog.setData(info);
        }, 100);
        this.isShowborrowFormDialog = true;
      }
    },

    // 打开审批详情
    openAuditDetail(info,type) {
      // this.$refs.auditDetail.setData(info,type);
      // this.isShowAuditDetail = true
      let title = type == 'back' ? '还车审批' : '借车审批'
      let object_id = type == 'back' ? 21 : 20
      this.$router.push({
        path: `/news-details/${info.id}/${title}/${object_id}`
      })
    },
    // 打开还车表单
    openRepayCarPop(info) {
      let params = { form_id : 21}
      this.$client.GetBehalfByIdFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.isShowRepayCarUser = !res.context
        }
      })
      this.repayType = "add"
      let newForm = {...info};
      setTimeout(() => {
        this.$refs.repayFormDialog.form.id = newForm.id;
        this.$refs.repayFormDialog.form.bus_id = newForm.bus_id;
        this.$refs.repayFormDialog.form.name = newForm.name;
        this.$refs.repayFormDialog.form.code = newForm.code;
        this.$refs.repayFormDialog.form.audit_person = newForm.audit_person;
        this.$refs.repayFormDialog.form.audit_person_name = newForm.audit_person_name;
        this.$refs.repayFormDialog.form.is_audit = newForm.is_audit;
      },100)
      this.bus_id = newForm.bus_id 
      this.isShowRepayFormDialog = true;
    },
    // 打开借车详情弹窗
    openBorrowCarDetailPop(info) {
       this.$emit('check-car-detail', info)
    },
    // 保存还车草稿
    saveAddDraft(formData) {
      this.$client
        .SaveBackDraft({context: {form_data:formData}})
        .then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.isShowRepayFormDialog = false;
            this.$message({
              showClose: true,
              message: '保存还车草稿成功',
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
    // 提交还车信息
    saveAddEdit(form,step_data) {
      let parmas = {
        context: {
          form_data: form,
          step_data: step_data,
        }
      };
      this.$client.CreateBack(parmas).then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.isShowRepayFormDialog = false;
            this.$message({
              showClose: true,
              message: '已提交还车信息',
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
    // 取消预约
    cancleReserved(form) {
      let parmas = {
        id: form.id
      };
      this.$client.CancelBusRequestBusManage(parmas).then((res) => {
          if (res.head.result == "200") {
            // 更新父组件列表
            this.$emit('update-load-data')  
            this.$message({
              showClose: true,
              message: '已取消预约',
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
    // 打开预约详情
    openReservedVehiclePop(info) {
      let detail_id = 1340, title = '公车预约申请'
      this.$router.push({
        path: `/news-details/${info.id}/${title}/${detail_id}`
      })
    //   let params = {
    //     id: info.id
    //   }
    //   this.$client.GetBusRequestDetailBusManage(params)
    //     .then(res => {
    //       if (res.head.result == "200") {
    //         console.log(res)
    //         this.isShowReservedVehicleDialog = true
    //         let info = res.context
    //         info.department = info.dept_id
    //         if(!!info) {
    //           for (const key in this.$refs.reservedVehicleDialog.form) {
    //             if (Object.hasOwnProperty.call(info, key)) {
    //               this.$refs.reservedVehicleDialog.form[key] = info[key];
    //             }
    //           }
    //         }
    //         this.$refs.reservedVehicleDialog.form.bus_id = res
    //       } else {

    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //     }).catch(err => {
    //        this.$message({
    //         showClose: true,
    //         message: err.body.message,
    //         type: "error",
    //       });
    //     })
    }
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.book-meeting-table-box {
  // height: 100%;
  width: 100%;

  .book-meeting-list {
    height: 100%;
    // width: 100%;
    padding: 0 15px;
    flex-grow: 1;
    // overflow-y: scroll;

    .book-meeting-item {
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
      .book-meeting-item-top{
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
          >em{
            // color: #958D9D;
            // margin-bottom:15px;
            >p{
              color: #958D9D;
              margin-bottom:15px;
            }
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
      .book-meeting-item-bottom{
        width: 100%;
        height: 30px;
      }
    }
  }
}
</style>