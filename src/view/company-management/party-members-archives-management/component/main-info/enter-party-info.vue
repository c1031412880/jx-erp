<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="170px"
    >
      <div class="show-flex-box-r">
        <!-- 入党时的 -->
        <el-form-item label="学历:" prop="ex_top_education">
          <el-input v-model="formData.ex_top_education" placeholder="请输入学历" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="入党时工作岗位:" prop="ex_position_name">
          <el-input v-model="formData.ex_position_name" placeholder="请输入入党时工作岗位" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <!-- 入党时的 -->
        <el-form-item label="专业技术职务级别:" prop="ex_position_leave">
          <tr-select-dictionaries v-model="formData.ex_position_leave" :classKey="'专业技术职务级别'" :placeholder="'专业技术职务级别'" :disabled="curChangeType == 'detail'"></tr-select-dictionaries>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="入党时一线情况:"  prop="ex_frontline">
          <tr-select-dictionaries v-model="formData.ex_frontline" :classKey="'入党时一线情况'" :placeholder="'入党时一线情况'" :disabled="curChangeType == 'detail'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="入党时新社会阶层:"  prop="ex_stratum">
          <tr-select-dictionaries v-model="formData.ex_stratum" :classKey="'入党时新社会阶层'" :placeholder="'入党时新社会阶层'" :disabled="curChangeType == 'detail'"></tr-select-dictionaries>
        </el-form-item>
         <el-form-item label="申请入党时间:" prop="ex_request">
          <el-date-picker
            v-model="formData.ex_request"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="为入党积极分子日期:" prop="ex_activist_date">
          <el-date-picker
            v-model="formData.ex_activist_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培养联系人姓名:" prop="ex_join_contact_name">
          <el-input v-model="formData.ex_join_contact_name" placeholder="请填培养联系人姓名" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="列为发展对象日期:" prop="ex_object_date">
          <el-date-picker
            v-model="formData.ex_object_date"
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
        <el-form-item label="入党介绍人:" prop="ex_introducer">
          <el-input v-model="formData.ex_introducer" placeholder="请输入入党介绍人" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="发展党员上级党委预审日期:" prop="ex_qualification_date">
          <el-date-picker
            v-model="formData.ex_qualification_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支部大会收预备党员日期:" prop="ex_member_date">
          <el-date-picker
            v-model="formData.ex_member_date"
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
         <el-form-item label="发展党员支部大会结果:" prop="ex_join_talk_result">
            <el-radio-group v-model="formData.ex_join_talk_result" :disabled="curChangeType == 'detail'" style="width: 160px;">
              <el-radio :label="'1'"><span style="color:#606266">通过</span></el-radio>
              <el-radio :label="'2'"><span style="color:#606266">不通过</span> </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入党时所在支部:" prop="ex_branch">
            <el-input v-model="formData.ex_branch" placeholder="请输入入党时所在支部" clearable style="width: 510px;" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <!-- 有重复字段 -->
        <el-form-item label="发展党员上级组织谈话日期:" prop="ex_join_talk_time_up">
          <el-date-picker
            v-model="formData.ex_join_talk_time_up"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发展党员谈话人姓名:" prop="ex_join_talk_name">
          <el-input v-model="formData.ex_join_talk_name" placeholder="请输入发展党员谈话人姓名" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="上级党委审批日期:" prop="ex_expect_check_date">
          <el-date-picker
            v-model="formData.ex_expect_check_date"
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
        <el-form-item label="入党类型:" prop="ex_join_type">
          <el-input v-model="formData.ex_join_type" placeholder="请输入入党类型" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
         <el-form-item label="党员转正申请日期:" prop="ex_positive_request">
          <el-date-picker
            v-model="formData.ex_positive_request"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预备党员转正情况:" prop="ex_positive_content">
          <tr-select-dictionaries v-model="formData.ex_positive_content" :classKey="'预备党员转正情况'" :placeholder="'预备党员转正情况'" :disabled="curChangeType == 'detail'"></tr-select-dictionaries>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="预备期满支部讨论大会时间:" prop="ex_join_talk_time">
          <el-date-picker
            v-model="formData.ex_join_talk_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转正日期:" prop="ex_become_date">
          <el-date-picker
            v-model="formData.ex_become_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="党员转正上级党委审批日期:" prop="ex_check_date">
          <el-date-picker
            v-model="formData.ex_check_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {
        ex_top_education: "",
        ex_position_name: "",
        ex_position_leave: "",
        ex_frontline: "",
        ex_stratum: "",
        ex_request: "",
        ex_activist_date: "",
        ex_join_contact_name: "",
        ex_object_date: "",
        ex_introducer: "",
        ex_qualification_date: "",
        ex_member_date: "",
        ex_join_talk_result: "",
        ex_branch: "",
        ex_join_talk_time_up: "",
        ex_join_talk_name: "",
        ex_expect_check_date: "",
        ex_join_type: "",
        ex_positive_request: "",
        ex_positive_content: "",
        ex_join_talk_time: "",
        ex_become_date: "",
        ex_check_date: "",
      },
      rules: {},
    };
  },
  methods: {
    // 初始化数据
    resetData() {
      this.$refs["formData"].resetFields();
    },
    // 数据回显
    setData(val) {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
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
  width: 167px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 167px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 167px;
}

.base-info /deep/ .el-textarea {
  width: 600px;
}
.base-info /deep/ .el-form-item__label {
  font-size: 12px !important;
}

</style>
