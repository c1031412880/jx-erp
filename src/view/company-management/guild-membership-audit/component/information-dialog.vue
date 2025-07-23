<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
    fullscreen
    center>
    <div class="el-dialog-div">
      <guild-membership-audit
        :isModel="true"
        :modelType="50"
        :objectId="form.id"
      >
      </guild-membership-audit>
    </div>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import guildMembershipAudit  from '../../../main-Interface-entrance/news-details'
export default {
  components: {
    guildMembershipAudit
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        id: 0,
      },
      basicRules: {
        c_name: [
          { required: true, message: "请输入岗位名称", trigger: "change" },
        ],
        c_remark: [
          { required: true, message: "请填写岗位描述", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setData(val) {
      console.log(val)
      if(!!val) {
        this.form.id = val.id
      }
    },
    updatePlaybill(formName) {
      //  this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     let info = {...this.form};
      //     this.$emit("save-add-edit-job", info);
      //   } else {
      //     return false;
      //   }
      // });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

