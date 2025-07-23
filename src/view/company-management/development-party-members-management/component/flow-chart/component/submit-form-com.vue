<template>
  <div class="submit-form-com-box">
    <el-form :model="form" ref="form" label-width="100px" size="mini">
      <div v-if="nodeType == 1">
        <el-form-item label="接收组织:">
          <!-- <el-input v-model="form[nodeType].ex_organ_id" placeholder="请输入党组织名称"></el-input> -->
          <get-party-org-select-tree
            ref="getPartyOrgSelectTree"
            :placeholder="'选择党组织'"
            :isShowCheckbox="false"
            v-model="form[nodeType].ex_organ_id"
            :isExportMultiple="false"
            :isCheckStrictly="false"
            :width="'180'"
            :disabled="false"
          >
          </get-party-org-select-tree>

        </el-form-item>
        <el-form-item label="申请时间:">
          <el-date-picker
            v-model="form[nodeType].ex_apply_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="入党申请书" :value="11"></el-option>
          </el-select>
        </el-form-item>
        <!-- :filesList="form[nodeType].ex_apply_files" -->
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_apply_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_apply_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 2">
        <el-form-item label="谈话人员:">
          <el-input v-model="form[nodeType].ex_talk_name" placeholder="请输入谈话人员"></el-input>
        </el-form-item>
        <el-form-item label="谈话时间:">
          <el-date-picker
            v-model="form[nodeType].ex_talk_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="个人自传" :value="21"></el-option>
            <el-option label="谈话记录" :value="22"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_talk_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_talk_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 3">
        <el-form-item label="决定时间:">
          <el-date-picker
            v-model="form[nodeType].ex_confirm_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="推荐推优材料" :value="31"></el-option>
            <el-option label="会议记录" :value="32"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_rec_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_rec_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
           <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 4">
        <el-form-item label="备案时间:">
          <el-date-picker
            v-model="form[nodeType].ex_record_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="备案报告" :value="41"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_ba_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_ba_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 5">
        <el-form-item label="指定培养联系人:">
          <el-input v-model="form[nodeType].ex_assign_name" placeholder="请输入谈话人员"></el-input>
        </el-form-item>
        <el-form-item label="指定时间:">
          <el-date-picker
            v-model="form[nodeType].ex_assign_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 6">
        <el-form-item label="确认时间:">
          <el-date-picker
            v-model="form[nodeType].ex_inspect_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="思想汇报" :value="61"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_kc_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_kc_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 7">
        <el-form-item label="确认时间:">
          <el-date-picker
            v-model="form[nodeType].ex_object_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="会议记录" :value="71"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_qdfz_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_qdfz_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <!-- 2022/1/7 对到这了  -->
      <div v-if="nodeType == 8">
        <el-form-item label="公示时间:">
          <el-date-picker
            v-model="form[nodeType].ex_public_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="备案报告" :value="81"></el-option>
            <el-option label="发展对象公示材料" :value="82"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_bsj_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_bsj_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 9">
        <el-form-item label="入党介绍人:">
          <el-input v-model="form[nodeType].ex_introduce_name" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <div v-if="nodeType == 10">
        <el-form-item label="培训开始时间:">
          <el-date-picker
            v-model="form[nodeType].ex_train_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="发展对象集中培训合格证书/高知识培训积分表" :value="101"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_kzjzpx_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_kzjzpx_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 11">
        <el-form-item label="审查时间:">
          <el-date-picker
            v-model="form[nodeType].ex_check_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="政审结论材料" :value="111"></el-option>
            <el-option label="发展对象部门联审材料" :value="112"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_zzsc_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_zzsc_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 12">
        <el-form-item label="开会时间:">
          <el-date-picker
            v-model="form[nodeType].ex_meeting_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="会议记录" :value="121"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_zbwyhsc_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_zbwyhsc_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 13">
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="发展对象预审材料" :value="131"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_sjdwys_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_sjdwys_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 14">
        <el-form-item label="填写时间:">
          <el-date-picker
            v-model="form[nodeType].ex_write_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="入党自愿书" :value="141"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_rdzys_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_rdzys_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 15">
        <el-form-item label="大会时间:">
          <el-date-picker
            v-model="form[nodeType].ex_discuss_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="会议记录" :value="151"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_zbtldh_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_zbtldh_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 16">
        <el-form-item label="谈话人员:">
          <el-input v-model="form[nodeType].ex_talk_name_up" placeholder="请输入谈话人员"></el-input>
        </el-form-item>
        <el-form-item label="谈话时间:">
          <el-date-picker
            v-model="form[nodeType].ex_talk_time_up"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 17">
        <el-form-item label="审批时间:">
          <el-date-picker
            v-model="form[nodeType].ex_audit_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 18">
        <el-form-item label="备案时间:">
          <el-date-picker
            v-model="form[nodeType].ex_record_time_up"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 19">
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="思想汇报" :value="191"></el-option>
            <el-option label="中国共产党党员基本情况登记表" :value="192"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_brdzb_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_brdzb_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 20">
        <el-form-item label="宣誓时间:">
          <el-date-picker
            v-model="form[nodeType].ex_oath_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 21">
        <el-form-item label="开始考察时间:">
          <el-date-picker
            v-model="form[nodeType].ex_start_inspect_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 22">
        <el-form-item label="提出转正时间:">
          <el-date-picker
            v-model="form[nodeType].ex_positive_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="转正申请书" :value="221"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_zzsq_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_zzsq_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 23">
        <el-form-item label="大会时间:">
          <el-date-picker
            v-model="form[nodeType].ex_discuss_time_up"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文档类型:">
          <el-select v-model="form[nodeType].type" clearable placeholder="请选择">
            <el-option label="个人自传" :value="231"></el-option>
            <el-option label="谈话记录" :value="232"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:">
          <div style="width: 180px;">
            <multiple-files-upload
              :contentType="'ex_tldh_files'"
              :acceptType="'.pdf'"
              :maxUpLoadSize="100"
              :filesList="filterFilesList(form[nodeType].ex_tldh_files,form[nodeType].type)"
              :documentType="form[nodeType].type"
              @upload-update-success="uploadUpdateSuccess"
              @delete-success="deleteSuccess"
            ></multiple-files-upload>
          </div>
          <!-- <span v-else style="color: #e6a23c">请先选择要上传的文档类型</span> -->
        </el-form-item>
      </div>
      <div v-if="nodeType == 24">
        <el-form-item label="提交材料时间:">
          <el-date-picker
            v-model="form[nodeType].ex_submit_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-if="nodeType == 25">
        <el-form-item label="材料归档时间:">
          <el-date-picker
            v-model="form[nodeType].ex_archive_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
import multipleFilesUpload from "../../files-upload";
export default {
  components: {
    getPartyOrgSelectTree,
    multipleFilesUpload
  },
  props:{
    nodeType:{
      type:[String,Number],
      default: 1
    }
  },
  mounted() {},
  data() {
    return {
      form:{
        '1':{
          ex_organ_id :'',
          ex_apply_time: '',
          ex_apply_files: [],
          type: '',
        },
        '2':{
          ex_talk_name :'',
          ex_talk_time: '',
          ex_talk_files: [],
          type: '',
        },
        '3':{
          ex_confirm_time :'',
          ex_rec_files: [],
          type: '',
        },
        '4':{
          ex_record_time :'',
          ex_ba_files: [],
          type: '',
        },
        '5':{
          ex_assign_name :'',
          ex_assign_time: '',
        },
        '6':{
          ex_inspect_time :'',
          ex_kc_files: [],
          type: '',
        },
        '7':{
          ex_object_time :'',
          ex_qdfz_files: [],
          type: '',
        },
        '8':{
          ex_public_time :'',
          ex_bsj_files: [],
          type: '',
        },
        '9':{
          ex_introduce_name :'',
        },
        '10':{
          ex_train_time :'',
          ex_kzjzpx_files: [],
          type: '',
        },
        '11':{
          ex_check_time :'',
          ex_zzsc_files: [],
          type: '',
        },
        '12':{
          ex_meeting_time :'',
          ex_zbwyhsc_files: [],
          type: '',
        },
        '13':{
          ex_sjdwys_files: [],
          type: '',
        },
        '14':{
          ex_write_time: '',
          ex_rdzys_files: [],
          type: '',
        },
        '15':{
          ex_discuss_time :'',
          ex_zbtldh_files: [],
          type: '',
        },
        '16':{
          ex_talk_name_up :'',
          ex_talk_time_up: '',
        },
        '17':{
          ex_audit_time :'',
        },
        '18':{
          ex_record_time_up :'',
        },
        '19':{
          ex_brdzb_files: [],
          type: '',
        },
        '20':{
          ex_oath_time :'',
        },
        '21':{
          ex_start_inspect_time :'',
        },
        '22':{
          ex_positive_time :'',
          ex_zzsq_files: [],
          type: '',
        },
        '23':{
          ex_discuss_time_up :'',
          ex_tldh_files: [],
          type: '',
        },
        '24':{
          ex_submit_time :'',
        },
        '25':{
          ex_archive_time :'',
        },
        
      },
      
    };
  },
  watch: {},
  methods: {
    uploadUpdateSuccess(filesObj,contentType) {
      filesObj.step = this.form[this.nodeType].type
      this.form[this.nodeType][contentType].push(filesObj)

      console.log(this.nodeType ,this.form[this.nodeType][contentType],contentType)
    },
    deleteSuccess(filesObj,contentType) {
      this.form[this.nodeType][contentType].forEach((item,index) =>{
        if(filesObj.id == item.id) {
          this.form[this.nodeType][contentType].splice(index, 1)
        }
      })
    },
    filterFilesList(filesList, type) {
      let newFilesList = [];
      if(!!type && !!filesList) {
        filesList.forEach(element => {
          if(element.step == type) {
            newFilesList.push(element)
          }
        });
      }else{
        newFilesList = [...filesList]
      }
      
      return newFilesList
    }
  },
};
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.submit-form-com-box /deep/ .el-date-editor {
  width: 185px;
}
.submit-form-com-box /deep/.el-select,.el-select--mini {
  width: 185px;
}
.submit-form-com-box /deep/ .el-input,.el-input--mini{
  width: 185px;
}
</style>