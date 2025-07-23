<template>
  <div class="news-details">
    <div class="new-detail" v-loading="loading">
      <!--会议室审批详情(单) 未加标记-->
      <meeting-detail-audit
        v-if="model === 10"
        :model="model"
        :id="object_id"
      ></meeting-detail-audit>
      <!--公车借车审批详情(单)-->
      <borrow-vehicle-audit
        v-if="model === 20"
        :id="object_id"
        :model="model"
      ></borrow-vehicle-audit>
      <!--公车还车审批详情(单)-->
      <return-vehicle-audit
        v-if="model === 21"
        :id="object_id"
        :model="model"
      ></return-vehicle-audit>
      <!--发文管理(单)-->
      <send-document-audit v-if="model === 30" :model="model" :id="object_id"></send-document-audit>
      <!--收文管理(单)-->
      <receipt-document-audit
        v-if="model === 40"
        :model="model"
        :id="object_id"
      ></receipt-document-audit>
      <!--事故管理(单) 未加标记-->
      <accident-detail-audit
        v-if="model === 60"
        :model="model"
        :id="object_id"
      ></accident-detail-audit>
      <!-- 员工请（休）假审批表 5000 -->
      <leave-form-audit
        v-if="model === 5000"
        ref="leave-form-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></leave-form-audit>
      <!-- 加班单 -->
      <work-overtime-audit
        v-if="model === 5010"
        ref="work-overtime-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></work-overtime-audit>
      <!-- 出差单 -->
      <business-trip-audit
        v-if="model === 5020"
        ref="business-trip-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></business-trip-audit>
      <!-- 工作联系单 -->
      <work-contact-audit
        v-if="model === 5030"
        ref="work-contact-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></work-contact-audit>
      <!-- 月度工作信息表 -->
      <monthly-work-audit
        v-if="model === 5040"
        ref="monthly-work-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></monthly-work-audit>
      <!-- 宣传信息审批单 -->
      <promotion-information-audit
        v-if="model === 5050"
        ref="promotion-information-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></promotion-information-audit>
      <!-- 盖章审批单 -->
      <stamp-approval-audit
        v-if="model === 5060"
        ref="stamp-approval-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></stamp-approval-audit>
      <!-- 线路调整审批单 -->
      <line-adjustment-audit
        v-if="model === 5070"
        ref="line-adjustment-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></line-adjustment-audit>
      <!-- 车辆外修联系单 -->
      <vehicle-exterior-repair-audit
        v-if="model === 5080"
        ref="vehicle-exterior-repair-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></vehicle-exterior-repair-audit>
      <!-- 大额汽车配件领用审批单 -->
      <auto-parts-removed-audit
        v-if="model === 5090"
        ref="auto-parts-removed-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></auto-parts-removed-audit>
      <!-- 车辆安全技术检查汇总表 -->
      <vehicle-safe-inspect-audit
        v-if="model === 5100"
        ref="vehicle-safe-inspect-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></vehicle-safe-inspect-audit>
      <!-- 公司内部车辆调配变更审批-->
      <vehicle-transfer-change-audit
        v-if="model === 5110"
        ref="vehicle-transfer-change-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></vehicle-transfer-change-audit>
      <!-- 新招聘员工申请表 -->
      <new-hire-application-audit
        v-if="model === 5120"
        ref="new-hire-application-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></new-hire-application-audit>
      <!-- 新进职工分配表 -->
      <new-employee-allocation-audit
        v-if="model === 5130"
        ref="new-employee-allocation-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></new-employee-allocation-audit>
      <!-- 新进职工分配表 -->
      <employee-assessment-audit
        v-if="model === 5140"
        ref="employee-assessment-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></employee-assessment-audit>
      <!-- 劳动用工联系单 -->
      <employment-contact-audit
        v-if="model === 5150"
        ref="employment-contact-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></employment-contact-audit>
      <!-- 岗位聘任申请表 -->
      <appointment-application-audit
        v-if="model === 5160"
        ref="appointment-application-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></appointment-application-audit>
      <!-- 劳务派遣人员辞职报告处理单 -->
      <resignation-dispatch-audit
        v-if="model === 5170"
        ref="resignation-dispatch-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></resignation-dispatch-audit>
      <!-- 职工退休返聘申请表 -->
      <retirement-employees-audit
        v-if="model === 5180"
        ref="retirement-employees-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></retirement-employees-audit>
      <!-- 申请银行开户审批表 -->
      <bank-opening-audit
        v-if="model === 5190"
        ref="bank-opening-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></bank-opening-audit>
      <!-- 申请银行销户审批表 -->
      <bank-cancellation-audit
        v-if="model === 5200"
        ref="bank-cancellation-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></bank-cancellation-audit>
      <!-- 奖励登记表 -->
      <reward-registration-audit
        v-if="model === 5210"
        ref="reward-registration-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></reward-registration-audit>
      <!-- 考核申请 -->
      <assessment-application-audit
        v-if="model === 5220"
        ref="assessment-application-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></assessment-application-audit>
      <!-- 乘客服务工单 -->
      <server-order-audit
        v-if="model === 1490"
        ref="server-order-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></server-order-audit>
      <!-- 驾驶员请假单 -->
      <leave-driver-audit
        v-if="model === 5230"
        ref="leave-driver-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></leave-driver-audit>
      <!-- 集团经营业绩考核指标完成情况跟踪月报表 -->
      <monthly-report-assessment-indicators-audit
        v-if="model === 5240"
        ref="monthly-report-assessment-indicators-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></monthly-report-assessment-indicators-audit>
      <!-- 乘客误刷处理单 -->
      <passengers-mistakenly-audit
        v-if="model === 5250"
        ref="passengers-mistakenly-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></passengers-mistakenly-audit>
      <!-- 驾驶员星级微调审批 -->
      <star-trim-audit
        v-if="model === 5260"
        ref="star-trim-audit"
        :loading="loading"
      ></star-trim-audit>
      <!-- 驾驶员星级考核审批 -->
      <driver-star-audit
        v-if="model === 5270"
        ref="driver-star-audit"
        :loading="loading"
      ></driver-star-audit>
      <!-- 资产采购申请 -->
      <assets-purchase-audit
        v-if="model === 1280"
        ref="assets-purchase-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></assets-purchase-audit>
      <!-- 资产领用单 -->
      <assets-borrow-audit
        v-if="model === 1300"
        ref="assets-borrow-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></assets-borrow-audit>
      <!-- 民主评分 -->
      <democratic-rating-audit
        v-if="model === 7000"
        ref="democratic-rating-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></democratic-rating-audit>
      <!-- 安全隐患记录-->
      <safety-hazard-audit
        v-if="model === 7100"
        ref="safety-hazard-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></safety-hazard-audit>
      <!-- 安全隐患整改意见反馈-->
      <corrective-feedback-audit
        v-if="model === 7200"
        ref="corrective-feedback-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></corrective-feedback-audit>
      <!-- 稽查管理-->
      <inspection-management-audit
        v-if="model === 5280"
        ref="inspection-management-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></inspection-management-audit>
      <!-- 人员调动-->
      <staff-movement-audit
        v-if="model === 5290"
        ref="staff-movement-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></staff-movement-audit>
      <!-- 小额采购审批单-->
      <small-purchase-audit
        v-if="model === 6500"
        ref="small-purchase-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></small-purchase-audit>
      <!-- 车辆外修联系单-->
      <parking-vehicle-audit
        v-if="model === 6600"
        ref="parking-vehicle-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></parking-vehicle-audit>
      <!-- 合理化意见反馈表-->
      <rationalization-feedback-audit
        v-if="model === 6700"
        ref="rationalization-feedback-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></rationalization-feedback-audit>
      <!-- 施救车派工单 1650 -->
      <rescue-vehicle-dispatch-audit
        v-if="model === 1650"
        ref="rescue-vehicle-dispatch-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></rescue-vehicle-dispatch-audit>
      <!-- 大额维修申请单 1660 -->
      <major-maintenance-audit
        v-if="model === 1660"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
        ref="major-maintenance-audit"
      ></major-maintenance-audit>
      <!-- 采购订单 1040 -->
      <purchase-order-audit
        v-if="model === 1040"
        ref="purchase-order-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></purchase-order-audit>
      <!-- 车装饰维修审批单 6800 -->
      <bus-decoration-maintenance-audit
        v-if="model === 6800"
        ref="bus-decoration-maintenance-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></bus-decoration-maintenance-audit>
      <!-- 燃料考核审批单 6900 -->
      <fuel-assess-audit
        v-if="model === 6900"
        ref="fuel-assess-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></fuel-assess-audit>
      <!-- 员工工作服配置审批单 8000 -->
      <worker-clothes-configuration-audit
        v-if="model === 8000"
        ref="worker-clothes-configuration-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></worker-clothes-configuration-audit>
      <!-- 劳务用工审批单 8100 -->
      <labor-employment-approval-audit
        v-if="model === 8100"
        ref="labor-employment-approval-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></labor-employment-approval-audit>
      <!-- 聘用工及临时性用工审批单 8200 -->
      <employment-temporary-employment-audit
        v-if="model === 8200"
        ref="employment-temporary-employment-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></employment-temporary-employment-audit>
      <!-- 基层动态审批单 8300 -->
      <base-dynamic-sudit
        v-if="model === 8300"
        ref="base-dynamic-sudit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></base-dynamic-sudit>
      <!-- 禾骑行用户退押金清单 8400 -->
      <he-deposit-refund-audit
        v-if="model === 8400"
        ref="he-deposit-refund-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></he-deposit-refund-audit>
      <!-- 叮嗒租车超时费退款单 8500 -->
      <ding-overtime-refund-audit
        v-if="model === 8500"
        ref="ding-overtime-refund-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></ding-overtime-refund-audit>
      <!-- 外派培训申请表 8600 -->
      <expatriate-train-apply-audit
        v-if="model === 8600"
        ref="expatriate-train-apply-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></expatriate-train-apply-audit>
      <!-- 行车安全优秀驾驶员审批表 8700 -->
      <driving-excellent-driver-audit
        v-if="model === 8700"
        ref="driving-excellent-driver-audit"
        :step_id="subForm.step_id"
        :userId="userId"
        :loading="loading"
      ></driving-excellent-driver-audit>
      <!---                   流程                              --->
      <!-- <div v-if="boxList.includes(model) && !loading"> -->
      <div v-if="!loading && [10, 20, 21, 30, 40, 60].indexOf(this.model) == -1">
        <!-- 撤回流程 -->
        <div v-for="(item, index) in cancelStepList" :key="index + 'mm'">
          <item-box-new :title="index > 0 ? '撤回流程' : '审批流程'" v-if="cancelStepList.length">
            <!-- <h2 style="padding-bottom: 5pxcolor: #3399FE">流程{{index + 1}}</h2> -->
            <approve-schedule :flowData="item" :isCancel="true"></approve-schedule>
          </item-box-new>
        </div>
        <!-- 审批流程 -->
        <item-box-new :title="cancelStepList.length ? '撤回流程' : '审批流程'">
          <div v-if="!!allForm.flow_id && !loading">
            <approve-schedule
              ref="approveSchedule"
              style="margin-left: 10px"
              :isFlow="false"
              :flow_id="allForm.flow_id"
              @out-data="getStepData"
              @on-get="loadData"
              @on-config="onConfig"
            ></approve-schedule>
          </div>
        </item-box-new>
        <!-- 底部操作按钮 -->
        <bottom-box
          ref="bottomBox"
          :key="key"
          :model="model"
          :markInfo="markInfo"
          :markState="markState"
          :created_id="allForm.created_id"
          :user_ids="allForm.user_ids"
          :state="allForm.state"
          :flow_id="allForm.flow_id"
          @on-loading="loadData"
          @on-updateContract="UpdateContract"
          @show-approveSchedule="showApproveSchedule"
        ></bottom-box>
      </div>
    </div>

    <el-empty v-if="!modelObj[model]" description="此项详情正在开发中"></el-empty>
    <!-- 弹窗 -->
    <div>
      <!-- 撤回、退回到发起人（重新提交） -->
      <fixed-form-body
        ref="fixedFormBody"
        :formId="model"
        :formName="formName"
        :isAgain="true"
        :isCommit="isCommit"
        @on-commit="BackCommitFlowRecord"
        :dialogBool.sync="fixedFormBodyShow"
      ></fixed-form-body>
      <!-- 退回、转交 -->
      <return-forward-dialog
        :subForm="subForm"
        :returnUsers="returnUsers"
        :isReturnToOriginator="isReturnToOriginator"
        :dialogBool.sync="returnShow"
        @on-load="loadData"
        @on-opinion="opinionShow = false"
      ></return-forward-dialog>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'
import bottomBox from './pages/component/bottom-box'
import accidentDetailAudit from './pages/accident-detail-audit'
import meetingDetailAudit from './pages/meeting-detail-audit'
import sendDocumentAudit from './pages/send-document-audit'
import receiptDocumentAudit from './pages/receipt-document-audit'
import borrowVehicleAudit from './pages/borrow-vehicle-audit'
import returnVehicleAudit from './pages/return-vehicle-audit'
import workContactAudit from './pages/work-contact-audit'
import monthlyWorkAudit from './pages/monthly-work-audit'
import stampApprovalAudit from './pages/stamp-approval-audit'
import workOvertimeAudit from './pages/work-overtime-audit'
import leaveFormAudit from './pages/leave-form-audit'
import businessTripAudit from './pages/business-trip-audit'
import lineAdjustmentAudit from './pages/line-adjustment-audit'
import vehicleExteriorRepairAudit from './pages/vehicle-exterior-repair-audit'
import autoPartsRemovedAudit from './pages/auto-parts-removed-audit'
import vehicleSafeInspectAudit from './pages/vehicle-safe-inspect-audit'
import vehicleTransferChangeAudit from './pages/vehicle-transfer-change-audit'
import newHireApplicationAudit from './pages/new-hire-application-audit'
import newEmployeeAllocationAudit from './pages/new-employee-allocation-audit'
import employeeAssessmentAudit from './pages/employee-assessment-audit'
import employmentContactAudit from './pages/employment-contact-audit'
import appointmentApplicationAudit from './pages/appointment-application-audit'
import resignationDispatchAudit from './pages/resignation-dispatch-audit'
import retirementEmployeesAudit from './pages/retirement-employees-audit'
import bankOpeningAudit from './pages/bank-opening-audit'
import bankCancellationAudit from './pages/bank-cancellation-audit'
import rewardRegistrationAudit from './pages/reward-registration-audit'
import promotionInformationAudit from './pages/promotion-information-audit'
import assessmentApplicationAudit from './pages/assessment-application-audit'
import serverOrderAudit from './pages/server-order-audit'
import leaveDriverAudit from './pages/leave-driver-audit'
import monthlyReportAssessmentIndicatorsAudit from './pages/monthly-report-assessment-indicators-audit'
import assetsPurchaseAudit from './pages/assets-purchase-audit'
import assetsBorrowAudit from './pages/assets-borrow-audit'
import passengersMistakenlyAudit from './pages/passengers-mistakenly-audit'
import democraticRatingAudit from './pages/democratic-rating-audit'
import driverStarAudit from './pages/driver-star-audit'
import starTrimAudit from './pages/star-trim-audit'
import safetyHazardAudit from './pages/safety-hazard-audit'
import correctiveFeedbackAudit from './pages/corrective-feedback-audit'
import inspectionManagementAudit from './pages/inspection-management-audit'
import rescueVehicleDispatchAudit from './pages/rescue-vehicle-dispatch-audit'
import majorMaintenanceAudit from './pages/major-maintenance-audit'
import purchaseOrderAudit from './pages/purchase-order-audit'
import staffMovementAudit from './pages/staff-movement-audit'
import smallPurchaseAudit from './pages/small-purchase-audit'
import parkingVehicleAudit from './pages/parking-vehicle-audit'
import rationalizationFeedbackAudit from './pages/rationalization-feedback-audit'
import busDecorationMaintenanceAudit from './pages/bus-decoration-maintenance-audit'
import fuelAssessAudit from './pages/fuel-assess-audit'
import employmentTemporaryEmploymentAudit from './pages/employment-temporary-employment-audit'
import workerClothesConfigurationAudit from './pages/worker-clothes-configuration-audit'
import laborEmploymentApprovalAudit from './pages/labor-employment-approval-audit'
import expatriateTrainApplyAudit from './pages/expatriate-train-apply-audit'
import heDepositRefundAudit from './pages/he-deposit-refund-audit'
import dingOvertimeRefundAudit from './pages/ding-overtime-refund-audit'
import baseDynamicSudit from './pages/base-dynamic-sudit'
import drivingExcellentDriverAudit from './pages/driving-excellent-driver-audit'

// 发起审批页面
import fixedFormBody from '@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body'
// 审批流程
import approveSchedule from '@/components/approve-echo/approve-schedule2'
import itemBoxNew from './component/item-box-new'
import returnForwardDialog from './component/return-forward-dialog'

import modelObj from '@/view/main-Interface-entrance/news-core/modelObj'
export default {
  name: 'news-details',
  components: {
    // 发起审批页---------\\
    fixedFormBody,
    // ------------------\\
    // 审批流程---------\\
    approveSchedule,
    // ------------------\\
    // ------------------\\
    itemBoxNew,
    returnForwardDialog,
    bottomBox,

    meetingDetailAudit,
    sendDocumentAudit,
    receiptDocumentAudit,
    borrowVehicleAudit,
    returnVehicleAudit,
    workContactAudit,
    monthlyWorkAudit,
    stampApprovalAudit,
    workOvertimeAudit,
    leaveFormAudit,
    businessTripAudit,
    lineAdjustmentAudit,
    vehicleExteriorRepairAudit,
    autoPartsRemovedAudit,
    vehicleSafeInspectAudit,
    vehicleTransferChangeAudit,
    newHireApplicationAudit,
    newEmployeeAllocationAudit,
    employeeAssessmentAudit,
    employmentContactAudit,
    appointmentApplicationAudit,
    resignationDispatchAudit,
    retirementEmployeesAudit,
    bankOpeningAudit,
    bankCancellationAudit,
    rewardRegistrationAudit,
    promotionInformationAudit,
    assessmentApplicationAudit,
    serverOrderAudit,
    leaveDriverAudit,
    monthlyReportAssessmentIndicatorsAudit,
    assetsPurchaseAudit,
    assetsBorrowAudit,
    passengersMistakenlyAudit,
    democraticRatingAudit,
    starTrimAudit,
    driverStarAudit,
    accidentDetailAudit,
    safetyHazardAudit,
    correctiveFeedbackAudit,
    inspectionManagementAudit,
    rescueVehicleDispatchAudit,
    majorMaintenanceAudit,
    purchaseOrderAudit,
    staffMovementAudit,
    smallPurchaseAudit,
    parkingVehicleAudit,
    rationalizationFeedbackAudit,
    busDecorationMaintenanceAudit,
    fuelAssessAudit,
    employmentTemporaryEmploymentAudit,
    workerClothesConfigurationAudit,
    laborEmploymentApprovalAudit,
    expatriateTrainApplyAudit,
    heDepositRefundAudit,
    dingOvertimeRefundAudit,
    baseDynamicSudit,
    drivingExcellentDriverAudit
  },
  props: {
    isModel: {
      type: Boolean,
      default: false
    },
    modelType: [Number],
    objectId: [Number]
  },
  watch: {
    objectId() {
      this.model = this.modelType
      this.object_id = this.objectId
    },
    opinionShow() {
      if (!this.opinionShow) {
        this.subForm.remark = ''
      }
    },
    returnShow() {
      if (!this.returnShow) {
        this.subForm.object_id = ''
        this.subForm.remark = ''
      }
    }
  },
  data() {
    return {
      loading: false,
      // 消息业务类型
      model: 0,
      // 审批单名称
      formName: '',
      // 对应记录id
      object_id: 0,

      // 审批单信息
      allForm: {
        created_id: 0,
        user_ids: [],
        state: -1,
        flow_id: 0
      },
      key: null,
      subForm: {
        flow_id: '', //流程记录id
        step_id: '', //节点id
        state: '', //状态(0待处理1通过2拒绝3退回4转交)
        object_id: '', //对象id(退回节点id/转交用户id)
        remark: '' //备注
      },

      userId: '',
      opinionTitle: '审核意见',
      opinionShow: false,
      returnShow: false,
      returnUsers: [],
      cancelShow: false, // 是否可以撤回
      isReturnToOriginator: true, //是否允许退回到发起人
      isAddCheck: 0, //是否允许加签 0否  1是

      fixedFormBodyShow: false,
      formType: '',
      isCommit: false,
      markInfo: {},
      markState: 0,

      cancelStepList: [], //撤回过的流程
      // 模板分类（用来判断是否有此表单）
      modelObj: modelObj,
      objectIdMap: {
        5000: {
          key: 'leave-form-audit',
          detailApi: 'LookDetailRestManage'
        },
        5010: {
          key: 'work-overtime-audit',
          detailApi: 'LookDetailOaWorkOvertime'
        },
        5020: {
          key: 'business-trip-audit',
          detailApi: 'LookDetailTripRecord'
        },
        5030: {
          key: 'work-contact-audit',
          detailApi: 'LookDetailWorkDeal'
        },
        5040: {
          key: 'monthly-work-audit',
          detailApi: 'LookDetailOaFormNews'
        },
        5050: {
          key: 'promotion-information-audit',
          detailApi: 'LookDetailAdvertInfo'
        },
        5060: {
          key: 'stamp-approval-audit',
          detailApi: 'LookDetailSealCanCel'
        },
        5070: {
          key: 'line-adjustment-audit',
          detailApi: 'LookDetailLineAdjust'
        },
        5080: {
          key: 'vehicle-exterior-repair-audit',
          detailApi: 'LookDetailVehicleRepairContract'
        },
        5090: {
          key: 'auto-parts-removed-audit',
          detailApi: 'LookDetailVehiclePartsReceive'
        },
        5100: {
          key: 'vehicle-safe-inspect-audit',
          detailApi: 'LookDetailVehicleSafeCheck'
        },
        5110: {
          key: 'vehicle-transfer-change-audit',
          detailApi: 'GetDetailsVehicleDeploy'
        },
        5120: {
          key: 'new-hire-application-audit',
          detailApi: 'LookDetailNewRecruitPerson'
        },
        5130: {
          key: 'new-employee-allocation-audit',
          detailApi: 'LookDetailNewPersonAllocation'
        },
        5140: {
          key: 'employee-assessment-audit',
          detailApi: 'LookDetailNewPersonTryCheck'
        },
        5150: {
          key: 'employment-contact-audit',
          detailApi: 'LookDetailWorkLaborContract'
        },
        5160: {
          key: 'appointment-application-audit',
          detailApi: 'LookDetailPostAppointment'
        },
        5170: {
          key: 'resignation-dispatch-audit',
          detailApi: 'LookDetailLaborDepart'
        },
        5180: {
          key: 'retirement-employees-audit',
          detailApi: 'LookDetailEmployRetirement'
        },
        5190: {
          key: 'bank-opening-audit',
          detailApi: 'LookDetailBankOpen'
        },
        5200: {
          key: 'bank-cancellation-audit',
          detailApi: 'LookDetailBankCancle'
        },
        5210: {
          key: 'reward-registration-audit',
          detailApi: 'LookDetailRewardRegistration'
        },
        5220: {
          key: 'assessment-application-audit',
          detailApi: 'GetAssessRecordDetail'
        },
        5250: {
          key: 'passengers-mistakenly-audit',
          detailApi: 'LookDetailMistakeHandle'
        },
        1490: {
          key: 'server-order-audit',
          detailApi: 'listPassengerServiceNew'
        },
        5230: {
          key: 'leave-driver-audit',
          detailApi: 'DriverLookDetail'
        },
        5240: {
          key: 'monthly-report-assessment-indicators-audit',
          detailApi: 'GetDetailCheckCompletedReport'
        },
        5260: {
          key: 'star-trim-audit',
          detailApi: 'GetDetailDriverStarAdjust'
        },
        5270: {
          key: 'driver-star-audit',
          detailApi: 'LookDetailDriverStar'
        },
        5290: {
          key: 'staff-movement-audit',
          detailApi: 'LookDetailOaPersonTransfer'
        },
        6500: {
          key: 'small-purchase-audit',
          detailApi: 'GetDetailSmallPurchase'
        },
        6600: {
          key: 'parking-vehicle-audit',
          detailApi: 'GetDetailStopVehicle'
        },
        6700: {
          key: 'rationalization-feedback-audit',
          detailApi: 'GetDetailCustomSuggestion'
        },
        1280: {
          key: 'assets-purchase-audit',
          detailApi: 'LookDetailPurchase'
        },
        1300: {
          key: 'assets-borrow-audit',
          detailApi: 'LookDetailErpReceive'
        },
        7000: {
          key: 'democratic-rating-audit',
          detailApi: 'GetAuthorizationDetail'
        },
        7100: {
          key: 'safety-hazard-audit',
          detailApi: 'GetDetailHiddenDanger'
        },
        7200: {
          key: 'corrective-feedback-audit',
          detailApi: 'GetDetailHiddenDangerFeedBack'
        },
        5280: {
          key: 'inspection-management-audit',
          detailApi: 'LookDetailInspectManage'
        },
        1650: {
          key: 'rescue-vehicle-dispatch-audit',
          detailApi: 'GetDetailsRescueVehicle'
        },
        1660: {
          key: 'major-maintenance-audit',
          detailApi: 'GetDetailsLimitRepairOrder'
        },
        1040: {
          key: 'purchase-order-audit',
          detailApi: 'LookDetailPurchaseOrder'
        },
        6800: {
          key: 'bus-decoration-maintenance-audit',
          detailApi: 'GetCompanyBusDecorate'
        },
        6900: {
          key: 'fuel-assess-audit',
          detailApi: 'GetDetailFuelAssess'
        },
        8000: {
          key: 'worker-clothes-configuration-audit',
          detailApi: 'GetDetailEmployeeWearSetting'
        },
        8100: {
          key: 'labor-employment-approval-audit',
          detailApi: 'GetDetailLaborService'
        },
        8200: {
          key: 'employment-temporary-employment-audit',
          detailApi: 'GetDetailOutsourcing'
        },
        8300: {
          key: 'base-dynamic-sudit',
          detailApi: 'LookDetailErpGrassrootsDynamics'
        },
        8400: {
          key: 'he-deposit-refund-audit',
          detailApi: 'GetDetailHeBicycle'
        },
        8500: {
          key: 'ding-overtime-refund-audit',
          detailApi: 'GetDetailDingDaCar'
        },
        8600: {
          key: 'expatriate-train-apply-audit',
          detailApi: 'GetDetailOverseasTraining'
        },
        8700: {
          key: 'driving-excellent-driver-audit',
          detailApi: 'GetDetailOaDriverSafety'
        }
      },

      formKey: '',
      formDetailApi: ''
    }
  },
  mounted() {
    this.userId = Number(JSON.parse(getUser()).user_id)
    this.$nextTick(() => {
      if (this.isModel) {
        this.model = this.modelType
        this.object_id = this.objectId
      } else {
        // console.log('---------------------', this.$route)
        const { model, title, id } = this.$route.params
        this.model = Number(model) || 0

        if (title.indexOf('待办事项:') !== -1) {
          this.formName = title.substr(5)
        }

        let objectId = id
        if (this.isSpecialId(objectId)) {
          // 特殊标识 ^& 表示需要拆分处理
          this.object_id = objectId.slice(0, -2).split(',')
        } else {
          this.object_id = Number(id)
        }
      }

      if (this.objectIdMap[this.model]) {
        const { key, detailApi } = this.objectIdMap[this.model]
        this.formKey = key
        this.formDetailApi = detailApi
      }

      const boxList = [10, 20, 21, 30, 40, 60]
      const isBoxModel = boxList.indexOf(this.model) === -1
      if (this.object_id && isBoxModel) {
        this.loadData()
      }
    })
  },
  methods: {
    // 提取判断逻辑
    isSpecialId(id) {
      return id.substr(id.length - 2, 2) === '^&'
    },
    // 获取审批单详情
    loadData() {
      this.loading = true
      let params = this.model === 5270 ? { flow_id: this.object_id } : { id: this.object_id }

      this.$client[this.formDetailApi](params).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          let context = ''
          // 非发起审批页面的审批单 特殊处理
          if ([1490].indexOf(this.model) != -1) {
            context = res.context.list[0]
          } else {
            context = res.context
          }
          this.$refs[this.formKey].formData = Object.assign({}, context)
          this.allForm = Object.assign({}, context)
          // console.log('=-=======', this.allForm)
          this.subForm.flow_id = context.flow_id
          this.$nextTick(() => {
            this.key = new Date().getTime()
          })

          // 需要特殊处理的页面
          if ([5220, 5250, 7100].indexOf(this.model) != -1) {
            this.$nextTick(() => {
              this.$refs[this.formKey].initData(context)
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: res.head.describle,
            showClose: true
          })
        }
        eventOn.$emit('update-upcoming-matter')
      })
    },
    // 获取节点数据
    getStepData(data, info, list) {
      this.markInfo = info
      this.markState = info.state ? info.state : 0
      this.cancelStepList = list.length ? JSON.parse(JSON.stringify(list)) : []
      try {
        if (this.userId === data[0].users[0].id) {
          this.cancelShow = true
        }
        if (data[data.length - 1].state === 8) {
          this.cancelShow = false
        }
      } catch (e) {}
      let isFirst = true
      if (data && !!data.length) {
        this.subForm.step_id = null
        data.forEach((item, index) => {
          if (isFirst && item.state === 1) {
            this.subForm.step_id = item.id
            isFirst = false
          }
          if (index == 0 && item.oper_type == 4) {
            this.isAddCheck = item.is_add_check
          }
          if (index == 0 && item.oper_type == 4) {
            this.isReturnToOriginator = item.return_back == 0 ? false : true
          }
          if (this.allForm.state == 0 && item.state === 10) {
            this.subForm.step_id = item.id
          }
        })
        this.$refs.bottomBox.getStepData(this.subForm.step_id, this.isAddCheck)
      }
      this.reqReturnStepData()
    },
    // 获取节点数据
    reqReturnStepData() {
      if (!!this.subForm.flow_id && !!this.subForm.step_id) {
        let params = {
          flow_id: this.subForm.flow_id,
          step_id: this.subForm.step_id
        }
        this.$client.GetBackStepFlowRecord(params).then(res => {
          if (res.head.result == '200') {
            let retureList = res.context ? res.context : []
            this.buildReturnStep(retureList)
          } else {
            this.$message({
              type: 'error',
              message: res.head.describle,
              showClose: true
            })
          }
        })
      }
    },
    // 构建转交节点
    buildReturnStep(data) {
      this.returnUsers = []
      if (data && !!data.length) {
        data.forEach((item, index) => {
          let obj = {
            seq: item.id,
            title: item.title
          }
          this.returnUsers.push(obj)
        })
      }
      // 如果允许退回到发起人
      if (this.isReturnToOriginator) {
        this.returnUsers.unshift({
          seq: 0,
          title: '退回到发起人'
        })
      }
    },
    // 0待处理1通过2拒绝3退回4转交5其他人处理6撤销7加签
    handleCommand(command) {
      // 3退回, 4转交, 5,加签
      this.subForm.state = command
      if (command == 5) {
        // 打开加签弹窗
        this.$refs.approveSchedule.countersignDialogVisible = true
        return
      }
      // console.log(this.subForm.state,this.returnUsers)
      if (this.subForm.state == 3 && !this.returnUsers.length) {
        this.$message({ message: '没有审核成功退回节点,不能退回!', type: 'warning' })
        return
      }
      this.returnShow = true
    },
    // 转交、退回
    returnOk() {
      this.suerSubmitInfo()
    },
    // 打开评论弹窗
    openCommentDialog() {
      this.$refs.approveSchedule.commentDialogVisible = true
    },
    //  打开催办弹窗
    openUrgeDialog() {
      this.$refs.approveSchedule.urgeDialogVisible = true
    },
    // 确定提交
    suerSubmitInfo() {
      let info = this.$outFormData(this.subForm)
      this.$client.checkFlowRecord({ context: info }).then(req => {
        setTimeout(() => {
          this.loadData()
        }, 100)
        if (req.head.result === '200') {
          if (this.subForm.state === 1 || this.subForm.state === 2) {
            this.opinionShow = false
          } else {
            this.returnShow = false
          }
          this.$message({
            message: req.head.describle,
            type: 'success'
          })
        } else {
          this.$message.error(req.head.describle)
        }
      })
    },
    // 回显审批单
    UpdateContract(state) {
      // 暂不支持
      if ([5220, 5240, 8300].indexOf(this.model) > -1) {
        this.$message({
          showClose: true,
          message: '该审批单暂不支持',
          type: 'error'
        })
        return
      }
      this.isCommit = state
      this.fixedFormBodyShow = true
      let info = Object.assign({}, this.$refs[this.formKey].formData)
      if (!state) {
        info.id = 0
      }

      this.$refs.fixedFormBody.setData(info)
      // console.log(info, '更新审批单')
    },
    // 更新审批单后提交流程
    // 退回至发起人的 重新提交
    BackCommitFlowRecord() {
      let info = {
        flow_id: this.subForm.flow_id,
        step_id: this.subForm.step_id
      }
      this.$client.BackCommitFlowRecord({ context: info }).then(req => {
        if (req.head.result === '200') {
          this.fixedFormBodyShow = false
          this.$message({
            message: req.head.describle,
            type: 'success'
          })
        } else {
          this.$message.error(req.head.describle)
        }
        setTimeout(() => {
          this.loadData()
        }, 100)
      })
    },
    // 打开流程相关弹窗
    showApproveSchedule(type, command) {
      switch (type) {
        case 'command':
          this.handleCommand(command)
          break
        case 'commentDialogVisible':
          this.openCommentDialog()
          break
        case 'urgeDialogVisible':
          this.openUrgeDialog()
          break
        default:
          break
      }
    },
    // 获取流程配置信息(已发起后使用)
    onConfig(info) {
      this.$refs.bottomBox.configInfo = info
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.news-details {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  background: #f0f2f5;
  .new-detail {
    width: 915px;
    height: calc(100% - 72px);
    overflow: auto;
    position: relative;
  }
}
</style>
