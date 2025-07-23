<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="1030px"
    append-to-body
  >
    <el-form
      :model="form"
      :rules="basicRules"
      ref="form"
      size="mini"
      label-suffix=":"
      label-position="right"
      label-width="130px"
      class="form-box"
      v-loading="dialogLoading"
    >
      <el-row :gutter="20" id="information">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">工单信息</p>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单所属" prop="order_affiliation">
            <el-select
              v-model="form.order_affiliation"
              placeholder="请选择工单所属"
              clearable
              :disabled="!(curSelectedType == 'add' || infoType == 'draft')"
              @change="changeAffiliation()"
            >
              <el-option label="公交车" :value="1"></el-option>
              <el-option label="自行车" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="信息来源" prop="message_sources">
            <tr-select-dictionaries
              v-model="form.message_sources"
              :classKey="'乘客服务信息来源'"
              :placeholder="'请选择信息来源'"
              :isShowDefaultValue="true"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              @change="updateFlow()"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="工单类型" prop="order_type">
            <tr-select-dictionaries
              :key="form.order_affiliation"
              v-model="form.order_type"
              :classKey="'乘客服务工单类型'"
              :placeholder="'请选择工单类型'"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              @change="updateFlow()"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="工单类型" prop="order_type">
            <tr-select-dictionaries
              :key="form.order_affiliation"
              v-model="form.order_type"
              :classKey="'乘客服务工单类型自行车'"
              :placeholder="'请选择工单类型'"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              @change="updateFlow()"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事发时间" prop="call_time">
            <el-date-picker
              v-model="form.call_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 180px"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              placeholder="请选择事发时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item
            label="责任部门"
            prop="duty_departments"
            v-if="curSelectedType == 'add' || (curSelectedType == 'edit' && form.order_state == 1)"
          >
            <el-select
              v-model="form.duty_departments"
              style="width: 100%"
              placeholder="请选择责任部门"
              filterable
              clearable
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in responsibleList"
                :key="item.dept_id"
                :label="item.dept_name"
                :value="item.dept_id"
              ></el-option>
            </el-select>
            <!-- <get-department-select
              ref="personalTree"
              v-model="form.duty_departments"
              :isShowCheckbox="true"
              :placeholder="'请选择责任部门'"
              :isContainEmp="false"
              :show_all="true"
              :isExportMultiple="true"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></get-department-select> -->
          </el-form-item>
          <el-form-item label="责任部门" prop="duty_department" v-else>
            <el-select
              v-model="form.duty_department"
              style="width: 100%"
              placeholder="请选择责任部门"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              filterable
              clearable
              @change="updateFlow()"
            >
              <el-option
                v-for="item in responsibleList"
                :key="item.dept_id"
                :label="item.dept_name"
                :value="item.dept_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="责任部门经办人" prop="duty_person ">
            <el-select
              v-model="form.duty_person "
              style="width: 100%"
              placeholder="请选择责任部门经办人"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              filterable 
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="反映人姓名" prop="call_name">
            <el-input
              placeholder="请输入反映人姓名"
              v-model="form.call_name"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="反映人电话" prop="call_number">
            <el-input
              placeholder="请输入反映人电话"
              v-model="form.call_number"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="身份证号" prop="id_card">
            <el-input
              placeholder="请输入身份证号"
              v-model="form.id_card"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="form.sex"
              placeholder="请选择性别"
              clearable
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            >
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="卡号" prop="card_no">
            <el-input
              placeholder="请输入卡号"
              v-model="form.card_no"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="自行车号" prop="bicycle_number">
            <el-input
              placeholder="请输入自行车号"
              v-model="form.bicycle_number"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="事发地点" prop="address">
            <el-input
              v-model="form.address"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              placeholder="请输入事发地点"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="信访编号" prop="letter_code">
            <el-input
              v-model="form.letter_code"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              placeholder="请输入信访编号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="初重件">
            <el-select
              v-model="form.weight_degree"
              placeholder="请选择初重件"
              clearable
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            >
              <el-option label="初件" :value="1"></el-option>
              <el-option label="重件" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.weight_degree == 2">
          <el-form-item label="关联工单">
            <el-input
              style="width: 100%"
              v-model="order_code"
              placeholder="请选择关联工单"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              @focus="openHistoricalWorkOrders"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="curSelectedType == 'edit' || curSelectedType == 'add'">
          <el-form-item label="事件简述常用语">
            <el-select
              v-model="wordIds"
              @change="getWordsList"
              filterable
              multiple
              collapse-tags
              placeholder="请选择"
              style="width: 100%"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in commonWordsList"
                :key="item.id"
                :label="item.language"
                :value="item.language"
              >
                <span
                  style="float: left; max-width: 100%; overflow: hidden; text-overflow: ellipsis"
                >
                  {{ item.language }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事件简述" prop="order_content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入事件简述"
              v-model="form.order_content"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="受理人员" prop="acceptance_person">
            <get-department-select
              ref="personalTree"
              v-model="form.acceptance_person"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择受理人员'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受理时间" prop="acceptance_time">
            <el-date-picker
              v-model="form.acceptance_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 100%"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              placeholder="请选择受理时间"
              @change="changeTimeOut()"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" label-width="0px" prop="is_reply">
            <el-checkbox
              v-model="form.is_reply"
              :true-label="1"
              :false-label="2"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            >
              是否需要回复
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="超时级别">
            <el-select
              v-model="form.time_out"
              style="width: 100%"
              placeholder="请选择超时级别"
              @change="changeTimeOut()"
              clearable
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
            >
              <el-option
                v-for="item in timeoutLevel"
                :key="item.id"
                :label="item.time_out_level"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规定回复逾期时间" prop="overdue_time">
            <el-date-picker
              v-model="form.overdue_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 100%"
              :disabled="curSelectedType === 'detail' || curSelectedType === 'handle'"
              placeholder="请选择规定回复逾期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="1" class="files-box">
          <image-file-upload
            :images="form.img_list"
            :files="form.files_list"
            :isPreview="false"
            :isShowBox="curSelectedType === 'detail' || curSelectedType === 'handle' ? false : true"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>

      <el-row
        :gutter="20"
        id="handle"
        v-if="
          (curSelectedType == 'handle' ||
            curSelectedType == 'detail' ||
            curSelectedState == 3 ||
            (curSelectedType == 'edit' && curSelectedState != 1)) &&
          form.order_affiliation == 1
        "
      >
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">处理情况</p>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="车牌号" prop="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车牌号'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              :isExportMultiple="false"
              :width="'150px'"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
              @on-change="onSelectChange"
            ></get-vehicle-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="线路" prop="line_id">
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="false"
              v-model="form.line_id"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
              :isExportMultiple="false"
            ></get-line-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="驾驶员" prop="driver_id">
            <get-driver-select-tree
              ref="driverTree"
              v-model="form.driver_id"
              :isShowCheckbox="false"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
              :placeholder="'请选择驾驶员'"
              :isExportMultiple="false"
            ></get-driver-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有责">
            <get-select-dictionaries
              v-model="form.is_duty"
              :classKey="'乘客服务是否有责'"
              :placeholder="'请选择是否有责'"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
              @change="changeDuty"
            ></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="奖罚依据" prop="violation_according">
            <el-input
              style="width: 100%"
              v-model="form.violation_according"
              placeholder="请选择奖罚依据"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
              @focus="openViolationInspectPop"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="违规类型" prop="violation_type">
            <el-input v-model="form.violation_type" disabled size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加/减分" prop="score">
            <el-input-number
              v-model="form.score"
              style="width: 100%"
              :controls="false"
              :precision="2"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
              size="mini"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="调查及处理结果描述" prop="handle_result">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入调查及处理结果描述"
              v-model="form.handle_result"
              :disabled="curSelectedType === 'detail' || curSelectedState != 3"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="curSelectedType === 'detail'">
          <el-form-item label="处理人" prop="handle_emp_name">
            <el-input v-model="form.handle_emp_name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="curSelectedType === 'detail'">
          <el-form-item label="处理时间" prop="handle_time">
            <el-input v-model="form.handle_time" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" id="reply">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">回复情况</p>
        </el-col>
        <el-col :span="8" v-if="curSelectedType === 'detail'">
          <el-form-item label="回复人" prop="apply_person">
            <get-department-select
              ref="handlePersonalTree"
              v-model="form.apply_person"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择回复人'"
              :isContainEmp="true"
              :disabled="curSelectedType === 'detail' || curSelectedState == 2"
              :isExportMultiple="false"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="curSelectedType === 'detail'">
          <el-form-item label="实际回复时间" prop="actual_time">
            <el-date-picker
              v-model="form.actual_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 180px"
              :disabled="curSelectedType === 'detail' || curSelectedState == 2"
              placeholder="请选择实际回复时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.order_affiliation == 2">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入备注"
              v-model="form.remark"
              :disabled="
                curSelectedType === 'detail' ||
                (curSelectedType === 'handle' && curSelectedState == 2)
              "
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工单回复(办理结果)" prop="order_reply">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入工单回复(办理结果)"
              v-model="form.order_reply"
              :disabled="curSelectedType === 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="1" class="files-box">
          <image-file-upload
            :images="form.apply_img_list"
            :files="form.apply_files_list"
            :isPreview="false"
            :isShowBox="
              curSelectedType === 'detail' ||
              (curSelectedType === 'handle' && curSelectedState == 2)
                ? false
                : true
            "
            @files-update-success="applyFilesUpdateSuccess"
            @images-update-success="applyImagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="curSelectedType === 'edit' && form.order_state != 1">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">处理流程</p>
        </el-col>
        <el-col :span="24">
          <el-checkbox v-model="form.checked">发起处理流程:</el-checkbox>
          <approve-step
            v-if="form.checked"
            ref="approveStep"
            :showTitle="false"
            @on-users="setUsers"
            :form_data="form"
            :object_id="1490"
          ></approve-step>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="curSelectedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button
        type="primary"
        v-if="
          curSelectedType == 'add' ||
          (curSelectedType == 'edit' &&
            (form.duty_department ||
              (form.order_state == 1 && form.duty_departments.length > 0))) ||
          form.order_state == 3 ||
          form.order_affiliation == 2
        "
        @click="saveFormData(4)"
      >
        完结
      </el-button>
      <el-button
        type="primary"
        v-if="curSelectedType == 'handle' && form.order_state == 2"
        @click="saveFormData(5)"
      >
        驳回
      </el-button>
      <el-button
        type="primary"
        v-if="curSelectedType == 'handle' && form.order_state == 2"
        @click="saveFormData(3)"
      >
        受理
      </el-button>
      <el-button
        type="primary"
        v-if="!form.order_state || (curSelectedType == 'edit' && form.order_state == 1)"
        @click="saveFormData(1)"
      >
        保存草稿
      </el-button>
      <!-- 责任部门 才能下发 -->
      <!-- 公交车才能下发  -->
      <el-button
        type="primary"
        v-if="
          ((curSelectedType == 'add' && form.duty_departments.length > 0) ||
            (curSelectedType == 'edit' &&
              (form.duty_department ||
                (form.order_state == 1 && form.duty_departments.length > 0))) ||
            isCanDistribute) &&
          form.order_affiliation == 1
        "
        @click="saveFormData(2)"
      >
        下发
      </el-button>
      <el-button
        type="primary"
        v-if="
          (curSelectedType == 'edit' && form.order_state && infoType != 'draft') ||
          (curSelectedType == 'handle' && form.order_state == 3)
        "
        @click="saveFormData(6)"
      >
        {{ form.checked ? '发起审批流程' : '保存' }}
      </el-button>
    </div>

    <div>
      <violation-inspect-pop
        ref="violationInspectPop"
        :dialogBool.sync="violationInspectPopShow"
        :dutyType="form.is_duty"
        @save-add="saveAddViolationInspect"
      ></violation-inspect-pop>
    </div>
  </el-dialog>
</template>

<script>
import { getUser } from '@/utils/auth'
import { deepCopy, formatDate, TimestampToDate } from '@/utils/index'
import imageFileUpload from '@/components/imageFileUpload/index'
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import violationInspectPop from './violation-inspect-pop'
import approveStep from '@/components/approve-echo/approve-step2'
export default {
  components: {
    imageFileUpload,
    getLineSelectTree,
    getDriverSelectTree,
    getVehicleSelectTree,
    getDepartmentSelect,
    getSelectDictionaries,
    violationInspectPop,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    dialogLoading: Boolean,
    title: {
      type: String,
      default: '添加工单信息'
    },
    curSelectedType: [String],
    curSelectedState: [Number],
    isCommit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id: null,
        duty_person: '',
        order_affiliation: 1,
        message_sources: '',
        order_type: '',
        call_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        duty_departments: [],
        duty_department: '',
        call_name: '',
        call_number: '',
        id_card: '',
        sex: '',
        card_no: '',
        bicycle_number: '',
        vehicle_id: '',
        line_id: '',
        driver_id: '',
        address: '',
        letter_code: '',
        weight_degree: '',
        order_id: '',
        order_content: '',
        acceptance_person: Number(JSON.parse(getUser()).user_id),
        acceptance_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        is_reply: 2,
        time_out: '',
        overdue_time: '',
        img_list: [],
        files_list: [],
        is_duty: '',
        violation_according: '',
        violation_accordings: [],
        violation_type: '',
        score: '',
        handle_person: '',
        handle_result: '',
        apply_person: '',
        actual_time: '',
        order_reply: '',
        handle_time: '',
        handle_emp_name: '',
        order_state: '',
        remark: '',
        apply_img_list: [], //上传的图片地址
        apply_files_list: [], //上传的文件地址
        checked: false
      },
      order_code: '',
      form_data: {
        id: null
      },
      basicRules: {
        order_affiliation: [
          {
            required: true,
            message: '请选择工单所属',
            trigger: 'change'
          }
        ],
        order_type: [
          {
            required: true,
            message: '请选择工单类型',
            trigger: 'change'
          }
        ],
        message_sources: [
          {
            required: true,
            message: '请选择信息来源',
            trigger: 'change'
          }
        ],
        call_time: [
          {
            required: true,
            message: '请选择事发时间',
            trigger: 'change'
          }
        ],
        duty_departments: [
          {
            required: true,
            message: '请选择责任部门',
            trigger: 'change'
          }
        ]
      },
      key: null,
      userId: Number(JSON.parse(getUser()).user_id),
      timeoutLevel: [],
      violationInspectPopShow: false,
      historicalWorkOrdersShow: false,
      userList: [],
      isDutyName: '',
      commonWordsList: [],
      wordIds: [],
      responsibleList: [],
      nodes: null,
      // 是否能下发  只要改了责任部门  就能下发
      isCanDistribute: false,

      infoType: null,
      isEcho: false
    }
  },
  // watch: {
  //   dialogBool(bool) {
  //     if(bool) {
  //     }else {
  //       Object.assign(this.$data, this.$options.data());
  //     }
  //   }
  // },
  mounted() {
    this.GetTimeOutRules()
    this.GetListCommonPhrase()
    this.GetPassengerDeptDuty()
  },
  methods: {
    // 数据回显
    setData(data, type) {
      let info = deepCopy(data)
      for (let key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }
      this.form.duty_departments = this.form.duty_departments || []
      // if (type == 'add' || type == 'edit') {
      //   this.form.duty_departments = this.form.duty_department ? [this.form.duty_department] : []
      // }
      // 草稿状态
      if (type == 'edit' && info.order_state == 1) {
        this.infoType = 'draft'
      } else {
        this.infoType = null
      }
      // 复制 清除 处理结果
      if (type == 'copy') {
        this.form.id = null
        this.form.order_state = ''
        this.form.vehicle_id = ''
        this.form.line_id = ''
        this.form.driver_id = ''
        this.form.is_duty = ''
        this.form.violation_according = ''
        this.form.violation_type = ''
        this.form.score = ''
        this.form.handle_result = ''
        this.form.handle_emp_name = ''
        this.form.handle_time = ''
      }
      if (this.form.order_affiliation == 2) {
        this.$refs.form.clearValidate('duty_department')
      }

      if (this.form.overdue_time) {
        this.isEcho = true
      }
    },
    // 定位
    positioning(name) {
      document.querySelector(`#${name}`).scrollIntoView()
    },
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    // 获取常用语
    GetListCommonPhrase() {
      let params = {
        context: {
          page_index: 1,
          page_size: 999,
          buttons: [5],
          is_enable: 1
        }
      }
      this.wordIds = []
      this.$client.GetListCommonPhrase(params).then(res => {
        if (res.head.result == '200') {
          this.commonWordsList = res.context.list
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 获取常用语列表
    getWordsList(list) {
      let info = ''
      list.forEach(item => {
        info += item
      })
      this.form.order_content += info
      this.wordIds = []
    },
    // 保存
    saveFormData(type) {
      // 草稿直接保存  不走校验
      if (type == 1) {
        let params = {
          form_data: Object.assign({}, this.form),
          step_data: null
        }
        params.form_data.order_state = type
        this.$emit('save-add-edit', params, type)
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            // 完结的时候  直接赋值
            if (type == 4) {
              this.form.apply_person = Number(JSON.parse(getUser()).user_id)
              this.form.actual_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }

            let params = {
              form_data: Object.assign({}, this.form),
              step_data: null
            }
            // 保存时 不修改状态
            if (type == 6) {
              if (params.form_data.checked) {
                params.step_data = this.nodes
              } else {
                params.step_data = null
              }
            } else {
              params.form_data.order_state = type
            }

            // 当 是否有责   不是无责的时候     驾驶员必选
            if (this.isDutyName && this.isDutyName != '无责') {
              if (!this.form.driver_id) {
                this.$message({
                  showClose: true,
                  message: `${this.isDutyName}时，请选择驾驶员`,
                  type: 'warning'
                })
                return
              }
            }

            // 驳回的时候  要提示 并校验 工单回复必填
            if (type == 5) {
              if (!params.form_data.order_reply) {
                this.$message({
                  showClose: true,
                  message: '驳回时请填写工单回复(办理结果)',
                  type: 'warning'
                })
                return
              }
              this.$confirm('此操作将驳回该工单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.$emit('save-add-edit', params, type)
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消驳回'
                  })
                })
            } else {
              this.$emit('save-add-edit', params, type)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    // 修改超时级别
    changeTimeOut() {
      if (this.isEcho) {
        this.isEcho = false
        return
      }
      let day = ''
      this.timeoutLevel.forEach(item => {
        if (item.id == this.form.time_out) {
          day = item.time_out_time
        }
      })
      // let timeValue = Number(day) * 24 * 60 * 60 * 1000
      // if (this.form.acceptance_time) {
      //   let time = new Date(this.form.acceptance_time).getTime() + timeValue
      //   this.form.overdue_time = formatDate(new Date(TimestampToDate(time)), 'yyyy-MM-dd hh:mm:ss')
      // }

      if (this.form.acceptance_time) {
        // 时分秒
        let hms = this.form.acceptance_time.split(' ')[1]
        let date = formatDate(new Date(this.form.acceptance_time), 'yyyy-MM-dd')
        this.GetRestAndHolidays(date, day, hms)
      }
    },
    // 获取节假日休息日
    GetRestAndHolidays(date, day, hms) {
      this.$client
        .GetRestAndHolidays({ date })
        .then(res => {
          let list = res
          // 没有添加放假日期    手动添加 让后端加
          if (list.length == 0) {
            let timeValue = Number(day) * 24 * 60 * 60 * 1000
            let time = new Date(this.form.acceptance_time).getTime() + timeValue
            this.form.overdue_time = formatDate(
              new Date(TimestampToDate(time)),
              'yyyy-MM-dd hh:mm:ss'
            )
          } else {
            let checkDate = this.getOverTime(date, list, day, 0)
            this.form.overdue_time = checkDate + ' ' + hms
          }
        })
        .catch(err => {})
    },
    // 计算 逾期时间
    getOverTime(date, list, day, num = 0) {
      // 当次数和级别天数一致 返回日期
      if (day == num) {
        return date
      }
      let time = new Date(date).getTime() + 24 * 60 * 60 * 1000
      let newDate = formatDate(new Date(TimestampToDate(time)), 'yyyy-MM-dd')
      // 放假日期中不包含 当天 则天数 + 1
      if (!list.includes(newDate)) {
        num++
      }
      return this.getOverTime(newDate, list, day, num)
    },
    // 获取超时级别
    GetTimeOutRules() {
      this.$client
        .GetTimeOutRules({})
        .then(res => {
          if (res.head.result == '200') {
            this.timeoutLevel = res.context
            this.timeoutLevel.forEach(item => {
              if (item.is_default == 1) {
                this.form.time_out = item.id
                this.changeTimeOut()
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {})
    },
    // 打开历史表单
    openHistoricalWorkOrders() {
      this.historicalWorkOrdersShow = true
      this.$nextTick(() => {
        this.$refs.historicalWorkOrders.form.call_phone = this.form.call_number
      })
    },
    saveAddHistoricalWorkOrders(row) {
      this.form.order_id = row.map(item => item.id).toString()
      this.order_code = row.map(item => item.order_code).toString()
    },
    // 打开违规项目稽查
    openViolationInspectPop() {
      this.violationInspectPopShow = true
      setTimeout(() => {
        if (!!this.form.epbs_detail && !!this.form.epbs_detail.length) {
          this.$refs.violationInspectPop.oldSelectedProjectIds = this.epbs
        }
      }, 60)
    },
    // 保存奖罚依据
    saveAddViolationInspect(selectedIds, list) {
      this.form.score = ''
      this.form.violation_according = ''
      let violation_type = []
      this.form.violation_accordings = selectedIds
      if (list.length) {
        list.forEach(element => {
          this.form.violation_according = this.form.violation_according + element.c_name + ','
          this.form.score = Number(this.form.score) + Number(element.n_score)
          if (element.type_name) {
            violation_type.push(element.type_name)
          }
        })
      }
      // // 有责减分加倍
      // if(this.form.is_duty === 1) {
      //   this.form.score = Number(this.form.score) * 2
      // }
      this.form.violation_type = violation_type.toString()
      // this.form.epbs_names = this.form.epbs_names.substring(0, (this.form.epbs_names.length - 1))
      this.violationInspectPopShow = false
    },
    // 上传图片
    imagesUpdateSuccess(imageList) {
      this.form.img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传图片
    applyImagesUpdateSuccess(imageList) {
      this.form.apply_img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传文件
    applyFilesUpdateSuccess(filesList) {
      this.form.apply_files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])
      } else {
        this.form.line_id = ''
      }
    },
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id
      }
      this.$client
        .getVehicleRelationInfo(params)
        .then(res => {
          if (res.head.result == '200') {
            let relationInfo = res.context
            if (!!relationInfo.line && relationInfo.line.length > 0) {
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              this.form.line_id = relationInfo.line[0].i_id
            } else {
              this.form.line_id = ''
              setTimeout(() => {
                this.$refs.lineTree.onClear()
              }, 60)
            }
          } else {
            this.$message({
              type: 'error',
              message: res.head.describle,
              showClose: true
            })
          }
        })
        .catch(err => {})
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 获取 责任部门列表
    GetPassengerDeptDuty() {
      this.$client.GetPassengerDeptDuty({}).then(res => {
        if (res.head.result == '200') {
          this.responsibleList = res.context
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 修改是否有责
    changeDuty(info) {
      this.isDutyName = info.c_name
    },
    // 修改 工单所属
    changeAffiliation() {
      this.form.order_type = ''
      this.updateFlow()
    },
    // 更新流程
    updateFlow() {
      if (this.form.checked) {
        this.$refs.approveStep.loadData()
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.form-box{
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px;
}
</style>
