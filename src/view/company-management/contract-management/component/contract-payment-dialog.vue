<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="700px"
    center
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="缴费人:" prop="user_name">
            <el-input v-model="form.user_name" placeholder="请输入缴费人" clearable></el-input>
          </el-form-item>
          <el-form-item label="缴费日期:" prop="post_date">
            <el-date-picker
              v-model="form.post_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="请选择缴费日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
         <div class="show-flex-box-r">
          <el-form-item label="缴费金额:" prop="fee">
            <el-input v-model="form.fee" placeholder="请输入缴费金额" oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.fee = $event.target.value" clearable></el-input>
          </el-form-item>
          <el-form-item label="本年缴费是否结清:" prop="finish">
            <el-radio-group v-model="form.finish">
              <el-radio :label="1"><span style="color:#606266">是</span> </el-radio>
              <el-radio :label="2"><span style="color:#606266">否</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="show-flex-box-r" style="justify-content: flex-end;margin-bottom: 15px;">
          <span style="margin-right: 30px; color: #909399">注意：选择“是”之后今年的缴费提醒将不再提醒。</span>
        </div>
        <div>
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              maxlength="100"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </div>

      </el-form>
    </div>

    <span slot="footer" class="dialog-footer show-flex-box-r" style="justify-content: flex-end;">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "合同缴费",
    },
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        // id: '',
        main_id: '',
        // user_id: '',
        user_name: '',
        post_date: '',
        fee: '',
        finish: 1,
        remark: ''
      },
      basicRules: {
        user_name: [
          { required: true, message: "请输入缴费人", trigger: "change" },
        ],
        post_date: [
          { required: true, message: "请选择缴费日期", trigger: "change" },
        ],
        fee: [
          { required: true, message: "请输入缴费金额", trigger: "change" },
        ],
        finish: [
          { required: true, message: "请选择本年缴费是否结清", trigger: "change" },
        ]
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.setData();
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置缴费日期为当天
    setData() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.post_date = Y + '-' + M + '-' + D
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          
          this.$emit("save-payment", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 220px;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 180px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 180px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 500px;
}
</style>

