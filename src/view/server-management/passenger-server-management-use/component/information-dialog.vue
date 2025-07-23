<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="1030px">
    <el-form :model="form" :rules="basicRules" ref="form" size="mini" label-suffix=":" label-position="right" label-width="130px" class="form-box">
      <el-row>
        <el-col :span="24">
          <div class="title">工单信息</div>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单所属" prop="order_affiliation">
            <el-select 
              v-model="form.order_affiliation" 
              @change="changeAffiliation()" 
              :disabled="!['add'].includes(curSelectedType)"
              placeholder="请选择工单所属" clearable>
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
              @change="updateFlow()"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="工单类型" prop="order_type">
            <tr-select-dictionaries
              v-model="form.order_type"
              :classKey="'乘客服务工单类型'"
              :placeholder="'请选择工单类型'"
              @change="updateFlow()"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2"> 
          <el-form-item label="工单类型" prop="order_type">
            <tr-select-dictionaries
              v-model="form.order_type"
              :classKey="'乘客服务工单类型自行车'"
              :placeholder="'请选择工单类型'"
              @change="updateFlow()"
              :disabled="curSelectedType === 'detail'"
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
              placeholder="请选择事发时间"
              style="width: 192px"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="责任部门" v-if="['add', 'copy'].includes(curSelectedType) || (curSelectedType === 'edit' && form.order_state === 1)" prop="duty_departments">
            <el-select
              v-model="form.duty_departments" 
              placeholder="请选择责任部门" 
              filterable 
              clearable 
              multiple 
              collapse-tags
              :no-data-text="'暂无数据'">
              <el-option
                v-for="item in responsibleList"
                :key="item.dept_id"
                :label="item.dept_name"
                :value="item.dept_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任部门" prop="duty_department" v-else>
            <el-select
              v-model="form.duty_department"
              @change="(val) => { 
                updateFlow()
                // 同步更新多选值：如果有值则设置为数组，否则清空
                form.duty_departments = val ? [val] : []
              }" 
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)" placeholder="请选择责任部门" filterable clearable>
              <el-option
                v-for="item in responsibleList"
                :key="item.dept_id"
                :label="item.dept_name"
                :value="item.dept_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="车队" prop="team_departments" 
          v-if="['add', 'copy'].includes(curSelectedType) || (curSelectedType === 'edit' && form.order_state === 1)">
            <el-select
              v-model="form.team_departments" 
              placeholder="请选择车队" 
              filterable 
              clearable 
              multiple 
              collapse-tags
              :no-data-text="'暂无数据'">
              <el-option
                v-for="item in teamList"
                :key="item.dept_id"
                :label="item.dept_name"
                :value="item.dept_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车队" prop="team_department" v-else>
            <el-select
              v-model="form.team_department"
              @change="changeTeamDepartment"
              :disabled="['detail', 'check', 'audit'].includes(curSelectedType) || 
              (curSelectedType === 'handle' && [10].includes(form.order_state) && !!form.team_departments.length)" 
              placeholder="请选择车队" filterable clearable>
              <el-option
                v-for="item in teamList"
                :key="item.dept_id"
                :label="item.dept_name"
                :value="item.dept_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="类别" prop="category">
            <tr-select-dictionaries
              v-model="form.category"
              :classKey="'乘客服务类别'"
              :placeholder="'请选择类别'"
              @change="setCategoryName"
              :disabled="curSelectedType === 'detail' || (form.order_state > 14 && curSelectedType !== 'adminEdit')">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="类型" prop="subtype">
            <tr-select-dictionaries
              v-model="form.subtype"
              :classKey="'乘客服务类型'"
              :placeholder="'请选择类型'"
              @change="setSubtypeName"
              :disabled="curSelectedType === 'detail' || (form.order_state > 14 && curSelectedType !== 'adminEdit')">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="反映人姓名" prop="call_name">
            <el-input
              placeholder="请输入反映人姓名"
              v-model="form.call_name"
              style="width: 192px"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="反映人电话" prop="call_number">
            <el-input
              placeholder="请输入反映人电话"
              v-model="form.call_number"
              style="width: 192px"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="身份证号" prop="id_card">
            <el-input
              placeholder="请输入身份证号"
              v-model="form.id_card"
              style="width: 192px"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="form.sex"
              placeholder="请选择性别"
              clearable
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
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
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 2">
          <el-form-item label="自行车号" prop="bicycle_number">
            <el-input
              placeholder="请输入自行车号"
              v-model="form.bicycle_number"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事发地点" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入事发地点"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="信访编号" prop="letter_code">
            <el-input
              v-model="form.letter_code"
              placeholder="请输入信访编号"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="初重件" prop="weight_degree">
            <el-select
              v-model="form.weight_degree"
              placeholder="请选择初重件"
              clearable
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
              <el-option label="初件" :value="1"></el-option>
              <el-option label="重件" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.weight_degree == 2">
          <el-form-item label="关联工单">
            <el-input
              v-model="order_code"
              placeholder="请输入关联工单"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)"
              @focus="openHistoricalWorkOrders">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="['add', 'copy'].includes(curSelectedType) || (curSelectedType === 'edit' && form.order_state === 1)">
          <el-form-item label="事件简述常用语">
            <el-select
              v-model="wordIds"
              @change="getWordsList"
              filterable
              multiple
              collapse-tags
              placeholder="请选择"
              style="width: 100%"
              :popper-append-to-body="false">
              <el-option
                v-for="item in commonWordsList"
                :key="item.id"
                :label="item.language"
                :value="item.language">
                <span style="float: left; max-width: 100%; overflow: hidden; text-overflow: ellipsis">
                  {{ item.language }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事件简述" prop="order_content">
            <el-input
              v-model="form.order_content"
              placeholder="请输入事件简述"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受理人员" prop="acceptance_person">
            <get-department-select
              ref="personalTree"
              v-if="dialogBool"
              v-model="form.acceptance_person"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择受理人员'"
              :isContainEmp="true"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)"
              :isExportMultiple="false">
            </get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受理时间" prop="acceptance_time">
            <el-date-picker
              v-model="form.acceptance_time"
              type="datetime"
              style="width: 192px"
              @change="changeTimeOut()"
              placeholder="请选择受理时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="is_reply">
            <el-checkbox
              v-model="form.is_reply"
              :true-label="1"
              :false-label="2"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
              是否需要回复
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="超时级别" prop="time_out">
            <el-select
              v-model="form.time_out"
              style="width: 192px"
              placeholder="请选择超时级别"
              @change="changeTimeOut()"
              clearable
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
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
              style="width: 192px"
              placeholder="请选择规定回复逾期时间"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="归档时间" prop="archiving_time">
            <el-date-picker
              v-model="form.archiving_time"
              type="month"
              style="width: 192px"
              placeholder="选择月份"
              value-format="yyyy-MM"
              :disabled="['detail', 'handle', 'check', 'audit'].includes(curSelectedType)">
            ></el-date-picker>
          </el-form-item>
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
              :disabled="curSelectedType === 'detail' || (form.order_state > 14 && curSelectedType !== 'adminEdit')"
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
              :isExportMultiple="false"
              :disabled="curSelectedType === 'detail' || (form.order_state > 14 && curSelectedType !== 'adminEdit')"
            ></get-line-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="驾驶员" prop="driver_id">
            <get-driver-select-tree
              ref="driverTree"
              v-model="form.driver_id"
              :isShowCheckbox="false"
              :placeholder="'请选择驾驶员'"
              :isExportMultiple="false"
              :disabled="curSelectedType === 'detail' || (form.order_state > 14 && curSelectedType !== 'adminEdit')"
            ></get-driver-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1" class="files-box">
          <image-file-upload
            :images="form.img_list"
            :files="form.files_list"
            :isPreview="false"
            :isShowBox="['detail', 'handle', 'check', 'audit'].includes(curSelectedType) ? false : true"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>

      <el-row v-if="form.order_affiliation == 1 && form.order_state > 9 && form.team_department">
        <el-col :span="24">
          <div class="title">车队核实情况</div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="车队核实情况" prop="handle_result">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入车队核实情况"
              v-model="form.handle_result"
              :disabled="['detail','audit', 'adminEdit'].includes(curSelectedType) || ![10,11,12].includes(form.order_state)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.order_state > 1 && !!form.handle_emp_name">
          <el-form-item label="车队核实经办人" prop="handle_emp_name">
            <el-input v-model="form.handle_emp_name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.order_state > 1 && !!form.handle_time">
          <el-form-item label="车队核实登记时间" prop="handle_time">
            <el-input v-model="form.handle_time" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="files-box">
          <image-file-upload
            :images="form.verify_img_list"
            :files="form.verify_file_list"
            :isPreview="false"
            :isShowBox="[10,11,12].includes(form.order_state)"
            @files-update-success="verifyFilesUpdateSuccess"
            @images-update-success="verifyImagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="title">处理情况</div>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="是否有责" prop="is_duty">
            <tr-select-dictionaries
              v-model="form.is_duty"
              :classKey="'乘客服务是否有责'"
              :placeholder="'请选择是否有责'"
              :disabled="!([13,14].includes(form.order_state) && !['detail', 'adminEdit'].includes(curSelectedType))"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="奖罚依据" prop="violation_according">
            <el-input
              style="width: 100%"
              v-model="form.violation_according"
              placeholder="请选择奖罚依据"
              :disabled="!([13,14].includes(form.order_state) && !['detail', 'adminEdit'].includes(curSelectedType))"
              @focus="openViolationInspectPop"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="违规类型" prop="violation_type">
            <el-input v-model="form.violation_type" disabled size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="加/减分" prop="score">
            <el-input-number
              v-model="form.score"
              style="width: 100%"
              :controls="false"
              :precision="2"
              :disabled="!([13,14].includes(form.order_state) && !['detail', 'adminEdit'].includes(curSelectedType))"
              size="mini"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.order_affiliation == 2">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入备注"
              v-model="form.remark"
              :disabled="curSelectedType === 'detail'">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="回复模板" prop="order_reply ">
            <el-select v-model="form.order_reply" :disabled="!([13,14].includes(form.order_state) && !['detail', 'adminEdit'].includes(curSelectedType))" placeholder="请选择回复模板">
              <el-option 
                v-for="item in replyTemplateList" 
                :key="item.id" 
                :label="item.content" 
                :value="item.content"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="调查及处理结果描述" prop="order_reply">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入调查及处理结果描述"
              v-model="form.order_reply"
              :disabled="['detail', 'audit', 'adminEdit'].includes(curSelectedType) || [10,11,12].includes(form.order_state)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="满意度" prop="satisfaction_degree">
            <el-select v-model="form.satisfaction_degree" :disabled="!([13,14].includes(form.order_state) && !['detail', 'adminEdit'].includes(curSelectedType))" placeholder="请选择满意度">
              <el-option label="满意" :value="1"></el-option>
              <el-option label="不满意" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && [12,13,14,15,16,17,4].includes(form.order_state)">
          <el-form-item label="是否与来电人沟通" prop="is_contact">
            <el-input v-model="form.is_contact" :disabled="!([13,14].includes(form.order_state) && !['detail', 'adminEdit'].includes(curSelectedType))" placeholder="请输入是否与来电人沟通"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!!form.apply_person">
          <el-form-item label="回复人" prop="apply_person">
            <get-department-select
              ref="handlePersonalTree"
              v-model="form.apply_person"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择回复人'"
              :isContainEmp="true"
              :disabled="true"
              :isExportMultiple="false"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!!form.actual_time">
          <el-form-item label="处理时间" prop="actual_time">
            <el-input v-model="form.actual_time" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="[4,15,16,17].includes(form.order_state) || ([5,9,12,14].includes(form.order_state) && form.manager_opinion)">
          <el-form-item label="部门领导审核意见" prop="manager_opinion">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入部门领导审核意见"
              v-model="form.manager_opinion"
              :disabled="curSelectedType === 'detail' || ![15,16].includes(form.order_state)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="[4,16,17].includes(form.order_state) || ([5,9,12,14,15,16].includes(form.order_state) && form.supervisor_opinion)">
          <el-form-item label="分管领导审核意见" prop="supervisor_opinion">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入分管领导审核意见"
              v-model="form.supervisor_opinion"
              :disabled="curSelectedType === 'detail' || form.order_state !== 17"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="files-box">
          <image-file-upload
            :images="form.apply_img_list"
            :files="form.apply_files_list"
            :isPreview="false"
            :isShowBox="[0,5,8,9,13,14].includes(form.order_state)"
            @files-update-success="applyFilesUpdateSuccess"
            @images-update-success="applyImagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>
      <el-row v-if="['edit'].includes(curSelectedType) && form.order_state === 4">
        <el-col :span="24">
          <div class="title">处理流程</div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="处理流程" prop="checked">
            <el-checkbox v-model="form.checked">发起处理流程:</el-checkbox>
          </el-form-item>
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
        @click="saveFormData(2)" 
        type="primary"
        :loading="btnLoading"
        v-if="[0,1].includes(form.order_state)">完结
      </el-button>
      <el-button 
        @click="saveFormData(0)" 
        type="primary"
        :loading="btnLoading"
        v-if="(['add', 'edit', 'copy'].includes(curSelectedType) && [0,1,4,5].includes(form.order_state)) || curSelectedType === 'adminEdit'">保存
      </el-button>
      <el-button 
        @click="saveFormData(3)" 
        type="primary"
        :loading="btnLoading"
        v-if="(['add','edit', 'copy'].includes(curSelectedType) && form.duty_departments.length > 0 && !form.team_departments.length && [0,1,5].includes(form.order_state)) ||
        (curSelectedType === 'adminEdit' && form.duty_department && !form.team_department)">
        下发
      </el-button>
      <el-button 
        @click="saveFormData(4)" 
        type="primary"
        :loading="btnLoading"
        v-if="(['add', 'edit', 'copy'].includes(curSelectedType) && form.team_departments.length > 0 && [0,1,5].includes(form.order_state)) ||
        (curSelectedType === 'handle' && [8, 9].includes(form.order_state) && form.team_departments.length > 0) ||
        (curSelectedType === 'adminEdit' && form.team_department)">
        下发到车队
      </el-button>
      <el-button 
        @click="saveFormData(7)" 
        type="primary"
        :loading="btnLoading"
        v-if="['handle', 'check', 'audit'].includes(curSelectedType) && 
        ([8,9,10,14,15,16,17].includes(form.order_state) || (form.order_state == 13 && form.team_departments.length))">
        退回
      </el-button>
      <el-button
        type="primary" :loading="btnLoading"
        v-if="curSelectedType == 'handle' && [8,9,10].includes(form.order_state)"
        @click="saveFormData(5)">
        受理
      </el-button>
      <el-button
        type="primary" :loading="btnLoading"
        v-if="curSelectedType == 'check' && [11,12,13,14].includes(form.order_state)"
        @click="saveFormData(6)">
        确认核实
      </el-button>
      <el-button
        type="primary" :loading="btnLoading"
        v-if="curSelectedType == 'audit' && [15,16,17].includes(form.order_state)"
        @click="saveFormData(8)">
        确认审核
      </el-button>
      <el-button
        type="primary" :loading="btnLoading"
        v-if="['edit'].includes(curSelectedType) && [4,13,14].includes(form.order_state) && form.checked"
        @click="saveFormData(1)">
        发起审批流程
      </el-button>
    </div>
    <div class="box-dialog">
      <historical-work-orders
        ref="historicalWorkOrders"
        :dialogBool.sync="historicalWorkOrdersShow"
        :dutyType="form.is_duty"
        @save-add="saveAddHistoricalWorkOrders"
      ></historical-work-orders>

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
import historicalWorkOrders from './historical-work-orders/index'
import imageFileUpload from '@/components/imageFileUpload/index'
import approveStep from '@/components/approve-echo/approve-step2'
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import violationInspectPop from './violation-inspect-pop'
export default {
  components: {
    historicalWorkOrders,
    imageFileUpload,
    getLineSelectTree,
    getDriverSelectTree,
    getVehicleSelectTree,
    getDepartmentSelect,
    approveStep,
    violationInspectPop
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '添加工单信息'
    },
    curSelectedType: [String],
  },
  data() {
    return {
      responsibleList: [],
      teamList: [],
      order_code: '',
      historicalWorkOrdersShow: false,
      commonWordsList: [],
      wordIds: [],
      timeoutLevel: [],
      isEcho: false,
      nodes: null,
      btnLoading: false,
      violationInspectPopShow: false,
      replyTemplateList: [],
      form: {
        source_type: '',
        order_state: 0,
        id: null,
        order_affiliation: 1,
        message_sources: '',
        order_type: '',
        call_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        duty_departments: [],
        duty_department: '',
        team_departments: [],
        team_department: '',
        category: '',
        category_name: '',
        subtype: '',
        subtype_name: '',
        call_name: '',
        call_number: '',
        id_card: '',
        sex: '',
        card_no: '',
        bicycle_number: '',
        address: '',
        letter_code: '',
        weight_degree: '',
        order_code: '',
        order_id: '',
        order_content: '',
        acceptance_person: Number(JSON.parse(getUser()).user_id),
        acceptance_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        is_reply: 2,
        time_out: '',
        overdue_time: '',
        archiving_time: formatDate(new Date(), 'yyyy-MM'),
        vehicle_id: '',
        line_id: '',
        driver_id: '',
        img_list: [],
        files_list: [],
        // 回复情况
        apply_person: '',
        actual_time: '',
        remark: '',
        order_reply: '',
        apply_img_list: [],
        apply_files_list: [],
        verify_img_list: [],
        verify_file_list: [],
        // 处理流程
        checked: false, 
        // 处理情况
        is_duty: '',
        violation_according: '',
        violation_accordings: [],
        violation_type: '',
        score: '',
        handle_result : '',
        satisfaction_degree: '',
        is_contact: '',
        handle_emp_name: '',
        handle_time: '',
        manager_opinion: '',
        supervisor_opinion: '',
      },  
      basicRules: {
        order_affiliation: [{ required: true, message: '请选择工单所属', trigger: 'change'}],
        message_sources: [{ required: true, message: '请选择信息来源', trigger: 'change'}],
        order_type: [{ required: true, message: '请选择工单类型', trigger: 'change'}],
        call_time: [{ required: true, message: '请选择事发时间', trigger: 'change'}],
        duty_departments: [{ required: true, message: '请选择责任部门', trigger: 'change'}],
        category: [{ required: true, message: '请选择类别', trigger: 'change'}],
        subtype: [{ required: true, message: '请选择类型', trigger: 'change'}],
        archiving_time: [{ required: true, message: '请选择归档时间', trigger: 'change'}],
      }
    }
  },
  watch: {
    dialogBool(bool) {
      if (!bool) {
        this.resetAllData()
      }else {
        this.$nextTick(() => {
          if(['add'].includes(this.curSelectedType)) {
            this.GetTimeOutRules()
          }
        })
      }
    },
  },
  mounted() {
    this.GetTimeOutRules()
    this.GetListCommonPhrase()
    this.GetPassengerDeptDutyList()
  },
  methods: {
    /**
     * 重置所有data中的数据
     */
    resetAllData() {
      this.order_code = ''
      this.historicalWorkOrdersShow = false
      this.isEcho = false
      this.nodes = null
      this.resetFormData()
      
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        console.log('重置表单数据',this.form)
      })
    },
    /**
     * 重置表单数据
     */
    resetFormData() {
      this.form = {
        source_type: '',
        order_state: 0,
        id: null,
        order_affiliation: 1,
        message_sources: '',
        order_type: '',
        call_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        duty_departments: [],
        duty_department: '',
        team_departments: [],
        team_department: '',
        category: '',
        category_name: '',
        subtype: '',
        subtype_name: '',
        call_name: '',
        call_number: '',
        id_card: '',
        sex: '',
        card_no: '',
        bicycle_number: '',
        address: '',
        letter_code: '',
        weight_degree: '',
        order_code: '',
        order_id: '',
        order_content: '',
        acceptance_person: Number(JSON.parse(getUser()).user_id),
        acceptance_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        is_reply: 2,
        time_out: '',
        overdue_time: '',
        archiving_time: formatDate(new Date(), 'yyyy-MM'),
        vehicle_id: '',
        line_id: '',
        driver_id: '',
        img_list: [],
        files_list: [],
        apply_person: '',
        actual_time: '',
        remark: '',
        order_reply: '',
        apply_img_list: [],
        apply_files_list: [],
        verify_img_list: [],
        verify_file_list: [],
        checked: false, 
        is_duty: '',
        violation_according: '',
        violation_accordings: [],
        violation_type: '',
        score: '',
        handle_result : '',
        satisfaction_degree: '',
        is_contact: '',
        handle_emp_name: '',
        handle_time: '',
        manager_opinion: '',
        supervisor_opinion: '',
      }
    },


    // 数据回显
    setData(data, type) {
      let info = deepCopy(data)
      for (let key in this.form) {
        if (Object.hasOwnProperty.call(info, key) && info[key] !== null) {
          this.form[key] = info[key]
        }
      }
      
      this.order_code = data.associ_order
      
      if (this.form.overdue_time) {
        this.isEcho = true
      }
      if(this.form.order_state > 6) {
        this.getReplyTemplate()
      }
      if(type === 'copy') {
        this.$refs.personalTree.onClear()
        this.form.id = null
        this.form.order_state = 0
        this.form.order_type = ''
        this.order_code = ''
        this.form.order_code = ''
        this.form.order_id = ''
        this.form.order_content = ''
        this.form.call_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.form.acceptance_person = Number(JSON.parse(getUser()).user_id)
        this.form.acceptance_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.form.is_reply = 2
      }
      console.log('回显表单数据',this.form)
    },
    // 获取回复模板
    getReplyTemplate() {
      this.$client.GetReplyTemplateList({is_default: 0}).then(res => {
        if (res.head && res.head.result === '200') {
          this.replyTemplateList = res.context || []
        } else {
          this.replyTemplateList = []
        }
      })
    },
    // 关闭弹窗
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    // 更改工单所属 清空工单类型
    changeAffiliation() {
      this.form.order_type = ''
      this.updateFlow()
    },
    // 获取责任部门和车队
    GetPassengerDeptDutyList() {
      this.$client.GetPassengerDeptDuty({}).then(res => {
        if (res.head.result == '200') {
          this.responsibleList = res.context.filter(item => !item.is_team)
          this.teamList = res.context.filter(item => item.is_team)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 打开历史表单
    openHistoricalWorkOrders() {
      this.historicalWorkOrdersShow = true
      this.$nextTick(() => {
        this.$refs.historicalWorkOrders.form.call_phone = this.form.call_number
        this.$refs.historicalWorkOrders.selectedProjectList = []
        if (this.order_code) {
          const order_code = this.order_code.split(',')
          const order_id = this.form.order_id.split(',')
          this.$refs.historicalWorkOrders.selectedProjectList = order_code.map((item, index) => ({
            id: order_id[index],
            order_code: item
          }))
        }
      })
    },
    // 保存选择历史工单
    saveAddHistoricalWorkOrders(row) {
      this.form.order_id = row.map(item => item.id).toString()
      this.order_code = row.map(item => item.order_code).toString()
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
    // 选择常用语列表
    getWordsList(list) {
      let info = ''
      list.forEach(item => {
        info += item
      })
      this.form.order_content += info
      this.wordIds = []
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
    // 车辆选择
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])
      } else {
        this.form.line_id = ''
        setTimeout(() => {
          this.$refs.lineTree.onClear()
        }, 60)
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
    // 工单信息上传图片
    imagesUpdateSuccess(imageList) {
      this.form.img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 工单信息上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 回复情况上传图片
    applyImagesUpdateSuccess(imageList) {
      this.form.apply_img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 回复情况上传文件
    applyFilesUpdateSuccess(filesList) {
      this.form.apply_files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 核实情况上传文件
    verifyFilesUpdateSuccess(filesList) {
      this.form.verify_file_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 核实情况上传图片
    verifyImagesUpdateSuccess(imageList) {
      this.form.verify_img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 更新流程
    updateFlow() {
      if (this.form.checked) {
        this.$refs.approveStep.loadData()
      }
    },
    // 选择类别
    setCategoryName(val) {
      this.form.category_name = val ? val.c_name : ''
    },
    // 选择类型
    setSubtypeName(val) {
      this.form.subtype_name = val ? val.c_name : ''
    },
    // 选择车队
    changeTeamDepartment(val) {
      if(val) {
        this.form.team_departments = [val]
      }else {
        this.form.team_departments = []
      }
    },
    saveFormData(type) {
      let params = {
        operation_type: type,
        form_data: Object.assign({}, this.form),
        step_data: null
      }
      // 0-保存 1-发起审批流程 2-完结 3-下发至部门 4-下发至车队 5-受理 6-核实 7-退回 8-审核
      if(this.curSelectedType == 'add') {
        delete params.form_data.id
      }
      if (!type) {
        this.$emit('update:dialogLoading', true)
        this.$emit('save-info', params, type)
      }else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if(type == 1) { //发起审批
              params.step_data = this.nodes
            }
            if (type == 2) { //完结 
              params.form_data.apply_person = Number(JSON.parse(getUser()).user_id)
              params.form_data.actual_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            // 部门受理时清空车队数据
            if(type == 5 && [8,9].includes(this.form.order_state)) {
              params.form_data.team_departments = []
              params.form_data.team_department = ''
            }
            // 车队受理、核实》》 10.车队待受理、11.车队核实中、12.车队处理中_部门退回、必须填写车队核实情况
            if(((type == 6 && [11,12].includes(this.form.order_state)) || (type == 7 && [10].includes(this.form.order_state))) && !this.form.handle_result) {
              this.$message({
                showClose: true,
                message: '请填写车队核实情况',
                type: 'error'
              })
              return false
            }
            //核实 》》11.车队核实中、12.车队处理中_部门退回、和诗人、核实时间赋值
            if(type == 6 && [11,12].includes(this.form.order_state)) {
              params.form_data.handle_person = Number(JSON.parse(getUser()).user_id)
              params.form_data.handle_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            
            // 退回和部门核实必须填写处理情况
            if((type == 6 && [13,14].includes(this.form.order_state) && !this.form.order_reply) || 
            (type == 7 && [8,9,13,14].includes(this.form.order_state) && !this.form.order_reply)) {
              this.$message({
                showClose: true,
                message: '请填写调查及处理结果描述',
                type: 'error'
              })
              return false
            }
            // 检查类型和类别是否为待定状态
            if((type == 6 || type == 2) && ['待定', '待定'].includes(this.form.category_name, this.form.subtype_name)) {
              this.$message({
                showClose: true,
                message: '类型和类别不能为待定，请确认后重新选择',
                type: 'error'
              })
              return false
            }
            if(type == 7 && [15,16].includes(this.form.order_state) && this.curSelectedType == 'audit' && !this.form.manager_opinion) {
              this.$message({
                showClose: true,
                message: '部门领导审核意见不能为空',
                type: 'error'
              })
              return false
            }
            if(type == 7 && this.form.order_state == 17 && this.curSelectedType == 'audit' && !this.form.supervisor_opinion) {
              this.$message({
                showClose: true,
                message: '分管领导审核意见不能为空',
                type: 'error'
              })
              return false
            }
            this.$emit('update:dialogLoading', true)
            this.$emit('save-info', params, type)
          } else {
            return false
          }
        })
      }
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
      this.form.violation_type = violation_type.toString()
      this.violationInspectPopShow = false
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.form-box{
  max-height: 500px;
  overflow-y: auto;
  .title{
    font-size: 14px;
    color: #409EFF;
    font-weight: bold;
    margin-bottom: 10px;
    padding-left: 5px;
    border-left: 6px solid #409EFF;
  }
}
</style>