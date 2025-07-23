<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="500px"
    append-to-body
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item :label="title" prop="c_name">
          <div class="show-flex-box-r">
            <el-select v-model="form.model" placeholder="请选择">
              <el-option label="增加" :value="1"></el-option>
              <el-option label="减少" :value="2"></el-option>
            </el-select>
            <el-input v-model="form.value"  oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.value = $event.target.value" placeholder="请输入" style="width: 130px;margin-left: 10px"> <template slot="append">天</template></el-input>
          </div>
          
        </el-form-item>
        <el-form-item label="有效时间:" prop="start_date">
          <el-date-picker
            v-model="form.start_date"
            type="date"
            placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-date-picker
            v-model="form.end_date "
            type="date"
            placeholder="选择结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="理由:" prop="reason">
          <el-input
            v-model="form.reason" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入理由"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini">确 定</el-button>
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
      default: "修改年假余额",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        user_id: "",
        model: 1,
        value: "",
        start_date: "",
        end_date: "",
        reason: "",
      },
      basicRules: {
        value: [
          { required: true, message: "请输入天数", trigger: "change" },
        ],
        start_date: [
          { required: true, message: "请选择有效时间", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请输入理由", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
          let year = new Date().getFullYear()
          this.form.start_date = year + '-01-01'
          this.form.end_date = year + 1 + '-01-01'
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if(!this.form.end_date) {
          this.$message.error('请选择有效结束时间')
          return false
        }
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div /deep/ .el-input {
//   width: 420px;
// }
.el-dialog-div /deep/ .el-date-editor {
  width: 250px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 140px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 140px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 280px;
}

.el-dialog__wrapper /deep/ .el-dialog__header{
  padding: 20px !important;
}
</style>

