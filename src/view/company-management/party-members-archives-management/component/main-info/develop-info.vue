<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="180px"
    > 
      <div class="show-flex-box-r">
        <el-form-item label="向组织汇报日期:" prop="ex_report_time">
          <el-date-picker
            v-model="formData.ex_report_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考察日期:" prop="ex_check_time">
          <el-date-picker
            v-model="formData.ex_check_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考察组织:" prop="ex_check_name">
          <el-input v-model="formData.ex_check_name" placeholder="请输入考察组织" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="确认发展对象党小组讨论日期:" prop="ex_talk_time">
          <el-date-picker
            v-model="formData.ex_talk_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认发展对象党支部书记:" prop="ex_secretary_time">
          <!-- <el-input v-model="formData.ex_secretary_time" placeholder="请输入确认发展对象党支部书记" clearable :disabled="curChangeType == 'detail'"></el-input> -->
          <el-date-picker
            v-model="formData.ex_secretary_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培养联系人:" prop="ex_contact_name">
          <el-input v-model="formData.ex_contact_name" placeholder="请输入培养联系人" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="集中培训日期:" prop="ex_train_time">
          <el-date-picker
            v-model="formData.ex_train_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发展党员上级预审日期:" prop="ex_expect_check_time">
          <el-date-picker
            v-model="formData.ex_expect_check_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支部大会通过入党日期:" prop="ex_join_time">
          <el-date-picker
            v-model="formData.ex_join_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="发展党员上级组织谈话日期:" prop="ex_talk_time_up">
          <el-date-picker
            v-model="formData.ex_talk_time_up"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发展党员谈话人:" prop="ex_talk_name">
          <el-input v-model="formData.ex_talk_name" placeholder="请输入发展党员谈话人" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="党员转正上级审批日期:" prop="ex_check_time_up">
          <el-date-picker
            v-model="formData.ex_check_time_up"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="党员转正申请日期:" prop="ex_apply_time">
          <el-date-picker
            v-model="formData.ex_apply_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="党员转正党小组讨论日期:" prop="ex_team_talk_time">
          <el-date-picker
            v-model="formData.ex_team_talk_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="党员转正支部大会讨论日期:" prop="ex_branch_talk_time">
          <el-date-picker
            v-model="formData.ex_branch_talk_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正上级审批组织:" prop="ex_check_name_up">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正上级审批组织"
            v-model="formData.ex_check_name_up"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="积极分子受组织教育情况:" prop="ex_edu_situation">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入积极分子受组织教育情况"
            v-model="formData.ex_edu_situation"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="向组织汇报内容:" prop="ex_content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入向组织汇报内容"
            v-model="formData.ex_content"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_zzhb_files'" :filesList="formData.ex_zzhb_files" :acceptType="'.jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx'" :maxUpLoadSize="10" :maxUpLoadNum="5" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
       <div>
        <el-form-item label="社会工作情况:" prop="ex_work_situation">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入社会工作情况"
            v-model="formData.ex_work_situation"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="考察结果:" prop="ex_check_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入考察结果"
            v-model="formData.ex_check_result"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党内外群众意见:" prop="ex_public_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党内外群众意见"
            v-model="formData.ex_public_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_rec_files'" :filesList="formData.ex_rec_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="确定发展对象小组意见:" prop="ex_team_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入确定发展对象小组意见"
            v-model="formData.ex_team_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_qdfzdx_files'" :filesList="formData.ex_qdfzdx_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="确定发展对象支委会意见:" prop="ex_board_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入确定发展对象支委会意见"
            v-model="formData.ex_board_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_fzdxzwh_files'" :filesList="formData.ex_fzdxzwh_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="发展对象政审结果:" prop="ex_careful_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入发展对象政审结果"
            v-model="formData.ex_careful_result"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_fzdxzsjg_files'" :filesList="formData.ex_fzdxzsjg_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="集中培训结果:" prop="ex_train_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入集中培训结果"
            v-model="formData.ex_train_result"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="发展党员上级预审结果:" prop="ex_expect_check_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入发展党员上级预审结果"
            v-model="formData.ex_expect_check_result"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_ysjgfj_files'" :filesList="formData.ex_ysjgfj_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="发展党员支部大会讨论结果:" prop="ex_talk_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入发展党员支部大会讨论结果"
            v-model="formData.ex_talk_result"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正支部委员会审查情况:" prop="ex_board_check_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正支部委员会审查情况"
            v-model="formData.ex_board_check_result"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_zzzwyhsc_files'" :filesList="formData.ex_zzzwyhsc_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正支部大会意见:" prop="ex_positive_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正支部大会意见"
            v-model="formData.ex_positive_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <div style="width: 825px;">
            <multiple-files-upload :contentType="'ex_zzzbdhyj_files'" :filesList="formData.ex_zzzbdhyj_files" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正支部大会讨论结果:" prop="ex_positive_talk_result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正支部大会讨论结果"
            v-model="formData.ex_positive_talk_result"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正上级审批意见:" prop="ex_positive_check_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正上级审批意见"
            v-model="formData.ex_positive_check_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正党小组意见:" prop="ex_positive_team_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正党小组意见"
            v-model="formData.ex_positive_team_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员转正党支部争求党员和群众意见:" prop="ex_positive_board_opinion">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入党员转正党支部争求党员和群众意见"
            v-model="formData.ex_positive_board_opinion"
            style="margin-bottom: 5px;"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import multipleFilesUpload from "@/components/multiple-files-upload";
export default {
  components: {
    multipleFilesUpload
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {
        ex_report_time: "",
        ex_check_time: "",
        ex_check_name: "",
        ex_talk_time: "",
        ex_secretary_time: "",
        ex_contact_name: "",
        ex_train_time: "",
        ex_expect_check_time: "",
        ex_join_time: "",
        ex_talk_time_up: "",
        ex_talk_name: "",
        ex_check_time_up: "",
        ex_apply_time: "",
        ex_team_talk_time: "",
        ex_branch_talk_time: 0,
        ex_check_name_up: "",
        ex_edu_situation: "",

        ex_content: "",
        ex_zzhb_files: [],

        ex_work_situation: "",

        ex_public_opinion: "",
        ex_rec_files: [],

        ex_team_opinion: "",
        ex_qdfzdx_files: [],

        ex_board_opinion: "",
        ex_fzdxzwh_files: [],

        ex_careful_result: "",
        ex_fzdxzsjg_files: [],
        
        ex_talk_result: "",
        
        ex_train_result: "",

        ex_expect_check_result: "",
        ex_ysjgfj_files: [],

        ex_check_result: "",

        ex_board_check_result: "",
        ex_zzzwyhsc_files: [],

        ex_positive_opinion: "",
        ex_zzzbdhyj_files: [],

        ex_positive_talk_result: "",
        ex_positive_check_opinion: "",
        ex_positive_team_opinion: "",
        ex_positive_board_opinion: "",
      },
      rules: {},
    };
  },
  methods: {
    // 初始化数据
    resetData() {
      this.$refs["formData"].resetFields();
    },
    uploadUpdateSuccess(filesList,type) {
      this.formData[type] = filesList;
      console.log(this.formData[type])
    },
    // 数据回显
    setData(val) {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key]
        }
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 157px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 157px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 157px;
}

.base-info /deep/ .el-textarea {
  width: 830px;
}
.base-info /deep/ .el-form-item__label {
  font-size: 12px !important;
}

</style>
